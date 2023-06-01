pub mod backend;
pub mod frontend;
mod parsing_utils;

use std::{
    collections::HashMap,
    path::{Path, PathBuf},
};

use backend::RouteDefinition;
use frontend::FrontendDir;
use walkdir::{IntoIter, WalkDir};

use crate::frontend::ConstantUsage;

#[derive(Debug)]
pub struct ApiUrl {
    pub frontend_usage: ConstantUsage,
    pub backend_route: Option<RouteDefinition>,
}

pub fn search_api_url(
    frontend_root_dir: PathBuf,
    backend_root_dir: PathBuf,
) -> anyhow::Result<impl Iterator<Item = ApiUrl>> {
    let backend_routes = RouteDefinition::scrape_backend(&backend_root_dir)?;
    let mut api_url_to_backend_route: HashMap<_, _> = backend_routes
        .map(|route| (route.full_api_url.clone(), route))
        .collect();

    let frontend_subdirs = children_at_depth_one(&frontend_root_dir)
        .filter_map(|entry| entry.ok())
        .filter(|entry| entry.file_type().is_dir());

    let mut results = vec![];

    for dir in frontend_subdirs {
        let path = dir.path();
        let frontend_files = WalkDir::new(path).max_depth(1);

        if let Ok(dir) = FrontendDir::try_from(frontend_files) {
            for constant in ConstantUsage::scrape_dir(dir)? {
                let backend_route = api_url_to_backend_route.remove(&constant.definition.api_url);

                results.push(ApiUrl {
                    frontend_usage: constant,
                    backend_route,
                });
            }
        }
    }

    Ok(results.into_iter())
}

fn children_at_depth_one(path: &Path) -> IntoIter {
    WalkDir::new(path).min_depth(1).max_depth(1).into_iter()
}
