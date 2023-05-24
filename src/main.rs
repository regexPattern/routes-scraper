use swc_common::{FileName, SourceMap, SourceMapper};
use swc_ecma_ast::EsVersion;
use swc_ecma_parser::{lexer::Lexer, Parser, StringInput, Syntax, TsConfig};

fn main() {
    let source = r#"
class MyClass {
    myMethod(param1: number, param2: any): number {
        const variable = "value";
    }
}
"#;

    let source_map = SourceMap::default();
    let source_file = source_map.new_source_file(FileName::Anon, source.to_string());

    let lexer = Lexer::new(
        Syntax::Typescript(TsConfig::default()),
        EsVersion::EsNext,
        StringInput::from(&*source_file),
        None,
    );

    let mut parser = Parser::new_from(lexer);

    let script = parser.parse_script().unwrap();
    let stmts = script.body;

    let class = stmts
        .into_iter()
        .find_map(|stmt| stmt.decl().unwrap().class())
        .unwrap();

    let class_body = class.class.body;
    let my_method = class_body
        .into_iter()
        .find_map(|member| member.method())
        .unwrap();

    let span = my_method.span;

    let string = source_map.span_to_snippet(span).unwrap();
    println!("{string}");
}
