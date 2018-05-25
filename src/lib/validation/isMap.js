////// isMap validator

import {default as _isMap} from 'lodash/isMap';
import {default as _isFinite} from 'lodash/isFinite';

import types from '../types';
import qualifiers from '../qualifiers';
import {isTypeset} from './validation';
import {validator as isString} from './isString';

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
      // get the required length
      const length = _isFinite(args.length) ? args.length : -1;

      if (valid && length >= 0) {
        valid = (v.size >= length);
      }

      // DEBUG HERE...
    }
  }

  return valid;
};

export const type = types.MAP;
