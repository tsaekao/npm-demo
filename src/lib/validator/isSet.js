////// isSet validator

import {default as _isSet} from 'lodash/isSet';

import isFinite from './isFinite';

import types from '../types';
import qualifiers from '../qualifiers';
import isTypeset from '../validation/isTypeset';

let impl; // @type {rtvref.impl}

/**
 * Type: {@link rtvref.types.SET SET}
 * @const {string} rtvref.validator.isSet.type
 */
export const type = types.SET;

/**
 * {@link rtvref.validator.validator_config Configuration Function}
 * @function rtvref.validator.isSet.config
 * @param {Object} settings Standard configuration settings.
 */
export const config = function(settings) {
  impl = settings.impl;
};

/**
 * {@link rtvref.validator.type_validator Validator} for the
 *  {@link rtvref.types.SET SET} type.
 * @function rtvref.validator.isSet
 * @param {*} v Value to validate.
 * @param {string} [q] Validation qualifier. Defaults to
 *  {@link rtvref.qualifiers.REQUIRED REQUIRED}.
 * @param {rtvref.types.collection_args} [args] Type arguments.
 * @returns {boolean} `true` if validated; `false` otherwise.
 */
export default function isSet(v, q = qualifiers.REQUIRED, args) {
  let valid = _isSet(v);

  if (valid && args) { // then check args
    // start with the easiest/most efficient test: length
    if (valid && isFinite(args.length) && args.length >= 0) {
      valid = (v.size === args.length);
    }

    // remaining args, if specified, require iterating potentially the entire set
    if (valid) {
      // get the typeset for values
      const tsValues = isTypeset(args.values) ? args.values : undefined;

      if (tsValues) {
        const it = v.entries(); // iterator

        for (let elem of it) {
          const value = elem.value[1];
          valid = impl.check(value, tsValues); // check value against typeset
          if (!valid) {
            break;
          }
        }
      }
    }
  }

  return valid;
}
