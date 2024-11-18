import { Range, rangeType } from "./range";
import { ApiSelect, apiSelectType } from "./api-select";

class RangeField {
  constructor(formFields) {
    formFields.register(rangeType, Range);
  }
}

class ApiSelectField {
  constructor(formFields) {
    formFields.register(apiSelectType, ApiSelect);
  }
}

export const RenderExtension = {
  __init__: ["rangeField", "apiSelectField"],
  rangeField: ["type", RangeField],
  apiSelectField: ["type", ApiSelectField],
};
