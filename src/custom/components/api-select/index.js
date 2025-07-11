import {
  Description,
  Errors,
  Label,
  sanitizeSingleSelectValue,
  Select,
  useTemplateEvaluation
} from "@bpmn-io/form-js";

import { html } from "diagram-js/lib/ui";
import { SearchableSelect } from "../shared/parts/SearchableSelect";
import { SimpleSelect } from "../shared/parts/SimpleSelect";

import { formFieldClasses, createEmptyOptions } from "../shared/utils";
import ApiSelectIcon from "../../../assets/svg/apiSelect.svg";

export const apiSelectType = 'apiSelectField';
export const selectUrls = {};

export function ApiSelect(props) {
  const { disabled, errors = [], domId, onBlur, onFocus, field, onChange, readonly, value } = props;

  const { description, label, searchable = false, validate = {} } = field;

  const { required } = validate;

  const descriptionId = `${domId}-description`;
  const errorMessageId = `${domId}-error-message`;

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

  
  if (selectProps.field.apiSelect && selectProps.field.apiSelect.optionsSrc) {
    const optionsUrl = useTemplateEvaluation(selectProps.field.apiSelect.optionsSrc, { debug: true, strict: true });
    if ((!selectUrls[domId] || optionsUrl !== selectUrls[domId]) &&
      (isValidHttpUrl(optionsUrl) || isValidHttpUrl(window.location.origin+optionsUrl))) {
      selectUrls[domId] = optionsUrl;
      field.values = [];
      fetch(optionsUrl).then(response => {
        if (response.ok) {
          response.json().then(data => {
            field.values = data;
          });
        } else {
          console.log(response);
        }
      }).catch((error) => {
        console.log(error)
      });
    }
  }

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
