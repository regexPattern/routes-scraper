use std::{
    collections::VecDeque,
    fmt::{self, Display, Formatter},
};

use swc_common::{Loc, SourceFile, SourceMap, SourceMapper, Span, Spanned};
use swc_ecma_ast::{ClassDecl, ClassMethod, EsVersion, ExportDecl, Expr, Module, VarDecl};
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
#[error("{msg}, at {line_loc}")]
pub struct ParsingError {
    msg: String,
    line_loc: LineLoc,
}

#[derive(Copy, Clone, PartialEq, Debug)]
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
        line_loc: line_loc_from_span(err.span(), source_map),
    })
}

pub fn get_esmodule_exports(module: Module) -> impl Iterator<Item = ExportDecl> {
    module
        .body
        .into_iter()
        .filter_map(|mod_item| mod_item.module_decl()?.export_decl())
}

pub fn get_commonjs_module_var_decls(module: Module) -> impl Iterator<Item = VarDecl> {
    module
        .body
        .into_iter()
        .filter_map(|module_item| module_item.stmt()?.decl()?.var().map(|var| *var))
}

pub fn var_with_pattern_value(var_decl: VarDecl, pattern: &str) -> Option<Expr> {
    let mut decls = VecDeque::from(var_decl.decls);
    let var_declarator = decls.pop_front()?;

    if var_declarator.name.as_ident()?.sym == *pattern {
        var_declarator.init.map(|init| *init)
    } else {
        None
    }
}

pub fn line_loc_from_span(span: Span, source_map: &SourceMap) -> LineLoc {
    LineLoc::from(source_map.lookup_char_pos(span.lo))
}

pub fn get_first_exported_class(
    mut exports: impl Iterator<Item = ExportDecl>,
) -> Option<ClassDecl> {
    exports.find_map(|export_decl| export_decl.decl.class())
}

pub fn get_class_methods(class: ClassDecl) -> impl Iterator<Item = ClassMethod> {
    class
        .class
        .body
        .into_iter()
        .filter_map(|class_member| class_member.method())
}

pub fn gen_method_name_and_signature(
    method: &ClassMethod,
    source_map: &SourceMap,
) -> Option<(String, String)> {
    let function = &method.function;
    let name = method.key.as_ident()?.sym.to_string();

    let params: Vec<_> = function
        .params
        .iter()
        .filter_map(|param| {
            let mut snippet = source_map.span_to_snippet(param.span).ok()?;

            if param.pat.as_ident()?.type_ann.is_none() {
                snippet.push_str(": any")
            }

            Some(snippet)
        })
        .collect();

    let return_type = if let Some(return_type) = function.return_type.as_ref() {
        source_map.span_to_snippet(return_type.span).ok()?
    } else {
        ": any".into()
    };

    let signature = format!("{name}({}){return_type}", params.join(", "));

    Some((name, signature))
}

#[cfg(test)]
pub mod testing_utils {
    use swc_common::{FileName, SourceMap};
    use swc_ecma_ast::{ClassDecl, ClassMethod, VarDecl};

    pub fn get_first_exported_class(source: &str) -> (ClassDecl, SourceMap) {
        let source_map = SourceMap::default();
        let source_file = source_map.new_source_file(FileName::Anon, source.into());
        let mut parser = super::default_parser(&source_file);

        let module = super::get_module(&mut parser, &source_map).unwrap();
        let exports = super::get_esmodule_exports(module);

        (
            super::get_first_exported_class(exports).unwrap(),
            source_map,
        )
    }

    pub fn get_class_methods(source: &str) -> (impl Iterator<Item = ClassMethod>, SourceMap) {
        let (class, source_map) = get_first_exported_class(source);
        (super::get_class_methods(class), source_map)
    }

    pub fn get_first_var_decl_commonjs(source: &str) -> (VarDecl, SourceMap) {
        let source_map = SourceMap::default();
        let source_file = source_map.new_source_file(FileName::Anon, source.into());
        let mut parser = super::default_parser(&source_file);

        let module = super::get_module(&mut parser, &source_map).unwrap();

        (
            super::get_commonjs_module_var_decls(module).next().unwrap(),
            source_map,
        )
    }
}

#[cfg(test)]
mod tests {
    use swc_common::FileName;

    use super::*;

    #[test]
    fn parsing_a_module_with_a_syntax_error() {
        let source = r#"
function() {}
"#;

        let source_map = SourceMap::default();
        let source_file = source_map.new_source_file(FileName::Anon, source.into());
        let mut parser = default_parser(&source_file);

        let err = get_module(&mut parser, &source_map).unwrap_err();

        assert_eq!(err.to_string(), "Expected ident, at line 2, col 8");
    }

    #[test]
    fn getting_a_methods_name_and_signature() {
        let source = r#"
export class Service {
    methodName(param1: number, param2: CustomType, param3): number {}
}
"#;

        let (mut methods, source_map) = testing_utils::get_class_methods(source);
        let method = methods.next().unwrap();

        let (name, signature) = gen_method_name_and_signature(&method, &source_map).unwrap();

        assert_eq!(name, "methodName");

        assert_eq!(
            signature,
            "methodName(param1: number, param2: CustomType, param3: any): number"
        );
    }
}
