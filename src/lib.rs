pub mod backend;
pub mod frontend;
mod parsing_utils;

use std::{
    collections::HashMap,
    path::{Path, PathBuf},
};

use backend::RouteDefinition;
use frontend::{FrontendConstant, FrontendPaths};
use walkdir::{IntoIter, WalkDir};

#[derive(Debug)]
pub struct ApiUrl {
    pub frontend_usage: FrontendConstant,
    pub backend_route: Option<RouteDefinition>,
}

pub fn search_api_url(
    frontend_root_dir: PathBuf,
    backend_root_dir: PathBuf,
) -> anyhow::Result<impl Iterator<Item = ApiUrl>> {
    let backend_route_defs = RouteDefinition::scrape_backend(&backend_root_dir)?;
    let mut api_url_to_backend_route: HashMap<_, _> = backend_route_defs
        .map(|route| (route.api_url.clone(), route))
        .collect();

    let frontend_subdirs = children_at_depth_one(&frontend_root_dir)
        .filter_map(|entry| entry.ok())
        .filter(|entry| entry.file_type().is_dir());

    let mut results = vec![];

    for dir in frontend_subdirs {
        let files = WalkDir::new(dir.path()).max_depth(1);

        if let Ok(dir) = FrontendPaths::try_from(files) {
            for frontend_usage in FrontendConstant::scrape_dir(dir)? {
                let backend_route =
                    api_url_to_backend_route.remove(&frontend_usage.definition.api_url);

                results.push(ApiUrl {
                    frontend_usage,
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
