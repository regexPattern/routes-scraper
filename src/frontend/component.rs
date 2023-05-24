use regex::Regex;
use swc_common::{FileName, SourceMap, SourceMapper};
use swc_ecma_ast::{ImportDecl, Param, TsParamProp};

use crate::parsing_utils::{self, LineLoc, ParsingError};

#[derive(PartialEq, Debug)]
pub struct ComponentMethod {
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
}

pub fn scrape(filename: FileName, source: String) -> Result<Vec<ComponentMethod>, FileError> {
    let source_map = SourceMap::default();
    let source_file = source_map.new_source_file(filename, source);
    let mut parser = parsing_utils::default_parser(&source_file);

    let module = parsing_utils::module(&mut parser, &source_map).unwrap();

    let service_name = module
        .body
        .iter()
        .filter_map(|mod_item| mod_item.as_module_decl()?.as_import())
        .find_map(|import| component_service_class_name(import, &source_map))
        .unwrap();

    let class_decl = parsing_utils::first_exported_class(&mut parser, &source_map)
        .map_err(FileError::ParsingError)?
        .ok_or(FileError::MissingClassConstructor)?;

    let service_type_re = Regex::new(&format!(r#"(\w+): {service_name}"#)).unwrap();

    let constructor = class_decl
        .class
        .body
        .iter()
        .find_map(|class_member| class_member.as_constructor())
        .ok_or(FileError::MissingClassConstructor)?;

    let attribute_name = constructor
        .params
        .iter()
        .find_map(|param| {
            service_attribute_name(param.as_ts_param_prop()?, &source_map, &service_type_re)
        })
        .unwrap();

    // let methods = parsing_utils::class_methods(class_decl).filter_map(|method| {
    // })

    Ok(vec![])
}

fn component_service_class_name(import: &ImportDecl, source_map: &SourceMap) -> Option<String> {
    lazy_static::lazy_static! {
        static ref RE: Regex = Regex::new(r#"import\s?\{\s?(.*Service)\s?}\s?from\s?'./.*'"#).unwrap();
    }

    let import_str = source_map.span_to_snippet(import.span).ok()?;

    RE.captures(&import_str)?
        .get(1)
        .map(|capture| capture.as_str().to_owned())
}

fn service_attribute_name(
    param: &TsParamProp,
    source_map: &SourceMap,
    service_type_re: &Regex,
) -> Option<String> {
    let param_str = source_map.span_to_snippet(param.span).ok()?;

    service_type_re
        .captures(&param_str)?
        .get(1)
        .map(|capture| capture.as_str().to_owned())
}

#[cfg(test)]
mod tests {
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

            let module = parsing_utils::module(&mut parser, &source_map).unwrap();
            let import = module
                .body
                .into_iter()
                .find_map(|mod_item| mod_item.module_decl()?.import())
                .unwrap();

            component_service_class_name(&import, &source_map)
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
    fn getting_attribute_that_stores_the_service() {
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

        let class_decl = parsing_utils::first_exported_class(&mut parser, &source_map)
            .unwrap()
            .unwrap();

        let constructor = class_decl
            .class
            .body
            .into_iter()
            .find_map(|class_member| class_member.constructor())
            .unwrap();

        let attribute_name = constructor
            .params
            .iter()
            .find_map(|param| {
                service_attribute_name(
                    param.as_ts_param_prop()?,
                    &source_map,
                    &Regex::new(r#"(\w+): CausalService"#).unwrap(),
                )
            })
            .unwrap();

        assert_eq!(attribute_name, "causalService");
    }
}
