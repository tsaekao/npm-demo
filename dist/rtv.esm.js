/*!
* rtvjs 0.0.1
* @license MIT, https://gitlab.com/stefcameron/rtvjs/blob/master/LICENSE.md
* Parts of Lodash used internally: https://github.com/lodash/lodash/
*/
var version = "0.0.1";

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

var commonjsGlobal = typeof window !== 'undefined' ? window : typeof global !== 'undefined' ? global : typeof self !== 'undefined' ? self : {};

function createCommonjsModule(fn, module) {
	return module = { exports: {} }, fn(module, module.exports), module.exports;
}

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

/**
 * Checks if `value` is the
 * [language type](http://www.ecma-international.org/ecma-262/7.0/#sec-ecmascript-language-types)
 * of `Object`. (e.g. arrays, functions, objects, regexes, `new Number(0)`, and `new String('')`)
 *
 * @static
 * @memberOf _
 * @since 0.1.0
 * @category Lang
 * @param {*} value The value to check.
 * @returns {boolean} Returns `true` if `value` is an object, else `false`.
 * @example
 *
 * _.isObject({});
 * // => true
 *
 * _.isObject([1, 2, 3]);
 * // => true
 *
 * _.isObject(_.noop);
 * // => true
 *
 * _.isObject(null);
 * // => false
 */
function isObject(value) {
  var type = typeof value;
  return value != null && (type == 'object' || type == 'function');
}

var isObject_1 = isObject;

/** `Object#toString` result references. */
var asyncTag = '[object AsyncFunction]',
    funcTag = '[object Function]',
    genTag = '[object GeneratorFunction]',
    proxyTag = '[object Proxy]';

/**
 * Checks if `value` is classified as a `Function` object.
 *
 * @static
 * @memberOf _
 * @since 0.1.0
 * @category Lang
 * @param {*} value The value to check.
 * @returns {boolean} Returns `true` if `value` is a function, else `false`.
 * @example
 *
 * _.isFunction(_);
 * // => true
 *
 * _.isFunction(/abc/);
 * // => false
 */
function isFunction(value) {
  if (!isObject_1(value)) {
    return false;
  }
  // The use of `Object#toString` avoids issues with the `typeof` operator
  // in Safari 9 which returns 'object' for typed arrays and other constructors.
  var tag = _baseGetTag(value);
  return tag == funcTag || tag == genTag || tag == asyncTag || tag == proxyTag;
}

var isFunction_1 = isFunction;

/** Used to detect overreaching core-js shims. */
var coreJsData = _root['__core-js_shared__'];

var _coreJsData = coreJsData;

/** Used to detect methods masquerading as native. */
var maskSrcKey = (function() {
  var uid = /[^.]+$/.exec(_coreJsData && _coreJsData.keys && _coreJsData.keys.IE_PROTO || '');
  return uid ? ('Symbol(src)_1.' + uid) : '';
}());

/**
 * Checks if `func` has its source masked.
 *
 * @private
 * @param {Function} func The function to check.
 * @returns {boolean} Returns `true` if `func` is masked, else `false`.
 */
function isMasked(func) {
  return !!maskSrcKey && (maskSrcKey in func);
}

var _isMasked = isMasked;

/** Used for built-in method references. */
var funcProto = Function.prototype;

/** Used to resolve the decompiled source of functions. */
var funcToString = funcProto.toString;

/**
 * Converts `func` to its source code.
 *
 * @private
 * @param {Function} func The function to convert.
 * @returns {string} Returns the source code.
 */
function toSource(func) {
  if (func != null) {
    try {
      return funcToString.call(func);
    } catch (e) {}
    try {
      return (func + '');
    } catch (e) {}
  }
  return '';
}

var _toSource = toSource;

/**
 * Used to match `RegExp`
 * [syntax characters](http://ecma-international.org/ecma-262/7.0/#sec-patterns).
 */
var reRegExpChar = /[\\^$.*+?()[\]{}|]/g;

/** Used to detect host constructors (Safari). */
var reIsHostCtor = /^\[object .+?Constructor\]$/;

/** Used for built-in method references. */
var funcProto$1 = Function.prototype,
    objectProto$2 = Object.prototype;

