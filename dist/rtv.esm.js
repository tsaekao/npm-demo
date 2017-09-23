/*!
 * rtv 0.0.1
 * @license MIT, https://gitlab.com/stefcameron/rtvjs/blob/master/LICENSE.md
 * Parts of Lodash used internally: https://github.com/lodash/lodash/
 */
/** Detect free variable `global` from Node.js. */
var freeGlobal = typeof global == 'object' && global && global.Object === Object && global;

/** Detect free variable `self`. */
var freeSelf = typeof self == 'object' && self && self.Object === Object && self;

/** Used as a reference to the global object. */
var root = freeGlobal || freeSelf || Function('return this')();

/** Built-in value references. */
var Symbol = root.Symbol;

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
var symToStringTag$1 = Symbol ? Symbol.toStringTag : undefined;

/**
 * A specialized version of `baseGetTag` which ignores `Symbol.toStringTag` values.
 *
 * @private
 * @param {*} value The value to query.
 * @returns {string} Returns the raw `toStringTag`.
 */
function getRawTag(value) {
  var isOwn = hasOwnProperty.call(value, symToStringTag$1),
      tag = value[symToStringTag$1];

  try {
    value[symToStringTag$1] = undefined;
    var unmasked = true;
  } catch (e) {}

  var result = nativeObjectToString.call(value);
  if (unmasked) {
    if (isOwn) {
      value[symToStringTag$1] = tag;
    } else {
      delete value[symToStringTag$1];
    }
  }
  return result;
}

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

/** `Object#toString` result references. */
var nullTag = '[object Null]';
var undefinedTag = '[object Undefined]';

/** Built-in value references. */
var symToStringTag = Symbol ? Symbol.toStringTag : undefined;

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
  return (symToStringTag && symToStringTag in Object(value))
    ? getRawTag(value)
    : objectToString(value);
}

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
    (!isArray(value) && isObjectLike(value) && baseGetTag(value) == stringTag);
}

var version = "0.0.1";

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
var STRING = 'string';

/**
 * Boolean rules per qualifiers: Must be a boolean.
 * @name types.BOOLEAN
 * @const {String}
 * @see {@link qualifiers}
 */
var BOOLEAN = 'boolean';

/**
 * Number rules per qualifiers:
 * - REQUIRED: Cannot be `NaN`, but could be `+Infinity`, `-Infinity`.
 * - EXPECTED | OPTIONAL: Could be `NaN`, `+Infinity`, `-Infinity`.
 * @name types.NUMBER
 * @const {String}
 * @see {@link qualifiers}
 * @see {@link types.FINITE}
 */
var NUMBER = 'number';

/**
 * Finite rules per qualifiers: Cannot be `NaN`, `+Infinity`, `-Infinity`.
 * @name types.FINITE
 * @const {String}
 * @see {@link qualifiers}
 * @see {@link types.NUMBER}
 */
var FINITE = 'finite';

/**
 * Int rules per qualifiers: Must be a finite integer, but is not necessarily _safe_.
 * @name types.INT
 * @const {String}
 * @see {@link qualifiers}
 * @see {@link types.FLOAT}
 * @see {@link https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/Number/isSafeInteger Number.isSafeInteger()}
 */
var INT = 'int';

/**
 * Float rules per qualifiers: Must be a finite floating point number.
 * @name types.FLOAT
 * @const {String}
 * @see {@link qualifiers}
 * @see {@link types.INT}
 */
var FLOAT = 'float';

var OBJECT = 'object';
var EXT_OBJECT = 'extendedObject';
var PLAIN_OBJECT = 'plainObject';
var CLASS_OBJECT = 'classObject';
var OBJECT_MAP = 'objectMap';

var ARRAY = 'array';
var JSON = 'json';
var FUNCTION = 'function';
var REGEXP = 'regexp';
var DATE = 'date';
var ERROR = 'error';

// TODO: useful? var ENUM = 'enum';
// TODO: useful? var PROPERTY = 'property'; -- yes, good for 'any' type, perhaps use 'ANY'?
// TODO: Add types for ES6 types: Symbol, Weak/Map, Weak/Set


