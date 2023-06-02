use std::path::PathBuf;

use clap::Parser;

#[derive(Parser)]
#[command(author, version, about)]
struct Cli {
    /// Path to the frontend root directory.
    #[arg(long)]
    frontend: PathBuf,

    /// Path to the backend root directory with an `app.js` file.
    #[arg(long)]
    backend: PathBuf,

    api_url_query: Option<String>,
}

fn main() -> anyhow::Result<()> {
    let cli = Cli::parse();

    let api_urls: Vec<_> =
        routes_scraper::search_api_urls(cli.frontend, cli.backend, cli.api_url_query)?.collect();

    dbg!(api_urls);

    Ok(())
}
