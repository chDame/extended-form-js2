import { useCallback, useMemo, useRef, useState } from 'preact/hooks';
import classNames from 'classnames';
import { findIndex } from 'min-dash';
import { useOptionsAsync, LOAD_STATES, useCleanupSingleSelectValue, useGetLabelCorrelation  } from '../hooks';

import XMarkIcon from '../../../../assets/svg/XMark.svg';
import AngelDownIcon from '.../../../../assets/svg/AngelDown.svg';
import AngelUpIcon from '../../../../assets/svg/AngelUp.svg';
import { DropdownList } from './DropdownList';

export function SimpleSelect(props) {
  const { domId, disabled, errors, onBlur, onFocus, field, readonly, value } = props;

  const [isDropdownExpanded, setIsDropdownExpanded] = useState(false);
  const selectRef = useRef();

  /** @type {import("preact").RefObject<HTMLInputElement>} */
  const inputRef = useRef();

  const { loadState, options } = useOptionsAsync(field);

  useCleanupSingleSelectValue({
    field,
    loadState,
    options,
    value,
    onChange: props.onChange,
  });

  const getLabelCorrelation = useGetLabelCorrelation(options);

  const valueLabel = useMemo(() => value && getLabelCorrelation(value), [value, getLabelCorrelation]);

  const pickOption = useCallback(
    (option) => {
      props.onChange({ value: (option && option.value) || null });
    },
    [props],
  );

  const displayState = useMemo(() => {
    const ds = {};
    ds.componentReady = !disabled && !readonly && loadState === LOAD_STATES.LOADED;
    ds.displayCross = ds.componentReady && value !== null && value !== undefined;
    ds.displayDropdown = !disabled && !readonly && isDropdownExpanded;
    return ds;
  }, [disabled, isDropdownExpanded, loadState, readonly, value]);

  const onMouseDown = useCallback(
    (e) => {
      const input = inputRef.current;

      if (disabled || !input) {
        return;
      }

      setIsDropdownExpanded(!isDropdownExpanded);

      if (isDropdownExpanded) {
        input.blur();
      } else {
        input.focus();
      }

      e.preventDefault();
    },
    [disabled, isDropdownExpanded],
  );

  const initialFocusIndex = useMemo(
    () => (value && findIndex(options, (option) => option.value === value)) || 0,
    [options, value],
  );

  const onInputFocus = useCallback(() => {
    if (!readonly) {
      setIsDropdownExpanded(true);
      onFocus && onFocus();
    }
  }, [onFocus, readonly]);

  const onInputBlur = useCallback(() => {
    if (!readonly) {
      setIsDropdownExpanded(false);
      onBlur && onBlur();
    }
  }, [onBlur, readonly]);

  return (
    <>
      <div
        ref={selectRef}
        class={classNames('fjs-input-group', { disabled, readonly }, { hasErrors: errors.length })}
        onFocus={onInputFocus}
        onBlur={onInputBlur}
        onMouseDown={onMouseDown}>
        <div class={classNames('fjs-select-display', { 'fjs-select-placeholder': !value })} id={`${domId}-display`}>
          {valueLabel || 'Select'}
        </div>
        {!disabled && (
          <input
            ref={inputRef}
            id={domId}
            class="fjs-select-hidden-input"
            value={valueLabel}
            onFocus={onInputFocus}
            onBlur={onInputBlur}
            aria-describedby={props['aria-describedby']}
          />
        )}
        {displayState.displayCross && (
          <span
            class="fjs-select-cross"
            onMouseDown={(e) => {
              pickOption(null);
              e.stopPropagation();
            }}>
            <XMarkIcon />
          </span>
        )}
        <span class="fjs-select-arrow">{displayState.displayDropdown ? <AngelUpIcon /> : <AngelDownIcon />}</span>
      </div>
      <div class="fjs-select-anchor">
        {displayState.displayDropdown && (
          <DropdownList
            values={options}
            getLabel={(option) => option.label}
            initialFocusIndex={initialFocusIndex}
            onValueSelected={(option) => {
              pickOption(option);
              setIsDropdownExpanded(false);
            }}
            listenerElement={selectRef.current}
          />
        )}
      </div>
    </>
  );
}