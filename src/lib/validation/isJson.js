////// isJson validation

import { check as isNull } from './isNull';
import { check as isString } from './isString';
import { check as isBoolean } from './isBoolean';
import { check as isFinite } from './isFinite';
import { check as isPlainObject } from './isPlainObject';
import { check as isArray } from './isArray';

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
 * @function rtvref.validation.isJson.check
 * @param {*} v Value to validate.
 * @returns {boolean} `true` if validated; `false` otherwise.
 */
export const check = function isJson(v) {
  return (
    isNull(v) ||
    isString(v, { allowEmpty: true }) ||
    isBoolean(v) ||
    isFinite(v) ||
    isPlainObject(v) ||
    isArray(v)
  );
};
