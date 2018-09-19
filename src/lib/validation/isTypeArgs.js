////// isTypeArgs validation module

import isObject from './isObject';

/**
 * Validation Module: isTypeArgs
 * @typedef {Module} rtvref.validation.isTypeArgs
 */

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
  // NOTE: Since shapes are also type args, this check must always validate a
  //  shape; and since at this time, OBJECT === shape === type args, we just
  //  check for an OBJECT type
  return isObject(v);
}
