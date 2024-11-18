import '@bpmn-io/form-js/dist/assets/form-js.css';
import '@bpmn-io/form-js/dist/assets/form-js-editor.css';
import { Form, FormEditor, FormPlayground } from "@bpmn-io/form-js";
import { RenderExtension, PropertiesPanelExtension } from "./custom";

export const newForm = (options) => {
  options.additionalModules = [
    ...(options.additionalModules || []),
    RenderExtension,
  ];
  return new Form(options);
}

export const newFormEditor = (options) => {
  options.additionalModules = [
    ...(options.additionalModules || []),
    RenderExtension,
  ];
  options.additionalModules.push(PropertiesPanelExtension);
  return new FormEditor(options);
}

export const newFormPlayground = (options) => {
  options.additionalModules = [
    ...(options.additionalModules || []),
    RenderExtension,
  ];
  options.additionalModules.push(PropertiesPanelExtension);
  return new FormPlayground(options);
}
