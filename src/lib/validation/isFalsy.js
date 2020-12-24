////// isFalsy validation module

import { default as _isNaN } from 'lodash/isNaN';

/**
 * Validation Module: isFalsy
 * @typedef {Module} rtvref.validation.isFalsy
 */

/**
 * Type: `undefined`, {@link rtvref.types.falsy_values falsy value} pseudo-type.
 * @const {string} rtvref.validation.isFalsy.type
 */
export const type = undefined;

/**
 * Determines if a value is a JavaScript {@link rtvref.types.falsy_values falsy value}.
 * @function rtvref.validation.isFalsy.check
 * @param {*} v Value to validate.
 * @returns {boolean} `true` if it is; `false` otherwise.
 */
export const check = function isFalsy(v) {
  return (
    v === undefined ||
    v === null ||
    v === false ||
    v === 0 ||
    v === '' ||
    _isNaN(v)
  );
};
