import classNames from 'classnames';

export function formFieldClasses(type, { errors = [], disabled = false, readonly = false } = {}) {
  if (!type) {
    throw new Error('type required');
  }

  return classNames('fjs-form-field', `fjs-form-field-${type}`, {
    'fjs-has-errors': errors.length > 0,
    'fjs-disabled': disabled,
    'fjs-readonly': readonly,
  });
}

export function gridColumnClasses(formField) {
  const { layout = {} } = formField;

  const { columns } = layout;

  return classNames(
    'fjs-layout-column',
    `cds--col${columns ? '-lg-' + columns : ''}`,

    // always fall back to top-down on smallest screens
    'cds--col-sm-16',
    'cds--col-md-16',
  );
}

export function textToLabel(text) {
  if (typeof text != 'string') return null;

  for (const line of text.split('\n')) {
    const displayLine = line.trim();

    // we use the first non-whitespace line in the text as label
    if (displayLine !== '') {
      return displayLine;
    }
  }

  return null;
}

export function prefixId(id, formId, indexes) {
  let result = 'fjs-form';

  if (formId) {
    result += `-${formId}`;
  }

  result += `-${id}`;

  Object.values(indexes || {}).forEach((index) => {
    result += `_${index}`;
  });

  return result;
}

/**
 * Creates an options object with default values if no options are provided.
 *
 * @param {object} options
 *
 * @returns {object}
 */
export function createEmptyOptions(options = {}) {
  const defaults = {};

  // provide default options if valuesKey and valuesExpression are not set
  if (!options.valuesKey && !options.valuesExpression) {
    defaults.values = [
      {
        label: 'Value',
        value: 'value',
      },
    ];
  }

  return {
    ...defaults,
    ...options,
  };
}


export function wrapObjectKeysWithUnderscores(obj) {
  const newObj = {};
  for (const [key, value] of Object.entries(obj)) {
    newObj[`_${key}_`] = value;
  }
  return newObj;
}

/**
 * Transform a LocalExpressionContext object into a usable FEEL context.
 *
 * @param {Object} context - The LocalExpressionContext object.
 * @returns {Object} The usable FEEL context.
 */

export function buildExpressionContext(context) {
  const { data, ...specialContextKeys } = context;

  return {
    ...specialContextKeys,
    ...data,
    ...wrapObjectKeysWithUnderscores(specialContextKeys),
  };
}

/**
 * If the value is a valid expression, it is evaluated and returned. Otherwise, it is returned as-is.
 *
 * @param {any} expressionLanguage - The expression language to use.
 * @param {any} value - The static value or expression to evaluate.
 * @param {Object} expressionContextInfo - The context information to use.
 * @returns {any} - Evaluated value or the original value if not an expression.
 */
export function runExpressionEvaluation(expressionLanguage, value, expressionContextInfo) {
  if (expressionLanguage && expressionLanguage.isExpression(value)) {
    return expressionLanguage.evaluate(value, buildExpressionContext(expressionContextInfo));
  }
  return value;
}