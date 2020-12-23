////// isObject validation

import { default as _isObjectLike } from 'lodash/isObjectLike';

import isArray from './isArray';
import isMap from './isMap';
import isWeakMap from './isWeakMap';
import isSet from './isSet';
import isWeakSet from './isWeakSet';
import isRegExp from './isRegExp';
import isDate from './isDate';
import isError from './isError';
import isPromise from './isPromise';

import { types } from '../types';

/**
 * Validation Module: isObject
 * @typedef {Module} rtvref.validation.isObject
 */

/**
 * Type: {@link rtvref.types.OBJECT OBJECT}
 * @const {string} rtvref.validation.isObject.type
 */
export const type = types.OBJECT;

/**
 * {@link rtvref.validation.method Validation} for the
 *  {@link rtvref.types.OBJECT OBJECT} type.
 * @function rtvref.validation.isObject.default
 * @param {*} v Value to validate.
 * @returns {boolean} `true` if validated; `false` otherwise.
 */
export default function isObject(v) {
  // no qualifier rules, no args
  return (
    _isObjectLike(v) && // excludes primitives and functions
    !(v instanceof String) && // excludes `new String('foo')`
    !(v instanceof Number) && // excludes `new Number(1)`
    !(v instanceof Boolean) && // excludes `new Boolean(true)`
    !isArray(v) && // excludes arrays which are otherwise object-like (typeof [] === 'object')
    !isMap(v) &&
    !isWeakMap(v) &&
    !isSet(v) &&
    !isWeakSet(v) &&
    !isRegExp(v) &&
    !isDate(v) &&
    !isError(v) &&
    !isPromise(v)
  );
}
