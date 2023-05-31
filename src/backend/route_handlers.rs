use swc_common::{FileName, SourceMap};
use swc_ecma_ast::{CallExpr, Lit};

use crate::parsing_utils::{self, LineLoc};

#[derive(PartialEq, Debug)]
pub struct RouteHandlerDefinition {
    url_suffix: String,
    line_loc: LineLoc,
}

#[derive(thiserror::Error, PartialEq, Debug)]
enum FileSpecError {
    #[error("Missing arrow function named `wrapper`")]
    MissingHandlersWrapper,

    #[error("Wrapper arrow function does not have a block statement, at {0}")]
    WrapperArrowFuncWithoutBlockStmt(LineLoc),
}

pub fn scrape(source: String) -> anyhow::Result<impl Iterator<Item = RouteHandlerDefinition>> {
    let source_map = SourceMap::default();
    let source_file = source_map.new_source_file(FileName::Anon, source);
    let mut parser = parsing_utils::default_parser(&source_file);

    let module = parsing_utils::get_module(&mut parser, &source_map)?;
    let mut var_decls = parsing_utils::get_commonjs_module_var_decls(module);

    let wrapper = var_decls
        .find_map(|var_decl| parsing_utils::var_with_pattern_value(var_decl, "wrapper")?.arrow())
        .ok_or(FileSpecError::MissingHandlersWrapper)?;

    let wrapper_line_loc = parsing_utils::line_loc_from_span(wrapper.span, &source_map);
    let wrapper_stmts = wrapper
        .body
        .block_stmt()
        .ok_or(FileSpecError::WrapperArrowFuncWithoutBlockStmt(
            wrapper_line_loc,
        ))?
        .stmts;

    let handlers = wrapper_stmts
        .into_iter()
        .filter_map(|stmt| stmt.expr()?.expr.call())
        .filter_map(move |call_expr| get_route_handler(&call_expr, &source_map));

    Ok(handlers)
}

fn get_route_handler(
    call_expr: &CallExpr,
    source_map: &SourceMap,
) -> Option<RouteHandlerDefinition> {
    let line_loc = parsing_utils::line_loc_from_span(call_expr.span, &source_map);
    let args = &call_expr.args;

    let route = match args.first().map(|expr| expr.expr.as_lit()).flatten()? {
        Lit::Str(str_literal) => str_literal.value.to_string(),
        _ => return None,
    };

    Some(RouteHandlerDefinition {
        url_suffix: route,
        line_loc,
    })
}

#[cfg(test)]
mod tests {
    use super::*;

    #[test]
    #[should_panic(expected = "Missing arrow function named `wrapper`")]
    fn handlers_wrapper_must_be_an_arrow_function() {
        let source = r#"
const wrapper = 10;
"#;

        scrape(source.into()).unwrap();
    }

    #[test]
    #[should_panic(
        expected = "Wrapper arrow function does not have a block statement, at line 2, col 16"
    )]
    fn handlers_wrapper_function_must_have_a_block_stmt() {
        let source = r#"
const wrapper = () => 10;
"#;

        scrape(source.into()).unwrap();
    }

    #[test]
    fn scraping_route_handlers_from_source() {
        let source = r#"
const wrapper = () => {
  router.get("/meta/hierarchies", auth0, (_, res) => {
    causalController.getMetaHierarchies(query, res);
  });

  router.get("/summaries/:testId", (req, res) => {
    causalController.getSummaries(query, req, res);
  });

  router.get(10, (req, res) => {
    causalController.getSummaries(query, req, res);
  });
};
"#;

        let route_handlers: Vec<_> = scrape(source.into()).unwrap().collect();

        assert_eq!(route_handlers.len(), 2);

        assert_eq!(
            &route_handlers[0],
            &RouteHandlerDefinition {
                url_suffix: "/meta/hierarchies".into(),
                line_loc: LineLoc { line: 3, col: 2 },
            }
        );

        assert_eq!(
            &route_handlers[1],
            &RouteHandlerDefinition {
                url_suffix: "/summaries/:testId".into(),
                line_loc: LineLoc { line: 7, col: 2 },
            }
        );
    }
}
