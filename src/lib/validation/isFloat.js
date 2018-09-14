////// isFloat validation

import isFinite from './isFinite';
import isInt from './isInt';

import types from '../types';

/**
 * Type: {@link rtvref.types.FLOAT FLOAT}
 * @const {string} rtvref.validation.isFloat.type
 */
export const type = types.FLOAT;

/**
 * {@link rtvref.validation.method Validation} for the
 *  {@link rtvref.types.FLOAT FLOAT} type.
 *
 * Determines if a value is a floating point literal __only__ (i.e. a
 *  {@link rtvref.types.primitives primitive}). It does not validate
 *  `new Number(1.5)`, which is an object that is a number.
 *
 * @function rtvref.validation.isFloat.default
 * @param {*} v Value to validate.
 * @returns {boolean} `true` if validated; `false` otherwise.
 */
export default function isFloat(v) {
  return v === 0 || (isFinite(v) && !isInt(v)); // eliminates NaN, +/-Infinity, integers
}
