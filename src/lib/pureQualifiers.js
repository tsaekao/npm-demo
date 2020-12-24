////// Pure Qualifier Definitions

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
 * @export const {string}
 * @see {@link rtvref.types}
 * @see {@link rtvref.types.STRING}
 */
export const REQUIRED = '!';

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
 * @export const {string}
 * @see {@link rtvref.types}
 * @see {@link rtvref.types.STRING}
 */
export const EXPECTED = '*';

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
 * @export const {string}
 * @see {@link rtvref.types}
 */
export const OPTIONAL = '?';

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
 * @export const {string}
 * @see {@link rtvref.types}
 */
export const TRUTHY = '+';
