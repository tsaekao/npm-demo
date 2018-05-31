////// isString validator

import {validator as isFinite} from './isFinite';

import types from '../types';
import qualifiers from '../qualifiers';

/**
 * {@link rtvref.validation.validator Validator} function for the
 *  {@link rtvref.types.STRING STRING} type.
 *
 * Determines if a value is a string literal __only__ (i.e. a
 *  {@link rtvref.types.primitives primitive}). It does not validate
 *  `new String('value')`, which is an object that is a string.
 *
 * @function rtvref.validation.isString
 * @param {*} v Value to validate.
 * @param {string} [q] Validation qualifier. Defaults to
 *  {@link rtvref.qualifiers.REQUIRED REQUIRED}.
 * @param {rtvref.types.STRING_args} [args] Type arguments.
 * @returns {boolean} `true` if validated; `false` otherwise.
 */
export const validator = function isString(v, q = qualifiers.REQUIRED, args) {
  let valid = (typeof v === 'string');

  if (valid) {
    if (q === qualifiers.REQUIRED) {
      valid = !!v; // cannot be empty when required
    }

    if (valid && args) { // then check args
      if (isString(args.exact, qualifiers.EXPECTED)) {
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
  }

  return valid;
};

export const type = types.STRING;
