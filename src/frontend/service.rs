use regex::Regex;
use swc_common::{FileName, SourceMap, SourceMapper};
use swc_ecma_ast::ClassMethod;

use crate::parsing_utils::{self, LineLoc, ParsingError};

#[derive(PartialEq, Debug)]
pub struct Service {
    pub class_name: String,
    pub methods: Vec<ServiceMethod>,
}

#[derive(PartialEq, Debug)]
pub struct ServiceMethod {
    pub signature: String,
    pub used_api_url_name: String,
    pub line_loc: LineLoc,
}

#[derive(thiserror::Error, PartialEq, Debug)]
pub enum FileError {
    #[error("Missing named export of a service class")]
    MissingClassExport,
}

pub fn parse(filename: FileName, source: String) -> anyhow::Result<Service> {
    let source_map = SourceMap::default();
    let source_file = source_map.new_source_file(filename, source);
    let mut parser = parsing_utils::default_parser(&source_file);

    let module = parsing_utils::get_module(&mut parser, &source_map)?;
    let exports = parsing_utils::get_module_exports(&module);

    let class =
        parsing_utils::get_first_exported_class(exports).ok_or(FileError::MissingClassExport)?;

    let class_name = class.ident.sym.to_string();

    let methods = parsing_utils::get_class_methods(&class).filter_map(|method| {
        let used_api_url_name = get_consumed_api_url_in_method(method, &source_map)?;
        let line_loc = parsing_utils::line_loc_from_span(method.span, &source_map);

        Some(ServiceMethod {
            signature: parsing_utils::gen_method_signature(method, &source_map)?,
            used_api_url_name,
            line_loc,
        })
    });

    Ok(Service {
        class_name,
        methods: methods.collect(),
    })
}

fn get_consumed_api_url_in_method(method: &ClassMethod, source_map: &SourceMap) -> Option<String> {
    lazy_static::lazy_static! {
        static ref RE: Regex = Regex::new("apiUrls.([A-Z_]+)").unwrap();
    }

    let method_snippet = source_map.span_to_snippet(method.span).ok()?;

    RE.captures(&method_snippet)?
        .get(1)
        .map(|capture| capture.as_str().to_owned())
}

#[cfg(test)]
mod tests {
    use include_bytes_plus::include_bytes;

    use super::*;

    #[test]
    #[should_panic(expected = "Missing named export of a service class")]
    fn service_file_must_have_a_class_export() {
        let source = r#"
@Injectable()
class Service {}
"#;

        parse(FileName::Anon, source.to_string()).unwrap();
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

            let module = parsing_utils::get_module(&mut parser, &source_map).unwrap();
            let exports = parsing_utils::get_module_exports(&module);
            let class_decl = parsing_utils::get_first_exported_class(exports).unwrap();

            let method = parsing_utils::get_class_methods(&class_decl)
                .next()
                .unwrap();

            get_consumed_api_url_in_method(&method, &source_map)
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
}
"#;

        let service = parse(FileName::Anon, source.to_string()).unwrap();

        assert_eq!(service.class_name, "Service");

        assert_eq!(service.methods.len(), 2);

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

    #[test]
    fn getting_causal_impact_service_methods() {
        let bytes = include_bytes!("./test_data/frontend/causal-impact/causal.service.ts");
        let source = String::from_utf8(bytes.into()).unwrap();

        let service = parse(FileName::Anon, source).unwrap();

        assert_eq!(service.methods.len(), 23);
    }
}
