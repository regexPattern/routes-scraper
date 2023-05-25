use regex::Regex;
use swc_common::{FileName, SourceMap, SourceMapper};
use swc_ecma_ast::{ClassMethod, ImportDecl, TsParamProp};

use crate::parsing_utils::{self, LineLoc, ParsingError};

#[derive(PartialEq, Debug)]
pub struct ServiceMethodUsage {
    used_service_method_name: String,
    signature: String,
    line_loc: LineLoc,
}

#[derive(thiserror::Error, PartialEq, Debug)]
pub enum FileError {
    #[error(transparent)]
    ParsingError(ParsingError),

    #[error("Missing named export of a component class")]
    MissingClassExport,

    #[error("Component class must have a constructor")]
    MissingClassConstructor,

    #[error("Missing service import from component directory")]
    MissingServiceImport,

    #[error("A component class must declare a service attribute in it's constructor")]
    ServiceNotStoredAsAttribute,
}

impl From<ParsingError> for FileError {
    fn from(err: ParsingError) -> Self {
        Self::ParsingError(err)
    }
}

pub fn parse(filename: FileName, source: String) -> Result<Vec<ServiceMethodUsage>, FileError> {
    let source_map = SourceMap::default();
    let source_file = source_map.new_source_file(filename, source);
    let mut parser = parsing_utils::default_parser(&source_file);

    let module = parsing_utils::get_module(&mut parser, &source_map)?;
    let mut exports = parsing_utils::get_module_exports(&module);

    let service_name = module
        .body
        .iter()
        .filter_map(|mod_item| mod_item.as_module_decl()?.as_import())
        .find_map(|import| get_component_service_class_name(import, &source_map))
        .ok_or(FileError::MissingServiceImport)?;

    let class_decl = exports
        .find_map(|export_decl| export_decl.decl.as_class())
        .ok_or(FileError::MissingClassExport)?;

    let constructor = class_decl
        .class
        .body
        .iter()
        .find_map(|class_member| class_member.as_constructor())
        .ok_or(FileError::MissingClassConstructor)?;

    #[allow(clippy::expect_used)]
    let service_class_name_re =
        Regex::new(&format!(r#"(\w+): {service_name}"#)).expect("Error compiling regex");

    let attribute_name = constructor
        .params
        .iter()
        .find_map(|param| {
            get_service_attribute_name(
                param.as_ts_param_prop()?,
                &source_map,
                &service_class_name_re,
            )
        })
        .ok_or(FileError::ServiceNotStoredAsAttribute)?;

    #[allow(clippy::expect_used)]
    let service_attribute_name_re =
        Regex::new(&format!(r#"this.{attribute_name}.(\w+)"#)).expect("Error compiling regex");

    let usages = parsing_utils::get_class_methods(class_decl).flat_map(|method| {
        get_method_service_usages(method, &source_map, &service_attribute_name_re)
    });

    Ok(usages.collect())
}

fn get_component_service_class_name(import: &ImportDecl, source_map: &SourceMap) -> Option<String> {
    lazy_static::lazy_static! {
        static ref RE: Regex = Regex::new(r#"import\s?\{\s?(.*Service)\s?}\s?from\s?'./.*'"#).unwrap();
    }

    let import_str = source_map.span_to_snippet(import.span).ok()?;

    RE.captures(&import_str)?
        .get(1)
        .map(|capture| capture.as_str().to_owned())
}

fn get_service_attribute_name(
    param: &TsParamProp,
    source_map: &SourceMap,
    service_class_name_re: &Regex,
) -> Option<String> {
    let param_str = source_map.span_to_snippet(param.span).ok()?;

    service_class_name_re
        .captures(&param_str)?
        .get(1)
        .map(|capture| capture.as_str().to_owned())
}

fn get_method_service_usages(
    method: &ClassMethod,
    source_map: &SourceMap,
    service_attribute_name_re: &Regex,
) -> impl Iterator<Item = ServiceMethodUsage> {
    // TODO: Remove this unwrap.
    let body = method.function.body.as_ref().unwrap();
    let expr_stmts = body.stmts.iter().filter_map(|stmt| stmt.as_expr());

    let usages: Vec<_> = expr_stmts
        .filter_map(|stmt| {
            let stmt_str = source_map.span_to_snippet(stmt.span).ok()?;

            let used_service_method_name = service_attribute_name_re
                .captures(&stmt_str)?
                .get(1)
                .map(|capture| capture.as_str().to_owned())?;

            println!("{stmt_str}");

            Some(ServiceMethodUsage {
                used_service_method_name,
                signature: parsing_utils::gen_method_signature(method, source_map)?,
                line_loc: parsing_utils::get_span_line_loc(stmt.span, source_map),
            })
        })
        .collect();

    usages.into_iter()
}

#[cfg(test)]
mod tests {
    use include_bytes_plus::include_bytes;

    use super::*;

    #[test]
    fn getting_the_service_at_the_current_dir() {
        let imports_service_from_the_current_dir = r#"
import { Service } from './my.service';
"#;

        let imports_service_from_another_path = r#"
import { Service } from '../parent_dir';
"#;

        fn component_service_class_name_from_str(source: &str) -> Option<String> {
            let source_map = SourceMap::default();
            let source_file = source_map.new_source_file(FileName::Anon, source.to_string());
            let mut parser = parsing_utils::default_parser(&source_file);

            let module = parsing_utils::get_module(&mut parser, &source_map).unwrap();
            let import = module
                .body
                .into_iter()
                .find_map(|mod_item| mod_item.module_decl()?.import())
                .unwrap();

            get_component_service_class_name(&import, &source_map)
        }

        assert_eq!(
            component_service_class_name_from_str(imports_service_from_the_current_dir),
            Some("Service".to_string())
        );

        assert_eq!(
            component_service_class_name_from_str(imports_service_from_another_path),
            None
        );
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
        let source_file = source_map.new_source_file(FileName::Anon, source.to_string());
        let mut parser = parsing_utils::default_parser(&source_file);

        let module = parsing_utils::get_module(&mut parser, &source_map).unwrap();
        let exports = parsing_utils::get_module_exports(&module);
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
                get_service_attribute_name(
                    param.as_ts_param_prop()?,
                    &source_map,
                    &Regex::new(r#"(\w+): CausalService"#).unwrap(),
                )
            })
            .unwrap();

        assert_eq!(attribute_name, "causalService");
    }

    #[test]
    fn finding_usages_of_service_method_in_component_class_methods() {
        let source = r#"
export class Component {
  method1() {
    this.causalService.serviceMethod1().subscribe();
    this.causalService.serviceMethod2().subscribe();
  }

  method2() {}
}
"#;

        let source_map = SourceMap::default();
        let source_file = source_map.new_source_file(FileName::Anon, source.to_string());
        let mut parser = parsing_utils::default_parser(&source_file);

        let module = parsing_utils::get_module(&mut parser, &source_map).unwrap();
        let exports = parsing_utils::get_module_exports(&module);
        let class_decl = parsing_utils::get_first_exported_class(exports).unwrap();

        let usages: Vec<_> = parsing_utils::get_class_methods(&class_decl)
            .flat_map(|method| {
                get_method_service_usages(
                    &method,
                    &source_map,
                    &Regex::new(r#"this.causalService.(\w+)"#).unwrap(),
                )
            })
            .collect();

        assert_eq!(usages.len(), 2);

        assert_eq!(
            &usages[0],
            &ServiceMethodUsage {
                used_service_method_name: "serviceMethod1".to_string(),
                signature: "method1(): any".to_string(),
                line_loc: LineLoc { line: 4, col: 4 },
            }
        );

        assert_eq!(
            &usages[1],
            &ServiceMethodUsage {
                used_service_method_name: "serviceMethod2".to_string(),
                signature: "method1(): any".to_string(),
                line_loc: LineLoc { line: 5, col: 4 },
            }
        );
    }

    #[test]
    fn parsing_a_component() {
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

        let usages = parse(FileName::Anon, source.to_string()).unwrap();

        assert_eq!(usages.len(), 3);
    }

    #[test]
    fn getting_causal_impact_component_methods() {
        let bytes = include_bytes!("./test_data/frontend/causal-impact/causal-impact.component.ts");
        let source = String::from_utf8(bytes.into()).unwrap();

        let usages = parse(FileName::Anon, source).unwrap();

        assert_eq!(usages.len(), 20);
    }
}
