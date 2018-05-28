////// isFinite validator

import {default as _isFinite} from 'lodash/isFinite';

import types from '../types';
import qualifiers from '../qualifiers';

/**
 * {@link rtvref.validation.validator Validator} function for the
 *  {@link rtvref.types.FINITE FINITE} type.
 *
 * Determines if a value is a number literal __only__ (i.e. a
 *  {@link rtvref.types.primitives primitive}). It does not validate
 *  `new Number(1)`, which is an object that is a number.
 *
 * @function rtvref.validation.isFinite
 * @param {*} v Value to validate.
 * @param {string} [q] Validation qualifier. Defaults to
 *  {@link rtvref.qualifiers.REQUIRED REQUIRED}.
 * @param {rtvref.types.numeric_args} [args] Type arguments.
 * @returns {boolean} `true` if validated; `false` otherwise.
 */
export const validator = function isFinite(v, q = qualifiers.REQUIRED, args) {
  let valid = _isFinite(v); // eliminates NaN, +/-Infinity

  if (valid) {
    if (valid && args) { // then check args
      if (_isFinite(args.exact)) { // ignore if NaN, +/-Infinity
        valid = (v === args.exact);
      } else {
        let min;
        if (valid && _isFinite(args.min)) { // ignore if NaN, +/-Infinity
          min = args.min;
          valid = (v >= args.min);
        }

        if (valid && _isFinite(args.max)) { // ignore if NaN, +/-Infinity
          if (min === undefined || args.max >= min) {
            valid = (v <= args.max);
          } // else, ignore
        }
      }
    }
  }

  return valid;
};

export const type = types.FINITE;
