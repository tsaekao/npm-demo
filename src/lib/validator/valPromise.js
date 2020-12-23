////// valPromise validator

import { type, default as isPromise } from '../validation/isPromise';

import { default as qualifiers, valuePermitted } from '../qualifiers';
import RtvSuccess from '../RtvSuccess';
import RtvError from '../RtvError';

/**
 * Validator Module: valPromise
 * @typedef {Module} rtvref.validator.valPromise
 */

const { REQUIRED } = qualifiers;
let impl; // @type {rtvref.impl}

/**
 * [Internal] __FOR UNIT TESTING ONLY:__ The {@link rtvref.impl} instance
 *  configured on this validator.
 * @private
 * @name rtvref.validator.valPromise._impl
 * @type {rtvref.impl}
 */
export { impl as _impl };

/**
 * Type: {@link rtvref.types.PROMISE PROMISE}
 * @const {string} rtvref.validator.valPromise.type
 */
export { type };

/**
 * {@link rtvref.validator.validator_config Configuration Function}
 * @function rtvref.validator.valPromise.config
 * @param {rtvref.validator.validator_config_settings} settings Configuration settings.
 */
export const config = function (settings) {
  impl = settings.impl;
};

/**
 * {@link rtvref.validator.type_validator Validator} for the
 *  {@link rtvref.types.PROMISE PROMISE} type.
 * @function rtvref.validator.valPromise.default
 * @param {*} v Value to validate.
 * @param {string} [q] Validation qualifier. Defaults to
 *  {@link rtvref.qualifiers.REQUIRED REQUIRED}.
 * @returns {(rtvref.RtvSuccess|rtvref.RtvError)} An `RtvSuccess` if valid; `RtvError` if not.
 */
export default function valPromise(v, q = REQUIRED) {
  if (valuePermitted(v, q)) {
    return new RtvSuccess();
  }

  if (isPromise(v)) {
    return new RtvSuccess();
  }

  return new RtvError(
    v,
    impl.toTypeset(type, q),
    [],
    impl.toTypeset(type, q, true)
  );
}
