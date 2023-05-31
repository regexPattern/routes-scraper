use swc_common::{FileName, SourceMap};
use swc_ecma_ast::Lit;

use crate::parsing_utils::{self, LineLoc};

#[derive(PartialEq, Debug)]
pub struct Constant {
    pub name: String,
    pub api_url: String,
    pub location: LineLoc,
}

#[derive(thiserror::Error, PartialEq, Debug)]
enum FileSpecError {
    #[error("Missing named export of `apiUrls` object literal")]
    MissingApiUrlsExport,
}

impl Constant {
    pub fn scrape(source: String) -> anyhow::Result<impl Iterator<Item = Constant>> {
        let source_map = SourceMap::default();
        let source_file = source_map.new_source_file(FileName::Anon, source);
        let mut parser = parsing_utils::default_parser(&source_file);

        let module = parsing_utils::get_module(&mut parser, &source_map)?;
        let exports = parsing_utils::get_esmodule_exports(module);

        let mut exported_variables = exports.filter_map(|export_decl| export_decl.decl.var());

        let api_urls = exported_variables
            .find_map(|var_decl| {
                parsing_utils::var_with_pattern_value(*var_decl, "apiUrls")?.object()
            })
            .ok_or(FileSpecError::MissingApiUrlsExport)?;

        let constants = api_urls.props.into_iter().filter_map(move |prop| {
            let key_value_pair = prop.prop()?.key_value()?;
            let ident = key_value_pair.key.ident()?;

            let name = ident.sym.to_string();
            let location = parsing_utils::line_loc_from_span(ident.span, &source_map);

            let api_url = match key_value_pair.value.lit()? {
                Lit::Str(str_literal) => str_literal.value.to_string(),
                _ => return None,
            };

            Some(Constant {
                name,
                api_url,
                location,
            })
        });

        Ok(constants)
    }
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

        Constant::scrape(source.into()).unwrap().last();
    }

    #[test]
    fn scraping_constants_from_source() {
        let source = r#"
export const apiUrls = {
  GET_RESULTS: '/api/causal/results',
  GET_ARCHIVEDRESULTS: '/api/causal/archivedresults',
  GET_TEST_BY_NAME: '/api/causal/test/name?name={{name}}',
};
"#;

        let constants: Vec<_> = Constant::scrape(source.into()).unwrap().collect();

        assert_eq!(constants.len(), 3);

        assert_eq!(
            &constants[0],
            &Constant {
                name: "GET_RESULTS".into(),
                api_url: "/api/causal/results".into(),
                location: LineLoc { line: 3, col: 2 },
            }
        );

        assert_eq!(
            &constants[1],
            &Constant {
                name: "GET_ARCHIVEDRESULTS".into(),
                api_url: "/api/causal/archivedresults".into(),
                location: LineLoc { line: 4, col: 2 },
            }
        );

        assert_eq!(
            &constants[2],
            &Constant {
                name: "GET_TEST_BY_NAME".into(),
                api_url: "/api/causal/test/name?name={{name}}".into(),
                location: LineLoc { line: 5, col: 2 },
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

        let constants = Constant::scrape(source.into()).unwrap();

        assert_eq!(constants.count(), 3);
    }

    #[test]
    fn scraping_constants_from_real_data() {
        let bytes = include_bytes!("./test_data/frontend/causal-impact/constants.ts");
        let source = String::from_utf8(bytes.into()).unwrap();

        let constants = Constant::scrape(source).unwrap();

        assert_eq!(constants.count(), 24);
    }
}
