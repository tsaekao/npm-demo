////// isWeakMap validator

import {type, default as isWeakMap} from '../validation/isWeakMap';

import qualifiers from '../qualifiers';
import RtvSuccess from '../RtvSuccess';
import RtvError from '../RtvError';

let impl; // @type {rtvref.impl}

/**
 * Type: {@link rtvref.types.WEAK_MAP WEAK_MAP}
 * @const {string} rtvref.validator.isWeakMap.type
 */
export {type};

/**
 * {@link rtvref.validator.validator_config Configuration Function}
 * @function rtvref.validator.isWeakMap.config
 * @param {rtvref.validator.validator_config_settings} settings Configuration settings.
 */
export const config = function(settings) {
  impl = settings.impl;
};

/**
 * {@link rtvref.validator.type_validator Validator} for the
 *  {@link rtvref.types.WEAK_MAP WEAK_MAP} type.
 * @function rtvref.validator.isWeakMap.default
 * @param {*} v Value to validate.
 * @param {string} [q] Validation qualifier. Defaults to
 *  {@link rtvref.qualifiers.REQUIRED REQUIRED}.
 * @returns {(rtvref.RtvSuccess|rtvref.RtvError)} An `RtvSuccess` if valid; `RtvError` if not.
 */
export default function valWeakMap(v, q = qualifiers.REQUIRED) {
  if (isWeakMap(v)) {
    return new RtvSuccess();
  }

  return new RtvError(v, impl.toTypeset(type, q), [], impl.toTypeset(type, q, true));
}
