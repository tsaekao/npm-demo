////// isAnyObject validator

import {default as _isObject} from 'lodash/isObject';

import types from '../types';

/**
 * Type: {@link rtvref.types.ANY_OBJECT ANY_OBJECT}
 * @const {string} rtvref.validator.isAnyObject.type
 */
export const type = types.ANY_OBJECT;

/**
 * {@link rtvref.validator.validator_config Configuration Function}
 * @function rtvref.validator.isAnyObject.config
 * @param {Object} settings Standard configuration settings.
 */
export const config = function(settings) {
};

/**
 * {@link rtvref.validator.type_validator Validator} for the
 *  {@link rtvref.types.ANY_OBJECT ANY_OBJECT} type.
 *
 * Determines if a value is _any_ type of object except a primitive.
 *
 * @function rtvref.validator.isAnyObject
 * @param {*} v Value to validate.
 * @returns {boolean} `true` if validated; `false` otherwise.
 */
export default function isAnyObject(v) {
  return _isObject(v);
}
