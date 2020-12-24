////// Nothing but Type Definitions

/**
 * The any type is special in that it allows _anything_, which includes `null`
 *  and `undefined` values. Because of this, it's the most liberal in terms of
 *  types as well as in its interaction with qualifiers. A more specific type
 *  should be used whenever possible to ensure a higher degree of confidence
 *  in the value being validated.
 *
 * Any rules per qualifiers:
 *
 * - REQUIRED: Can be any value, including `null` and `undefined`.
 * - EXPECTED: Same rules as REQUIRED.
 * - OPTIONAL: Same rules as EXPECTED.
 * - TRUTHY: Same rules as OPTIONAL.
 *
 * Since this type removes the property's need for existence in the prototype
 *  chain, it renders the verification moot (i.e. the property of this type might
 *  as well not be included in a {@link rtvref.types.shape_descriptor shape descriptor}
 *  unless a {@link rtvref.types.custom_validator custom validator} is being
 *  used to do customized verification.
 *
 * @name rtvref.types.ANY
 * @const {string}
 * @see {@link rtvref.qualifiers}
 */
export const ANY = 'ANY';

/**
 * Null rules per qualifiers: Must be the `null` {@link rtvref.types.primitives primitive}.
 *
 * Use this special type to explicitly test for a `null` value. For example,
 *  a {@link rtvref.types.shape_descriptor shape}'s property may be required to be
 *  `null` under certain circumstances.
 *
 * @name rtvref.types.NULL
 * @const {string}
 * @see {@link rtvref.qualifiers}
 */
export const NULL = 'NULL';

/**
 * String rules per qualifiers:
 *
 * - REQUIRED: Must be a non-empty string, unless an argument allows it.
 * - EXPECTED | OPTIONAL: May be an empty string, unless an argument disallows it.
 *   Note that the value `null` (for EXPECTED and OPTIONAL) or `undefined` (for OPTIONAL)
 *   will not be subject to any restrictions imposed by arguments (i.e. the arguments will be
 *   ignored; for example, `rtv.verify(null, [EXPECTED, STRING, {min: 1}])` would
 *   _pass_ verification because `null` is permitted with EXPECTED).
 * - TRUTHY: May be an empty string _regardless_ of arguments, since an empty
 *   string is _falsy_, and this qualifier permits all _falsy_ values. Therefore,
 *   `rtv.verify("", [TRUTHY, STRING, {min: 1}])` would still _pass_ verification
 *   because an empty string is permitted with TRUTHY.
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
export const STRING = 'STRING';

/**
 * Boolean rules per qualifiers: Must be a boolean {@link rtvref.types.primitives primitive}.
 *  Note that `new Boolean(true) !== true` because the former is an _object_, not a boolean.
 * @name rtvref.types.BOOLEAN
 * @const {string}
 * @see {@link rtvref.qualifiers}
 */
export const BOOLEAN = 'BOOLEAN';

/**
 * Symbol rules per qualifiers: Must be a symbol {@link rtvref.types.primitives primitive}.
 *
 * Arguments (optional): {@link rtvref.types.SYMBOL_args}.
 *
 * @name rtvref.types.SYMBOL
 * @const {string}
 * @see {@link rtvref.qualifiers}
 */
export const SYMBOL = 'SYMBOL';

/**
 * Number rules per qualifiers:
 *
 * - REQUIRED: Cannot be `NaN`, but could be `+Infinity`, `-Infinity`.
 * - EXPECTED | OPTIONAL: Could be `NaN`, `+Infinity`, `-Infinity`.
 * - TRUTHY: Could be `NaN` (since that is a {@link rtvref.types.falsy_values falsy value}),
 *   `+Infinity`, `-Infinity`.
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
export const NUMBER = 'NUMBER';

/**
 * Finite rules per qualifiers: Cannot be `NaN` (unless the qualifier is TRUTHY),
 *  `+Infinity`, `-Infinity`. The value can be either an {@link rtvref.types.INT integer},
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
export const FINITE = 'FINITE';

/**
 * Int rules per qualifiers: Must be a {@link rtvref.types.FINITE finite} number,
 *  an integer, and a number {@link rtvref.types.primitives primitive}. `NaN`,
 *  however, is permitted if the qualifier is TRUTHY.
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
export const INT = 'INT';

/**
 * Int rules per qualifiers: Must be a {@link rtvref.types.FINITE finite} number, a
 *  {@link https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/Number/isSafeInteger safe integer},
 *  and a number {@link rtvref.types.primitives primitive}. `NaN`, however, is
 *  permitted if the qualifier is TRUTHY.
 *
 * An integer is safe if it's an IEEE-754 double precision number which isn't
 *  the result of a rounded unsafe integer. For example, `2^53 - 1` is safe,
 *  but `2^53` is not because `2^53 + 1` would be rounded to `2^53`.
 *
 * Arguments (optional): {@link rtvref.types.numeric_args}
 *
 * @name rtvref.types.SAFE_INT
 * @const {string}
 * @see {@link rtvref.qualifiers}
 * @see {@link rtvref.types.NUMBER}
 * @see {@link rtvref.types.FINITE}
 * @see {@link rtvref.types.INT}
 * @see {@link rtvref.types.FLOAT}
 */
