////// isAnyObject validator

import {default as _isObject} from 'lodash/isObject';

import types from '../types';

/**
 * {@link rtvref.validation.validator Validator} function for the
 *  {@link rtvref.types.ANY_OBJECT ANY_OBJECT} type.
 *
 * Determines if a value is _any_ type of object except a primitive.
 *
 * @function rtvref.validation.isAnyObject
 * @param {*} v Value to validate.
 * @returns {boolean} `true` if validated; `false` otherwise.
 */
export const validator = function isAnyObject(v) {
  return _isObject(v);
};

export const type = types.ANY_OBJECT;
