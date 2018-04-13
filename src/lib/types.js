//// Type Definitions \\\\

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
 * @namespace rtvref.types.primitives
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
 * @namespace rtvref.types.rules
 */

/**
 * <h3>Type Arguments</a></h3>
 *
 * Some types will accept, or may even expect, one or more arguments. Each type
 *  will specify whether it has arguments, and if they're optional or required.
 *  Arguments are specified as a single object immediately following a type in an
 *  __Array__ {@link rtvref.types.typeset typeset} (i.e. an Array must be used as
 *  the typeset in order to provide arguments for a type).
 *
 * If a type does not accept any arguments, but an arguments object is provided,
 *  it will simply be ignored (i.e. it will __not__ be treated as a nested
 *  {@link rtvref.shape_descriptor shape descriptor}). This means that, in an
 *  Array-style {@link rtvref.types.typeset typeset}, a shape descriptor
 *  __must__ always be qualified by a type, even if it's the default type
 *  attributed to a shape descriptor.
 *
 * An arguments object immediately follows its type in a typeset, such as
 *  `[PLAIN_OBJECT, {hello: STRING}]`. This would specify the value must be a
 *  {@link rtvref.types.PLAIN_OBJECT plain object} with a shape that includes a
 *  property named 'hello', that property being a
 *  {@link rtvref.qualifiers.REQUIRED required} {@link rtvref.types.STRING string}.
 *
 * @typedef {Object} rtvref.types.type_arguments
 */

