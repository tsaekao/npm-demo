////// isArray validation

import { default as _isArray } from 'lodash/isArray';

import { types } from '../types';

/**
 * Validation Module: isArray
 * @typedef {Module} rtvref.validation.isArray
 */

/**
 * Type: {@link rtvref.types.ARRAY ARRAY}
 * @const {string} rtvref.validation.isArray.type
 */
export const type = types.ARRAY;

/**
 * {@link rtvref.validation.method Validation} for the
 *  {@link rtvref.types.ARRAY ARRAY} type.
 * @function rtvref.validation.isArray.check
 * @param {*} v Value to validate.
 * @returns {boolean} `true` if validated; `false` otherwise.
 */
export const check = function isArray(v) {
  return _isArray(v);
};
