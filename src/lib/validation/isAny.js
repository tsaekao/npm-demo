////// isAny validator

import types from '../types';

/**
 * {@link rtvref.validation.validator Validator} function for the
 *  {@link rtvref.types.ANY ANY} type.
 * @function rtvref.validation.isAny
 * @param {*} v Value to validate.
 * @returns {boolean} `true` if validated; `false` otherwise.
 */
export const validator = function isAny(v) {
  return true; // anything goes, even undefined and null
};

export const type = types.ANY;
