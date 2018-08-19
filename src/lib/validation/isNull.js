////// isNull validation

import types from '../types';

/**
 * Type: {@link rtvref.types.NULL NULL}
 * @const {string} rtvref.validation.isFunction.type
 */
export const type = types.NULL;

/**
 * {@link rtvref.validation.method Validation} for the
 *  {@link rtvref.types.NULL NULL} type.
 * @function rtvref.validation.isNull.default
 * @param {*} v Value to validate.
 * @returns {boolean} `true` if validated; `false` otherwise.
 */
export default function isNull(v) {
  return v === null;
}
