use std::path::{Path, PathBuf};

use clap::Parser;
use routes_scraper::{
    backend,
    frontend::{self, FrontendDir, FrontendQueryResult},
};
use tabled::{
    settings::{Rotate, Style},
    Table, Tabled,
};
use walkdir::{DirEntry, WalkDir};

#[derive(Parser)]
#[command(author, version, about)]
struct Cli {
    /// Path to the frontend root directory.
    #[arg(short, long)]
    frontend: PathBuf,

    /// Path to the backend root directory with an `app.js` file.
    #[arg(short, long)]
    backend: PathBuf,

    /// API URL query.
    api_url_query: String,
}

fn main() -> anyhow::Result<()> {
    let cli = Cli::parse();

    let frontend_root = children_at_depth_one(&cli.frontend);
    let frontend_dirs = frontend_root
        .filter_map(|entry| entry.ok())
        .filter(|entry| entry.file_type().is_dir());

    // let frontend_constant_usage = query_frontend_constant(frontend_dirs, &cli.api_url_query)?;
    let backend_handler_def = backend::query_handler(&cli.backend, &cli.api_url_query)?;

    // if let Some(usage) = frontend_constant_usage {
    //     let table_str = render_usage_table(usage);
    //     println!("{table_str}");
    // } else {
    //     println!("No usages were found");
    // }

    Ok(())
}

fn children_at_depth_one(path: &Path) -> walkdir::IntoIter {
    WalkDir::new(path).min_depth(1).max_depth(1).into_iter()
}

fn query_frontend_constant(
    dirs: impl Iterator<Item = DirEntry>,
    api_url_query: &str,
) -> anyhow::Result<Option<FrontendQueryResult>> {
    for dir in dirs {
        let path = dir.path();
        let files = WalkDir::new(path).max_depth(1);

        if let Ok(dir) = FrontendDir::try_from(files) {
            let usage = frontend::query_constant(dir, api_url_query)?;

            if let Some(usage) = usage {
                return Ok(Some(usage));
            }
        }
    }

    Ok(None)
}

#[derive(Default, Tabled)]
struct UsageData {
    api_url: String,
    constant_name: String,
    constant_file: String,
    service_method_signature: String,
    service_file: String,
    component_method_signature: String,
    component_file: String,

    #[tabled(display_with("valid_line_nr"))]
    usage_line_nr: usize,
}

fn valid_line_nr(line_nr: &usize) -> String {
    if *line_nr == 0 {
        "".into()
    } else {
        line_nr.to_string()
    }
}

fn render_usage_table(frontend_constant: FrontendQueryResult) -> String {
    let mut usage_data = UsageData {
        api_url: frontend_constant.constant.api_url,
        constant_name: frontend_constant.constant.name,
        constant_file: frontend_constant
            .constant
            .file_path
            .to_string_lossy()
            .to_string(),
        ..Default::default()
    };

    if let Some(service_info) = frontend_constant.service {
        usage_data.service_method_signature = service_info.method_signature;
        usage_data.service_file = service_info.file_path.to_string_lossy().to_string();
    }

    if let Some(component_info) = frontend_constant.component {
        usage_data.component_method_signature = component_info.method_signature;
        usage_data.component_file = component_info.file_path.to_string_lossy().to_string();
        usage_data.usage_line_nr = component_info.usage_line_nr;
    }

    let mut table = Table::new([usage_data]);

    table
        .with(Style::modern())
        .with(Rotate::Left)
        .with(Rotate::Top);

    table.to_string()
}
