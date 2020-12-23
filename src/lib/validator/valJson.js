////// valJson validator

import { type, default as isJson } from '../validation/isJson';

import { default as qualifiers, valuePermitted } from '../qualifiers';
import RtvSuccess from '../RtvSuccess';
import RtvError from '../RtvError';

/**
 * Validator Module: valJson
 * @typedef {Module} rtvref.validator.valJson
 */

const { REQUIRED } = qualifiers;
let impl; // @type {rtvref.impl}

/**
 * [Internal] __FOR UNIT TESTING ONLY:__ The {@link rtvref.impl} instance
 *  configured on this validator.
 * @private
 * @name rtvref.validator.valJson._impl
 * @type {rtvref.impl}
 */
export { impl as _impl };

/**
 * Type: {@link rtvref.types.JSON JSON}
 * @const {string} rtvref.validator.valJson.type
 */
export { type };

/**
 * {@link rtvref.validator.validator_config Configuration Function}
 * @function rtvref.validator.valJson.config
 * @param {rtvref.validator.validator_config_settings} settings Configuration settings.
 */
export const config = function (settings) {
  impl = settings.impl;
};

/**
 * {@link rtvref.validator.type_validator Validator} for the
 *  {@link rtvref.types.JSON JSON} type.
 * @function rtvref.validator.valJson.default
 * @param {*} v Value to validate.
 * @param {string} [q] Validation qualifier. Defaults to
 *  {@link rtvref.qualifiers.REQUIRED REQUIRED}.
 * @returns {(rtvref.RtvSuccess|rtvref.RtvError)} An `RtvSuccess` if valid; `RtvError` if not.
 */
export default function valJson(v, q = REQUIRED) {
  // NOTE: this test, when the qualifier is TRUTHY, will permit `undefined` since it's
  //  falsy, even though it isn't a valid JSON value; this is the intended behavior
  if (valuePermitted(v, q)) {
    return new RtvSuccess();
  }

  if (isJson(v)) {
    return new RtvSuccess();
  }

  return new RtvError(
    v,
    impl.toTypeset(type, q),
    [],
    impl.toTypeset(type, q, true)
  );
}
