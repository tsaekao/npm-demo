////// isAny validation

import types from '../types';

/**
 * Type: {@link rtvref.types.ANY ANY}
 * @const {string} rtvref.validation.isAny.type
 */
export const type = types.ANY;

/**
 * {@link rtvref.validation.method Validation} for the
 *  {@link rtvref.types.ANY ANY} type.
 * @function rtvref.validation.isAny.default
 * @param {*} v Value to validate.
 * @returns {boolean} `true` if validated; `false` otherwise.
 */
export default function isAny(v) {
  return true; // anything goes, even undefined and null
}
