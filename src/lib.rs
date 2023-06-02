pub mod backend;
pub mod frontend;
mod parsing_utils;

use std::{collections::HashMap, path::PathBuf};

use backend::RouteDefinition;
use frontend::{FrontendConstant, FrontendPaths};
use walkdir::WalkDir;

#[derive(Debug)]
pub struct ApiUrl {
    pub frontend_constant: FrontendConstant,
    pub backend_route: Option<RouteDefinition>,
}

pub fn search_api_urls(
    frontend_root_dir: PathBuf,
    backend_root_dir: PathBuf,
    search_query: Option<String>,
) -> anyhow::Result<impl Iterator<Item = ApiUrl>> {
    let backend_route_defs = RouteDefinition::scrape_backend(&backend_root_dir)?;
    let mut api_url_to_backend_route: HashMap<_, _> = backend_route_defs
        .map(|route| (route.api_url.clone(), route))
        .collect();

    let frontend_subdirs = WalkDir::new(&frontend_root_dir)
        .min_depth(1)
        .max_depth(1)
        .into_iter()
        .filter_map(|entry| entry.ok())
        .filter(|entry| entry.file_type().is_dir());

    let mut api_urls = vec![];

    for dir in frontend_subdirs {
        let files = WalkDir::new(dir.path()).max_depth(1);

        if let Ok(dir) = FrontendPaths::try_from(files) {
            for frontend_usage in FrontendConstant::scrape_dir(dir)? {
                let backend_route = api_url_to_backend_route
                    .remove(&frontend_usage.definition.data.backend_api_url);

                api_urls.push(ApiUrl {
                    frontend_constant: frontend_usage,
                    backend_route,
                });
            }
        }
    }

    if let Some(search_query) = search_query {
        api_urls = api_urls
            .into_iter()
            .filter(|api_url| api_url.frontend_constant.definition.data.name == search_query)
            .collect()
    };

    Ok(api_urls.into_iter())
}
