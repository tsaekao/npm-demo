/*!
* rtvjs 0.0.1
* @license MIT, https://gitlab.com/stefcameron/rtvjs/blob/master/LICENSE.md
* Parts of Lodash used internally: https://github.com/lodash/lodash/
*/
var commonjsGlobal = typeof window !== 'undefined' ? window : typeof global !== 'undefined' ? global : typeof self !== 'undefined' ? self : {};

/** Detect free variable `global` from Node.js. */
var freeGlobal = typeof commonjsGlobal == 'object' && commonjsGlobal && commonjsGlobal.Object === Object && commonjsGlobal;

var _freeGlobal = freeGlobal;

/** Detect free variable `self`. */
var freeSelf = typeof self == 'object' && self && self.Object === Object && self;

/** Used as a reference to the global object. */
var root = _freeGlobal || freeSelf || Function('return this')();

var _root = root;

/** Built-in value references. */
var Symbol$1 = _root.Symbol;

var _Symbol = Symbol$1;

/** Used for built-in method references. */
var objectProto = Object.prototype;

/** Used to check objects for own properties. */
var hasOwnProperty = objectProto.hasOwnProperty;

/**
 * Used to resolve the
 * [`toStringTag`](http://ecma-international.org/ecma-262/7.0/#sec-object.prototype.tostring)
 * of values.
 */
var nativeObjectToString = objectProto.toString;

/** Built-in value references. */
var symToStringTag = _Symbol ? _Symbol.toStringTag : undefined;

/**
 * A specialized version of `baseGetTag` which ignores `Symbol.toStringTag` values.
 *
 * @private
 * @param {*} value The value to query.
 * @returns {string} Returns the raw `toStringTag`.
 */
function getRawTag(value) {
  var isOwn = hasOwnProperty.call(value, symToStringTag),
      tag = value[symToStringTag];

  try {
    value[symToStringTag] = undefined;
    var unmasked = true;
  } catch (e) {}

  var result = nativeObjectToString.call(value);
  if (unmasked) {
    if (isOwn) {
      value[symToStringTag] = tag;
    } else {
      delete value[symToStringTag];
    }
  }
  return result;
}

var _getRawTag = getRawTag;

/** Used for built-in method references. */
var objectProto$1 = Object.prototype;

/**
 * Used to resolve the
 * [`toStringTag`](http://ecma-international.org/ecma-262/7.0/#sec-object.prototype.tostring)
 * of values.
 */
var nativeObjectToString$1 = objectProto$1.toString;

/**
 * Converts `value` to a string using `Object.prototype.toString`.
 *
 * @private
 * @param {*} value The value to convert.
 * @returns {string} Returns the converted string.
 */
function objectToString(value) {
  return nativeObjectToString$1.call(value);
}

var _objectToString = objectToString;

/** `Object#toString` result references. */
var nullTag = '[object Null]',
    undefinedTag = '[object Undefined]';

/** Built-in value references. */
var symToStringTag$1 = _Symbol ? _Symbol.toStringTag : undefined;

/**
 * The base implementation of `getTag` without fallbacks for buggy environments.
 *
 * @private
 * @param {*} value The value to query.
 * @returns {string} Returns the `toStringTag`.
 */
function baseGetTag(value) {
  if (value == null) {
    return value === undefined ? undefinedTag : nullTag;
  }
  return (symToStringTag$1 && symToStringTag$1 in Object(value))
    ? _getRawTag(value)
    : _objectToString(value);
}

var _baseGetTag = baseGetTag;

/**
 * Checks if `value` is classified as an `Array` object.
 *
 * @static
 * @memberOf _
 * @since 0.1.0
 * @category Lang
 * @param {*} value The value to check.
 * @returns {boolean} Returns `true` if `value` is an array, else `false`.
 * @example
 *
 * _.isArray([1, 2, 3]);
 * // => true
 *
 * _.isArray(document.body.children);
 * // => false
 *
 * _.isArray('abc');
 * // => false
 *
 * _.isArray(_.noop);
 * // => false
 */
var isArray = Array.isArray;

var isArray_1 = isArray;

/**
 * Checks if `value` is object-like. A value is object-like if it's not `null`
 * and has a `typeof` result of "object".
 *
 * @static
 * @memberOf _
 * @since 4.0.0
 * @category Lang
 * @param {*} value The value to check.
 * @returns {boolean} Returns `true` if `value` is object-like, else `false`.
 * @example
 *
 * _.isObjectLike({});
 * // => true
 *
 * _.isObjectLike([1, 2, 3]);
 * // => true
 *
 * _.isObjectLike(_.noop);
 * // => false
 *
 * _.isObjectLike(null);
 * // => false
 */
