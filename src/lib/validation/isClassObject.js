////// isClassObject validation

import isObject from './isObject';
import isPlainObject from './isPlainObject';

import types from '../types';

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
 * @function rtvref.validation.isClassObject.default
 * @param {*} v Value to validate.
 * @returns {boolean} `true` if validated; `false` otherwise.
 */
export default function isClassObject(v) {
  return isObject(v) && !isPlainObject(v);
}
