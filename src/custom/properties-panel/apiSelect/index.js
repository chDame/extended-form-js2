import { get, set } from "min-dash";
import { FeelEntry, isFeelEntryEdited } from '@bpmn-io/properties-panel';
import { html } from "diagram-js/lib/ui";
import { findGroupIdx } from "../utils";
import { apiSelectType } from "../../components/api-select";

/*
 * This is a custom properties provider for the properties panel.
 * It adds a new group `Range` with range specific properties.
 */
export class ApiSelectPropertiesProvider {
  constructor(propertiesPanel) {
    console.log("ApiSelectPropertiesProvider", propertiesPanel);
    propertiesPanel.registerProvider(this, 501);
  }

  //#region Function
  /**
   * Return the groups provided for the given field.
   *
   * @param {any} field
   * @param {function} editField
   *
   * @return {(Object[]) => (Object[])} groups middleware
   */
  getGroups(field, editField) {
    /**
     * We return a middleware that modifies
     * the existing groups.
     *
     * @param {Object[]} groups
     *
     * @return {Object[]} modified groups
     */
    return (groups) => {
      if (field.type === apiSelectType) {
        const generalIdx = findGroupIdx(groups, "general");

        /* insert apiSelect group after general */
        groups.splice(generalIdx + 1, 0, {
          id: "apiSelect",
          label: "Api Select",
          entries: ApiSelectEntries(field, editField),
        });
      }

      

      return groups;
    };
  }
}

ApiSelectPropertiesProvider.$inject = ["propertiesPanel"];

/*
 * collect apiSelect entries for our custom group
 */
function ApiSelectEntries(field, editField) {
  const onChange = (key) => {
    return (value) => {
      const apiSelect = get(field, ["apiSelect"], {});

      editField(field, ["apiSelect"], set(apiSelect, [key], value));
    };
  };

  const getValue = (key) => {
    return () => {
      return get(field, ["apiSelect", key]);
    };
  };

  return [
    {
      id: "apiSelect-src",
      component: Src,
      getValue,
      field,
      isEdited: isFeelEntryEdited,
      onChange,
    }
  ];
}

function Src(props) {
  const { field, getValue, id, onChange } = props;

  const debounce = (fn) => fn;

  return html`<${FeelEntry}
    id=${id}
    element=${field}
    getValue=${getValue("optionsSrc")}
    label="API endpoint"
    setValue=${onChange("optionsSrc")}
    debounce=${debounce}
  />`;
}