/**
 * <h3>Collection Descriptor</h3>
 *
 * Describes the keys and values in a collection-based object, which is one of
 *  the following types:
 *
 * - {@link rtvref.types.MAP_OBJECT MAP_OBJECT}
 * - {@link rtvref.types.MAP MAP}
 * - {@link rtvref.types.WEAK_MAP WEAK_MAP}
 * - {@link rtvref.types.SET SET} (with some exceptions)
 * - {@link rtvref.types.WEAK_SET WEAK_SET} (with some exceptions)
 *
 * Note that an {@link rtvref.types.ARRAY ARRAY} is __not__ included in this list
 *  because the array type has special syntax for describing the type of its items.
 *  See {@link rtvref.types.ARRAY_args ARRAY_args} instead.
 *
 * For example, the following descriptors both verify a collection of 3-letter
 *  string keys (upper- or lowercase) to finite numbers:
 *
 * - `{keyExp: '[a-z]{3}', keyExpFlags: 'i', values: FINITE}`
 * - `{keyExp: '[a-zA-Z]{3}', values: FINITE}`
 *
 * @typedef {Object} rtvref.types.collection_descriptor
 * @property {rtvref.types.typeset} [keys] Optional. A typeset describing each key
 *  in the collection.
 *
 * The type of collection being described may restrict the types that this typeset
 *  can include. For example, the {@link rtvref.types.MAP_OBJECT MAP_OBJECT} collection
 *  only supports the {@link rtvref.types.STRING STRING} type due to the nature of
 *  its JavaScript `Object`-based implementation.
 *
 * NOTE: This property is ignored when the collection is a {@link rtvref.types.SET SET}
 *  or a {@link rtvref.types.WEAK_SET WEAK_SET} because sets do not have keys.
 *
 * @property {string} [keyExp] Optional. A string-based regular expression
 *  describing the names of keys (own-enumerable properties) found in the
 *  collection.
 *
 * By default, there are no restrictions on key names. This expression is only
 *  used if the `keys` typeset includes the {@link rtvref.types.STRING STRING} type.
 *
 * For example, to require numerical keys, the following expression could be
 *  used: `'^\\d+$'`.
 *
 * NOTE: This property is ignored when the collection is a {@link rtvref.types.SET SET}
 *  or a {@link rtvref.types.WEAK_SET WEAK_SET} because sets do not have keys.
 *
 * @property {string} [keyExpFlags] Optional. A string specifying any flags to use
 *  with the regular expression specified in `keyExp`. If this property is _falsy_,
 *  default `RegExp` flags will be used. Ignored if `keyExp` is not specified, or
 *  does not apply per the `keys` typeset.
 *
 * NOTE: This property is ignored when the collection is a {@link rtvref.types.SET SET}
 *  or a {@link rtvref.types.WEAK_SET WEAK_SET} because sets do not have keys.
 *
 * @property {rtvref.types.typeset} [values] Optional. A typeset describing each value
 *  in the collection. Defaults to the {@link rtvref.types.ANY ANY} type which allows
 *  _anything_. All values must match this typeset (but the collection is not
 *  required to have any entries/properties to be considered valid, unless
 *  `count` is specified).
 *
 * For example, to require arrays of non-empty string values, the following
 *  typeset could be used: `[[types.STRING]]`.
 *
 * @property {number} [count=-1] Optional. The number of entries expected in
 *  the collection. A negative value allows for any number of entries. Zero
 *  requires an empty collection.
 *
 * @see {@link rtvref.types.MAP_OBJECT}
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
 * - `Object`: For the root or a nested {@link rtvref.shape_descriptor shape descriptor}
 *   of _implied_ {@link rtvref.types.OBJECT OBJECT} type (unless qualified with a specific
 *   object type like {@link rtvref.types.PLAIN_OBJECT PLAIN_OBJECT}, for example, when
 *   using the `Array` notation, e.g. `[PLAIN_OBJECT, {...}]`). If the object is empty
 *   (has no properties), nothing will be verified (anything will pass).
 * - `String`: For a single type, such as {@link rtvref.types.FINITE FINITE}
 *   for a finite number. Must be one of the types defined in {@link rtvref.types}.
 * - `Function`: For a {@link rtvref.types.property_validator property validator}
 *   that will verify the value of the property using custom code. Only one validator
 *   can be specified for a given typeset, and it will only be called if the value
 *   was verified against at least one of the other types listed (regardless of the
 *   validator function's position when specified in a typeset array). If no other types
 *   were listed (i.e. using the `Array` form, as described above), then the validator
 *   is called immediately.
 * - `Array`: For multiple type possibilities, optionally {@link rtvref.qualifiers qualified},
 *   using an __OR__ conjunction, which means the value of the property being described must
 *   be at _least one_ of the types listed, but not all. Matching is done in a short-circuit
 *   fashion, from the first to the last element in the typeset. If a simpler type is
 *   likely, it's more performant to specify those first in the typeset to avoid a match
 *   attempt on a nested shape or Array.
 *   - Cannot be an empty Array.
 *   - An Array is necessary to {@link rtvref.qualifiers qualify} the typeset as not
 *     required (see _Typeset Qualifiers_ below).
 *   - An Array is also necessary if a type needs or requires
 *     {@link rtvref.types.type_arguments arguments}.
 *   - If the __first__ element is an `Object`, it's treated as a nested
 *     {@link rtvref.shape_descriptor shape descriptor} describing an object of the
 *     default {@link rtvref.types.OBJECT OBJECT} type. To include a shape descriptor
 *     at any other position within the array, it __must__ be preceded by a type,
 *     even if the default `OBJECT` type is being used (i.e. `OBJECT` must be
 *     specified as the type).
 *   - If an element is an `Array` (any position), it's treated as a __nested list__
 *     with an implied {@link rtvref.types.ARRAY ARRAY} type, e.g.
 *     `[BOOLEAN, [STRING, FINITE]]` would describe a property that should be a boolean,
 *     or an array of non-empty strings or finite numbers. See the `ARRAY` type
 *     reference for more information on _shorthand_ and _full_ notations.
 *   - If an element is a `Function` (any position, though normally at the last
 *     position, since only one is permitted per typeset, and it's always executed
 *     after at least one type matches, regardless of it's position in the typeset),
 *     it's treated as a property validator.
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
 *  to make it easier to parse, especially as the `match` parameter given to a
 *  {@link rtvref.types.property_validator property validator}.
 *
 * For example:
 *
 * - `STRING` -> `[REQUIRED, STRING]`
 * - `{note: STRING}` -> `[REQUIRED, OBJECT, {note: [REQUIRED, STRING]}]`
 * - `[[FINITE]]` -> `[REQUIRED, ARRAY, [REQUIRED, FINITE]]`
 *
 * @typedef {Array} rtvref.types.fully_qualified_typeset
 */

