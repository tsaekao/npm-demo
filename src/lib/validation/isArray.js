////// isArray validation

import {default as _isArray} from 'lodash/isArray';

import types from '../types';

/**
 * Type: {@link rtvref.types.ARRAY ARRAY}
 * @const {string} rtvref.validation.isArray.type
 */
export const type = types.ARRAY;

/**
 * {@link rtvref.validation.method Validation} for the
 *  {@link rtvref.types.ARRAY ARRAY} type.
 * @function rtvref.validation.isArray.default
 * @param {*} v Value to validate.
 * @returns {boolean} `true` if validated; `false` otherwise.
 */
export default function isArray(v) {
  return _isArray(v);
}