function isObjectLike(value) {
  return value != null && typeof value == 'object';
}

var isObjectLike_1 = isObjectLike;

/** `Object#toString` result references. */
var stringTag = '[object String]';

/**
 * Checks if `value` is classified as a `String` primitive or object.
 *
 * @static
 * @since 0.1.0
 * @memberOf _
 * @category Lang
 * @param {*} value The value to check.
 * @returns {boolean} Returns `true` if `value` is a string, else `false`.
 * @example
 *
 * _.isString('abc');
 * // => true
 *
 * _.isString(1);
 * // => false
 */
function isString(value) {
  return typeof value == 'string' ||
    (!isArray_1(value) && isObjectLike_1(value) && _baseGetTag(value) == stringTag);
}

var isString_1 = isString;

var version = "0.0.1";

//// Type Definitions \\\\

/**
 * <h2>Types</h2>
 *
 * <h3>Primitives</h3>
 *
 * In RTV.js, a primitive is considered to be one of the following types:
 *
 * - `string` (note that `new String('s')` does not produce a _primitive_, it
 *   produces an _object_, and should generally be avoided).
 * - `boolean` (note that `new Boolean(true)` does not produce a _primitive_,
 *   it produces an _object_, and should generally be avoided).
 * - `number` (note that `new Number(1)` does not produce a _primitive_,
 *   it produces an _object_, and should generally be avoided).
 * - `Symbol`
 * - `null`
 * - `undefined`
 *
 * <h3>Rules Per Qualifiers</h3>
 *
 * {@link rtvref.qualifiers Qualifiers} state basic rules. Unless otherwise stated,
 *  every type herein abides by those basic rules. Each type will also impose
 *  additional rules specific to the type of value it represents.
 *
 * For example, while the {@link rtvref.types.FINITE FINITE} type states that the
 *  value must not be `NaN`, `+Infinity`, nor `-Infinity`, it could be `null` if
 *  the qualifier used is `EXPECTED`, and it could be `undefined` if the qualifier
 *  used is `OPTIONAL`.
 *
 * <h3>Arguments</h3>
 *
 * Some types will accept, or may even expect, arguments. An argument immediately
 *  follows the type in the description, such as `PLAIN_OBJECT, {hello: STRING}`.
 *  This would specify that the value must be a {@link rtvref.types.PLAIN_OBJECT plain object}
 *  with a shape that includes a property named 'hello', that property being a
 *  {@link rtvref.qualifiers.REQUIRED required} {@link rtvref.types.STRING string}.
 *
 * Optional and required arguments are specified for each type, where applicable.
 *
 * @namespace rtvref.types
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
 *
 * For example, the following descriptors both verify a collection of 3-letter
 *  string keys (upper- or lowercase) to finite numbers:
 *
 * - `{keyExp: '[a-z]{3}', keyExpFlags: 'i', values: rtv.t.FINITE}`
 * - `{keyExp: '[a-zA-Z]{3}', values: rtv.t.FINITE}`
 *
 * @typedef {Object} rtvref.types.collection_descriptor
 * @property {rtvref.types.typeset} [keys] Optional. A typeset describing each key
 *  in the collection.
 *
 * The type of collection being described may restrict the types that this typeset
 *  can include. For example, the {@link rtvref.types.MAP_OBJECT MAP_OBJECT} collection
 *  only supports the {@link rtvref.types.STRING STRING} type due to the nature of
 *  its JavaScript Object-based implementation.
 *
 * NOTE: This property is ignored when the collection is a {@link rtvref.types.SET SET}
 *  or a {@link rtvref.types.WEAK_SET WEAK_SET} because sets do not have keys.
 *
 * @property {String} [keyExp] Optional. A string-based regular expression
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
 * @property {String} [keyExpFlags] Optional. A string specifying any flags to use
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
 * @property {Number} [count=-1] Optional. The number of entries expected in
 *  the collection. A negative value allows for any number of entries. Zero
 *  requires an empty collection.
 *
 * @see rtvref.types.MAP_OBJECT
 * @see rtvref.types.MAP
 * @see rtvref.types.WEAK_MAP
 * @see rtvref.types.SET
 * @see rtvref.types.WEAK_SET
 */

