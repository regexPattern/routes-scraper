mod backend;
mod frontend;
mod parsing_utils;

use std::{collections::HashMap, fs, path::PathBuf};

use anyhow::Context;
use backend::RouteHandler;
use frontend::{FrontendConstant, FrontendPaths};
use serde::Serialize;
use walkdir::WalkDir;

#[derive(Serialize, Debug)]
pub struct Route {
    #[serde(flatten)]
    pub frontend_constant: FrontendConstant,

    pub backend_handler: Option<RouteHandler>,
}

pub fn scrape_routes(
    frontend_root_dir: PathBuf,
    backend_root_dir: PathBuf,
) -> anyhow::Result<impl Iterator<Item = Route>> {
    let backend_handlers = RouteHandler::scrape_backend(&backend_root_dir)?;

    // REFACTOR: I don't like having to create an iterator just to get an adequate error.
    fs::read_dir(&frontend_root_dir)
        .with_context(|| format!("Failed to read {:?}", frontend_root_dir))?;

    let mut api_url_to_backend_handler: HashMap<_, _> = backend_handlers
        .map(|route| (route.api_url.clone(), route))
        .collect();

    let frontend_subdirs = WalkDir::new(&frontend_root_dir)
        .min_depth(1)
        .max_depth(1)
        .into_iter()
        .filter_map(|entry| entry.ok())
        .filter(|entry| entry.file_type().is_dir());

    let mut routes = vec![];

    for dir in frontend_subdirs {
        let files = WalkDir::new(dir.path()).max_depth(1);

        if let Ok(dir) = FrontendPaths::try_from(files) {
            for frontend_usage in FrontendConstant::scrape_dir(dir)? {
                let backend_handler = api_url_to_backend_handler
                    .remove(&frontend_usage.definition.data.backend_api_url);

                routes.push(Route {
                    frontend_constant: frontend_usage,
                    backend_handler,
                });
            }
        }
    }

    Ok(routes.into_iter())
}
