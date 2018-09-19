////// isError validation

import {default as _isError} from 'lodash/isError';

import types from '../types';

/**
 * Validation Module: isError
 * @typedef {Module} rtvref.validation.isError
 */

/**
 * Type: {@link rtvref.types.ERROR ERROR}
 * @const {string} rtvref.validation.isError.type
 */
export const type = types.ERROR;

/**
 * {@link rtvref.validation.method Validation} for the
 *  {@link rtvref.types.ERROR ERROR} type.
 * @function rtvref.validation.isError.default
 * @param {*} v Value to validate.
 * @returns {boolean} `true` if validated; `false` otherwise.
 */
export default function isError(v) {
  return _isError(v);
}
