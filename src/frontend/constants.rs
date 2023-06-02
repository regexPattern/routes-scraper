use regex::Regex;
use swc_common::{FileName, SourceMap};
use swc_ecma_ast::Lit;

use crate::parsing_utils::{self, LineLoc};

#[derive(Clone, PartialEq, Debug)]
pub struct ConstantDef {
    pub name: String,
    pub api_url: String,
    pub backend_api_url: String,
    pub line_loc: LineLoc,
}

#[derive(thiserror::Error, PartialEq, Debug)]
enum FileSpecError {
    #[error("Missing named export of `apiUrls` object literal")]
    MissingApiUrlsExport,
}

impl ConstantDef {
    pub fn scrape(source: String) -> anyhow::Result<impl Iterator<Item = ConstantDef>> {
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
            let line_loc = parsing_utils::line_loc_from_span(ident.span, &source_map);

            let api_url = match key_value_pair.value.lit()? {
                Lit::Str(str_literal) => str_literal.value.to_string(),
                _ => return None,
            };

            Some(ConstantDef {
                name,
                backend_api_url: adapt_frontend_api_url(&api_url),
                api_url,
                line_loc,
            })
        });

        Ok(constants)
    }
}

fn adapt_frontend_api_url(api_url: &str) -> String {
    lazy_static::lazy_static! {
        static ref API_URL_QUERY_PARAMS_ADAPTER_RE: Regex = Regex::new(r#"(.*)(?:\?.*)"#).unwrap();
        static ref API_URL_DYNAMIC_PATH_ADAPTER_RE: Regex = Regex::new(r#"\{\{(\w+)\}\}(\?.*)?"#).unwrap();
    }

    let api_url_without_query_params = API_URL_QUERY_PARAMS_ADAPTER_RE.replace_all(api_url, "$1");

    API_URL_DYNAMIC_PATH_ADAPTER_RE
        .replace_all(api_url_without_query_params.trim_end_matches('/'), ":$1")
        .to_string()
}

#[cfg(test)]
mod tests {
    use super::*;

    #[test]
    #[should_panic(expected = "Missing named export of `apiUrls` object literal")]
    fn api_urls_exported_variable_must_be_an_object_literal() {
        let source = r#"
export const apiUrls = 10;
"#;

        ConstantDef::scrape(source.into()).unwrap().last();
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

        let constants: Vec<_> = ConstantDef::scrape(source.into()).unwrap().collect();

        assert_eq!(constants.len(), 3);

        assert_eq!(
            &constants[0],
            &ConstantDef {
                name: "GET_RESULTS".into(),
                api_url: "/api/causal/results".into(),
                backend_api_url: adapt_frontend_api_url("/api/causal/results"),
                line_loc: LineLoc { line: 3, col: 2 },
            }
        );

        assert_eq!(
            &constants[1],
            &ConstantDef {
                name: "GET_ARCHIVEDRESULTS".into(),
                api_url: "/api/causal/archivedresults".into(),
                backend_api_url: adapt_frontend_api_url("/api/causal/archivedresults"),
                line_loc: LineLoc { line: 4, col: 2 },
            }
        );

        assert_eq!(
            &constants[2],
            &ConstantDef {
                name: "GET_TEST_BY_NAME".into(),
                api_url: "/api/causal/test/name?name={{name}}".into(),
                backend_api_url: adapt_frontend_api_url("/api/causal/test/name?name={{name}}"),
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

        let constants = ConstantDef::scrape(source.into()).unwrap();

        assert_eq!(constants.count(), 3);
    }

    #[test]
    fn adapting_a_simple_api_url() {
        let without_trailing_slash = "/api/causal/meta/kpis";
        let with_trailing_slash = "/api/causal/meta/kpis/";

        assert_eq!(
            adapt_frontend_api_url(without_trailing_slash),
            "/api/causal/meta/kpis"
        );

        assert_eq!(
            adapt_frontend_api_url(with_trailing_slash),
            "/api/causal/meta/kpis"
        );
    }

    #[test]
    fn adapting_api_url_with_multiple_dynamic_path_segments() {
        let constant_def = "/api/causal/daterange/{{testId}}/{{pre}}/{{post}}";

        assert_eq!(
            adapt_frontend_api_url(constant_def),
            "/api/causal/daterange/:testId/:pre/:post"
        );
    }

    #[test]
    fn adapting_api_url_with_query_params() {
        let constant_def = "/api/causal/chart/{{testId}}?site_name={{site}}&segment={{segment}}&page_lob={{lob}}&page_type={{page}}&device={{device}}&metric={{metric}}";

        assert_eq!(
            adapt_frontend_api_url(constant_def),
            "/api/causal/chart/:testId"
        );
    }
}