/**
 * <h3>Typeset</h3>
 *
 * Describes the possible types for a given value. It can be any one of the following
 *  JavaScript types:
 *
 * - `Object`: For the root or a nested {@link rtvref.shape_descriptor shape descriptor}
 *   of _implied_ {@link rtvref.types.OBJECT OBJECT} type (unless qualified with a specific
 *   object type like {@link rtvref.types.PLAIN_OBJECT PLAIN_OBJECT}, for example).
 * - `String`: For a single type, such as {@link rtvref.types.FINITE 'FINITE'}
 *   for a finite number.
 * - `Array`: For multiple type possibilities, optionally {@link rtvref.qualifiers qualified},
 *   using an __OR__ conjunction, which means the value of the property being described must
 *   be at least one of the types listed, but not all. Note that when a nested array is
 *   encountered (i.e. an array within a typeset), it is treated as the shortcut
 *   {@link rtvref.types.ARRAY ARRAY} form, implying an array of nested typesets, e.g.
 *   `values: [BOOLEAN, [STRING, FINITE]]` would describe a 'values' property that should
 *   be a boolean, or an array of non-empty strings or finite numbers.
 * - `Function`: For a {@link rtvref.types.property_validator property validator}
 *   that will verify the value of the property using custom code. Only one validator
 *   can be specified for a given typeset, and it will only be called if the value
 *   was verified against at least one of the other types listed. If no other types
 *   were listed (i.e. using the `Array` form, as described above), then the validator
 *   is called immediately.
 *
 * Note that all typesets use an _implied_ {@link rtvref.qualifiers.REQUIRED required}
 *  qualifier unless otherwise specified. To qualify a typeset, a
 *  {@link rtvref.qualifiers qualifier} may be specified as the __first__ element
 *  in the `Array` form (if specified, it must be the first element). For example,
 *  `note: [rtv.q.EXPECTED, rtv.t.STRING]` would describe an expected, but not required,
 *  string, which could therefore be either empty or even `null`. The `Array` form
 *  must be used in order to qualify a typeset as other than required, and the
 *  qualifier applies to all immediate types in the typeset (which means each
 *  nested typeset can have its own qualifier).
 *
 * <h4>Example: Object</h4>
 *
 * <pre><code>const contactShape = {
 *   name: rtv.t.STRING, // required, non-empty, string
 *   tags: [rtv.t.ARRAY, [rtv.t.STRING]], // required array of non-empty strings
 *   // tags: [[rtv.t.STRING]], // same as above, but using shortcut array format
 *   details: { // required nested object of type `rtv.t.OBJECT` (default)
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
 * @typedef {(Object|String|Array|Function)} rtvref.types.typeset
 */

/**
 * <h3>Property Validator</h3>
 *
 * // TODO: document rtvref.types.property_validator (already referenced)
 *
 * Note one disadvantage: cannot be de/serialized via JSON.
 *
 * @typedef {Function} rtvref.types.property_validator
 * @param {*} value The value being verified.
 * @param {rtvref.types.typeset} typeset Reference to the typeset used for
 *  verification (where the last element would be a reference to this function).
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
 * @const {String}
 * @see {@link rtvref.qualifiers}
 */
var ANY = 'any';

/**
 * String rules per qualifiers:
 *
 * - REQUIRED: Must be a non-empty string.
 * - EXPECTED | OPTIONAL: Can be an empty string.
 *
 * @name rtvref.types.STRING
 * @const {String}
 * @see {@link rtvref.qualifiers}
 */
var STRING = 'string';

/**
 * Boolean rules per qualifiers: Must be a boolean.
 * @name rtvref.types.BOOLEAN
 * @const {String}
 * @see {@link rtvref.qualifiers}
 */
var BOOLEAN = 'boolean';

/**
 * Number rules per qualifiers:
 *
 * - REQUIRED: Cannot be `NaN`, but could be `+Infinity`, `-Infinity`.
 * - EXPECTED | OPTIONAL: Could be `NaN`, `+Infinity`, `-Infinity`.
 *
 * @name rtvref.types.NUMBER
 * @const {String}
 * @see {@link rtvref.qualifiers}
 * @see {@link rtvref.types.FINITE}
 */
var NUMBER = 'number';

/**
 * Symbol rules per qualifiers: Must be a symbol.
 * @name rtvref.types.SYMBOL
 * @const {String}
 * @see {@link rtvref.qualifiers}
 */
var SYMBOL = 'symbol';

/**
 * Finite rules per qualifiers: Cannot be `NaN`, `+Infinity`, `-Infinity`. The
 *  value can be either a safe integer or a {@link rtvref.types.FLOAT floating point number}.
 * @name rtvref.types.FINITE
 * @const {String}
 * @see {@link rtvref.qualifiers}
 * @see {@link rtvref.types.NUMBER}
 * @see {@link https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/Number/isSafeInteger Number.isSafeInteger()}
 */
var FINITE = 'finite';

