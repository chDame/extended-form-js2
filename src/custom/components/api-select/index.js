import {
  Description,
  Errors,
  Label,
  sanitizeSingleSelectValue,
  Select,
  useTemplateEvaluation
} from "@bpmn-io/form-js";
import { unaryTest } from 'feelin';

import { html } from "diagram-js/lib/ui";
import { SearchableSelect } from "../shared/parts/SearchableSelect";
import { SimpleSelect } from "../shared/parts/SimpleSelect";

import { formFieldClasses, createEmptyOptions, buildExpressionContext } from "../shared/utils";
import { useService } from "../shared/hooks";
import ApiSelectIcon from "../../../assets/svg/apiSelect.svg";

export const apiSelectType = 'apiSelect';

export function ApiSelect(props) {
  const { disabled, errors = [], domId, onBlur, onFocus, field, onChange, readonly, value } = props;

  const { description, label, searchable = false, validate = {} } = field;

  const { required } = validate;

  const descriptionId = `${domId}-description`;
  const errorMessageId = `${domId}-error-message`;
  const form = useService('form');
  const data = form !=null ? form._getState().data : null;

  const testUrl = useTemplateEvaluation(expression, { debug: true, strict: true });
  console.log(testUrl);

  const loadOptionsUrl = (expression, data = {}) => {
    console.log(expression);
    console.log(data);
    if (!expression) {
      return null;
    }

    if (!isString(expression) || !expression.startsWith('=')) {
      return null;
    }

    try {
      // cut off initial '='
      const result = unaryTest(expression.slice(1), data);

      return result;
    } catch (error) {
      this._eventBus.fire('error', { error });
      return null;
    }
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
  if (data) {
    let url = loadOptionsUrl(selectProps.field.apiSelect.optionsSrc, buildExpressionContext({
      this: data,
      data: data,
      i: [],
      parent: null,
    }));
    console.log(url);
  }
  field.values = [{ "label": "hard coded", "value": "hard" }];

  console.log("ApiSelect", selectProps);
  console.log(selectProps.field.apiSelect.optionsSrc);

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