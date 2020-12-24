////// isObject validation

import { default as _isObjectLike } from 'lodash/isObjectLike';

import { check as isArray } from './isArray';
import { check as isMap } from './isMap';
import { check as isWeakMap } from './isWeakMap';
import { check as isSet } from './isSet';
import { check as isWeakSet } from './isWeakSet';
import { check as isRegExp } from './isRegExp';
import { check as isDate } from './isDate';
import { check as isError } from './isError';
import { check as isPromise } from './isPromise';

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
 * @function rtvref.validation.isObject.check
 * @param {*} v Value to validate.
 * @returns {boolean} `true` if validated; `false` otherwise.
 */
export const check = function isObject(v) {
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
};