/** Used to resolve the decompiled source of functions. */
var funcToString$1 = funcProto$1.toString;

/** Used to check objects for own properties. */
var hasOwnProperty$1 = objectProto$2.hasOwnProperty;

/** Used to detect if a method is native. */
var reIsNative = RegExp('^' +
  funcToString$1.call(hasOwnProperty$1).replace(reRegExpChar, '\\$&')
  .replace(/hasOwnProperty|(function).*?(?=\\\()| for .+?(?=\\\])/g, '$1.*?') + '$'
);

/**
 * The base implementation of `_.isNative` without bad shim checks.
 *
 * @private
 * @param {*} value The value to check.
 * @returns {boolean} Returns `true` if `value` is a native function,
 *  else `false`.
 */
function baseIsNative(value) {
  if (!isObject_1(value) || _isMasked(value)) {
    return false;
  }
  var pattern = isFunction_1(value) ? reIsNative : reIsHostCtor;
  return pattern.test(_toSource(value));
}

var _baseIsNative = baseIsNative;

/**
 * Gets the value at `key` of `object`.
 *
 * @private
 * @param {Object} [object] The object to query.
 * @param {string} key The key of the property to get.
 * @returns {*} Returns the property value.
 */
function getValue(object, key) {
  return object == null ? undefined : object[key];
}

var _getValue = getValue;

/**
 * Gets the native function at `key` of `object`.
 *
 * @private
 * @param {Object} object The object to query.
 * @param {string} key The key of the method to get.
 * @returns {*} Returns the function if it's native, else `undefined`.
 */
function getNative(object, key) {
  var value = _getValue(object, key);
  return _baseIsNative(value) ? value : undefined;
}

var _getNative = getNative;

/* Built-in method references that are verified to be native. */
var DataView = _getNative(_root, 'DataView');

var _DataView = DataView;

/* Built-in method references that are verified to be native. */
var Map = _getNative(_root, 'Map');

var _Map = Map;

/* Built-in method references that are verified to be native. */
var Promise$1 = _getNative(_root, 'Promise');

var _Promise = Promise$1;

/* Built-in method references that are verified to be native. */
var Set = _getNative(_root, 'Set');

var _Set = Set;

/* Built-in method references that are verified to be native. */
var WeakMap = _getNative(_root, 'WeakMap');

var _WeakMap = WeakMap;

/** `Object#toString` result references. */
var mapTag = '[object Map]',
    objectTag = '[object Object]',
    promiseTag = '[object Promise]',
    setTag = '[object Set]',
    weakMapTag = '[object WeakMap]';

var dataViewTag = '[object DataView]';

/** Used to detect maps, sets, and weakmaps. */
var dataViewCtorString = _toSource(_DataView),
    mapCtorString = _toSource(_Map),
    promiseCtorString = _toSource(_Promise),
    setCtorString = _toSource(_Set),
    weakMapCtorString = _toSource(_WeakMap);

/**
 * Gets the `toStringTag` of `value`.
 *
 * @private
 * @param {*} value The value to query.
 * @returns {string} Returns the `toStringTag`.
 */
var getTag = _baseGetTag;

// Fallback for data views, maps, sets, and weak maps in IE 11 and promises in Node.js < 6.
if ((_DataView && getTag(new _DataView(new ArrayBuffer(1))) != dataViewTag) ||
    (_Map && getTag(new _Map) != mapTag) ||
    (_Promise && getTag(_Promise.resolve()) != promiseTag) ||
    (_Set && getTag(new _Set) != setTag) ||
    (_WeakMap && getTag(new _WeakMap) != weakMapTag)) {
  getTag = function(value) {
    var result = _baseGetTag(value),
        Ctor = result == objectTag ? value.constructor : undefined,
        ctorString = Ctor ? _toSource(Ctor) : '';

    if (ctorString) {
      switch (ctorString) {
        case dataViewCtorString: return dataViewTag;
        case mapCtorString: return mapTag;
        case promiseCtorString: return promiseTag;
        case setCtorString: return setTag;
        case weakMapCtorString: return weakMapTag;
      }
    }
    return result;
  };
}

/**
 * The base implementation of `_.unary` without support for storing metadata.
 *
 * @private
 * @param {Function} func The function to cap arguments for.
 * @returns {Function} Returns the new capped function.
 */

