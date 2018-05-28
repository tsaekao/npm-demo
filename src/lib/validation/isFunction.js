////// isFunction validator

import {default as _isFunction} from 'lodash/isFunction';

import types from '../types';

/**
 * {@link rtvref.validation.validator Validator} function for the
 *  {@link rtvref.types.FUNCTION FUNCTION} type.
 * @function rtvref.validation.isFunction
 * @param {*} v Value to validate.
 * @returns {boolean} `true` if validated; `false` otherwise.
 */
export const validator = function isFunction(v) {
  return _isFunction(v);
};

export const type = types.FUNCTION;