/**
 * <h3>Property Validator</h3>
 *
 * A function used as a {@link rtvref.types.typeset typeset}, or as a subset to
 *  a typeset, to provide custom verification of the value being verified.
 *
 * A typeset may only have one validator, and the validator is only called if
 *  the value being verified was verified by at least one type in the typeset.
 *  The position of the validator within the typeset (if the typeset is an array),
 *  does not change when the validator is invoked (i.e. before one type or after
 *  another; it's always called last, if called at all).
 *
 * There is one disadvantage to using a property validator: It cannot be de/serialized
 *  via JSON, which means it cannot be transmitted or persisted. One option would be
 *  to customize the de/serialization to JSON by serializing the validator to a
 *  special object with properties that would inform the deserialization process
 *  on how to reconstruct the validator dynamically.
 *
 * @typedef {function} rtvref.types.property_validator
 * @param {*} value The value being verified.
 * @param {Array} match A __first-level__, {@link rtvref.types.fully_qualified_typeset fully-qualified}
 *  typeset describing the type that matched. This means the first level of this
 *  subset of `typeset` (the 3rd parameter) is fully-qualified, but any nested
 *  {@link rtvref.shape_descriptor shape descriptors} or arrays will not be (they
 *  will remain references to the same shapes/arrays in `typeset`). For example,
 *  if the given typeset was `[PLAIN_OBJECT, {note: STRING}]`, this parameter
 *  would be a new typeset array `[REQUIRED, PLAIN_OBJECT, {note: STRING}]`,
 *  and the `typeset` parameter would be the original `[PLAIN_OBJECT, {note: STRING}]`.
 * @param {rtvref.types.typeset} typeset Reference to the typeset used for
 *  verification. Note that the typeset may contain nested typeset(s), and may
 *  be part of a larger parent typeset (though there would be no reference to
 *  the parent typeset, if any). This typeset is as it was specified in the
 *  parent shape, and therefore it may not be fully-qualified.
 * @returns {boolean} `true` to verify the value, `false` to reject it.
 */

/**
 * The any type is special in that it allows _anything_, which includes `null`
 *  and `undefined` values. Because of this, it's the most liberal in terms of
 *  types as well as qualifiers. A more specific type should be used whenever
 *  possible to ensure a higher degree of confidence in the value being validated.
 *
 * Any rules per qualifiers:
 *
 * - REQUIRED: Property must be defined _somewhere_ in the prototype chain, but
 *   its value can be anything, including `null` and `undefined`.
 * - EXPECTED: Same rules as REQUIRED.
 * - OPTIONAL: Since this qualifier removes the property's need for existence
 *   in the prototype chain, it renders the verification moot (i.e. the property
 *   might as well not be included in the {@link rtvref.shape_descriptor shape descriptor}
 *   unless a {@link rtvref.types.property_validator property validator} is being
 *   used to do customized verification.
 *
 * @name rtvref.types.ANY
 * @const {string}
 * @see {@link rtvref.qualifiers}
 */
export const ANY = 'any';

// TODO[future]: Add 'exp: string' and 'expFlags: string' args (strings because of JSON requirement...)
//  for a regular expression test. Similar prop names to collection_descriptor.
/**
 * {@link rtvref.types.STRING STRING} arguments.
 * @typedef {Object} rtvref.types.STRING_args
 * @property {string} [exact] An exact value to match.
 * @property {number} [min] Minimum length. Defaults to 1 for a `REQUIRED` string,
 *  and 0 for an `EXPECTED` or `OPTIONAL` string. Ignored if `exact` is specified.
 * @property {number} [max=-1] Maximum length. -1 means no maximum. Ignored if `exact`
 *  is specified.
 * @property {string} [partial] A partial value to match (must be somewhere within the string).
 *  Ignored if `exact` is specified.
 * @see {@link rtvref.qualifiers}
 */

/**
 * String rules per qualifiers:
 *
 * - REQUIRED: Must be a non-empty string.
 * - EXPECTED | OPTIONAL: Can be an empty string.
 *
 * In all cases, the value must be a string {@link rtvref.types.primitives primitive}.
 *  `new String('hello') !== 'hello'` because the former is an _object_, not a string.
 *
 * Arguments (optional): {@link rtvref.types.STRING_args}
 *
 * @name rtvref.types.STRING
 * @const {string}
 * @see {@link rtvref.qualifiers}
 */
