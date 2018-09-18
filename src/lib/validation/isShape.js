////// isShape validation module

import isObject from './isObject';

/**
 * Type: `undefined`, {@link rtvref.types.shape_descriptor shape} pseudo-type.
 * @const {string} rtvref.validation.isShape.type
 */
export const type = undefined;

/**
 * Determines if a value is a {@link rtvref.types.shape_descriptor shape}.
 * @function rtvref.validation.isShape.default
 * @param {*} v Value to validate.
 * @returns {boolean} `true` if it is; `false` otherwise.
 */
export default function isShape(v) {
  return isObject(v);
}
