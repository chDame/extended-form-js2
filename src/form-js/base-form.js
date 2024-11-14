import { RenderExtension, PropertiesPanelExtension } from "../custom";

class BaseForm {
  constructor(FormClass, options, type, isAdditionalModules = true) {
    console.log("Initializing BaseForm with options:", options);
    if (isAdditionalModules) {
      options.additionalModules = [
        ...(options.additionalModules || []),
        RenderExtension,
      ];
      if (type !== "Form") {
        options.additionalModules.push(PropertiesPanelExtension);
      }
    }
    this.customForm = new FormClass(options);
  }

  importSchema(schema, data) {
    console.log("Importing schema with data:", data);
    return this.customForm.importSchema(schema, data);
  }

  saveSchema() {
    console.info("Saving schema...");
    const result = this.customForm.saveSchema
      ? this.customForm.saveSchema()
      : null;
    console.info("Schema saved:", result);
    return result;
  }

  on(event, ...args) {
    console.log(`Registering event: ${event}`);
    if (typeof args[0] === "function") {
      this.customForm.on(event, args[0]); // just a callback
    } else {
      this.customForm.on(event, args[0], args[1]); // prio and callback
    }
  }
}

export default BaseForm;
