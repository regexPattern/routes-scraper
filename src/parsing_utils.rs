use std::fmt::{self, Display, Formatter};

use swc_common::{Loc, SourceFile, SourceMap, SourceMapper, Span, Spanned};
use swc_ecma_ast::{ClassDecl, ClassMethod, EsVersion, ExportDecl, Module};
use swc_ecma_parser::{lexer::Lexer, Parser, StringInput, Syntax, TsConfig};

pub fn default_parser(source_file: &SourceFile) -> Parser<Lexer> {
    Parser::new_from(Lexer::new(
        Syntax::Typescript(TsConfig::default()),
        EsVersion::EsNext,
        StringInput::from(&*source_file),
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

pub fn module(parser: &mut Parser<Lexer>, source_map: &SourceMap) -> Result<Module, ParsingError> {
    parser.parse_module().map_err(|err| ParsingError {
        msg: err.kind().msg().to_string(),
        line_loc: span_line_loc(err.span(), &source_map),
    })
}

pub fn module_exports(
    parser: &mut Parser<Lexer>,
    source_map: &SourceMap,
) -> Result<Vec<ExportDecl>, ParsingError> {
    let module = module(parser, source_map)?;

    let exports = module
        .body
        .into_iter()
        .filter_map(|mod_item| mod_item.module_decl()?.export_decl());

    Ok(exports.collect())
}

pub fn span_line_loc(span: Span, source_map: &SourceMap) -> LineLoc {
    LineLoc::from(source_map.lookup_char_pos(span.lo))
}

pub fn first_exported_class(
    parser: &mut Parser<Lexer>,
    source_map: &SourceMap,
) -> Result<Option<ClassDecl>, ParsingError> {
    let exports = module_exports(parser, source_map)?;

    Ok(exports
        .into_iter()
        .find_map(|export_decl| export_decl.decl.class()))
}

pub fn class_methods(class: ClassDecl) -> impl Iterator<Item = ClassMethod> {
    class
        .class
        .body
        .into_iter()
        .filter_map(|class_member| class_member.method())
}

pub fn method_signature(method: &ClassMethod, source_map: &SourceMap) -> Option<String> {
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

    let return_type = function.return_type.as_ref()?;
    let return_type = source_map.span_to_snippet(return_type.span).ok()?;

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

        let err = module_exports(&mut parser, &source_map).unwrap_err();

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

        let class_decl = first_exported_class(&mut parser, &source_map).unwrap().unwrap();

        let method = class_methods(class_decl).next().unwrap();

        assert_eq!(
            method_signature(&method, &source_map),
            Some("methodName(param1: number, param2: CustomType, param3: any): number".into())
        );
    }
}