export const SAFE_INT = 'SAFE_INT';

/**
 * Float rules per qualifiers: Must be a {@link rtvref.types.FINITE finite}
 *  floating point number, and a number {@link rtvref.types.primitives primitive}.
 *  Per IEEE 754, zero (`0`) is considered a float. Note that `NaN` is permitted
 *  if the qualifier is TRUTHY.
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
export const FLOAT = 'FLOAT';

/**
 * Function rules per qualifiers: Must be a `function`.
 * @name rtvref.types.FUNCTION
 * @const {string}
 * @see {@link rtvref.qualifiers}
 */
export const FUNCTION = 'FUNCTION';

/**
 * RegExp rules per qualifiers: Must be a `RegExp` instance.
 * @name rtvref.types.REGEXP
 * @const {string}
 * @see {@link rtvref.qualifiers}
 * @see https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/RegExp
 */
export const REGEXP = 'REGEXP';

/**
 * Date rules per qualifiers: Must be a `Date` instance.
 * @name rtvref.types.DATE
 * @const {string}
 * @see {@link rtvref.qualifiers}
 * @see https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/Date
 */
export const DATE = 'DATE';

/**
 * Error rules per qualifiers: Must be an `Error` instance, which includes `TypeError`,
 *  `RangeError`, `ReferenceError`, etc.
 * @name rtvref.types.ERROR
 * @const {string}
 * @see {@link rtvref.qualifiers}
 * @see https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/Error
 */
export const ERROR = 'ERROR';

/**
 * Promise rules per qualifiers: Must be a `Promise` instance.
 * @name rtvref.types.PROMISE
 * @const {string}
 * @see {@link rtvref.qualifiers}
 * @see https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/Promise
 */
export const PROMISE = 'PROMISE';

/**
 * Array rules per qualifiers: Must be an `Array`. Empty arrays are permitted,
 *  unless arguments prevent them.
 *
 * Arguments (optional): {@link rtvref.types.ARRAY_args}. Note that the `ARRAY`
 *  type must be specified when using arguments (i.e. the shorthand notation cannot
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
 * <h4>Array Example: Simple array</h4>
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
 * <h4>Array Example: Shorthand notation</h4>
 *
 * The `value` property must be an array (possibly empty) of finite numbers of
 *  any value.
 *
 * <pre><code>{
 *   value: [[FINITE]]
 * }
 * </code></pre>
 *
 * <h4>Array Example: Shorthand, mixed types</h4>
 *
 * The `value` property must be either a boolean; or an array (possibly empty) of
 *  finite numbers of any value, or non-empty strings, or a mix of both.
 *
 * <pre><code>{
 *   value: [BOOLEAN, [FINITE, STRING]]
 * }
 * </code></pre>
 *
 * <h4>Array Example: Fully-qualified notation, no typeset</h4>
 *
 * The `value` property must be a non-empty array of any type of value.
 *
 * <pre><code>{
 *   value: [REQUIRED, ARRAY, {min: 1}]
 * }
 * </code></pre>
 *
 * <h4>Array Example: Fully-qualified notation</h4>
 *
 * The `value` property must be an array (possibly empty) of finite numbers of
 *  any value (nested typeset is not fully-qualified).
 *
 * <pre><code>{
 *   value: [REQUIRED, ARRAY, {ts: [FINITE]}]
 * }
 * </code></pre>
 *
 * <h4>Array Example: Fully-qualified, mixed types</h4>
 *
 * The `value` property must be either a boolean; or an array (possibly empty) of
 *  finite numbers of any value, or non-empty strings, or a mix of both
 *  (nested typeset is not fully-qualified).
 *
 * <pre><code>{
 *   value: [REQUIRED, BOOLEAN, ARRAY, {ts: [FINITE, STRING]}]
 * }
 * </code></pre>
 *
 * @name rtvref.types.ARRAY
 * @const {string}
 * @see {@link rtvref.qualifiers}
 */