/**
 * Int rules per qualifiers: Must be a {@link rtvref.types.FINITE finite} integer,
 *  but is not necessarily _safe_.
 * @name rtvref.types.INT
 * @const {String}
 * @see {@link rtvref.qualifiers}
 * @see {@link rtvref.types.FINITE}
 * @see {@link rtvref.types.FLOAT}
 * @see {@link https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/Number/isSafeInteger Number.isSafeInteger()}
 */
var INT = 'int';

/**
 * Float rules per qualifiers: Must be a finite floating point number.
 * @name rtvref.types.FLOAT
 * @const {String}
 * @see {@link rtvref.qualifiers}
 * @see {@link rtvref.types.INT}
 */
var FLOAT = 'float';

/**
 * An _any_ object is anything that is not a {@link rtvref.types primitive}, which
 *  means it includes the `Array` type, as well as functions and arguments. To
 *  test for an array, use the {@link rtvref.types.ARRAY ARRAY} type. To
 *  test for a function, use the {@link rtvref.types.FUNCTION FUNCTION} type.
 *
 * The following values are considered any objects:
 *
 * - `{}`
 * - `new Object()`
 * - `[]`
 * - `new Array()`
 * - `function(){}`
 * - `arguments` (function arguments)
 * - `new String('')`
 * - `new Boolean(true)`
 * - `new Number(1)`
 * - `/re/`
 * - `new RegExp('re')`
 * - `new function() {}` (class instance)
 * - `new Set()`
 * - `new WeakSet()`
 * - `new Map()`
 * - `new WeakMap()`
 *
 * The following values __are not__ considered any objects (because they are
 *  considered to be {@link rtvref.types primitives}):
 *
 * - `Symbol('s')`
 * - `true`
 * - `1`
 * - `''`
 * - `null` (NOTE: `typeof null === 'object'` in JavaScript; the `ANY_OBJECT`
 *   type allows testing for this undesirable fact)
 * - `undefined`
 *
 * Any object rules per qualifiers:
 *
 * - REQUIRED: Per the lists above.
 * - EXPECTED: `null` is allowed.
 * - OPTIONAL: `undefined` is allowed.
 *
 * Arguments (optional):
 *
 * - A nested shape description.
 *
 * @name rtvref.types.ANY_OBJECT
 * @const {String}
 * @see {@link rtvref.qualifiers}
 * @see {@link rtvref.types.OBJECT}
 * @see {@link rtvref.types.PLAIN_OBJECT}
 * @see {@link rtvref.types.CLASS_OBJECT}
 * @see {@link rtvref.types.MAP_OBJECT}
 */
var ANY_OBJECT = 'anyObject';

/**
 * An object is one that extends from `JavaScript.Object` and is not
 *  a {@link rtvref.types.FUNCTION function}, {@link rtvref.types.ARRAY array},
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
 * - `[]`
 * - `new Array()`
 * - `/re/`
 * - `new RegExp('re')`
 * - `function(){}`
 * - `arguments` (function arguments)
 * - `new Set()`
 * - `new WeakSet()`
 * - `new Map()`
 * - `new WeakMap()`
 * - `Symbol('s')`
 * - `true`
 * - `1`
 * - `''`
 * - `null`
 * - `undefined`
 *
 * Object rules per qualifiers:
 *
 * - REQUIRED: Per the lists above.
 * - EXPECTED: `null` is allowed.
 * - OPTIONAL: `undefined` is allowed.
 *
 * Arguments (optional):
 *
 * - A nested shape description.
 *
 * @name rtvref.types.OBJECT
 * @const {String}
 * @see {@link rtvref.qualifiers}
 * @see {@link rtvref.types.ANY_OBJECT}
 * @see {@link rtvref.types.PLAIN_OBJECT}
 * @see {@link rtvref.types.CLASS_OBJECT}
 * @see {@link rtvref.types.MAP_OBJECT}
 */
var OBJECT = 'object';

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
 * - `[]`
 * - `new Array()`
 * - `function(){}`
 * - `arguments` (function arguments)
 * - `new String('')`
 * - `new Boolean(true)`
 * - `new Number(1)`
 * - `/re/`
 * - `new RegExp('re')`
 * - `new function() {}` (class instance)
 * - `new Set()`
 * - `new WeakSet()`
 * - `new Map()`
 * - `new WeakMap()`
 * - `Symbol('s')`
 * - `true`
 * - `1`
 * - `''`
 * - `null`
 * - `undefined`
 *
 * Plain object rules per qualifiers:
 *
 * - REQUIRED: Per the lists above.
 * - EXPECTED: `null` is allowed.
 * - OPTIONAL: `undefined` is allowed.
 *
 * Arguments (optional):
 *
 * - A nested shape description.
 *
 * @name rtvref.types.PLAIN_OBJECT
 * @const {String}
 * @see {@link rtvref.qualifiers}
 * @see {@link rtvref.types.ANY_OBJECT}
 * @see {@link rtvref.types.OBJECT}
 * @see {@link rtvref.types.CLASS_OBJECT}
 * @see {@link rtvref.types.MAP_OBJECT}
 */
