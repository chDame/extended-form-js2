import {
  Description,
  Errors,
  Label,
  sanitizeSingleSelectValue,
  Select,
  useTemplateEvaluation,
  userService
} from "@bpmn-io/form-js";
import { unaryTest } from 'feelin';

import { html } from "diagram-js/lib/ui";
import { SearchableSelect } from "../shared/parts/SearchableSelect";
import { SimpleSelect } from "../shared/parts/SimpleSelect";

import { formFieldClasses, createEmptyOptions, buildExpressionContext } from "../shared/utils";
import ApiSelectIcon from "../../../assets/svg/apiSelect.svg";

export const apiSelectType = 'apiSelect';

export function ApiSelect(props) {
  const { disabled, errors = [], domId, onBlur, onFocus, field, onChange, readonly, value } = props;

  const { description, label, searchable = false, validate = {} } = field;

  const { required } = validate;

  const descriptionId = `${domId}-description`;
  const errorMessageId = `${domId}-error-message`;
  const form = useService('form');
  console.log("form");
  console.log(form);
  console.log("end form");
  const isValidHttpUrl = (value) => {
    let url;

    try {
      url = new URL(value);
    } catch (_) {
      return false;
    }

    return url.protocol === "http:" || url.protocol === "https:";
  }

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

  field.values = [];
  if (selectProps.field.apiSelect && selectProps.field.apiSelect.optionsSrc) {
    const optionsUrl = useTemplateEvaluation(selectProps.field.apiSelect.optionsSrc, { debug: true, strict: true });
    console.log(optionsUrl);
    if (isValidHttpUrl(optionsUrl)) {
      try {
        fetch(optionsUrl).then(response => {
          console.log(response.json());
          field.values = response.json();
        });
       
      } catch (err) {
      }
    }
  }

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
    "required"
  ],
};