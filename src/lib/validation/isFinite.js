////// isFinite validation

import {default as _isFinite} from 'lodash/isFinite';

import types from '../types';

/**
 * Type: {@link rtvref.types.FINITE FINITE}
 * @const {string} rtvref.validation.isFinite.type
 */
export const type = types.FINITE;

/**
 * {@link rtvref.validation.method Validation} for the
 *  {@link rtvref.types.FINITE FINITE} type.
 *
 * Determines if a value is a finite number literal __only__ (i.e. a
 *  {@link rtvref.types.primitives primitive}). It does not validate
 *  `new Number(1)`, which is an object that is a number.
 *
 * @function rtvref.validation.isFinite.default
 * @param {*} v Value to validate.
 * @returns {boolean} `true` if validated; `false` otherwise.
 */
export default function isFinite(v) {
  return _isFinite(v); // eliminates NaN, +/-Infinity
}
