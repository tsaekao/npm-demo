////// isWeakMap validator

import {default as _isWeakMap} from 'lodash/isWeakMap';

import types from '../types';

/**
 * {@link rtvref.validation.validator Validator} function for the
 *  {@link rtvref.types.WEAK_MAP WEAK_MAP} type.
 * @function rtvref.validation.isWeakMap
 * @param {*} v Value to validate.
 * @returns {boolean} `true` if validated; `false` otherwise.
 */
export const validator = function isWeakMap(v) {
  return _isWeakMap(v);
};

export const type = types.WEAK_MAP;
