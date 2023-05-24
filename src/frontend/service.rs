use regex::Regex;
use swc_common::{FileName, SourceMap, SourceMapper};
use swc_ecma_ast::{ClassDecl, ClassMethod, ExportDecl};
use swc_ecma_parser::{lexer::Lexer, Parser};

use crate::parsing_utils::{self, LineLoc, ParsingError};

#[derive(PartialEq, Debug)]
pub struct Service {
    class_name: String,
    methods: Vec<ServiceMethod>,
}

#[derive(PartialEq, Debug)]
pub struct ServiceMethod {
    signature: String,
    used_api_url_name: String,
    line_loc: LineLoc,
}

#[derive(thiserror::Error, PartialEq, Debug)]
pub enum FileError {
    #[error(transparent)]
    ParsingError(ParsingError),

    #[error("Missing named export of a service class")]
    MissingClassExport,
}

pub fn scrape(filename: FileName, source: String) -> Result<Service, FileError> {
    let source_map = SourceMap::default();
    let source_file = source_map.new_source_file(filename, source);
    let mut parser = parsing_utils::default_parser(&source_file);

    let mut class_decl = parsing_utils::first_exported_class(&mut parser, &source_map)
        .map_err(FileError::ParsingError)?
        .ok_or(FileError::MissingClassExport)?;

    let class_name = class_decl.ident.sym.to_string();

    let methods = parsing_utils::class_methods(class_decl).filter_map(|method| {
        let used_api_url_name = consumed_api_url_in_method(&method, &source_map)?;
        let line_loc = parsing_utils::span_line_loc(method.span, &source_map);

        Some(ServiceMethod {
            signature: parsing_utils::method_signature(&method, &source_map)?,
            used_api_url_name,
            line_loc,
        })
    });

    Ok(Service {
        class_name,
        methods: methods.collect(),
    })
}

fn consumed_api_url_in_method(method: &ClassMethod, source_map: &SourceMap) -> Option<String> {
    lazy_static::lazy_static! {
        static ref RE: Regex = Regex::new("apiUrls.([A-Z_]+)").unwrap();
    }

    let method_str = source_map.span_to_snippet(method.span).ok()?;

    RE.captures(&method_str)?
        .get(1)
        .map(|capture| capture.as_str().to_owned())
}

#[cfg(test)]
mod tests {
    use swc_common::SourceFile;

    use super::*;

    #[test]
    fn service_file_must_have_a_class_export() {
        let exported_class = r#"
export class Service {}
"#;

        let not_exported_class = r#"
class Service {}
"#;

        scrape(FileName::Anon, exported_class.to_string()).unwrap();
        let err = scrape(FileName::Anon, not_exported_class.to_string()).unwrap_err();

        assert_eq!(err, FileError::MissingClassExport);
    }

    #[test]
    fn getting_consumed_api_url_from_method() {
        let consumes_api_url = r#"
export class Service {
    method(): any {
        const api = globals.apiUrls.CONSTANT_NAME;
    }
}
"#;

        let doesnt_consume_api_url = r#"
export class Service {
    method(): any {
        const api = globals.notApiUrls.CONTANT_NAME;
    }
}
        "#;

        fn consumed_api_url_in_method_from_str(source: &str) -> Option<String> {
            let source_map = SourceMap::default();
            let source_file = source_map.new_source_file(FileName::Anon, source.to_string());
            let mut parser = parsing_utils::default_parser(&source_file);

            let class_decl = parsing_utils::first_exported_class(&mut parser, &source_map)
                .unwrap()
                .unwrap();

            let method = parsing_utils::class_methods(class_decl).next().unwrap();

            consumed_api_url_in_method(&method, &source_map)
        }

        assert_eq!(
            consumed_api_url_in_method_from_str(consumes_api_url),
            Some("CONSTANT_NAME".to_string())
        );

        assert_eq!(
            consumed_api_url_in_method_from_str(doesnt_consume_api_url),
            None,
        );
    }

    #[test]
    fn parsing_a_service() {
        let source = r#"
export class Service {
  getMetaHierarchies(): any {
    const api = globals.apiUrls.GET_META_HIERARCHIES;
    const url = this.nodeServerUrl + api;
    return this.http.get<any>(url);
  }

  getMetaKpis(): any {
    const api = globals.apiUrls.GET_META_KPIS;
    const url = this.nodeServerUrl + api;
    return this.http.get<any>(url);
  }
"#;

        let service = scrape(FileName::Anon, source.to_string()).unwrap();

        assert_eq!(service.class_name, "Service");

        assert_eq!(
            &service.methods[0],
            &ServiceMethod {
                signature: "getMetaHierarchies(): any".to_string(),
                used_api_url_name: "GET_META_HIERARCHIES".to_string(),
                line_loc: LineLoc { line: 3, col: 2 }
            },
        );

        assert_eq!(
            &service.methods[1],
            &ServiceMethod {
                signature: "getMetaKpis(): any".to_string(),
                used_api_url_name: "GET_META_KPIS".to_string(),
                line_loc: LineLoc { line: 9, col: 2 }
            }
        );
    }
}
