////// valRegExp validator

import { type, default as isRegExp } from '../validation/isRegExp';

import { default as qualifiers, valuePermitted } from '../qualifiers';
import RtvSuccess from '../RtvSuccess';
import RtvError from '../RtvError';

/**
 * Validator Module: valRegExp
 * @typedef {Module} rtvref.validator.valRegExp
 */

const { REQUIRED } = qualifiers;
let impl; // @type {rtvref.impl}

/**
 * [Internal] __FOR UNIT TESTING ONLY:__ The {@link rtvref.impl} instance
 *  configured on this validator.
 * @private
 * @name rtvref.validator.valRegExp._impl
 * @type {rtvref.impl}
 */
export { impl as _impl };

/**
 * Type: {@link rtvref.types.REGEXP REGEXP}
 * @const {string} rtvref.validator.valRegExp.type
 */
export { type };

/**
 * {@link rtvref.validator.validator_config Configuration Function}
 * @function rtvref.validator.valRegExp.config
 * @param {rtvref.validator.validator_config_settings} settings Configuration settings.
 */
export const config = function (settings) {
  impl = settings.impl;
};

/**
 * {@link rtvref.validator.type_validator Validator} for the
 *  {@link rtvref.types.REGEXP REGEXP} type.
 * @function rtvref.validator.valRegExp.default
 * @param {*} v Value to validate.
 * @param {string} [q] Validation qualifier. Defaults to
 *  {@link rtvref.qualifiers.REQUIRED REQUIRED}.
 * @returns {(rtvref.RtvSuccess|rtvref.RtvError)} An `RtvSuccess` if valid; `RtvError` if not.
 */
export default function valRegExp(v, q = REQUIRED) {
  if (valuePermitted(v, q)) {
    return new RtvSuccess();
  }

  if (isRegExp(v)) {
    return new RtvSuccess();
  }

  return new RtvError(
    v,
    impl.toTypeset(type, q),
    [],
    impl.toTypeset(type, q, true)
  );
}