var _nodeUtil = createCommonjsModule(function (module, exports) {
/** Detect free variable `exports`. */
var freeExports = 'object' == 'object' && exports && !exports.nodeType && exports;

/** Detect free variable `module`. */
var freeModule = freeExports && 'object' == 'object' && module && !module.nodeType && module;

/** Detect the popular CommonJS extension `module.exports`. */
var moduleExports = freeModule && freeModule.exports === freeExports;

/** Detect free variable `process` from Node.js. */
var freeProcess = moduleExports && _freeGlobal.process;

/** Used to access faster Node.js helpers. */
var nodeUtil = (function() {
  try {
    return freeProcess && freeProcess.binding && freeProcess.binding('util');
  } catch (e) {}
}());

module.exports = nodeUtil;
});

/* Node.js helper references. */
var nodeIsMap = _nodeUtil && _nodeUtil.isMap;

/* Node.js helper references. */
var nodeIsSet = _nodeUtil && _nodeUtil.isSet;

/* Node.js helper references. */
var nodeIsRegExp = _nodeUtil && _nodeUtil.isRegExp;

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
 * Simple enumeration type. Own-properties on an instance are the keys in the
 *  specified `map`, with their associated values.
 *
 * <pre><code>const state = new Enumeration({
 *   READY: 1,
 *   RUNNING: 2,
 *   STOPPED: 3,
 *   COMPLETE: 4
 * });
 *
 * state.RUNNING; // 2
 * state.verify(3); // 3 (returns the value since found in enumeration)
 * state.verify(5); // ERROR thrown
 * state.check(3); // 3 (same as verify(3) since found in enumeration)
 * state.check(5); // undefined (silent failure)
 * state.$values; // [1, 2, 3, 4] (special non-enumerable own-property)
 * </code></pre>
 *
 * @class rtvref.Enumeration
 * @param {Object.<String,*>} map Object mapping keys to values. Values cannot
 *  be `undefined`.
 * @throws {Error} If `map` is falsy or empty.
 * @throws {Error} If `map` has a key that maps to `undefined`.
 * @throws {Error} If `map` contains a duplicate value.
 */
var Enumeration = function () {
  // JSDoc is provided at the @class level
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
      if (values.indexOf(value) >= 0) {
        throw new Error('map[' + key + '] is a duplicate value: ' + value);
      }

      values.push(value);
      _this[key] = value;
    });

    /**
     * List of enumeration values. Values are _references_ to values in this
     *  enumeration.
     *
     * Note that this own-property is non-enumerable on purpose. Enumerable
     *  properties on this instance are the keys in this enumeration.
     *
     * @readonly
     * @name rtvref.Enumeration#$values
     * @type Array.<String>
     */
    Object.defineProperty(this, '$values', {
      enumerable: false,
      configurable: true,
      get: function get$$1() {
        return values.concat(); // shallow clone
      }
    });
  }

  /**
   * Checks if a value is in this enumeration.
   * @method rtvref.Enumeration#check
   * @param {*} value Value to check. Cannot be undefined.
   * @returns {(*|undefined)} The specified value if it is in this enumeration, or `undefined`
   *  if not. An exception is __not__ thrown if the value is not in this enumeration.
   * @see {@link rtvref.Enumeration#verify}
   */


  createClass(Enumeration, [{
    key: 'check',
    value: function check(value) {
      if (this.$values.indexOf(value) >= 0) {
        return value;
      }

      return undefined;
    }

    /**
     * Validates a value as being in this enumeration. Throws an exception if the value
     *  is not in this enumeration, unless `silent` is true.
     * @method rtvref.Enumeration#verify
     * @param {*} value Value to check. Cannot be undefined.
     * @param {boolean} [silent=false] If truthy, returns `undefined` instead of throwing
     *  an exception if the specified value is not in this enumeration.
     * @returns {*} The specified value if it is in this enumeration, or `undefined` if
     *  `silent` is true and the value is not in this enumeration.
     * @throws {Error} If not `silent` and the value is not in this enumeration.
     * @see {@link rtvref.Enumeration#check}
     */

  }, {
    key: 'verify',
    value: function verify(value, silent) {
      var result = this.check(value);

      if (result === undefined && !silent) {
        throw new Error('Invalid value for enum[' + this.$values.join(', ') + ']: ' + value);
      }

      return result;
    }

    /**
     * A string representation of this Enumeration.
     * @method rtvref.Enumeration#toString
     * @returns {string} String representation.
     */

  }, {
    key: 'toString',
    value: function toString() {
      var _this2 = this;

      var pairs = Object.keys(this).map(function (k) {
        return [k, _this2[k]];
      });
      return '{rtvref.Enumeration pairs=[' + pairs.map(function (p) {
        return '[' + p + ']';
      }).join(', ') + ']}';
    }
  }]);
  return Enumeration;
}();

