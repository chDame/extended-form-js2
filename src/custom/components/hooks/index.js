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

/**
 * If the value is a valid expression, it is evaluated and returned. Otherwise, it is returned as-is.
 * The function is memoized to minimize re-renders.
 *
 * @param {any} value - A static value or expression to evaluate.
 * @returns {any} - Evaluated value or the original value if not an expression.
 */
export function useExpressionEvaluation(value) {
  const expressionLanguage = useService('expressionLanguage');
  const expressionContextInfo = useContext(LocalExpressionContext);
  return useMemo(
    () => runExpressionEvaluation(expressionLanguage, value, expressionContextInfo),
    [expressionLanguage, expressionContextInfo, value],
  );
}

/**
 * @typedef {Object} OptionsGetter
 * @property {Object[]} options - The options data
 * @property {(LOAD_STATES)} loadState - The options data's loading state, to use for conditional rendering
 */

/**
 * A hook to load options for single and multiselect components.
 *
 * @param {Object} field - The form field to handle options for
 * @return {OptionsGetter} optionsGetter - A options getter object providing loading state and options
 */
export function useOptionsAsync(field) {
  const { valuesExpression: optionsExpression, valuesKey: optionsKey, values: staticOptions } = field;

  const initialData = useService('form')._getState().initialData;
  const expressionEvaluation = useExpressionEvaluation(optionsExpression);
  const evaluatedOptions = useDeepCompareMemoize(expressionEvaluation || []);

  const optionsGetter = useMemo(() => {
    let options = [];

    // dynamic options
    if (optionsKey !== undefined) {
      const keyedOptions = (initialData || {})[optionsKey];
      if (keyedOptions && Array.isArray(keyedOptions)) {
        options = keyedOptions;
      }

      // static options
    } else if (staticOptions !== undefined) {
      options = Array.isArray(staticOptions) ? staticOptions : [];

      // expression
    } else if (optionsExpression && evaluatedOptions && Array.isArray(evaluatedOptions)) {
      options = evaluatedOptions;

      // error case
    } else {
      return buildErrorState('No options source defined in the form definition');
    }

    // normalize data to support primitives and partially defined objects
    return buildLoadedState(normalizeOptionsData(options));
  }, [optionsKey, staticOptions, initialData, optionsExpression, evaluatedOptions]);

  return optionsGetter;
}

const buildErrorState = (error) => ({ options: [], error, loadState: LOAD_STATES.ERROR });

const buildLoadedState = (options) => ({ options, error: undefined, loadState: LOAD_STATES.LOADED });