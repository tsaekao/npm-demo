////// isString validation

import { types } from '../types';

/**
 * Validation Module: isString
 * @typedef {Module} rtvref.validation.isString
 */

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
 * @param {Object} [options] Validation options.
 * @param {boolean} [options.allowEmpty=false] If truthy, empty strings are
 *  permitted.
 * @returns {boolean} `true` if validated; `false` otherwise.
 */
export default function isString(v, { allowEmpty = false } = {}) {
  return typeof v === 'string' && (v !== '' || allowEmpty);
}
