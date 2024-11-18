import { Range, rangeType } from "./range";
import { ApiSelect, apiSelectType } from "./api-select";

class RangeField {
  static $inject = ["formFields"];
  constructor(formFields) {
    formFields.register(rangeType, Range);
  }
}

class ApiSelectField {
  static $inject = ["formFields"];
  constructor(formFields) {
    formFields.register(apiSelectType, ApiSelect);
  }
}

export const RenderExtension = {
  __init__: [rangeType, apiSelectType],
  rangeField: ["type", RangeField],
  apiSelectField: ["type", ApiSelectField],
};
