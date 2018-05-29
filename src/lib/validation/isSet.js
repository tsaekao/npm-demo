////// isSet validator

import {default as _isSet} from 'lodash/isSet';

import {validator as isFinite} from './isFinite';
import {validator as isString} from './isString';
import {validator as isArray} from './isArray';

import types from '../types';
import qualifiers from '../qualifiers';
import {isTypeset} from './validation';
import * as impl from '../impl';

/**
 * Determines if a typeset represents a string, and only a string.
 * @param {rtvref.types.typeset} ts Typeset to check.
 * @return {boolean} `true` if so; `false` otherwise.
 */
const isStringTypeset = function(ts) {
  const fqts = impl.fullyQualify(ts);

  // must be `[qualifier, STRING]`, otherwise no
  return (fqts.length === 2 && fqts[1] === types.STRING);
};

/**
 * {@link rtvref.validation.validator Validator} function for the
 *  {@link rtvref.types.SET SET} type.
 * @function rtvref.validation.isSet
 * @param {*} v Value to validate.
 * @param {string} [q] Validation qualifier. Defaults to
 *  {@link rtvref.qualifiers.REQUIRED REQUIRED}.
 * @param {rtvref.types.collection_args} [args] Type arguments.
 * @returns {boolean} `true` if validated; `false` otherwise.
 */
export const validator = function isSet(v, q = qualifiers.REQUIRED, args) {
  let valid = _isSet(v);

  if (valid) {
    if (valid && args) { // then check args
      // start with the easiest/most efficient test: length
      if (valid && isFinite(args.length) && args.length >= 0) {
        valid = (v.size >= args.length);
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
  }

  return valid;
};

export const type = types.SET;
