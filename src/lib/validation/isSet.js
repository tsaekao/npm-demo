////// isSet validation

import { default as _isSet } from 'lodash/isSet';

import { types } from '../types';

/**
 * Validation Module: isSet
 * @typedef {Module} rtvref.validation.isSet
 */

/**
 * Type: {@link rtvref.types.SET SET}
 * @const {string} rtvref.validation.isSet.type
 */
export const type = types.SET;

/**
 * {@link rtvref.validation.method Validation} for the
 *  {@link rtvref.types.SET SET} type.
 * @function rtvref.validation.isSet.default
 * @param {*} v Value to validate.
 * @returns {boolean} `true` if validated; `false` otherwise.
 */
export default function isSet(v) {
  return _isSet(v);
}
