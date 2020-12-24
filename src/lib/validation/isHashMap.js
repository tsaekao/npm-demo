////// isHashMap validation

import { check as isObject } from './isObject';

import { types } from '../types';

/**
 * Validation Module: isHashMap
 * @typedef {Module} rtvref.validation.isHashMap
 */

/**
 * Type: {@link rtvref.types.HASH_MAP HASH_MAP}
 * @const {string} rtvref.validation.isHashMap.type
 */
export const type = types.HASH_MAP;

/**
 * {@link rtvref.validation.method Validation} for the
 *  {@link rtvref.types.HASH_MAP HASH_MAP} type.
 * @function rtvref.validation.isHashMap.check
 * @param {*} v Value to validate.
 * @returns {boolean} `true` if validated; `false` otherwise.
 */
export const check = function isHashMap(v) {
  return isObject(v); // same rules as OBJECT
};
