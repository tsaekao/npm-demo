////// isCustomValidator validation module

import isFunction from './isFunction';

/**
 * Validation Module: isCustomValidator
 * @typedef {Module} rtvref.validation.isCustomValidator
 */

/**
 * Type: `undefined`, {@link rtvref.types.custom_validator custom validator} pseudo-type.
 * @const {string} rtvref.validation.isCustomValidator.type
 */
export const type = undefined;

/**
 * Determines if a value is a {@link rtvref.types.custom_validator custom validator}.
 * @function rtvref.validation.isCustomValidator.default
 * @param {*} v Value to validate.
 * @returns {boolean} `true` if it is; `false` otherwise.
 */
export default function isCustomValidator(v) {
  return isFunction(v);
}
