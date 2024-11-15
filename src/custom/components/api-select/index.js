import {
  Description,
  Errors,
  Label,
  sanitizeSingleSelectValue,
  Select,
} from "@bpmn-io/form-js";

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
};