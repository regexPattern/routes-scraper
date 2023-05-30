# Routes Scraper

Search for a specific API URL in your fullstack application source, leveraging the power of [SWC](https://github.com/swc-project/swc) (what the NextJS's compiler uses) to accurately find usages of a given endpoint.

Your fullstack project must adhere to the specification that the example `test_data` project structure showcase. If your files don't follow this structure, you will get gentle and helpful errors when the scraper tries to parse these files.

## Installation

Ensure that you have the latest stable Rust toolchain installed. If you don't, you can get it through [rustup](https://rustup.rs/). Then run the following command (beware that Rust compile times are known to be lengthy):

```sh
cargo install --git https://github.com/regexPattern/routes-scraper
```

Remember that you should add your `$CARGO_HOME` to your shell path. Read more about this [here](https://rust-lang.github.io/rustup/installation/index.html).

## Usage 

The CLI application documents itself. The display the help menu pass the `--help` flag when running the command:

```sh
routes-scraper --help
```
