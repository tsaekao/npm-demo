////// isNumber validator

import {default as _isNumber} from 'lodash/isNumber';
import {default as _isNaN} from 'lodash/isNaN';

import types from '../types';
import qualifiers from '../qualifiers';

/**
 * {@link rtvref.validation.validator Validator} function for the
 *  {@link rtvref.types.NUMBER NUMBER} type.
 *
 * Determines if a value is a number literal __only__ (i.e. a
 *  {@link rtvref.types.primitives primitive}). It does not validate
 *  `new Number(1)`, which is an object that is a number.
 *
 * @function rtvref.validation.isNumber
 * @param {*} v Value to validate.
 * @param {string} [q] Validation qualifier. Defaults to
 *  {@link rtvref.qualifiers.REQUIRED REQUIRED}.
 * @param {rtvref.types.numeric_args} [args] Type arguments.
 * @returns {boolean} `true` if validated; `false` otherwise.
 */
export const validator = function isNumber(v, q = qualifiers.REQUIRED, args) {
  let valid = (typeof v === 'number');

  if (valid) {
    if (q === qualifiers.REQUIRED) {
      // cannot be NaN
      valid = !_isNaN(v);
    }

    if (valid && args) { // then check args
      if (_isNumber(args.exact)) { // NaN OK for this arg (careful: NaN !== NaN...)
        valid = (v === args.exact) || (_isNaN(v) && _isNaN(args.exact));
      } else {
        let min;
        if (valid && _isNumber(args.min) && !_isNaN(args.min)) {
          min = args.min;
          valid = (v >= min);
        }

        if (valid && _isNumber(args.max) && !_isNaN(args.max)) {
          if (min === undefined || args.max >= min) {
            valid = (v <= args.max);
          } // else, ignore
        }
      }
    }
  }

  return valid;
};

export const type = types.NUMBER;
