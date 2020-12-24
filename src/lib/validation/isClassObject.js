////// isClassObject validation

import { check as isObject } from './isObject';
import { check as isPlainObject } from './isPlainObject';

import { types } from '../types';

/**
 * Validation Module: isClassObject
 * @typedef {Module} rtvref.validation.isClassObject
 */

/**
 * Type: {@link rtvref.types.CLASS_OBJECT CLASS_OBJECT}
 * @const {string} rtvref.validation.isClassObject.type
 */
export const type = types.CLASS_OBJECT;

/**
 * {@link rtvref.validation.method Validation} for the
 *  {@link rtvref.types.CLASS_OBJECT CLASS_OBJECT} type.
 * @function rtvref.validation.isClassObject.check
 * @param {*} v Value to validate.
 * @returns {boolean} `true` if validated; `false` otherwise.
 */
export const check = function isClassObject(v) {
  return isObject(v) && !isPlainObject(v);
};
