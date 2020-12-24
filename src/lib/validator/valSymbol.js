////// valSymbol validator

import { type, default as isSymbol } from '../validation/isSymbol';

import isArray from '../validation/isArray';

import { qualifiers, valuePermitted } from '../qualifiers';
import { RtvSuccess } from '../RtvSuccess';
import { RtvError } from '../RtvError';

/**
 * Validator Module: valSymbol
 * @typedef {Module} rtvref.validator.valSymbol
 */

const { REQUIRED } = qualifiers;
let impl; // @type {rtvref.impl}

/**
 * [Internal] __FOR UNIT TESTING ONLY:__ The {@link rtvref.impl} instance
 *  configured on this validator.
 * @private
 * @name rtvref.validator.valSymbol._impl
 * @type {rtvref.impl}
 */
export { impl as _impl };

/**
 * Type: {@link rtvref.types.SYMBOL SYMBOL}
 * @const {string} rtvref.validator.valSymbol.type
 */
export { type };

/**
 * {@link rtvref.validator.validator_config Configuration Function}
 * @function rtvref.validator.valSymbol.config
 * @param {rtvref.validator.validator_config_settings} settings Configuration settings.
 */
export const config = function (settings) {
  impl = settings.impl;
};

/**
 * {@link rtvref.validator.type_validator Validator} for the
 *  {@link rtvref.types.SYMBOL SYMBOL} type.
 * @function rtvref.validator.valSymbol.default
 * @param {*} v Value to validate.
 * @param {string} [q] Validation qualifier. Defaults to
 *  {@link rtvref.qualifiers.REQUIRED REQUIRED}.
 * @param {rtvref.types.numeric_args} [args] Type arguments.
 * @returns {(rtvref.RtvSuccess|rtvref.RtvError)} An `RtvSuccess` if valid; `RtvError` if not.
 */
export default function valSymbol(v, q = REQUIRED, args) {
  if (valuePermitted(v, q)) {
    return new RtvSuccess();
  }

  let valid = isSymbol(v);

  if (valid && args) {
    if (
      isSymbol(args.oneOf) ||
      (isArray(args.oneOf) && args.oneOf.length > 0)
    ) {
      const possibilities = [].concat(args.oneOf);
      // flip the result so that valid is set to false if no values match
      valid = !possibilities.every(function (possibility) {
        // return false on first match to break the loop
        return !(isSymbol(possibility) && v === possibility);
      });
    }
  }

  if (valid) {
    return new RtvSuccess();
  }

  return new RtvError(
    v,
    impl.toTypeset(type, q, args),
    [],
    impl.toTypeset(type, q, args, true)
  );
}
