use std::path::PathBuf;

use clap::Parser;
use routes_scraper::frontend::{self, FrontendDir};
use walkdir::WalkDir;

#[derive(Parser)]
struct Cli {
    frontend: PathBuf,
}

fn main() {
    let cli = Cli::parse();

    let directories = WalkDir::new(cli.frontend)
        .min_depth(1)
        .max_depth(1)
        .into_iter();

    // let mut frontend_dirs = vec![];

    for subdir in directories.filter_entry(|entry| entry.file_type().is_dir()) {
        let subdir = if let Ok(subdir) = subdir {
            subdir
        } else {
            continue;
        };

        let files = WalkDir::new(subdir.path()).max_depth(1);
        frontend::find_constant(FrontendDir::try_from(files).unwrap(), "/api/causal/results")
            .unwrap();
    }
}
