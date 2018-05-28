////// isWeakSet validator

import {default as _isWeakSet} from 'lodash/isWeakSet';

import types from '../types';

/**
 * {@link rtvref.validation.validator Validator} function for the
 *  {@link rtvref.types.WEAK_SET WEAK_SET} type.
 * @function rtvref.validation.isWeakSet
 * @param {*} v Value to validate.
 * @returns {boolean} `true` if validated; `false` otherwise.
 */
export const validator = function isWeakSet(v) {
  return _isWeakSet(v);
};

export const type = types.WEAK_SET;
