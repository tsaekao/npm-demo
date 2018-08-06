////// isTypeArgs validation module

import isObject from './isObject';

/**
 * Type: `undefined`, {@link rtvref.types.type_arguments type arguments} pseudo-type.
 * @const {string} rtvref.validation.isTypeArgs.type
 */
export const type = undefined;

/**
 * Determines if a value is a {@link rtvref.types.type_arguments type arguments}
 *  object.
 * @function rtvref.validation.isTypeArgs.default
 * @param {*} v Value to validate.
 * @returns {boolean} `true` if it is; `false` otherwise.
 */
export default function isTypeArgs(v) {
  return isObject(v);
}
