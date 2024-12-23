import {
  Errors,
  FormContext,
  Numberfield,
  Description,
  Label,
} from "@bpmn-io/form-js";

import { formFieldClasses, prefixId } from "../shared/utils";

import { html, useContext } from "diagram-js/lib/ui";
import RangeIcon from "../../../assets/svg/range.svg";
import "../../../assets/css/range.css";

export const rangeType = "rangeField";

/*
 * This is the rendering part of the custom field. We use `htm` to
 * to render our components without the need of extra JSX transpilation.
 */
export function Range(props) {

  // #region Constants
  const { disabled, errors = [], field, readonly, value } = props;
  const { description, range = {}, id, label } = field;
  const { min, max, step } = range;
  const { formId } = useContext(FormContext);
  const errorMessageId =
    errors.length === 0 ? undefined : `${prefixId(id, formId)}-error-message`;
  // #endregion

  const onChange = ({ target }) => {
    console.log("onChange", target);
    props.onChange({
      field,
      value: Number(target.value),
    });
  };

  return html`<div class=${formFieldClasses(rangeType)}>
    <${Label} id=${prefixId(id, formId)} label=${label} />
    <div class="range-group">
      <input
        type="range"
        disabled=${disabled}
        id=${prefixId(id, formId)}
        max=${max}
        min=${min}
        onInput=${onChange}
        readonly=${readonly}
        value=${value}
        step=${step}
      />
      <div class="range-value">${value}</div>
    </div>
    <${Description} description=${description} />
    <${Errors} errors=${errors} id=${errorMessageId} />
  </div>`;
}

/*
 * This is the configuration part of the custom field. It defines
 * the schema type, UI label and icon, palette group, properties panel entries
 * and much more.
 */
Range.config = {
  /* we can extend the default configuration of existing fields */
  ...Numberfield.config,
  type: rangeType,
  name: "Range",
  iconUrl: `data:image/svg+xml,${encodeURIComponent(RangeIcon)}`,
  propertiesPanelEntries: [
    "key",
    "label",
    "description",
    "min",
    "max",
    "disabled",
    "readonly",
  ],
};

