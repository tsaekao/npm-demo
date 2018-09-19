////// valBoolean validator

import {type, default as isBoolean} from '../validation/isBoolean';

import {default as qualifiers, nilPermitted} from '../qualifiers';
import RtvSuccess from '../RtvSuccess';
import RtvError from '../RtvError';

/**
 * Validator Module: valBoolean
 * @typedef {Module} rtvref.validator.valBoolean
 */

const {REQUIRED} = qualifiers;
let impl; // @type {rtvref.impl}

/**
 * [Internal] __FOR UNIT TESTING ONLY:__ The {@link rtvref.impl} instance
 *  configured on this validator.
 * @private
 * @name rtvref.validator.valBoolean._impl
 * @type {rtvref.impl}
 */
export {impl as _impl};

/**
 * Type: {@link rtvref.types.BOOLEAN BOOLEAN}
 * @const {string} rtvref.validator.valBoolean.type
 */
export {type};

/**
 * {@link rtvref.validator.validator_config Configuration Function}
 * @function rtvref.validator.valBoolean.config
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
 * @function rtvref.validator.valBoolean.default
 * @param {*} v Value to validate.
 * @param {string} [q] Validation qualifier. Defaults to
 *  {@link rtvref.qualifiers.REQUIRED REQUIRED}.
 * @returns {(rtvref.RtvSuccess|rtvref.RtvError)} An `RtvSuccess` if valid; `RtvError` if not.
 */
export default function valBoolean(v, q = REQUIRED) {
  if (nilPermitted(v, q)) {
    return new RtvSuccess();
  }

  if (isBoolean(v)) {
    return new RtvSuccess();
  }

  return new RtvError(v, impl.toTypeset(type, q), [], impl.toTypeset(type, q, true));
}
