use std::{collections::HashMap, path::PathBuf};

use regex::Regex;
use swc_common::{FileName, SourceMap, SourceMapper};
use swc_ecma_ast::{CallExpr, Lit, VarDecl};

use crate::parsing_utils::{self, LineLoc};

#[derive(PartialEq, Debug)]
pub struct AppRoute {
    base_url: String,
    handler: RouteHandlerCallback,
    line_loc: LineLoc,
}

pub fn scrape(source: String) -> anyhow::Result<impl Iterator<Item = AppRoute>> {
    let source_map = SourceMap::default();
    let source_file = source_map.new_source_file(FileName::Anon, source);
    let mut parser = parsing_utils::default_parser(&source_file);

    let module = parsing_utils::get_module(&mut parser, &source_map)?;

    // PERF: I don't know if dumping everything into a hashmap and cloning the callback name string
    // is a good idea. There a lots of places where info is repeated, for example, the name of the
    // imported callback matches the filename of the import path. Maybe I could take advantage of
    // that.
    //
    let mut route_and_cbs: HashMap<_, _> = module
        .body
        .iter()
        .filter_map(|module_item| module_item.as_stmt()?.as_expr()?.expr.as_call())
        .filter_map(|call_expr| {
            let route_and_cb = get_app_route_and_callback(call_expr, &source_map)?;
            Some((route_and_cb.callback_name.clone(), route_and_cb))
        })
        .collect();

    let var_decls = parsing_utils::get_commonjs_module_var_decls(module);
    let route_handlers =
        var_decls.filter_map(move |var_decl| get_imported_route_handler(&var_decl, &source_map));

    let app_routes = route_handlers.into_iter().filter_map(move |handler| {
        let route_and_cb = route_and_cbs.remove(&handler.name)?;
        Some(AppRoute {
            base_url: route_and_cb.route,
            handler,
            line_loc: route_and_cb.line_loc,
        })
    });

    Ok(app_routes)
}

#[derive(PartialEq, Debug)]
struct AppRouteAndCallback {
    route: String,
    callback_name: String,
    line_loc: LineLoc,
}

fn get_app_route_and_callback(
    call_expr: &CallExpr,
    source_map: &SourceMap,
) -> Option<AppRouteAndCallback> {
    let callee_span = call_expr.callee.as_expr()?.as_member()?.span;
    let called_function_snippet = source_map.span_to_snippet(callee_span).ok()?;
    let line_loc = parsing_utils::line_loc_from_span(callee_span, source_map);

    if called_function_snippet != "app.use" {
        return None;
    }

    let args = &call_expr.args;

    let route = match args.first().map(|expr| expr.expr.as_lit()).flatten()? {
        Lit::Str(str_literal) => str_literal.value.to_string(),
        _ => return None,
    };

    let callback = args.last().map(|expr| expr.expr.as_call()).flatten()?;
    let callback_name = callback.callee.as_expr()?.as_ident()?.sym.to_string();

    Some(AppRouteAndCallback {
        route,
        callback_name,
        line_loc,
    })
}

#[derive(PartialEq, Debug)]
struct RouteHandlerCallback {
    name: String,
    source_path: PathBuf,
}

fn get_imported_route_handler(
    var_decl: &VarDecl,
    source_map: &SourceMap,
) -> Option<RouteHandlerCallback> {
    lazy_static::lazy_static! {
        static ref ROUTE_IMPORT_RE: Regex = Regex::new(r#"(\w+)\s?=\s?require\(['"](\./src/routes/.*)['"]\)"#).unwrap();
    }

    let var_decl_snippet = source_map.span_to_snippet(var_decl.span).ok()?;
    let captures = ROUTE_IMPORT_RE.captures(&var_decl_snippet)?;

    let import_name = captures.get(1)?.as_str().to_owned();
    let import_path = captures.get(2)?.as_str().to_owned();

    Some(RouteHandlerCallback {
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

        let route_handler = get_imported_route_handler(&import, &source_map).unwrap();

        assert_eq!(
            route_handler,
            RouteHandlerCallback {
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

        let route_name = get_imported_route_handler(&import, &source_map);

        assert_eq!(route_name, None);
    }

    #[test]
    fn getting_app_route_and_callback_from_app_use_call() {
        let source = r#"
app.use("/api/analysis", auth0, analysisRoutes({ query }));
"#;

        let (call_expr, source_map) = get_first_call_expr(source);

        let route_and_cb = get_app_route_and_callback(&call_expr, &source_map).unwrap();

        assert_eq!(
            route_and_cb,
            AppRouteAndCallback {
                route: "/api/analysis".into(),
                callback_name: "analysisRoutes".into(),
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

        let app_routes: Vec<_> = scrape(source.into()).unwrap().collect();

        assert_eq!(app_routes.len(), 2);

        assert!(app_routes.contains(&AppRoute {
            base_url: "/api/causal".into(),
            handler: RouteHandlerCallback {
                name: "causalRoutes".into(),
                source_path: "./src/routes/causalRoutes".into(),
            },
            line_loc: LineLoc { line: 5, col: 0 },
        }));

        assert!(app_routes.contains(&AppRoute {
            base_url: "/api/analysis".into(),
            handler: RouteHandlerCallback {
                name: "analysisRoutes".into(),
                source_path: "./src/routes/analysisRoutes".into(),
            },
            line_loc: LineLoc { line: 6, col: 0 },
        }));
    }
}
