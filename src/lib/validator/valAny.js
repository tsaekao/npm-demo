////// valAny validator

import { type, check as isAny } from '../validation/isAny';

import { qualifiers } from '../qualifiers';
import { RtvSuccess } from '../RtvSuccess';
import { RtvError } from '../RtvError';

/**
 * Validator Module: valAny
 * @typedef {Module} rtvref.validator.valAny
 */

const { REQUIRED } = qualifiers;
let impl; // @type {rtvref.impl}

/**
 * [Internal] __FOR UNIT TESTING ONLY:__ The {@link rtvref.impl} instance
 *  configured on this validator.
 * @private
 * @name rtvref.validator.valAny._impl
 * @type {rtvref.impl}
 */
export { impl as _impl };

/**
 * Type: {@link rtvref.types.ANY ANY}
 * @const {string} rtvref.validator.valAny.type
 */
export { type };

/**
 * {@link rtvref.validator.validator_config Configuration Function}
 * @function rtvref.validator.valAny.config
 * @param {rtvref.validator.validator_config_settings} settings Configuration settings.
 */
export const config = function (settings) {
  impl = settings.impl;
};

/**
 * {@link rtvref.validator.type_validator Validator} for the
 *  {@link rtvref.types.ANY ANY} type.
 * @function rtvref.validator.valAny.validate
 * @param {*} v Value to validate.
 * @param {string} [q] Validation qualifier. Defaults to
 *  {@link rtvref.qualifiers.REQUIRED REQUIRED}.
 * @returns {(rtvref.RtvSuccess|rtvref.RtvError)} An `RtvSuccess` if valid; `RtvError` if not.
 */
export const validate = function valAny(v, q = REQUIRED) {
  // NOTE: no point checking basic qualifier rules since this type allows any falsy
  //  value regardless of the qualifier

  if (isAny(v)) {
    return new RtvSuccess({ mvv: v });
  }

  return new RtvError(
    v,
    impl.toTypeset(type, q),
    [],
    impl.toTypeset(type, q, true)
  );
};
