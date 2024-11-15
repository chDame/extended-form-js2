import {
  Description,
  Errors,
  Label,
  sanitizeSingleSelectValue,
  Select,
} from "@bpmn-io/form-js";

import { html } from "diagram-js/lib/ui";
import { SearchableSelect } from "../shared/parts/SearchableSelect";
import { SimpleSelect } from "../shared/parts/SimpleSelect";

import { formFieldClasses, createEmptyOptions } from "../shared/utils";
import ApiSelectIcon from "../../../assets/svg/apiSelect.svg";

export const apiSelectType = 'apiSelect';

export function ApiSelect(props) {
  const { disabled, errors = [], domId, onBlur, onFocus, field, onChange, readonly, value } = props;

  const { description, label, searchable = false, validate = {} } = field;

  const { required } = validate;

  const descriptionId = `${domId}-description`;
  const errorMessageId = `${domId}-error-message`;

  const selectProps = {
    domId,
    disabled,
    errors,
    onBlur,
    onFocus,
    field,
    value,
    onChange,
    readonly,
    required,
    'aria-invalid': errors.length > 0,
    'aria-describedby': [descriptionId, errorMessageId].join(' '),
  };

  field.values = [{ "label": "hard coded", "value": "hard" }];

  console.log("ApiSelect", selectProps);

  return html`<div class=${formFieldClasses(apiSelectType, { errors, disabled, readonly })}
      onKeyDown=${(event) => {
      if (event.key === 'Enter') {
        event.preventDefault();
        event.stopPropagation();
      }
    }}>
      <${Label} htmlFor=${domId} label=${label} required=${required} />
      ${searchable ? html`<${SearchableSelect} ...${selectProps}/>` : html`<${SimpleSelect} ...${selectProps}/>`}
      <${Description} id=${descriptionId} description=${description} />
      <${Errors} errors=${errors} id=${errorMessageId} />
    </div>`;
}

ApiSelect.config = {
  ...Select.config,
  apiSelectType,
  keyed: true,
  name: 'ApiSelect',
  iconUrl: `data:image/svg+xml,${encodeURIComponent(ApiSelectIcon)}`,
  group: 'selection',
  emptyValue: null,
  sanitizeValue: sanitizeSingleSelectValue,
  create: (options = {}) => ({
    label: 'Select',
    ...createEmptyOptions(options),
  }),
  propertiesPanelEntries: [
    "key",
    "label",
    "description",
    "disabled",
    "readonly",
  ],
};