//// Type Definitions \\\\

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
var ANY = 'any';

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
var STRING = 'string';

/**
 * Boolean rules per qualifiers: Must be a boolean {@link rtvref.types.primitives primitive}.
 *  `new Boolean(true) !== true` because the former is an _object_, not a boolean.
 *
 * @name rtvref.types.BOOLEAN
 * @const {string}
 * @see {@link rtvref.qualifiers}
 */
var BOOLEAN = 'boolean';

/**
 * Symbol rules per qualifiers: Must be a symbol {@link rtvref.types.primitives primitive}.
 * @name rtvref.types.SYMBOL
 * @const {string}
 * @see {@link rtvref.qualifiers}
 */
var SYMBOL = 'symbol';

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
var NUMBER = 'number';

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
var FINITE = 'finite';

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
var INT = 'int';

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
var FLOAT = 'float';

/**
 * Function rules per qualifiers: Must be a `function`.
 * @name rtvref.types.FUNCTION
 * @const {string}
 * @see {@link rtvref.qualifiers}
 */
var FUNCTION = 'function';

/**
 * RegExp rules per qualifiers: Must be a `RegExp` instance.
 * @name rtvref.types.REGEXP
 * @const {string}
 * @see {@link rtvref.qualifiers}
 * @see https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/RegExp
 */
var REGEXP = 'regexp';

/**
 * Date rules per qualifiers: Must be a `Date` instance.
 * @name rtvref.types.DATE
 * @const {string}
 * @see {@link rtvref.qualifiers}
 * @see https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/Date
 */
var DATE = 'date';

/**
 * Error rules per qualifiers: Must be an `Error` instance.
 * @name rtvref.types.ERROR
 * @const {string}
 * @see {@link rtvref.qualifiers}
 * @see https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/Error
 */
var ERROR = 'error';

/**
 * Promise rules per qualifiers: Must be a `Promise` instance.
 * @name rtvref.types.PROMISE
 * @const {string}
 * @see {@link rtvref.qualifiers}
 * @see https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/Promise
 */
var PROMISE = 'promise';

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
var ARRAY = 'array';

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
var ANY_OBJECT = 'anyObject';

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
var PLAIN_OBJECT = 'plainObject';

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
var CLASS_OBJECT = 'classObject';

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
var MAP_OBJECT = 'mapObject';

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
var JSON$1 = 'json';

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
var MAP = 'map';

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
var WEAK_MAP = 'weakMap';

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
var SET = 'set';

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
var WEAK_SET = 'weakSet';

//
// ^^^^^^^ INSERT NEW TYPES ^^^^^^^ ABOVE THIS SECTION ^^^^^^^
//

/**
 * Enumeration (`string -> string`) of {@link rtvref.types types}.
 * @name rtvref.types.types
 * @type {rtvref.Enumeration}
 */
