use std::path::PathBuf;

use clap::Parser;
use csv::Writer;

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

    let api_urls = routes_scraper::search_api_urls(cli.frontend, cli.backend, cli.api_url_query)?;

    let mut csv_writer = Writer::from_writer(std::io::stdout());

    for api_url in api_urls {
        csv_writer.serialize(api_url)?;
    }

    csv_writer.flush()?;

    Ok(())
}
