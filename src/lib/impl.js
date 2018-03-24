//// Main Implementation Module \\\\

import isString from 'lodash/isString';

import * as allTypes from './types';
import * as allQualifiers from './qualiiers';
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
 * @returns {Boolean} `true` if the `value` is compliant to the `shape`; `false`
 *  otherwise. An exception is __not__ thrown if the `value` is non-compliant.
 * @see rtv.impl.verify
 */
export const check = function(value, shape) {
  // TODO: testing 'check'
  return isString(value) && !!value;
};
