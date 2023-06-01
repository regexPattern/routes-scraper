mod app;
mod route_handlers;

use std::{
    fs,
    path::{Path, PathBuf},
};

use anyhow::Context;
use app::RouteWithHandler;
use regex::Regex;

use self::route_handlers::RouteHandlerDefinition;

#[derive(Debug)]
pub struct RouteDefinition {
    pub full_api_url: String,
    pub path: PathBuf,
    pub line_nr: usize,
}

impl RouteDefinition {
    pub fn scrape_backend(backend_root_dir: &Path) -> anyhow::Result<impl Iterator<Item = Self>> {
        let app_js_path = backend_root_dir.join("app.js");
        let app_js_source = fs::read_to_string(&app_js_path)?;

        let routes = RouteWithHandler::scrape(app_js_source)?;

        let mut handlers = vec![];

        for route in routes {
            let handler_path_from_app_js = match route.handler_source_path.strip_prefix(".") {
                Ok(path) => path,
                _ => continue,
            };

            let handler_path_from_cwd = backend_root_dir
                .join(handler_path_from_app_js)
                .with_extension("js");

            let handlers_src = fs::read_to_string(&handler_path_from_cwd)
                .with_context(|| format!("Failed reading {:?}", handler_path_from_cwd))?;

            handlers.extend(
                RouteHandlerDefinition::scrape(handlers_src)?.map(|handler| {
                    let api_url =
                        format!("{}/{}", route.base_url, handler.url_suffix).replace("//", "/");

                    Self {
                        full_api_url: adapt_backend_api_url_to_frontend_format(&api_url),
                        path: handler_path_from_cwd.clone(),
                        line_nr: handler.line_loc.line,
                    }
                }),
            );
        }

        Ok(handlers.into_iter())
    }
}

fn adapt_backend_api_url_to_frontend_format(api_url: &str) -> String {
    lazy_static::lazy_static! {
        static ref SANITIZER_RE: Regex = Regex::new(r#":(\w+)(.*)"#).unwrap();
    }

    SANITIZER_RE.replace(api_url, "{{$1}}").to_string()
}

#[cfg(test)]
mod tests {
    use super::*;

    #[test]
    fn adapting_backend_api_with_query_params() {
        let frontend_api_url =
            adapt_backend_api_url_to_frontend_format("/api/causal/filters/:testId".into());

        assert_eq!(frontend_api_url, "/api/causal/filters/{{testId}}");
    }
}
