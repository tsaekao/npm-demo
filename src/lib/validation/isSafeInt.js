////// isSafeInt validation

import { default as _isSafeInteger } from 'lodash/isSafeInteger';

import types from '../types';

/**
 * Validation Module: isSafeInt
 * @typedef {Module} rtvref.validation.isSafeInt
 */

/**
 * Type: {@link rtvref.types.SAFE_INT SAFE_INT}
 * @const {string} rtvref.validation.isSafeInt.type
 */
export const type = types.SAFE_INT;

/**
 * {@link rtvref.validation.method Validation} for the
 *  {@link rtvref.types.SAFE_INT SAFE_INT} type.
 *
 * Determines if a value is an integer literal __only__ (i.e. a
 *  {@link rtvref.types.primitives primitive}). It does not validate
 *  `new Number(1)`, which is an object that is a number.
 *
 * @function rtvref.validation.isSafeInt.default
 * @param {*} v Value to validate.
 * @returns {boolean} `true` if validated; `false` otherwise.
 */
export default function isSafeInt(v) {
  return _isSafeInteger(v); // eliminates NaN, +/-Infinity, floats, unsafe ints
}
