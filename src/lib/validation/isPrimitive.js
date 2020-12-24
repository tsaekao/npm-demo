////// isPrimitive validation module

import { check as isString } from './isString';
import { check as isBoolean } from './isBoolean';
import { check as isNumber } from './isNumber';
import { check as isSymbol } from './isSymbol';

/**
 * Validation Module: isPrimitive
 * @typedef {Module} rtvref.validation.isPrimitive
 */

/**
 * Type: `undefined`, {@link rtvref.types.primitives primitive} pseudo-type.
 * @const {string} rtvref.validation.isPrimitive.type
 */
export const type = undefined;

/**
 * Determines if a value is a JavaScript {@link rtvref.types.primitives primitive}.
 * @function rtvref.validation.isPrimitive.check
 * @param {*} v Value to validate.
 * @returns {boolean} `true` if it is; `false` otherwise.
 */
export const check = function isPrimitive(v) {
  return (
    v === undefined ||
    v === null ||
    isString(v, { allowEmpty: true }) ||
    isBoolean(v) ||
    isNumber(v) ||
    isSymbol(v)
  );
};
