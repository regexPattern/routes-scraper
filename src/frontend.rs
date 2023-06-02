mod component;
mod constants;
mod service;

use std::{
    collections::HashMap,
    fs,
    path::{Path, PathBuf},
};

use anyhow::Context;
use walkdir::WalkDir;

use self::{component::ComponentMethod, constants::ConstantDef, service::ServiceMethod};

#[derive(PartialEq, Debug)]
pub struct FrontendPaths {
    pub constants: PathBuf,
    pub service: PathBuf,
    pub component: PathBuf,
}

#[derive(Debug)]
pub struct FrontendConstant {
    pub definition: WithPath<ConstantDef>,
    pub service_usage: Option<WithPath<ServiceMethod>>,
    pub component_usage: Option<WithPath<ComponentMethod>>,
}

#[derive(Clone, Debug)]
pub struct WithPath<D> {
    pub data: D,
    pub path: PathBuf,
}

impl FrontendConstant {
    pub fn scrape_dir(dir: FrontendPaths) -> anyhow::Result<impl Iterator<Item = Self>> {
        let constant_defs = scrape_file_with(&dir.constants, ConstantDef::scrape)?;
        let service_methods = scrape_file_with(&dir.service, ServiceMethod::scrape)?;
        let component_methods = scrape_file_with(&dir.component, ComponentMethod::scrape)?;

        let mut constant_name_to_service_methods: HashMap<String, Vec<ServiceMethod>> =
            HashMap::new();

        for method in service_methods {
            let methods_that_use_constant = constant_name_to_service_methods
                .entry(method.used_constant_name.clone())
                .or_default();

            methods_that_use_constant.push(method);
        }

        let mut service_method_name_to_component_method: HashMap<String, Vec<ComponentMethod>> =
            HashMap::new();

        for method in component_methods {
            let methods_that_use_service = service_method_name_to_component_method
                .entry(method.used_service_method_name.clone())
                .or_default();

            methods_that_use_service.push(method);
        }

        let frontend_constants = constant_defs.flat_map(move |constant_def| {
            bundle_constant_service_component_usages(
                constant_def,
                &mut constant_name_to_service_methods,
                &mut service_method_name_to_component_method,
                &dir,
            )
        });

        Ok(frontend_constants)
    }
}

fn bundle_constant_service_component_usages(
    constant_def: ConstantDef,
    constant_name_to_service_methods: &mut HashMap<String, Vec<ServiceMethod>>,
    service_method_name_to_component_method: &mut HashMap<String, Vec<ComponentMethod>>,
    paths: &FrontendPaths,
) -> impl Iterator<Item = FrontendConstant> {
    let mut frontend_constant_usages = vec![];

    let constant_usage = FrontendConstant {
        definition: WithPath {
            data: constant_def,
            path: paths.constants.clone(),
        },
        service_usage: None,
        component_usage: None,
    };

    let service_methods_where_const_is_used =
        match constant_name_to_service_methods.remove(&constant_usage.definition.data.name) {
            Some(usages) => usages,
            None => {
                frontend_constant_usages.push(constant_usage);
                return frontend_constant_usages.into_iter();
            }
        };

    for service_method in service_methods_where_const_is_used {
        let service_usage = WithPath {
            data: service_method,
            path: paths.service.clone(),
        };

        let component_methods_where_service_is_used =
            match service_method_name_to_component_method.remove(&service_usage.data.name) {
                Some(usages) => usages,
                None => {
                    frontend_constant_usages.push(FrontendConstant {
                        definition: constant_usage.definition.clone(),
                        service_usage: Some(service_usage),
                        component_usage: None,
                    });

                    break;
                }
            };

        for component_method in component_methods_where_service_is_used {
            frontend_constant_usages.push(FrontendConstant {
                definition: constant_usage.definition.clone(),
                service_usage: Some(service_usage.clone()),
                component_usage: Some(WithPath {
                    data: component_method,
                    path: paths.component.clone(),
                }),
            });
        }
    }

    frontend_constant_usages.into_iter()
}

#[derive(thiserror::Error, Debug)]
#[error("Missing '{0}' file")]
pub struct MissingFileError(String);

impl TryFrom<WalkDir> for FrontendPaths {
    type Error = MissingFileError;

    fn try_from(dir: WalkDir) -> Result<Self, Self::Error> {
        let files: Vec<_> = dir
            .into_iter()
            .filter_map(|entry| Some(entry.ok()?.into_path()))
            .collect();

        Ok(Self {
            constants: find_file_with_suffix(files.iter(), "constants.ts")?,
            service: find_file_with_suffix(files.iter(), "service.ts")?,
            component: find_file_with_suffix(files.iter(), "component.ts")?,
        })
    }
}

fn find_file_with_suffix<'p>(
    mut files: impl Iterator<Item = &'p PathBuf>,
    suffix: &str,
) -> Result<PathBuf, MissingFileError> {
    files
        .find(|path| path.to_string_lossy().ends_with(suffix))
        .cloned()
        .ok_or(MissingFileError(suffix.into()))
}

fn scrape_file_with<P, T>(path: &Path, parser_fn: P) -> anyhow::Result<T>
where
    P: Fn(String) -> anyhow::Result<T>,
{
    let source = fs::read_to_string(path)?;
    parser_fn(source).with_context(|| format!("Failed parsing {:?}", path))
}
