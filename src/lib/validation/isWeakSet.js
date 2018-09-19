////// isWeakSet validation

import {default as _isWeakSet} from 'lodash/isWeakSet';

import types from '../types';

/**
 * Validation Module: isWeakSet
 * @typedef {Module} rtvref.validation.isWeakSet
 */

/**
 * Type: {@link rtvref.types.WEAK_SET WEAK_SET}
 * @const {string} rtvref.validation.isWeakSet.type
 */
export const type = types.WEAK_SET;

/**
 * {@link rtvref.validation.method Validation} for the
 *  {@link rtvref.types.WEAK_SET WEAK_SET} type.
 * @function rtvref.validation.isWeakSet.default
 * @param {*} v Value to validate.
 * @returns {boolean} `true` if validated; `false` otherwise.
 */
export default function isWeakSet(v) {
  return _isWeakSet(v);
}
