////// valString validator

import {type, default as isString} from '../validation/isString';

import isFinite from '../validation/isFinite';
import isArray from '../validation/isArray';

import {default as qualifiers, valuePermitted} from '../qualifiers';
import RtvSuccess from '../RtvSuccess';
import RtvError from '../RtvError';

/**
 * Validator Module: valString
 * @typedef {Module} rtvref.validator.valString
 */

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
  // NOTE: this test, when the qualifier is TRUTHY, will permit an empty string regardless
  //  of any args that may not, which is the intended behavior
  if (valuePermitted(v, q)) {
    return new RtvSuccess();
  }

  // start by ensuring the value is a string, but allow an empty string for now
  let valid = isString(v, {allowEmpty: true});

  // if an arg allows the string to be empty, overriding the qualifier
  let argsAllowEmpty = false;

  if (valid && args) { // then check args
    if (args.exp && isString(args.exp)) { // all other args except expFlags are ignored
      const flagSpec = (args.expFlags && isString(args.expFlags)) ?
        args.expFlags : undefined;
      const re = new RegExp(args.exp, flagSpec);
      valid = re.test(v);
      argsAllowEmpty = (valid && v === '');
    } else {
      // empty string is OK for 'oneOf'
      if (isString(args.oneOf, {allowEmpty: true}) ||
          (isArray(args.oneOf) && args.oneOf.length > 0)) {

        const possibilities = [].concat(args.oneOf);
        // flip the result so that valid is set to false if no values match
        valid = !possibilities.every(function(possibility) {
          // return false on first match to break the loop
          return !(isString(possibility, {allowEmpty: true}) && v === possibility);
        });
        argsAllowEmpty = (valid && v === '');
      } else {
        let min;
        if (valid && isFinite(args.min) && args.min >= 0) {
          min = args.min;
          valid = (v.length >= min);
          argsAllowEmpty = (valid && v === '');
        }

        if (valid && isFinite(args.max) && args.max >= 0) {
          if (min === undefined || args.max >= min) {
            valid = (v.length <= args.max);
            argsAllowEmpty = (valid && v === '');
          } // else, ignore
        }

        if (valid && isString(args.partial)) {
          valid = v.includes(args.partial);
          // NOTE: partial doesn't apply to argsAllowEmpty because it's ignored
          //  if it's empty
        }
      }
    }
  }

  // only REQUIRED qualifier disallows empty strings by default unless an
  //  arg overrides it
  if (valid && !argsAllowEmpty && q === REQUIRED) {
    valid = (v !== '');
  }

  if (valid) {
    return new RtvSuccess();
  }

  return new RtvError(v, impl.toTypeset(type, q, args), [],
      impl.toTypeset(type, q, args, true));
}
