////// isArray validator

import {default as _isArray} from 'lodash/isArray';

import isFinite from './isFinite';

import types from '../types';
import qualifiers from '../qualifiers';

/**
 * Type: {@link rtvref.types.ARRAY ARRAY}
 * @const {string} rtvref.validator.isArray.type
 */
export const type = types.ARRAY;

/**
 * {@link rtvref.validator.validator_config Configuration Function}
 * @function rtvref.validator.isArray.config
 * @param {Object} settings Standard configuration settings.
 */
export const config = function(settings) {
};

/**
 * {@link rtvref.validator.type_validator Validator} for the
 *  {@link rtvref.types.ARRAY ARRAY} type.
 * @function rtvref.validator.isArray
 * @param {*} v Value to validate.
 * @param {string} [q] Validation qualifier. Defaults to
 *  {@link rtvref.qualifiers.REQUIRED REQUIRED}.
 * @param {rtvref.types.ARRAY_args} [args] Type arguments.
 * @returns {boolean} `true` if validated; `false` otherwise.
 */
export default isArray = function(v, q = qualifiers.REQUIRED, args) {
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
