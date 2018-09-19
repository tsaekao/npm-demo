////// valHashMap validator

import _forEach from 'lodash/forEach';

import {type, default as isHashMap} from '../validation/isHashMap';

import isFinite from '../validation/isFinite';
import isString from '../validation/isString';
import isTypeset from '../validation/isTypeset';

import {default as qualifiers, nilPermitted} from '../qualifiers';
import RtvSuccess from '../RtvSuccess';
import RtvError from '../RtvError';
import {print} from '../util';

/**
 * Validator Module: valHashMap
 * @typedef {Module} rtvref.validator.valHashMap
 */

const {REQUIRED} = qualifiers;
let impl; // @type {rtvref.impl}

/**
 * [Internal] __FOR UNIT TESTING ONLY:__ The {@link rtvref.impl} instance
 *  configured on this validator.
 * @private
 * @name rtvref.validator.valHashMap._impl
 * @type {rtvref.impl}
 */
export {impl as _impl};

/**
 * Type: {@link rtvref.types.HASH_MAP HASH_MAP}
 * @const {string} rtvref.validator.valHashMap.type
 */
export {type};

/**
 * {@link rtvref.validator.validator_config Configuration Function}
 * @function rtvref.validator.valHashMap.config
 * @param {rtvref.validator.validator_config_settings} settings Configuration settings.
 */
export const config = function(settings) {
  impl = settings.impl;
};

/**
 * {@link rtvref.validator.type_validator Validator} for the
 *  {@link rtvref.types.HASH_MAP HASH_MAP} type.
 * @function rtvref.validator.valHashMap.default
 * @param {*} v Value to validate.
 * @param {string} [q] Validation qualifier. Defaults to
 *  {@link rtvref.qualifiers.REQUIRED REQUIRED}.
 * @param {rtvref.types.collection_args} [args] Type arguments.
 * @returns {(rtvref.RtvSuccess|rtvref.RtvError)} An `RtvSuccess` if valid; `RtvError` if not.
 */
export default function valHashMap(v, q = REQUIRED, args) {
  if (nilPermitted(v, q)) {
    return new RtvSuccess();
  }

  let valid = isHashMap(v);
  let result; // @type {(rtvref.RtvSuccess|rtvref.RtvError)}

  if (valid && args) { // then check args
    const keys = Object.keys(v);

    // start with the easiest/most efficient test: length
    if (valid && isFinite(args.length) && args.length >= 0) {
      valid = (keys.length === args.length);
    }

    // remaining args, if specified, require iterating potentially the entire map
    if (valid) {
      // get the key expression
      const keyExp = (args.keyExp && isString(args.keyExp)) ? args.keyExp : undefined;
      // get the key expression flags only if we have a key expression
      const keyFlagSpec = (keyExp && args.keyFlagSpec && isString(args.keyFlagSpec)) ?
        args.keyFlagSpec : undefined;
      // get the typeset for values
      const tsValues = isTypeset(args.values) ? args.values : undefined;

      if (keyExp || tsValues) {
        const reKeys = keyExp ? new RegExp(keyExp, keyFlagSpec) : undefined;

        _forEach(keys, function(key) {
          const value = v[key];

          if (reKeys) {
            valid = reKeys.test(key); // check key against regex since it's a string
            if (!valid) {
              result = new RtvError(v, impl.toTypeset(type, q, args),
                  [`key=${print(key)}`], impl.toTypeset(type, q, args, true));
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

          return valid; // break on first invalid key or value
        });
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