var PLAIN_OBJECT = 'plainObject';

/**
 * A _class_ object is one that is created by invoking the `new` operator on a
 *  function (other than a primitive type function), generating a new object,
 *  commonly referred to as a _class instance_. This object's prototype
 *  (`__proto__`) is a reference to that function's `prototype`.
 *
 * The following values are considered class objects:
 *
 * - `new function() {}`
 *
 * The following values __are not__ considered class objects:
 *
 * - `{}`
 * - `new Object()`
 * - `[]`
 * - `new Array()`
 * - `function(){}`
 * - `arguments` (function arguments)
 * - `new String('')`
 * - `new Boolean(true)`
 * - `new Number(1)`
 * - `/re/`
 * - `new RegExp('re')`
 * - `new Set()`
 * - `new WeakSet()`
 * - `new Map()`
 * - `new WeakMap()`
 * - `Symbol('s')`
 * - `true`
 * - `1`
 * - `''`
 * - `null`
 * - `undefined`
 *
 * Class object rules per qualifiers:
 *
 * - REQUIRED: Per the lists above.
 * - EXPECTED: `null` is allowed.
 * - OPTIONAL: `undefined` is allowed.
 *
 * Arguments (optional, specify one or the other, or both __in order__):
 *
 * - A reference to a constructor function. If specified, the class object
 *   (instance) must have this class function in its inheritance chain such
 *   that `<class_object> instanceof <function> === true`.
 * - A nested shape description.
 *
 * @name rtvref.types.CLASS_OBJECT
 * @const {String}
 * @see {@link rtvref.qualifiers}
 * @see {@link rtvref.types.ANY_OBJECT}
 * @see {@link rtvref.types.OBJECT}
 * @see {@link rtvref.types.PLAIN_OBJECT}
 * @see {@link rtvref.types.MAP_OBJECT}
 */
var CLASS_OBJECT = 'classObject';

/**
 * A _map_ object is an {@link rtvref.types.OBJECT OBJECT} that is treated as a
 *  hash map with an expected set of keys and values. Keys can be described
 *  using a regular expression, and values can be described using a
 *  {@link rtvref.types.typeset typeset}. Empty maps are permitted.
 *
 * Map object rules per qualifiers: Same as {@link rtvref.types.OBJECT OBJECT} rules.
 *
 * Argument (optional):
 *
 * - A {@link rtvref.types.collection_descriptor collection descriptor} specifying
 *   the rules for the keys and/or values found in the map. If not specified,
 *   the default collection descriptor options apply. __NOTE:__ Since a map object
 *   is based on a JavaScript Object (which only supports string-based keys), the
 *   collection descriptor's `keys` type defaults to (and is required to be)
 *   {@link rtvref.types.STRING STRING}.
 *
 * @name rtvref.types.MAP_OBJECT
 * @const {String}
 * @see {@link rtvref.qualifiers}
 * @see {@link rtvref.types.ANY_OBJECT}
 * @see {@link rtvref.types.OBJECT}
 * @see {@link rtvref.types.PLAIN_OBJECT}
 * @see {@link rtvref.types.CLASS_OBJECT}
 * @see {@link rtvref.types.MAP}
 * @see {@link rtvref.types.WEAK_MAP}
 */
var MAP_OBJECT = 'mapObject';

// TODO: Is there a way that ARRAY could take a parameter, that being the
//  required length of the array, defaulting to -1 for any length? Perhaps
//  only when using the full form as `[ARRAY, 2, [STRING]]` instead of the
//  short form as `[[STRING]]`? If so, then this would be up to par with
//  the MAP_OBJECT where a count can be specified...
/**
 * Array rules per qualifiers: Must be an `Array`. Empty arrays are permitted.
 * @name rtvref.types.ARRAY
 * @const {String}
 * @see {@link rtvref.qualifiers}
 */
var ARRAY = 'array';

/**
 * JSON rules per qualifiers: Must be a JSON value:
 *
 * - {@link rtvref.types.STRING string}, however __empty strings__ are permitted,
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
 * @const {String}
 * @see {@link rtvref.qualifiers}
 */
