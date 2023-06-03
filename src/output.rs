use serde::ser::SerializeStruct;

use crate::ApiUrl;

impl serde::Serialize for ApiUrl {
    fn serialize<S>(&self, serializer: S) -> Result<S::Ok, S::Error>
    where
        S: serde::Serializer,
    {
        let mut state = serializer.serialize_struct("ApiUrl", 10)?;

        let constant_def = &self.frontend_constant.definition;
        let service_usage = &self.frontend_constant.service_usage;
        let component_usage = &self.frontend_constant.component_usage;

        state.serialize_field("api_url", &constant_def.data.api_url)?;

        state.serialize_field("constant_name", &constant_def.data.name)?;
        state.serialize_field("constant_file_path", &constant_def.path)?;
        state.serialize_field(
            "constant_definition_line_nr",
            &constant_def.data.line_loc.line,
        )?;

        state.serialize_field(
            "service_method_signature",
            &service_usage.as_ref().map(|method| &method.data.signature),
        )?;
        state.serialize_field(
            "service_file_path",
            &service_usage.as_ref().map(|method| &method.path),
        )?;
        state.serialize_field(
            "service_method_definition_line_nr",
            &service_usage
                .as_ref()
                .map(|method| &method.data.line_loc.line),
        )?;

        state.serialize_field(
            "component_method_signature",
            &component_usage
                .as_ref()
                .map(|method| &method.data.signature),
        )?;
        state.serialize_field(
            "component_file_path",
            &component_usage.as_ref().map(|method| &method.path),
        )?;
        state.serialize_field(
            "component_usage_line_nr",
            &component_usage
                .as_ref()
                .map(|method| &method.data.line_loc.line),
        )?;

        state.serialize_field(
            "backend_handler_file_path",
            &self.backend_route.as_ref().map(|route| &route.path),
        )?;

        state.end()
    }
}
