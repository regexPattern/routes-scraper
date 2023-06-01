use std::path::PathBuf;

use clap::Parser;

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

    let _api_urls: Vec<_> = routes_scraper::search_api_url(cli.frontend, cli.backend)?.collect();

    Ok(())
}