var JSON = 'json';

/**
 * Function rules per qualifiers: Must be a `function`.
 * @name rtvref.types.FUNCTION
 * @const {String}
 * @see {@link rtvref.qualifiers}
 */
var FUNCTION = 'function';

/**
 * RegExp rules per qualifiers: Must be a `RegExp` instance.
 * @name rtvref.types.REGEXP
 * @const {String}
 * @see {@link rtvref.qualifiers}
 * @see https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/RegExp
 */
var REGEXP = 'regexp';

/**
 * Date rules per qualifiers: Must be a `Date` instance.
 * @name rtvref.types.DATE
 * @const {String}
 * @see {@link rtvref.qualifiers}
 * @see https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/Date
 */
var DATE = 'date';

/**
 * Error rules per qualifiers: Must be an `Error` instance.
 * @name rtvref.types.ERROR
 * @const {String}
 * @see {@link rtvref.qualifiers}
 * @see https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/Error
 */
var ERROR = 'error';

/**
 * Promise rules per qualifiers: Must be a `Promise` instance.
 * @name rtvref.types.PROMISE
 * @const {String}
 * @see {@link rtvref.qualifiers}
 * @see https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/Promise
 */
var PROMISE = 'promise';

/**
 * An ES6 map supports any object as its keys, unlike a
 *  {@link rtvref.types.MAP_OBJECT MAP_OBJECT} that only supports strings. Keys can
 *  be described using a regular expression (if they are strings), and values can
 *  be described using a {@link rtvref.types.typeset typeset}. Empty maps are permitted.
 *
 * Map rules per qualifiers: Must be a `Map` instance.
 *
 * Argument (optional):
 *
 * - A {@link rtvref.types.collection_descriptor collection descriptor} specifying
 *   the rules for the keys and/or values found in the map. If not specified,
 *   the default collection descriptor options apply.
 *
 * @name rtvref.types.MAP
 * @const {String}
 * @see {@link rtvref.qualifiers}
 * @see {@link rtvref.types.MAP_OBJECT}
 * @see {@link rtvref.types.WEAK_MAP}
 */
var MAP = 'map';

/**
 * An ES6 weak map supports any object as its keys, unlike a
 *  {@link rtvref.types.MAP_OBJECT MAP_OBJECT} that only supports strings. Keys can
 *  be described using a regular expression (if they are strings), and values can
 *  be described using a {@link rtvref.types.typeset typeset}. Empty maps are permitted.
 *
 * Weak map rules per qualifiers: Must be a `WeakMap` instance.
 *
 * Argument (optional):
 *
 * - A {@link rtvref.types.collection_descriptor collection descriptor} specifying
 *   the rules for the keys and/or values found in the map. If not specified,
 *   the default collection descriptor options apply.
 *
 * @name rtvref.types.WEAK_MAP
 * @const {String}
 * @see {@link rtvref.qualifiers}
 * @see {@link rtvref.types.MAP_OBJECT}
 * @see {@link rtvref.types.MAP}
 */
var WEAK_MAP = 'weakMap';

/**
 * An ES6 set is a collection of _unique_ values without associated keys. Values can
 *  be described using a {@link rtvref.types.typeset typeset}. Empty sets are permitted.
 *
 * Set rules per qualifiers: Must be a `Set` instance.
 *
 * Argument (optional):
 *
 * - A {@link rtvref.types.collection_descriptor collection descriptor} specifying
 *   the rules for the values found in the set (note that key-related rules are
 *   ignored since they are not applicable). If not specified, the default
 *   collection descriptor options apply.
 *
 * @name rtvref.types.SET
 * @const {String}
 * @see {@link rtvref.qualifiers}
 * @see {@link rtvref.types.WEAK_SET}
 */
var SET = 'set';

/**
 * An ES6 weak set is a collection of _unique_ values without associated keys. Values can
 *  be described using a {@link rtvref.types.typeset typeset}. Empty sets are permitted.
 *
 * Weak set rules per qualifiers: Must be a `WeakSet` instance.
 *
 * Argument (optional):
 *
 * - A {@link rtvref.types.collection_descriptor collection descriptor} specifying
 *   the rules for the values found in the set (note that key-related rules are
 *   ignored since they are not applicable). If not specified, the default
 *   collection descriptor options apply.
 *
 * @name rtvref.types.WEAK_SET
 * @const {String}
 * @see {@link rtvref.qualifiers}
 * @see {@link rtvref.types.SET}
 */
var WEAK_SET = 'weakSet';

