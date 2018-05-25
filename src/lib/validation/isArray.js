////// isArray validator

import {default as _isArray} from 'lodash/isArray';
import {default as _isFinite} from 'lodash/isFinite';

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

  if (valid) {
    if (valid && args) { // then check args
      if (_isFinite(args.length) && args.length >= 0) {
        valid = (v.length === args.length);
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

export const type = types.ARRAY;
