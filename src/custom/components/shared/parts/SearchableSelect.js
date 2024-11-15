import { useCallback, useEffect, useMemo, useRef, useState } from 'preact/hooks';

import { useService, useCleanupSingleSelectValue, useGetLabelCorrelation, useOptionsAsync, LOAD_STATES } from '../hooks';

import classNames from 'classnames';

import XMarkIcon from '.../../../../assets/svg/XMark.svg';
import AngelDownIcon from '../../../../assets/svg/AngelDown.svg';
import AngelUpIcon from '../../../../assets/svg/AngelUp.svg';
import { DropdownList } from './DropdownList';
import { html } from "diagram-js/lib/ui";

export function SearchableSelect(props) {
  const { domId, disabled, errors, onBlur, onFocus, field, readonly, value } = props;

  const [filter, setFilter] = useState('');
  const [isDropdownExpanded, setIsDropdownExpanded] = useState(false);
  const [isFilterActive, setIsFilterActive] = useState(true);
  const [isEscapeClosed, setIsEscapeClose] = useState(false);

  /** @type {import("preact").RefObject<HTMLInputElement>} */
  const searchbarRef = useRef();
  const eventBus = useService('eventBus');

  const { loadState, options } = buildLoadedState(field.values);//useOptionsAsync(field);

  useCleanupSingleSelectValue({
    field,
    loadState,
    options,
    value,
    onChange: props.onChange,
  });

  const getLabelCorrelation = useGetLabelCorrelation(options);

  const label = useMemo(() => value && getLabelCorrelation(value), [value, getLabelCorrelation]);

  // whenever we change the underlying value, set the label to it
  useEffect(() => {
    setFilter(label || '');
  }, [label]);

  const filteredOptions = useMemo(() => {
    if (loadState !== LOAD_STATES.LOADED) {
      return [];
    }

    if (!filter || !isFilterActive) {
      return options;
    }

    return options.filter(
      (option) => option.label && option.value && option.label.toLowerCase().includes(filter.toLowerCase()),
    );
  }, [filter, loadState, options, isFilterActive]);

  const pickOption = useCallback(
    (option) => {
      setFilter((option && option.label) || '');
      props.onChange({ value: (option && option.value) || null });
    },
    [props],
  );

  const displayState = useMemo(() => {
    const ds = {};
    ds.componentReady = !disabled && !readonly && loadState === LOAD_STATES.LOADED;
    ds.displayCross = ds.componentReady && value !== null && value !== undefined;
    ds.displayDropdown = !disabled && !readonly && isDropdownExpanded && !isEscapeClosed;
    return ds;
  }, [disabled, isDropdownExpanded, isEscapeClosed, loadState, readonly, value]);

  const onAngelMouseDown = useCallback(
    (e) => {
      setIsEscapeClose(false);
      setIsDropdownExpanded(!isDropdownExpanded);

      const searchbar = searchbarRef.current;
      isDropdownExpanded ? searchbar.blur() : searchbar.focus();

      e.preventDefault();
    },
    [isDropdownExpanded],
  );

  const onInputChange = ({ target }) => {
    setIsEscapeClose(false);
    setIsDropdownExpanded(true);
    setIsFilterActive(true);
    setFilter(target.value || '');
    eventBus.fire('formField.search', { formField: field, value: target.value || '' });
  };

  const onInputKeyDown = useCallback(
    (keyDownEvent) => {
      switch (keyDownEvent.key) {
        case 'ArrowUp':
          keyDownEvent.preventDefault();
          break;
        case 'ArrowDown': {
          if (!isDropdownExpanded) {
            setIsDropdownExpanded(true);
            setIsFilterActive(false);
          }

          keyDownEvent.preventDefault();
          break;
        }
        case 'Escape':
          setIsEscapeClose(true);
          break;
        case 'Enter':
          if (isEscapeClosed) {
            setIsEscapeClose(false);
          }
          break;
      }
    },
    [isDropdownExpanded, isEscapeClosed],
  );

  const onInputMouseDown = useCallback(() => {
    setIsEscapeClose(false);
    setIsDropdownExpanded(true);
    setIsFilterActive(false);
  }, []);

  const onInputFocus = useCallback(() => {
    setIsEscapeClose(false);
    setIsDropdownExpanded(true);
    onFocus && onFocus();
  }, [onFocus]);

  const onInputBlur = useCallback(() => {
    setIsDropdownExpanded(false);
    setFilter(label || '');
    onBlur && onBlur();
  }, [onBlur, label]);

  const crossMouseDown = useCallback(
    (e) => {
      pickOption(null);
      e.stopPropagation();
    }, [onMouseDown, readonly]);

  const getLabel = useCallback(
    (option) => {
      return option.label;
    },
    [props],
  );
  const selectOption = useCallback(
    (option) => {
      pickOption(option);
      setIsDropdownExpanded(false);
    },
    [props],
  );
  return html`
      <div
        class=${classNames('fjs-input-group', { disabled: disabled, readonly: readonly }, { hasErrors: errors.length })}>
        <input
          disabled=${disabled}
          readOnly=${readonly}
          class="fjs-input"
          ref=${searchbarRef}
          id=${domId}
          onChange=${onInputChange}
          type="text"
          value=${filter}
          placeholder={'Search'}
          autoComplete="off"
          onKeyDown=${onInputKeyDown}
          onMouseDown=${onInputMouseDown}
          onFocus=${onInputFocus}
          onBlur=${onInputBlur}
          aria-describedby=${props['aria-describedby']}
        />
        ${displayState.displayCross && `
          <span
            class="fjs-select-cross"
            onMouseDown=${crossMouseDown}>
            <img width="8" src="data:image/svg+xml,${encodeURIComponent(XMarkIcon)}">
          </span>`}
        <span class="fjs-select-arrow" onMouseDown=${onAngelMouseDown}>
          <img width="8" src="data:image/svg+xml,${encodeURIComponent(displayState.displayDropdown ? AngelUpIcon : AngelDownIcon)}">
        </span>
      </div>
      <div class="fjs-select-anchor">
        ${displayState.displayDropdown && `
          <${DropdownList}
            values=${filteredOptions}
            getLabel=${getLabel}
            onValueSelected=${selectOption}
            listenerElement=${searchbarRef.current}
          />`}
      </div>
    `;
}