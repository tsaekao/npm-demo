////// isWeakMap validation

import { default as _isWeakMap } from 'lodash/isWeakMap';

import { types } from '../types';

/**
 * Validation Module: isWeakMap
 * @typedef {Module} rtvref.validation.isWeakMap
 */

/**
 * Type: {@link rtvref.types.WEAK_MAP WEAK_MAP}
 * @const {string} rtvref.validation.isWeakMap.type
 */
export const type = types.WEAK_MAP;

/**
 * {@link rtvref.validation.method Validation} for the
 *  {@link rtvref.types.WEAK_MAP WEAK_MAP} type.
 * @function rtvref.validation.isWeakMap.check
 * @param {*} v Value to validate.
 * @returns {boolean} `true` if validated; `false` otherwise.
 */
export const check = function isWeakMap(v) {
  return _isWeakMap(v);
};
