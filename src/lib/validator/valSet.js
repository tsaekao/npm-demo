////// isSet validator

import {type, default as isSet} from '../validation/isSet';

import isFinite from '../validation/isFinite';
import isTypeset from '../validation/isTypeset';

import {default as qualifiers, nilPermitted} from '../qualifiers';
import RtvSuccess from '../RtvSuccess';
import RtvError from '../RtvError';
import {print} from '../util';

const {REQUIRED} = qualifiers;
let impl; // @type {rtvref.impl}

/**
 * [Internal] __FOR UNIT TESTING ONLY:__ The {@link rtvref.impl} instance
 *  configured on this validator.
 * @private
 * @name rtvref.validator.valObject._impl
 * @type {rtvref.impl}
 */
export {impl as _impl};

/**
 * Type: {@link rtvref.types.SET SET}
 * @const {string} rtvref.validator.isSet.type
 */
export {type};

/**
 * {@link rtvref.validator.validator_config Configuration Function}
  * @function rtvref.validator.valSet.config
 * @param {rtvref.validator.validator_config_settings} settings Configuration settings.
 */
export const config = function(settings) {
  impl = settings.impl;
};

/**
 * {@link rtvref.validator.type_validator Validator} for the
 *  {@link rtvref.types.SET SET} type.
  * @function rtvref.validator.valSet.default
 * @param {*} v Value to validate.
 * @param {string} [q] Validation qualifier. Defaults to
 *  {@link rtvref.qualifiers.REQUIRED REQUIRED}.
 * @param {rtvref.types.collection_args} [args] Type arguments.
 * @returns {(rtvref.RtvSuccess|rtvref.RtvError)} An `RtvSuccess` if valid; `RtvError` if not.
 */
export default function valSet(v, q = REQUIRED, args) {
  if (nilPermitted(v, q)) {
    return new RtvSuccess();
  }

  let valid = isSet(v);
  let result; // @type {(rtvref.RtvSuccess|rtvref.RtvError)}

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
        const it = v.values(); // iterator of straight values

        for (let elem of it) {
          result = impl.check(elem, tsValues); // check value against typeset
          valid = result.valid;

          if (!result.valid) {
            // create a new error from the original, but with the value prepended to
            //  the path (since sets don't have indexes; they just have unique values)
            result = new RtvError(v, impl.toTypeset(type, q, args),
                [print(elem)].concat(result.path), result.cause);
          }

          if (!valid) { // break on first invalid value
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
