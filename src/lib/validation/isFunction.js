////// isFunction validation

import { default as _isFunction } from 'lodash/isFunction';

import { types } from '../types';

/**
 * Validation Module: isFunction
 * @typedef {Module} rtvref.validation.isFunction
 */

/**
 * Type: {@link rtvref.types.FUNCTION FUNCTION}
 * @const {string} rtvref.validation.isFunction.type
 */
export const type = types.FUNCTION;

/**
 * {@link rtvref.validation.method Validation} for the
 *  {@link rtvref.types.FUNCTION FUNCTION} type.
 * @function rtvref.validation.isFunction.check
 * @param {*} v Value to validate.
 * @returns {boolean} `true` if validated; `false` otherwise.
 */
export const check = function isFunction(v) {
  return _isFunction(v);
};
