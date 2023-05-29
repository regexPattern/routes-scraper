use std::collections::HashMap;

use regex::Regex;
use swc_common::{FileName, SourceMap, SourceMapper};
use swc_ecma_ast::{ClassMethod, ImportDecl, MemberExpr, TsParamProp};
use swc_ecma_visit::{All, Visit, VisitAll};

use crate::parsing_utils::{self, LineLoc};

#[derive(PartialEq, Debug)]
pub struct ServiceUsage {
    pub component_method_signature: String,
    pub used_service: String,
    pub location: LineLoc,
}

#[derive(thiserror::Error, PartialEq, Debug)]
pub enum FileSpecError {
    #[error("Missing named export of a component class")]
    MissingClassExport,

    #[error("Component class must have a constructor")]
    MissingClassConstructor,

    #[error("Missing service import from same directory as the component")]
    MissingServiceImport,

    #[error(
        "Component class must declare a service attribute in it's constructor parameters, at {0}"
    )]
    ServiceNotStoredAsAttribute(LineLoc),
}

pub fn from_source(source: String) -> anyhow::Result<impl Iterator<Item = ServiceUsage>> {
    let source_map = SourceMap::default();
    let source_file = source_map.new_source_file(FileName::Anon, source);
    let mut parser = parsing_utils::default_parser(&source_file);

    let module = parsing_utils::get_module(&mut parser, &source_map)?;

    let service_class_name = module
        .body
        .iter()
        .filter_map(|mod_item| mod_item.as_module_decl()?.as_import())
        .find_map(|import| find_service_class_name(import, &source_map))
        .ok_or(FileSpecError::MissingServiceImport)?;

    #[allow(clippy::expect_used)]
    let service_class_re =
        Regex::new(&format!(r#"(\w+): {service_class_name}"#)).expect("Error compiling regex");

    let mut exports = parsing_utils::get_module_exports(module);

    let class = exports
        .find_map(|export_decl| export_decl.decl.class())
        .ok_or(FileSpecError::MissingClassExport)?;

    let constructor = class
        .class
        .body
        .iter()
        .find_map(|class_member| class_member.as_constructor())
        .ok_or(FileSpecError::MissingClassConstructor)?;

    let service_attribute = constructor
        .params
        .iter()
        .find_map(|param| {
            find_service_attribute_name(param.as_ts_param_prop()?, &source_map, &service_class_re)
        })
        .ok_or(FileSpecError::ServiceNotStoredAsAttribute(
            parsing_utils::line_loc_from_span(constructor.span, &source_map),
        ))?;

    #[allow(clippy::expect_used)]
    let service_usage_re =
        Regex::new(&format!(r#"this.{service_attribute}.(\w+)"#)).expect("Error compiling regex");

    let usages = parsing_utils::get_class_methods(class)
        .filter_map(move |method| {
            get_service_usages_in_method(&method, &source_map, &service_usage_re)
        })
        .flatten();

    Ok(usages)
}

fn find_service_class_name(import: &ImportDecl, source_map: &SourceMap) -> Option<String> {
    lazy_static::lazy_static! {
        static ref SERVICE_IMPORT_RE: Regex = Regex::new(r#"import\s?\{\s?(.*Service)\s?}\s?from\s?['"]./.*['"]"#).unwrap();
    }

    let snippet = source_map.span_to_snippet(import.span).ok()?;

    SERVICE_IMPORT_RE
        .captures(&snippet)?
        .get(1)
        .map(|capture| capture.as_str().to_owned())
}

fn find_service_attribute_name(
    param: &TsParamProp,
    source_map: &SourceMap,
    service_class_name_re: &Regex,
) -> Option<String> {
    let snippet = source_map.span_to_snippet(param.span).ok()?;

    service_class_name_re
        .captures(&snippet)?
        .get(1)
        .map(|capture| capture.as_str().to_owned())
}

struct MethodServiceUsagesVisitor<'r, 's> {
    source_map: &'s SourceMap,
    signature: String,
    service_usage_re: &'r Regex,
    usages: HashMap<String, ServiceUsage>,
}

impl VisitAll for MethodServiceUsagesVisitor<'_, '_> {
    fn visit_member_expr(&mut self, member_expr: &MemberExpr) {
        if let Ok(snippet) = self.source_map.span_to_snippet(member_expr.span) {
            if let Some(used_service) = self.used_service_name(&snippet) {
                let span = parsing_utils::line_loc_from_span(member_expr.span, self.source_map);

                // Since we want to save each usage once, we hash each `MemberExpr` by the name of
                // the service method it uses and the line name. This is because a `MemberExpr`
                // such as: `this.service.method().subscribe()` can be decomposed into inner
                // `MemberExpr`s, but we only really care about one of them.
                //
                let usage_hash = format!("{used_service}:{}", span.line);

                self.usages.entry(usage_hash).or_insert(ServiceUsage {
                    component_method_signature: self.signature.clone(),
                    used_service,
                    location: span,
                });
            }
        }
    }
}

impl MethodServiceUsagesVisitor<'_, '_> {
    fn used_service_name(&self, snippet: &str) -> Option<String> {
        self.service_usage_re
            .captures(snippet)?
            .get(1)
            .map(|capture| capture.as_str().to_owned())
    }
}

fn get_service_usages_in_method(
    method: &ClassMethod,
    source_map: &SourceMap,
    service_usage_re: &Regex,
) -> Option<impl Iterator<Item = ServiceUsage>> {
    let body = method.function.body.as_ref()?;

    let (_, signature) = parsing_utils::gen_method_name_and_signature(method, source_map).unwrap();

    let mut all_children_visitor = All {
        visitor: MethodServiceUsagesVisitor {
            source_map,
            signature,
            service_usage_re,
            usages: HashMap::new(),
        },
    };

    all_children_visitor.visit_block_stmt(body);

    Some(
        all_children_visitor
            .visitor
            .usages
            .into_iter()
            .map(|usage| usage.1),
    )
}

#[cfg(test)]
mod tests {
    use include_bytes_plus::include_bytes;

    use super::*;

    #[test]
    #[should_panic(expected = "Missing named export of a component class")]
    fn component_file_must_have_a_class_export() {
        let source = r#"
import { Service } from './service';

class Service {}
"#;

        from_source(source.into()).unwrap().last();
    }

    #[test]
    fn getting_the_service_at_the_current_dir() {
        let imports_service_from_the_current_dir = r#"
import { Service } from './my.service';
"#;

        let imports_service_from_another_path = r#"
import { Service } from '../parent_dir';
"#;

        fn service_class_name(source: &str) -> Option<String> {
            let source_map = SourceMap::default();
            let source_file = source_map.new_source_file(FileName::Anon, source.into());
            let mut parser = parsing_utils::default_parser(&source_file);

            let module = parsing_utils::get_module(&mut parser, &source_map).unwrap();
            let import = module
                .body
                .into_iter()
                .find_map(|mod_item| mod_item.module_decl()?.import())
                .unwrap();

            find_service_class_name(&import, &source_map)
        }

        assert_eq!(
            service_class_name(imports_service_from_the_current_dir),
            Some("Service".into())
        );

        assert_eq!(service_class_name(imports_service_from_another_path), None);
    }

    #[test]
    #[should_panic(expected = "Missing service import from same directory as the component")]
    fn component_file_must_import_the_service_in_the_same_directory() {
        let source = r#"
export class Service {}
"#;

        from_source(source.into()).unwrap().last();
    }

    #[test]
    #[should_panic(expected = "Component class must have a constructor")]
    fn component_class_must_have_a_constructor() {
        let source = r#"
import { Service } from './service';

export class Service {}
"#;

        from_source(source.into()).unwrap().last();
    }

    #[test]
    fn getting_the_attribute_that_stores_the_service() {
        let source = r#"
export class Component {
  constructor(
    private navbarService: NavbarService,
    private toastr: ToastrService,
    private userData: UserData,
    private causalService: CausalService,
  ) {}
}
"#;

        let source_map = SourceMap::default();
        let source_file = source_map.new_source_file(FileName::Anon, source.into());
        let mut parser = parsing_utils::default_parser(&source_file);

        let module = parsing_utils::get_module(&mut parser, &source_map).unwrap();
        let exports = parsing_utils::get_module_exports(module);
        let class_decl = parsing_utils::get_first_exported_class(exports).unwrap();

        let constructor = class_decl
            .class
            .body
            .iter()
            .find_map(|class_member| class_member.as_constructor())
            .unwrap();

        let attribute_name = constructor
            .params
            .iter()
            .find_map(|param| {
                find_service_attribute_name(
                    param.as_ts_param_prop()?,
                    &source_map,
                    &Regex::new(r#"(\w+): CausalService"#).unwrap(),
                )
            })
            .unwrap();

        assert_eq!(attribute_name, "causalService");
    }

    #[test]
    #[should_panic(
        expected = "Component class must declare a service attribute in it's constructor parameters, at line 5, col 4"
    )]
    fn component_class_must_store_the_service() {
        let source = r#"
import { Service } from './service';

export class Service {
    constructor() {}
}
"#;

        from_source(source.into()).unwrap().last();
    }

    #[test]
    fn finding_usages_of_service_method_in_component_class_methods() {
        let source = r#"
export class Component {
  method1() {
    this.causalService.serviceMethod1().subscribe();

    if (condition) {
      for (const value in condition) {
        callback(() => {
          this.causalService.serviceMethod2().subscribe()
        });
      }
    }
  }

  method2() {}
}
"#;

        let source_map = SourceMap::default();
        let source_file = source_map.new_source_file(FileName::Anon, source.into());
        let mut parser = parsing_utils::default_parser(&source_file);

        let module = parsing_utils::get_module(&mut parser, &source_map).unwrap();
        let exports = parsing_utils::get_module_exports(module);
        let class = parsing_utils::get_first_exported_class(exports).unwrap();

        let usages: Vec<_> = parsing_utils::get_class_methods(class)
            .flat_map(|method| {
                get_service_usages_in_method(
                    &method,
                    &source_map,
                    &Regex::new(r#"this.causalService.(\w+)"#).unwrap(),
                )
                .unwrap()
            })
            .collect();

        assert_eq!(usages.len(), 2);

        assert!(usages.contains(&ServiceUsage {
            used_service: "serviceMethod1".into(),
            component_method_signature: "method1(): any".into(),
            location: LineLoc { line: 4, col: 4 },
        }));

        assert!(usages.contains(&ServiceUsage {
            used_service: "serviceMethod2".into(),
            component_method_signature: "method1(): any".into(),
            location: LineLoc { line: 9, col: 10 },
        }));
    }

    #[test]
    fn getting_service_usages_from_source() {
        let source = r#"
import { Service } from './service';

export class Component {
    constructor(private service: Service) {}

    method1() {
        this.service.serviceMethod1();
        this.service.serviceMethod2();
    }

    method2() {}

    method3() {
        this.service.serviceMethod3();
    }
}
"#;

        let usages: Vec<_> = from_source(source.into()).unwrap().collect();

        assert_eq!(usages.len(), 3);
    }

    #[test]
    fn getting_causal_impact_service_usages_from_real_data() {
        let bytes = include_bytes!("./test_data/frontend/causal-impact/causal-impact.component.ts");
        let source = String::from_utf8(bytes.into()).unwrap();

        let mut usages: Vec<_> = from_source(source).unwrap().collect();
        usages.sort_by_key(|usage| usage.location.line);

        assert_eq!(usages.len(), 23);
    }
}
