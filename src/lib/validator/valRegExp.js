////// isRegExp validator

import {type, default as isRegExp} from '../validation/isRegExp';

import qualifiers from '../qualifiers';
import RtvSuccess from '../RtvSuccess';
import RtvError from '../RtvError';

let impl; // @type {rtvref.impl}

/**
 * Type: {@link rtvref.types.REGEXP REGEXP}
 * @const {string} rtvref.validator.isRegExp.type
 */
export {type};

/**
 * {@link rtvref.validator.validator_config Configuration Function}
 * @function rtvref.validator.isRegExp.config
 * @param {rtvref.validator.validator_config_settings} settings Configuration settings.
 */
export const config = function(settings) {
  impl = settings.impl;
};

/**
 * {@link rtvref.validator.type_validator Validator} for the
 *  {@link rtvref.types.REGEXP REGEXP} type.
 * @function rtvref.validator.isRegExp.default
 * @param {*} v Value to validate.
 * @param {string} [q] Validation qualifier. Defaults to
 *  {@link rtvref.qualifiers.REQUIRED REQUIRED}.
 * @returns {(rtvref.RtvSuccess|rtvref.RtvError)} An `RtvSuccess` if valid; `RtvError` if not.
 */
export default function valRegExp(v, q = qualifiers.REQUIRED) {
  if (isRegExp(v)) {
    return new RtvSuccess();
  }

  return new RtvError(v, impl.toTypeset(type, q), [], impl.toTypeset(type, q, true));
}
