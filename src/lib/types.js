////// Type Definitions

import Enumeration from './Enumeration';

/**
 * <h2>Types</h2>
 * @namespace rtvref.types
 */

/**
 * <h3>Primitives</h3>
 *
 * In RTV.js (as in {@link https://developer.mozilla.org/en-US/docs/Glossary/Primitive ECMAScript 2015}),
 *  a _primitive_ is considered one of the following types:
 *
 * - `undefined`
 * - `null`
 * - `string` (note that `new String('s')` does not produce a _primitive_, it
 *   produces an {@link rtvref.types.OBJECT object}, and __should be avoided__).
 * - `boolean` (note that `new Boolean(true)` does not produce a _primitive_,
 *   it produces an {@link rtvref.types.OBJECT object}, and __should be avoided__).
 * - `number` (note that `new Number(1)` does not produce a _primitive_,
 *   it produces an {@link rtvref.types.OBJECT object}, and __should be avoided__).
 * - `Symbol`
 *
 * @typedef {*} rtvref.types.primitives
 * @see {@link rtvref.validation.isPrimitive}
 */

/**
 * <h3>Rules Per Qualifiers</h3>
 *
 * {@link rtvref.qualifiers Qualifiers} state basic rules. Unless otherwise stated,
 *  every type herein abides by those basic rules. Each type will also impose
 *  additional rules specific to the type of value it represents.
 *
 * For example, while the {@link rtvref.types.FINITE FINITE} type states that the
 *  value must not be `NaN`, `+Infinity`, nor `-Infinity`; it could be `null` if
 *  the qualifier used is `EXPECTED`; and it could be `undefined` if the qualifier
 *  used is `OPTIONAL`.
 *
 * @typedef {*} rtvref.types.rules
 */

/**
 * <h3>Type Arguments</a></h3>
 *
 * Some types will accept, or may even expect, one or more arguments. Each type
 *  will specify whether it has arguments, and if they're optional or required.
 *  Arguments are specified as a single {@link rtvref.types.OBJECT object}
 *  immediately following a type in an __Array__ {@link rtvref.types.typeset typeset}
 *  (i.e. an Array must be used as the typeset in order to provide arguments for
 *  a type).
 *
 * An arguments object immediately follows its type in a typeset, such as
 *  `[PLAIN_OBJECT, {hello: STRING}]`. This would specify the value must be a
 *  {@link rtvref.types.PLAIN_OBJECT plain object} with a shape that includes a
 *  property named 'hello', that property being a
 *  {@link rtvref.qualifiers.REQUIRED required} {@link rtvref.types.STRING string}.
 *  Another example would be `[STRING, {min: 5}]`, which would require a string
 *  of at least 5 characters in length.
 *
 * Since {@link rtvref.qualifiers qualifiers} may affect how a value is validated
 *  against a type, {@link rtvref.types.rules qualifier rules} always take
 *  __precedence__ over any argument specified. For example, `[STRING, {min: 0}]`
 *  would fail to validate an empty string because the _implied_ qualifier
 *  is `REQUIRED`, and per {@link rtvref.types.STRING STRING} qualifier rules,
 *  required strings cannot be empty.
 *
 * @typedef {Object} rtvref.types.type_arguments
 * @see {@link rtvref.validation.isTypeArgs}
 */

/**
 * <h3>Collection Arguments</h3>
 *
 * Describes the keys and values in a collection-based object, which is one of
 *  the following types:
 *
 * - {@link rtvref.types.HASH_MAP HASH_MAP} (NOTE: only __own-enumerable
 *   properties__ are considered part of this type of collection)
 * - {@link rtvref.types.MAP MAP}
 * - {@link rtvref.types.SET SET} (with some exceptions)
 *
 * For example, the following arguments both verify a collection of 3-letter
 *  string keys (upper- or lowercase) to finite numbers:
 *
 * - `{keyExp: '[a-z]{3}', keyFlagSpec: 'i', values: FINITE}`
 * - `{keyExp: '[a-zA-Z]{3}', values: FINITE}`
 *
 * Note that {@link rtvref.types.ARRAY ARRAY} is __not__ included in this list
 *  because the array type has special syntax for describing the type of its items.
 *  See {@link rtvref.types.ARRAY_args ARRAY_args} instead.
 *
 * The {@link rtvref.types.WEAK_MAP WEAK_MAP} and {@link rtvref.types.WEAK_SET WEAK_SET}
 *  types do not apply because, due to their nature, their elements cannot be
 *  iterated.
 *
 * @typedef {Object} rtvref.types.collection_args
 * @property {number} [length] The exact number of elements required in
 *  the collection. A negative value allows for any number of entries. Zero
 *  requires an empty collection. Ignored if not a
 *  {@link rtvref.types.FINITE FINITE} number.
 *
 *  Applies to: All collection types.
 *
 * @property {rtvref.types.typeset} [keys] A typeset describing each key
 *  in the collection.
 *
 *  If the type is {@link rtvref.types.HASH_MAP HASH_MAP}, this argument is
 *   hard set to the {@link rtvref.types.STRING STRING} type due to the nature of
 *   its JavaScript `Object`-based implementation and does not need to be specified.
 *
 *  Applies to: {@link rtvref.types.HASH_MAP HASH_MAP} (with restrictions),
 *   {@link rtvref.types.MAP MAP}, {@link rtvref.types.MAP WEAK_MAP}.
 *
 * @property {string} [keyExp] A string-based regular expression describing the
 *  names of keys found in the collection. By default, there are no restrictions
 *  on key names. Ignored if the key type is not {@link rtvref.types.STRING STRING},
 *  as specified in `keys`.
 *
 *  For example, to require numerical keys, the following expression could be
 *   used: `"^\\d+$"`.
 *
 *  Applies to: {@link rtvref.types.HASH_MAP HASH_MAP},
 *   {@link rtvref.types.MAP MAP}, {@link rtvref.types.MAP WEAK_MAP}.
 *
 * @property {string} [keyFlagSpec] A string specifying any flags to use with
 *  the regular expression specified in `keyExp`. Ignored if _falsy_ or if
 *  `keyExp` is not specified. See the
 *  {@link https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/RegExp RegExp#flags}
 *  parameter for more information.
 *
 *  Applies to: {@link rtvref.types.HASH_MAP HASH_MAP},
 *   {@link rtvref.types.MAP MAP}, {@link rtvref.types.MAP WEAK_MAP}.
 *
 * @property {rtvref.types.typeset} [values] A typeset describing each value in
 *  the collection. Defaults to the {@link rtvref.types.ANY ANY} type which allows
 *  _anything_. All values must match this typeset (but the collection is not
 *  required to have any elements to be considered valid, unless `length` is
 *  specified).
 *
 *  For example, to require arrays of non-empty string values as values in the
 *   collection, the following typeset could be used: `[[types.STRING]]`.
 *
 *  Applies to: All collection types.
 *
 * @see {@link rtvref.types.HASH_MAP}
 * @see {@link rtvref.types.MAP}
 * @see {@link rtvref.types.WEAK_MAP}
 * @see {@link rtvref.types.SET}
 * @see {@link rtvref.types.WEAK_SET}
 */

