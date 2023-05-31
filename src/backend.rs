mod app;
mod route_handlers;

use std::{
    fs,
    path::{Path, PathBuf},
};

use anyhow::Context;
use app::RouteWithHandler;

use self::route_handlers::RouteHandlerDefinition;

pub struct RouteHandler {
    api_url: String,
    file_path: PathBuf,
    line_nr: usize,
}

pub fn query_handler(backend_root_dir: &Path, api_url_query: &str) -> anyhow::Result<()> {
    let app_js_path = backend_root_dir.join("app.js");
    let app_js_source = fs::read_to_string(&app_js_path)?;

    let routes = RouteWithHandler::scrape(app_js_source)?;

    let mut handlers = vec![];

    for route in routes {
        let handler_path_from_app_js = route.handler_source_path.strip_prefix(".").unwrap();
        let handler_path_from_cwd = backend_root_dir
            .join(&handler_path_from_app_js)
            .with_extension("js");

        let handlers_src = fs::read_to_string(&handler_path_from_cwd)
            .with_context(|| format!("Failed reading {:?}", handler_path_from_cwd))?;

        handlers.extend(
            RouteHandlerDefinition::scrape(handlers_src)?.map(|handler| {
                let api_url = format!("{}/{}", route.base_url, handler.url_suffix);
                let line_loc = handler.line_loc;

                RouteHandler {
                    api_url,
                    file_path: handler_path_from_cwd.clone(),
                    line_nr: line_loc.line,
                }
            }),
        );
    }

    Ok(())
}
