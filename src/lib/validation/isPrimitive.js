////// isPrimitive validation module

import isString from './isString';
import isBoolean from './isBoolean';
import isNumber from './isNumber';
import isSymbol from './isSymbol';

/**
 * Type: `undefined`, {@link rtvref.types.primitives primitive} pseudo-type.
 * @const {string} rtvref.validation.isPrimitive.type
 */
export const type = undefined;

/**
 * Determines if a value is a JavaScript {@link rtvref.types.primitives primitive}.
 * @function rtvref.validation.isPrimitive.default
 * @param {*} v Value to validate.
 * @returns {boolean} `true` if it is; `false` otherwise.
 */
export default function isPrimitive(v) {
  return v === undefined || v === null ||
      isString(v) ||
      isBoolean(v) ||
      isNumber(v) ||
      isSymbol(v);
}