/**
 * <h3>Typeset</h3>
 *
 * Describes the possible types for a given value. It can be any one of the following
 *  JavaScript types:
 *
 * - {@link rtvref.types.OBJECT Object}: For the root or a nested
 *   {@link rtvref.shape_descriptor shape descriptor} of _implied_
 *   {@link rtvref.types.OBJECT OBJECT} type (unless paired with a specific object type
 *   like {@link rtvref.types.PLAIN_OBJECT PLAIN_OBJECT}, for example, when using the
 *   Array notation, e.g. `[PLAIN_OBJECT, {...}]`). If the object is empty (has no properties),
 *   nothing will be verified (anything will pass).
 * - {@link rtvref.types.STRING String}: For a single type, such as
 *   {@link rtvref.types.FINITE FINITE} for a finite number. Must be one of the types
 *   defined in {@link rtvref.types}.
 * - {@link rtvref.types.FUNCTION Function}: For a
 *   {@link rtvref.types.custom_validator custom validator} that will verify the value of the
 *   property using custom code. Since the Array form is not being used (only the validator is
 *   being provided), it's always invoked immediately. Since a type is not provided, the
 *   {@link rtvref.types.ANY ANY} type is implied.
 * - {@link rtvref.types.ARRAY Array}: For multiple type possibilities, optionally
 *   {@link rtvref.qualifiers qualified}, using a short-circuit __OR__ conjunction, which means
 *   the value of the property being described must match _at least one_ of the types listed, but
 *   not all. Matching is done in a short-circuit fashion, from the first to the last element in
 *   the typeset. If a simpler type is a more likely match, it's more performant to specify it
 *   first/earlier in the typeset to avoid a match attempt on a nested shape or Array.
 *   - Cannot be an empty Array.
 *   - A given type may not be included more than once in the typeset, but may appear
 *     again in a nested typeset (when a parent typeset describes an
 *     {@link rtfref.types.ARRAY Array} or type of {@link rtfref.types.OBJECT Object}).
 *   - An Array is necessary to {@link rtvref.qualifiers qualify} the typeset as not
 *     required (see _Typeset Qualifiers_ below).
 *   - An Array is necessary if a type needs or requires
 *     {@link rtvref.types.type_arguments arguments}.
 *   - If the __first__ (or second, if a {@link rtvref.types.qualifiers qualifier}
 *     is provided, and this, in a typeset that is _not_
 *     {@link rtvref.types.fully_qualified_typeset fully-qualified}), element is an `Object`,
 *     it's treated as a nested {@link rtvref.shape_descriptor shape descriptor}
 *     describing an object of the default {@link rtvref.types.OBJECT OBJECT} type.
 *     To include a shape descriptor at any other position within the array, it
 *     __must__ be preceded by a type, even if the default `OBJECT` type is being
 *     used (i.e. `OBJECT` must be specified as the type). For example, all
 *     these typesets are equivalent (and equivalent to just `{name: STRING}`
 *     as the typeset): `[{name: STRING}]`, `[REQUIRED, {name: STRING}]`, and
 *     `[REQUIRED, OBJECT, {name: STRING}]`, describing an object that has a name
 *     property which is a non-empty string. Changing it to `[STRING, {name: STRING}]`,
 *     however, does __not__ mean, "a non-empty string, or an object with a name
 *     property which is a non-empty string". In this case, `{name: STRING}` would
 *     be treated as {@link rtvref.types.STRING_args STRING arguments}, which is
 *     likely not the desired intent. The object would have to be preceded by an
 *     object type (e.g. {@link rtvref.types.OBJECT OBJECT},
 *     {@link rtvref.types.PLAIN_OBJECT PLAIN_OBJECT}, etc.) to have it interpreted
 *     as in the OR case.
 *   - If an element is an `Array` (any position), it's treated as a __nested list__
 *     with an implied {@link rtvref.types.ARRAY ARRAY} type, e.g.
 *     `[BOOLEAN, [STRING, FINITE]]` would describe a property that should be a boolean,
 *     or an array of non-empty strings or finite numbers. See the `ARRAY` type
 *     reference for more information on _shorthand_ and _full_ notations.
 *   - If an element is a `Function`, it must be the __last__ element in the Array
 *     and will be treated as a {@link rtvref.types.custom_validator custom validator}.
 *     Only one validator can be specified for a given typeset (additional validators
 *     may appear in nested typesets).
 *
 * <h4>Typeset Qualifiers</h4>
 *
 * All typesets use an _implied_ {@link rtvref.qualifiers.REQUIRED REQUIRED}
 *  qualifier unless otherwise specified. To qualify a typeset, a
 *  {@link rtvref.qualifiers qualifier} may be specified as the __first__ element
 *  in the `Array` form (if specified, it must be the first element). For example,
 *  `{note: [EXPECTED, STRING]}` would describe an object with a 'note' property
 *  that is an expected, but not required, string, which could therefore be either
 *  empty or even `null`. The `Array` form must be used in order to qualify a
 *  typeset as other than required, and the qualifier applies to all immediate
 *  types in the typeset (which means each nested typeset can have its own qualifier).
 *
 * <h4>Example: Object</h4>
 *
 * <pre><code>const contactShape = {
 *   name: rtv.t.STRING, // required, non-empty, string
 *   tags: [rtv.t.ARRAY, [rtv.t.STRING]], // required array of non-empty strings
 *   // tags: [[rtv.t.STRING]], // same as above, but using shortcut array format
 *   details: { // required nested object of type `OBJECT` (default)
 *     birthday: [rtv.q.EXPECTED, rtv.t.DATE] // Date (could be null)
 *   },
 *   notes: [rtv.q.OPTIONAL, rtv.t.STRING, function(value) { // optional string...
 *     return !value || value.length < 500; // ...less than 500 characters long, if specified
 *   }]
 * };
 *
 * const contact = {
 *   name: 'John Doe',
 *   tags: ['colleagues', 'sports'],
 *   details: {
 *     birthday: null // not specified
 *   }
 * };
 *
 * rtv.verify(contact, contactShape); // OK
 *
 * const walletShape = {
 *   contacts: [[contactShape]], // list of contacts using nested shape
 *   address: {
 *     street: rtv.t.STRING
 *     // ...
 *   },
 *   money: rtv.t.FINITE
 * };
 *
 * rtv.verify({
 *   contacts: [contact],
 *   address: {street: '123 Main St'},
 *   money: 100
 * }, walletShape); // OK
 * </code></pre>
 *
 * <h4>Example: String</h4>
 *
 * <pre><code>rtv.verify('foo', rtv.t.STRING); // OK
 * rtv.verify('foo', rtv.t.FINITE); // ERROR
 * </code></pre>
 *
 * <h4>Example: Array</h4>
 *
 * <pre><code>const typeset = [rtv.t.STRING, rtv.t.FINITE]; // non-empty string, or finite number
 * rtv.verify('foo', typeset); // OK
 * rtv.verify(1, typeset); // OK
 * </code></pre>
 *
 * <h4>Example: Function</h4>
 *
 * <pre><code>rtv.verify(123, (v) => v > 100); // OK
 * rtv.verify('123', [rtv.t.STRING, (v) => parseInt(v) > 100); // OK
 * </code></pre>
 *
 * <h4>Example: Alternate Qualifier</h4>
 *
 * <pre><code>const person = {
 *   name: rtv.t.STRING, // required, non-empty
 *   age: [rtv.q.OPTIONAL, rtv.t.FINITE, (v) => v >= 18] // 18 or older, if specified
 * };
 * rtv.verify({name: 'Bob'}, person); // OK
 * rtv.verify({name: ''}, person); // ERROR
 * rtv.verify({name: 'Steve', age: 17}, person); // ERROR
 * rtv.verify({name: 'Steve', age: null}, person); // OK
 * </code></pre>
 *
 * @typedef {(Object|string|Array|Function)} rtvref.types.typeset
 */

