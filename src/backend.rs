mod app;
mod route_handlers;

use std::{
    fs,
    path::{Path, PathBuf},
};

use anyhow::Context;
use app::RouteWithHandler;
use serde::ser::{self, SerializeStruct};

use crate::parsing_utils::LineLoc;

use self::route_handlers::RouteHandlerDefinition;

#[derive(Debug)]
pub struct RouteHandler {
    pub api_url: String,
    pub path: PathBuf,
    pub line_loc: LineLoc,
}

impl RouteHandler {
    pub fn scrape_backend(backend_root_dir: &Path) -> anyhow::Result<impl Iterator<Item = Self>> {
        let app_js_path = backend_root_dir.join("app.js");
        let app_js_source = fs::read_to_string(&app_js_path)
            .with_context(|| format!("Failed to read {:?}", app_js_path))?;

        let route_w_handlers = RouteWithHandler::scrape(app_js_source)?;

        let mut route_defs = vec![];

        for route in route_w_handlers {
            let path_from_app_js = match route.handler_source_path.strip_prefix(".") {
                Ok(path) => path,
                _ => continue,
            };

            let handler_path_from_cwd =
                backend_root_dir.join(path_from_app_js).with_extension("js");

            let handlers_src = fs::read_to_string(&handler_path_from_cwd)
                .with_context(|| format!("Failed to read {:?}", handler_path_from_cwd))?;

            route_defs.extend(
                RouteHandlerDefinition::scrape(handlers_src)?.map(|handler_def| {
                    let api_url =
                        format!("{}/{}", route.base_url, handler_def.url_suffix).replace("//", "/");

                    Self {
                        api_url,
                        path: handler_path_from_cwd.clone(),
                        line_loc: handler_def.line_loc,
                    }
                }),
            );
        }

        Ok(route_defs.into_iter())
    }
}

impl ser::Serialize for RouteHandler {
    fn serialize<S>(&self, serializer: S) -> Result<S::Ok, S::Error>
    where
        S: serde::Serializer,
    {
        let mut state = serializer.serialize_struct("BackendHandler", 3)?;

        state.serialize_field("file_path", &self.path)?;
        state.serialize_field("file_location", &self.line_loc)?;

        state.end()
    }
}
