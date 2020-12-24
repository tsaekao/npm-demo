////// Qualifier Definitions

import * as pqs from './pureQualifiers';
import { Enumeration } from './Enumeration';
import { check as isFalsy } from './validation/isFalsy';

/**
 * <h3>Qualifiers</h3>
 *
 * Qualifiers determine the degree at which a value must be of a given type.
 *
 * @namespace rtvref.qualifiers
 */

/**
 * <h3>Restricted Values</h3>
 *
 * Qualifiers impose restrictions on certain JavaScript values. Currently, the
 *  list of restricted values is the same as the list of JavaScript's
 *  {@link rtvref.types.falsy_values falsy values}. This may change in the future
 *  if more qualifiers are added.
 *
 * See the documentation for each qualifier to know which of these values they
 *  permit or restrict.
 *
 * @typedef {void} rtvref.qualifiers.restricted_values
 * @see {@link rtvref.qualifiers.valuePermitted}
 */

/**
 * Default qualifier: {@link rtvref.qualifiers.REQUIRED}
 * @const {string} rtvref.qualifiers.DEFAULT_QUALIFIER
 */
export const DEFAULT_QUALIFIER = pqs.REQUIRED;

/**
 * Convenience function to check if a value is permitted under basic qualifier rules:
 *
 * - REQUIRED: Cannot be any {@link rtvref.types.falsy_values falsy value}, including
 *   `undefined` and `null`.
 * - EXPECTED: Can be `null`.
 * - OPTIONAL: Can be either `undefined` or `null`.
 * - TRUTHY: Can be any {@link rtvref.types.falsy_values falsy value}.
 *
 * @function rtvref.qualifiers.valuePermitted
 * @param {*} v Value to check.
 * @param {string} [q] Validation qualifier. Defaults to
 *  {@link rtvref.qualifiers.REQUIRED REQUIRED}.
 * @returns {boolean} `true` if the value is _falsy_ and the specific value
 *  is permitted by the basic qualifier's rules; `false` otherwise.
 *
 *  For example,
 *
 *  - `valuePermitted(null, REQUIRED) === false`
 *  - `valuePermitted(null, EXPECTED) === true`
 *  - `valuePermitted(1, *) === false` because the value `1` is not any of the
 *    permitted _falsy_ values for any qualifier
 *  - `valuePermitted(false, OPTIONAL) === false` because the value `false` is
 *    not permitted by OPTIONAL
 */
export const valuePermitted = function (v, q = pqs.REQUIRED) {
  if (q === pqs.REQUIRED) {
    return false;
  }

  if (q === pqs.EXPECTED) {
    return v === null;
  }

  if (q === pqs.OPTIONAL) {
    return v === undefined || v === null;
  }

  // TRUTHY permits any falsy value
  return isFalsy(v);
};

/**
 * Enumeration (`string -> string`) of all qualifiers:
 *
 * - {@link rtvref.qualifiers.REQUIRED REQUIRED}
 * - {@link rtvref.qualifiers.EXPECTED EXPECTED}
 * - {@link rtvref.qualifiers.OPTIONAL OPTIONAL}
 * - {@link rtvref.qualifiers.TRUTHY TRUTHY}
 *
 * @name rtvref.qualifiers.qualifiers
 * @type {rtvref.Enumeration}
 */
export const qualifiers = new Enumeration(pqs, 'qualifiers');
