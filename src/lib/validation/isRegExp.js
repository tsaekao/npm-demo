////// isRegExp validator

import {default as _isRegExp} from 'lodash/isRegExp';

import types from '../types';

/**
 * {@link rtvref.validation.validator Validator} function for the
 *  {@link rtvref.types.REGEXP REGEXP} type.
 * @function rtvref.validation.isRegExp
 * @param {*} v Value to validate.
 * @returns {boolean} `true` if validated; `false` otherwise.
 */
export const validator = function isRegExp(v) {
  return _isRegExp(v);
};

export const type = types.REGEXP;
