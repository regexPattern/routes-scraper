use std::collections::VecDeque;

use swc_common::{FileName, SourceMap};
use swc_ecma_ast::Lit;

use crate::parsing_utils::{self, LineLoc, ParsingError};

#[derive(PartialEq, Debug)]
pub struct Constant {
    name: String,
    api_url: String,
    line_loc: LineLoc,
}

#[derive(thiserror::Error, PartialEq, Debug)]
pub enum FileError {
    #[error("Missing named export of `apiUrls` object literal")]
    MissingApiUrlsExport,
}

pub fn parse(filename: FileName, source: String) -> anyhow::Result<Vec<Constant>> {
    let source_map = SourceMap::default();
    let source_file = source_map.new_source_file(filename, source);
    let mut parser = parsing_utils::default_parser(&source_file);

    let module = parsing_utils::get_module(&mut parser, &source_map)?;
    let exports = parsing_utils::get_module_exports(&module);

    let mut var_decls = exports
        .cloned()
        .filter_map(|export_decl| export_decl.decl.var());

    let api_urls = var_decls
        .find_map(|var_decl| {
            let mut decls = VecDeque::from(var_decl.decls);
            let var_declarator = decls.pop_front()?;

            if var_declarator.name.as_ident()?.sym == *"apiUrls" {
                var_declarator.init?.object()
            } else {
                None
            }
        })
        .ok_or(FileError::MissingApiUrlsExport)?;

    let constants = api_urls.props.into_iter().filter_map(|prop| {
        let key_value_pair = prop.prop()?.key_value()?;

        let ident = key_value_pair.key.ident()?;
        let line_loc = parsing_utils::line_loc_from_span(ident.span, &source_map);
        let name = ident.sym.to_string();

        let api_url = match key_value_pair.value.lit()? {
            Lit::Str(str_literal) => str_literal.value.to_string(),
            _ => return None,
        };

        Some(Constant {
            name,
            api_url,
            line_loc,
        })
    });

    Ok(constants.collect())
}

#[cfg(test)]
mod tests {
    use include_bytes_plus::include_bytes;

    use super::*;

    #[test]
    #[should_panic(expected = "Missing named export of `apiUrls` object literal")]
    fn api_urls_exported_variable_must_be_an_object_literal() {
        let source = r#"
export const apiUrls = 10;
"#;

        let filename = FileName::Anon;

        parse(filename.clone(), source.to_string()).unwrap();
    }

    #[test]
    fn parsing_constants() {
        let source = r#"
export const apiUrls = {
  GET_RESULTS: '/api/causal/results',
  GET_ARCHIVEDRESULTS: '/api/causal/archivedresults',
  GET_TEST_BY_NAME: '/api/causal/test/name?name={{name}}',
};
"#;

        let filename = FileName::Anon;
        let constants = parse(filename, source.to_string()).unwrap();

        assert_eq!(constants.len(), 3);

        assert_eq!(
            &constants[0],
            &Constant {
                name: "GET_RESULTS".to_string(),
                api_url: "/api/causal/results".to_string(),
                line_loc: LineLoc { line: 3, col: 2 },
            }
        );

        assert_eq!(
            &constants[1],
            &Constant {
                name: "GET_ARCHIVEDRESULTS".to_string(),
                api_url: "/api/causal/archivedresults".to_string(),
                line_loc: LineLoc { line: 4, col: 2 },
            }
        );

        assert_eq!(
            &constants[2],
            &Constant {
                name: "GET_TEST_BY_NAME".to_string(),
                api_url: "/api/causal/test/name?name={{name}}".to_string(),
                line_loc: LineLoc { line: 5, col: 2 },
            }
        );
    }

    #[test]
    fn only_string_literal_props_are_parsed_as_valid_constants() {
        let source = r#"
export const apiUrls = {
  GET_RESULTS: '/api/causal/results',
  GET_ARCHIVEDRESULTS: '/api/causal/archivedresults',
  GET_TEST_BY_NAME: '/api/causal/test/name?name={{name}}',
  NOT_STRING_LITERAL_1: 10,
  NOT_STRING_LITERAL_2: false,
};
"#;

        let filename = FileName::Anon;
        let constants = parse(filename, source.to_string()).unwrap();

        assert_eq!(constants.len(), 3);
    }

    #[test]
    fn getting_causal_impact_constants() {
        let bytes = include_bytes!("./test_data/frontend/causal-impact/constants.ts");
        let source = String::from_utf8(bytes.into()).unwrap();

        let constants = parse(FileName::Anon, source).unwrap();

        assert_eq!(constants.len(), 24);
    }
}
