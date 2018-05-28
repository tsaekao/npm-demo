////// isMap validator

import {default as _isMap} from 'lodash/isMap';

import {validator as isFinite} from './isFinite';
import {validator as isString} from './isString';

import types from '../types';
import qualifiers from '../qualifiers';
import {isTypeset} from './validation';
import * as impl from '../impl';

/**
 * {@link rtvref.validation.validator Validator} function for the
 *  {@link rtvref.types.MAP MAP} type.
 * @function rtvref.validation.isMap
 * @param {*} v Value to validate.
 * @param {string} [q] Validation qualifier. Defaults to
 *  {@link rtvref.qualifiers.REQUIRED REQUIRED}.
 * @param {rtvref.types.collection_args} [args] Type arguments.
 * @returns {boolean} `true` if validated; `false` otherwise.
 */
export const validator = function isMap(v, q = qualifiers.REQUIRED, args) {
  let valid = _isMap(v);

  if (valid) {
    if (valid && args) { // then check args
      // start with the easiest/most efficient test: length
      if (valid && isFinite(args.length) && args.length >= 0) {
        valid = (v.size >= args.length);
      }

      // remaining args, if specified, require iterating potentially the entire map
      if (valid) {
        // get the typeset for keys
        const tsKeys = isTypeset(args.keys) ? args.keys : undefined;
        // get the key expression only if the keys are expected to be strings
        const keyExp = (tsKeys === types.STRING && isString(args.keyExp)) ?
          args.keyExp : undefined;
        // get the key expression flags only if we have a key expression
        const keyFlagSpec = (keyExp && isString(args.keyFlagSpec)) ?
          args.keyFlagSpec : undefined;
        // get the typeset for values
        const tsValues = isTypeset(args.values) ? args.values : undefined;

        if (tsKeys || tsValues) {
          const reKeys = keyExp ? new RegExp(keyExp, keyFlagSpec) : undefined;
          const it = v.entries(); // iterator
          let next = it.next();

          while (valid && !next.done) {
            const [key, value] = next.value;

            if (valid && tsKeys) {
              valid = impl.check(key, tsKeys); // check key against typeset
              if (valid && tsKeys === types.STRING && reKeys) {
                valid = reKeys.test(key); // check key against regex since it's a string
              }
            }

            if (valid && tsValues) {
              valid = impl.check(value, tsValues); // check value against typeset
            }

            next = it.next();
          }
        }
      }
    }
  }

  return valid;
};

export const type = types.MAP;