/**
 * <h3>Fully-Qualified Typeset</h3>
 *
 * A {@link rtvref.types.typeset typeset} expressed without any shortcut notations
 *  or implied/default types to make it easier to parse, especially as the `match`
 *  parameter given to a {@link rtvref.types.custom_validator custom validator}.
 *  A fully-qualified typeset always uses the array notation, and has a single
 *  {@link rtvref.qualifiers qualifier} as its first element, followed by
 *  at least one type, and at most one validator.
 *
 * For example:
 *
 * - `STRING` -> `[REQUIRED, STRING]`
 * - `{note: STRING}` -> `[REQUIRED, OBJECT, {note: [REQUIRED, STRING]}]`
 * - `[[FINITE]]` -> `[REQUIRED, ARRAY, [REQUIRED, FINITE]]`
 * - `(v) => !!v` -> `[REQUIRED, ANY, (v) => !!v]`
 *
 * @typedef {Array} rtvref.types.fully_qualified_typeset
 */

/**
 * <h3>Custom Validator</h3>
 *
 * A function used as a {@link rtvref.types.typeset typeset}, or as a subset to
 *  a typeset, to provide custom verification of the value being verified.
 *
 * A typeset may only have one validator, and the validator is _only called if
 *  the value being verified was verified by at least one type in the typeset_.
 *  The validator must be the __last__ element within the typeset (if the typeset
 *  is an array, and a validator is needed). The validator must also be
 *  specified _after_ the {@link rtvref.qualifiers qualifier} in a typeset Array.
 *
 * The validator is invoked immediately after the first type match, but _only if
 *  a type match is made_. If the typeset is not
 *  {@link rtvref.types.fully_qualified_typeset fully-qualified} and does not
 *  explicitly specify a type, the {@link rtvref.types.ANY ANY} type is implied,
 *  which will match _any_ value, which means the validator will always be called.
 *
 * There is one disadvantage to using a custom validator: It cannot be de/serialized
 *  via JSON, which means it cannot be transmitted or persisted. One option would be
 *  to customize the de/serialization to JSON by serializing the validator to a
 *  special object with properties that would inform the deserialization process
 *  on how to reconstruct the validator dynamically.
 *
 * @typedef {function} rtvref.types.custom_validator
 * @param {*} value The value being verified.
 * @param {Array} match A __first-level__,
 *  {@link rtvref.types.fully_qualified_typeset fully-qualified} typeset describing
 *  the type that matched. This means the first level of this subset of `typeset`
 *  (the 3rd parameter) is fully-qualified, but any nested
 *  {@link rtvref.shape_descriptor shape descriptors} or arrays will not be (they
 *  will remain references to the same shapes/arrays in `typeset`).
 *
 * For example, if the given typeset was `[PLAIN_OBJECT, {note: STRING}]`, this
 *  parameter would be a new typeset array `[REQUIRED, PLAIN_OBJECT, {note: STRING}]`,
 *  and the `typeset` parameter would be the original `[PLAIN_OBJECT, {note: STRING}]`.
 *
 * If the given typeset was `[STRING, FINITE]` and FINITE matched, this parameter
 *  would be `[REQUIRED, FINITE]` and the `typeset` parameter would be the
 *  original `[STRING, FINITE]`.
 *
 * @param {rtvref.types.typeset} typeset Reference to the typeset used for
 *  verification. Note that the typeset may contain nested typeset(s), and may
 *  be part of a larger parent typeset (though there would be no reference to
 *  the parent typeset, if any). This typeset is as it was specified in the
 *  parent shape, and therefore it may not be fully-qualified.
 * @returns {boolean} A _truthy_ value to verify, a _falsy_ value to reject.
 * @see {@link rtvref.validation.isValidator}
 */

