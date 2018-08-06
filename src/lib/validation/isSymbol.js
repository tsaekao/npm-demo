////// isSymbol validation

import {default as _isSymbol} from 'lodash/isSymbol';

import types from '../types';

/**
 * Type: {@link rtvref.types.SYMBOL SYMBOL}
 * @const {string} rtvref.validation.isSymbol.type
 */
export const type = types.SYMBOL;

/**
 * {@link rtvref.validation.method Validation} for the
 *  {@link rtvref.types.SYMBOL SYMBOL} type.
 * @function rtvref.validation.isSymbol.default
 * @param {*} v Value to validate.
 * @returns {boolean} `true` if validated; `false` otherwise.
 */
export default function isSymbol(v) {
  return _isSymbol(v);
}
