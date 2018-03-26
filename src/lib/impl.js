//// Main Implementation Module \\\\

import {default as _isString} from 'lodash/isString';
import {default as _isBoolean} from 'lodash/isBoolean';

import * as allTypes from './types';
import * as allQualifiers from './qualifiers';
import Enumeration from './Enumeration';

/**
 * RTV Implementation
 * @private
 * @namespace rtv.impl
 */

/**
 * Enumeration of {@link rtvref.types types}.
 * @name rtv.impl.types
 * @type {rtvref.Enumeration}
 */
export const types = new Enumeration(allTypes);

/**
 * Enumeration of {@link rtvref.qualifiers qualifiers}.
 * @name rtv.impl.qualifiers
 * @type {rtvref.Enumeration}
 */
export const qualifiers = new Enumeration(allQualifiers);

/**
 * Checks a value against a shape for compliance.
 * @function rtv.impl.check
 * @param {*} value Value to check.
 * @param {rtvref.types.typeset} shape Expected shape of the value.
 * @returns {boolean} `true` if the `value` is compliant to the `shape`; `false`
 *  otherwise. An exception is __not__ thrown if the `value` is non-compliant.
 * @throws {Error} If `shape` is not a valid typeset.
 * @see rtv.impl.verify
 */
export const check = function(value, shape) {
  // TODO: on failure to check, consider returning a special RtvError object that
  //  contains extra properties to indicate what didn't match, what was expected,
  //  the shape that was checked, the value that was checked, etc.
  //  If check succeeds, return boolean `true`. rtv.check/verify can then test
  //  for the return type since impl shouldn't be exposed externally anyway.
  if (shape === types.STRING) {
    return _isString(value) && !!value;
  } else if (shape === types.BOOLEAN) {
    return _isBoolean(value);
  }

  throw new Error('cannot check value: shape is not a valid typeset');
};
