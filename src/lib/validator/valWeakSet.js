////// valWeakSet validator

import { type, check as isWeakSet } from '../validation/isWeakSet';

import { qualifiers, valuePermitted } from '../qualifiers';
import { RtvSuccess } from '../RtvSuccess';
import { RtvError } from '../RtvError';

/**
 * Validator Module: valWeakSet
 * @typedef {Module} rtvref.validator.valWeakSet
 */

const { REQUIRED } = qualifiers;
let impl; // @type {rtvref.impl}

/**
 * [Internal] __FOR UNIT TESTING ONLY:__ The {@link rtvref.impl} instance
 *  configured on this validator.
 * @private
 * @name rtvref.validator.valWeakSet._impl
 * @type {rtvref.impl}
 */
export { impl as _impl };

/**
 * Type: {@link rtvref.types.WEAK_SET WEAK_SET}
 * @const {string} rtvref.validator.valWeakSet.type
 */
export { type };

/**
 * {@link rtvref.validator.validator_config Configuration Function}
 * @function rtvref.validator.valWeakSet.config
 * @param {rtvref.validator.validator_config_settings} settings Configuration settings.
 */
export const config = function (settings) {
  impl = settings.impl;
};

/**
 * {@link rtvref.validator.type_validator Validator} for the
 *  {@link rtvref.types.WEAK_SET WEAK_SET} type.
 * @function rtvref.validator.valWeakSet.validate
 * @param {*} v Value to validate.
 * @param {string} [q] Validation qualifier. Defaults to
 *  {@link rtvref.qualifiers.REQUIRED REQUIRED}.
 * @returns {(rtvref.RtvSuccess|rtvref.RtvError)} An `RtvSuccess` if valid; `RtvError` if not.
 */
export const validate = function valWeakSet(v, q = REQUIRED) {
  if (valuePermitted(v, q)) {
    return new RtvSuccess({ mvv: v });
  }

  if (isWeakSet(v)) {
    return new RtvSuccess({ mvv: v });
  }

  return new RtvError(
    v,
    impl.toTypeset(type, q),
    [],
    impl.toTypeset(type, q, true)
  );
};
