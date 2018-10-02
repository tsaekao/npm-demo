////// Qualifier Definitions

import Enumeration from './Enumeration';

/**
 * <h3>Qualifiers</h3>
 *
 * Qualifiers determine the degree at which a value must be of a given type.
 *
 * @namespace rtvref.qualifiers
 */

/**
 * Required qualifier: The value __must__ be of the expected type. Depending on
 *  the type, additional requirements may be enforced.
 *
 * Unless otherwise stated in type-specific rules, this qualifier does not
 *  allow the value to be `null` or `undefined`.
 *
 * Note the fact the value cannot be `undefined` implicitly requires a
 *  {@link rtvref.types.shape_descriptor shape}'s property to be defined _somewhere_
 *  its prototype chain (if it weren't, then its value would be `undefined`,
 *  violating the requirements). For example, the shape `{name: [EXPECTED, STRING]}`
 *  would require the `name` property to exist and not be `undefined`, but would
 *  allow it to be `null` or even an empty string.
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
 * Unless otherwise stated in type-specific rules, this qualifier does _not_ allow
 *  the value to be `undefined`, but does _allow_ it to be `null`.
 *
 * Note the fact the value cannot be `undefined` implicitly requires a
 *  {@link rtvref.types.shape_descriptor shape}'s property to be defined _somewhere_
 *  its prototype chain (if it weren't, then its value would be `undefined`,
 *  violating the requirements). For example, the shape `{name: [EXPECTED, STRING]}`
 *  would require the `name` property to exist and not be `undefined`, but would
 *  allow it to be `null` or even an empty string.
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
 * Unless otherwise stated in type-specific rules, this qualifier _allows_ a
 *  the value to be `null` as well as `undefined`,
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

//
// ^^^^^^^ INSERT NEW QUALIFIERS ^^^^^^^ ABOVE THIS SECTION ^^^^^^^
//

/**
 * Default qualifier: {@link rtvref.qualifiers.REQUIRED}
 * @const {string} rtvref.qualifiers.DEFAULT_QUALIFIER
 */
export const DEFAULT_QUALIFIER = REQUIRED;

/**
 * Convenience function to check if a nil value (either `undefined` or `null`)
 *  is permitted under basic qualifier rules:
 *
 * - REQUIRED: Cannot be `undefined` nor `null`.
 * - EXPECTED: Can be `null`.
 * - OPTIONAL: Can be either `undefined` or `null`.
 *
 * @function rtvref.qualifiers.nilPermitted
 * @param {*} v Value to check.
 * @param {string} [q] Validation qualifier. Defaults to
 *  {@link rtvref.qualifiers.REQUIRED REQUIRED}.
 * @returns {boolean} `true` if the value is _nil_ (either `null` or `undefined`)
 *  and the basic qualifier's rules allow it to be so; `false` otherwise.
 *
 *  For example, `nilPermitted(null, REQUIRED) === false` while
 *   `nilPermitted(null, EXPECTED) === true`. Also, `nilPermitted(1, *) === false`
 *   because the value `1` is not _nil_
 */
export const nilPermitted = function(v, q = REQUIRED) {
  if (q === REQUIRED) {
    return false;
  }

  if (q === EXPECTED) {
    return (v === null);
  }

  return (v === undefined || v === null);
};

/**
 * Enumeration (`string -> string`) of all qualifiers:
 *
 * - {@link rtvref.qualifiers.REQUIRED REQUIRED}
 * - {@link rtvref.qualifiers.EXPECTED EXPECTED}
 * - {@link rtvref.qualifiers.OPTIONAL OPTIONAL}
 *
 * @name rtvref.qualifiers.qualifiers
 * @type {rtvref.Enumeration}
 */
export default new Enumeration({
  REQUIRED,
  EXPECTED,
  OPTIONAL
}, 'qualifiers');
