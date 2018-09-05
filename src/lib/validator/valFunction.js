////// valFunction validator

import {type, default as isFunction} from '../validation/isFunction';

import {default as qualifiers, nilPermitted} from '../qualifiers';
import RtvSuccess from '../RtvSuccess';
import RtvError from '../RtvError';

const {REQUIRED} = qualifiers;
let impl; // @type {rtvref.impl}

/**
 * Type: {@link rtvref.types.FUNCTION FUNCTION}
 * @const {string} rtvref.validator.valFunction.type
 */
export {type};

/**
 * {@link rtvref.validator.validator_config Configuration Function}
  * @function rtvref.validator.valFunction.config
 * @param {rtvref.validator.validator_config_settings} settings Configuration settings.
 */
export const config = function(settings) {
  impl = settings.impl;
};

/**
 * {@link rtvref.validator.type_validator Validator} for the
 *  {@link rtvref.types.FUNCTION FUNCTION} type.
 * @function rtvref.validator.valFunction.default
 * @param {*} v Value to validate.
 * @param {string} [q] Validation qualifier. Defaults to
 *  {@link rtvref.qualifiers.REQUIRED REQUIRED}.
 * @returns {(rtvref.RtvSuccess|rtvref.RtvError)} An `RtvSuccess` if valid; `RtvError` if not.
 */
export default function valFunction(v, q = REQUIRED) {
  if (nilPermitted(v, q)) {
    return new RtvSuccess();
  }

  if (isFunction(v)) {
    return new RtvSuccess();
  }

  return new RtvError(v, impl.toTypeset(type, q), [], impl.toTypeset(type, q, true));
}
