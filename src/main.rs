use std::path::PathBuf;

use clap::Parser;
use csv::Writer;

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

    /// Optional name of the constant to look for. As of now the matching filters based on strict
    /// equality of the given name.
    constant_name_query: Option<String>,

    /// Emit the results as CSV insted of JSON.
    #[arg(short, long)]
    csv: bool,
}

fn main() -> anyhow::Result<()> {
    let cli = Cli::parse();

    let frontend_dir = cli.frontend.unwrap_or(DEFAULT_FRONTEND_DIR.into());
    let backend_dir = cli.backend.unwrap_or(DEFAULT_BACKEND_DIR.into());

    let api_urls: Vec<_> =
        routes_scraper::search_api_urls(frontend_dir, backend_dir, cli.constant_name_query)?
            .collect();

    let output = if cli.csv {
        let mut csv_writer = Writer::from_writer(Vec::new());

        for api_url in api_urls {
            csv_writer.serialize(api_url)?;
        }

        csv_writer.flush()?;
        String::from_utf8(csv_writer.into_inner()?)?
    } else {
        serde_json::to_string(&api_urls)?
    };

    println!("{output}");

    Ok(())
}
