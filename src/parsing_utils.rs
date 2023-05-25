use std::fmt::{self, Display, Formatter};

use swc_common::{Loc, SourceFile, SourceMap, SourceMapper, Span, Spanned};
use swc_ecma_ast::{ClassDecl, ClassMethod, EsVersion, ExportDecl, Module};
use swc_ecma_parser::{lexer::Lexer, Parser, StringInput, Syntax, TsConfig};

pub fn default_parser(source_file: &SourceFile) -> Parser<Lexer> {
    Parser::new_from(Lexer::new(
        Syntax::Typescript(TsConfig {
            decorators: true,
            ..Default::default()
        }),
        EsVersion::EsNext,
        StringInput::from(source_file),
        None,
    ))
}

#[derive(thiserror::Error, PartialEq, Debug)]
#[error("{msg} at {line_loc}")]
pub struct ParsingError {
    msg: String,
    line_loc: LineLoc,
}

#[derive(PartialEq, Debug)]
pub struct LineLoc {
    pub line: usize,
    pub col: usize,
}

impl Display for LineLoc {
    fn fmt(&self, f: &mut Formatter<'_>) -> fmt::Result {
        write!(f, "line {}, col {}", self.line, self.col)
    }
}

impl From<Loc> for LineLoc {
    fn from(loc: Loc) -> Self {
        Self {
            line: loc.line,
            col: loc.col_display,
        }
    }
}

pub fn get_module(
    parser: &mut Parser<Lexer>,
    source_map: &SourceMap,
) -> Result<Module, ParsingError> {
    parser.parse_module().map_err(|err| ParsingError {
        msg: err.kind().msg().to_string(),
        line_loc: get_span_line_loc(err.span(), source_map),
    })
}

pub fn get_module_exports(module: &Module) -> impl Iterator<Item = &ExportDecl> {
    module
        .body
        .iter()
        .filter_map(|mod_item| mod_item.as_module_decl()?.as_export_decl())
}

pub fn get_span_line_loc(span: Span, source_map: &SourceMap) -> LineLoc {
    LineLoc::from(source_map.lookup_char_pos(span.lo))
}

pub fn get_first_exported_class<'e>(
    mut exports: impl Iterator<Item = &'e ExportDecl>,
) -> Option<&'e ClassDecl> {
    exports.find_map(|export_decl| export_decl.decl.as_class())
}

pub fn get_class_methods(class: &ClassDecl) -> impl Iterator<Item = &ClassMethod> {
    class
        .class
        .body
        .iter()
        .filter_map(|class_member| class_member.as_method())
}

pub fn gen_method_signature(method: &ClassMethod, source_map: &SourceMap) -> Option<String> {
    let function = &method.function;
    let name = method.key.as_ident()?.sym.to_string();

    let params: Vec<_> = function
        .params
        .iter()
        .filter_map(|param| {
            let mut params_str = source_map.span_to_snippet(param.span).ok()?;

            if param.pat.as_ident()?.type_ann.is_none() {
                params_str.push_str(": any")
            }

            Some(params_str)
        })
        .collect();

    let return_type = if let Some(return_type) = function.return_type.as_ref() {
        source_map.span_to_snippet(return_type.span).ok()?
    } else {
        ": any".to_string()
    };

    Some(format!("{name}({}){return_type}", params.join(", ")))
}

#[cfg(test)]
mod tests {
    use swc_common::FileName;

    use super::*;

    #[test]
    fn parsing_an_es_module_with_a_syntax_error() {
        let source = r#"
function() {}
"#;

        let source_map = SourceMap::default();
        let source_file = source_map.new_source_file(FileName::Anon, source.to_string());
        let mut parser = default_parser(&source_file);

        let err = get_module(&mut parser, &source_map).unwrap_err();

        assert_eq!(err.to_string(), "Expected ident at line 2, col 8");
    }

    #[test]
    fn getting_a_methods_signature() {
        let source = r#"
export class Service {
    methodName(param1: number, param2: CustomType, param3): number {}
}
"#;

        let source_map = SourceMap::default();
        let source_file = source_map.new_source_file(FileName::Anon, source.to_string());
        let mut parser = default_parser(&source_file);

        let module = get_module(&mut parser, &source_map).unwrap();
        let exports = get_module_exports(&module);
        let class_decl = get_first_exported_class(exports).unwrap();

        let method = get_class_methods(&class_decl).next().unwrap();

        assert_eq!(
            gen_method_signature(&method, &source_map),
            Some("methodName(param1: number, param2: CustomType, param3: any): number".into())
        );
    }
}
