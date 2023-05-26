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

#[derive(PartialEq, Debug)]
pub struct FrontendDir {
    pub constants_file: PathBuf,
    pub service_file: PathBuf,
    pub component_file: PathBuf,
}

#[derive(Default, Debug)]
pub struct ConstantUsage {
    pub constant_info: Option<ConstantInfo>,
    pub service_info: Option<ServiceInfo>,
    pub component_info: Option<ComponentInfo>,
}

#[derive(Debug)]
pub struct ConstantInfo {
    pub api_url: String,
    pub name: String,
    pub file_path: PathBuf,
}

#[derive(Debug)]
pub struct ServiceInfo {
    pub method_signature: String,
    pub file_path: PathBuf,
}

#[derive(Debug)]
pub struct ComponentInfo {
    pub method_signature: String,
    pub file_path: PathBuf,
    pub usage_line_nr: usize,
}

pub fn query_constant(dir: FrontendDir, api_url_query: &str) -> anyhow::Result<ConstantUsage> {
    let constants = parse_file_with(&dir.constants_file, constants::from_source)?;
    let service_methods = parse_file_with(&dir.service_file, service::from_source)?;
    let service_usages = parse_file_with(&dir.component_file, component::from_source)?;

    let mut constant_usage = ConstantUsage::default();

    let mut api_url_to_constant: HashMap<_, _> = constants
        .into_iter()
        .map(|constant| (constant.api_url.clone(), constant))
        .collect();

    let constant = match api_url_to_constant.remove(api_url_query) {
        Some(constant) => constant,
        None => return Ok(constant_usage),
    };

    let mut constant_name_to_service_method: HashMap<_, _> = service_methods
        .into_iter()
        .map(|method| (method.used_constant_name.clone(), method))
        .collect();

    if let Some(service_method) = constant_name_to_service_method.remove(&constant.name) {
        let mut method_name_to_usage: HashMap<_, _> = service_usages
            .into_iter()
            .map(|usage| (usage.used_service.clone(), usage))
            .collect();

        if let Some(service_usage) = method_name_to_usage.remove(&service_method.name) {
            constant_usage.component_info = Some(ComponentInfo {
                method_signature: service_usage.component_method_signature,
                file_path: dir.component_file,
                usage_line_nr: service_usage.location.line,
            });
        }

        constant_usage.service_info = Some(ServiceInfo {
            method_signature: service_method.signature,
            file_path: dir.service_file,
        });
    }

    constant_usage.constant_info = Some(ConstantInfo {
        api_url: constant.api_url,
        name: constant.name,
        file_path: dir.constants_file,
    });

    Ok(constant_usage)
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
            constants_file: find_file_with_suffix(files.iter(), "constants.ts")?,
            service_file: find_file_with_suffix(files.iter(), "service.ts")?,
            component_file: find_file_with_suffix(files.iter(), "component.ts")?,
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
    parser_fn(source).with_context(|| format!("Failed to parse {:?}", path))
}
