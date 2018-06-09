////// isWeakSet validator

import {default as _isWeakSet} from 'lodash/isWeakSet';

import types from '../types';

/**
 * Type: {@link rtvref.types.WEAK_SET WEAK_SET}
 * @const {string} rtvref.validator.isWeakSet.type
 */
export const type = types.WEAK_SET;

/**
 * {@link rtvref.validator.validator_config Configuration Function}
 * @function rtvref.validator.isWeakSet.config
 * @param {Object} settings Standard configuration settings.
 */
export const config = function(settings) {
};

/**
 * {@link rtvref.validator.type_validator Validator} for the
 *  {@link rtvref.types.WEAK_SET WEAK_SET} type.
 * @function rtvref.validator.isWeakSet
 * @param {*} v Value to validate.
 * @returns {boolean} `true` if validated; `false` otherwise.
 */
export default isWeakSet = function(v) {
  return _isWeakSet(v);
};