export const STRING = 'string';

/**
 * Boolean rules per qualifiers: Must be a boolean {@link rtvref.types.primitives primitive}.
 *  `new Boolean(true) !== true` because the former is an _object_, not a boolean.
 *
 * @name rtvref.types.BOOLEAN
 * @const {string}
 * @see {@link rtvref.qualifiers}
 */
export const BOOLEAN = 'boolean';

/**
 * Symbol rules per qualifiers: Must be a symbol {@link rtvref.types.primitives primitive}.
 * @name rtvref.types.SYMBOL
 * @const {string}
 * @see {@link rtvref.qualifiers}
 */
export const SYMBOL = 'symbol';

/**
 * Numeric value arguments. Applies to all numeric types.
 * @typedef {Object} rtvref.types.numeric_args
 * @property {string} [exact] An exact value to match.
 * @property {number} [min] Minimum inclusive value. Default varies per type.
 *  Ignored if `exact` is specified.
 * @property {number} [max] Maximum inclusive value. Default varies per type.
 *  Ignored if `exact` is specified.
 * @see {@link rtvref.qualifiers}
 * @see {@link rtvref.types.NUMBER}
 * @see {@link rtvref.types.FINITE}
 * @see {@link rtvref.types.INT}
 * @see {@link rtvref.types.FLOAT}
 */

/**
 * Number rules per qualifiers:
 *
 * - REQUIRED: Cannot be `NaN`, but could be `+Infinity`, `-Infinity`.
 * - EXPECTED | OPTIONAL: Could be `NaN`, `+Infinity`, `-Infinity`.
 *
 * In all cases, the value must be a number {@link rtvref.types.primitives primitive}.
 *  `new Number(1) !== 1` because the former is an _object_, not a number.
 *
 * Arguments (optional): {@link rtvref.types.numeric_args}
 *
 * @name rtvref.types.NUMBER
 * @const {string}
 * @see {@link rtvref.qualifiers}
 * @see {@link rtvref.types.FINITE}
 */
export const NUMBER = 'number';

/**
 * Finite rules per qualifiers: Cannot be `NaN`, `+Infinity`, `-Infinity`. The
 *  value can be either a safe integer or a {@link rtvref.types.FLOAT floating point number}.
 *  It must also be a number {@link rtvref.types.primitives primitive}.
 *
 * Arguments (optional): {@link rtvref.types.numeric_args}
 *
 * @name rtvref.types.FINITE
 * @const {string}
 * @see {@link rtvref.qualifiers}
 * @see {@link rtvref.types.NUMBER}
 * @see {@link https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/Number/isSafeInteger Number.isSafeInteger()}
 */
export const FINITE = 'finite';

/**
 * Int rules per qualifiers: Must be a {@link rtvref.types.FINITE finite} integer,
 *  but is not necessarily _safe_. It must also be a number {@link rtvref.types.primitives primitive}.
 *
 * Arguments (optional): {@link rtvref.types.numeric_args}
 *
 * @name rtvref.types.INT
 * @const {string}
 * @see {@link rtvref.qualifiers}
 * @see {@link rtvref.types.FINITE}
 * @see {@link rtvref.types.FLOAT}
 * @see {@link https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/Number/isSafeInteger Number.isSafeInteger()}
 */
export const INT = 'int';

/**
 * Float rules per qualifiers: Must be a finite floating point number.
 *  It must also be a number {@link rtvref.types.primitives primitive}.
 *
 * Arguments (optional): {@link rtvref.types.numeric_args}
 *
 * @name rtvref.types.FLOAT
 * @const {string}
 * @see {@link rtvref.qualifiers}
 * @see {@link rtvref.types.INT}
 */
export const FLOAT = 'float';

/**
 * Function rules per qualifiers: Must be a `function`.
 * @name rtvref.types.FUNCTION
 * @const {string}
 * @see {@link rtvref.qualifiers}
 */
export const FUNCTION = 'function';

/**
 * RegExp rules per qualifiers: Must be a `RegExp` instance.
 * @name rtvref.types.REGEXP
 * @const {string}
 * @see {@link rtvref.qualifiers}
 * @see https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/RegExp
 */
