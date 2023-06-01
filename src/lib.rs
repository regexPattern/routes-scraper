pub mod backend;
pub mod frontend;
mod parsing_utils;

use std::path::{Path, PathBuf};

use frontend::FrontendDir;
use walkdir::{IntoIter, WalkDir};

pub fn search_api_url(
    frontend_root_dir: PathBuf,
    backend_root_dir: PathBuf,
    api_url_query: &str,
) -> anyhow::Result<()> {
    let backend_query_result = backend::search_route_definition(&backend_root_dir, api_url_query)?;

    let frontend_subdirs = children_at_depth_one(&frontend_root_dir)
        .filter_map(|entry| entry.ok())
        .filter(|entry| entry.file_type().is_dir());

    let mut frontend_query_result = None;

    for dir in frontend_subdirs {
        let path = dir.path();
        let frontend_files = WalkDir::new(path).max_depth(1);
        if let Ok(dir) = FrontendDir::try_from(frontend_files) {
            let query_result = frontend::search_constant(dir, api_url_query)?;

            if let Some(query_result) = query_result {
                frontend_query_result = Some(query_result);
                break;
            }
        }
    }

    dbg!(backend_query_result);
    dbg!(frontend_query_result);

    Ok(())
}

fn children_at_depth_one(path: &Path) -> IntoIter {
    WalkDir::new(path).min_depth(1).max_depth(1).into_iter()
}
