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
pub struct FrontendQueryResult {
    pub constant: ConstantDefinition,
    pub service: Option<ConstantServiceUsage>,
    pub component: Option<ConstantComponentUsage>,
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

impl FrontendQueryResult {
    pub fn search_constant(dir: FrontendDir, api_url_query: &str) -> anyhow::Result<Option<Self>> {
        let constants = parse_file_with(&dir.constants_path, Constant::scrape)?;
        let service_methods = parse_file_with(&dir.service_path, ServiceMethod::scrape)?;
        let service_usages = parse_file_with(&dir.component_path, ServiceUsage::scrape)?;

        let mut api_url_to_constant: HashMap<_, _> = constants
            .map(|constant| (constant.api_url.clone(), constant))
            .collect();

        // NOTE: If we want to implement fuzzy finding or substring equality for a given route query,
        // we would have to change this part.
        //
        let constant = match api_url_to_constant.remove(api_url_query) {
            Some(constant) => constant,
            None => return Ok(None),
        };

        let mut found_service_usage = None;
        let mut found_component_usage = None;

        let mut constant_name_to_service_method: HashMap<_, _> = service_methods
            .map(|method| (method.used_constant_name.clone(), method))
            .collect();

        if let Some(service_method) = constant_name_to_service_method.remove(&constant.name) {
            let mut method_name_to_usage: HashMap<_, _> = service_usages
                .map(|usage| (usage.used_service.clone(), usage))
                .collect();

            if let Some(service_usage) = method_name_to_usage.remove(&service_method.name) {
                found_component_usage = Some(ConstantComponentUsage {
                    method_signature: service_usage.component_method_signature,
                    file_path: dir.component_path,
                    usage_line_nr: service_usage.location.line,
                });
            }

            found_service_usage = Some(ConstantServiceUsage {
                method_signature: service_method.signature,
                file_path: dir.service_path,
            });
        }

        let query_result = FrontendQueryResult {
            constant: ConstantDefinition {
                api_url: constant.api_url,
                name: constant.name,
                path: dir.constants_path,
            },
            service: found_service_usage,
            component: found_component_usage,
        };

        Ok(Some(query_result))
    }
}

pub fn search_constant(
    dir: FrontendDir,
    api_url_query: &str,
) -> anyhow::Result<Option<FrontendQueryResult>> {
    let constants = parse_file_with(&dir.constants_path, Constant::scrape)?;
    let service_methods = parse_file_with(&dir.service_path, ServiceMethod::scrape)?;
    let service_usages = parse_file_with(&dir.component_path, ServiceUsage::scrape)?;

    let mut api_url_to_constant: HashMap<_, _> = constants
        .map(|constant| (constant.api_url.clone(), constant))
        .collect();

    // NOTE: If we want to implement fuzzy finding or substring equality for a given route query,
    // we would have to change this part.
    //
    let constant = match api_url_to_constant.remove(api_url_query) {
        Some(constant) => constant,
        None => return Ok(None),
    };

    let mut service_info = None;
    let mut component_info = None;

    let mut constant_name_to_service_method: HashMap<_, _> = service_methods
        .map(|method| (method.used_constant_name.clone(), method))
        .collect();

    if let Some(service_method) = constant_name_to_service_method.remove(&constant.name) {
        let mut method_name_to_usage: HashMap<_, _> = service_usages
            .map(|usage| (usage.used_service.clone(), usage))
            .collect();

        if let Some(service_usage) = method_name_to_usage.remove(&service_method.name) {
            component_info = Some(ConstantComponentUsage {
                method_signature: service_usage.component_method_signature,
                file_path: dir.component_path,
                usage_line_nr: service_usage.location.line,
            });
        }

        service_info = Some(ConstantServiceUsage {
            method_signature: service_method.signature,
            file_path: dir.service_path,
        });
    }

    let constant_usage = FrontendQueryResult {
        constant: ConstantDefinition {
            api_url: constant.api_url,
            name: constant.name,
            path: dir.constants_path,
        },
        service: service_info,
        component: component_info,
    };

    Ok(Some(constant_usage))
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