export const REGEXP = 'regexp';

/**
 * Date rules per qualifiers: Must be a `Date` instance.
 * @name rtvref.types.DATE
 * @const {string}
 * @see {@link rtvref.qualifiers}
 * @see https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/Date
 */
export const DATE = 'date';

/**
 * Error rules per qualifiers: Must be an `Error` instance.
 * @name rtvref.types.ERROR
 * @const {string}
 * @see {@link rtvref.qualifiers}
 * @see https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/Error
 */
export const ERROR = 'error';

/**
 * Promise rules per qualifiers: Must be a `Promise` instance.
 * @name rtvref.types.PROMISE
 * @const {string}
 * @see {@link rtvref.qualifiers}
 * @see https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/Promise
 */
export const PROMISE = 'promise';

// TODO[future]: Short-hand 'exact' with `[ARRAY, 2, [STRING]]` or `[2, [STRING]]` syntax?
/**
 * {@link rtvref.types.ARRAY ARRAY} arguments.
 * @typedef {Object} rtvref.types.ARRAY_args
 * @property {number} [exact] Exact length.
 * @property {number} [min=0] Minimum length. Ignored if `exact` is specified.
 * @property {number} [max=-1] Maximum length. -1 means no maximum. Ignored if
 *  `exact` is specified.
 */

/**
 * Array rules per qualifiers: Must be an `Array`. Empty arrays are permitted by
 *  default.
 *
 * Arguments (optional): {@link rtvref.types.ARRAY_args}. Note that the `ARRAY`
 *  type must be specified when using arguments (i.e. the shorthand notation
 *  cannot be used).
 *
 * <h4>Example: Shorthand notation</h4>
 *
 * The 'value' property must be an array (possibly empty) of finite numbers of
 *  any value.
 *
 * <pre><code>{
 *   value: [[FINITE]]
 * }
 * </code></pre>
 *
 * <h4>Example: Shorthand, mixed types</h4>
 *
 * The 'value' property must be either a boolean, or a non-empty array of finite
 *  numbers of any value.
 *
 * <pre><code>{
 *   value: [BOOLEAN, [FINITE]]
 * }
 * </code></pre>
 *
 * <h4>Example: Full notation</h4>
 *
 * The 'value' property must be a non-empty array of finite numbers of any value.
 *
 * <pre><code>{
 *   value: [ARRAY, {min: 1}, [FINITE]]
 * }
 * </code></pre>
 *
 * <h4>Example: Full, mixed types</h4>
 *
 * The 'value' property must be either a boolean, or a non-empty array of finite
 *  numbers of any value.
 *
 * <pre><code>{
 *   value: [BOOLEAN, ARRAY, {min: 1}, [FINITE]]
 * }
 * </code></pre>
 *
 * @name rtvref.types.ARRAY
 * @const {string}
 * @see {@link rtvref.qualifiers}
 */
export const ARRAY = 'array';

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
 * @see {@link rtvref.types.MAP_OBJECT}
 */
export const ANY_OBJECT = 'anyObject';

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
 * @see {@link rtvref.types.MAP_OBJECT}
 */
export const OBJECT = 'object';

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
 * @see {@link rtvref.types.MAP_OBJECT}
 */
export const PLAIN_OBJECT = 'plainObject';

/**
 * {@link rtvref.types.CLASS_OBJECT CLASS_OBJECT} arguments.
 * @typedef {Object} rtvref.types.CLASS_OBJECT_args
 * @property {function} [ctr] A reference to a constructor function. If specified,
 *  the class object (instance) must have this class function in its inheritance
 *  chain such that `<class_object> instanceof <function> === true`. Note that
 *  this property is not serializable to JSON.
 * @property {rtvref.shape_descriptor} [shape] A description of the class object's
 *  shape.
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
 * @see {@link rtvref.types.MAP_OBJECT}
 */
export const CLASS_OBJECT = 'classObject';

