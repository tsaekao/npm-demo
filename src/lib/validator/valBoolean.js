////// isBoolean validator

import {type, default as isBoolean} from '../validation/isBoolean';

import qualifiers from '../qualifiers';
import RtvSuccess from '../RtvSuccess';
import RtvError from '../RtvError';

let impl; // @type {rtvref.impl}

/**
 * Type: {@link rtvref.types.BOOLEAN BOOLEAN}
 * @const {string} rtvref.validator.isBoolean.type
 */
export {type};

/**
 * {@link rtvref.validator.validator_config Configuration Function}
 * @function rtvref.validator.isBoolean.config
 * @param {rtvref.validator.validator_config_settings} settings Configuration settings.
 */
export const config = function(settings) {
  impl = settings.impl;
};

/**
 * {@link rtvref.validator.type_validator Validator} for the
 *  {@link rtvref.types.BOOLEAN BOOLEAN} type.
 *
 * Determines if a value is a boolean literal __only__ (i.e. a
 *  {@link rtvref.types.primitives primitive}). It does not validate
 *  `new Boolean(true)`, which is an object that is a boolean.
 *
 * @function rtvref.validator.isBoolean.default
 * @param {*} v Value to validate.
 * @param {string} [q] Validation qualifier. Defaults to
 *  {@link rtvref.qualifiers.REQUIRED REQUIRED}.
 * @returns {(rtvref.RtvSuccess|rtvref.RtvError)} An `RtvSuccess` if valid; `RtvError` if not.
 */
export default function valBoolean(v, q = qualifiers.REQUIRED) {
  if (isBoolean(v)) {
    return new RtvSuccess();
  }

  return new RtvError(v, impl.toTypeset(type, q), [], impl.toTypeset(type, q, true));
}