var typeMap = Object.freeze({
	ANY: ANY,
	STRING: STRING,
	BOOLEAN: BOOLEAN,
	NUMBER: NUMBER,
	SYMBOL: SYMBOL,
	FINITE: FINITE,
	INT: INT,
	FLOAT: FLOAT,
	ANY_OBJECT: ANY_OBJECT,
	OBJECT: OBJECT,
	PLAIN_OBJECT: PLAIN_OBJECT,
	CLASS_OBJECT: CLASS_OBJECT,
	MAP_OBJECT: MAP_OBJECT,
	ARRAY: ARRAY,
	JSON: JSON,
	FUNCTION: FUNCTION,
	REGEXP: REGEXP,
	DATE: DATE,
	ERROR: ERROR,
	PROMISE: PROMISE,
	MAP: MAP,
	WEAK_MAP: WEAK_MAP,
	SET: SET,
	WEAK_SET: WEAK_SET
});

//// Qualifier Definitions \\\\

/**
 * <h2>Qualifiers</h2>
 * @namespace rtvref.qualifiers
 */

/**
 * Required qualifier: Property _must_ exist and be of the expected type.
 *  Depending on the type, additional requirements may be enforced.
 *
 * Unless otherwise stated in type-specific rules, this qualifier _requires_ the
 *  property to be defined _somewhere_ within the prototype chain, and does not
 *  allow its value to be `null` or `undefined`.
 *
 * See specific type for additional rules.
 *
 * @name rtvref.qualifiers.REQUIRED
 * @const {String}
 * @see {@link rtvref.types}
 */
var REQUIRED = '!';

/**
 * Expected qualifier: Property _should_ exist and be of the expected type.
 *  Depending on the type, some requirements may not be enforced.
 *
 * Unless otherwise stated in type-specific rules, this qualifier _requires_ the
 *  property to be defined _somewhere_ within the prototype chain, does not allow
 *  its value to be `undefined`, but does _allow_ its value to be `null`.
 *
 * See specific type for additional rules.
 *
 * @name rtvref.qualifiers.EXPECTED
 * @const {String}
 * @see {@link rtvref.types}
 */
var EXPECTED = '+';

/**
 * Optional qualifier: Property _may_ exist and be of the expected type.
 *  Depending on the type, some requirements may not be enforced (i.e. less so
 *  than with the `EXPECTED` qualifier).
 *
 * Unless otherwise stated in type-specific rules, this qualifier _allows_ a
 *  property value to be `null` as well as `undefined`, and does _not_ require
 *  the property to be defined anywhere in the prototype chain. If the property
 *  is defined, then it is treated as an `EXPECTED` value.
 *
 * See specific type for additional rules.
 *
 * @name rtvref.qualifiers.OPTIONAL
 * @const {String}
 * @see {@link rtvref.types}
 */
var OPTIONAL = '?';

var qualifierMap = Object.freeze({
	REQUIRED: REQUIRED,
	EXPECTED: EXPECTED,
	OPTIONAL: OPTIONAL
});

var classCallCheck = function (instance, Constructor) {
  if (!(instance instanceof Constructor)) {
    throw new TypeError("Cannot call a class as a function");
  }
};

var createClass = function () {
  function defineProperties(target, props) {
    for (var i = 0; i < props.length; i++) {
      var descriptor = props[i];
      descriptor.enumerable = descriptor.enumerable || false;
      descriptor.configurable = true;
      if ("value" in descriptor) descriptor.writable = true;
      Object.defineProperty(target, descriptor.key, descriptor);
    }
  }

  return function (Constructor, protoProps, staticProps) {
    if (protoProps) defineProperties(Constructor.prototype, protoProps);
    if (staticProps) defineProperties(Constructor, staticProps);
    return Constructor;
  };
}();

//// Enumeration \\\\

/**
 * Simple enumeration type.
 * @class rtvref.Enumeration
 * @param {Object.<String,*>} map Object mapping keys to values. Values cannot
 *  be `undefined`.
 * @throws {Error} If `map` is falsy or empty.
 * @throws {Error} If `map` has a key that maps to `undefined`.
 */
