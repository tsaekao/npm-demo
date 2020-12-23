////// isJson validation

import isNull from './isNull';
import isString from './isString';
import isBoolean from './isBoolean';
import isFinite from './isFinite';
import isPlainObject from './isPlainObject';
import isArray from './isArray';

import { types } from '../types';

/**
 * Validation Module: isJson
 * @typedef {Module} rtvref.validation.isJson
 */

/**
 * Type: {@link rtvref.types.JSON JSON}
 * @const {string} rtvref.validation.isJson.type
 */
export const type = types.JSON;

/**
 * {@link rtvref.validation.method Validation} for the
 *  {@link rtvref.types.JSON JSON} type.
 * @function rtvref.validation.isJson.default
 * @param {*} v Value to validate.
 * @returns {boolean} `true` if validated; `false` otherwise.
 */
export default function isJson(v) {
  return (
    isNull(v) ||
    isString(v, { allowEmpty: true }) ||
    isBoolean(v) ||
    isFinite(v) ||
    isPlainObject(v) ||
    isArray(v)
  );
}
