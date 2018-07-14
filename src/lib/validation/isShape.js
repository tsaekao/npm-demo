////// isShape validation module

import isObject from '../validator/isObject';

/**
 * Determines if a value is a {@link rtvref.shape_descriptor shape}.
 * @function rtvref.validation.isShape
 * @param {*} v Value to validate.
 * @returns {boolean} `true` if it is; `false` otherwise.
 */
export default function isShape(v) {
  return isObject(v);
}
