////// isArray validator

import {default as _forEach} from 'lodash/forEach';

import {type, default as isArray} from '../validation/isArray';

import isFinite from '../validation/isFinite';
import qualifiers from '../qualifiers';
import RtvSuccess from '../RtvSuccess';
import RtvError from '../RtvError';

let impl; // @type {rtvref.impl}

/**
 * Type: {@link rtvref.types.ARRAY ARRAY}
 * @const {string} rtvref.validator.isArray.type
 */
export {type};

/**
 * {@link rtvref.validator.validator_config Configuration Function}
 * @function rtvref.validator.isArray.config
 * @param {rtvref.validator.validator_config_settings} settings Configuration settings.
 */
export const config = function(settings) {
  impl = settings.impl;
};

/**
 * {@link rtvref.validator.type_validator Validator} for the
 *  {@link rtvref.types.ARRAY ARRAY} type.
 * @function rtvref.validator.isArray.default
 * @param {*} v Value to validate.
 * @param {string} [q] Validation qualifier. Defaults to
 *  {@link rtvref.qualifiers.REQUIRED REQUIRED}.
 * @param {rtvref.types.ARRAY_args} [args] Type arguments.
 * @returns {(rtvref.RtvSuccess|rtvref.RtvError)} An `RtvSuccess` if valid; `RtvError` if not.
 */
export default function valArray(v, q = qualifiers.REQUIRED, args) {
  let valid = isArray(v);
  let result; // @type {(rtvref.RtvSuccess|rtvref.RtvError)}

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

    if (valid && args.typeset) {
      // check each element in `value` against the typeset
      _forEach(v, function(elem, idx) {
        result = impl.check(elem, args.typeset);
        valid = result.valid;

        if (!result.valid) {
          // create a new error from the original, but with the index prepended to the path
          result = new RtvError(v, impl.toTypeset(type, q, args),
              [idx].concat(result.path), result.cause);
        }

        return valid; // break on first invalid element
      });
    }
  }

  if (!result) {
    if (valid) {
      result = new RtvSuccess();
    } else {
      result = new RtvError(v, impl.toTypeset(type, q, args), [],
          impl.toTypeset(type, q, args, true));
    }
  }

  return result;
}
