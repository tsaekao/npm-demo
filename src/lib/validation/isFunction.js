////// isSymbol validator

import {default as _isSymbol} from 'lodash/isSymbol';

import types from '../types';

/**
 * {@link rtvref.validation.validator Validator} function for the
 *  {@link rtvref.types.SYMBOL SYMBOL} type.
 * @function rtvref.validation.isSymbol
 * @param {*} v Value to validate.
 * @returns {boolean} `true` if validated; `false` otherwise.
 */
export const validator = function isSymbol(v) {
  return _isSymbol(v);
};

export const type = types.SYMBOL;
