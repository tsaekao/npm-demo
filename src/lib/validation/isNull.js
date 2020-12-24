////// isNull validation

import { types } from '../types';

/**
 * Validation Module: isNull
 * @typedef {Module} rtvref.validation.isNull
 */

/**
 * Type: {@link rtvref.types.NULL NULL}
 * @const {string} rtvref.validation.isNull.type
 */
export const type = types.NULL;

/**
 * {@link rtvref.validation.method Validation} for the
 *  {@link rtvref.types.NULL NULL} type.
 * @function rtvref.validation.isNull.check
 * @param {*} v Value to validate.
 * @returns {boolean} `true` if validated; `false` otherwise.
 */
export const check = function isNull(v) {
  return v === null;
};
