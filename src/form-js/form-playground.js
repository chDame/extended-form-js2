import { FormPlayground as FP } from "@bpmn-io/form-js";
import BaseForm from "./base-form";

export class FormPlayground extends BaseForm {
  constructor(options, isAdditionalModules = true) {
    console.log("Initializing FormViewer with options:", options);
    super(FP, options, "FormPlayground", isAdditionalModules);
  }
}

export default Form;
