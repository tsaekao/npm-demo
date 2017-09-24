//// Type Definitions \\\\

'use strict';

/**
 * Types
 *
 * <h4>Primitives</h4>
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
 * @namespace rtv.types
 */

/**
 * String rules per qualifiers:
 *
 * - REQUIRED: Must be a non-empty string.
 * - EXPECTED | OPTIONAL: Can be an empty string.
 *
 * @name rtv.types.STRING
 * @const {String}
 * @see {@link rtv.qualifiers}
 */
export var STRING = 'string';

/**
 * Boolean rules per qualifiers: Must be a boolean.
 * @name rtv.types.BOOLEAN
 * @const {String}
 * @see {@link rtv.qualifiers}
 */
export var BOOLEAN = 'boolean';

/**
 * Number rules per qualifiers:
 *
 * - REQUIRED: Cannot be `NaN`, but could be `+Infinity`, `-Infinity`.
 * - EXPECTED | OPTIONAL: Could be `NaN`, `+Infinity`, `-Infinity`.
 *
 * @name rtv.types.NUMBER
 * @const {String}
 * @see {@link rtv.qualifiers}
 * @see {@link rtv.types.FINITE}
 */
export var NUMBER = 'number';

/**
 * Symbol rules per qualifiers: Must be a symbol.
 * @name rtv.types.SYMBOL
 * @const {String}
 * @see {@link rtv.qualifiers}
 */
export var SYMBOL = 'symbol';

/**
 * Finite rules per qualifiers: Cannot be `NaN`, `+Infinity`, `-Infinity`.
 * @name rtv.types.FINITE
 * @const {String}
 * @see {@link rtv.qualifiers}
 * @see {@link rtv.types.NUMBER}
 */
export var FINITE = 'finite';

/**
 * Int rules per qualifiers: Must be a finite integer, but is not necessarily _safe_.
 * @name rtv.types.INT
 * @const {String}
 * @see {@link rtv.qualifiers}
 * @see {@link rtv.types.FLOAT}
 * @see {@link https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/Number/isSafeInteger Number.isSafeInteger()}
 */
export var INT = 'int';

/**
 * Float rules per qualifiers: Must be a finite floating point number.
 * @name rtv.types.FLOAT
 * @const {String}
 * @see {@link rtv.qualifiers}
 * @see {@link rtv.types.INT}
 */
export var FLOAT = 'float';

/**
 * An object is anything that is not a {@link rtv.types primitive}, which means it
 *  includes the `Array` type. To test for an array, use the {@link rtv.types.ARRAY ARRAY}
 *  type instead.
 *
 * The following values are considered objects:
 *
 * - `{}`
 * - `[]`
 * - `function(){}`
 * - `arguments` (function arguments)
 * - `new Object()`
 * - `new String('')`
 * - `new Boolean(true)`
 * - `new Number(1)`
 * - `new RegExp('r')`
 * - `new function() {}`
 * - `new Set()`
 * - `new WeakSet()`
 * - `new Map()`
 * - `new WeakMap()`
 *
 * The following values __are not__ considered objects (because they are considered
 *  {@link rtv.types primitives}):
 *
 * - `Symbol('s')`
 * - `true`
 * - `1`
 * - `''`
 * - `null` (NOTE: `typeof null === 'object'` in JavaScript; the OBJECT type
 *   allows testing for this undesirable fact)
 * - `undefined`
 *
 * Object rules per qualifiers:
 *
 * - REQUIRED: Per the lists above.
 * - EXPECTED: `null` is allowed.
 * - OPTIONAL: `undefined` is allowed.
 *
 * @name rtv.types.OBJECT
 * @const {String}
 * @see {@link rtv.qualifiers}
 * @see {@link rtv.types.EXT_OBJECT}
 * @see {@link rtv.types.PLAIN_OBJECT}
 * @see {@link rtv.types.CLASS_OBJECT}
 * @see {@link rtv.types.MAP_OBJECT}
 */
export var OBJECT = 'object';

export var EXT_OBJECT = 'extendedObject';
export var PLAIN_OBJECT = 'plainObject';
export var CLASS_OBJECT = 'classObject';
export var MAP_OBJECT = 'mapObject'; // TODO: useful? same as PLAIN_OBJECT?

export var ARRAY = 'array';
export var JSON = 'json';
export var FUNCTION = 'function';
export var REGEXP = 'regexp';
export var DATE = 'date';
export var ERROR = 'error';

// TODO: useful? var ENUM = 'enum';
// TODO: useful? var PROPERTY = 'property'; -- yes, good for 'any' type, perhaps use 'ANY'?
// TODO: Add types for ES6 types: Weak/Map, Weak/Set
