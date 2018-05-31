////// isArray validator

import {default as _isArray} from 'lodash/isArray';

import {validator as isFinite} from './isFinite';

import types from '../types';
import qualifiers from '../qualifiers';

/**
 * {@link rtvref.validation.validator Validator} function for the
 *  {@link rtvref.types.ARRAY ARRAY} type.
 * @function rtvref.validation.isArray
 * @param {*} v Value to validate.
 * @param {string} [q] Validation qualifier. Defaults to
 *  {@link rtvref.qualifiers.REQUIRED REQUIRED}.
 * @param {rtvref.types.ARRAY_args} [args] Type arguments.
 * @returns {boolean} `true` if validated; `false` otherwise.
 */
export const validator = function isArray(v, q = qualifiers.REQUIRED, args) {
  let valid = _isArray(v);

  if (valid && args) { // then check args
    if (isFinite(args.length) && args.length >= 0) {
      valid = (v.length === args.length);
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
    }
  }

  return valid;
};

export const type = types.ARRAY;
