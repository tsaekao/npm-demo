////// isTypeArgs validation module

import isObject from '../validator/isObject';

/**
 * Determines if a value is a {@link rtvref.types.type_arguments type arguments}
 *  object.
 * @function rtvref.validation.isTypeArgs
 * @param {*} v Value to validate.
 * @returns {boolean} `true` if it is; `false` otherwise.
 */
export default function isTypeArgs(v) {
  return isObject(v);
}
