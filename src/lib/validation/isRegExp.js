////// isRegExp validation

import {default as _isRegExp} from 'lodash/isRegExp';

import types from '../types';

/**
 * Validation Module: isRegExp
 * @typedef {Module} rtvref.validation.isRegExp
 */

/**
 * Type: {@link rtvref.types.REGEXP REGEXP}
 * @const {string} rtvref.validation.isRegExp.type
 */
export const type = types.REGEXP;

/**
 * {@link rtvref.validation.method Validation} for the
 *  {@link rtvref.types.REGEXP REGEXP} type.
 * @function rtvref.validation.isRegExp.default
 * @param {*} v Value to validate.
 * @returns {boolean} `true` if validated; `false` otherwise.
 */
export default function isRegExp(v) {
  return _isRegExp(v);
}
