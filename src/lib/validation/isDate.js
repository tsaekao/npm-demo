////// isDate validation

import {default as _isDate} from 'lodash/isDate';

import types from '../types';

/**
 * Validation Module: isDate
 * @typedef {Module} rtvref.validation.isDate
 */

/**
 * Type: {@link rtvref.types.DATE DATE}
 * @const {string} rtvref.validation.isDate.type
 */
export const type = types.DATE;

/**
 * {@link rtvref.validation.method Validation} for the
 *  {@link rtvref.types.DATE DATE} type.
 * @function rtvref.validation.isDate.default
 * @param {*} v Value to validate.
 * @returns {boolean} `true` if validated; `false` otherwise.
 */
export default function isDate(v) {
  return _isDate(v);
}
