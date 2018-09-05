////// valString validator

import {type, default as isString} from '../validation/isString';

import isFinite from '../validation/isFinite';

import {default as qualifiers, nilPermitted} from '../qualifiers';
import RtvSuccess from '../RtvSuccess';
import RtvError from '../RtvError';

const {REQUIRED} = qualifiers;
let impl; // @type {rtvref.impl}

/**
 * [Internal] __FOR UNIT TESTING ONLY:__ The {@link rtvref.impl} instance
 *  configured on this validator.
 * @private
 * @name rtvref.validator.valString._impl
 * @type {rtvref.impl}
 */
export {impl as _impl};

/**
 * Type: {@link rtvref.types.STRING STRING}
 * @const {string} rtvref.validator.valString.type
 */
export {type};

/**
 * {@link rtvref.validator.validator_config Configuration Function}
  * @function rtvref.validator.valString.config
 * @param {rtvref.validator.validator_config_settings} settings Configuration settings.
 */
export const config = function(settings) {
  impl = settings.impl;
};

/**
 * {@link rtvref.validator.type_validator Validator} for the
 *  {@link rtvref.types.STRING STRING} type.
 *
 * Determines if a value is a string literal __only__ (i.e. a
 *  {@link rtvref.types.primitives primitive}). It does not validate
 *  `new String('value')`, which is an object that is a string.
 *
 * @function rtvref.validator.valString.default
 * @param {*} v Value to validate.
 * @param {string} [q] Validation qualifier. Defaults to
 *  {@link rtvref.qualifiers.REQUIRED REQUIRED}.
 * @param {rtvref.types.STRING_args} [args] Type arguments.
 * @returns {(rtvref.RtvSuccess|rtvref.RtvError)} An `RtvSuccess` if valid; `RtvError` if not.
 */
export default function valString(v, q = REQUIRED, args) {
  if (nilPermitted(v, q)) {
    return new RtvSuccess();
  }

  let valid = isString(v) || (q !== REQUIRED && v === '');

  if (valid && args) { // then check args
    if (isString(args.exact)) { // empty string OK
      valid = (v === args.exact);
    } else {
      let min;
      if (valid && isFinite(args.min) && args.min >= 0) {
        min = args.min;
        valid = (v.length >= min);
      }

      if (valid && isFinite(args.max) && args.max >= 0) {
        if (min === undefined || args.max >= min) {
          valid = (v.length <= args.max);
        } // else, ignore
      }

      if (valid && args.partial) {
        valid = v.includes(args.partial);
      }
    }
  }

  if (valid) {
    return new RtvSuccess();
  }

  return new RtvError(v, impl.toTypeset(type, q, args), [],
      impl.toTypeset(type, q, args, true));
}
