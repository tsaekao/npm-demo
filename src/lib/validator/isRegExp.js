////// isRegExp validator

import {default as _isRegExp} from 'lodash/isRegExp';

import types from '../types';

/**
 * Type: {@link rtvref.types.REGEXP REGEXP}
 * @const {string} rtvref.validator.isRegExp.type
 */
export const type = types.REGEXP;

/**
 * {@link rtvref.validator.validator_config Configuration Function}
 * @function rtvref.validator.isRegExp.config
 * @param {Object} settings Standard configuration settings.
 */
export const config = function(settings) {
};

/**
 * {@link rtvref.validator.type_validator Validator} for the
 *  {@link rtvref.types.REGEXP REGEXP} type.
 * @function rtvref.validator.isRegExp
 * @param {*} v Value to validate.
 * @returns {boolean} `true` if validated; `false` otherwise.
 */
export default isRegExp = function(v) {
  return _isRegExp(v);
};
