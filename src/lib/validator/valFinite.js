////// valFinite validator

import { type, default as isFinite } from '../validation/isFinite';

import isArray from '../validation/isArray';

import { qualifiers, valuePermitted } from '../qualifiers';
import RtvSuccess from '../RtvSuccess';
import RtvError from '../RtvError';

/**
 * Validator Module: valFinite
 * @typedef {Module} rtvref.validator.valFinite
 */

const { REQUIRED } = qualifiers;
let impl; // @type {rtvref.impl}

/**
 * [Internal] __FOR UNIT TESTING ONLY:__ The {@link rtvref.impl} instance
 *  configured on this validator.
 * @private
 * @name rtvref.validator.valFinite._impl
 * @type {rtvref.impl}
 */
export { impl as _impl };

/**
 * Type: {@link rtvref.types.FINITE FINITE}
 * @const {string} rtvref.validator.valFinite.type
 */
export { type };

/**
 * {@link rtvref.validator.validator_config Configuration Function}
 * @function rtvref.validator.valFinite.config
 * @param {rtvref.validator.validator_config_settings} settings Configuration settings.
 */
export const config = function (settings) {
  impl = settings.impl;
};

/**
 * {@link rtvref.validator.type_validator Validator} for the
 *  {@link rtvref.types.FINITE FINITE} type.
 *
 * Determines if a value is a number literal __only__ (i.e. a
 *  {@link rtvref.types.primitives primitive}). It does not validate
 *  `new Number(1)`, which is an object that is a number.
 *
 * @function rtvref.validator.valFinite.default
 * @param {*} v Value to validate.
 * @param {string} [q] Validation qualifier. Defaults to
 *  {@link rtvref.qualifiers.REQUIRED REQUIRED}.
 * @param {rtvref.types.numeric_args} [args] Type arguments.
 * @returns {(rtvref.RtvSuccess|rtvref.RtvError)} An `RtvSuccess` if valid; `RtvError` if not.
 */
export default function valFinite(v, q = REQUIRED, args) {
  if (valuePermitted(v, q)) {
    return new RtvSuccess();
  }

  let valid = isFinite(v);

  if (valid && args) {
    // then check args against normal type range
    if (
      isFinite(args.oneOf) ||
      (isArray(args.oneOf) && args.oneOf.length > 0)
    ) {
      const possibilities = [].concat(args.oneOf);
      // flip the result so that valid is set to false if no values match
      valid = !possibilities.every(function (possibility) {
        // return false on first match to break the loop
        return !(isFinite(possibility) && v === possibility);
      });
    } else {
      let min;
      if (valid && isFinite(args.min)) {
        min = args.min;
        valid = v >= min;
      }

      if (valid && isFinite(args.max)) {
        if (min === undefined || args.max >= min) {
          valid = v <= args.max;
        } // else, ignore
      }
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
