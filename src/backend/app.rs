use std::{collections::HashMap, path::PathBuf};

use regex::Regex;
use swc_common::{FileName, SourceMap, SourceMapper};
use swc_ecma_ast::{CallExpr, Lit, VarDecl};

use crate::parsing_utils::{self, LineLoc};

#[derive(PartialEq, Debug)]
pub struct RouteWithHandler {
    pub base_url: String,
    pub handler_source_path: PathBuf,
    pub line_loc: LineLoc,
}

impl RouteWithHandler {
    pub fn scrape(source: String) -> anyhow::Result<impl Iterator<Item = RouteWithHandler>> {
        let source_map = SourceMap::default();
        let source_file = source_map.new_source_file(FileName::Anon, source);
        let mut parser = parsing_utils::default_parser(&source_file);

        let module = parsing_utils::get_module(&mut parser, &source_map)?;

        let mut route_defs: HashMap<_, _> = module
            .body
            .iter()
            .filter_map(|module_item| module_item.as_stmt()?.as_expr()?.expr.as_call())
            .filter_map(|call_expr| {
                let route_def = get_route_definition(call_expr, &source_map)?;
                let base_url = route_def.base_url;
                let line_loc = route_def.line_loc;

                Some((route_def.handler_name, (base_url, line_loc)))
            })
            .collect();

        let var_decls = parsing_utils::get_commonjs_module_var_decls(module);

        let handlers =
            var_decls.filter_map(move |var_decl| get_imported_handler(&var_decl, &source_map));

        let routes = handlers.into_iter().filter_map(move |handler| {
            let (base_url, line_loc) = route_defs.remove(&handler.name)?;

            Some(RouteWithHandler {
                base_url,
                handler_source_path: handler.source_path,
                line_loc,
            })
        });

        Ok(routes)
    }
}

#[derive(PartialEq, Debug)]
struct RouteDefinition {
    base_url: String,
    handler_name: String,
    line_loc: LineLoc,
}

fn get_route_definition(call_expr: &CallExpr, source_map: &SourceMap) -> Option<RouteDefinition> {
    let callee_span = call_expr.callee.as_expr()?.as_member()?.span;
    let called_function_snippet = source_map.span_to_snippet(callee_span).ok()?;
    let line_loc = parsing_utils::line_loc_from_span(callee_span, source_map);

    if called_function_snippet != "app.use" {
        return None;
    }

    let args = &call_expr.args;

    let route = match args.first().and_then(|expr| expr.expr.as_lit())? {
        Lit::Str(str_literal) => str_literal.value.to_string(),
        _ => return None,
    };

    let callback = args.last().and_then(|expr| expr.expr.as_call())?;
    let handler_name = callback.callee.as_expr()?.as_ident()?.sym.to_string();

    Some(RouteDefinition {
        base_url: route,
        handler_name,
        line_loc,
    })
}

#[derive(PartialEq, Debug)]
struct Handler {
    name: String,
    source_path: PathBuf,
}

fn get_imported_handler(var_decl: &VarDecl, source_map: &SourceMap) -> Option<Handler> {
    lazy_static::lazy_static! {
        static ref ROUTE_IMPORT_RE: Regex = Regex::new(r#"(\w+)\s?=\s?require\(['"](\./src/routes/.*)['"]\)"#).unwrap();
    }

    let var_decl_snippet = source_map.span_to_snippet(var_decl.span).ok()?;
    let captures = ROUTE_IMPORT_RE.captures(&var_decl_snippet)?;

    let import_name = captures.get(1)?.as_str().to_owned();
    let import_path = captures.get(2)?.as_str().to_owned();

    Some(Handler {
        name: import_name,
        source_path: import_path.into(),
    })
}

#[cfg(test)]
mod tests {
    use crate::parsing_utils::testing_utils;

    use super::*;

    fn get_first_call_expr(source: &str) -> (CallExpr, SourceMap) {
        let source_map = SourceMap::default();
        let source_file = source_map.new_source_file(FileName::Anon, source.into());
        let mut parser = parsing_utils::default_parser(&source_file);

        let module = parsing_utils::get_module(&mut parser, &source_map).unwrap();

        (
            module
                .body
                .into_iter()
                .find_map(|module_item| module_item.stmt()?.expr()?.expr.call())
                .unwrap(),
            source_map,
        )
    }

    #[test]
    fn getting_an_imported_route_handler() {
        let source = r#"
const causalRoutes = require("./src/routes/causalRoutes");
"#;

        let (import, source_map) = testing_utils::get_first_var_decl_commonjs(source);

        let route_handler = get_imported_handler(&import, &source_map).unwrap();

        assert_eq!(
            route_handler,
            Handler {
                name: "causalRoutes".into(),
                source_path: "./src/routes/causalRoutes".into(),
            }
        );
    }

    #[test]
    fn filtering_imports_that_dont_require_from_local_src_routes_dir() {
        let source = r#"
const startListener = require("./src/utils/startListener");
"#;

        let (import, source_map) = testing_utils::get_first_var_decl_commonjs(source);

        let route_name = get_imported_handler(&import, &source_map);

        assert_eq!(route_name, None);
    }

    #[test]
    fn getting_app_route_and_callback_from_app_use_call() {
        let source = r#"
app.use("/api/analysis", auth0, analysisRoutes({ query }));
"#;

        let (call_expr, source_map) = get_first_call_expr(source);

        let route_and_cb = get_route_definition(&call_expr, &source_map).unwrap();

        assert_eq!(
            route_and_cb,
            RouteDefinition {
                base_url: "/api/analysis".into(),
                handler_name: "analysisRoutes".into(),
                line_loc: LineLoc { line: 2, col: 0 },
            }
        );
    }

    #[test]
    fn scraping_app_routes_from_source() {
        let source = r#"
const causalRoutes = require("./src/routes/causalRoutes");
const analysisRoutes = require("./src/routes/analysisRoutes");

app.use("/api/causal", causalRoutes({ query, auth0 }));
app.use("/api/analysis", auth0, analysisRoutes({ query }));
"#;

        let app_routes: Vec<_> = RouteWithHandler::scrape(source.into()).unwrap().collect();

        assert_eq!(app_routes.len(), 2);

        assert!(app_routes.contains(&RouteWithHandler {
            base_url: "/api/causal".into(),
            handler_source_path: "./src/routes/causalRoutes".into(),
            line_loc: LineLoc { line: 5, col: 0 },
        }));

        assert!(app_routes.contains(&RouteWithHandler {
            base_url: "/api/analysis".into(),
            handler_source_path: "./src/routes/analysisRoutes".into(),
            line_loc: LineLoc { line: 6, col: 0 },
        }));
    }
}
