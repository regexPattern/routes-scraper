use regex::Regex;
use swc_common::{FileName, SourceMap, SourceMapper};
use swc_ecma_ast::ClassMethod;

use crate::parsing_utils::{self, LineLoc};

#[derive(PartialEq, Debug)]
pub struct ServiceMethod {
    pub name: String,
    pub signature: String,
    pub used_constant_name: String,
    pub location: LineLoc,
}

#[derive(thiserror::Error, PartialEq, Debug)]
enum FileSpecError {
    #[error("Missing named export of a service class")]
    MissingClassExport,
}

impl ServiceMethod {
    pub fn scrape(source: String) -> anyhow::Result<impl Iterator<Item = ServiceMethod>> {
        let source_map = SourceMap::default();
        let source_file = source_map.new_source_file(FileName::Anon, source);
        let mut parser = parsing_utils::default_parser(&source_file);

        let module = parsing_utils::get_module(&mut parser, &source_map)?;
        let exports = parsing_utils::get_esmodule_exports(module);

        let class = parsing_utils::get_first_exported_class(exports)
            .ok_or(FileSpecError::MissingClassExport)?;

        let methods = parsing_utils::get_class_methods(class).filter_map(move |method| {
            let (name, signature) =
                parsing_utils::gen_method_name_and_signature(&method, &source_map)?;
            let used_constant_name = get_used_constant_name(&method, &source_map)?;
            let location = parsing_utils::line_loc_from_span(method.span, &source_map);

            Some(ServiceMethod {
                name,
                signature,
                used_constant_name,
                location,
            })
        });

        Ok(methods)
    }
}

fn get_used_constant_name(method: &ClassMethod, source_map: &SourceMap) -> Option<String> {
    lazy_static::lazy_static! {
        static ref CONSTANT_USAGE_RE: Regex = Regex::new(r#"apiUrls.([A-Z_]+)"#).unwrap();
    }

    let method_snippet = source_map.span_to_snippet(method.span).ok()?;

    CONSTANT_USAGE_RE
        .captures(&method_snippet)?
        .get(1)
        .map(|capture| capture.as_str().to_owned())
}

#[cfg(test)]
mod tests {
    use include_bytes_plus::include_bytes;

    use crate::parsing_utils::testing_utils;

    use super::*;

    #[test]
    #[should_panic(expected = "Missing named export of a service class")]
    fn a_service_file_must_have_a_class_export() {
        let source = r#"
@Injectable()
class Service {}
"#;

        ServiceMethod::scrape(source.into()).unwrap().last();
    }

    #[test]
    fn a_service_method_is_one_that_uses_an_api_url_constant() {
        let source = r#"
export class Service {
    method(): any {
        const api = globals.apiUrls.CONSTANT_NAME;
    }
}
"#;
        let (mut methods, source_map) = testing_utils::get_class_methods(source);
        let method = methods.next().unwrap();

        let constant_name = get_used_constant_name(&method, &source_map).unwrap();

        assert_eq!(constant_name, "CONSTANT_NAME");
    }

    #[test]
    fn ignoring_methods_that_dont_use_an_api_url_constant() {
        let source = r#"
export class Service {
    method(): any {
        const api = globals.notApiUrls.CONTANT_NAME;
    }
}
"#;
        let (mut methods, source_map) = testing_utils::get_class_methods(source);
        let method = methods.next().unwrap();

        let constant_name = get_used_constant_name(&method, &source_map);

        assert_eq!(constant_name, None);
    }

    #[test]
    fn scraping_service_methods_from_source() {
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

        let service_methods: Vec<_> = ServiceMethod::scrape(source.into()).unwrap().collect();

        assert_eq!(service_methods.len(), 2);

        assert_eq!(
            &service_methods[0],
            &ServiceMethod {
                name: "getMetaHierarchies".into(),
                signature: "getMetaHierarchies(): any".into(),
                used_constant_name: "GET_META_HIERARCHIES".into(),
                location: LineLoc { line: 3, col: 2 }
            },
        );

        assert_eq!(
            &service_methods[1],
            &ServiceMethod {
                name: "getMetaKpis".into(),
                signature: "getMetaKpis(): any".into(),
                used_constant_name: "GET_META_KPIS".into(),
                location: LineLoc { line: 9, col: 2 }
            }
        );
    }

    #[test]
    fn scraping_service_methods_from_real_data() {
        let bytes = include_bytes!("./test_data/frontend/causal-impact/causal.service.ts");
        let source = String::from_utf8(bytes.into()).unwrap();

        let service_methods = ServiceMethod::scrape(source).unwrap();

        assert_eq!(service_methods.count(), 23);
    }
}
