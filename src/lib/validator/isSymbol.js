////// isSymbol validator

import {default as _isSymbol} from 'lodash/isSymbol';

import types from '../types';

/**
 * Type: {@link rtvref.types.SYMBOL SYMBOL}
 * @const {string} rtvref.validator.isSymbol.type
 */
export const type = types.SYMBOL;

/**
 * {@link rtvref.validator.validator_config Configuration Function}
 * @function rtvref.validator.isSymbol.config
 * @param {rtvref.validator.validator_config_settings} settings Configuration settings.
 */
export const config = function(settings) {
};

/**
 * {@link rtvref.validator.type_validator Validator} for the
 *  {@link rtvref.types.SYMBOL SYMBOL} type.
 * @function rtvref.validator.isSymbol
 * @param {*} v Value to validate.
 * @returns {boolean} `true` if validated; `false` otherwise.
 */
export default function isSymbol(v) {
  return _isSymbol(v);
}
