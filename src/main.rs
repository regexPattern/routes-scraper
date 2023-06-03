use std::path::PathBuf;

use clap::Parser;

const DEFAULT_FRONTEND_DIR: &str = "./frontend";
const DEFAULT_BACKEND_DIR: &str = "./backend";

#[derive(Parser)]
#[command(author, version, about)]
struct Cli {
    /// Path to the frontend root directory. Defaults to `./frontend`.
    #[arg(long)]
    frontend: Option<PathBuf>,

    /// Path to the backend root directory with an `app.js` file. Defaults to `./backend`.
    #[arg(long)]
    backend: Option<PathBuf>,
}

fn main() -> anyhow::Result<()> {
    let cli = Cli::parse();

    let frontend_dir = cli.frontend.unwrap_or(DEFAULT_FRONTEND_DIR.into());
    let backend_dir = cli.backend.unwrap_or(DEFAULT_BACKEND_DIR.into());

    let api_urls: Vec<_> = routes_scraper::scrape_routes(frontend_dir, backend_dir)?.collect();

    let output = serde_json::to_string(&api_urls)?;

    println!("{output}");

    Ok(())
}
