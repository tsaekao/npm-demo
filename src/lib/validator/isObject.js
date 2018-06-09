////// isObject validator

import {default as _isObjectLike} from 'lodash/isObjectLike';

// avoid circular dependency with isMap and isSet validators by using lodash
import {default as _isMap} from 'lodash/isMap';
import {default as _isSet} from 'lodash/isSet';

import isArray from './isArray';
import isWeakMap from './isWeakMap';
import isWeakSet from './isWeakSet';
import isRegExp from './isRegExp';

import types from '../types';

/**
 * Type: {@link rtvref.types.OBJECT OBJECT}
 * @const {string} rtvref.validator.isObject.type
 */
export const type = types.OBJECT;

/**
 * {@link rtvref.validator.validator_config Configuration Function}
 * @function rtvref.validator.isObject.config
 * @param {Object} settings Standard configuration settings.
 */
export const config = function(settings) {
};

/**
 * {@link rtvref.validator.type_validator Validator} for the
 *  {@link rtvref.types.OBJECT OBJECT} type.
 *
 * Determines if a value is an object that extends from `JavaScript.Object` and
 *  is not a function, array, regex, map, weak map, set, weak set, or primitive.
 *
 * @function rtvref.validator.isObject
 * @param {*} v Value to validate.
 * @returns {boolean} `true` if validated; `false` otherwise.
 */
export default isObject = function(v) { // no qualifier rules, no args
  return _isObjectLike(v) && // excludes primitives and functions
      !isArray(v) && // excludes arrays which are otherwise object-like (typeof [] === 'object')
      !_isMap(v) && !isWeakMap(v) && // excludes weak/maps
      !_isSet(v) && !isWeakSet(v) && // excludes weak/sets
      !isRegExp(v); // excludes regex
};
