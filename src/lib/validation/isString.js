////// isString validator

import {default as _isFinite} from 'lodash/isFinite';

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
      if (args.exact) {
        valid = (v === args.exact);
      } else if (args.partial) {
        valid = v.includes(args.partial);
      } else {
        if (valid && _isFinite(args.min) && args.min >= 0) {
          valid = (v.length >= args.min);
        }

        if (valid && _isFinite(args.max) && args.max >= 0) {
          valid = (v.length <= args.max);
        }
      }
    }
  }

  return valid;
};

export const type = types.STRING;
