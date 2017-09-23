//// Type Definitions \\\\

'use strict';

/**
 * @namespace types
 */

/**
 * String rules per qualifiers:
 * - REQUIRED: Must be a non-empty string.
 * - EXPECTED | OPTIONAL: Can be an empty string.
 * @name types.STRING
 * @const {String}
 * @see {@link qualifiers}
 */
export var STRING = 'string';

/**
 * Boolean rules per qualifiers: Must be a boolean.
 * @name types.BOOLEAN
 * @const {String}
 * @see {@link qualifiers}
 */
export var BOOLEAN = 'boolean';

/**
 * Number rules per qualifiers:
 * - REQUIRED: Cannot be `NaN`, but could be `+Infinity`, `-Infinity`.
 * - EXPECTED | OPTIONAL: Could be `NaN`, `+Infinity`, `-Infinity`.
 * @name types.NUMBER
 * @const {String}
 * @see {@link qualifiers}
 * @see {@link types.FINITE}
 */
export var NUMBER = 'number';

/**
 * Finite rules per qualifiers: Cannot be `NaN`, `+Infinity`, `-Infinity`.
 * @name types.FINITE
 * @const {String}
 * @see {@link qualifiers}
 * @see {@link types.NUMBER}
 */
export var FINITE = 'finite';

/**
 * Int rules per qualifiers: Must be a finite integer, but is not necessarily _safe_.
 * @name types.INT
 * @const {String}
 * @see {@link qualifiers}
 * @see {@link types.FLOAT}
 * @see {@link https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/Number/isSafeInteger Number.isSafeInteger()}
 */
export var INT = 'int';

/**
 * Float rules per qualifiers: Must be a finite floating point number.
 * @name types.FLOAT
 * @const {String}
 * @see {@link qualifiers}
 * @see {@link types.INT}
 */
export var FLOAT = 'float';

export var OBJECT = 'object';
export var EXT_OBJECT = 'extendedObject';
export var PLAIN_OBJECT = 'plainObject';
export var CLASS_OBJECT = 'classObject';
export var OBJECT_MAP = 'objectMap';

export var ARRAY = 'array';
export var JSON = 'json';
export var FUNCTION = 'function';
export var REGEXP = 'regexp';
export var DATE = 'date';
export var ERROR = 'error';

// TODO: useful? var ENUM = 'enum';
// TODO: useful? var PROPERTY = 'property'; -- yes, good for 'any' type, perhaps use 'ANY'?
// TODO: Add types for ES6 types: Symbol, Weak/Map, Weak/Set