var Enumeration = function () {
  function Enumeration(map) {
    var _this = this;

    classCallCheck(this, Enumeration);

    map = map || {};

    var keys = Object.keys(map);
    var values = [];

    if (keys.length === 0) {
      throw new Error('map must contain at least one key');
    }

    // shallow-clone each key in the map into this
    keys.forEach(function (key) {
      if (map[key] === undefined) {
        throw new Error('map[' + key + '] cannot be undefined');
      }

      var value = map[key];
      values.push(value);
      _this[key] = value;
    });

    /**
     * [internal] List of enumeration values.
     * @name rtvref.Enumeration#_values
     * @type Array.<String>
     */
    Object.defineProperty(this, '_values', {
      enumerable: false, // internal
      configurable: true,
      value: values
    });
  }

  /**
   * Validates a value as being in this enumeration. Throws an exception if the value
   *  is not in this enumeration, unless `silent` is true.
   * @method rtvref.Enumeration#verify
   * @param {*} value Value to check. Cannot be undefined.
   * @param {Boolean} [silent=false] If truthy, returns `undefined` instead of throwing
   *  an exception if the specified value is not in this enumeration.
   * @returns {*} The specified value if it is in this enumeration, or `undefined` if
   *  `silent` is true and the value is not in this enumeration.
   */


  createClass(Enumeration, [{
    key: 'verify',
    value: function verify(value, silent) {
      if (this._values.indexOf(value) >= 0) {
        return value;
      } else if (silent) {
        return undefined;
      }

      throw new Error('invalid value for enum[' + this._values.join(', ') + ']: ' + value);
    }

    /**
     * A string representation of this Enumeration.
     * @returns {string} String representation.
     */

  }, {
    key: 'toString',
    value: function toString() {
      var _this2 = this;

      var pairs = Object.keys(this).map(function (k) {
        return [k, _this2[k]];
      });
      return '{Enumeration pairs=[' + pairs.map(function (p) {
        return '[' + p + ']';
      }).join(', ') + ']}';
    }
  }]);
  return Enumeration;
}();

//// Main entry point \\\\

/**
 * <h1>RTV.js Reference</h1>
 *
 * Members herein are _indirectly_ exposed through the {@link rtv} object.
 * @namespace rtvref
 */

/**
 * <h2>Shape Descriptor</h2>
 *
 * // TODO: document rtvref.shape_descriptor (already referenced). The 'Object'
 * //  type here means an actual Object, NOT anything that could be an object
 * //  like Array, Function, etc.
 *
 * Describes the shape (i.e. interface) of an object as a map of expected or
 *  possible properties to {@link rtvref.types.typeset typesets}.
 *
 * @typedef {Object} rtvref.shape_descriptor
 */

var types = new Enumeration(typeMap);
var qualifiers = new Enumeration(qualifierMap);

/**
 * <h1>RTV.js</h1>
 *
 * Runtime Verification Library for browsers and Node.js.
 * @namespace rtv
 */
var rtv = {
  /**
   * Enumeration of {@link rtvref.types types}.
   * @name rtv.t
   * @type {rtvref.Enumeration}
   */
  t: types,

  /**
   * Enumeration of {@link rtvref.qualifiers qualifiers}.
   * @name rtv.q
   * @type {rtvref.Enumeration}
   */
  q: qualifiers,

  /**
   * Checks a value against a shape for compliance.
   * @param {*} value Value to check.
   * @param {rtvref.types.typeset} shape Expected shape of the value.
   * @returns {Boolean} `true` if the `value` is compliant to the `shape`; `false`
   *  otherwise. An exception is __not__ thrown if the `value` is non-compliant.
   * @see rtv.verify
   */
  check: function check(value, shape) {
    // TODO: testing 'check'
    return isString_1(value) && !!value;
  },


  /**
   * __Requires__ a value to be compliant to a shape.
   * @param {*} value Value to check.
   * @param {rtvref.types.typeset} shape Expected shape of the value.
   * @returns {Boolean} `true` if the `value` is compliant to the `shape`; otherwise,
   *  an exception is thrown.
   * @throws {Error} If the `value` is not compliant to the `shape`.
   * @see rtv.verify
   */
  verify: function verify(value, shape) {
    // TODO: testing 'verify'
    if (this.config.enabled) {
      if (!this.check(value, shape)) {
        throw new Error('value must be a ' + types.STRING + ': ' + value);
      }
    }
  },


  // TODO: docs
  config: Object.defineProperties({}, {
    enabled: function () {
      var value = true;
      return {
        enumerable: true,
        configurable: true,
        get: function get() {
          return value;
        },
        set: function set(newValue) {
          rtv.verify(newValue, types.BOOLEAN);
          value = newValue;
        }
      };
    }()
  }),

  // TODO: docs
  Context: function Context(context) {
    // TODO: a version with same API (less 'config') that will include 'context' in errors thrown
  }
};

/**
 * [internal] Library version.
 * @name rtv._version
 * @type {String}
 */
Object.defineProperty(rtv, '_version', {
  enumerable: false, // internal
  configurable: true,
  value: version
});

export default rtv;
//# sourceMappingURL=rtv.esm.js.map