var types = new Enumeration({
  ANY: ANY,
  STRING: STRING,
  BOOLEAN: BOOLEAN,
  SYMBOL: SYMBOL,
  NUMBER: NUMBER,
  FINITE: FINITE,
  INT: INT,
  FLOAT: FLOAT,
  FUNCTION: FUNCTION,
  REGEXP: REGEXP,
  DATE: DATE,
  ERROR: ERROR,
  PROMISE: PROMISE,
  ARRAY: ARRAY,
  ANY_OBJECT: ANY_OBJECT,
  OBJECT: OBJECT,
  PLAIN_OBJECT: PLAIN_OBJECT,
  CLASS_OBJECT: CLASS_OBJECT,
  MAP_OBJECT: MAP_OBJECT,
  JSON: JSON$1,
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
 * @const {string}
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
 * @const {string}
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
 * @const {string}
 * @see {@link rtvref.types}
 */
var OPTIONAL = '?';

//
// ^^^^^^^ INSERT NEW TYPES ^^^^^^^ ABOVE THIS SECTION ^^^^^^^
//

/**
 * Enumeration (`string -> string`) of {@link rtvref.qualifiers qualifiers}.
 * @name rtvref.qualifiers.qualifiers
 * @type {rtvref.Enumeration}
 */
var qualifiers = new Enumeration({
  REQUIRED: REQUIRED,
  EXPECTED: EXPECTED,
  OPTIONAL: OPTIONAL
});

//// Validation Module \\\\

/**
 * Determines if a value is a string literal __only__ (i.e. a
 *  {@link rtvref.types.primitives primitive}). It does not validate
 *  `new String('value')`, which is an object that is a string.
 * @function rtv.validation.isString
 * @param {*} v Value to validate.
 * @param {boolean} [emptyOK=false] If truthy, an empty string is allowed.
 * @returns {boolean} `true` if it is; `false` otherwise.
 * @see {@link rtvref.types.STRING}
 */
var isString = function isString(v, emptyOK) {
  return !!(typeof v === 'string' && (emptyOK || v));
};

/**
 * Determines if a value is a boolean literal __only__ (i.e. a
 *  {@link rtvref.types.primitives primitive}). It does not validate
 *  `new Boolean(true)`, which is an object that is a boolean.
 * @function rtv.validation.isBoolean
 * @param {*} v Value to validate.
 * @returns {boolean} `true` if it is; `false` otherwise.
 * @see {@link rtvref.types.BOOLEAN}
 */
var isBoolean = function isBoolean(v) {
  return v === true || v === false;
};

//// Utilities \\\\

//// RtvSuccess Class \\\\

/**
 * Runtime Verification Success Indicator
 *
 * Describes a successful runtime verification of a value against a given
 *  {@link rtvref.shape_descriptor shape} or {@link rtvref.types.typeset typeset}
 *  (note that a shape is a type of typeset).
 *
 * @class rtvref.RtvSuccess
 */
var RtvSuccess = function () {
  // JSDoc is provided at the @class level
  function RtvSuccess() {
    classCallCheck(this, RtvSuccess);

    Object.defineProperties(this, {
      /**
       * Flag indicating the validation succeeded. Always `true`.
       * @readonly
       * @name rtvref.RtvSuccess#valid
       * @type {boolean}
       */
      valid: {
        enumerable: true,
        configurable: true,
        value: true
      }
    });
  }

  /**
   * A string representation of this instance.
   * @method rtvref.RtvSuccess#toString
   * @returns {string} String representation.
   */


  createClass(RtvSuccess, [{
    key: 'toString',
    value: function toString() {
      return '{rtvref.RtvSuccess}';
    }
  }]);
  return RtvSuccess;
}();

//// Main Implementation Module \\\\

/**
 * Checks a value against a simple type.
 * @function rtv.impl.checkSimple
 * @param {*} value Value to check.
 * @param {string} typeset Simple typeset name, must be one of {@link rtvref.types.types}.
 * @returns {(rtvref.RtvSuccess|rtvref.RtvError)} A success indicator if the
 *  `value` is compliant to the type; an error indicator if not.
 * @throws {Error} If `typeset` is not a valid type name.
 * @see {@link rtvref.types}
 */
var checkSimple = function checkSimple(value, typeset) {
  types.verify(typeset);

  var valid = false;
  if (typeset === types.STRING) {
    valid = isString(value);
  } else if (typeset === types.BOOLEAN) {
    valid = isBoolean(value);
  } else {
    throw new Error('Missing handler for \'' + typeset + '\' type');
  }

  if (valid) {
    return new RtvSuccess();
  }

  // TODO return RtvError if fails
};

/**
 * Checks a value against a shape/typeset.
 * @function rtv.impl.check
 * @param {*} value Value to check.
 * @param {rtvref.types.typeset} typeset Expected shape/type of the value.
 * @returns {(rtvref.RtvSuccess|rtvref.RtvError)} Success indicator if the `value`
 *  is compliant to the `typeset`; error indicator otherwise. An exception is
 *  __not__ thrown if the `value` is non-compliant.
 * @throws {Error} If `typeset` is not a valid typeset.
 * @see {@link rtvref.types.typeset}
 * @see {@link rtvref.shape_descriptor}
 */
var check = function check(value, typeset) {
  // TODO: on check failure (with a valid typeset), return a special RtvError object that
  //  contains extra properties to indicate what didn't match, what was expected,
  //  the shape that was checked, the value that was checked, etc.
  //  If check succeeds, return boolean `true`. rtv.check/verify can then test
  //  for the return type since impl shouldn't be exposed externally anyway.
  try {
    if (isString(typeset)) {
      return checkSimple(value, typeset);
    }
  } catch (checkErr) {
    var err = new Error('Cannot check value: shape is not a valid typeset -- rootCause: ' + checkErr.message);
    err.rootCause = checkErr;
    throw err;
  }
};

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
 * Describes the shape (i.e. interface) of an object as a map of properties to
 *  {@link rtvref.types.typeset typesets}. Each typeset indicates whether the
 *  property is required, expected, or optional, using {@link rtvref.qualifiers qualifiers},
 *  along with possible types.
 *
 * When a value is {@link rtv.check checked} or {@link rtv.verify verified} against
 *  a given shape, properties that are not part of the shape are ignored. If
 *  successfully checked/verified, the value is guaranteed to provide the properties
 *  described in the shape, and each property is guaranteed to be assigned to a
 *  value of at least one type described in each property's typeset.
 *
 * @typedef {Object} rtvref.shape_descriptor
 */

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
   * @type {rtvref.Enumeration.<String,String>}
   */
  t: types,

  /**
   * Enumeration of {@link rtvref.qualifiers qualifiers}.
   * @name rtv.q
   * @type {rtvref.Enumeration.<String,String>}
   */
  q: qualifiers,

  /**
   * Checks a value against a typeset for compliance.
   * @function rtv.check
   * @param {*} value Value to check.
   * @param {rtvref.types.typeset} typeset Expected shape of (or typeset describing)
   *  the `value`. A shape is a kind of typeset. Normally, this is a
   *  {@link rtvref.shape_descriptor shape descriptor}.
   * @returns {(rtvref.RtvSuccess|rtvref.RtvError)} Success indicator if the
   *  `value` is compliant to the `shape`; `RtvError` if not. __Unlike
   *  {@link rtv.verify verify()}, an exception is not thrown__ if the
   *  `value` is non-compliant.
   *
   *  Since both {@link rtvref.RtvSuccess RtvSuccess}, returned when
   *   the check succeeds, as well as {@link rtvref.RtvError RtvError}, returned
   *   when the check fails, have a `valid: boolean` property in common, it's
   *   easy to test for success/failure like this:
   *   `if (rtv.check(2, rtv.t.FINITE).valid) {...}`.
   *
   *  __NOTE:__ This method always returns a success indicator if RTV.js is currently
   *   {@link rtv.config.enabled disabled}.
   *
   * @throws {Error} If `typeset` is not a valid typeset.
   * @see {@link rtv.verify}
   * @see {@link rtv.config.enabled}
   * @see {@link rtvref.types}
   * @see {@link rtvref.shape_descriptor}
   */
  check: function check$$1(value, typeset) {
    if (this.config.enabled) {
      return check(value, typeset);
    }

    return new RtvSuccess();
  },


  /**
   * Shortcut proxy to {@link rtv.check}.
   * @function rtv.c
   * @param {*} value Value to check.
   * @param {rtvref.types.typeset} typeset Expected shape of (or typeset describing)
   *  the `value`. A shape is a kind of typeset. Normally, this is a
   *  {@link rtvref.shape_descriptor shape descriptor}.
   * @returns {(rtvref.RtvSuccess|rtvref.RtvError)} Success indicator if the
   *  `value` is compliant to the `shape`; `RtvError` if not. __Unlike
   *  {@link rtv.verify verify()}, an exception is not thrown__ if the
   *  `value` is non-compliant.
   * @throws {Error} If `typeset` is not a valid typeset.
   * @see {@link rtv.check}
   */
  c: function c(value, typeset) {
    return this.check(value, typeset);
  },


  /**
   * __Requires__ a value to be compliant to a shape.
   *
   * NOTE: This method does nothing if RTV.js is currently
   *  {@link rtv.config.enabled disabled}.
   *
   * @function rtv.verify
   * @param {*} value Value to check.
   * @param {rtvref.types.typeset} typeset Expected shape of (or typeset describing)
   *  the `value`. A shape is a kind of typeset. Normally, this is a
   *  {@link rtvref.shape_descriptor shape descriptor}.
   * @returns {rtvref.RtvSuccess} Success indicator IIF the `value` is compliant
   *  to the `shape`. Otherwise, an {@link rtvref.RtvError RtvError} __is thrown__.
   * @throws {RtvError} If the `value` is not compliant to the `shape`.
   * @throws {Error} If `typeset` is not a valid typeset.
   * @see {@link rtv.check}
   * @see {@link rtv.config.enabled}
   * @see {@link rtvref.types}
   * @see {@link rtvref.shape_descriptor}
   */
  verify: function verify(value, typeset) {
    if (this.config.enabled) {
      var result = this.check(value, typeset);
      if (result instanceof RtvSuccess) {
        return result;
      }

      throw result; // expected to be an RtvError
    }

    return new RtvSuccess();
  },


  /**
   * Shortcut proxy to {@link rtv.verify}.
   * @param {*} value Value to check.
   * @param {rtvref.types.typeset} typeset Expected shape of (or typeset describing)
   *  the `value`. A shape is a kind of typeset. Normally, this is a
   *  {@link rtvref.shape_descriptor shape descriptor}.
   * @returns {rtvref.RtvSuccess} Success indicator IIF the `value` is compliant
   *  to the `shape`. Otherwise, an {@link rtvref.RtvError RtvError} __is thrown__.
   * @throws {RtvError} If the `value` is not compliant to the `shape`.
   * @see {@link rtv.verify}
   */
  v: function v(value, typeset) {
    return this.verify(value, typeset);
  },


  /**
   * RTV Library Configuration
   * @namespace rtv.config
   */
  config: Object.defineProperties({}, {
    /**
     * Globally enables or disables {@link rtv.verify} and {@link rtv.check}.
     *
     * Use this, or the shortcut {@link rtv.e}, to enable code optimization
     *  when building source with a bundler that supports _tree shaking_ like
     *  {@link https://rollupjs.org/ Rollup} or {@link https://webpack.js.org/ Webpack}.
     *
     * <h4>Example</h4>
     *
     * By conditionally calling {@link rtv.verify} based on the state of
     *  {@link rtv.config.enabled}, a bundler can be configured to completely
     *  remove the code from a production build.
     *
     * // TODO: Add Rollup and Webpack examples.
     *
     * <pre><code>if (rtv.config.enabled) {
     *  rtv.verify(jsonResult, expectedShape);
     * }
     *
     * rtv.e && rtv.v(jsonResult, expectedShape); // even shorter
     * </code></pre>
     *
     * @name rtv.config.enabled
     * @type {boolean}
     * @see {@link rtv.enabled}
     */
    enabled: function () {
      var value = true;
      return {
        enumerable: true,
        configurable: true,
        get: function get() {
          return value;
        },
        set: function set(newValue) {
          rtv.verify(newValue, rtv.t.BOOLEAN);
          value = newValue;
        }
      };
    }()
  }),

  /**
   * Shortcut proxy for reading {@link rtv.config.enabled}.
   * @readonly
   * @name rtv.e
   * @type {boolean}
   */
  get e() {
    return this.config.enabled;
  },

  /**
   * Contextual RTV Generator // TODO[docs]
   * @function rtv.Context
   * @param {string} context
   */
  Context: function Context(context) {
    // TODO: a version with same API (less 'config') that will include 'context' in errors thrown
  }
};

/**
 * [internal] Library version.
 * @name rtv._version
 * @type {string}
 */
Object.defineProperty(rtv, '_version', {
  enumerable: false, // internal
  configurable: true,
  value: version
});

export default rtv;
//# sourceMappingURL=rtv.esm.js.map
