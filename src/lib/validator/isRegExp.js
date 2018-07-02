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
 * @param {rtvref.validator.validator_config_settings} settings Configuration settings.
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
export default function isRegExp(v) {
  return _isRegExp(v);
}