var typeMap = Object.freeze({
	STRING: STRING,
	BOOLEAN: BOOLEAN,
	NUMBER: NUMBER,
	FINITE: FINITE,
	INT: INT,
	FLOAT: FLOAT,
	OBJECT: OBJECT,
	EXT_OBJECT: EXT_OBJECT,
	PLAIN_OBJECT: PLAIN_OBJECT,
	CLASS_OBJECT: CLASS_OBJECT,
	OBJECT_MAP: OBJECT_MAP,
	ARRAY: ARRAY,
	JSON: JSON,
	FUNCTION: FUNCTION,
	REGEXP: REGEXP,
	DATE: DATE,
	ERROR: ERROR
});

//// Qualifier Definitions \\\\

'use strict';

/**
 * @namespace qualifiers
 */

/**
 * Required qualifier: Property _must_ exist and be of the expected type.
 *  Depending on the type, additional requirements may be enforced.
 *
 * See specific type for additional rules.
 *
 * @name qualifiers.REQUIRED
 * @const {String}
 * @see {@link types}
 */
var REQUIRED = '!';

/**
 * Expected qualifier: Property _should_ exist and be of the expected type.
 *  Depending on the type, some requirements may not be enforced.
 *
 * In general, an expected property must be defined, but could be `null`.
 *
 * See specific type for additional rules.
 *
 * @name qualifiers.EXPECTED
 * @const {String}
 * @see {@link types}
 */
var EXPECTED = '+';

/**
 * Optional qualifier: Property _may_ exist and be of the expected type.
 *  Depending on the type, some requirements may not be enforced (i.e. less so
 *  than with the `EXPECTED` qualifier).
 *
 * In general, an optional property could be `undefined` (i.e does not need to be
 *  defined). If it is defined, then it is treated as an `EXPECTED` property.
 *
 * See specific type for additional rules.
 *
 * @name qualifiers.OPTIONAL
 * @const {String}
 * @see {@link types}
 */
var OPTIONAL = '?';


var qualifierMap = Object.freeze({
	REQUIRED: REQUIRED,
	EXPECTED: EXPECTED,
	OPTIONAL: OPTIONAL
});

//// Enumeration \\\\

'use strict';

/**
 * Simple enumeration type.
 * @class Enumeration
 * @param {Object.<String,*>} map Object mapping keys to values. Values cannot
 *  be `undefined`.
 * @throws {Error} If `map` is falsy or empty.
 * @throws {Error} If `map` has a key that maps to `undefined`.
 */
var Enumeration = function(map) {
    map = map || {};

    var keys = Object.keys(map);
    var values = [];

    if (keys.length === 0) {
        throw new Error('map must contain at least one key');
    }

    // shallow-clone each key in the map into this
    keys.forEach((key) => {
        if (map[key] === undefined) {
            throw new Error('map[' + key + '] cannot be undefined');
        }

        var value = map[key];
        values.push(value);
        this[key] = value;
    });

    /**
     * [internal] List of enumeration values.
     * @name Enumeration#_values
     * @type Array.<String>
     */
    Object.defineProperty(this, '_values', {
        enumerable: false, // internal
        configurable: true,
        value: values
    });
};

/**
 * Validates a value as being in this enumeration. Throws an exception if the value
 *  is not in this enumeration, unless `silent` is true.
 * @method Enumeration#validate
 * @param {*} value Value to check. Cannot be undefined.
 * @param {Boolean} [silent=false] If truthy, returns `undefined` instead of throwing
 *  an exception if the specified value is not in this enumeration.
 * @returns {*} The specified value if it is in this enumeration, or `undefined` if
 *  `silent` is true and the value is not in this enumeration.
 */
Enumeration.prototype.validate = function(value, silent) {
    if (this._values.indexOf(value) >= 0) {
        return value;
    } else if (silent) {
        return undefined;
    } else {
        throw new Error('invalid value for enum[' + this._values.join(', ') + ']: ' + value);
    }
};

//// Main entry point \\\\

'use strict';

var types = new Enumeration(typeMap);
var qualifiers = new Enumeration(qualifierMap);

var rtv = {
  _version: version,

  check: function(value) {
    return isString(value) && !!value;
  },
  verify: function(value) {
    if (this.config.enabled) {
      if (!this.check(value)) {
        throw new Error('value must be a ' + types.STRING + ': ' + value);
      }
    }
  },

  config: {
    enabled: true
  },

  Context: function(context) {
    // TODO: a version with same API (less 'config') that will include 'context' in errors thrown
  }
};

export default rtv;
//# sourceMappingURL=rtv.esm.js.map
