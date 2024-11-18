import { createContext } from 'preact';
import { useEffect, useContext, useCallback, useMemo, useRef } from 'preact/hooks';


import { runExpressionEvaluation } from '../utils';
import { hasEqualValue } from '../utils/sanitizerUtil';
import { normalizeOptionsData } from '../utils/optionsUtil';

import { isObject } from 'min-dash';
import isEqual from 'lodash/isEqual';




/**
 * @enum { String }
 */
export const LOAD_STATES = {
  LOADING: 'loading',
  LOADED: 'loaded',
  ERROR: 'error',
};

export const LocalExpressionContext = createContext({
  data: null,
  this: null,
  parent: null,
  i: null,
});

/**
 * @param {string} type
 * @param {boolean} [strict]
 *
 * @returns {any}
 */
function getService(type, strict) {}

export const FormContext = createContext({
  getService,
  formId: null,
});


/**
 * @template T
 * @param {string} type
 * @param {boolean} [strict=true]
 * @returns {T | null}
 */
export function useService(type, strict) {
  const { getService } = useContext(FormContext);

  return getService(type, strict);
}

export function useKeyDownAction(targetKey, action, listenerElement = window) {
  function downHandler({ key }) {
    if (key === targetKey) {
      action();
    }
  }

  useEffect(() => {
    listenerElement.addEventListener('keydown', downHandler);

    return () => {
      listenerElement.removeEventListener('keydown', downHandler);
    };
  });
}

export function useCleanupSingleSelectValue(props) {
  const { field, options, loadState, onChange, value } = props;

  // Ensures that the value is always one of the possible options
  useEffect(() => {
    if (loadState !== LOAD_STATES.LOADED) {
      return;
    }

    const optionValues = options.map((o) => o.value);
    const hasValueNotInOptions = value && !hasEqualValue(value, optionValues);

    if (hasValueNotInOptions) {
      onChange({
        field,
        value: null,
      });
    }
  }, [field, options, onChange, value, loadState]);
}

/**
 * This hook allows us to retrieve the label from a value in linear time by caching it in a map
 * @param {Array} options
 */
export function useGetLabelCorrelation(options) {
  // This allows us to retrieve the label from a value in linear time
  const labelMap = useMemo(
    () => Object.assign({}, ...options.map((o) => ({ [_getValueHash(o.value)]: o.label }))),
    [options],
  );
  return useCallback((value) => labelMap[_getValueHash(value)], [labelMap]);
}

const _getValueHash = (value) => {
  return isObject(value) ? JSON.stringify(value) : value;
};

/**
 * A custom hook to manage state changes with deep comparison.
 *
 * @template T
 * @param {T} value - The current value to manage.
 * @returns {T} - Returns the current state.
 */
export function useDeepCompareMemoize(value) {
  /** @type {import("preact").RefObject<T>} */
  const ref = useRef();

  if (!isEqual(value, ref.current)) {
    ref.current = value;
  }

  return ref.current;
}


export const buildErrorState = (error) => ({ options: [], error, loadState: LOAD_STATES.ERROR });

export const buildLoadedState = (options) => ({ options, error: undefined, loadState: LOAD_STATES.LOADED });