// Creates a definition object.
// @param {string} value Type value. Must not be empty.
// @param {boolean} [hasArgs=false] If the type takes arguments.
// @param {boolean} [isObject=false] If the type is an object type, which means
//  it describes a shape (either directly as its args object, e.g. PLAIN_OBJECT,
//  or indirectly as a property inside it's args object, e.g. CLASS_OBJECT).
// @returns {{value: boolean, hasArgs: boolean, isObject: boolean}} Type definition.
const def = function(value, hasArgs, isObject) {
  return {
    value,
    hasArgs: !!hasArgs,
    isObject: !!isObject
  };
};

// map of type key (string) to type definition (see def() for shape)
const defs = {
  /**
   * The any type is special in that it allows _anything_, which includes `null`
   *  and `undefined` values. Because of this, it's the most liberal in terms of
   *  types as well as qualifiers. A more specific type should be used whenever
   *  possible to ensure a higher degree of confidence in the value being validated.
   *
   * Any rules per qualifiers:
   *
   * - REQUIRED: Can be any value, including `null` and `undefined`.
   * - EXPECTED: Same rules as REQUIRED.
   * - OPTIONAL: Same rules as EXPECTED.
   *
   * Since this type removes the property's need for existence in the prototype
   *  chain, it renders the verification moot (i.e. the property of this type might
   *  as well not be included in a {@link rtvref.shape_descriptor shape descriptor}
   *  unless a {@link rtvref.types.custom_validator custom validator} is being
   *  used to do customized verification.
   *
   * @name rtvref.types.ANY
   * @const {string}
   * @see {@link rtvref.qualifiers}
   */
  ANY: def('any'),

  /**
   * Null rules per qualifiers: must be the `null` {@link rtvref.types.primitives primitive}.
   *
   * Use this special type to explicitly test for a `null` value. For example,
   *  a {@link rtvref.shape_descriptor shape}'s property may be required to be
   *  `null` under certain circumstances.
   *
   * @name rtvref.types.NULL
   * @const {string}
   * @see {@link rtvref.qualifiers}
   */
  NULL: def('null'),

  // TODO[future]: Add 'exp: string' and 'expFlags: string' args (strings because
  //  of JSON requirement...) for a regular expression test. Similar prop names
  //  to collection_args.
  /**
   * <h3>String Arguments</h3>
   * @typedef {Object} rtvref.types.STRING_args
   * @property {string} [exact] An exact string to match. Can be an empty string.
   *  Note, however, that the {@link rtvref.qualifiers qualifier} must not be
   *  `REQUIRED` because that will disallow an empty string as the value being
   *  checked (i.e. this argument will be ignored).
   * @property {string} [partial] A partial value to match (must be somewhere
   *  within the string). Ignored if empty string, or `exact` is specified. `min`
   *  and `max` take __precedence__ over this argument (the length will be
   *  validated first, then a partial match will be attempted).
   * @property {number} [min] Minimum inclusive length. Defaults to 1 for a
   *  `REQUIRED` string, and 0 for an `EXPECTED` or `OPTIONAL` string. Ignored if
   *  `exact` is specified, or `min` is not a {@link rtvref.types.FINITE FINITE}
   *  number >= 0.
   * @property {number} [max] Maximum inclusive length. Negative means no maximum.
   *  Ignored if `exact` is specified, `max` is not a
   *  {@link rtvref.types.FINITE FINITE} number, or `max` is less than `min`.
   * @see {@link rtvref.types.STRING}
   */

  /**
   * String rules per qualifiers:
   *
   * - REQUIRED: Must be a non-empty string.
   * - EXPECTED | OPTIONAL: May be an empty string.
   *
   * In all cases, the value must be a string {@link rtvref.types.primitives primitive}.
   *  Note that `new String('hello') !== 'hello'` because the former is an _object_, not a string.
   *
   * Arguments (optional): {@link rtvref.types.STRING_args}
   *
   * @name rtvref.types.STRING
   * @const {string}
   * @see {@link rtvref.qualifiers}
   */
  STRING: def('string', true),

  /**
   * Boolean rules per qualifiers: Must be a boolean {@link rtvref.types.primitives primitive}.
   *  Note that `new Boolean(true) !== true` because the former is an _object_, not a boolean.
   * @name rtvref.types.BOOLEAN
   * @const {string}
   * @see {@link rtvref.qualifiers}
   */
  BOOLEAN: def('boolean'),

  /**
   * Symbol rules per qualifiers: Must be a symbol {@link rtvref.types.primitives primitive}.
   * @name rtvref.types.SYMBOL
   * @const {string}
   * @see {@link rtvref.qualifiers}
   */
  SYMBOL: def('symbol'),

  /**
   * <h3>Numeric Value Arguments</h3>
   *
   * Applicable to all numeric types.
   *
   * @typedef {Object} rtvref.types.numeric_args
   * @property {string} [exact] An exact number to match. Ignored if not
   *  within normal range of the type (e.g. for `NUMBER`, could be `+Infinity`,
   *  or even `NaN` if the qualifier is not `REQUIRED`; but these values would be
   *  ignored by `FINITE` since they aren't part of the `FINITE` range).
   * @property {number} [min] Minimum inclusive value. Ignored if `exact` is
   *  specified, `min` is `NaN`, or `min` is not within normal range of the type.
   * @property {number} [max] Maximum inclusive value. Ignored if `exact` is
   *  specified, `max` is `NaN`, `max` is not within normal range of the type,
   *  or `max` is less than `min`.
   * @see {@link rtvref.types.NUMBER}
   * @see {@link rtvref.types.FINITE}
   * @see {@link rtvref.types.INT}
   * @see {@link rtvref.types.FLOAT}
   * @see {@link rtvref.qualifiers}
   */

  /**
   * Number rules per qualifiers:
   *
   * - REQUIRED: Cannot be `NaN`, but could be `+Infinity`, `-Infinity`.
   * - EXPECTED | OPTIONAL: Could be `NaN`, `+Infinity`, `-Infinity`.
   *
   * In all cases, the value must be a number {@link rtvref.types.primitives primitive}.
   *  Note that `new Number(1) !== 1` because the former is an _object_, not a number.
   *
   * An number is not guaranteed to be a
   *  {@link https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/Number/isSafeInteger safe integer}.
   *
   * Arguments (optional): {@link rtvref.types.numeric_args}
   *
   * @name rtvref.types.NUMBER
   * @const {string}
   * @see {@link rtvref.qualifiers}
   * @see {@link rtvref.types.FINITE}
   * @see {@link rtvref.types.INT}
   * @see {@link rtvref.types.SAFE_INT}
   * @see {@link rtvref.types.FLOAT}
   */
  NUMBER: def('number', true),

  /**
   * Finite rules per qualifiers: Cannot be `NaN`, `+Infinity`, `-Infinity`. The
   *  value can be either an {@link rtvref.types.INT integer},
   *  or a {@link rtvref.types.FLOAT floating point number}. It must also be a
   *  number {@link rtvref.types.primitives primitive}.
   *
   * A finite number is not guaranteed to be a
   *  {@link https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/Number/isSafeInteger safe integer}.
   *
   * Arguments (optional): {@link rtvref.types.numeric_args}
   *
   * @name rtvref.types.FINITE
   * @const {string}
   * @see {@link rtvref.qualifiers}
   * @see {@link rtvref.types.NUMBER}
   * @see {@link rtvref.types.INT}
   * @see {@link rtvref.types.SAFE_INT}
   * @see {@link rtvref.types.FLOAT}
   */
  FINITE: def('finite', true),

  /**
   * Int rules per qualifiers: Must be a {@link rtvref.types.FINITE finite} number,
   *  an integer, and a number {@link rtvref.types.primitives primitive}.
   *
   * An integer is not guaranteed to be a
   *  {@link https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/Number/isSafeInteger safe integer}.
   *
   * Arguments (optional): {@link rtvref.types.numeric_args}
   *
   * @name rtvref.types.INT
   * @const {string}
   * @see {@link rtvref.qualifiers}
   * @see {@link rtvref.types.NUMBER}
   * @see {@link rtvref.types.FINITE}
   * @see {@link rtvref.types.SAFE_INT}
   * @see {@link rtvref.types.FLOAT}
   */
  INT: def('int', true),

  /**
   * Int rules per qualifiers: Must be a {@link rtvref.types.FINITE finite} number, a
   *  {@link https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/Number/isSafeInteger safe integer},
   *  and a number {@link rtvref.types.primitives primitive}.
   *
   * An integer is safe if it's an IEEE-754 double precision number which isn't
   *  the result of a rounded unsafe integer. For example, `2^53 - 1` is safe,
   *  but `2^53` is not because `2^53 + 1` would be rounded to `2^53`.
   *
   * Arguments (optional): {@link rtvref.types.numeric_args}
   *
   * @name rtvref.types.INT
   * @const {string}
   * @see {@link rtvref.qualifiers}
   * @see {@link rtvref.types.NUMBER}
   * @see {@link rtvref.types.FINITE}
   * @see {@link rtvref.types.INT}
   * @see {@link rtvref.types.FLOAT}
   */
  SAFE_INT: def('safeInt', true),

  /**
   * Float rules per qualifiers: Must be a {@link rtvref.types.FINITE finite}
   *  floating point number, and a number {@link rtvref.types.primitives primitive}.
   *
   * Arguments (optional): {@link rtvref.types.numeric_args}
   *
   * @name rtvref.types.FLOAT
   * @const {string}
   * @see {@link rtvref.qualifiers}
   * @see {@link rtvref.types.NUMBER}
   * @see {@link rtvref.types.FINITE}
   * @see {@link rtvref.types.INT}
   * @see {@link rtvref.types.SAFE_INT}
   */
  FLOAT: def('float', true),

  /**
   * Function rules per qualifiers: Must be a `function`.
   * @name rtvref.types.FUNCTION
   * @const {string}
   * @see {@link rtvref.qualifiers}
   */
  FUNCTION: def('function'),

  /**
   * RegExp rules per qualifiers: Must be a `RegExp` instance.
   * @name rtvref.types.REGEXP
   * @const {string}
   * @see {@link rtvref.qualifiers}
   * @see https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/RegExp
   */
  REGEXP: def('regexp'),

  /**
   * Date rules per qualifiers: Must be a `Date` instance.
   * @name rtvref.types.DATE
   * @const {string}
   * @see {@link rtvref.qualifiers}
   * @see https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/Date
   */
  DATE: def('date'),

  /**
   * Error rules per qualifiers: Must be an `Error` instance.
   * @name rtvref.types.ERROR
   * @const {string}
   * @see {@link rtvref.qualifiers}
   * @see https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/Error
   */
  ERROR: def('error'),

  /**
   * Promise rules per qualifiers: Must be a `Promise` instance.
   * @name rtvref.types.PROMISE
   * @const {string}
   * @see {@link rtvref.qualifiers}
   * @see https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/Promise
   */
  PROMISE: def('promise'),

  // TODO[future]: Short-hand 'exact' with `[ARRAY, 2, [STRING]]` or `[2, [STRING]]` syntax?
  /**
   * <h3>Array Arguments</h3>
   * @typedef {Object} rtvref.types.ARRAY_args
   * @property {rtvref.types.typeset} [typeset] The typeset which every value in
   *  the array must match. Defaults to {@link rtvref.types.ANY} which means any
   *  value will match.
   * @property {number} [length] Exact length. Ignored if not a
   *  {@link rtvref.types.FINITE FINITE} number >= 0.
   * @property {number} [min] Minimum inclusive length. Ignored if `exact` is
   *  specified, or `min` is not a {@link rtvref.types.FINITE FINITE} number >= 0.
   * @property {number} [max] Maximum inclusive length. Negative means no maximum.
   *  Ignored if `exact` is specified, `max` is not a
   *  {@link rtvref.types.FINITE FINITE} number, or `max` is less than `min`.
   * @see {@link rtvref.types.ARRAY}
   */

  /**
   * Array rules per qualifiers: Must be an `Array`. Empty arrays are permitted,
   *  unless arguments prevent them.
   *
   * Arguments (optional): {@link rtvref.types.ARRAY_args},
   *  {@link rtvref.types.typeset Array typeset}. Note that the `ARRAY` type must
   *  be specified when using arguments (i.e. the shorthand notation cannot
   *  be used).
   *
   * When describing arrays, either _shorthand_ or _full_ notation may be used.
   *  In the shorthand notation, the `ARRAY` type isn't necessary, but it's only
   *  possible to specify the Array typeset to use to validate each array element,
   *  and {@link rtvref.types.ARRAY_args arguments} can't be specified. In the
   *  {@link rtvref.types.fully_qualified_typeset fully-qualified} notation, the
   *  `ARRAY` type is required, but the Array typeset must be moved into the
   *  `typeset` argument (along with any other argument necessary).
   *
   * __NOTE__: It's important to realize that arrays (as in the JavaScript Array
   *  type) are essentially nested {@link rtvref.types.typeset Array typesets}.
   *  They represent a set of types that will be used to validate each element
   *  of an array using a short-circuit OR conjunction, looking for the first type that matches.
   *
   * <h4>Example: Simple array</h4>
   *
   * The `value` property must be an array (possibly empty) of any type of value.
   *
   * <pre><code>{
   *   value: [ARRAY]
   * }
   * </code></pre>
   *
   * __NOTE__: Since arrays are, in reality, nested
   *  {@link rtvref.types.typeset Array typesets}, and since an empty array is
   *  an invalid Array typeset, it's not possible to use the shorthand notation
   *  to indicate what could be the equivalent: `[[]]`. The inner Array typeset
   *  would be deemed _invalid_.
   *
   * <h4>Example: Shorthand notation</h4>
   *
   * The `value` property must be an array (possibly empty) of finite numbers of
   *  any value.
   *
   * <pre><code>{
   *   value: [[FINITE]]
   * }
   * </code></pre>
   *
   * <h4>Example: Shorthand, mixed types</h4>
   *
   * The `value` property must be either a boolean; or an array (possibly empty) of
   *  finite numbers of any value, or non-empty strings, or a mix of both.
   *
   * <pre><code>{
   *   value: [BOOLEAN, [FINITE, STRING]]
   * }
   * </code></pre>
   *
   * <h4>Example: Fully-qualified notation, no typeset</h4>
   *
   * The `value` property must be a non-empty array of any type of value.
   *
   * <pre><code>{
   *   value: [REQUIRED, ARRAY, {min: 1}]
   * }
   * </code></pre>
   *
   * <h4>Example: Fully-qualified notation</h4>
   *
   * The `value` property must be an array (possibly empty) of finite numbers of
   *  any value (nested typeset is not fully-qualified).
   *
   * <pre><code>{
   *   value: [REQUIRED, ARRAY, {typeset: [FINITE]}]
   * }
   *
   * <h4>Example: Fully-qualified, mixed types</h4>
   *
   * The `value` property must be either a boolean; or an array (possibly empty) of
   *  finite numbers of any value, or non-empty strings, or a mix of both
   *  (nested typeset is not fully-qualified).
   *
   * <pre><code>{
   *   value: [REQUIRED, BOOLEAN, ARRAY, {typeset: [FINITE, STRING]}]
   * }
   * </code></pre>
   *
   * @name rtvref.types.ARRAY
   * @const {string}
   * @see {@link rtvref.qualifiers}
   */
  ARRAY: def('array', true),

  /**
   * An _any_ object is anything that is __not__ a {@link rtvref.types primitive}, which
   *  means it includes the `Array` type, as well as functions and arguments, and
   *  other JavaScript _object_ types. To test for an array, use the
   *  {@link rtvref.types.ARRAY ARRAY} type. To test for a function, use the
   *  {@link rtvref.types.FUNCTION FUNCTION} type.
   *
   * The following values are considered any objects:
   *
   * - `{}`
   * - `new Object()`
   * - `new String('')`
   * - `new Boolean(true)`
   * - `new Number(1)`
   * - `[]` (also see {@link rtvref.types.ARRAY ARRAY})
   * - `new Array()` (also see {@link rtvref.types.ARRAY ARRAY})
   * - `/re/` (also see {@link rtvref.types.REGEXP REGEXP})
   * - `new RegExp('re')` (also see {@link rtvref.types.REGEXP REGEXP})
   * - `function(){}` (also see {@link rtvref.types.FUNCTION FUNCTION})
   * - `arguments` (function arguments)
   * - `new function() {}` (class instance) (also see {@link rtvref.types.CLASS_OBJECT CLASS_OBJECT})
   * - `new Map()` (also see {@link rtvref.types.MAP MAP})
   * - `new WeakMap()` (also see {@link rtvref.types.WEAK_MAP WEAK_MAP})
   * - `new Set()` (also see {@link rtvref.types.SET SET})
   * - `new WeakSet()` (also see {@link rtvref.types.WEAK_SET WEAK_SET})
   *
   * {@link rtvref.types.primitives Primitive} values __are not__ considered any objects,
   *  especially when the qualifier is {@link rtvref.qualifiers.REQUIRED REQUIRED}.
   *  Note that `typeof null === 'object'` in JavaScript; the `ANY_OBJECT` type
   *  allows testing for this undesirable fact.
   *
   * Any object rules per qualifiers:
   *
   * - REQUIRED: Per the lists above.
   * - EXPECTED: `null` is allowed.
   * - OPTIONAL: `undefined` is allowed.
   *
   * Arguments (optional): {@link rtvref.shape_descriptor}
   *
   * @name rtvref.types.ANY_OBJECT
   * @const {string}
   * @see {@link rtvref.qualifiers}
   * @see {@link rtvref.types.OBJECT}
   * @see {@link rtvref.types.PLAIN_OBJECT}
   * @see {@link rtvref.types.CLASS_OBJECT}
   */
  ANY_OBJECT: def('anyObject', true, true),

  /**
   * An object is one that extends from `JavaScript.Object` (i.e. an _instance_
   *  of _something_ that extends from Object) and is not a
   *  {@link rtvref.types.FUNCTION function}, {@link rtvref.types.ARRAY array},
   *  {@link rtvref.types.REGEXP regular expression}, function arguments object,
   *  {@link rtvref.types.MAP map}, {@link rtvref.types.WEAK_MAP weak map},
   *  {@link rtvref.types.SET set}, {@link rtvref.types.WEAK_SET weak set}, nor a
   *  {@link rtvref.types primitive}.
   *
   * This is the __default__ (imputed) type for
   *  {@link rtvref.shape_descriptor shape descriptors}, which means the object itself
   *  (the value being tested), prior to being checked against its shape, will be
   *  tested according to this type.
   *
   * The following values are considered objects:
   *
   * - `{}`
   * - `new Object()`
   * - `new String('')`
   * - `new Boolean(true)`
   * - `new Number(1)`
   * - `new function() {}` (class instance)
   *
   * The following values __are not__ considered objects:
   *
   * - `[]` (also see {@link rtvref.types.ARRAY ARRAY})
   * - `new Array()` (also see {@link rtvref.types.ARRAY ARRAY})
   * - `/re/` (also see {@link rtvref.types.REGEXP REGEXP})
   * - `new RegExp('re')` (also see {@link rtvref.types.REGEXP REGEXP})
   * - `function(){}` (also see {@link rtvref.types.FUNCTION FUNCTION})
   * - `arguments` (function arguments)
   * - `new Map()` (also see {@link rtvref.types.MAP MAP})
   * - `new WeakMap()` (also see {@link rtvref.types.WEAK_MAP WEAK_MAP})
   * - `new Set()` (also see {@link rtvref.types.SET SET})
   * - `new WeakSet()` (also see {@link rtvref.types.WEAK_SET WEAK_SET})
   * - all {@link rtvref.types.primitives primitives}
   *
   * Object rules per qualifiers:
   *
   * - REQUIRED: Per the lists above.
   * - EXPECTED: `null` is allowed.
   * - OPTIONAL: `undefined` is allowed.
   *
   * Arguments (optional): {@link rtvref.shape_descriptor}
   *
   * @name rtvref.types.OBJECT
   * @const {string}
   * @see {@link rtvref.qualifiers}
   * @see {@link rtvref.types.ANY_OBJECT}
   * @see {@link rtvref.types.PLAIN_OBJECT}
   * @see {@link rtvref.types.CLASS_OBJECT}
   */
  OBJECT: def('object', true, true),

  /**
   * A _plain_ object is one that is created directly from the `Object` constructor,
   *  whether using `new Object()` or the literal `{}`.
   *
   * The following values are considered plain objects:
   *
   * - `{}`
   * - `new Object()`
   *
   * The following values __are not__ considered plain objects:
   *
   * - `[]` (also see {@link rtvref.types.ARRAY ARRAY})
   * - `new Array()` (also see {@link rtvref.types.ARRAY ARRAY})
   * - `new String('')`
   * - `new Boolean(true)`
   * - `new Number(1)`
   * - `new function() {}` (class instance)
   * - `/re/` (also see {@link rtvref.types.REGEXP REGEXP})
   * - `new RegExp('re')` (also see {@link rtvref.types.REGEXP REGEXP})
   * - `function(){}` (also see {@link rtvref.types.FUNCTION FUNCTION})
   * - `arguments` (function arguments)
   * - `new Map()` (also see {@link rtvref.types.MAP MAP})
   * - `new WeakMap()` (also see {@link rtvref.types.WEAK_MAP WEAK_MAP})
   * - `new Set()` (also see {@link rtvref.types.SET SET})
   * - `new WeakSet()` (also see {@link rtvref.types.WEAK_SET WEAK_SET})
   * - all {@link rtvref.types.primitives primitives}
   *
   * Plain object rules per qualifiers:
   *
   * - REQUIRED: Per the lists above.
   * - EXPECTED: `null` is allowed.
   * - OPTIONAL: `undefined` is allowed.
   *
   * Arguments (optional): {@link rtvref.shape_descriptor}
   *
   * @name rtvref.types.PLAIN_OBJECT
   * @const {string}
   * @see {@link rtvref.qualifiers}
   * @see {@link rtvref.types.ANY_OBJECT}
   * @see {@link rtvref.types.OBJECT}
   * @see {@link rtvref.types.CLASS_OBJECT}
   */
  PLAIN_OBJECT: def('plainObject', true, true),

  /**
   * {@link rtvref.types.CLASS_OBJECT CLASS_OBJECT} arguments.
   * @typedef {Object} rtvref.types.CLASS_OBJECT_args
   * @property {function} [ctr] A reference to a constructor function. If specified,
   *  the class object (instance) must have this class function in its inheritance
   *  chain such that `<class_object> instanceof ctr === true`. Note that this
   *  property is not serializable to JSON. If not specified, then the object
   *  must be an {@link rtvref.types.OBJECT OBJECT} that is not a
   *  {@link rtvref.types.PLAIN_OBJECT PLAIN_OBJECT} among the other values that
   *  are not considered class objects.
   * @property {rtvref.shape_descriptor} [shape] A description of the class object's
   *  shape. Ignored if not a valid shape descriptor.
   */

  /**
   * A _class_ object is one that is created by invoking the `new` operator on a
   *  function (other than a primitive type function), generating a new object,
   *  commonly referred to as a _class instance_. This object's prototype
   *  (`__proto__`) is a reference to that function's `prototype` and has a
   *  `constructor` property that is `===` to the function.
   *
   * The following values are considered class objects:
   *
   * - `new function() {}`
   *
   * The following values __are not__ considered class objects:
   *
   * - `{}`
   * - `new Object()`
   * - `new String('')`
   * - `new Boolean(true)`
   * - `new Number(1)`
   * - `[]` (also see {@link rtvref.types.ARRAY ARRAY})
   * - `new Array()` (also see {@link rtvref.types.ARRAY ARRAY})
   * - `/re/` (also see {@link rtvref.types.REGEXP REGEXP})
   * - `new RegExp('re')` (also see {@link rtvref.types.REGEXP REGEXP})
   * - `function(){}` (also see {@link rtvref.types.FUNCTION FUNCTION})
   * - `arguments` (function arguments)
   * - `new Map()` (also see {@link rtvref.types.MAP MAP})
   * - `new WeakMap()` (also see {@link rtvref.types.WEAK_MAP WEAK_MAP})
   * - `new Set()` (also see {@link rtvref.types.SET SET})
   * - `new WeakSet()` (also see {@link rtvref.types.WEAK_SET WEAK_SET})
   * - all {@link rtvref.types.primitives primitives}
   *
   * Class object rules per qualifiers:
   *
   * - REQUIRED: Per the lists above.
   * - EXPECTED: `null` is allowed.
   * - OPTIONAL: `undefined` is allowed.
   *
   * Arguments (optional): {@link rtvref.types.CLASS_OBJECT_args}
   *
   * @name rtvref.types.CLASS_OBJECT
   * @const {string}
   * @see {@link rtvref.qualifiers}
   * @see {@link rtvref.types.ANY_OBJECT}
   * @see {@link rtvref.types.OBJECT}
   * @see {@link rtvref.types.PLAIN_OBJECT}
   */
  CLASS_OBJECT: def('classObject', true, true),

  /**
   * A simple {@link rtvref.types.OBJECT OBJECT} that is treated as a hash map
   *  with an expected set of keys (forcibly strings due to the nature of the
   *  native JavaScript `Object` type) and values. Keys can be described
   *  using a regular expression, and values can be described using a
   *  {@link rtvref.types.typeset typeset}. Empty maps are permitted.
   *
   * Map object rules per qualifiers: Same as {@link rtvref.types.OBJECT OBJECT} rules.
   *
   * Arguments (optional): {@link rtvref.types.collection_args}
   *
   * @name rtvref.types.HASH_MAP
   * @const {string}
   * @see {@link rtvref.qualifiers}
   * @see {@link rtvref.types.ANY_OBJECT}
   * @see {@link rtvref.types.OBJECT}
   * @see {@link rtvref.types.PLAIN_OBJECT}
   * @see {@link rtvref.types.CLASS_OBJECT}
   * @see {@link rtvref.types.MAP}
   * @see {@link rtvref.types.WEAK_MAP}
   */
  HASH_MAP: def('mapObject', true), // NOTE: NOT an object type (unrelated to shapes)

  /**
   * An ES6 map supports any value as its keys, unlike a
   *  {@link rtvref.types.HASH_MAP HASH_MAP} that only supports strings. Keys can
   *  be described using a regular expression (if they are strings), and values can
   *  be described using a {@link rtvref.types.typeset typeset}. Empty maps are permitted
   *  by default.
   *
   * Map rules per qualifiers: Must be a `Map` instance.
   *
   * Arguments (optional): {@link rtvref.types.collection_args}
   *
   * @name rtvref.types.MAP
   * @const {string}
   * @see {@link rtvref.qualifiers}
   * @see {@link rtvref.types.HASH_MAP}
   * @see {@link rtvref.types.WEAK_MAP}
   */
  MAP: def('map', true),

  /**
   * An ES6 weak map supports any _object_ as its keys, unlike a
   *  {@link rtvref.types.HASH_MAP HASH_MAP} that only supports strings,
   *  and a {@link rtvref.types.MAP MAP} that supports any type of value.
   *
   * Weak map rules per qualifiers: Must be a `WeakMap` instance.
   *
   * @name rtvref.types.WEAK_MAP
   * @const {string}
   * @see {@link rtvref.qualifiers}
   * @see {@link rtvref.types.HASH_MAP}
   * @see {@link rtvref.types.MAP}
   */
  WEAK_MAP: def('weakMap'), // not iterable, so does not accept any collection args

  /**
   * An ES6 set is a collection of _unique_ values without associated keys. Values can
   *  be described using a {@link rtvref.types.typeset typeset}. Empty sets are permitted
   *  by default.
   *
   * Set rules per qualifiers: Must be a `Set` instance.
   *
   * Arguments (optional): {@link rtvref.types.collection_args}
   *
   * @name rtvref.types.SET
   * @const {string}
   * @see {@link rtvref.qualifiers}
   * @see {@link rtvref.types.WEAK_SET}
   */
  SET: def('set', true),

  /**
   * An ES6 weak set is a collection of weakly held _unique_ _objects_ without
   *  associated keys.
   *
   * Weak set rules per qualifiers: Must be a `WeakSet` instance.
   *
   * @name rtvref.types.WEAK_SET
   * @const {string}
   * @see {@link rtvref.qualifiers}
   * @see {@link rtvref.types.SET}
   */
  WEAK_SET: def('weakSet'), // not iterable, so does not accept any collection args

  /**
   * JSON rules per qualifiers: Must be a JSON value:
   *
   * - {@link rtvref.types.STRING string}, however __empty strings are permitted__,
   *   even if the qualifier is `REQUIRED`;
   * - {@link rtvref.types.BOOLEAN boolean};
   * - {@link rtvref.types.FINITE finite number};
   * - {@link rtvref.types.PLAIN_OBJECT plain object};
   * - {@link rtvref.types.ARRAY array};
   * - `null`
   *
   * Since this type checks for _any_ valid JSON value, empty string and `null`
   *  values are permitted, even when the typeset is qualified as `REQUIRED`.
   *  Therefore, the `REQUIRED` qualifier has the same effect as the `EXPECTED`
   *  qualifier.
   *
   * @name rtvref.types.JSON
   * @const {string}
   * @see {@link rtvref.qualifiers}
   */
  JSON: def('json')
};

