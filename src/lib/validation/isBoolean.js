////// isBoolean validation

import types from '../types';

/**
 * Type: {@link rtvref.types.BOOLEAN BOOLEAN}
 * @const {string} rtvref.validation.isBoolean.type
 */
export const type = types.BOOLEAN;

/**
 * {@link rtvref.validation.method Validation} for the
 *  {@link rtvref.types.BOOLEAN BOOLEAN} type.
 *
 * Determines if a value is a boolean literal __only__ (i.e. a
 *  {@link rtvref.types.primitives primitive}). It does not validate
 *  `new Boolean(true)`, which is an object that is a boolean.
 *
 * @function rtvref.validation.isBoolean.default
 * @param {*} v Value to validate.
 * @returns {boolean} `true` if validated; `false` otherwise.
 */
export default function isBoolean(v) {
  return (v === true || v === false);
}
