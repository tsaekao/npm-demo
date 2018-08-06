////// isObject validation

import {default as _isObjectLike} from 'lodash/isObjectLike';

import isArray from './isArray';
import isMap from './isMap';
import isWeakMap from './isWeakMap';
import isSet from './isSet';
import isWeakSet from './isWeakSet';
import isRegExp from './isRegExp';

import types from '../types';

/**
 * Type: {@link rtvref.types.OBJECT OBJECT}
 * @const {string} rtvref.validation.isObject.type
 */
export const type = types.OBJECT;

/**
 * {@link rtvref.validation.method Validation} for the
 *  {@link rtvref.types.OBJECT OBJECT} type.
 *
 * Determines if a value is an object that extends from `JavaScript.Object` and
 *  is not a function, array, regex, map, weak map, set, weak set, or primitive.
 *
 * @function rtvref.validation.isObject.default
 * @param {*} v Value to validate.
 * @returns {boolean} `true` if validated; `false` otherwise.
 */
export default function isObject(v) { // no qualifier rules, no args
  return _isObjectLike(v) && // excludes primitives and functions
      !isArray(v) && // excludes arrays which are otherwise object-like (typeof [] === 'object')
      !isMap(v) && !isWeakMap(v) && // excludes weak/maps
      !isSet(v) && !isWeakSet(v) && // excludes weak/sets
      !isRegExp(v); // excludes regex
}
