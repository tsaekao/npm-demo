////// isFunction validation

import {default as _isFunction} from 'lodash/isFunction';

import types from '../types';

/**
 * Type: {@link rtvref.types.FUNCTION FUNCTION}
 * @const {string} rtvref.validation.isFunction.type
 */
export const type = types.FUNCTION;

/**
 * {@link rtvref.validation.method Validation} for the
 *  {@link rtvref.types.FUNCTION FUNCTION} type.
 * @function rtvref.validation.isFunction.default
 * @param {*} v Value to validate.
 * @returns {boolean} `true` if validated; `false` otherwise.
 */
export default function isFunction(v) {
  return _isFunction(v);
}
