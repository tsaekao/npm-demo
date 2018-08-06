////// isString validation

import types from '../types';

/**
 * Type: {@link rtvref.types.STRING STRING}
 * @const {string} rtvref.validation.isString.type
 */
export const type = types.STRING;

/**
 * {@link rtvref.validation.method Validation} for the
 *  {@link rtvref.types.STRING STRING} type.
 *
 * Determines if a value is a string literal __only__ (i.e. a
 *  {@link rtvref.types.primitives primitive}), __including an empty string__.
 *  It does not validate `new String('value')`, which is an object that is a
 *  string.
 *
 * @function rtvref.validation.isString.default
 * @param {*} v Value to validate.
 * @returns {boolean} `true` if validated; `false` otherwise.
 */
export default function isString(v) {
  return (typeof v === 'string');
}
