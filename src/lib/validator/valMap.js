////// valMap validator

import {type, default as isMap} from '../validation/isMap';

import isFinite from '../validation/isFinite';
import isString from '../validation/isString';
import isTypeset from '../validation/isTypeset';

import types from '../types';
import {default as qualifiers, nilPermitted} from '../qualifiers';
import RtvSuccess from '../RtvSuccess';
import RtvError from '../RtvError';
import {print} from '../util';

/**
 * Validator Module: valMap
 * @typedef {Module} rtvref.validator.valMap
 */

const {REQUIRED} = qualifiers;
let impl; // @type {rtvref.impl}

/**
 * [Internal] __FOR UNIT TESTING ONLY:__ The {@link rtvref.impl} instance
 *  configured on this validator.
 * @private
 * @name rtvref.validator.valMap._impl
 * @type {rtvref.impl}
 */
export {impl as _impl};

/**
 * Type: {@link rtvref.types.MAP MAP}
 * @const {string} rtvref.validator.valMap.type
 */
export {type};

/**
 * {@link rtvref.validator.validator_config Configuration Function}
 * @function rtvref.validator.valMap.config
 * @param {rtvref.validator.validator_config_settings} settings Configuration settings.
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
 * @function rtvref.validator.valMap.default
 * @param {*} v Value to validate.
 * @param {string} [q] Validation qualifier. Defaults to
 *  {@link rtvref.qualifiers.REQUIRED REQUIRED}.
 * @param {rtvref.types.collection_args} [args] Type arguments.
 * @returns {(rtvref.RtvSuccess|rtvref.RtvError)} An `RtvSuccess` if valid; `RtvError` if not.
 */
export default function valMap(v, q = REQUIRED, args) {
  if (nilPermitted(v, q)) {
    return new RtvSuccess();
  }

  let valid = isMap(v);
  let result; // @type {(rtvref.RtvSuccess|rtvref.RtvError)}

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
      const keyExp = (tsKeysIsString && args.keyExp && isString(args.keyExp)) ?
        args.keyExp : undefined;
      // get the key expression flags only if we have a key expression
      const keyFlags = (keyExp && args.keyFlags && isString(args.keyFlags)) ?
        args.keyFlags : undefined;
      // get the typeset for values
      const tsValues = isTypeset(args.values) ? args.values : undefined;

      if (tsKeys || tsValues) {
        const reKeys = keyExp ? new RegExp(keyExp, keyFlags) : undefined;
        const it = v.entries(); // iterator

        for (let elem of it) {
          const [key, value] = elem;

          if (tsKeys) {
            result = impl.check(key, tsKeys); // check KEY against typeset
            valid = result.valid;

            if (!result.valid) {
              // create a new error from the original, but with the KEY prepended to the path
              result = new RtvError(v, impl.toTypeset(type, q, args),
                  [`key=${print(key)}`].concat(result.path), result.cause);
            }

            if (valid && tsKeysIsString && reKeys) {
              valid = reKeys.test(key); // check key against regex since it's a string
              if (!valid) {
                result = new RtvError(v, impl.toTypeset(type, q, args),
                    [`key=${print(key)}`], impl.toTypeset(type, q, args, true));
              }
            }
          }

          if (valid && tsValues) {
            result = impl.check(value, tsValues); // check VALUE against typeset
            valid = result.valid;

            if (!result.valid) {
              // create a new error from the original, but still with the KEY added to the path
              result = new RtvError(v, impl.toTypeset(type, q, args),
                  [`valueKey=${print(key)}`].concat(result.path), result.cause);
            }
          }

          if (!valid) { // break on first invalid key or value
            break;
          }
        }
      }
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
