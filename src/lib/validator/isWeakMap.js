////// isWeakMap validator

import {default as _isWeakMap} from 'lodash/isWeakMap';

import types from '../types';

/**
 * Type: {@link rtvref.types.WEAK_MAP WEAK_MAP}
 * @const {string} rtvref.validator.isWeakMap.type
 */
export const type = types.WEAK_MAP;

/**
 * {@link rtvref.validator.validator_config Configuration Function}
 * @function rtvref.validator.isWeakMap.config
 * @param {rtvref.validator.validator_config_settings} settings Configuration settings.
 */
export const config = function(settings) {
};

/**
 * {@link rtvref.validator.type_validator Validator} for the
 *  {@link rtvref.types.WEAK_MAP WEAK_MAP} type.
 * @function rtvref.validator.isWeakMap
 * @param {*} v Value to validate.
 * @returns {boolean} `true` if validated; `false` otherwise.
 */
export default function isWeakMap(v) {
  return _isWeakMap(v);
}
