////// isMap validation

import {default as _isMap} from 'lodash/isMap';

import types from '../types';

/**
 * Validation Module: isMap
 * @typedef {Module} rtvref.validation.isMap
 */

/**
 * Type: {@link rtvref.types.MAP MAP}
 * @const {string} rtvref.validation.isMap.type
 */
export const type = types.MAP;

/**
 * {@link rtvref.validation.method Validation} for the
 *  {@link rtvref.types.MAP MAP} type.
 * @function rtvref.validation.isMap.default
 * @param {*} v Value to validate.
 * @returns {boolean} `true` if validated; `false` otherwise.
 */
export default function isMap(v) {
  return _isMap(v);
}
