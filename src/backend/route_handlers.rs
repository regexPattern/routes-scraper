use std::collections::VecDeque;

use swc_common::{FileName, SourceMap};

use crate::parsing_utils;

#[derive(thiserror::Error, PartialEq, Debug)]
enum FileSpecError {
    #[error("Variable named `wrapper` not defined")]
    MissingHandlersWrapper,

    #[error("Handlers wrapper must be an arrow function")]
    HandlersWrapperNotAnArrowFunc,
}

pub fn scrape(source: String) -> anyhow::Result<()> {
    let source_map = SourceMap::default();
    let source_file = source_map.new_source_file(FileName::Anon, source);
    let mut parser = parsing_utils::default_parser(&source_file);

    let module = parsing_utils::get_module(&mut parser, &source_map)?;
    let mut var_decls = parsing_utils::get_commonjs_module_var_decls(module);

    let wrapper = var_decls.find_map(|var_decl| {
        // TODO: I do this same thing for frontend constants, so maybe I should move this to
        // parsing_utils instead. At least the identifier part, because here I cast to an arrow
        // function rather than an object literal as I do for the constants.
        //
        let mut decls = VecDeque::from(var_decl.decls);
        let var_declarator = decls.pop_front()?;

        if var_declarator.name.as_ident()?.sym == *"wrapper" {
            var_declarator.init?.arrow()
        } else {
            None
        }
    });

    Ok(())
}

#[cfg(test)]
mod tests {
    use super::*;

    #[test]
    #[should_panic(expected = "Variable named `wrapper` not defined")]
    fn a_route_handler_file_must_have_a_wrapper_variable() {
        let source = r#"
"#;

        scrape(source.into()).unwrap();
    }

    #[test]
    #[should_panic(expected = "Handlers wrapper must be an arrow function")]
    fn handlers_wrapper_must_be_an_arrow_function() {
        let source = r#"
const wrapper = 10;
"#;

        scrape(source.into()).unwrap();
    }
}