/**
 * A _map_ object is an {@link rtvref.types.OBJECT OBJECT} that is treated as a
 *  hash map with an expected set of keys and values. Keys can be described
 *  using a regular expression, and values can be described using a
 *  {@link rtvref.types.typeset typeset}. Empty maps are permitted.
 *
 * Map object rules per qualifiers: Same as {@link rtvref.types.OBJECT OBJECT} rules.
 *
 * Arguments (optional): {@link rtvref.types.collection_descriptor}
 *
 * @name rtvref.types.MAP_OBJECT
 * @const {string}
 * @see {@link rtvref.qualifiers}
 * @see {@link rtvref.types.ANY_OBJECT}
 * @see {@link rtvref.types.OBJECT}
 * @see {@link rtvref.types.PLAIN_OBJECT}
 * @see {@link rtvref.types.CLASS_OBJECT}
 * @see {@link rtvref.types.MAP}
 * @see {@link rtvref.types.WEAK_MAP}
 */
export const MAP_OBJECT = 'mapObject';

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
export const JSON = 'json';

/**
 * An ES6 map supports any object as its keys, unlike a
 *  {@link rtvref.types.MAP_OBJECT MAP_OBJECT} that only supports strings. Keys can
 *  be described using a regular expression (if they are strings), and values can
 *  be described using a {@link rtvref.types.typeset typeset}. Empty maps are permitted
 *  by default.
 *
 * Map rules per qualifiers: Must be a `Map` instance.
 *
 * Arguments (optional): {@link rtvref.types.collection_descriptor}
 *
 * @name rtvref.types.MAP
 * @const {string}
 * @see {@link rtvref.qualifiers}
 * @see {@link rtvref.types.MAP_OBJECT}
 * @see {@link rtvref.types.WEAK_MAP}
 */
export const MAP = 'map';

/**
 * An ES6 weak map supports any object as its keys, unlike a
 *  {@link rtvref.types.MAP_OBJECT MAP_OBJECT} that only supports strings. Keys can
 *  be described using a regular expression (if they are strings), and values can
 *  be described using a {@link rtvref.types.typeset typeset}. Empty maps are permitted
 *  by default.
 *
 * Weak map rules per qualifiers: Must be a `WeakMap` instance.
 *
 * Arguments (optional): {@link rtvref.types.collection_descriptor}
 *
 * @name rtvref.types.WEAK_MAP
 * @const {string}
 * @see {@link rtvref.qualifiers}
 * @see {@link rtvref.types.MAP_OBJECT}
 * @see {@link rtvref.types.MAP}
 */
export const WEAK_MAP = 'weakMap';

/**
 * An ES6 set is a collection of _unique_ values without associated keys. Values can
 *  be described using a {@link rtvref.types.typeset typeset}. Empty sets are permitted
 *  by default.
 *
 * Set rules per qualifiers: Must be a `Set` instance.
 *
 * Arguments (optional): {@link rtvref.types.collection_descriptor}
 *
 * @name rtvref.types.SET
 * @const {string}
 * @see {@link rtvref.qualifiers}
 * @see {@link rtvref.types.WEAK_SET}
 */
export const SET = 'set';

/**
 * An ES6 weak set is a collection of _unique_ values without associated keys. Values can
 *  be described using a {@link rtvref.types.typeset typeset}. Empty sets are permitted
 *  by default.
 *
 * Weak set rules per qualifiers: Must be a `WeakSet` instance.
 *
 * Arguments (optional): {@link rtvref.types.collection_descriptor}
 *
 * @name rtvref.types.WEAK_SET
 * @const {string}
 * @see {@link rtvref.qualifiers}
 * @see {@link rtvref.types.SET}
 */
export const WEAK_SET = 'weakSet';

//
// ^^^^^^^ INSERT NEW TYPES ^^^^^^^ ABOVE THIS SECTION ^^^^^^^
//

/**
 * Enumeration (`string -> string`) of {@link rtvref.types types}.
 * @name rtvref.types.types
 * @type {rtvref.Enumeration}
 */
export default new Enumeration({
  ANY,
  STRING,
  BOOLEAN,
  SYMBOL,
  NUMBER,
  FINITE,
  INT,
  FLOAT,
  FUNCTION,
  REGEXP,
  DATE,
  ERROR,
  PROMISE,
  ARRAY,
  ANY_OBJECT,
  OBJECT,
  PLAIN_OBJECT,
  CLASS_OBJECT,
  MAP_OBJECT,
  JSON,
  MAP,
  WEAK_MAP,
  SET,
  WEAK_SET
});
