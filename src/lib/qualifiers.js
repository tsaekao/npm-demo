////// Qualifier Definitions

import Enumeration from './Enumeration';
import isFalsy from './validation/isFalsy';

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
 * Required qualifier: The value __must__ be of the expected type. Depending on
 *  the type, additional requirements may be enforced.
 *
 * Unless otherwise stated in type-specific rules, this qualifier does not
 *  permit the value to be `null` or `undefined`.
 *
 * Note the fact the value cannot be `undefined` implicitly requires a
 *  {@link rtvref.types.shape_descriptor shape}'s property to be defined _somewhere_
 *  its prototype chain (if it weren't, then its value would be `undefined`,
 *  violating the requirements). For example, the shape `{name: [EXPECTED, STRING]}`
 *  would require the `name` property to exist and not be `undefined`, but would
 *  permit it to be `null` or even an empty string.
 *
 * See specific type for additional rules.
 *
 * @name rtvref.qualifiers.REQUIRED
 * @const {string}
 * @see {@link rtvref.types}
 * @see {@link rtvref.types.STRING}
 */
const REQUIRED = '!';

/**
 * Expected qualifier: The value _should_ be of the expected type. Depending on
 *  the type, additional requirements may be enforced.
 *
 * Unless otherwise stated in type-specific rules, this qualifier does _not_ permit
 *  the value to be `undefined`, but does _permit_ it to be `null`.
 *
 * Note the fact the value cannot be `undefined` implicitly requires a
 *  {@link rtvref.types.shape_descriptor shape}'s property to be defined _somewhere_
 *  its prototype chain (if it weren't, then its value would be `undefined`,
 *  violating the requirements). For example, the shape `{name: [EXPECTED, STRING]}`
 *  would require the `name` property to exist and not be `undefined`, but would
 *  permit it to be `null` or even an empty string.
 *
 * See specific type for additional rules.
 *
 * @name rtvref.qualifiers.EXPECTED
 * @const {string}
 * @see {@link rtvref.types}
 * @see {@link rtvref.types.STRING}
 */
const EXPECTED = '*';

/**
 * Optional qualifier: The value _may_ be of the expected type. Depending on
 *  the type, additional requirements may be enforced.
 *
 * Unless otherwise stated in type-specific rules, this qualifier _permits_ a
 *  the value to be `null` as well as `undefined`.
 *
 * Note the fact the value can be `undefined` implies it does _not_ require a
 *  {@link rtvref.types.shape_descriptor shape}'s property to be defined anywhere in
 *  its prototype chain.
 *
 * See specific type for additional rules.
 *
 * @name rtvref.qualifiers.OPTIONAL
 * @const {string}
 * @see {@link rtvref.types}
 */
const OPTIONAL = '?';

/**
 * Truthy qualifier: If the value is _truthy_, it must be of the expected type.
 *  Depending on the type, additional requirements may be enforced.
 *
 * Think of this qualifier as, "if _truthy_, the value is
 *  {@link rtvref.qualifiers.REQUIRED required} to be of the specified type."
 *
 * Unless otherwise stated in type-specific rules, this qualifier does _permit_
 *  the value to be any {@link rtvref.types.falsy_values falsy value}.
 *
 * Note the fact the value can be `undefined` implies it does _not_ require a
 *  {@link rtvref.types.shape_descriptor shape}'s property to be defined anywhere in
 *  its prototype chain.
 *
 * See specific type for additional rules.
 *
 * @name rtvref.qualifiers.TRUTHY
 * @const {string}
 * @see {@link rtvref.types}
 */
const TRUTHY = '+';

//
// ^^^^^^^ INSERT NEW QUALIFIERS ^^^^^^^ ABOVE THIS SECTION ^^^^^^^
//

/**
 * Default qualifier: {@link rtvref.qualifiers.REQUIRED}
 * @const {string} rtvref.qualifiers.DEFAULT_QUALIFIER
 */
export const DEFAULT_QUALIFIER = REQUIRED;

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
export const valuePermitted = function (v, q = REQUIRED) {
  if (q === REQUIRED) {
    return false;
  }

  if (q === EXPECTED) {
    return v === null;
  }

  if (q === OPTIONAL) {
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
export default new Enumeration(
  {
    REQUIRED,
    EXPECTED,
    OPTIONAL,
    TRUTHY,
  },
  'qualifiers'
);
