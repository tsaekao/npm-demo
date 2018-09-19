////// isAnyObject validation

import {default as _isObject} from 'lodash/isObject';

import types from '../types';

/**
 * Validation Module: isAnyObject
 * @typedef {Module} rtvref.validation.isAnyObject
 */

/**
 * Type: {@link rtvref.types.ANY_OBJECT ANY_OBJECT}
 * @const {string} rtvref.validation.isAnyObject.type
 */
export const type = types.ANY_OBJECT;

/**
 * {@link rtvref.validation.method Validation} for the
 *  {@link rtvref.types.ANY_OBJECT ANY_OBJECT} type.
 * @function rtvref.validation.isAnyObject.default
 * @param {*} v Value to validate.
 * @returns {boolean} `true` if validated; `false` otherwise.
 */
export default function isAnyObject(v) {
  return _isObject(v);
}
