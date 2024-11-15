import {
  Description,
  Errors,
  Label,
  sanitizeSingleSelectValue,
  Select,
} from "@bpmn-io/form-js";

import {
  SearchableSelect
} from "../parts/SearchableSelect";
import {
  SimpleSelect
} from "../parts/SimpleSelect";
import ApiSelectIcon from "../../../assets/svg/apiSelect.svg";

import { formFieldClasses, prefixId, createEmptyOptions } from "../utils";

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

  console.log("ApiSelect", selectProps);
  
  return (
    <div
      class={formFieldClasses(apiSelectType, { errors, disabled, readonly })}
      onKeyDown={(event) => {
        if (event.key === 'Enter') {
          event.preventDefault();
          event.stopPropagation();
        }
      }}>
      <Label htmlFor={domId} label={label} required={required} />
      {searchable ? <SearchableSelect {...selectProps} /> : <SimpleSelect {...selectProps} />}
      <Description id={descriptionId} description={description} />
      <Errors id={errorMessageId} errors={errors} />
    </div>
  );
}

Select.config = {
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
};