export const ARRAY = 'ARRAY';

/**
 * An _any_ object is anything that is __not__ a {@link rtvref.types primitive}, which
 *  means it includes the `Array` type, as well as functions and arguments, and
 *  other JavaScript _object_ types. To test for an array, use the
 *  {@link rtvref.types.ARRAY ARRAY} type. To test for a function, use the
 *  {@link rtvref.types.FUNCTION FUNCTION} type.
 *
 * The following values __are considered__ any objects:
 *
 * - `{}`
 * - `new Object()`
 * - `new (function() {}) | new (class {})()` (class instance) (also see
 *   {@link rtvref.types.CLASS_OBJECT CLASS_OBJECT})
 * - `new String('')`
 * - `new Boolean(true)`
 * - `new Number(1)`
 * - `[]` (also see {@link rtvref.types.ARRAY ARRAY})
 * - `new Array()` (also see {@link rtvref.types.ARRAY ARRAY})
 * - `/re/` (also see {@link rtvref.types.REGEXP REGEXP})
 * - `new RegExp('re')` (also see {@link rtvref.types.REGEXP REGEXP})
 * - `new Date()` (also see {@link rtvref.types.DATE DATE})
 * - `new Error()` (also see {@link rtvref.types.ERROR ERROR})
 * - `new Promise()` (also see {@link rtvref.types.PROMISE PROMISE})
 * - `function(){}` (also see {@link rtvref.types.FUNCTION FUNCTION})
 * - `arguments` (function arguments)
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
 * Arguments (optional): {@link rtvref.types.shape_object_args}
 *
 * @name rtvref.types.ANY_OBJECT
 * @const {string}
 * @see {@link rtvref.qualifiers}
 * @see {@link rtvref.types.OBJECT}
 * @see {@link rtvref.types.PLAIN_OBJECT}
 * @see {@link rtvref.types.CLASS_OBJECT}
 */
export const ANY_OBJECT = 'ANY_OBJECT';

/**
 * An object is one that extends from `JavaScript.Object` (i.e. an _instance_
 *  of _something_ that extends from Object) and is not a
 *  {@link rtvref.types.FUNCTION function}, {@link rtvref.types.ARRAY array},
 *  {@link rtvref.types.REGEXP regular expression}, {@link rtvref.types.DATE DATE},
 *  function arguments object,
 *  {@link rtvref.types.MAP map}, {@link rtvref.types.WEAK_MAP weak map},
 *  {@link rtvref.types.SET set}, {@link rtvref.types.WEAK_SET weak set}, nor a
 *  {@link rtvref.types primitive}.
 *
 * This is the __default__ (imputed) type for
 *  {@link rtvref.types.shape_descriptor shape descriptors}, which means the object itself
 *  (the value being tested), prior to being checked against its shape, will be
 *  tested according to this type.
 *
 * The following values are considered objects:
 *
 * - `{}`
 * - `new Object()`
 * - `new (function() {}) | new (class {})()` (class instance) (also see
 *   {@link rtvref.types.CLASS_OBJECT CLASS_OBJECT})
 *
 * The following values __are not__ considered objects:
 *
 * - `new String('')`
 * - `new Boolean(true)`
 * - `new Number(1)`
 * - `[]` (also see {@link rtvref.types.ARRAY ARRAY})
 * - `new Array()` (also see {@link rtvref.types.ARRAY ARRAY})
 * - `/re/` (also see {@link rtvref.types.REGEXP REGEXP})
 * - `new RegExp('re')` (also see {@link rtvref.types.REGEXP REGEXP})
 * - `new Date()` (also see {@link rtvref.types.DATE DATE})
 * - `new Error()` (also see {@link rtvref.types.ERROR ERROR})
 * - `new Promise()` (also see {@link rtvref.types.PROMISE PROMISE})
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
 * Arguments (optional): {@link rtvref.types.shape_object_args}
 *
 * @name rtvref.types.OBJECT
 * @const {string}
 * @see {@link rtvref.qualifiers}
 * @see {@link rtvref.types.ANY_OBJECT}
 * @see {@link rtvref.types.PLAIN_OBJECT}
 * @see {@link rtvref.types.CLASS_OBJECT}
 */
