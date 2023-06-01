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

use self::{component::ServiceUsage, constants::Constant, service::ServiceMethod};

#[derive(PartialEq, Debug)]
pub struct FrontendDir {
    pub constants_path: PathBuf,
    pub service_path: PathBuf,
    pub component_path: PathBuf,
}

#[derive(Debug)]
pub struct ConstantUsage {
    pub definition: ConstantDefinition,
    pub service_usage: Option<ConstantServiceUsage>,
    pub component_usage: Option<ConstantComponentUsage>,
}

#[derive(Debug)]
pub struct ConstantDefinition {
    pub api_url: String,
    pub name: String,
    pub path: PathBuf,
}

#[derive(Debug)]
pub struct ConstantServiceUsage {
    pub method_signature: String,
    pub file_path: PathBuf,
}

#[derive(Debug)]
pub struct ConstantComponentUsage {
    pub method_signature: String,
    pub file_path: PathBuf,
    pub usage_line_nr: usize,
}

impl ConstantUsage {
    pub fn scrape_dir(dir: FrontendDir) -> anyhow::Result<impl Iterator<Item = Self>> {
        let constants = parse_file_with(&dir.constants_path, Constant::scrape)?;
        let service_methods = parse_file_with(&dir.service_path, ServiceMethod::scrape)?;
        let service_usages = parse_file_with(&dir.component_path, ServiceUsage::scrape)?;

        let mut constant_name_to_service_methods: HashMap<_, Vec<ServiceMethod>> = HashMap::new();

        for service_method in service_methods {
            let service_methods = constant_name_to_service_methods
                .entry(service_method.used_constant_name.clone())
                .or_default();

            service_methods.push(service_method);
        }

        let mut service_method_name_to_usages: HashMap<_, Vec<ServiceUsage>> = HashMap::new();

        for usage in service_usages {
            let service_usages = service_method_name_to_usages
                .entry(usage.used_service_method_name.clone())
                .or_default();

            service_usages.push(usage);
        }

        let constant_usages = constants.flat_map(move |constant| {
            bundle_constant_usages(
                constant,
                &mut constant_name_to_service_methods,
                &mut service_method_name_to_usages,
                &dir,
            )
        });

        Ok(constant_usages.into_iter())
    }
}

fn bundle_constant_usages(
    constant: Constant,
    constant_name_to_service_methods: &mut HashMap<String, Vec<ServiceMethod>>,
    service_method_name_to_usages: &mut HashMap<String, Vec<ServiceUsage>>,
    dir: &FrontendDir,
) -> impl Iterator<Item = ConstantUsage> {
    let service_methods =
        if let Some(methods) = constant_name_to_service_methods.remove(&constant.name) {
            methods
        } else {
            return vec![ConstantUsage {
                definition: ConstantDefinition {
                    api_url: constant.api_url,
                    name: constant.name,
                    path: dir.constants_path.clone(),
                },
                service_usage: None,
                component_usage: None,
            }]
            .into_iter();
        };

    let mut constant_usages = vec![];

    for method in service_methods {
        let service_usages =
            if let Some(usages) = service_method_name_to_usages.remove(&method.name) {
                usages
            } else {
                constant_usages.push(ConstantUsage {
                    definition: ConstantDefinition {
                        api_url: constant.api_url.clone(),
                        name: constant.name.clone(),
                        path: dir.constants_path.clone(),
                    },
                    service_usage: Some(ConstantServiceUsage {
                        method_signature: method.signature.clone(),
                        file_path: dir.service_path.clone(),
                    }),
                    component_usage: None,
                });
                break;
            };

        for usage in service_usages {
            constant_usages.push(ConstantUsage {
                definition: ConstantDefinition {
                    api_url: constant.api_url.clone(),
                    name: constant.name.clone(),
                    path: dir.constants_path.clone(),
                },
                service_usage: Some(ConstantServiceUsage {
                    method_signature: method.signature.clone(),
                    file_path: dir.service_path.clone(),
                }),
                component_usage: Some(ConstantComponentUsage {
                    method_signature: usage.component_method_signature,
                    file_path: dir.component_path.clone(),
                    usage_line_nr: usage.line_loc.line,
                }),
            });
        }
    }

    constant_usages.into_iter()
}

#[derive(thiserror::Error, Debug)]
#[error("Missing '{0}' file")]
pub struct MissingFileError(String);

impl TryFrom<WalkDir> for FrontendDir {
    type Error = MissingFileError;

    fn try_from(dir: WalkDir) -> Result<Self, Self::Error> {
        let files: Vec<_> = dir
            .into_iter()
            .filter_map(|entry| Some(entry.ok()?.into_path()))
            .collect();

        Ok(Self {
            constants_path: find_file_with_suffix(files.iter(), "constants.ts")?,
            service_path: find_file_with_suffix(files.iter(), "service.ts")?,
            component_path: find_file_with_suffix(files.iter(), "component.ts")?,
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

fn parse_file_with<P, T>(path: &Path, parser_fn: P) -> anyhow::Result<T>
where
    P: Fn(String) -> anyhow::Result<T>,
{
    let source = fs::read_to_string(path)?;
    parser_fn(source).with_context(|| format!("Failed parsing {:?}", path))
}

#[cfg(test)]
mod tests {
    use super::*;

    #[test]
    fn scraping_constants_from_real_data() {
        let dir = FrontendDir {
            constants_path: "./test_data/frontend/causal-impact/constants.ts".into(),
            service_path: "./test_data/frontend/causal-impact/causal.service.ts".into(),
            component_path: "./test_data/frontend/causal-impact/causal-impact.component.ts".into(),
        };

        let constants = ConstantUsage::scrape_dir(dir).unwrap();

        assert_eq!(constants.count(), 24);
    }
}