//
// ^^^^^^^ INSERT NEW TYPES ^^^^^^^ ABOVE THIS SECTION ^^^^^^^
//

/**
 * Default object type: {@link rtvref.types.OBJECT}
 * @const {string} rtvref.types.DEFAULT_OBJECT_TYPE
 */
export const DEFAULT_OBJECT_TYPE = defs.OBJECT.value;

/**
 * Enumeration (`string -> string`) of __object__ {@link rtvref.types types}. These
 *  are all the types that describe values which are essentially maps of various
 *  keys to values.
 * @name rtvref.types.objTypes
 * @type {rtvref.Enumeration}
 */
export const objTypes = new Enumeration(function() {
  const types = {};
  Object.keys(defs).forEach(function(name) {
    if (defs[name].isObject) {
      types[name] = defs[name].value;
    }
  });
  return types;
}(), 'objTypes');

/**
 * Enumeration (`string -> string`) of {@link rtvref.types types} that accept
 *  arguments.
 * @name rtvref.types.argTypes
 * @type {rtvref.Enumeration}
 */
export const argTypes = new Enumeration(function() {
  const types = {};
  Object.keys(defs).forEach(function(name) {
    if (defs[name].hasArgs) {
      types[name] = defs[name].value;
    }
  });
  return types;
}(), 'argTypes');

/**
 * Enumeration (`string -> string`) of all {@link rtvref.types types}.
 * @name rtvref.types.types
 * @type {rtvref.Enumeration}
 */
export default new Enumeration(function() {
  const types = {};
  Object.keys(defs).forEach(function(name) {
    types[name] = defs[name].value;
  });
  return types;
}(), 'types');
