////// isFunction validator

import {default as _isFunction} from 'lodash/isFunction';

import types from '../types';

/**
 * Type: {@link rtvref.types.FUNCTION FUNCTION}
 * @const {string} rtvref.validator.isFunction.type
 */
export const type = types.FUNCTION;

/**
 * {@link rtvref.validator.validator_config Configuration Function}
 * @function rtvref.validator.isFunction.config
 * @param {Object} settings Standard configuration settings.
 */
export const config = function(settings) {
};

/**
 * {@link rtvref.validator.type_validator Validator} for the
 *  {@link rtvref.types.FUNCTION FUNCTION} type.
 * @function rtvref.validator.isFunction
 * @param {*} v Value to validate.
 * @returns {boolean} `true` if validated; `false` otherwise.
 */
export default isFunction = function(v) {
  return _isFunction(v);
};
