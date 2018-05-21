////// isString validator

import {default as _isFinite} from 'lodash/isFinite';
import qualifiers from '../qualifiers';

/**
 * Determines if a value is a string literal __only__ (i.e. a
 *  {@link rtvref.types.primitives primitive}). It does not validate
 *  `new String('value')`, which is an object that is a string.
 * @function rtvref.validation.isString
 * @param {*} v Value to validate.
 * @param {string}[q=rtvref.qualifiers.REQUIRED] Validation qualifier.
 * @param {rtvref.types.STRING_args} [args] Type arguments.
 * @returns {boolean} `true` if it is; `false` otherwise.
 * @see {@link rtvref.types.STRING}
 * @see {@link rtvref.qualifiers.REQUIRED}
 */
export default function isString(v, q, args) {
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
        const min = _isFinite(args.min) ? args.min : (q === qualifiers.REQUIRED ? 1 : 0);
        const max = _isFinite(args.max) ? args.max : -1;
        valid = (v.length >= min) && (max < 0 || v.length <= max);
      }
    }
  }

  return valid;
}
