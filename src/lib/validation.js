//// Validation Module \\\\

import {default as _isArray} from 'lodash/isArray';
import {default as _isSymbol} from 'lodash/isSymbol';
import {default as _isFunction} from 'lodash/isFunction';
import {default as _isObject} from 'lodash/isObject';
import {default as _isObjectLike} from 'lodash/isObjectLike';
import {default as _isMap} from 'lodash/isMap';
import {default as _isWeakMap} from 'lodash/isWeakMap';
import {default as _isSet} from 'lodash/isSet';
import {default as _isWeakSet} from 'lodash/isWeakSet';
import {default as _isRegExp} from 'lodash/isRegExp';

import qualifiers from './qualifiers';

/**
 * RTV Validation Module
 * @private
 * @namespace rtv.validation
 */

/**
 * Determines if a value is _anything_.
 * @function rtv.validation.isAny
 * @param {*} v Value to validate.
 * @returns {boolean} `true` if it is; `false` otherwise.
 * @see {@link rtvref.types.ANY}
 */
export const isAny = function(v) {
  return true; // anything goes, even undefined and null
};

/**
 * Determines if a value is a string literal __only__ (i.e. a
 *  {@link rtvref.types.primitives primitive}). It does not validate
 *  `new String('value')`, which is an object that is a string.
 * @function rtv.validation.isString
 * @param {*} v Value to validate.
 * @param {boolean} [emptyOK=false] If truthy, an empty string is allowed.
 * @returns {boolean} `true` if it is; `false` otherwise.
 * @see {@link rtvref.types.STRING}
 */
export const isString = function(v, emptyOK) {
  return !!((typeof v === 'string') && (emptyOK || v));
};

/**
 * Determines if a value is a boolean literal __only__ (i.e. a
 *  {@link rtvref.types.primitives primitive}). It does not validate
 *  `new Boolean(true)`, which is an object that is a boolean.
 * @function rtv.validation.isBoolean
 * @param {*} v Value to validate.
 * @returns {boolean} `true` if it is; `false` otherwise.
 * @see {@link rtvref.types.BOOLEAN}
 */
export const isBoolean = function(v) {
  return (v === true || v === false);
};

/**
 * Determines if a value is a number literal __only__ (i.e. a
 *  {@link rtvref.types.primitives primitive}). It does not validate
 *  `new Number(1)`, which is an object that is a number.
 * @function rtv.validation.isNumber
 * @param {*} v Value to validate.
 * @returns {boolean} `true` if it is; `false` otherwise.
 * @see {@link rtvref.types.NUMBER}
 */
export const isNumber = function(v) {
  return (typeof v === 'number');
};

/**
 * Determines if a value is a symbol.
 * @function rtv.validation.isSymbol
 * @param {*} v Value to validate.
 * @returns {boolean} `true` if it is; `false` otherwise.
 * @see {@link rtvref.types.SYMBOL}
 */
export const isSymbol = _isSymbol;

/**
 * Determines if a value is a function.
 * @function rtv.validation.isFunction
 * @param {*} v Value to validate.
 * @returns {boolean} `true` if it is; `false` otherwise.
 * @see {@link rtvref.types.SYMBOL}
 */
export const isFunction = _isFunction;

/**
 * Determines if a value is an array.
 * @function rtv.validation.isArray
 * @param {*} v Value to validate.
 * @returns {boolean} `true` if it is; `false` otherwise.
 * @see {@link rtvref.types.ARRAY}
 */
export const isArray = _isArray;

/**
 * Determines if a value is a map.
 * @function rtv.validation.isMap
 * @param {*} v Value to validate.
 * @returns {boolean} `true` if it is; `false` otherwise.
 * @see {@link rtvref.types.MAP}
 */
export const isMap = _isMap;

/**
 * Determines if a value is a weak map.
 * @function rtv.validation.isWeakMap
 * @param {*} v Value to validate.
 * @returns {boolean} `true` if it is; `false` otherwise.
 * @see {@link rtvref.types.WEAK_MAP}
 */
export const isWeakMap = _isWeakMap;

/**
 * Determines if a value is a set.
 * @function rtv.validation.isSet
 * @param {*} v Value to validate.
 * @returns {boolean} `true` if it is; `false` otherwise.
 * @see {@link rtvref.types.SET}
 */
export const isSet = _isSet;

/**
 * Determines if a value is a weak set.
 * @function rtv.validation.isWeakSet
 * @param {*} v Value to validate.
 * @returns {boolean} `true` if it is; `false` otherwise.
 * @see {@link rtvref.types.WEAK_SET}
 */
export const isWeakSet = _isWeakSet;

/**
 * Determines if a value is a regular expression object.
 * @function rtv.validation.isRegExp
 * @param {*} v Value to validate.
 * @returns {boolean} `true` if it is; `false` otherwise.
 * @see {@link rtvref.types.REGEXP}
 */
export const isRegExp = _isRegExp;

/**
 * Determines if a value is a JavaScript {@link rtvref.types.primitives primitive}.
 * @function rtv.validation.isPrimitive
 * @param {*} v Value to validate.
 * @returns {boolean} `true` if it is; `false` otherwise.
 */
export const isPrimitive = function(v) {
  return v === undefined ||
      v === null ||
      isString(v, true) || // empty strings are still strings in this case
      isBoolean(v) ||
      isNumber(v) ||
      isSymbol(v);
};

/**
 * Determines if a value is _any_ type of object except a primitive.
 * @function rtv.validation.isAnyObject
 * @param {*} v Value to validate.
 * @returns {boolean} `true` if it is; `false` otherwise.
 */
export const isAnyObject = _isObject;

/**
 * Determines if a value is an object that extends from `JavaScript.Object` and
 *  is not a function, array, regex, map, weak map, set, weak set, or primitive.
 * @function rtv.validation.isObject
 * @param {*} v Value to validate.
 * @returns {boolean} `true` if it is; `false` otherwise.
 */
export const isObject = function(v) {
  return _isObjectLike(v) && // excludes primitives and functions
      !isArray(v) && // excludes arrays which are otherwise object-like (typeof [] === 'object')
      !isMap(v) && !isWeakMap(v) && // excludes weak/maps
      !isSet(v) && !isWeakSet(v) && // excludes weak/sets
      !isRegExp(v); // excludes regex
};

/**
 * Determines if a value is a typeset.
 * @function rtv.validation.isValidTypeset
 * @param {*} v Value to validate.
 * @param {boolean} [fullyQualified=false] If truthy, the typeset must be fully-qualified.
 * @param {boolean} [deep=false] If truthy, deeply-validates any nested typesets.
 * @returns {boolean} `true` if it is; `false` otherwise.
 * @see {@link rtvref.types.typeset}
 */
export const isTypeset = function(v, fullyQualified, deep) {
  let valid = isObject(v) || isString(v) || isFunction(v) || (isArray(v) && v.length > 0);

  if (valid && fullyQualified) {
    // TODO this needs MUCH more work/refinement...
    valid = isArray(v) && v.length > 1 && !!qualifiers.check(v[0]);
  }

  return valid;
};
