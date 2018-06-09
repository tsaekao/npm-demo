////// isMap validator

import {default as _isMap} from 'lodash/isMap';

import isFinite from './isFinite';
import isString from './isString';

import types from '../types';
import qualifiers from '../qualifiers';
import isTypeset from '../validation/isTypeset';

let impl; // @type {rtvref.impl}

/**
 * Type: {@link rtvref.types.MAP MAP}
 * @const {string} rtvref.validator.isMap.type
 */
export const type = types.MAP;

/**
 * {@link rtvref.validator.validator_config Configuration Function}
 * @function rtvref.validator.isMap.config
 * @param {Object} settings Standard configuration settings.
 */
export const config = function(settings) {
  impl = settings.impl;
};

//
// Determines if a typeset represents a string, and only a string.
// @param {rtvref.types.typeset} ts Typeset to check.
// @return {boolean} `true` if so; `false` otherwise.
//
const isStringTypeset = function(ts) {
  const fqts = impl.fullyQualify(ts);

  // must be `[qualifier, STRING]`, otherwise no
  return (fqts.length === 2 && fqts[1] === types.STRING);
};

/**
 * {@link rtvref.validator.type_validator Validator} for the
 *  {@link rtvref.types.MAP MAP} type.
 * @function rtvref.validator.isMap
 * @param {*} v Value to validate.
 * @param {string} [q] Validation qualifier. Defaults to
 *  {@link rtvref.qualifiers.REQUIRED REQUIRED}.
 * @param {rtvref.types.collection_args} [args] Type arguments.
 * @returns {boolean} `true` if validated; `false` otherwise.
 */
export default function isMap(v, q = qualifiers.REQUIRED, args) {
  let valid = _isMap(v);

  if (valid && args) { // then check args
    // start with the easiest/most efficient test: length
    if (valid && isFinite(args.length) && args.length >= 0) {
      valid = (v.size === args.length);
    }

    // remaining args, if specified, require iterating potentially the entire map
    if (valid) {
      // get the typeset for keys
      const tsKeys = isTypeset(args.keys) ? args.keys : undefined;
      // get the key expression only if the keys are expected to be strings
      const tsKeysIsString = !!(tsKeys && isStringTypeset(tsKeys));
      const keyExp = (tsKeysIsString && isString(args.keyExp)) ?
        args.keyExp : undefined;
      // get the key expression flags only if we have a key expression
      const keyFlagSpec = (keyExp && isString(args.keyFlagSpec)) ?
        args.keyFlagSpec : undefined;
      // get the typeset for values
      const tsValues = isTypeset(args.values) ? args.values : undefined;

      if (tsKeys || tsValues) {
        const reKeys = keyExp ? new RegExp(keyExp, keyFlagSpec) : undefined;
        const it = v.entries(); // iterator

        for (let elem of it) {
          const [key, value] = elem;

          if (tsKeys) {
            valid = impl.check(key, tsKeys).valid; // check key against typeset
            if (valid && tsKeysIsString && reKeys) {
              valid = reKeys.test(key); // check key against regex since it's a string
            }
          }

          if (valid && tsValues) {
            valid = impl.check(value, tsValues).valid; // check value against typeset
          }

          if (!valid) {
            break;
          }
        }
      }
    }
  }

  return valid;
}
