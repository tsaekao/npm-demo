////// isShape validation module

import { check as isObject } from './isObject';

/**
 * Validation Module: isShape
 * @typedef {Module} rtvref.validation.isShape
 */

/**
 * Type: `undefined`, {@link rtvref.types.shape_descriptor shape} pseudo-type.
 * @const {string} rtvref.validation.isShape.type
 */
export const type = undefined;

/**
 * Determines if a value is a {@link rtvref.types.shape_descriptor shape}.
 * @function rtvref.validation.isShape.check
 * @param {*} v Value to validate.
 * @returns {boolean} `true` if it is; `false` otherwise.
 */
export const check = function isShape(v) {
  return isObject(v);
};
