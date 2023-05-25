use swc_common::{FileName, SourceMap};
use swc_ecma_ast::EsVersion;
use swc_ecma_parser::{lexer::Lexer, Parser, StringInput, Syntax, TsConfig};

fn main() {
    let source = r#"
@decorate()
export class Foo {

  @decorate()
  get name() {
    return "hello"
  }

  @decorate()
  sayHi() {
    return "hello"
  }
}

function decorate() {
  return function(target, {kind}) {
    console.log(target, kind)
  }
}
"#;

    let source_map = SourceMap::default();
    let source_file = source_map.new_source_file(FileName::Anon, source.to_string());

    let lexer = Lexer::new(
        Syntax::Typescript(TsConfig {
            tsx: false,
            decorators: true,
            dts: false,
            no_early_errors: true,
            disallow_ambiguous_jsx_like: true,
        }),
        EsVersion::Es2022,
        StringInput::from(&*source_file),
        None,
    );

    let mut parser = Parser::new_from(lexer);

    parser.parse_program().unwrap();
}