export const OBJECT = 'OBJECT';

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
 * - `new (function() {}) | new (class {})()` (class instance) (also see
 *   {@link rtvref.types.CLASS_OBJECT CLASS_OBJECT})
 * - `new String('')`
 * - `new Boolean(true)`
 * - `new Number(1)`
 * - `[]` (also see {@link rtvref.types.ARRAY ARRAY})
 * - `new Array()` (also see {@link rtvref.types.ARRAY ARRAY})
 * - `/re/` (also see {@link rtvref.types.REGEXP REGEXP})
 * - `new RegExp('re')` (also see {@link rtvref.types.REGEXP REGEXP})
 * - `new Date()` (also see {@link rtvref.types.DATE DATE})
 * - `new Error()` (also see {@link rtvref.types.ERROR ERROR})
 * - `new Promise()` (also see {@link rtvref.types.PROMISE PROMISE})
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
 * Arguments (optional): {@link rtvref.types.shape_object_args}
 *
 * @name rtvref.types.PLAIN_OBJECT
 * @const {string}
 * @see {@link rtvref.qualifiers}
 * @see {@link rtvref.types.ANY_OBJECT}
 * @see {@link rtvref.types.OBJECT}
 * @see {@link rtvref.types.CLASS_OBJECT}
 */
export const PLAIN_OBJECT = 'PLAIN_OBJECT';

/**
 * A _class_ object is one that is created by invoking the `new` operator on a
 *  function (other than a primitive type function), generating a new object,
 *  commonly referred to as a _class instance_. This object's prototype
 *  (`__proto__`) is a reference to that function's `prototype` and has a
 *  `constructor` property that is `===` to the function.
 *
 * The following values are considered class objects:
 *
 * - `new (function() {}) | new (class {})()` (tip: use the `ctor`
 *   {@link rtvref.types.shape_object_args argument} to test for a specific class)
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
 * - `new Date()` (also see {@link rtvref.types.DATE DATE})
 * - `new Error()` (also see {@link rtvref.types.ERROR ERROR})
 * - `new Promise()` (also see {@link rtvref.types.PROMISE PROMISE})
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
 * Arguments (optional): {@link rtvref.types.shape_object_args}
 *
 * @name rtvref.types.CLASS_OBJECT
 * @const {string}
 * @see {@link rtvref.qualifiers}
 * @see {@link rtvref.types.ANY_OBJECT}
 * @see {@link rtvref.types.OBJECT}
 * @see {@link rtvref.types.PLAIN_OBJECT}
 */
export const CLASS_OBJECT = 'CLASS_OBJECT';

/**
 * A simple {@link rtvref.types.OBJECT OBJECT} that is treated as a hash map
 *  with an expected set of keys (forcibly strings due to the nature of the
 *  native JavaScript `Object` type) and values. Keys are __own-properties only__,
 *  and can be described using a regular expression. Values can be described using a
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
export const HASH_MAP = 'HASH_MAP';

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
export const MAP = 'MAP';

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
export const WEAK_MAP = 'WEAK_MAP';

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
export const SET = 'SET';

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
export const WEAK_SET = 'WEAK_SET';

/**
 * JSON rules per qualifiers: Must be a JSON value:
 *
 * - {@link rtvref.types.NULL null}
 * - {@link rtvref.types.STRING string}, however __empty strings are permitted__,
 *   even if the qualifier is `REQUIRED`
 * - {@link rtvref.types.BOOLEAN boolean}
 * - {@link rtvref.types.FINITE finite number}, however `NaN` __is permitted__
 *   if the qualifier is TRUTHY since it is a {@link rtvref.types.falsy_values falsy value}.
 * - {@link rtvref.types.PLAIN_OBJECT plain object}
 * - {@link rtvref.types.ARRAY array}
 *
 * Since this type checks for _any_ valid JSON value, empty string and `null`
 *  values are permitted, even when the typeset is qualified as `REQUIRED`.
 *  Therefore, the `REQUIRED` qualifier has the same effect as the `EXPECTED`
 *  qualifier.
 *
 * Also note that if the qualifier is `OPTIONAL` or `TRUTHY`, then `undefined`
 *  will be a permitted value, even though it is not a JSON value.
 *
 * @name rtvref.types.JSON
 * @const {string}
 * @see {@link rtvref.qualifiers}
 */
export const JSON = 'JSON';
