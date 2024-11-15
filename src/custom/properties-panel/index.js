import { RangePropertiesProvider } from "./range";
import { ApiSelectPropertiesProvider } from "./apiSelect";

export const PropertiesPanelExtension = {
  __init__: [
    "rangePropertiesProvider", "apiSelectPropertiesProvider"
  ],
  rangePropertiesProvider: ["type", RangePropertiesProvider],
  apiSelectPropertiesProvider: ["type", ApiSelectPropertiesProvider],
};
