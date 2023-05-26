use std::path::{Path, PathBuf};

use clap::Parser;
use routes_scraper::frontend::{self, ConstantUsage, FrontendDir};
use tabled::{
    settings::{Rotate, Style},
    Table, Tabled,
};
use walkdir::{DirEntry, WalkDir};

#[derive(Parser)]
struct Cli {
    frontend: PathBuf,
    api_url_query: String,
}

fn main() -> anyhow::Result<()> {
    let cli = Cli::parse();

    let frontend_root = children_at_depth_one(&cli.frontend);
    let frontend_dirs = frontend_root
        .filter_map(|entry| entry.ok())
        .filter(|entry| entry.file_type().is_dir());

    let mut frontend_constant_usages = query_frontend_constant(frontend_dirs, &cli.api_url_query)?;
    let table_str = render_usage_table(frontend_constant_usages.next().unwrap());

    println!("{table_str}");

    Ok(())
}

fn children_at_depth_one(path: &Path) -> walkdir::IntoIter {
    WalkDir::new(path).min_depth(1).max_depth(1).into_iter()
}

fn query_frontend_constant(
    dirs: impl Iterator<Item = DirEntry>,
    api_url_query: &str,
) -> anyhow::Result<impl Iterator<Item = ConstantUsage>> {
    let mut usages = vec![];

    for dir in dirs {
        let path = dir.path();
        let files = WalkDir::new(path).max_depth(1);

        if let Some(dir) = FrontendDir::try_from(files).ok() {
            let usage = frontend::query_constant(dir, api_url_query)?;

            usages.push(usage);
        }
    }

    Ok(usages.into_iter())
}

#[derive(Default, Tabled)]
struct ConstantInfoTable {
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

fn render_usage_table(frontend_constant: ConstantUsage) -> String {
    let mut table = ConstantInfoTable::default();

    let frontend_constant = frontend_constant;

    if let Some(constant_info) = frontend_constant.constant_info {
        table.api_url = constant_info.api_url;
        table.constant_name = constant_info.name;
        table.constant_file = constant_info.file_path.to_string_lossy().to_string();
    }

    if let Some(service_info) = frontend_constant.service_info {
        table.service_method_signature = service_info.method_signature;
        table.service_file = service_info.file_path.to_string_lossy().to_string();
    }

    if let Some(component_info) = frontend_constant.component_info {
        table.component_method_signature = component_info.method_signature;
        table.component_file = component_info.file_path.to_string_lossy().to_string();
        table.usage_line_nr = component_info.usage_line_nr;
    }

    let mut table = Table::new([table]);

    table
        .with(Style::modern())
        .with(Rotate::Left)
        .with(Rotate::Top);

    table.to_string()
}
