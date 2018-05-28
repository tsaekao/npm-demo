////// isObject validator

import {default as _isObjectLike} from 'lodash/isObjectLike';

import {validator as isArray} from './isArray';
import {validator as isMap} from './isMap';
import {validator as isWeakMap} from './isWeakMap';
import {validator as isSet} from './isSet';
import {validator as isWeakSet} from './isWeakSet';
import {validator as isRegExp} from './isRegExp';

import types from '../types';

/**
 * {@link rtvref.validation.validator Validator} function for the
 *  {@link rtvref.types.OBJECT OBJECT} type.
 *
 * Determines if a value is an object that extends from `JavaScript.Object` and
 *  is not a function, array, regex, map, weak map, set, weak set, or primitive.
 *
 * @function rtvref.validation.isObject
 * @param {*} v Value to validate.
 * @returns {boolean} `true` if validated; `false` otherwise.
 */
export const validator = function isObject(v) { // no qualifier rules, no args
  return _isObjectLike(v) && // excludes primitives and functions
      !isArray(v) && // excludes arrays which are otherwise object-like (typeof [] === 'object')
      !isMap(v) && !isWeakMap(v) && // excludes weak/maps
      !isSet(v) && !isWeakSet(v) && // excludes weak/sets
      !isRegExp(v); // excludes regex
};

export const type = types.OBJECT;
