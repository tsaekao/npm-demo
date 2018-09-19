////// isInt validation

import {default as _isInteger} from 'lodash/isInteger';

import types from '../types';

/**
 * Validation Module: isInt
 * @typedef {Module} rtvref.validation.isInt
 */

/**
 * Type: {@link rtvref.types.INT INT}
 * @const {string} rtvref.validation.isInt.type
 */
export const type = types.INT;

/**
 * {@link rtvref.validation.method Validation} for the
 *  {@link rtvref.types.INT INT} type.
 *
 * Determines if a value is an integer literal __only__ (i.e. a
 *  {@link rtvref.types.primitives primitive}). It does not validate
 *  `new Number(1)`, which is an object that is a number.
 *
 * @function rtvref.validation.isInt.default
 * @param {*} v Value to validate.
 * @returns {boolean} `true` if validated; `false` otherwise.
 */
export default function isInt(v) {
  return _isInteger(v); // eliminates NaN, +/-Infinity, floats
}
