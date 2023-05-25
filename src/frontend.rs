use std::{collections::HashMap, fs, path::PathBuf};

use anyhow::Context;
use swc_common::FileName;
use walkdir::WalkDir;

mod component;
mod constants;
mod service;

pub fn find_constant(dir: FrontendDir, api_url_query: &str) -> anyhow::Result<()> {
    let mut constants = HashMap::new();
    let mut service_methods = HashMap::new();
    let mut service_usages = HashMap::new();

    if let Some(path) = dir.constants {
        let source = fs::read_to_string(&path)?;
        constants.extend(
            constants::parse(FileName::Real(path.clone()), source)
                .with_context(|| format!("Failed parsing constants file {:?}", path))?
                .into_iter()
                .map(|constant| (constant.api_url.clone(), constant)),
        );
    }

    if let Some(path) = dir.service {
        let source = fs::read_to_string(&path)?;
        let service = service::parse(FileName::Real(path.clone()), source)
            .with_context(|| format!("Failed parsing service file {:?}", path))?;
        service_methods.extend(
            service
                .methods
                .into_iter()
                .map(|method| (method.used_api_url_name.clone(), method)),
        );
    }

    let source = fs::read_to_string(&dir.component)?;
    service_usages.extend(
        component::parse(FileName::Real(dir.component.clone()), source)
            .with_context(|| format!("Failed parsing component file {:?}", dir.component))?
            .into_iter()
            .map(|usage| (usage.used_service.clone(), usage)),
    );

    Ok(())
}

#[derive(PartialEq, Debug)]
pub struct FrontendDir {
    pub constants: Option<PathBuf>,
    pub service: Option<PathBuf>,
    pub component: PathBuf,
}

impl TryFrom<WalkDir> for FrontendDir {
    type Error = ();

    fn try_from(walker: WalkDir) -> Result<Self, Self::Error> {
        let files: Vec<_> = walker
            .into_iter()
            .filter_map(|entry| Some(entry.ok()?.into_path()))
            .collect();

        let constants = find_file(files.iter(), "constants.ts").cloned();
        let service = find_file(files.iter(), "service.ts").cloned();
        let component = find_file(files.iter(), "component.ts").cloned().unwrap();

        Ok(Self {
            constants,
            service,
            component,
        })
    }
}

fn find_file<'p>(
    mut files: impl Iterator<Item = &'p PathBuf>,
    suffix: &str,
) -> Option<&'p PathBuf> {
    files.find(|path| path.to_string_lossy().ends_with(suffix))
}
