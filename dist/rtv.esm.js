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
var isArray = Array.isArray;

var isArray_1 = isArray;

var _typeof = typeof Symbol === "function" && typeof Symbol.iterator === "symbol" ? function (obj) {
  return typeof obj;
} : function (obj) {
  return obj && typeof Symbol === "function" && obj.constructor === Symbol && obj !== Symbol.prototype ? "symbol" : typeof obj;
};

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

var slicedToArray = function () {
  function sliceIterator(arr, i) {
    var _arr = [];
    var _n = true;
    var _d = false;
    var _e = undefined;

    try {
      for (var _i = arr[Symbol.iterator](), _s; !(_n = (_s = _i.next()).done); _n = true) {
        _arr.push(_s.value);

        if (i && _arr.length === i) break;
      }
    } catch (err) {
      _d = true;
      _e = err;
    } finally {
      try {
        if (!_n && _i["return"]) _i["return"]();
      } finally {
        if (_d) throw _e;
      }
    }

    return _arr;
  }

  return function (arr, i) {
    if (Array.isArray(arr)) {
      return arr;
    } else if (Symbol.iterator in Object(arr)) {
      return sliceIterator(arr, i);
    } else {
      throw new TypeError("Invalid attempt to destructure non-iterable instance");
    }
  };
}();

////// Utilities

// NOTE: Ideally, this module has no dependencies. If it must, they should be
//  third-party/external dependencies to avoid circular dependencies within
//  this library.

/**
 * RTV Utilities Module
 * @private
 * @namespace rtv.util
 */

/**
 * Pretty-print a value.
 * @function rtv.util.print
 * @param {*} printValue Value to print.
 * @returns {string} Pretty-printed value. It's not perfect and may not catch
 *  all types, but attempts to be good enough.
 */
var print = function print(printValue) {
  // NOTE: key will be undefined when the replacer is called outside of the
  //  JSON.stringify() call, as well as for the first stringify() call
  var replacer = function replacer(stringifying, key, value) {
    if (value === undefined || value === null) {
      return stringifying ? value : value + '';
    }

    if (typeof value === 'string') {
      return stringifying ? value : '"' + value + '"';
    }

    if (typeof value === 'number') {
      // also catches NaN
      return stringifying ? value : '' + value;
    }

    if (typeof value === 'boolean') {
      return stringifying ? value : '' + value;
    }

    if (typeof value === 'function') {
      return '<function>';
    }

    if ((typeof value === 'undefined' ? 'undefined' : _typeof(value)) === 'symbol') {
      return value.toString();
    }

    return value; // keep stringifying since we're returning an object
  };

  var result = replacer(false, undefined, printValue);

  if (typeof result === 'string') {
    return result;
  }

  return JSON.stringify(result, replacer.bind(null, true)); // recursive
};

////// Enumeration

/**
 * Simple enumeration type. Own-properties on an instance are the keys in the
 *  specified `map`, with their associated values. Key names cannot start with
 *  "$".
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
 * @param {string} [name] Friendly name used to identify this enumeration,
 *  especially in validation error messages.
 * @throws {Error} If `map` is falsy or empty.
 * @throws {Error} If `map` has a key that maps to `undefined`.
 * @throws {Error} If `map` contains a duplicate value.
 * @throws {Error} If `map` has a key that is a restricted property (starts with
 *  "$").
 */

var Enumeration = function () {
  // JSDoc is provided at the @class level
  function Enumeration(map, name) {
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
      if (key.indexOf('$') === 0) {
        throw new Error('map key "' + key + '" cannot start with "$"');
      }

      if (map[key] === undefined) {
        throw new Error('map[' + key + '] cannot be undefined');
      }

      var value = map[key];
      if (values.indexOf(value) >= 0) {
        throw new Error('map[' + key + '] is a duplicate value: ' + print(value));
      }

      values.push(value);
      _this[key] = value;
    });

    /**
     * Friendly name (not necessarily unique among all enumeration instances)
     *  used to identify this enumeration, especially in validation error
     *  messages. Empty string if not specified during construction.
     * @readonly
     * @name rtvref.Enumeration#$name
     * @type {string}
     */
    Object.defineProperty(this, '$name', {
      enumerable: false,
      configurable: true,
      value: name || ''
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
     * @type {Array.<String>}
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
        throw new Error('Invalid value for ' + (this.$name ? print(this.$name) + ' ' : '') + 'enumeration (' + this.$values.map(print).join(', ') + '): ' + print(value));
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
      return '{rtvref.Enumeration $name=' + print(this.$name) + ' pairs=[' + pairs.map(print).join(', ') + ']}';
    }
  }]);
  return Enumeration;
}();

////// Type Definitions

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
 *  If the type is {@link rtvref.types.HASH_MAP HASH_MAP}, this argument is ignored
 *   due to the nature of its JavaScript `Object`-based implementation which
 *   requires that all keys be non-empty {@link rtvref.types.STRING strings}.
 *
 *  Applies to: {@link rtvref.types.MAP MAP}.
 *
 * @property {string} [keyExp] A string-based regular expression describing the
 *  names of keys found in the collection. By default, there are no restrictions
 *  on key names. Ignored if the key type is not {@link rtvref.types.STRING STRING},
 *  as specified in `keys` (when `keys` is applicable to the collection type).
 *
 *  For example, to require numerical keys, the following expression could be
 *   used: `"^\\d+$"`.
 *
 *  Applies to: {@link rtvref.types.HASH_MAP HASH_MAP}, {@link rtvref.types.MAP MAP}.
 *
 * @property {string} [keyFlagSpec] A string specifying any flags to use with
 *  the regular expression specified in `keyExp`. Ignored if _falsy_ or if
 *  `keyExp` is not specified. See the
 *  {@link https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/RegExp RegExp#flags}
 *  parameter for more information.
 *
 *  Applies to: {@link rtvref.types.HASH_MAP HASH_MAP}, {@link rtvref.types.MAP MAP}.
 *
 * @property {rtvref.types.typeset} [values] A typeset describing each value in
 *  the collection. If specified, all values must match this typeset (but the
 *  collection is not required to have any elements to be considered valid, unless
 *  `length` is specified). If not specified, no validation is performed on values.
 *
 *  For example, to require arrays of non-empty string values as values in the
 *   collection, the following typeset could be used: `[[types.STRING]]`.
 *
 *  Applies to: All collection types.
 *
 * @see {@link rtvref.types.HASH_MAP}
 * @see {@link rtvref.types.MAP}
 * @see {@link rtvref.types.SET}
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
var def = function def(value, hasArgs, isObject) {
  return {
    value: value,
    hasArgs: !!hasArgs,
    isObject: !!isObject
  };
};

// map of type key (string) to type definition (see def() for shape)
var defs = {
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

  // TODO[future] Consider DATE args for ranges, date values to be ISO8601 UTC strings so they are
  //  easily serializable.
  /**
   * Date rules per qualifiers: Must be a `Date` instance.
   * @name rtvref.types.DATE
   * @const {string}
   * @see {@link rtvref.qualifiers}
   * @see https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/Date
   */
  DATE: def('date'),

  /**
   * Error rules per qualifiers: Must be an `Error` instance, which includes `TypeError`,
   *  `RangeError`, `ReferenceError`, etc.
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
   * The following values __are considered__ any objects:
   *
   * - `{}`
   * - `new Object()`
   * - `new (function() {}) | new (class {})` (class instance) (also see
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
   *  {@link rtvref.types.REGEXP regular expression}, {@link rtvref.types.DATE DATE},
   *  function arguments object,
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
   * - `new (function() {}) | new (class {})` (class instance) (also see
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
   * - `new (function() {}) | new (class {})` (class instance) (also see
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
   *  property is not serializable to JSON. Ignored if not a
   *  {@link rtvref.types.FUNCTION function}.
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
   * - `new (function() {}) | new (class {})` (tip: use the `ctr`
   *   {@link rtvref.types.CLASS_OBJECT_args argument} to test for a specific class)
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
   * - {@link rtvref.types.NULL null}
   * - {@link rtvref.types.STRING string}, however __empty strings are permitted__,
   *   even if the qualifier is `REQUIRED`
   * - {@link rtvref.types.BOOLEAN boolean}
   * - {@link rtvref.types.FINITE finite number}
   * - {@link rtvref.types.PLAIN_OBJECT plain object}
   * - {@link rtvref.types.ARRAY array}
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
var DEFAULT_OBJECT_TYPE = defs.OBJECT.value;

/**
 * Enumeration (`string -> string`) of __object__ {@link rtvref.types types}. These
 *  are all the types that describe values which are essentially maps of various
 *  keys to values.
 * @name rtvref.types.objTypes
 * @type {rtvref.Enumeration}
 */
var objTypes = new Enumeration(function () {
  var types = {};
  Object.keys(defs).forEach(function (name) {
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
var argTypes = new Enumeration(function () {
  var types = {};
  Object.keys(defs).forEach(function (name) {
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
var types = new Enumeration(function () {
  var types = {};
  Object.keys(defs).forEach(function (name) {
    types[name] = defs[name].value;
  });
  return types;
}(), 'types');

////// isArray validation

/**
 * Type: {@link rtvref.types.ARRAY ARRAY}
 * @const {string} rtvref.validation.isArray.type
 */
var type = types.ARRAY;

/**
 * {@link rtvref.validation.method Validation} for the
 *  {@link rtvref.types.ARRAY ARRAY} type.
 * @function rtvref.validation.isArray.default
 * @param {*} v Value to validate.
 * @returns {boolean} `true` if validated; `false` otherwise.
 */
function isArray$1(v) {
  return isArray_1(v);
}

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

var _getTag = getTag;

/** `Object#toString` result references. */
var mapTag$1 = '[object Map]';

/**
 * The base implementation of `_.isMap` without Node.js optimizations.
 *
 * @private
 * @param {*} value The value to check.
 * @returns {boolean} Returns `true` if `value` is a map, else `false`.
 */
function baseIsMap(value) {
  return isObjectLike_1(value) && _getTag(value) == mapTag$1;
}

var _baseIsMap = baseIsMap;

/**
 * The base implementation of `_.unary` without support for storing metadata.
 *
 * @private
 * @param {Function} func The function to cap arguments for.
 * @returns {Function} Returns the new capped function.
 */
function baseUnary(func) {
  return function(value) {
    return func(value);
  };
}

var _baseUnary = baseUnary;

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

/**
 * Checks if `value` is classified as a `Map` object.
 *
 * @static
 * @memberOf _
 * @since 4.3.0
 * @category Lang
 * @param {*} value The value to check.
 * @returns {boolean} Returns `true` if `value` is a map, else `false`.
 * @example
 *
 * _.isMap(new Map);
 * // => true
 *
 * _.isMap(new WeakMap);
 * // => false
 */
var isMap = nodeIsMap ? _baseUnary(nodeIsMap) : _baseIsMap;

var isMap_1 = isMap;

////// isMap validation

/**
 * Type: {@link rtvref.types.MAP MAP}
 * @const {string} rtvref.validation.isMap.type
 */
var type$1 = types.MAP;

/**
 * {@link rtvref.validation.method Validation} for the
 *  {@link rtvref.types.MAP MAP} type.
 * @function rtvref.validation.isMap.default
 * @param {*} v Value to validate.
 * @returns {boolean} `true` if validated; `false` otherwise.
 */
function isMap$1(v) {
  return isMap_1(v);
}

/** `Object#toString` result references. */
var weakMapTag$1 = '[object WeakMap]';

/**
 * Checks if `value` is classified as a `WeakMap` object.
 *
 * @static
 * @memberOf _
 * @since 4.3.0
 * @category Lang
 * @param {*} value The value to check.
 * @returns {boolean} Returns `true` if `value` is a weak map, else `false`.
 * @example
 *
 * _.isWeakMap(new WeakMap);
 * // => true
 *
 * _.isWeakMap(new Map);
 * // => false
 */
function isWeakMap(value) {
  return isObjectLike_1(value) && _getTag(value) == weakMapTag$1;
}

var isWeakMap_1 = isWeakMap;

////// isWeakMap validation

/**
 * Type: {@link rtvref.types.WEAK_MAP WEAK_MAP}
 * @const {string} rtvref.validation.isWeakMap.type
 */
var type$2 = types.WEAK_MAP;

/**
 * {@link rtvref.validation.method Validation} for the
 *  {@link rtvref.types.WEAK_MAP WEAK_MAP} type.
 * @function rtvref.validation.isWeakMap.default
 * @param {*} v Value to validate.
 * @returns {boolean} `true` if validated; `false` otherwise.
 */
function isWeakMap$1(v) {
  return isWeakMap_1(v);
}

/** `Object#toString` result references. */
var setTag$1 = '[object Set]';

/**
 * The base implementation of `_.isSet` without Node.js optimizations.
 *
 * @private
 * @param {*} value The value to check.
 * @returns {boolean} Returns `true` if `value` is a set, else `false`.
 */
function baseIsSet(value) {
  return isObjectLike_1(value) && _getTag(value) == setTag$1;
}

var _baseIsSet = baseIsSet;

/* Node.js helper references. */
var nodeIsSet = _nodeUtil && _nodeUtil.isSet;

/**
 * Checks if `value` is classified as a `Set` object.
 *
 * @static
 * @memberOf _
 * @since 4.3.0
 * @category Lang
 * @param {*} value The value to check.
 * @returns {boolean} Returns `true` if `value` is a set, else `false`.
 * @example
 *
 * _.isSet(new Set);
 * // => true
 *
 * _.isSet(new WeakSet);
 * // => false
 */
var isSet = nodeIsSet ? _baseUnary(nodeIsSet) : _baseIsSet;

var isSet_1 = isSet;

////// isSet validation

/**
 * Type: {@link rtvref.types.SET SET}
 * @const {string} rtvref.validation.isSet.type
 */
var type$3 = types.SET;

/**
 * {@link rtvref.validation.method Validation} for the
 *  {@link rtvref.types.SET SET} type.
 * @function rtvref.validation.isSet.default
 * @param {*} v Value to validate.
 * @returns {boolean} `true` if validated; `false` otherwise.
 */
function isSet$1(v) {
  return isSet_1(v);
}

/** `Object#toString` result references. */
var weakSetTag = '[object WeakSet]';

/**
 * Checks if `value` is classified as a `WeakSet` object.
 *
 * @static
 * @memberOf _
 * @since 4.3.0
 * @category Lang
 * @param {*} value The value to check.
 * @returns {boolean} Returns `true` if `value` is a weak set, else `false`.
 * @example
 *
 * _.isWeakSet(new WeakSet);
 * // => true
 *
 * _.isWeakSet(new Set);
 * // => false
 */
function isWeakSet(value) {
  return isObjectLike_1(value) && _baseGetTag(value) == weakSetTag;
}

var isWeakSet_1 = isWeakSet;

////// isWeakSet validation

/**
 * Type: {@link rtvref.types.WEAK_SET WEAK_SET}
 * @const {string} rtvref.validation.isWeakSet.type
 */
var type$4 = types.WEAK_SET;

/**
 * {@link rtvref.validation.method Validation} for the
 *  {@link rtvref.types.WEAK_SET WEAK_SET} type.
 * @function rtvref.validation.isWeakSet.default
 * @param {*} v Value to validate.
 * @returns {boolean} `true` if validated; `false` otherwise.
 */
function isWeakSet$1(v) {
  return isWeakSet_1(v);
}

/** `Object#toString` result references. */
var regexpTag = '[object RegExp]';

/**
 * The base implementation of `_.isRegExp` without Node.js optimizations.
 *
 * @private
 * @param {*} value The value to check.
 * @returns {boolean} Returns `true` if `value` is a regexp, else `false`.
 */
function baseIsRegExp(value) {
  return isObjectLike_1(value) && _baseGetTag(value) == regexpTag;
}

var _baseIsRegExp = baseIsRegExp;

/* Node.js helper references. */
var nodeIsRegExp = _nodeUtil && _nodeUtil.isRegExp;

/**
 * Checks if `value` is classified as a `RegExp` object.
 *
 * @static
 * @memberOf _
 * @since 0.1.0
 * @category Lang
 * @param {*} value The value to check.
 * @returns {boolean} Returns `true` if `value` is a regexp, else `false`.
 * @example
 *
 * _.isRegExp(/abc/);
 * // => true
 *
 * _.isRegExp('/abc/');
 * // => false
 */
var isRegExp = nodeIsRegExp ? _baseUnary(nodeIsRegExp) : _baseIsRegExp;

var isRegExp_1 = isRegExp;

////// isRegExp validation

/**
 * Type: {@link rtvref.types.REGEXP REGEXP}
 * @const {string} rtvref.validation.isRegExp.type
 */
var type$5 = types.REGEXP;

/**
 * {@link rtvref.validation.method Validation} for the
 *  {@link rtvref.types.REGEXP REGEXP} type.
 * @function rtvref.validation.isRegExp.default
 * @param {*} v Value to validate.
 * @returns {boolean} `true` if validated; `false` otherwise.
 */
function isRegExp$1(v) {
  return isRegExp_1(v);
}

/** `Object#toString` result references. */
var dateTag = '[object Date]';

/**
 * The base implementation of `_.isDate` without Node.js optimizations.
 *
 * @private
 * @param {*} value The value to check.
 * @returns {boolean} Returns `true` if `value` is a date object, else `false`.
 */
function baseIsDate(value) {
  return isObjectLike_1(value) && _baseGetTag(value) == dateTag;
}

var _baseIsDate = baseIsDate;

/* Node.js helper references. */
var nodeIsDate = _nodeUtil && _nodeUtil.isDate;

/**
 * Checks if `value` is classified as a `Date` object.
 *
 * @static
 * @memberOf _
 * @since 0.1.0
 * @category Lang
 * @param {*} value The value to check.
 * @returns {boolean} Returns `true` if `value` is a date object, else `false`.
 * @example
 *
 * _.isDate(new Date);
 * // => true
 *
 * _.isDate('Mon April 23 2012');
 * // => false
 */
var isDate = nodeIsDate ? _baseUnary(nodeIsDate) : _baseIsDate;

var isDate_1 = isDate;

////// isDate validation

/**
 * Type: {@link rtvref.types.DATE DATE}
 * @const {string} rtvref.validation.isDate.type
 */
var type$6 = types.DATE;

/**
 * {@link rtvref.validation.method Validation} for the
 *  {@link rtvref.types.DATE DATE} type.
 * @function rtvref.validation.isDate.default
 * @param {*} v Value to validate.
 * @returns {boolean} `true` if validated; `false` otherwise.
 */
function isDate$1(v) {
  return isDate_1(v);
}

/**
 * Creates a unary function that invokes `func` with its argument transformed.
 *
 * @private
 * @param {Function} func The function to wrap.
 * @param {Function} transform The argument transform.
 * @returns {Function} Returns the new function.
 */
function overArg(func, transform) {
  return function(arg) {
    return func(transform(arg));
  };
}

var _overArg = overArg;

/** Built-in value references. */
var getPrototype = _overArg(Object.getPrototypeOf, Object);

var _getPrototype = getPrototype;

/** `Object#toString` result references. */
var objectTag$1 = '[object Object]';

/** Used for built-in method references. */
var funcProto$2 = Function.prototype,
    objectProto$3 = Object.prototype;

/** Used to resolve the decompiled source of functions. */
var funcToString$2 = funcProto$2.toString;

/** Used to check objects for own properties. */
var hasOwnProperty$2 = objectProto$3.hasOwnProperty;

/** Used to infer the `Object` constructor. */
var objectCtorString = funcToString$2.call(Object);

/**
 * Checks if `value` is a plain object, that is, an object created by the
 * `Object` constructor or one with a `[[Prototype]]` of `null`.
 *
 * @static
 * @memberOf _
 * @since 0.8.0
 * @category Lang
 * @param {*} value The value to check.
 * @returns {boolean} Returns `true` if `value` is a plain object, else `false`.
 * @example
 *
 * function Foo() {
 *   this.a = 1;
 * }
 *
 * _.isPlainObject(new Foo);
 * // => false
 *
 * _.isPlainObject([1, 2, 3]);
 * // => false
 *
 * _.isPlainObject({ 'x': 0, 'y': 0 });
 * // => true
 *
 * _.isPlainObject(Object.create(null));
 * // => true
 */
function isPlainObject(value) {
  if (!isObjectLike_1(value) || _baseGetTag(value) != objectTag$1) {
    return false;
  }
  var proto = _getPrototype(value);
  if (proto === null) {
    return true;
  }
  var Ctor = hasOwnProperty$2.call(proto, 'constructor') && proto.constructor;
  return typeof Ctor == 'function' && Ctor instanceof Ctor &&
    funcToString$2.call(Ctor) == objectCtorString;
}

var isPlainObject_1 = isPlainObject;

/** `Object#toString` result references. */
var domExcTag = '[object DOMException]',
    errorTag = '[object Error]';

/**
 * Checks if `value` is an `Error`, `EvalError`, `RangeError`, `ReferenceError`,
 * `SyntaxError`, `TypeError`, or `URIError` object.
 *
 * @static
 * @memberOf _
 * @since 3.0.0
 * @category Lang
 * @param {*} value The value to check.
 * @returns {boolean} Returns `true` if `value` is an error object, else `false`.
 * @example
 *
 * _.isError(new Error);
 * // => true
 *
 * _.isError(Error);
 * // => false
 */
function isError(value) {
  if (!isObjectLike_1(value)) {
    return false;
  }
  var tag = _baseGetTag(value);
  return tag == errorTag || tag == domExcTag ||
    (typeof value.message == 'string' && typeof value.name == 'string' && !isPlainObject_1(value));
}

var isError_1 = isError;

////// isError validation

/**
 * Type: {@link rtvref.types.ERROR ERROR}
 * @const {string} rtvref.validation.isError.type
 */
var type$7 = types.ERROR;

/**
 * {@link rtvref.validation.method Validation} for the
 *  {@link rtvref.types.ERROR ERROR} type.
 * @function rtvref.validation.isError.default
 * @param {*} v Value to validate.
 * @returns {boolean} `true` if validated; `false` otherwise.
 */
function isError$1(v) {
  return isError_1(v);
}

////// isPromise validation

/**
 * Type: {@link rtvref.types.PROMISE PROMISE}
 * @const {string} rtvref.validation.isPromise.type
 */
var type$8 = types.PROMISE;

/**
 * {@link rtvref.validation.method Validation} for the
 *  {@link rtvref.types.PROMISE PROMISE} type.
 * @function rtvref.validation.isPromise.default
 * @param {*} v Value to validate.
 * @returns {boolean} `true` if validated; `false` otherwise.
 */
function isPromise(v) {
  return v instanceof Promise;
}

////// isObject validation

/**
 * Type: {@link rtvref.types.OBJECT OBJECT}
 * @const {string} rtvref.validation.isObject.type
 */
var type$9 = types.OBJECT;

/**
 * {@link rtvref.validation.method Validation} for the
 *  {@link rtvref.types.OBJECT OBJECT} type.
 * @function rtvref.validation.isObject.default
 * @param {*} v Value to validate.
 * @returns {boolean} `true` if validated; `false` otherwise.
 */
function isObject$1(v) {
  // no qualifier rules, no args
  return isObjectLike_1(v) && // excludes primitives and functions
  !(v instanceof String) && // excludes `new String('foo')`
  !(v instanceof Number) && // excludes `new Number(1)`
  !(v instanceof Boolean) && // excludes `new Boolean(true)`
  !isArray$1(v) && // excludes arrays which are otherwise object-like (typeof [] === 'object')
  !isMap$1(v) && !isWeakMap$1(v) && !isSet$1(v) && !isWeakSet$1(v) && !isRegExp$1(v) && !isDate$1(v) && !isError$1(v) && !isPromise(v);
}

////// isString validation

/**
 * Type: {@link rtvref.types.STRING STRING}
 * @const {string} rtvref.validation.isString.type
 */
var type$10 = types.STRING;

/**
 * {@link rtvref.validation.method Validation} for the
 *  {@link rtvref.types.STRING STRING} type.
 *
 * Determines if a value is a string literal __only__ (i.e. a
 *  {@link rtvref.types.primitives primitive}), __including an empty string__.
 *  It does not validate `new String('value')`, which is an object that is a
 *  string.
 *
 * @function rtvref.validation.isString.default
 * @param {*} v Value to validate.
 * @param {Object} [options] Validation options.
 * @param {boolean} [options.allowEmpty=false] If truthy, empty strings are
 *  permitted.
 * @returns {boolean} `true` if validated; `false` otherwise.
 */
function isString(v) {
  var _ref = arguments.length > 1 && arguments[1] !== undefined ? arguments[1] : {},
      _ref$allowEmpty = _ref.allowEmpty,
      allowEmpty = _ref$allowEmpty === undefined ? false : _ref$allowEmpty;

  return typeof v === 'string' && (v !== '' || allowEmpty);
}

////// isFunction validation

/**
 * Type: {@link rtvref.types.FUNCTION FUNCTION}
 * @const {string} rtvref.validation.isFunction.type
 */
var type$11 = types.FUNCTION;

/**
 * {@link rtvref.validation.method Validation} for the
 *  {@link rtvref.types.FUNCTION FUNCTION} type.
 * @function rtvref.validation.isFunction.default
 * @param {*} v Value to validate.
 * @returns {boolean} `true` if validated; `false` otherwise.
 */
function isFunction$1(v) {
  return isFunction_1(v);
}

////// isBoolean validation

/**
 * Type: {@link rtvref.types.BOOLEAN BOOLEAN}
 * @const {string} rtvref.validation.isBoolean.type
 */
var type$12 = types.BOOLEAN;

/**
 * {@link rtvref.validation.method Validation} for the
 *  {@link rtvref.types.BOOLEAN BOOLEAN} type.
 *
 * Determines if a value is a boolean literal __only__ (i.e. a
 *  {@link rtvref.types.primitives primitive}). It does not validate
 *  `new Boolean(true)`, which is an object that is a boolean.
 *
 * @function rtvref.validation.isBoolean.default
 * @param {*} v Value to validate.
 * @returns {boolean} `true` if validated; `false` otherwise.
 */
function isBoolean(v) {
  return v === true || v === false;
}

/**
 * A specialized version of `_.forEach` for arrays without support for
 * iteratee shorthands.
 *
 * @private
 * @param {Array} [array] The array to iterate over.
 * @param {Function} iteratee The function invoked per iteration.
 * @returns {Array} Returns `array`.
 */
function arrayEach(array, iteratee) {
  var index = -1,
      length = array == null ? 0 : array.length;

  while (++index < length) {
    if (iteratee(array[index], index, array) === false) {
      break;
    }
  }
  return array;
}

var _arrayEach = arrayEach;

/**
 * Creates a base function for methods like `_.forIn` and `_.forOwn`.
 *
 * @private
 * @param {boolean} [fromRight] Specify iterating from right to left.
 * @returns {Function} Returns the new base function.
 */
function createBaseFor(fromRight) {
  return function(object, iteratee, keysFunc) {
    var index = -1,
        iterable = Object(object),
        props = keysFunc(object),
        length = props.length;

    while (length--) {
      var key = props[fromRight ? length : ++index];
      if (iteratee(iterable[key], key, iterable) === false) {
        break;
      }
    }
    return object;
  };
}

var _createBaseFor = createBaseFor;

/**
 * The base implementation of `baseForOwn` which iterates over `object`
 * properties returned by `keysFunc` and invokes `iteratee` for each property.
 * Iteratee functions may exit iteration early by explicitly returning `false`.
 *
 * @private
 * @param {Object} object The object to iterate over.
 * @param {Function} iteratee The function invoked per iteration.
 * @param {Function} keysFunc The function to get the keys of `object`.
 * @returns {Object} Returns `object`.
 */
var baseFor = _createBaseFor();

var _baseFor = baseFor;

/**
 * The base implementation of `_.times` without support for iteratee shorthands
 * or max array length checks.
 *
 * @private
 * @param {number} n The number of times to invoke `iteratee`.
 * @param {Function} iteratee The function invoked per iteration.
 * @returns {Array} Returns the array of results.
 */
function baseTimes(n, iteratee) {
  var index = -1,
      result = Array(n);

  while (++index < n) {
    result[index] = iteratee(index);
  }
  return result;
}

var _baseTimes = baseTimes;

/** `Object#toString` result references. */
var argsTag = '[object Arguments]';

/**
 * The base implementation of `_.isArguments`.
 *
 * @private
 * @param {*} value The value to check.
 * @returns {boolean} Returns `true` if `value` is an `arguments` object,
 */
function baseIsArguments(value) {
  return isObjectLike_1(value) && _baseGetTag(value) == argsTag;
}

var _baseIsArguments = baseIsArguments;

/** Used for built-in method references. */
var objectProto$4 = Object.prototype;

/** Used to check objects for own properties. */
var hasOwnProperty$3 = objectProto$4.hasOwnProperty;

/** Built-in value references. */
var propertyIsEnumerable = objectProto$4.propertyIsEnumerable;

/**
 * Checks if `value` is likely an `arguments` object.
 *
 * @static
 * @memberOf _
 * @since 0.1.0
 * @category Lang
 * @param {*} value The value to check.
 * @returns {boolean} Returns `true` if `value` is an `arguments` object,
 *  else `false`.
 * @example
 *
 * _.isArguments(function() { return arguments; }());
 * // => true
 *
 * _.isArguments([1, 2, 3]);
 * // => false
 */
var isArguments = _baseIsArguments(function() { return arguments; }()) ? _baseIsArguments : function(value) {
  return isObjectLike_1(value) && hasOwnProperty$3.call(value, 'callee') &&
    !propertyIsEnumerable.call(value, 'callee');
};

var isArguments_1 = isArguments;

/**
 * This method returns `false`.
 *
 * @static
 * @memberOf _
 * @since 4.13.0
 * @category Util
 * @returns {boolean} Returns `false`.
 * @example
 *
 * _.times(2, _.stubFalse);
 * // => [false, false]
 */
function stubFalse() {
  return false;
}

var stubFalse_1 = stubFalse;

var isBuffer_1 = createCommonjsModule(function (module, exports) {
/** Detect free variable `exports`. */
var freeExports = 'object' == 'object' && exports && !exports.nodeType && exports;

/** Detect free variable `module`. */
var freeModule = freeExports && 'object' == 'object' && module && !module.nodeType && module;

/** Detect the popular CommonJS extension `module.exports`. */
var moduleExports = freeModule && freeModule.exports === freeExports;

/** Built-in value references. */
var Buffer = moduleExports ? _root.Buffer : undefined;

/* Built-in method references for those with the same name as other `lodash` methods. */
var nativeIsBuffer = Buffer ? Buffer.isBuffer : undefined;

/**
 * Checks if `value` is a buffer.
 *
 * @static
 * @memberOf _
 * @since 4.3.0
 * @category Lang
 * @param {*} value The value to check.
 * @returns {boolean} Returns `true` if `value` is a buffer, else `false`.
 * @example
 *
 * _.isBuffer(new Buffer(2));
 * // => true
 *
 * _.isBuffer(new Uint8Array(2));
 * // => false
 */
var isBuffer = nativeIsBuffer || stubFalse_1;

module.exports = isBuffer;
});

/** Used as references for various `Number` constants. */
var MAX_SAFE_INTEGER = 9007199254740991;

/** Used to detect unsigned integer values. */
var reIsUint = /^(?:0|[1-9]\d*)$/;

/**
 * Checks if `value` is a valid array-like index.
 *
 * @private
 * @param {*} value The value to check.
 * @param {number} [length=MAX_SAFE_INTEGER] The upper bounds of a valid index.
 * @returns {boolean} Returns `true` if `value` is a valid index, else `false`.
 */
function isIndex(value, length) {
  var type = typeof value;
  length = length == null ? MAX_SAFE_INTEGER : length;

  return !!length &&
    (type == 'number' ||
      (type != 'symbol' && reIsUint.test(value))) &&
        (value > -1 && value % 1 == 0 && value < length);
}

var _isIndex = isIndex;

/** Used as references for various `Number` constants. */
var MAX_SAFE_INTEGER$1 = 9007199254740991;

/**
 * Checks if `value` is a valid array-like length.
 *
 * **Note:** This method is loosely based on
 * [`ToLength`](http://ecma-international.org/ecma-262/7.0/#sec-tolength).
 *
 * @static
 * @memberOf _
 * @since 4.0.0
 * @category Lang
 * @param {*} value The value to check.
 * @returns {boolean} Returns `true` if `value` is a valid length, else `false`.
 * @example
 *
 * _.isLength(3);
 * // => true
 *
 * _.isLength(Number.MIN_VALUE);
 * // => false
 *
 * _.isLength(Infinity);
 * // => false
 *
 * _.isLength('3');
 * // => false
 */
function isLength(value) {
  return typeof value == 'number' &&
    value > -1 && value % 1 == 0 && value <= MAX_SAFE_INTEGER$1;
}

var isLength_1 = isLength;

/** `Object#toString` result references. */
var argsTag$1 = '[object Arguments]',
    arrayTag = '[object Array]',
    boolTag = '[object Boolean]',
    dateTag$1 = '[object Date]',
    errorTag$1 = '[object Error]',
    funcTag$1 = '[object Function]',
    mapTag$2 = '[object Map]',
    numberTag = '[object Number]',
    objectTag$2 = '[object Object]',
    regexpTag$1 = '[object RegExp]',
    setTag$2 = '[object Set]',
    stringTag = '[object String]',
    weakMapTag$2 = '[object WeakMap]';

var arrayBufferTag = '[object ArrayBuffer]',
    dataViewTag$1 = '[object DataView]',
    float32Tag = '[object Float32Array]',
    float64Tag = '[object Float64Array]',
    int8Tag = '[object Int8Array]',
    int16Tag = '[object Int16Array]',
    int32Tag = '[object Int32Array]',
    uint8Tag = '[object Uint8Array]',
    uint8ClampedTag = '[object Uint8ClampedArray]',
    uint16Tag = '[object Uint16Array]',
    uint32Tag = '[object Uint32Array]';

/** Used to identify `toStringTag` values of typed arrays. */
var typedArrayTags = {};
typedArrayTags[float32Tag] = typedArrayTags[float64Tag] =
typedArrayTags[int8Tag] = typedArrayTags[int16Tag] =
typedArrayTags[int32Tag] = typedArrayTags[uint8Tag] =
typedArrayTags[uint8ClampedTag] = typedArrayTags[uint16Tag] =
typedArrayTags[uint32Tag] = true;
typedArrayTags[argsTag$1] = typedArrayTags[arrayTag] =
typedArrayTags[arrayBufferTag] = typedArrayTags[boolTag] =
typedArrayTags[dataViewTag$1] = typedArrayTags[dateTag$1] =
typedArrayTags[errorTag$1] = typedArrayTags[funcTag$1] =
typedArrayTags[mapTag$2] = typedArrayTags[numberTag] =
typedArrayTags[objectTag$2] = typedArrayTags[regexpTag$1] =
typedArrayTags[setTag$2] = typedArrayTags[stringTag] =
typedArrayTags[weakMapTag$2] = false;

/**
 * The base implementation of `_.isTypedArray` without Node.js optimizations.
 *
 * @private
 * @param {*} value The value to check.
 * @returns {boolean} Returns `true` if `value` is a typed array, else `false`.
 */
function baseIsTypedArray(value) {
  return isObjectLike_1(value) &&
    isLength_1(value.length) && !!typedArrayTags[_baseGetTag(value)];
}

var _baseIsTypedArray = baseIsTypedArray;

/* Node.js helper references. */
var nodeIsTypedArray = _nodeUtil && _nodeUtil.isTypedArray;

/**
 * Checks if `value` is classified as a typed array.
 *
 * @static
 * @memberOf _
 * @since 3.0.0
 * @category Lang
 * @param {*} value The value to check.
 * @returns {boolean} Returns `true` if `value` is a typed array, else `false`.
 * @example
 *
 * _.isTypedArray(new Uint8Array);
 * // => true
 *
 * _.isTypedArray([]);
 * // => false
 */
var isTypedArray = nodeIsTypedArray ? _baseUnary(nodeIsTypedArray) : _baseIsTypedArray;

var isTypedArray_1 = isTypedArray;

/** Used for built-in method references. */
var objectProto$5 = Object.prototype;

/** Used to check objects for own properties. */
var hasOwnProperty$4 = objectProto$5.hasOwnProperty;

/**
 * Creates an array of the enumerable property names of the array-like `value`.
 *
 * @private
 * @param {*} value The value to query.
 * @param {boolean} inherited Specify returning inherited property names.
 * @returns {Array} Returns the array of property names.
 */
function arrayLikeKeys(value, inherited) {
  var isArr = isArray_1(value),
      isArg = !isArr && isArguments_1(value),
      isBuff = !isArr && !isArg && isBuffer_1(value),
      isType = !isArr && !isArg && !isBuff && isTypedArray_1(value),
      skipIndexes = isArr || isArg || isBuff || isType,
      result = skipIndexes ? _baseTimes(value.length, String) : [],
      length = result.length;

  for (var key in value) {
    if ((inherited || hasOwnProperty$4.call(value, key)) &&
        !(skipIndexes && (
           // Safari 9 has enumerable `arguments.length` in strict mode.
           key == 'length' ||
           // Node.js 0.10 has enumerable non-index properties on buffers.
           (isBuff && (key == 'offset' || key == 'parent')) ||
           // PhantomJS 2 has enumerable non-index properties on typed arrays.
           (isType && (key == 'buffer' || key == 'byteLength' || key == 'byteOffset')) ||
           // Skip index properties.
           _isIndex(key, length)
        ))) {
      result.push(key);
    }
  }
  return result;
}

var _arrayLikeKeys = arrayLikeKeys;

/** Used for built-in method references. */
var objectProto$6 = Object.prototype;

/**
 * Checks if `value` is likely a prototype object.
 *
 * @private
 * @param {*} value The value to check.
 * @returns {boolean} Returns `true` if `value` is a prototype, else `false`.
 */
function isPrototype(value) {
  var Ctor = value && value.constructor,
      proto = (typeof Ctor == 'function' && Ctor.prototype) || objectProto$6;

  return value === proto;
}

var _isPrototype = isPrototype;

/* Built-in method references for those with the same name as other `lodash` methods. */
var nativeKeys = _overArg(Object.keys, Object);

var _nativeKeys = nativeKeys;

/** Used for built-in method references. */
var objectProto$7 = Object.prototype;

/** Used to check objects for own properties. */
var hasOwnProperty$5 = objectProto$7.hasOwnProperty;

/**
 * The base implementation of `_.keys` which doesn't treat sparse arrays as dense.
 *
 * @private
 * @param {Object} object The object to query.
 * @returns {Array} Returns the array of property names.
 */
function baseKeys(object) {
  if (!_isPrototype(object)) {
    return _nativeKeys(object);
  }
  var result = [];
  for (var key in Object(object)) {
    if (hasOwnProperty$5.call(object, key) && key != 'constructor') {
      result.push(key);
    }
  }
  return result;
}

var _baseKeys = baseKeys;

/**
 * Checks if `value` is array-like. A value is considered array-like if it's
 * not a function and has a `value.length` that's an integer greater than or
 * equal to `0` and less than or equal to `Number.MAX_SAFE_INTEGER`.
 *
 * @static
 * @memberOf _
 * @since 4.0.0
 * @category Lang
 * @param {*} value The value to check.
 * @returns {boolean} Returns `true` if `value` is array-like, else `false`.
 * @example
 *
 * _.isArrayLike([1, 2, 3]);
 * // => true
 *
 * _.isArrayLike(document.body.children);
 * // => true
 *
 * _.isArrayLike('abc');
 * // => true
 *
 * _.isArrayLike(_.noop);
 * // => false
 */
function isArrayLike(value) {
  return value != null && isLength_1(value.length) && !isFunction_1(value);
}

var isArrayLike_1 = isArrayLike;

/**
 * Creates an array of the own enumerable property names of `object`.
 *
 * **Note:** Non-object values are coerced to objects. See the
 * [ES spec](http://ecma-international.org/ecma-262/7.0/#sec-object.keys)
 * for more details.
 *
 * @static
 * @since 0.1.0
 * @memberOf _
 * @category Object
 * @param {Object} object The object to query.
 * @returns {Array} Returns the array of property names.
 * @example
 *
 * function Foo() {
 *   this.a = 1;
 *   this.b = 2;
 * }
 *
 * Foo.prototype.c = 3;
 *
 * _.keys(new Foo);
 * // => ['a', 'b'] (iteration order is not guaranteed)
 *
 * _.keys('hi');
 * // => ['0', '1']
 */
function keys(object) {
  return isArrayLike_1(object) ? _arrayLikeKeys(object) : _baseKeys(object);
}

var keys_1 = keys;

/**
 * The base implementation of `_.forOwn` without support for iteratee shorthands.
 *
 * @private
 * @param {Object} object The object to iterate over.
 * @param {Function} iteratee The function invoked per iteration.
 * @returns {Object} Returns `object`.
 */
function baseForOwn(object, iteratee) {
  return object && _baseFor(object, iteratee, keys_1);
}

var _baseForOwn = baseForOwn;

/**
 * Creates a `baseEach` or `baseEachRight` function.
 *
 * @private
 * @param {Function} eachFunc The function to iterate over a collection.
 * @param {boolean} [fromRight] Specify iterating from right to left.
 * @returns {Function} Returns the new base function.
 */
function createBaseEach(eachFunc, fromRight) {
  return function(collection, iteratee) {
    if (collection == null) {
      return collection;
    }
    if (!isArrayLike_1(collection)) {
      return eachFunc(collection, iteratee);
    }
    var length = collection.length,
        index = fromRight ? length : -1,
        iterable = Object(collection);

    while ((fromRight ? index-- : ++index < length)) {
      if (iteratee(iterable[index], index, iterable) === false) {
        break;
      }
    }
    return collection;
  };
}

var _createBaseEach = createBaseEach;

/**
 * The base implementation of `_.forEach` without support for iteratee shorthands.
 *
 * @private
 * @param {Array|Object} collection The collection to iterate over.
 * @param {Function} iteratee The function invoked per iteration.
 * @returns {Array|Object} Returns `collection`.
 */
var baseEach = _createBaseEach(_baseForOwn);

var _baseEach = baseEach;

/**
 * This method returns the first argument it receives.
 *
 * @static
 * @since 0.1.0
 * @memberOf _
 * @category Util
 * @param {*} value Any value.
 * @returns {*} Returns `value`.
 * @example
 *
 * var object = { 'a': 1 };
 *
 * console.log(_.identity(object) === object);
 * // => true
 */
function identity(value) {
  return value;
}

var identity_1 = identity;

/**
 * Casts `value` to `identity` if it's not a function.
 *
 * @private
 * @param {*} value The value to inspect.
 * @returns {Function} Returns cast function.
 */
function castFunction(value) {
  return typeof value == 'function' ? value : identity_1;
}

var _castFunction = castFunction;

/**
 * Iterates over elements of `collection` and invokes `iteratee` for each element.
 * The iteratee is invoked with three arguments: (value, index|key, collection).
 * Iteratee functions may exit iteration early by explicitly returning `false`.
 *
 * **Note:** As with other "Collections" methods, objects with a "length"
 * property are iterated like arrays. To avoid this behavior use `_.forIn`
 * or `_.forOwn` for object iteration.
 *
 * @static
 * @memberOf _
 * @since 0.1.0
 * @alias each
 * @category Collection
 * @param {Array|Object} collection The collection to iterate over.
 * @param {Function} [iteratee=_.identity] The function invoked per iteration.
 * @returns {Array|Object} Returns `collection`.
 * @see _.forEachRight
 * @example
 *
 * _.forEach([1, 2], function(value) {
 *   console.log(value);
 * });
 * // => Logs `1` then `2`.
 *
 * _.forEach({ 'a': 1, 'b': 2 }, function(value, key) {
 *   console.log(key);
 * });
 * // => Logs 'a' then 'b' (iteration order is not guaranteed).
 */
function forEach(collection, iteratee) {
  var func = isArray_1(collection) ? _arrayEach : _baseEach;
  return func(collection, _castFunction(iteratee));
}

var forEach_1 = forEach;

////// isShape validation module

/**
 * Determines if a value is a {@link rtvref.shape_descriptor shape}.
 * @function rtvref.validation.isShape.default
 * @param {*} v Value to validate.
 * @returns {boolean} `true` if it is; `false` otherwise.
 */
function isShape(v) {
  return isObject$1(v);
}

////// isTypeArgs validation module

/**
 * Determines if a value is a {@link rtvref.types.type_arguments type arguments}
 *  object.
 * @function rtvref.validation.isTypeArgs.default
 * @param {*} v Value to validate.
 * @returns {boolean} `true` if it is; `false` otherwise.
 */
function isTypeArgs(v) {
  // NOTE: Since shapes are also type args, this check must always validate a
  //  shape; and since at this time, OBJECT === shape === type args, we just
  //  check for an OBJECT type
  return isObject$1(v);
}

////// isValidator validation module

/**
 * Determines if a value is a {@link rtvref.types.custom_validator custom validator}.
 * @function rtvref.validation.isValidator.default
 * @param {*} v Value to validate.
 * @returns {boolean} `true` if it is; `false` otherwise.
 */
function isValidator(v) {
  // TODO[plugins]: should this module be renamed to isCustomValidator since it's
  //  perhaps overloaded with 'validator' concept for plugins @see rtvref.validator?
  return isFunction$1(v);
}

////// Qualifier Definitions

/**
 * <h2>Qualifiers</h2>
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
 *  {@link rtvref.shape_descriptor shape}'s property to be defined _somewhere_
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
var REQUIRED = '!';

/**
 * Expected qualifier: The value _should_ be of the expected type. Depending on
 *  the type, additional requirements may be enforced.
 *
 * Unless otherwise stated in type-specific rules, this qualifier does _not_ allow
 *  the value to be `undefined`, but does _allow_ it to be `null`.
 *
 * Note the fact the value cannot be `undefined` implicitly requires a
 *  {@link rtvref.shape_descriptor shape}'s property to be defined _somewhere_
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
var EXPECTED = '+';

/**
 * Optional qualifier: The value _may_ be of the expected type. Depending on
 *  the type, additional requirements may be enforced.
 *
 * Unless otherwise stated in type-specific rules, this qualifier _allows_ a
 *  the value to be `null` as well as `undefined`,
 *
 * Note the fact the value can be `undefined` implies it does _not_ require a
 *  {@link rtvref.shape_descriptor shape}'s property to be defined anywhere in
 *  its prototype chain.
 *
 * See specific type for additional rules.
 *
 * @name rtvref.qualifiers.OPTIONAL
 * @const {string}
 * @see {@link rtvref.types}
 */
var OPTIONAL = '?';

//
// ^^^^^^^ INSERT NEW QUALIFIERS ^^^^^^^ ABOVE THIS SECTION ^^^^^^^
//

/**
 * Default qualifier: {@link rtvref.qualifiers.REQUIRED}
 * @const {string} rtvref.qualifiers.DEFAULT_QUALIFIER
 */
var DEFAULT_QUALIFIER = REQUIRED;

/**
 * Convenience function to check if a nil value (either `undefined` or `null`)
 *  is permitted under basic qualifier rules:
 *
 * - REQUIRED: Cannot be `undefined` nor `null`.
 * - EXPECTED: Can be `null`.
 * - OPTIONAL: Can be either `undefined` or `null`.
 *
 * @function rtvref.qualifiers.checkBasicRules
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
var nilPermitted = function nilPermitted(v) {
  var q = arguments.length > 1 && arguments[1] !== undefined ? arguments[1] : REQUIRED;

  if (q === REQUIRED) {
    return false;
  }

  if (q === EXPECTED) {
    return v === null;
  }

  return v === undefined || v === null;
};

/**
 * Enumeration (`string -> string`) of {@link rtvref.qualifiers qualifiers}.
 * @name rtvref.qualifiers.qualifiers
 * @type {rtvref.Enumeration}
 */
var qualifiers = new Enumeration({
  REQUIRED: REQUIRED,
  EXPECTED: EXPECTED,
  OPTIONAL: OPTIONAL
}, 'qualifiers');

////// isTypeset validation module

// Deep-verify a shape.
// @param {string} type The in-scope type (should be an object type from types.objTypes).
// @param {Object} rule The rule from the typeset being evaluated. This should be the args
//  for the `type`, which is either the shape itself, or an args object containing a
//  property that provides the shape.
// @param {Object} options The options object originally given to isTypeset().
// @param {string} failurePrefix The prefix to use if a failure message is generated.
// @param {number} [idx=-1] The position of `rule` within an Array typeset (if the
//  shape is nested), or a negative value if the typeset is not an Array.
// @returns {boolean} True if the shape is valid, false otherwise.
var deepVerifyShape = function deepVerifyShape(type$$1, rule, options, failurePrefix) {
  var idx = arguments.length > 4 && arguments[4] !== undefined ? arguments[4] : -1;

  var valid = true;

  // if it's a class object, the shape is an optional sub-property of the object;
  //  if it's a map object, there is no shape (the args are rtvref.types.collection_args);
  //  otherwise, the shape is the rule/object itself
  var shape = void 0;

  if (type$$1 === types.CLASS_OBJECT && rule.hasOwnProperty('shape')) {
    // shape must be valid descriptor
    valid = isShape(rule.shape);
    if (valid) {
      shape = rule.shape;
    } else {
      // NOTE: since the type is CLASS_OBJECT, `idx` _must_ be >= 0 because an
      //  Array typeset is required to specify this object type along with a shape:
      //  [CLASS_OBJECT, {shape: {...}}]
      options.failure = failurePrefix + ': Expecting a valid shape descriptor in "shape" property of args for type=' + print(type$$1) + ' at index=' + idx;
    }
  } else {
    valid = isShape(rule);
    if (valid) {
      shape = rule;
    } else {
      options.failure = failurePrefix + ': Expecting a valid shape descriptor for type=' + print(type$$1) + (idx >= 0 ? ' at index=' + idx : '');
    }
  }

  if (shape) {
    // undefined if not valid or not provided
    // validate all of the shape's typesets (each own-prop should be a typeset)
    forEach_1(shape, function (ts, prop) {
      var opts = Object.assign({}, options); // options.failure should not exist at this point
      valid = isTypeset(ts, opts); // eslint-disable-line no-use-before-define
      options.failure = opts.failure && failurePrefix + ' (' + (idx >= 0 ? 'index=' + idx + ', ' : '') + 'prop="' + prop + '"): ' + opts.failure;
      return valid; // break on first invalid
    });
  }

  return valid;
};

// Deep-verify a nested Array typeset.
// @param {rtvref.types.typeset} typeset The nested Array typeset to verify.
// @param {Object} options The options object originally given to isTypeset().
// @param {string} failurePrefix The prefix to use if a failure message is generated.
// @param {number} [idx] The position of `typeset` within the parent Array typeset.
var deepVerifyArray = function deepVerifyArray(typeset, options, failurePrefix, idx) {
  var opts = Object.assign({}, options); // options.failure should not exist at this point
  var valid = isTypeset(typeset, opts); // eslint-disable-line no-use-before-define
  options.failure = opts.failure && failurePrefix + ' (index=' + idx + '): ' + opts.failure;
  return valid;
};

/**
 * Determines if a value is a typeset.
 * @function rtvref.validation.isTypeset.default
 * @param {*} v Value to validate.
 * @param {Object} [options] Validation options.
 * @param {boolean} [options.deep=false] If truthy, deeply-validates any nested
 *  typesets. Note that typesets in nested shapes are also deeply-validated.
 * @param {boolean} [options.fullyQualified=false] If truthy, the typeset must be
 *  fully-qualified.
 * @param {(string|undefined)} [options.failure] (Output property) If an options
 *  object is specified, this property will be added and set to a failure message
 *  IIF the validation fails.
 * @returns {boolean} `true` if it is; `false` otherwise.
 * @see {@link rtvref.types.typeset}
 */
function isTypeset(v) {
  var options = arguments.length > 1 && arguments[1] !== undefined ? arguments[1] : { deep: false, fullyQualified: false };

  var deep = !!options.deep;
  var fullyQualified = !!options.fullyQualified;

  // FIRST: make sure it's an acceptable type for a typeset: shape, string
  //  (just a plain type name), function (validator), or array (non-empty)
  var valid = !!(v && (isShape(v) || isString(v) && types.check(v) || isValidator(v) || isArray$1(v) && v.length > 0));

  if (!valid) {
    options.failure = 'Value v=' + print(v) + ' is not a valid type for a typeset: Expecting object (shape), non-empty string (single type), function (custom validator), or array (typeset, non-empty)';
  }

  // THEN: check if needs to be fully-qualified, and check deep within if requested
  if (valid && fullyQualified) {
    var failurePrefix = 'Fully-qualified ' + (deep ? 'deep' : 'shallow') + ' typeset=' + print(v);

    // must now be an array with at least 2 elements: [qualifier, type]
    if (isArray$1(v) && v.length >= 2) {
      var usedTypes = {}; // @type {Object.<string,boolean>} map of simple type to `true`
      var curType = void 0; // @type {string} current in-scope type
      var argType = void 0; // @type {(string|undefined)} current in-scope type IIF it accepts args

      // Updates the current in-scope type (curType) and marks it as used in usedTypes.
      //  If the type has already been used, it sets valid to false.
      // @param {string} newType New in-scope type.
      var updateCurType = function updateCurType(newType) {
        // set the rule as the current in-scope type
        curType = newType;

        if (usedTypes[curType]) {
          // a type cannot appear more than once in a typeset (but nested is OK)
          valid = false;
          options.failure = failurePrefix + ': Type "' + curType + '" may not be included more than once in the typeset (but may appear again in a nested typeset)';
        }

        usedTypes[curType] = true;
      };

      // iterate through each element in the typeset array to make sure all required
      //  rules/properties of a fully-qualified typeset are specified
      forEach_1(v, function (rule, idx) {
        if (idx === 0) {
          // first position must always be the qualifier
          // more efficient to check for a string first than to always iterate
          //  all qualifiers (or all types, below) when it isn't since we know
          //  they're always strings
          valid = isString(rule) && !!qualifiers.check(rule);
          if (!valid) {
            options.failure = failurePrefix + ': Expected a qualifier at index=' + idx + ', found ' + print(rule);
          }
        } else if (isString(rule)) {
          // additional qualifier, or simple type
          if (qualifiers.check(rule)) {
            // cannot have more than one qualifier and qualifier must be in first position
            //  (and this is not the first position because that's handled specially, above)
            valid = false;
            options.failure = failurePrefix + ': Cannot have more than one qualifier, and qualifier must be in first position, index=' + idx;
          } else if (!types.check(rule)) {
            // if not a qualifier, it must be a valid type (since it's a string)
            valid = false;
            options.failure = failurePrefix + ': Expected a valid type in ' + types + ' at index=' + idx + ', found ' + print(rule);
          } else {
            // set the rule as the current in-scope type
            updateCurType(rule);

            // update the in-scope arg type: reset to undefined if it doesn't take
            //  args; otherwise, update it (NOTE: currently, there are no types that
            //  _require_ args, only ones that optionally have args, so we don't
            //  have to ensure that args were given when we change the type)
            argType = argTypes.check(rule);
          }
        } else if (isValidator(rule)) {
          // must be a validator, but there can't be more than 1, it must be
          //  in the last position (which enforces the 1 count), always after the
          //  qualifier, and since the typeset must be FQ'd, we must have an
          //  in-scope type
          valid = !!(curType && idx + 1 === v.length);
          if (!valid) {
            options.failure = failurePrefix + ': Unexpected custom validator at index=' + idx + ': Must be in the last position, must not be more than 1 in the typeset, must be after the qualifier, and must be preceded by a type';
          }
        } else if (isTypeArgs(rule)) {
          // could be a shape, or type args (either way, it's a single object)
          // since the typeset must be fully-qualified, argType must already be
          //  a type that takes arguments, since arguments are always provided
          //  via objects
          // NOTE: for object types, the args are the shapes themselves, except
          //  for CLASS_OBJECT where the shape is specified within the args;
          //  still, there is always only ever at most one object per type that
          //  accepts args, never more
          // NOTE: for the ARRAY type, the typeset is specified within the args
          if (argType) {
            // consume the object as the in-scope arg type's arguments
            argType = undefined;
          } else {
            // since the typeset must be fully-qualified and we don't already
            //  have an in-scope arg type, the typeset is invalid
            valid = false;
            options.failure = failurePrefix + ': Expecting a type that takes arguments at index=' + (idx - 1);
          }

          // only go deep if the rule is a shape (which means the current in-scope
          //  type must be an object type) or ARRAY args with `typeset` specified
          if (valid && deep && objTypes.check(curType)) {
            valid = deepVerifyShape(curType, rule, options, failurePrefix, idx);
          } else if (valid && deep && curType === types.ARRAY && rule.hasOwnProperty('typeset')) {
            // ARRAY type with args.typeset specified, and we're deep-validating
            valid = deepVerifyArray(rule.typeset, options, failurePrefix, idx);
          }
          // else, either not valid, not deep, or neither shape nor ARRAY args, so assume
          //  the rule (object) needs no further validation
        } else {
          // any other type in a fully-qualified array typeset is not supported
          // NOTE: the ARRAY shorthand notation is not supported in fully-qualified
          //  typesets, therefore a rule whose JavaScript type is an Array is not valid
          valid = false;
          options.failure = failurePrefix + ': Unexpected value at index=' + idx + ': Expecting object (shape), non-empty string (single type), or function (custom validator)';
        }

        return valid; // break if no longer valid
      });
    } else {
      // automatically invalid if not an array because a typeset must be in the
      //  array form in order to be FQ'd
      valid = false;
      options.failure = failurePrefix + ': Typeset cannot be fully-qualified unless it is an Array of minimum length=2';
    }

    // NEXT: if it's an array, valid, and does not need to be FQ'd, check its
    //  definition, and deep (if requested)
  } else if (valid && !fullyQualified && isArray$1(v)) {
    var _failurePrefix = 'Non-qualified ' + (deep ? 'deep' : 'shallow') + ' typeset=' + print(v);
    var _usedTypes = {}; // @type {Object.<string,boolean>} map of simple type to `true`
    var _curType = void 0; // @type {string} current in-scope type
    var _argType = void 0; // @type {(string|undefined)} current in-scope type IIF it accepts args
    var hasQualifier = false; // true if a qualifier is specified (not implied)

    // Updates the current in-scope type (curType) and marks it as used in usedTypes.
    //  If the type has already been used, it sets valid to false.
    // @param {string} newType New in-scope type.
    var _updateCurType = function _updateCurType(newType) {
      // set the rule as the current in-scope type
      _curType = newType;

      if (_usedTypes[_curType]) {
        // a type cannot appear more than once in a typeset (but nested is OK)
        valid = false;
        options.failure = _failurePrefix + ': Type "' + _curType + '" may not be included more than once in the typeset (but may appear again in a nested typeset)';
      }

      _usedTypes[_curType] = true;
    };

    // iterate through each element in the typeset array to make sure all required
    //  rules/properties of a typeset are specified
    forEach_1(v, function (rule, idx) {
      if (isString(rule)) {
        if (qualifiers.check(rule)) {
          hasQualifier = true;
          valid = idx === 0; // must be in the first position
          if (!valid) {
            options.failure = _failurePrefix + ': Unexpected qualifier at index=' + idx + ': There must be at most one qualifier and it may only be in the first position';
          }
        } else if (types.check(rule)) {
          // set the rule as the current in-scope type
          _updateCurType(rule);
          // update current in-scope arg type IIF it accepts args
          // NOTE: currently, there are no types that _require_ args, only ones
          //  that optionally have args, so we don't have to ensure that args
          //  were given when we change the type
          _argType = argTypes.check(rule);
        } else {
          // some unknown/invalid qualifier or type
          valid = false;
          options.failure = _failurePrefix + ': Unknown/invalid qualifier/type=' + print(rule) + ' at index=' + idx;
        }
      } else if (isValidator(rule)) {
        // must be a validator, but there can't be more than 1, and it must be
        //  in the last position (which enforces the 1 count), and always after
        //  the qualifier (if any)
        valid = idx + 1 === v.length;
        if (valid && !_curType) {
          // if we have a validator but no in-scope type, ANY is implied
          _updateCurType(types.ANY);
        } else if (!valid) {
          options.failure = _failurePrefix + ': Unexpected custom validator at index=' + idx + ': Must be at the last position';
        }
      } else if (isTypeArgs(rule)) {
        // could be a shape, or type args (either way, it's just one object)
        // NOTE: for object types, the args are the shapes themselves, except
        //  for CLASS_OBJECT where the shape is specified within the args; still,
        //  there is always only ever at most one object per type that accepts
        //  args, never more
        // NOTE: for the ARRAY type, the typeset is specified within the args
        if (!_argType) {
          // since there's no in-scope arg type, the object must be a shape using
          //  the default OBJECT type, but it must be in the first position (or
          //  second if the first element was a qualifier)
          // NOTE: we do not set argType (it remains undefined here) because the
          //  rule is the type and args all in one, therefore we consume the
          //  rule/object as the in-scope arg type's arguments
          _updateCurType(DEFAULT_OBJECT_TYPE);
          if (valid) {
            valid = idx === 0 || hasQualifier && idx === 1;
            // NOTE: do not set argType because the shape is the default object type's
            //  args, so they should be consumed by the in-scope arg type
            if (!valid) {
              options.failure = _failurePrefix + ': Shape at index=' + idx + ' is missing an object type in ' + objTypes + ': Only in the first position (or second if a qualifier is specified) does a shape assume the default object type of "' + DEFAULT_OBJECT_TYPE + '"';
            }
          }
        } else {
          // consume the object as the in-scope arg type's arguments
          // NOTE: currently, there are no types that _require_ args, only ones
          //  that optionally have args, so we don't have to ensure that args
          //  were given when we change the type
          _argType = undefined;
        }

        // only go deep if the rule is a shape, which means the current in-scope
        //  type must be an object type, or ARRAY args with `typeset` specified
        if (valid && deep && objTypes.check(_curType)) {
          valid = deepVerifyShape(_curType, rule, options, _failurePrefix, idx);
        } else if (valid && deep && _curType === types.ARRAY && rule.hasOwnProperty('typeset')) {
          // ARRAY type with args.typeset specified, and we're deep-validating
          valid = deepVerifyArray(rule.typeset, options, _failurePrefix, idx);
        }
        // else, either not valid, not deep, or neither shape nor ARRAY args, so assume
        //  the rule (object) needs no further validation
      } else if (isArray$1(rule)) {
        // a nested array implies the ARRAY type in shorthand notation
        _updateCurType(types.ARRAY);

        // in this case, the in-scope arg type should be updated to ARRAY since
        //  arrays accept optional args, but since this rule is a short-hand ARRAY
        //  notation, which means args cannot be specified, we update argType to
        //  undefined to clear it from the previous type (if it was set) and clear
        //  it from this type as well
        _argType = undefined;

        if (valid && deep) {
          var opts = { deep: deep, fullyQualified: fullyQualified };
          valid = isTypeset(rule, opts); // recursive
          options.failure = opts.failure && _failurePrefix + ' (index=' + idx + '): ' + opts.failure;
        }
      } else {
        // any other type in a non-qualified array typeset is not supported
        // NOTE: ARRAY shorthand notation is permitted in non-qualified typesets,
        //  therefore a rule whose JavaScript type is an Array is valid
        valid = false;
        options.failure = _failurePrefix + ': Unexpected value at index=' + idx + ': Expecting object (shape), non-empty string (single type), function (custom validator), or array (typeset)';
      }

      return valid; // break if no longer valid
    });

    // make sure at least one type was specified
    if (valid) {
      valid = !!_curType;
      if (!valid) {
        options.failure = _failurePrefix + ': Failed to find a type in the typeset';
      }
    }

    // NEXT: if it's a shape descriptor, check if deep is requested as long as it's
    //  valid and does not need to be FQ'd (otherwise, 'v' must be an array and
    //  would be invalid as a FQ'd typeset)
  } else if (valid && deep && !fullyQualified && isShape(v)) {
    var _failurePrefix2 = 'Non-qualified deep shape=' + print(v);

    // we need to deep-validate a shape descriptor, which means each one of its
    //  own-properties must be a valid typeset
    valid = deepVerifyShape(DEFAULT_OBJECT_TYPE, v, options, _failurePrefix2);
  }

  // ELSE: must be valid (but non-array/shape and doesn't need to be FQ'd), or invalid

  return valid;
}

////// RtvSuccess Class

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
       * @see {@link rtvref.RtvError#valid}
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

////// RtvError Class

// @type {function} The super class.
var extendsFrom = Error;

// Renders a path array as a string.
// @param {Array.<string>} path
// @returns {string}
var renderPath = function renderPath(path) {
  // returns '/' if the path is empty
  return path.reduce(function (strPath, elem) {
    // cast `elem` to string rather than print() to avoid quotes (should be a
    //  string anyway)
    return '' + strPath + (strPath === '/' ? '' : '/') + (elem + '');
  }, '/');
};

/**
 * @external JS_Error
 * @see https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/Error
 */

/**
 * Runtime Verification Error Indicator
 *
 * Describes a failed runtime verification of a value against a given
 *  {@link rtvref.shape_descriptor shape} or {@link rtvref.types.typeset typeset}
 *  (note that a shape is a type of typeset).
 *
 * @class rtvref.RtvError
 * @extends {external:JS_Error}
 * @param {*} value The value being verified.
 * @param {rtvref.types.typeset} typeset The typeset used for verification.
 * @param {Array.<string>} path The path deep into `value` where the failure occurred.
 *  An empty array signifies the _root_ (top-level) value that was checked.
 * @param {rtvref.types.fully_qualified_typeset} cause The fully qualified typeset
 *  that caused the failure. This is normally the fully-qualified version of `typeset`,
 *  but could be a sub-type if `typeset` is an Array typeset or a
 *  {@link rtvref.shape_descriptor shape descriptor}.
 * @throws {Error} If `typeset`, `path`, or `cause` is invalid.
 */
var RtvError = function RtvError(value, typeset, path, cause) {
  // NOTE: We're using the old ES5 way of doing classical inheritance rather than
  //  an ES6 'class' because extending from Error doesn't appear to work very well,
  //  at least not with Babel 6.x. It seems OK in Node 9.x, however. Anyway,
  //  declaring it as `class RtvError extends Error {...}` and then attempting to
  //  override `toString()` does not work. Calls to this method, whether direct
  //  or implicit, continue to call `Error.prototype.toString()`, as confirmed
  //  by checking the prototype chain, which isn't properly constructed.

  if (!isTypeset(typeset)) {
    throw new Error('Invalid typeset: ' + print(typeset));
  }

  if (!isArray$1(path)) {
    throw new Error('Invalid path: ' + print(path));
  }

  if (!isTypeset(cause, { fullyQualified: true })) {
    throw new Error('Invalid cause (expecting a fully-qualified typeset): ' + print(cause));
  }

  // NOTE: For some reason, calling `extendsFrom.call(this, message)` has
  //  no effect on `this` whatsoever, perhaps because it's calling native code,
  //  or there's something strange about the built-in Error type, so we just
  //  call the super's constructor as a formality.
  extendsFrom.call(this);
  this.message = 'Verification failed: value=' + print(value) + ', path="' + renderPath(path) + '", cause=' + print(cause);
  this.name = 'RtvError';

  Object.defineProperties(this, {
    /**
     * Flag indicating the validation failed. Always `false`.
     * @readonly
     * @name rtvref.RtvError#valid
     * @type {boolean}
     * @see {@link rtvref.RtvSuccess#valid}
     */
    valid: {
      enumerable: true,
      configurable: true,
      value: false
    },

    /**
     * Value that failed verification.
     * @readonly
     * @name rtvref.RtvError#value
     * @type {*}
     */
    value: {
      enumerable: true,
      configurable: true,
      get: function get() {
        return value;
      }
    },

    /**
     * Reference to the typeset used for verification.
     * @readonly
     * @name rtvref.RtvError#typeset
     * @type {rtvref.types.typeset}
     */
    typeset: {
      enumerable: true,
      configurable: true,
      get: function get() {
        return typeset;
      }
    },

    /**
     * Path from `value` to the nested property that caused the failure. This
     *  is a shallow clone of the original `path` specified.
     * @readonly
     * @name rtvref.RtvError#path
     * @type {Array.<string>}
     */
    path: {
      enumerable: true,
      configurable: true,
      get: function get() {
        return path.concat(); // shallow clone
      }
    },

    /**
     * Fully qualified typeset that caused the failure. This will be a subset
     *  of `typeset`, and possibly of a nested typeset within `typeset`
     *  expressing only the direct cause of the failure.
     *
     * If `typeset` is `[[rtv.t.STRING]]` (a required array of required strings),
     *  and `value` is `['a', 2]`, this property would be `[rtv.q.REQUIRED, rtv.t.STRING]`
     *  because the failure would ultimately have been caused by the nested `rtv.t.STRING`
     *  typeset.
     *
     * @readonly
     * @name rtvref.RtvError#cause
     * @type {rtvref.types.fully_qualified_typeset}
     */
    cause: {
      enumerable: true,
      configurable: true,
      get: function get() {
        return cause;
      }
    }
  });
};

RtvError.prototype = Object.create(extendsFrom.prototype);
RtvError.prototype.constructor = RtvError;

/**
 * A string representation of this instance.
 * @method rtvref.RtvError#toString
 * @returns {string} String representation.
 */
RtvError.prototype.toString = function () {
  return '{rtvref.RtvError value=' + print(this.value) + ', path="' + renderPath(this.path) + '", cause=' + print(this.cause) + '}';
};

////// Main Implementation Module

/**
 * <h2>RTV Implementation Module</h2>
 *
 * Provides the internal implementation for the externally-facing {@link rtv RTV}
 *  API, as well as utilities for {@link rtvref.validator type validators}.
 *
 * @namespace rtvref.impl
 */

/**
 * [Internal] Map of validator type (string) to validator function.
 * @private
 * @name rtvref.impl._validatorMap
 * @type {Object.<string,rtvref.validator.type_validator>}
 */
var _validatorMap = {};

/**
 * Get the qualifier given any kind of typeset.
 *
 * The typeset's validity is __not__ checked. The function attempts to get a
 *  qualifier, and defaults to the {@link qualifiers.DEFAULT_QUALIFIER default qualifier}
 *  if it cannot.
 *
 * @function rtvref.impl.getQualifier
 * @param {rtvref.types.typeset} typeset The typeset in question.
 * @returns {string} The applicable {@link rtvref.qualifiers qualifier} for the
 *  specified typeset, which is assumed to be valid.
 */
var getQualifier = function getQualifier(typeset) {
  var qualifier = DEFAULT_QUALIFIER;

  if (isArray$1(typeset)) {
    // if there's a qualifier, it must be the first element, and since it's a
    //  valid typeset, it cannot be an empty array
    if (isString(typeset[0]) && qualifiers.check(typeset[0])) {
      qualifier = typeset[0];
    }
  }
  // else, it's either an object, function, or string, which implies the default
  //  qualifier

  return qualifier;
};

/**
 * Convert a type, qualifier, and args into a typeset.
 *
 * While the `qualifier`, `args`, and `fullyQualified` parameters are all
 *  optional and may be omitted, their order must be maintained: If needed,
 *  the `qualifier` must always be before `args`, and `args` before
 *  `fullyQualified`. Parameters with `undefined` values will be ignored.
 *
 * @function rtvref.impl.toTypeset
 * @param {string} type A single type from {@link rtvref.types.types}.
 * @param {(string|Object|boolean)} [qualifier=rtvref.qualifiers.DEFAULT_QUALIFIER]
 *  Optional qualifier from {@link rtvref.qualifiers.qualifiers}. Can also be
 *  either the `args` parameter, or the `fullyQualified` parameter if the
 *  default qualifier is being used.
 * @param {(Object|boolean)} [args] Optional
 *  {@link rtvref.types.type_arguments type arguments}. If specified, this
 *  parameter must be an {@link rtvref.types.OBJECT object}, however the
 *  properties of the object are not validated against the specified `type`
 *  (i.e. they are not guaranteed to be valid for that type). Can also be
 *  the `fullyQualified` parameter if type arguments aren't applicable.
 * @param {boolean} [fullyQualified=false] If _truthy_, the generated typeset
 *  will always be {@link rtvref.types.fully_qualified_typeset fully-qualified}.
 *  Otherwise, it'll be the simplest typeset possible.
 * @returns {rtvref.types.typeset} The simplest typeset that represents the
 *  combination of the specified type, qualifier, and args, unless `fullyQualified`
 *  was set to `true`, in which case it'll always be an array typeset and
 *  fully-qualified.
 * @throws {Error} If `type`, `qualifier`, or `args` is invalid.
 */
var toTypeset = function toTypeset(type$$1) {
  for (var _len = arguments.length, rest = Array(_len > 1 ? _len - 1 : 0), _key = 1; _key < _len; _key++) {
    rest[_key - 1] = arguments[_key];
  }

  var params = rest.filter(function (p) {
    return p !== undefined;
  });
  var qualifier = DEFAULT_QUALIFIER;
  var typeArgs = void 0;
  var typeArgsGiven = false;
  var fullyQualified = false;

  if (params.length === 1) {
    if (isString(params[0])) {
      qualifier = params[0];
    } else if (!isBoolean(params[0])) {
      typeArgsGiven = true;
      typeArgs = params[0];
    } else {
      fullyQualified = params[0]; // must be boolean
    }
  } else if (params.length === 2) {
    if (isBoolean(params[0])) {
      throw new Error('Expecting qualifier or args as the second parameter');
    }

    if (isString(params[0])) {
      qualifier = params[0];
    } else {
      typeArgsGiven = true;
      typeArgs = params[0]; // must be args
    }

    if (!isBoolean(params[1])) {
      if (typeArgs) {
        throw new Error('args parameter already specified');
      }
      typeArgsGiven = true;
      typeArgs = params[1];
    } else {
      fullyQualified = params[1]; // must be boolean
    }
  } else if (params.length >= 3) {
    qualifier = params[0];
    typeArgsGiven = true;
    typeArgs = params[1];
    fullyQualified = !!params[2]; // cast to boolean
  }

  types.verify(type$$1); // catches the falsy value case too
  qualifiers.verify(qualifier); // catches the falsy value case too

  if (typeArgsGiven) {
    argTypes.verify(type$$1);
    if (!isTypeArgs(typeArgs)) {
      throw new Error('Invalid type args=' + print(typeArgs));
    }
  }

  var typeset = void 0;

  if (fullyQualified) {
    typeset = [qualifier, type$$1];
    if (typeArgs) {
      typeset.push(typeArgs);
    }
  } else {
    if (qualifier === DEFAULT_QUALIFIER) {
      if (!typeArgs) {
        typeset = type$$1;
      } else {
        typeset = [type$$1, typeArgs];
      }
    } else {
      typeset = [qualifier, type$$1];
      if (typeArgs) {
        typeset.push(typeArgs);
      }
    }
  }

  return typeset;
};

/**
 * Fully-qualifies a typeset, shallow (i.e. the first level only; nested typesets
 *  are not fully-qualified).
 *
 * This function does not modify the input `typeset`.
 *
 * @function rtvref.impl.fullyQualify
 * @param {rtvref.types.typeset} typeset Typeset to fully-qualify.
 * @param {rtvref.qualifiers} [qualifier] Optional qualifier to be used.
 *
 *  If the typeset is a simple {@link rtvref.types type},
 *   a {@link rtvref.shape_descriptor shape}, or
 *   a {@link rtvref.types.custom_validator custom validator} that was
 *   cherry-picked out of a typeset whose qualifier should be used instead of
 *   the {@link rtvref.qualifiers.DEFAULT_QUALIFIER default} one.
 *
 *  If `typeset` is an Array typeset, specifying this parameter will __override__
 *   the typeset's qualifier (otherwise, its own qualifier will be used).
 *
 * @returns {rtvref.types.fully_qualified_typeset} A new, fully-qualified typeset
 *  representing the input `typeset`. Only the first/immediate level of the
 *  input typeset is fully-qualified. The new array returned contains references
 *  to elements within the input typeset.
 * @throws {Error} If `typeset` or `qualifier` is not a valid.
 */
var fullyQualify = function fullyQualify(typeset, qualifier) {
  if (!isTypeset(typeset)) {
    // start by validating so we can be confident later
    throw new Error('Invalid typeset=' + print(typeset));
  }

  if (qualifier) {
    qualifiers.verify(qualifier);
  }

  // NOTE: from this point on, we ASSUME that the typeset is valid, which lets
  //  us make assumptions about what we find within it; without this knowledge,
  //  the algorithm below would not work

  if (!isArray$1(typeset)) {
    qualifier = qualifier || DEFAULT_QUALIFIER;

    // must be either a string, shape, or function with an implied qualifier
    if (isShape(typeset)) {
      // must be a nested shape descriptor with default object type
      return [qualifier, DEFAULT_OBJECT_TYPE, typeset];
    }

    // if a validator, it has an implied type of ANY
    if (isValidator(typeset)) {
      return [qualifier, types.ANY, typeset];
    }

    // string (basic type)
    return [qualifier, typeset];
  }

  var fqts = []; // ALWAYS a new array
  var curType = void 0; // @type {(string|undefined)} current type in scope or undefined if none

  // typeset is an array: iterate its elements and build fqts iteratively
  typeset.forEach(function (rule, i) {
    // qualifiers are non-empty strings and must appear in the first element, if specified
    if (i === 0) {
      if (isString(rule) && qualifiers.check(rule)) {
        fqts.push(qualifier || rule); // qualifier overrides the one in the typeset
        return; // next rule
      }

      // rule isn't a qualifier: use override or the default, and keep processing the rule
      fqts.push(qualifier || DEFAULT_QUALIFIER);
    }

    if (isString(rule)) {
      // must be a type
      curType = rule;
      fqts.push(curType);
    } else if (i === 0 && isShape(rule)) {
      // nested shape descriptor using default object type
      curType = DEFAULT_OBJECT_TYPE;
      fqts.push(curType, rule);
    } else if (isTypeArgs(rule)) {
      // args for curType since typeset is an array and object is not in first position
      fqts.push(rule);
    } else if (isValidator(rule)) {
      // validator: ANY is implied type if none specified
      if (!curType) {
        curType = types.ANY;
        fqts.push(curType);
      }

      fqts.push(rule);
    } else {
      // must be an array: add implied ARRAY type and move Array typeset into args
      curType = types.ARRAY;
      fqts.push(curType, { typeset: rule });
    }
  });

  return fqts;
};

/**
 * Extracts (modifies) the next complete type from an Array typeset.
 *
 * For example, if the given `typeset` is `[EXPECTED, STRING, {string_args}, FINITE]`,
 *  the returned array would be `[EXPECTED, STRING, {atring_args}]` and `typeset`
 *  would then be `[FINITE]`.
 *
 * @function rtvref.impl.extractNextType
 * @param {(rtvref.types.typeset|Array)} typeset An Array typeset from which to
 *  extract the next complete type. __This Array will be modified.__ Can also
 *  be an empty array (which is not a valid typeset, but is tolerated; see the
 *  return value for more information).
 * @param {(rtvref.qualifiers|boolean)} [qualifier] Optional, and can either
 *  be a valid qualifier, `true`, or `false`.
 *
 *  <h4>Parameter is specified, and is a qualifier</h4>
 *
 *  If __a qualifier is not found in `typeset`__, this qualifier will be used to
 *  qualify the returned sub-type Array typeset. If a qualifier is found in `typeset`,
 *  this parameter is ignored. If a qualifier is __not__ found in `typeset` and
 *  this parameter is specified, then this qualifier will be used to qualify the
 *  returned sub-type Array typeset.
 *
 *  __Examples:__
 *  - `typeset = [EXPECTED, STRING, FINITE];`
 *  - `extractNextType(typeset, REQUIRED) === [EXPECTED, STRING]`, `typeset === [FINITE]`
 *  - `extractNextType(typeset) === [FINITE]`, `typeset === []`
 *  - `typeset = [FINITE];`
 *  - `extractNextType(typeset, EXPECTED) === [EXPECTED, FINITE]`
 *
 *  <h4>Parameter is specified, and is a boolean</h4>
 *
 *  If `true`, the qualifier, if any, will be included in the returned sub-type
 *  Array typeset.
 *
 *  If `false`, the qualifier, if any, will be ignored.
 *
 *  __Examples:__
 *  - `extractNextType([STRING], true) === [STRING]`
 *  - `extractNextType([REQUIRED, STRING], true) === [EXPECTED, STRING]`
 *  - `extractNextType([REQUIRED, STRING], false) === [STRING]`
 *
 * @returns {(rtvref.types.typeset|Array)} The extracted __Array typeset__ as a
 *  new Array, which is a sub-type of the given `typeset`. This sub-typeset is
 *  not necessarily fully-qualified. If `typeset` was an empty array, an empty
 *  array is returned (which is the only case where an invalid Array typeset
 *  is tolerated, so that this function is easy to use in loops, checking for
 *  the stopping condition where the returned sub-typeset is empty).
 * @throws {Error} If `typeset` is not empty and not a valid Array typeset.
 * @throws {Error} If `qualifier` is specified but not valid.
 */
var extractNextType = function extractNextType(typeset, qualifier) {
  if (qualifier && !isBoolean(qualifier)) {
    qualifiers.verify(qualifier);
  }

  // check for an array first since that's much faster than isTypeset()
  if (!isArray$1(typeset) || typeset.length > 0 && !isTypeset(typeset)) {
    throw new Error('Invalid Array typeset=' + print(typeset));
  }

  if (typeset.length === 0) {
    return [];
  }

  var subtype = []; // subset type of `typeset`
  var type$$1 = typeset.shift(); // NOTE: [].shift() === undefined

  // FIRST: check for the qualifier, which must be the first element, if specified
  if (qualifiers.check(type$$1)) {
    if (qualifier !== false) {
      subtype.push(type$$1); // include, and ignore the specified qualifier
    }

    // next type: typeset cannot be empty because it's valid and since
    //  there's a qualifier, there must be at least one type in it too
    type$$1 = typeset.shift();
  } else {
    // must be a type or the validator, which we'll check for below
    // use the specified qualifier, if any, and if allowed
    if (qualifier && !isBoolean(qualifier)) {
      subtype.push(qualifier);
    }
  }

  if (isString(type$$1)) {
    // simple type
    subtype.push(type$$1);

    // check for args if applicable to type (as of now, there are no types that
    //  require args)
    if (argTypes.check(type$$1) && typeset.length > 0 && isTypeArgs(typeset[0])) {
      subtype.push(typeset.shift());
    }
  } else {
    // Must be either a shape, an array (nested typeset), or a validator:
    // - Shape: if the given typeset was in its original form (nothing extracted from it)
    //  then the first type could be a shape, in which case it has an implied type of
    //  OBJECT and is itself the args for it
    // - Array: a nested array is an Array typeset with an implied type of ARRAY and no args
    // - Validator: a custom validator has an implied type of ANY and no args
    subtype.push(type$$1);
  }

  return subtype;
};

/**
 * [Internal] Common options for the various `check*()` functions.
 * @private
 * @typedef {Object} rtvref.impl._checkOptions
 * @property {Array.<string>} path The current path into the typeset. Initially
 *  empty to signify the root (top-level) value being checked.
 * @property {boolean} isTypeset `true` if the typeset specified in the public
 *  parameters has already been validated and is a valid __shallow__ typeset;
 *  `false` otherwise (which means the typeset should first be validated before
 *  being processed).
 * @property {(string|undefined)} qualifier The {@link rtvref.qualifiers qualifier}
 *  in context; `undefined` if none. This property should be used when calling
 *  a `check*()` function for a typeset subtype where the typeset's qualifier
 *  should be attributed to the subtype rather than the
 *  {@link rtvref.qualifiers.DEFAULT_QUALIFIER default qualifier}.
 * @see {@link rtvref.impl.check}
 * @see {@link rtvref.impl.checkShape}
 * @see {@link rtvref.impl.checkType}
 */

/**
 * [Internal] Gets check options for any of the `check*()` functions.
 * @private
 * @function rtvref.impl._getCheckOptions
 * @param {Object} [current] Current options, used as a basis for new options.
 * @param {Object} [override] Override options, which will overwrite any `current`
 *  options.
 * @returns {rtvref.impl._checkOptions} A full, new options object, based on
 *  `given` options, if any. Invalid given options will be ignored. The object
 *  returned may contain references to objects in `given` depending on property
 *  types.
 * @see {@link rtvref.impl.check}
 * @see {@link rtvref.impl.checkShape}
 * @see {@link rtvref.impl.checkType}
 * @throws {Error} If `current.path` or `override.path` is specified and not an array.
 */
var _getCheckOptions = function _getCheckOptions() {
  var current = arguments.length > 0 && arguments[0] !== undefined ? arguments[0] : {};
  var override = arguments.length > 1 && arguments[1] !== undefined ? arguments[1] : {};

  if (current.path && !isArray$1(current.path)) {
    throw new Error('current.path must be an Array when specified, current.path=' + print(current.path));
  }

  if (override.path && !isArray$1(override.path)) {
    throw new Error('override.path must be an Array when specified, override.path=' + print(override.path));
  }

  var options = {
    path: override.path || current.path || [],
    isTypeset: false,
    qualifier: override.qualifier || current.qualifier || undefined
  };

  // careful with isTypeset since it's a boolean: check for property existence
  //  so we don't misinterpret undefined as a falsy value we should use
  if (override.hasOwnProperty('isTypeset')) {
    options.isTypeset = !!override.isTypeset;
  } else if (current.hasOwnProperty('isTypeset')) {
    options.isTypeset = !!current.isTypeset;
  }

  return options;
};

/**
 * Checks a value using a single type.
 * @function rtvref.impl.checkType
 * @param {*} value Value to check.
 * @param {rtvref.types.typeset} singleType Either a simple type name (one of
 *  {@link rtvref.types.types}), a {@link rtvref.shape_descriptor shape descriptor},
 *  or an Array typeset which represents a single type.
 *  A {@link rtvref.types.custom_validator custom validator} is not considered
 *  a valid single type.
 *
 *  In the string/simple case, the
 *   {@link rtvref.qualifiers.DEFAULT_QUALIFIER default qualifier} is assumed.
 *
 *  In the shape descriptor case, the
 *   {@link rtvref.types.DEFAULT_OBJECT_TYPE default object type} is assumed.
 *
 *  In the Array case, the qualifier is optional, and a type, along with args,
 *   if any, is expected (e.g. `[type]`, `[qualifier, type]`, `[type, args]`, or
 *   `[qualifier, type, args]`). Note that the type may be implied the shorthand
 *   notation is being used for an ARRAY, or if the
 *   {@link rtvref.types.DEFAULT_OBJECT_TYPE default object type} is being implied.
 * @returns {(rtvref.RtvSuccess|rtvref.RtvError)} A success indicator if the
 *  `value` is compliant to the type; an error indicator if not.
 * @throws {Error} If `singleType` is not a valid simple type or single type.
 * @see {@link rtvref.types}
 */
// @param {rtvref.impl._checkOptions} [options] (internal parameter)
var checkWithType = function checkWithType(value, singleType /*, options*/) {
  var options = _getCheckOptions(arguments.length > 2 ? arguments[2] : undefined);

  if (!options.isTypeset && !isTypeset(singleType)) {
    throw new Error('Invalid typeset in singleType=' + print(singleType));
  }

  options.isTypeset = true;

  var qualifier = options.qualifier || getQualifier(singleType);

  var type$$1 = void 0; // @type {string}
  var args = void 0; // @type {Object}

  if (isString(singleType)) {
    type$$1 = singleType;
    // simple type: no args
  } else if (isShape(singleType)) {
    type$$1 = DEFAULT_OBJECT_TYPE;
    args = singleType;
  } else if (isArray$1(singleType)) {
    var singleTypeCopy = fullyQualify(singleType); // make any implied types concrete
    var typeset = extractNextType(singleTypeCopy, false);

    if (singleTypeCopy.length > 0) {
      // if singleType was just one type, copy should be empty now
      throw new Error('Specified singleType=' + print(singleType) + ' typeset must represent a single type');
    }

    type$$1 = typeset[0];
    args = typeset.length > 1 ? typeset[1] : undefined;
  } else {
    throw new Error('Specified singleType=' + print(singleType) + ' must be a string, shape, or Array');
  }

  if (_validatorMap[type$$1]) {
    // call the validator for the specified type
    var result = _validatorMap[type$$1](value, qualifier, args);

    if (!result.valid) {
      // create a new error from the original, but with the current path and the
      //  original path combined
      result = new RtvError(value, singleType, options.path.concat(result.path), result.cause);
    }

    return result;
  }

  throw new Error('Missing validator for type=' + print(type$$1));
};

/**
 * Checks a value using a {@link rtvref.shape_descriptor shape descriptor} and
 *  ensure the value's type is the default object type.
 * @function rtvref.impl.checkShape
 * @param {Object} value Value to check. Must be of the
 *  {@link rtvref.types.DEFAULT_OBJECT_TYPE default} object type.
 * @param {Object} shape Expected shape of the `value`. Must be an
 *  {@link rtvref.types.OBJECT OBJECT}.
 * @returns {(rtvref.RtvSuccess|rtvref.RtvError)} A success indicator if the
 *  `value` is compliant to the shape; an error indicator if not.
 * @throws {Error} If `shape` is not an {@link rtvref.types.OBJECT OBJECT}.
 */
// @param {rtvref.impl._checkOptions} [options] (internal parameter)
var checkWithShape = function checkWithShape(value, shape /*, options*/) {
  if (!isShape(shape)) {
    throw new Error('Invalid shape=' + print(shape));
  }

  var options = _getCheckOptions(arguments.length > 2 ? arguments[2] : undefined);

  // type validators are ultimately responsible for checking values against shapes
  return checkWithType(value, shape, _getCheckOptions(options));
};

/**
 * Checks a value using an Array typeset.
 * @function rtvref.impl.checkTypeset
 * @param {*} value Value to check.
 * @param {rtvref.types.typeset} typeset The Array typeset to check against.
 * @returns {(rtvref.RtvSuccess|rtvref.RtvError)} Success indicator if the `value`
 *  is compliant to the `typeset`; error indicator otherwise. An exception is
 *  __not__ thrown if the `value` is non-compliant.
 * @throws {Error} If `typeset` is not a valid Array typeset.
 */
// @param {rtvref.impl._checkOptions} [options] (internal parameter)
var checkWithArray = function checkWithArray(value, typeset /*, options*/) {
  var options = _getCheckOptions(arguments.length > 2 ? arguments[2] : undefined);

  // check for an array first since that's must faster than isTypeset()
  if (!isArray$1(typeset) || !(options.isTypeset || isTypeset(typeset))) {
    throw new Error('Invalid Array typeset=' + print(typeset));
  }

  options.isTypeset = true;

  var match = void 0; // @type {(rtvref.types.fully_qualified_typeset|undefined)}
  var qualifier = options.qualifier || getQualifier(typeset);

  // consider each type in the typeset until we find one that matches the value
  // NOTE: an Array typeset represents multiple possibilities for a type match
  //  using a short-circuit OR conjunction
  // NOTE: due to the isTypeset check above, we can assume that each 'type' is
  //  a SHALLOW-valid typeset (meaning, if it's an Array typeset, we cannot
  //  assume that itself is valid because the isTypeset check was just shallow)
  var typesetCopy = typeset.concat(); // shallow clone so we can modify the array locally
  var subtype = extractNextType(typesetCopy, false); // exclude qualifier we already have
  while (subtype.length > 0) {
    // check for the validator, which will always come alone, and since the validator
    //  must be at the end of an Array typeset, it also signals the end of all subtypes
    if (subtype.length === 1 && isValidator(subtype[0])) {
      // if we reach the validator (which must be the very last element) in this
      //  loop, none of the types matched, unless the validator is the only
      //  type in the typeset, at which point it gets an implied type of ANY,
      //  which matches any value
      // NOTE: we have to test the original typeset for the ANY condition
      if (typeset.length === 1 || typeset.length === 2 && qualifiers.check(typeset[0])) {
        match = fullyQualify(types.ANY, qualifier);
      }

      break; // break (since this must be the last element in typeset)
    } else {
      var result = checkWithType(value, subtype, _getCheckOptions(options, {
        path: options.path,
        qualifier: qualifier,
        isTypeset: true // subtype must be valid per extractNextType()
      }));

      if (result.valid) {
        match = fullyQualify(subtype, qualifier);
        break; // break on first match
      }
    }

    // next subtype
    subtype = extractNextType(typesetCopy);
  }

  var err = void 0; // @type {(RtvError|undefined)}

  if (match) {
    // check for a validator at the end of the Array typeset and invoke it
    var lastType = typeset[typeset.length - 1];
    if (isValidator(lastType)) {
      if (!lastType(value, match, typeset)) {
        // invalid in spite of the match since the validator said no
        err = new RtvError(value, typeset, options.path, fullyQualify(typeset, qualifier));
      }
      // else, valid!
    }
    // else, valid, since we have a match
  } else {
    // no match
    err = new RtvError(value, typeset, options.path, fullyQualify(typeset, qualifier));
  }

  return err || new RtvSuccess();
};

/**
 * Checks a value against a typeset.
 * @function rtvref.impl.check
 * @param {*} value Value to check.
 * @param {rtvref.types.typeset} typeset Expected shape/type of the value.
 * @returns {(rtvref.RtvSuccess|rtvref.RtvError)} Success indicator if the `value`
 *  is compliant to the `typeset`; error indicator otherwise. An exception is
 *  __not__ thrown if the `value` is non-compliant.
 * @throws {Error} If `typeset` is not a valid typeset.
 */
// @param {rtvref.impl._checkOptions} [options] (internal parameter)
var check = function check(value, typeset /*, options*/) {
  var options = _getCheckOptions(arguments.length > 2 ? arguments[2] : undefined);

  try {
    if (options.isTypeset || isTypeset(typeset)) {
      options.isTypeset = true;

      if (isString(typeset)) {
        // simple type: check value is of the type
        return checkWithType(value, typeset, options);
      }

      if (isValidator(typeset)) {
        // custom validator: bare function implies the ANY type
        var match = types.ANY;
        var fqMatch = fullyQualify(match, options.qualifier);

        // value must be ANY type, and custom validator must return true
        var result = checkWithType(value, match, options);
        if (!result.valid) {
          return result;
        }

        // call the custom validator
        if (typeset(value, fqMatch, match)) {
          return new RtvSuccess();
        }

        return new RtvError(value, match, options.path, fqMatch);
      }

      if (isShape(typeset)) {
        // shape descriptor: check value against shape
        return checkWithShape(value, typeset, options);
      }

      if (isArray$1(typeset)) {
        // Array typeset: check value against all types in typeset
        return checkWithArray(value, typeset, options);
      }

      throw new Error('Invalid JavaScript type for typeset=' + print(typeset));
    } else {
      throw new Error('Invalid typeset=' + print(typeset) + ' specified');
    }
  } catch (checkErr) {
    var err = new Error('Cannot check value: ' + checkErr.message);
    err.rootCause = checkErr;
    throw err;
  }
};

/**
 * [Internal] Registers a validator, adding a new type that can be
 *  {@link rtvref.impl.check checked}.
 *
 * If a validator has already been registered for a particular type, the previous
 *  validator is replaced by the newer one.
 *
 * @private
 * @function rtvref.impl._registerType
 * @param {rtvref.validator} validator The validator representing the type to be
 *  registered.
 * @throws {Error} if `validator` does not have the expected interface.
 */
var _registerType = function _registerType(validator) {
  // NOTE: we can't dogfood and describe a shape to check() because the types
  //  needed may not have been registered yet
  if (!isObject$1(validator) || !types.check(validator.type) || !isFunction$1(validator.config) || !isFunction$1(validator.default)) {

    throw new Error('Cannot register an invalid validator for type=' + print(validator && validator.type) + ': missing at least one required property in [type, config, default]');
  }

  _validatorMap[validator.type] = validator.default;
};

////////////////////////////////////////////////////////////////////////////////
// Define and export the module

// define the module to be exported: properties/methods with an underscore prefix
//  will be converted to non-enumerable properties/methods
var impl = {
  // internal
  _validatorMap: _validatorMap, // exposed mainly to support unit testing
  _registerType: _registerType,
  _getCheckOptions: _getCheckOptions,
  // public
  getQualifier: getQualifier,
  toTypeset: toTypeset,
  fullyQualify: fullyQualify,
  extractNextType: extractNextType,
  checkWithType: checkWithType,
  checkWithShape: checkWithShape,
  checkWithArray: checkWithArray,
  check: check
};

// make properties/methods with underscore prefix internal by making them
//  non-enumerable (but otherwise, a normal property)
Object.keys(impl).forEach(function (prop) {
  if (prop.indexOf('_') === 0) {
    Object.defineProperty(impl, prop, {
      enumerable: false,
      configurable: true,
      writable: true,
      value: impl[prop]
    });
  }
});

////// isAny validation

/**
 * Type: {@link rtvref.types.ANY ANY}
 * @const {string} rtvref.validation.isAny.type
 */
var type$17 = types.ANY;

/**
 * {@link rtvref.validation.method Validation} for the
 *  {@link rtvref.types.ANY ANY} type.
 * @function rtvref.validation.isAny.default
 * @param {*} v Value to validate.
 * @returns {boolean} `true` if validated; `false` otherwise.
 */
function isAny(v) {
  return true; // anything goes, even undefined and null
}

////// valAny validator

var REQUIRED$1 = qualifiers.REQUIRED;

var impl$1 = void 0; // @type {rtvref.impl}

/**
 * {@link rtvref.validator.validator_config Configuration Function}
  * @function rtvref.validator.valAny.config
 * @param {rtvref.validator.validator_config_settings} settings Configuration settings.
 */
var config = function config(settings) {
  impl$1 = settings.impl;
};

/**
 * {@link rtvref.validator.type_validator Validator} for the
 *  {@link rtvref.types.ANY ANY} type.
 * @function rtvref.validator.valAny.default
 * @param {*} v Value to validate.
  * @param {string} [q] Validation qualifier. Defaults to
 *  {@link rtvref.qualifiers.REQUIRED REQUIRED}.
* @returns {(rtvref.RtvSuccess|rtvref.RtvError)} An `RtvSuccess` if valid; `RtvError` if not.
 */
function valAny(v) {
  var q = arguments.length > 1 && arguments[1] !== undefined ? arguments[1] : REQUIRED$1;

  // NOTE: no point checking basic qualifier rules since this type allows both
  //  undefined and null regardless of the qualifier

  if (isAny(v)) {
    return new RtvSuccess();
  }

  return new RtvError(v, impl$1.toTypeset(type$17, q), [], impl$1.toTypeset(type$17, q, true));
}

var valAny$1 = Object.freeze({
	get _impl () { return impl$1; },
	type: type$17,
	config: config,
	default: valAny
});

////// isAnyObject validation

/**
 * Type: {@link rtvref.types.ANY_OBJECT ANY_OBJECT}
 * @const {string} rtvref.validation.isAnyObject.type
 */
var type$18 = types.ANY_OBJECT;

/**
 * {@link rtvref.validation.method Validation} for the
 *  {@link rtvref.types.ANY_OBJECT ANY_OBJECT} type.
 * @function rtvref.validation.isAnyObject.default
 * @param {*} v Value to validate.
 * @returns {boolean} `true` if validated; `false` otherwise.
 */
function isAnyObject(v) {
  return isObject_1(v);
}

////// valAnyObject validator

var REQUIRED$2 = qualifiers.REQUIRED;

var impl$2 = void 0; // @type {rtvref.impl}

/**
 * {@link rtvref.validator.validator_config Configuration Function}
  * @function rtvref.validator.valAnyObject.config
 * @param {rtvref.validator.validator_config_settings} settings Configuration settings.
 */
var config$1 = function config(settings) {
  impl$2 = settings.impl;
};

/**
 * {@link rtvref.validator.type_validator Validator} for the
 *  {@link rtvref.types.ANY_OBJECT ANY_OBJECT} type.
 * @function rtvref.validator.valAnyObject.default
 * @param {*} v Value to validate.
 * @param {string} [q] Validation qualifier. Defaults to
 *  {@link rtvref.qualifiers.REQUIRED REQUIRED}.
 * @param {rtvref.types.numeric_args} [args] Type arguments.
 * @returns {(rtvref.RtvSuccess|rtvref.RtvError)} An `RtvSuccess` if valid; `RtvError` if not.
 */
function valAnyObject(v) {
  var q = arguments.length > 1 && arguments[1] !== undefined ? arguments[1] : REQUIRED$2;
  var args = arguments[2];

  if (nilPermitted(v, q)) {
    return new RtvSuccess();
  }

  if (!isAnyObject(v)) {
    return new RtvError(v, impl$2.toTypeset(type$18, q), [], impl$2.toTypeset(type$18, q, true));
  }

  // args is the optional shape: ignore if it isn't a shape, like other validators
  //  ignore invalid args properties
  var shape = args && isShape(args) ? args : undefined;
  var err = void 0; // @type {(RtvError|undefined)}

  // only consider enumerable, own-properties of the shape
  forEach_1(shape, function (typeset, prop) {
    var result = impl$2.check(v[prop], typeset); // check prop value against shape prop typeset

    if (!result.valid) {
      err = new RtvError(v, shape, [prop].concat(result.path), result.cause);
    }

    return !err; // break on first error
  });

  return err || new RtvSuccess();
}

var valAnyObject$1 = Object.freeze({
	get _impl () { return impl$2; },
	type: type$18,
	config: config$1,
	default: valAnyObject
});

/* Built-in method references for those with the same name as other `lodash` methods. */
var nativeIsFinite = _root.isFinite;

/**
 * Checks if `value` is a finite primitive number.
 *
 * **Note:** This method is based on
 * [`Number.isFinite`](https://mdn.io/Number/isFinite).
 *
 * @static
 * @memberOf _
 * @since 0.1.0
 * @category Lang
 * @param {*} value The value to check.
 * @returns {boolean} Returns `true` if `value` is a finite number, else `false`.
 * @example
 *
 * _.isFinite(3);
 * // => true
 *
 * _.isFinite(Number.MIN_VALUE);
 * // => true
 *
 * _.isFinite(Infinity);
 * // => false
 *
 * _.isFinite('3');
 * // => false
 */
function isFinite(value) {
  return typeof value == 'number' && nativeIsFinite(value);
}

var _isFinite = isFinite;

////// isFinite validation

/**
 * Type: {@link rtvref.types.FINITE FINITE}
 * @const {string} rtvref.validation.isFinite.type
 */
var type$19 = types.FINITE;

/**
 * {@link rtvref.validation.method Validation} for the
 *  {@link rtvref.types.FINITE FINITE} type.
 *
 * Determines if a value is a finite number literal __only__ (i.e. a
 *  {@link rtvref.types.primitives primitive}). It does not validate
 *  `new Number(1)`, which is an object that is a number.
 *
 * @function rtvref.validation.isFinite.default
 * @param {*} v Value to validate.
 * @returns {boolean} `true` if validated; `false` otherwise.
 */
function isFinite$1(v) {
  return _isFinite(v); // eliminates NaN, +/-Infinity
}

////// valArray validator

var REQUIRED$3 = qualifiers.REQUIRED;

var impl$3 = void 0; // @type {rtvref.impl}

/**
 * {@link rtvref.validator.validator_config Configuration Function}
  * @function rtvref.validator.valArray.config
 * @param {rtvref.validator.validator_config_settings} settings Configuration settings.
 */
var config$2 = function config(settings) {
  impl$3 = settings.impl;
};

/**
 * {@link rtvref.validator.type_validator Validator} for the
 *  {@link rtvref.types.ARRAY ARRAY} type.
 * @function rtvref.validator.valArray.default
 * @param {*} v Value to validate.
 * @param {string} [q] Validation qualifier. Defaults to
 *  {@link rtvref.qualifiers.REQUIRED REQUIRED}.
 * @param {rtvref.types.ARRAY_args} [args] Type arguments.
 * @returns {(rtvref.RtvSuccess|rtvref.RtvError)} An `RtvSuccess` if valid; `RtvError` if not.
 */
function valArray(v) {
  var q = arguments.length > 1 && arguments[1] !== undefined ? arguments[1] : REQUIRED$3;
  var args = arguments[2];

  if (nilPermitted(v, q)) {
    return new RtvSuccess();
  }

  var valid = isArray$1(v);
  var result = void 0; // @type {(rtvref.RtvSuccess|rtvref.RtvError)}

  if (valid && args) {
    // then check args
    if (isFinite$1(args.length) && args.length >= 0) {
      valid = v.length === args.length;
    } else {
      var min = void 0;
      if (valid && isFinite$1(args.min) && args.min >= 0) {
        min = args.min;
        valid = v.length >= min;
      }

      if (valid && isFinite$1(args.max) && args.max >= 0) {
        if (min === undefined || args.max >= min) {
          valid = v.length <= args.max;
        } // else, ignore
      }
    }

    if (valid && args.typeset) {
      // check each element in `value` against the typeset
      forEach_1(v, function (elem, idx) {
        result = impl$3.check(elem, args.typeset);
        valid = result.valid;

        if (!result.valid) {
          // create a new error from the original, but with the index prepended to the path
          result = new RtvError(v, impl$3.toTypeset(type, q, args), [idx].concat(result.path), result.cause);
        }

        return valid; // break on first invalid element
      });
    }
  }

  if (!result) {
    if (valid) {
      result = new RtvSuccess();
    } else {
      result = new RtvError(v, impl$3.toTypeset(type, q, args), [], impl$3.toTypeset(type, q, args, true));
    }
  }

  return result;
}

var valArray$1 = Object.freeze({
	get _impl () { return impl$3; },
	type: type,
	config: config$2,
	default: valArray
});

////// valBoolean validator

var REQUIRED$4 = qualifiers.REQUIRED;

var impl$4 = void 0; // @type {rtvref.impl}

/**
 * {@link rtvref.validator.validator_config Configuration Function}
  * @function rtvref.validator.valBoolean.config
 * @param {rtvref.validator.validator_config_settings} settings Configuration settings.
 */
var config$3 = function config(settings) {
  impl$4 = settings.impl;
};

/**
 * {@link rtvref.validator.type_validator Validator} for the
 *  {@link rtvref.types.BOOLEAN BOOLEAN} type.
 *
 * Determines if a value is a boolean literal __only__ (i.e. a
 *  {@link rtvref.types.primitives primitive}). It does not validate
 *  `new Boolean(true)`, which is an object that is a boolean.
 *
 * @function rtvref.validator.valBoolean.default
 * @param {*} v Value to validate.
 * @param {string} [q] Validation qualifier. Defaults to
 *  {@link rtvref.qualifiers.REQUIRED REQUIRED}.
 * @returns {(rtvref.RtvSuccess|rtvref.RtvError)} An `RtvSuccess` if valid; `RtvError` if not.
 */
function valBoolean(v) {
  var q = arguments.length > 1 && arguments[1] !== undefined ? arguments[1] : REQUIRED$4;

  if (nilPermitted(v, q)) {
    return new RtvSuccess();
  }

  if (isBoolean(v)) {
    return new RtvSuccess();
  }

  return new RtvError(v, impl$4.toTypeset(type$12, q), [], impl$4.toTypeset(type$12, q, true));
}

var valBoolean$1 = Object.freeze({
	get _impl () { return impl$4; },
	type: type$12,
	config: config$3,
	default: valBoolean
});

////// isPlainObject validation

/**
 * Type: {@link rtvref.types.PLAIN_OBJECT PLAIN_OBJECT}
 * @const {string} rtvref.validation.isPlainObject.type
 */
var type$20 = types.PLAIN_OBJECT;

/**
 * {@link rtvref.validation.method Validation} for the
 *  {@link rtvref.types.PLAIN_OBJECT PLAIN_OBJECT} type.
 * @function rtvref.validation.isPlainObject.default
 * @param {*} v Value to validate.
 * @returns {boolean} `true` if validated; `false` otherwise.
 */
function isPlainObject$1(v) {
  return isPlainObject_1(v);
}

////// isClassObject validation

/**
 * Type: {@link rtvref.types.CLASS_OBJECT CLASS_OBJECT}
 * @const {string} rtvref.validation.isClassObject.type
 */
var type$21 = types.CLASS_OBJECT;

/**
 * {@link rtvref.validation.method Validation} for the
 *  {@link rtvref.types.CLASS_OBJECT CLASS_OBJECT} type.
 * @function rtvref.validation.isClassObject.default
 * @param {*} v Value to validate.
 * @returns {boolean} `true` if validated; `false` otherwise.
 */
function isClassObject(v) {
  return isObject$1(v) && !isPlainObject$1(v);
}

////// valClassObject validator

var REQUIRED$5 = qualifiers.REQUIRED;

var impl$5 = void 0; // @type {rtvref.impl}

/**
 * {@link rtvref.validator.validator_config Configuration Function}
  * @function rtvref.validator.valClassObject.config
 * @param {rtvref.validator.validator_config_settings} settings Configuration settings.
 */
var config$4 = function config(settings) {
  impl$5 = settings.impl;
};

/**
 * {@link rtvref.validator.type_validator Validator} for the
 *  {@link rtvref.types.CLASS_OBJECT CLASS_OBJECT} type.
 * @function rtvref.validator.valClassObject.default
 * @param {*} v Value to validate.
 * @param {string} [q] Validation qualifier. Defaults to
 *  {@link rtvref.qualifiers.REQUIRED REQUIRED}.
 * @param {rtvref.types.numeric_args} [args] Type arguments.
 * @returns {(rtvref.RtvSuccess|rtvref.RtvError)} An `RtvSuccess` if valid; `RtvError` if not.
 */
function valClassObject(v) {
  var q = arguments.length > 1 && arguments[1] !== undefined ? arguments[1] : REQUIRED$5;
  var args = arguments[2];

  if (nilPermitted(v, q)) {
    return new RtvSuccess();
  }

  var valid = isClassObject(v);
  var result = void 0; // @type {(rtvref.RtvSuccess|rtvref.RtvError)}

  if (valid && args) {
    // then check args
    // check constructor first since it's more efficient than the shape
    if (args.ctr && isFunction$1(args.ctr)) {
      valid = v instanceof args.ctr;
    }

    if (valid) {
      // now validate the shape, if any
      var shape = args.shape && isShape(args.shape) ? args.shape : undefined;
      var err = void 0; // @type {(RtvError|undefined)}

      // only consider enumerable, own-properties of the shape
      forEach_1(shape, function (typeset, prop) {
        var propResult = impl$5.check(v[prop], typeset); // check prop value against shape prop typeset

        if (!propResult.valid) {
          err = new RtvError(v, impl$5.toTypeset(type$21, q, args), [prop].concat(propResult.path), propResult.cause);
        }

        return !err; // break on first error
      });

      valid = !err;
      result = err;
    }
  }

  if (!result) {
    if (valid) {
      result = new RtvSuccess();
    } else {
      result = new RtvError(v, impl$5.toTypeset(type$21, q, args), [], impl$5.toTypeset(type$21, q, args, true));
    }
  }

  return result;
}

var valClassObject$1 = Object.freeze({
	get _impl () { return impl$5; },
	type: type$21,
	config: config$4,
	default: valClassObject
});

////// valDate validator

var REQUIRED$6 = qualifiers.REQUIRED;

var impl$6 = void 0; // @type {rtvref.impl}

/**
 * {@link rtvref.validator.validator_config Configuration Function}
  * @function rtvref.validator.valDate.config
 * @param {rtvref.validator.validator_config_settings} settings Configuration settings.
 */
var config$5 = function config(settings) {
  impl$6 = settings.impl;
};

/**
 * {@link rtvref.validator.type_validator Validator} for the
 *  {@link rtvref.types.DATE DATE} type.
 * @function rtvref.validator.valDate.default
 * @param {*} v Value to validate.
 * @param {string} [q] Validation qualifier. Defaults to
 *  {@link rtvref.qualifiers.REQUIRED REQUIRED}.
 * @returns {(rtvref.RtvSuccess|rtvref.RtvError)} An `RtvSuccess` if valid; `RtvError` if not.
 */
function valDate(v) {
  var q = arguments.length > 1 && arguments[1] !== undefined ? arguments[1] : REQUIRED$6;

  if (nilPermitted(v, q)) {
    return new RtvSuccess();
  }

  if (isDate$1(v)) {
    return new RtvSuccess();
  }

  return new RtvError(v, impl$6.toTypeset(type$6, q), [], impl$6.toTypeset(type$6, q, true));
}

var valDate$1 = Object.freeze({
	get _impl () { return impl$6; },
	type: type$6,
	config: config$5,
	default: valDate
});

////// valError validator

var REQUIRED$7 = qualifiers.REQUIRED;

var impl$7 = void 0; // @type {rtvref.impl}

/**
 * {@link rtvref.validator.validator_config Configuration Function}
  * @function rtvref.validator.valError.config
 * @param {rtvref.validator.validator_config_settings} settings Configuration settings.
 */
var config$6 = function config(settings) {
  impl$7 = settings.impl;
};

/**
 * {@link rtvref.validator.type_validator Validator} for the
 *  {@link rtvref.types.ERROR ERROR} type.
 * @function rtvref.validator.valError.default
 * @param {*} v Value to validate.
 * @param {string} [q] Validation qualifier. Defaults to
 *  {@link rtvref.qualifiers.REQUIRED REQUIRED}.
 * @returns {(rtvref.RtvSuccess|rtvref.RtvError)} An `RtvSuccess` if valid; `RtvError` if not.
 */
function valError(v) {
  var q = arguments.length > 1 && arguments[1] !== undefined ? arguments[1] : REQUIRED$7;

  if (nilPermitted(v, q)) {
    return new RtvSuccess();
  }

  if (isError$1(v)) {
    return new RtvSuccess();
  }

  return new RtvError(v, impl$7.toTypeset(type$7, q), [], impl$7.toTypeset(type$7, q, true));
}

var valError$1 = Object.freeze({
	get _impl () { return impl$7; },
	type: type$7,
	config: config$6,
	default: valError
});

////// valFinite validator

var REQUIRED$8 = qualifiers.REQUIRED;

var impl$8 = void 0; // @type {rtvref.impl}

/**
 * {@link rtvref.validator.validator_config Configuration Function}
  * @function rtvref.validator.valFinite.config
 * @param {rtvref.validator.validator_config_settings} settings Configuration settings.
 */
var config$7 = function config(settings) {
  impl$8 = settings.impl;
};

/**
 * {@link rtvref.validator.type_validator Validator} for the
 *  {@link rtvref.types.FINITE FINITE} type.
 *
 * Determines if a value is a number literal __only__ (i.e. a
 *  {@link rtvref.types.primitives primitive}). It does not validate
 *  `new Number(1)`, which is an object that is a number.
 *
 * @function rtvref.validator.valFinite.default
 * @param {*} v Value to validate.
 * @param {string} [q] Validation qualifier. Defaults to
 *  {@link rtvref.qualifiers.REQUIRED REQUIRED}.
 * @param {rtvref.types.numeric_args} [args] Type arguments.
 * @returns {(rtvref.RtvSuccess|rtvref.RtvError)} An `RtvSuccess` if valid; `RtvError` if not.
 */
function valFinite(v) {
  var q = arguments.length > 1 && arguments[1] !== undefined ? arguments[1] : REQUIRED$8;
  var args = arguments[2];

  if (nilPermitted(v, q)) {
    return new RtvSuccess();
  }

  var valid = isFinite$1(v);

  if (valid && args) {
    // then check args against normal type range
    if (isFinite$1(args.exact)) {
      valid = v === args.exact;
    } else {
      var min = void 0;
      if (valid && isFinite$1(args.min)) {
        min = args.min;
        valid = v >= min;
      }

      if (valid && isFinite$1(args.max)) {
        if (min === undefined || args.max >= min) {
          valid = v <= args.max;
        } // else, ignore
      }
    }
  }

  if (valid) {
    return new RtvSuccess();
  }

  return new RtvError(v, impl$8.toTypeset(type$19, q, args), [], impl$8.toTypeset(type$19, q, args, true));
}

var valFinite$1 = Object.freeze({
	get _impl () { return impl$8; },
	type: type$19,
	config: config$7,
	default: valFinite
});

////// valFunction validator

var REQUIRED$9 = qualifiers.REQUIRED;

var impl$9 = void 0; // @type {rtvref.impl}

/**
 * {@link rtvref.validator.validator_config Configuration Function}
  * @function rtvref.validator.valFunction.config
 * @param {rtvref.validator.validator_config_settings} settings Configuration settings.
 */
var config$8 = function config(settings) {
  impl$9 = settings.impl;
};

/**
 * {@link rtvref.validator.type_validator Validator} for the
 *  {@link rtvref.types.FUNCTION FUNCTION} type.
 * @function rtvref.validator.valFunction.default
 * @param {*} v Value to validate.
 * @param {string} [q] Validation qualifier. Defaults to
 *  {@link rtvref.qualifiers.REQUIRED REQUIRED}.
 * @returns {(rtvref.RtvSuccess|rtvref.RtvError)} An `RtvSuccess` if valid; `RtvError` if not.
 */
function valFunction(v) {
  var q = arguments.length > 1 && arguments[1] !== undefined ? arguments[1] : REQUIRED$9;

  if (nilPermitted(v, q)) {
    return new RtvSuccess();
  }

  if (isFunction$1(v)) {
    return new RtvSuccess();
  }

  return new RtvError(v, impl$9.toTypeset(type$11, q), [], impl$9.toTypeset(type$11, q, true));
}

var valFunction$1 = Object.freeze({
	type: type$11,
	config: config$8,
	default: valFunction
});

////// isHashMap validation

/**
 * Type: {@link rtvref.types.HASH_MAP HASH_MAP}
 * @const {string} rtvref.validation.isHashMap.type
 */
var type$22 = types.HASH_MAP;

/**
 * {@link rtvref.validation.method Validation} for the
 *  {@link rtvref.types.HASH_MAP HASH_MAP} type.
 * @function rtvref.validation.isHashMap.default
 * @param {*} v Value to validate.
 * @returns {boolean} `true` if validated; `false` otherwise.
 */
function isHashMap(v) {
  return isObject$1(v); // same rules as OBJECT
}

////// valHashMap validator

var REQUIRED$10 = qualifiers.REQUIRED;

var impl$10 = void 0; // @type {rtvref.impl}

/**
 * {@link rtvref.validator.validator_config Configuration Function}
  * @function rtvref.validator.valHashMap.config
 * @param {rtvref.validator.validator_config_settings} settings Configuration settings.
 */
var config$9 = function config(settings) {
  impl$10 = settings.impl;
};

/**
 * {@link rtvref.validator.type_validator Validator} for the
 *  {@link rtvref.types.HASH_MAP HASH_MAP} type.
 * @function rtvref.validator.valHashMap.default
 * @param {*} v Value to validate.
 * @param {string} [q] Validation qualifier. Defaults to
 *  {@link rtvref.qualifiers.REQUIRED REQUIRED}.
 * @param {rtvref.types.collection_args} [args] Type arguments.
 * @returns {(rtvref.RtvSuccess|rtvref.RtvError)} An `RtvSuccess` if valid; `RtvError` if not.
 */
function valHashMap(v) {
  var q = arguments.length > 1 && arguments[1] !== undefined ? arguments[1] : REQUIRED$10;
  var args = arguments[2];

  if (nilPermitted(v, q)) {
    return new RtvSuccess();
  }

  var valid = isHashMap(v);
  var result = void 0; // @type {(rtvref.RtvSuccess|rtvref.RtvError)}

  if (valid && args) {
    // then check args
    var keys = Object.keys(v);

    // start with the easiest/most efficient test: length
    if (valid && isFinite$1(args.length) && args.length >= 0) {
      valid = keys.length === args.length;
    }

    // remaining args, if specified, require iterating potentially the entire map
    if (valid) {
      // get the key expression
      var keyExp = args.keyExp && isString(args.keyExp) ? args.keyExp : undefined;
      // get the key expression flags only if we have a key expression
      var keyFlagSpec = keyExp && args.keyFlagSpec && isString(args.keyFlagSpec) ? args.keyFlagSpec : undefined;
      // get the typeset for values
      var tsValues = isTypeset(args.values) ? args.values : undefined;

      if (keyExp || tsValues) {
        var reKeys = keyExp ? new RegExp(keyExp, keyFlagSpec) : undefined;

        forEach_1(keys, function (key) {
          var value = v[key];

          if (reKeys) {
            valid = reKeys.test(key); // check key against regex since it's a string
            if (!valid) {
              result = new RtvError(v, impl$10.toTypeset(type$22, q, args), ['key=' + print(key)], impl$10.toTypeset(type$22, q, args, true));
            }
          }

          if (valid && tsValues) {
            result = impl$10.check(value, tsValues); // check VALUE against typeset
            valid = result.valid;

            if (!result.valid) {
              // create a new error from the original, but still with the KEY added to the path
              result = new RtvError(v, impl$10.toTypeset(type$22, q, args), ['valueKey=' + print(key)].concat(result.path), result.cause);
            }
          }

          return valid; // break on first invalid key or value
        });
      }
    }
  }

  if (!result) {
    if (valid) {
      result = new RtvSuccess();
    } else {
      result = new RtvError(v, impl$10.toTypeset(type$22, q, args), [], impl$10.toTypeset(type$22, q, args, true));
    }
  }

  return result;
}

var valHashMap$1 = Object.freeze({
	get _impl () { return impl$10; },
	type: type$22,
	config: config$9,
	default: valHashMap
});

/** `Object#toString` result references. */
var symbolTag = '[object Symbol]';

/**
 * Checks if `value` is classified as a `Symbol` primitive or object.
 *
 * @static
 * @memberOf _
 * @since 4.0.0
 * @category Lang
 * @param {*} value The value to check.
 * @returns {boolean} Returns `true` if `value` is a symbol, else `false`.
 * @example
 *
 * _.isSymbol(Symbol.iterator);
 * // => true
 *
 * _.isSymbol('abc');
 * // => false
 */
function isSymbol(value) {
  return typeof value == 'symbol' ||
    (isObjectLike_1(value) && _baseGetTag(value) == symbolTag);
}

var isSymbol_1 = isSymbol;

/** Used as references for various `Number` constants. */
var NAN = 0 / 0;

/** Used to match leading and trailing whitespace. */
var reTrim = /^\s+|\s+$/g;

/** Used to detect bad signed hexadecimal string values. */
var reIsBadHex = /^[-+]0x[0-9a-f]+$/i;

/** Used to detect binary string values. */
var reIsBinary = /^0b[01]+$/i;

/** Used to detect octal string values. */
var reIsOctal = /^0o[0-7]+$/i;

/** Built-in method references without a dependency on `root`. */
var freeParseInt = parseInt;

/**
 * Converts `value` to a number.
 *
 * @static
 * @memberOf _
 * @since 4.0.0
 * @category Lang
 * @param {*} value The value to process.
 * @returns {number} Returns the number.
 * @example
 *
 * _.toNumber(3.2);
 * // => 3.2
 *
 * _.toNumber(Number.MIN_VALUE);
 * // => 5e-324
 *
 * _.toNumber(Infinity);
 * // => Infinity
 *
 * _.toNumber('3.2');
 * // => 3.2
 */
function toNumber(value) {
  if (typeof value == 'number') {
    return value;
  }
  if (isSymbol_1(value)) {
    return NAN;
  }
  if (isObject_1(value)) {
    var other = typeof value.valueOf == 'function' ? value.valueOf() : value;
    value = isObject_1(other) ? (other + '') : other;
  }
  if (typeof value != 'string') {
    return value === 0 ? value : +value;
  }
  value = value.replace(reTrim, '');
  var isBinary = reIsBinary.test(value);
  return (isBinary || reIsOctal.test(value))
    ? freeParseInt(value.slice(2), isBinary ? 2 : 8)
    : (reIsBadHex.test(value) ? NAN : +value);
}

var toNumber_1 = toNumber;

/** Used as references for various `Number` constants. */
var INFINITY = 1 / 0,
    MAX_INTEGER = 1.7976931348623157e+308;

/**
 * Converts `value` to a finite number.
 *
 * @static
 * @memberOf _
 * @since 4.12.0
 * @category Lang
 * @param {*} value The value to convert.
 * @returns {number} Returns the converted number.
 * @example
 *
 * _.toFinite(3.2);
 * // => 3.2
 *
 * _.toFinite(Number.MIN_VALUE);
 * // => 5e-324
 *
 * _.toFinite(Infinity);
 * // => 1.7976931348623157e+308
 *
 * _.toFinite('3.2');
 * // => 3.2
 */
function toFinite(value) {
  if (!value) {
    return value === 0 ? value : 0;
  }
  value = toNumber_1(value);
  if (value === INFINITY || value === -INFINITY) {
    var sign = (value < 0 ? -1 : 1);
    return sign * MAX_INTEGER;
  }
  return value === value ? value : 0;
}

var toFinite_1 = toFinite;

/**
 * Converts `value` to an integer.
 *
 * **Note:** This method is loosely based on
 * [`ToInteger`](http://www.ecma-international.org/ecma-262/7.0/#sec-tointeger).
 *
 * @static
 * @memberOf _
 * @since 4.0.0
 * @category Lang
 * @param {*} value The value to convert.
 * @returns {number} Returns the converted integer.
 * @example
 *
 * _.toInteger(3.2);
 * // => 3
 *
 * _.toInteger(Number.MIN_VALUE);
 * // => 0
 *
 * _.toInteger(Infinity);
 * // => 1.7976931348623157e+308
 *
 * _.toInteger('3.2');
 * // => 3
 */
function toInteger(value) {
  var result = toFinite_1(value),
      remainder = result % 1;

  return result === result ? (remainder ? result - remainder : result) : 0;
}

var toInteger_1 = toInteger;

/**
 * Checks if `value` is an integer.
 *
 * **Note:** This method is based on
 * [`Number.isInteger`](https://mdn.io/Number/isInteger).
 *
 * @static
 * @memberOf _
 * @since 4.0.0
 * @category Lang
 * @param {*} value The value to check.
 * @returns {boolean} Returns `true` if `value` is an integer, else `false`.
 * @example
 *
 * _.isInteger(3);
 * // => true
 *
 * _.isInteger(Number.MIN_VALUE);
 * // => false
 *
 * _.isInteger(Infinity);
 * // => false
 *
 * _.isInteger('3');
 * // => false
 */
function isInteger(value) {
  return typeof value == 'number' && value == toInteger_1(value);
}

var isInteger_1 = isInteger;

////// isInt validation

/**
 * Type: {@link rtvref.types.INT INT}
 * @const {string} rtvref.validation.isInt.type
 */
var type$23 = types.INT;

/**
 * {@link rtvref.validation.method Validation} for the
 *  {@link rtvref.types.INT INT} type.
 *
 * Determines if a value is an integer literal __only__ (i.e. a
 *  {@link rtvref.types.primitives primitive}). It does not validate
 *  `new Number(1)`, which is an object that is a number.
 *
 * @function rtvref.validation.isInt.default
 * @param {*} v Value to validate.
 * @returns {boolean} `true` if validated; `false` otherwise.
 */
function isInt(v) {
  return isInteger_1(v); // eliminates NaN, +/-Infinity, floats
}

////// valInt validator

var REQUIRED$11 = qualifiers.REQUIRED;

var impl$11 = void 0; // @type {rtvref.impl}

/**
 * {@link rtvref.validator.validator_config Configuration Function}
  * @function rtvref.validator.valInt.config
 * @param {rtvref.validator.validator_config_settings} settings Configuration settings.
 */
var config$10 = function config(settings) {
  impl$11 = settings.impl;
};

/**
 * {@link rtvref.validator.type_validator Validator} for the
 *  {@link rtvref.types.INT INT} type.
 *
 * Determines if a value is a number literal __only__ (i.e. a
 *  {@link rtvref.types.primitives primitive}). It does not validate
 *  `new Number(1)`, which is an object that is a number.
 *
 * @function rtvref.validator.valInt.default
 * @param {*} v Value to validate.
 * @param {string} [q] Validation qualifier. Defaults to
 *  {@link rtvref.qualifiers.REQUIRED REQUIRED}.
 * @param {rtvref.types.numeric_args} [args] Type arguments.
 * @returns {(rtvref.RtvSuccess|rtvref.RtvError)} An `RtvSuccess` if valid; `RtvError` if not.
 */
function valInt(v) {
  var q = arguments.length > 1 && arguments[1] !== undefined ? arguments[1] : REQUIRED$11;
  var args = arguments[2];

  if (nilPermitted(v, q)) {
    return new RtvSuccess();
  }

  var valid = isInt(v);

  if (valid && args) {
    // then check args against normal type range
    if (isInt(args.exact)) {
      valid = v === args.exact;
    } else {
      var min = void 0;
      if (valid && isInt(args.min)) {
        min = args.min;
        valid = v >= min;
      }

      if (valid && isInt(args.max)) {
        if (min === undefined || args.max >= min) {
          valid = v <= args.max;
        } // else, ignore
      }
    }
  }

  if (valid) {
    return new RtvSuccess();
  }

  return new RtvError(v, impl$11.toTypeset(type$23, q, args), [], impl$11.toTypeset(type$23, q, args, true));
}

var valInt$1 = Object.freeze({
	get _impl () { return impl$11; },
	type: type$23,
	config: config$10,
	default: valInt
});

////// isNull validation

/**
 * Type: {@link rtvref.types.NULL NULL}
 * @const {string} rtvref.validation.isFunction.type
 */
var type$24 = types.NULL;

/**
 * {@link rtvref.validation.method Validation} for the
 *  {@link rtvref.types.NULL NULL} type.
 * @function rtvref.validation.isNull.default
 * @param {*} v Value to validate.
 * @returns {boolean} `true` if validated; `false` otherwise.
 */
function isNull(v) {
  return v === null;
}

////// isJson validation

/**
 * Type: {@link rtvref.types.JSON JSON}
 * @const {string} rtvref.validation.isJson.type
 */
var type$25 = types.JSON;

/**
 * {@link rtvref.validation.method Validation} for the
 *  {@link rtvref.types.JSON JSON} type.
 * @function rtvref.validation.isJson.default
 * @param {*} v Value to validate.
 * @returns {boolean} `true` if validated; `false` otherwise.
 */
function isJson(v) {
  return isNull(v) || isString(v, { allowEmpty: true }) || isBoolean(v) || isFinite$1(v) || isPlainObject$1(v) || isArray$1(v);
}

////// valJson validator

var REQUIRED$12 = qualifiers.REQUIRED;

var impl$12 = void 0; // @type {rtvref.impl}

/**
 * {@link rtvref.validator.validator_config Configuration Function}
  * @function rtvref.validator.valJson.config
 * @param {rtvref.validator.validator_config_settings} settings Configuration settings.
 */
var config$11 = function config(settings) {
  impl$12 = settings.impl;
};

/**
 * {@link rtvref.validator.type_validator Validator} for the
 *  {@link rtvref.types.JSON JSON} type.
 * @function rtvref.validator.valJson.default
 * @param {*} v Value to validate.
 * @param {string} [q] Validation qualifier. Defaults to
 *  {@link rtvref.qualifiers.REQUIRED REQUIRED}.
 * @returns {(rtvref.RtvSuccess|rtvref.RtvError)} An `RtvSuccess` if valid; `RtvError` if not.
 */
function valJson(v) {
  var q = arguments.length > 1 && arguments[1] !== undefined ? arguments[1] : REQUIRED$12;

  if (nilPermitted(v, q)) {
    return new RtvSuccess();
  }

  if (isJson(v)) {
    return new RtvSuccess();
  }

  return new RtvError(v, impl$12.toTypeset(type$25, q), [], impl$12.toTypeset(type$25, q, true));
}

var valJson$1 = Object.freeze({
	get _impl () { return impl$12; },
	type: type$25,
	config: config$11,
	default: valJson
});

////// valMap validator

var REQUIRED$13 = qualifiers.REQUIRED;

var impl$13 = void 0; // @type {rtvref.impl}

/**
 * {@link rtvref.validator.validator_config Configuration Function}
  * @function rtvref.validator.valMap.config
 * @param {rtvref.validator.validator_config_settings} settings Configuration settings.
 */
var config$12 = function config(settings) {
  impl$13 = settings.impl;
};

//
// Determines if a typeset represents a string, and only a string.
// @param {rtvref.types.typeset} ts Typeset to check.
// @return {boolean} `true` if so; `false` otherwise.
//
var isStringTypeset = function isStringTypeset(ts) {
  var fqts = impl$13.fullyQualify(ts);

  // must be `[qualifier, STRING]`, otherwise no
  return fqts.length === 2 && fqts[1] === types.STRING;
};

/**
 * {@link rtvref.validator.type_validator Validator} for the
 *  {@link rtvref.types.MAP MAP} type.
 * @function rtvref.validator.valMap.default
 * @param {*} v Value to validate.
 * @param {string} [q] Validation qualifier. Defaults to
 *  {@link rtvref.qualifiers.REQUIRED REQUIRED}.
 * @param {rtvref.types.collection_args} [args] Type arguments.
 * @returns {(rtvref.RtvSuccess|rtvref.RtvError)} An `RtvSuccess` if valid; `RtvError` if not.
 */
function valMap(v) {
  var q = arguments.length > 1 && arguments[1] !== undefined ? arguments[1] : REQUIRED$13;
  var args = arguments[2];

  if (nilPermitted(v, q)) {
    return new RtvSuccess();
  }

  var valid = isMap$1(v);
  var result = void 0; // @type {(rtvref.RtvSuccess|rtvref.RtvError)}

  if (valid && args) {
    // then check args
    // start with the easiest/most efficient test: length
    if (valid && isFinite$1(args.length) && args.length >= 0) {
      valid = v.size === args.length;
    }

    // remaining args, if specified, require iterating potentially the entire map
    if (valid) {
      // get the typeset for keys
      var tsKeys = isTypeset(args.keys) ? args.keys : undefined;
      // get the key expression only if the keys are expected to be strings
      var tsKeysIsString = !!(tsKeys && isStringTypeset(tsKeys));
      var keyExp = tsKeysIsString && args.keyExp && isString(args.keyExp) ? args.keyExp : undefined;
      // get the key expression flags only if we have a key expression
      var keyFlagSpec = keyExp && args.keyFlagSpec && isString(args.keyFlagSpec) ? args.keyFlagSpec : undefined;
      // get the typeset for values
      var tsValues = isTypeset(args.values) ? args.values : undefined;

      if (tsKeys || tsValues) {
        var reKeys = keyExp ? new RegExp(keyExp, keyFlagSpec) : undefined;
        var it = v.entries(); // iterator

        var _iteratorNormalCompletion = true;
        var _didIteratorError = false;
        var _iteratorError = undefined;

        try {
          for (var _iterator = it[Symbol.iterator](), _step; !(_iteratorNormalCompletion = (_step = _iterator.next()).done); _iteratorNormalCompletion = true) {
            var elem = _step.value;

            var _elem = slicedToArray(elem, 2),
                key = _elem[0],
                value = _elem[1];

            if (tsKeys) {
              result = impl$13.check(key, tsKeys); // check KEY against typeset
              valid = result.valid;

              if (!result.valid) {
                // create a new error from the original, but with the KEY prepended to the path
                result = new RtvError(v, impl$13.toTypeset(type$1, q, args), ['key=' + print(key)].concat(result.path), result.cause);
              }

              if (valid && tsKeysIsString && reKeys) {
                valid = reKeys.test(key); // check key against regex since it's a string
                if (!valid) {
                  result = new RtvError(v, impl$13.toTypeset(type$1, q, args), ['key=' + print(key)], impl$13.toTypeset(type$1, q, args, true));
                }
              }
            }

            if (valid && tsValues) {
              result = impl$13.check(value, tsValues); // check VALUE against typeset
              valid = result.valid;

              if (!result.valid) {
                // create a new error from the original, but still with the KEY added to the path
                result = new RtvError(v, impl$13.toTypeset(type$1, q, args), ['valueKey=' + print(key)].concat(result.path), result.cause);
              }
            }

            if (!valid) {
              // break on first invalid key or value
              break;
            }
          }
        } catch (err) {
          _didIteratorError = true;
          _iteratorError = err;
        } finally {
          try {
            if (!_iteratorNormalCompletion && _iterator.return) {
              _iterator.return();
            }
          } finally {
            if (_didIteratorError) {
              throw _iteratorError;
            }
          }
        }
      }
    }
  }

  if (!result) {
    if (valid) {
      result = new RtvSuccess();
    } else {
      result = new RtvError(v, impl$13.toTypeset(type$1, q, args), [], impl$13.toTypeset(type$1, q, args, true));
    }
  }

  return result;
}


var valMap$1 = Object.freeze({
	get _impl () { return impl$13; },
	type: type$1,
	config: config$12,
	default: valMap
});

////// valNull validator

var REQUIRED$14 = qualifiers.REQUIRED;

var impl$14 = void 0; // @type {rtvref.impl}

/**
 * {@link rtvref.validator.validator_config Configuration Function}
  * @function rtvref.validator.valNull.config
 * @param {rtvref.validator.validator_config_settings} settings Configuration settings.
 */
var config$13 = function config(settings) {
  impl$14 = settings.impl;
};

/**
 * {@link rtvref.validator.type_validator Validator} for the
 *  {@link rtvref.types.NULL NULL} type.
 * @function rtvref.validator.valNull.default
 * @param {*} v Value to validate.
 * @param {string} [q] Validation qualifier. Defaults to
 *  {@link rtvref.qualifiers.REQUIRED REQUIRED}.
 * @returns {(rtvref.RtvSuccess|rtvref.RtvError)} An `RtvSuccess` if valid; `RtvError` if not.
 */
function valNull(v) {
  var q = arguments.length > 1 && arguments[1] !== undefined ? arguments[1] : REQUIRED$14;

  if (nilPermitted(v, q)) {
    return new RtvSuccess();
  }

  if (isNull(v)) {
    return new RtvSuccess();
  }

  return new RtvError(v, impl$14.toTypeset(type$24, q), [], impl$14.toTypeset(type$24, q, true));
}

var valNull$1 = Object.freeze({
	get _impl () { return impl$14; },
	type: type$24,
	config: config$13,
	default: valNull
});

/** `Object#toString` result references. */
var numberTag$1 = '[object Number]';

/**
 * Checks if `value` is classified as a `Number` primitive or object.
 *
 * **Note:** To exclude `Infinity`, `-Infinity`, and `NaN`, which are
 * classified as numbers, use the `_.isFinite` method.
 *
 * @static
 * @memberOf _
 * @since 0.1.0
 * @category Lang
 * @param {*} value The value to check.
 * @returns {boolean} Returns `true` if `value` is a number, else `false`.
 * @example
 *
 * _.isNumber(3);
 * // => true
 *
 * _.isNumber(Number.MIN_VALUE);
 * // => true
 *
 * _.isNumber(Infinity);
 * // => true
 *
 * _.isNumber('3');
 * // => false
 */
function isNumber(value) {
  return typeof value == 'number' ||
    (isObjectLike_1(value) && _baseGetTag(value) == numberTag$1);
}

var isNumber_1 = isNumber;

/**
 * Checks if `value` is `NaN`.
 *
 * **Note:** This method is based on
 * [`Number.isNaN`](https://mdn.io/Number/isNaN) and is not the same as
 * global [`isNaN`](https://mdn.io/isNaN) which returns `true` for
 * `undefined` and other non-number values.
 *
 * @static
 * @memberOf _
 * @since 0.1.0
 * @category Lang
 * @param {*} value The value to check.
 * @returns {boolean} Returns `true` if `value` is `NaN`, else `false`.
 * @example
 *
 * _.isNaN(NaN);
 * // => true
 *
 * _.isNaN(new Number(NaN));
 * // => true
 *
 * isNaN(undefined);
 * // => true
 *
 * _.isNaN(undefined);
 * // => false
 */
function isNaN(value) {
  // An `NaN` primitive is the only value that is not equal to itself.
  // Perform the `toStringTag` check first to avoid errors with some
  // ActiveX objects in IE.
  return isNumber_1(value) && value != +value;
}

var _isNaN = isNaN;

////// isNumber validation

/**
 * Type: {@link rtvref.types.NUMBER NUMBER}
 * @const {string} rtvref.validation.isNumber.type
 */
var type$26 = types.NUMBER;

/**
 * {@link rtvref.validation.method Validation} for the
 *  {@link rtvref.types.NUMBER NUMBER} type.
 *
 * Determines if a value is a number literal __only__ (i.e. a
 *  {@link rtvref.types.primitives primitive}). It does not validate
 *  `new Number(1)`, which is an object that is a number, neither does it
 *  validate `NaN`.
 *
 * @function rtvref.validation.isNumber.default
 * @param {*} v Value to validate.
 * @returns {boolean} `true` if validated; `false` otherwise.
 */
function isNumber$1(v) {
  return typeof v === 'number' && !_isNaN(v); // allows +/-Infinity
}

////// valNumber validator

var REQUIRED$15 = qualifiers.REQUIRED;

var impl$15 = void 0; // @type {rtvref.impl}

/**
 * {@link rtvref.validator.validator_config Configuration Function}
  * @function rtvref.validator.valNumber.config
 * @param {rtvref.validator.validator_config_settings} settings Configuration settings.
 */
var config$14 = function config(settings) {
  impl$15 = settings.impl;
};

/**
 * {@link rtvref.validator.type_validator Validator} for the
 *  {@link rtvref.types.NUMBER NUMBER} type.
 *
 * Determines if a value is a number literal __only__ (i.e. a
 *  {@link rtvref.types.primitives primitive}). It does not validate
 *  `new Number(1)`, which is an object that is a number.
 *
 * @function rtvref.validator.valNumber.default
 * @param {*} v Value to validate.
 * @param {string} [q] Validation qualifier. Defaults to
 *  {@link rtvref.qualifiers.REQUIRED REQUIRED}.
 * @param {rtvref.types.numeric_args} [args] Type arguments.
 * @returns {(rtvref.RtvSuccess|rtvref.RtvError)} An `RtvSuccess` if valid; `RtvError` if not.
 */
function valNumber(v) {
  var q = arguments.length > 1 && arguments[1] !== undefined ? arguments[1] : REQUIRED$15;
  var args = arguments[2];

  if (nilPermitted(v, q)) {
    return new RtvSuccess();
  }

  var valid = isNumber$1(v);

  // all qualifiers other than REQUIRED allow NaN
  if (q !== REQUIRED$15 && _isNaN(v)) {
    valid = true;
  }

  if (valid && args) {
    // then check args against normal type range
    // NOTE: NaN is OK for the exact arg (careful: NaN !== NaN...)
    if (isNumber$1(args.exact) || _isNaN(args.exact)) {
      valid = v === args.exact || _isNaN(v) && _isNaN(args.exact);
    } else {
      var min = void 0;
      if (valid && isNumber$1(args.min)) {
        min = args.min;
        valid = v >= min;
      }

      if (valid && isNumber$1(args.max)) {
        if (min === undefined || args.max >= min) {
          valid = v <= args.max;
        } // else, ignore
      }
    }
  }

  if (valid) {
    return new RtvSuccess();
  }

  return new RtvError(v, impl$15.toTypeset(type$26, q, args), [], impl$15.toTypeset(type$26, q, args, true));
}

var valNumber$1 = Object.freeze({
	get _impl () { return impl$15; },
	type: type$26,
	config: config$14,
	default: valNumber
});

////// valObject validator

var REQUIRED$16 = qualifiers.REQUIRED;

var impl$16 = void 0; // @type {rtvref.impl}

/**
 * {@link rtvref.validator.validator_config Configuration Function}
  * @function rtvref.validator.valObject.config
 * @param {rtvref.validator.validator_config_settings} settings Configuration settings.
 */
var config$15 = function config(settings) {
  impl$16 = settings.impl;
};

/**
 * {@link rtvref.validator.type_validator Validator} for the
 *  {@link rtvref.types.OBJECT OBJECT} type.
 * @function rtvref.validator.valObject.default
 * @param {*} v Value to validate.
 * @param {string} [q] Validation qualifier. Defaults to
 *  {@link rtvref.qualifiers.REQUIRED REQUIRED}.
 * @param {rtvref.types.numeric_args} [args] Type arguments.
 * @returns {(rtvref.RtvSuccess|rtvref.RtvError)} An `RtvSuccess` if valid; `RtvError` if not.
 */
function valObject(v) {
  var q = arguments.length > 1 && arguments[1] !== undefined ? arguments[1] : REQUIRED$16;
  var args = arguments[2];

  if (nilPermitted(v, q)) {
    return new RtvSuccess();
  }

  if (!isObject$1(v)) {
    return new RtvError(v, impl$16.toTypeset(type$9, q), [], impl$16.toTypeset(type$9, q, true));
  }

  // args is the optional shape: ignore if it isn't a shape, like other validators
  //  ignore invalid args properties
  var shape = args && isShape(args) ? args : undefined;
  var err = void 0; // @type {(RtvError|undefined)}

  // only consider enumerable, own-properties of the shape
  forEach_1(shape, function (typeset, prop) {
    var result = impl$16.check(v[prop], typeset); // check prop value against shape prop typeset

    if (!result.valid) {
      err = new RtvError(v, shape, [prop].concat(result.path), result.cause);
    }

    return !err; // break on first error
  });

  return err || new RtvSuccess();
}

var valObject$1 = Object.freeze({
	get _impl () { return impl$16; },
	type: type$9,
	config: config$15,
	default: valObject
});

////// valPlainObject validator

var REQUIRED$17 = qualifiers.REQUIRED;

var impl$17 = void 0; // @type {rtvref.impl}

/**
 * {@link rtvref.validator.validator_config Configuration Function}
  * @function rtvref.validator.valPlainObject.config
 * @param {rtvref.validator.validator_config_settings} settings Configuration settings.
 */
var config$16 = function config(settings) {
  impl$17 = settings.impl;
};

/**
 * {@link rtvref.validator.type_validator Validator} for the
 *  {@link rtvref.types.PLAIN_OBJECT PLAIN_OBJECT} type.
 * @function rtvref.validator.valPlainObject.default
 * @param {*} v Value to validate.
 * @param {string} [q] Validation qualifier. Defaults to
 *  {@link rtvref.qualifiers.REQUIRED REQUIRED}.
 * @param {rtvref.types.numeric_args} [args] Type arguments.
 * @returns {(rtvref.RtvSuccess|rtvref.RtvError)} An `RtvSuccess` if valid; `RtvError` if not.
 */
function valPlainObject(v) {
  var q = arguments.length > 1 && arguments[1] !== undefined ? arguments[1] : REQUIRED$17;
  var args = arguments[2];

  if (nilPermitted(v, q)) {
    return new RtvSuccess();
  }

  if (!isPlainObject$1(v)) {
    return new RtvError(v, impl$17.toTypeset(type$20, q), [], impl$17.toTypeset(type$20, q, true));
  }

  // args is the optional shape: ignore if it isn't a shape, like other validators
  //  ignore invalid args properties
  var shape = args && isShape(args) ? args : undefined;
  var err = void 0; // @type {(RtvError|undefined)}

  // only consider enumerable, own-properties of the shape
  forEach_1(shape, function (typeset, prop) {
    var result = impl$17.check(v[prop], typeset); // check prop value against shape prop typeset

    if (!result.valid) {
      err = new RtvError(v, shape, [prop].concat(result.path), result.cause);
    }

    return !err; // break on first error
  });

  return err || new RtvSuccess();
}

var valPlainObject$1 = Object.freeze({
	get _impl () { return impl$17; },
	type: type$20,
	config: config$16,
	default: valPlainObject
});

////// valPromise validator

var REQUIRED$18 = qualifiers.REQUIRED;

var impl$18 = void 0; // @type {rtvref.impl}

/**
 * {@link rtvref.validator.validator_config Configuration Function}
  * @function rtvref.validator.valPromise.config
 * @param {rtvref.validator.validator_config_settings} settings Configuration settings.
 */
var config$17 = function config(settings) {
  impl$18 = settings.impl;
};

/**
 * {@link rtvref.validator.type_validator Validator} for the
 *  {@link rtvref.types.PROMISE PROMISE} type.
 * @function rtvref.validator.valPromise.default
 * @param {*} v Value to validate.
 * @param {string} [q] Validation qualifier. Defaults to
 *  {@link rtvref.qualifiers.REQUIRED REQUIRED}.
 * @returns {(rtvref.RtvSuccess|rtvref.RtvError)} An `RtvSuccess` if valid; `RtvError` if not.
 */
function valPromise(v) {
  var q = arguments.length > 1 && arguments[1] !== undefined ? arguments[1] : REQUIRED$18;

  if (nilPermitted(v, q)) {
    return new RtvSuccess();
  }

  if (isPromise(v)) {
    return new RtvSuccess();
  }

  return new RtvError(v, impl$18.toTypeset(type$8, q), [], impl$18.toTypeset(type$8, q, true));
}

var valPromise$1 = Object.freeze({
	get _impl () { return impl$18; },
	type: type$8,
	config: config$17,
	default: valPromise
});

////// valRegExp validator

var REQUIRED$19 = qualifiers.REQUIRED;

var impl$19 = void 0; // @type {rtvref.impl}

/**
 * {@link rtvref.validator.validator_config Configuration Function}
  * @function rtvref.validator.valRegExp.config
 * @param {rtvref.validator.validator_config_settings} settings Configuration settings.
 */
var config$18 = function config(settings) {
  impl$19 = settings.impl;
};

/**
 * {@link rtvref.validator.type_validator Validator} for the
 *  {@link rtvref.types.REGEXP REGEXP} type.
 * @function rtvref.validator.valRegExp.default
 * @param {*} v Value to validate.
 * @param {string} [q] Validation qualifier. Defaults to
 *  {@link rtvref.qualifiers.REQUIRED REQUIRED}.
 * @returns {(rtvref.RtvSuccess|rtvref.RtvError)} An `RtvSuccess` if valid; `RtvError` if not.
 */
function valRegExp(v) {
  var q = arguments.length > 1 && arguments[1] !== undefined ? arguments[1] : REQUIRED$19;

  if (nilPermitted(v, q)) {
    return new RtvSuccess();
  }

  if (isRegExp$1(v)) {
    return new RtvSuccess();
  }

  return new RtvError(v, impl$19.toTypeset(type$5, q), [], impl$19.toTypeset(type$5, q, true));
}

var valRegExp$1 = Object.freeze({
	get _impl () { return impl$19; },
	type: type$5,
	config: config$18,
	default: valRegExp
});

/** Used as references for various `Number` constants. */
var MAX_SAFE_INTEGER$2 = 9007199254740991;

/**
 * Checks if `value` is a safe integer. An integer is safe if it's an IEEE-754
 * double precision number which isn't the result of a rounded unsafe integer.
 *
 * **Note:** This method is based on
 * [`Number.isSafeInteger`](https://mdn.io/Number/isSafeInteger).
 *
 * @static
 * @memberOf _
 * @since 4.0.0
 * @category Lang
 * @param {*} value The value to check.
 * @returns {boolean} Returns `true` if `value` is a safe integer, else `false`.
 * @example
 *
 * _.isSafeInteger(3);
 * // => true
 *
 * _.isSafeInteger(Number.MIN_VALUE);
 * // => false
 *
 * _.isSafeInteger(Infinity);
 * // => false
 *
 * _.isSafeInteger('3');
 * // => false
 */
function isSafeInteger(value) {
  return isInteger_1(value) && value >= -MAX_SAFE_INTEGER$2 && value <= MAX_SAFE_INTEGER$2;
}

var isSafeInteger_1 = isSafeInteger;

////// isSafeInt validation

/**
 * Type: {@link rtvref.types.SAFE_INT SAFE_INT}
 * @const {string} rtvref.validation.isSafeInt.type
 */
var type$27 = types.SAFE_INT;

/**
 * {@link rtvref.validation.method Validation} for the
 *  {@link rtvref.types.SAFE_INT SAFE_INT} type.
 *
 * Determines if a value is an integer literal __only__ (i.e. a
 *  {@link rtvref.types.primitives primitive}). It does not validate
 *  `new Number(1)`, which is an object that is a number.
 *
 * @function rtvref.validation.isSafeInt.default
 * @param {*} v Value to validate.
 * @returns {boolean} `true` if validated; `false` otherwise.
 */
function isSafeInt(v) {
  return isSafeInteger_1(v); // eliminates NaN, +/-Infinity, floats, unsafe ints
}

////// valSafeInt validator

var REQUIRED$20 = qualifiers.REQUIRED;

var impl$20 = void 0; // @type {rtvref.impl}

/**
 * {@link rtvref.validator.validator_config Configuration Function}
  * @function rtvref.validator.valSafeInt.config
 * @param {rtvref.validator.validator_config_settings} settings Configuration settings.
 */
var config$19 = function config(settings) {
  impl$20 = settings.impl;
};

/**
 * {@link rtvref.validator.type_validator Validator} for the
 *  {@link rtvref.types.SAFE_INT SAFE_INT} type.
 *
 * Determines if a value is a number literal __only__ (i.e. a
 *  {@link rtvref.types.primitives primitive}). It does not validate
 *  `new Number(1)`, which is an object that is a number.
 *
 * @function rtvref.validator.valSafeInt.default
 * @param {*} v Value to validate.
 * @param {string} [q] Validation qualifier. Defaults to
 *  {@link rtvref.qualifiers.REQUIRED REQUIRED}.
 * @param {rtvref.types.numeric_args} [args] Type arguments.
 * @returns {(rtvref.RtvSuccess|rtvref.RtvError)} An `RtvSuccess` if valid; `RtvError` if not.
 */
function valSafeInt(v) {
  var q = arguments.length > 1 && arguments[1] !== undefined ? arguments[1] : REQUIRED$20;
  var args = arguments[2];

  if (nilPermitted(v, q)) {
    return new RtvSuccess();
  }

  var valid = isSafeInt(v);

  if (valid && args) {
    // then check args against normal type range
    if (isSafeInt(args.exact)) {
      valid = v === args.exact;
    } else {
      var min = void 0;
      if (valid && isSafeInt(args.min)) {
        min = args.min;
        valid = v >= min;
      }

      if (valid && isSafeInt(args.max)) {
        if (min === undefined || args.max >= min) {
          valid = v <= args.max;
        } // else, ignore
      }
    }
  }

  if (valid) {
    return new RtvSuccess();
  }

  return new RtvError(v, impl$20.toTypeset(type$27, q, args), [], impl$20.toTypeset(type$27, q, args, true));
}

var valSafeInt$1 = Object.freeze({
	get _impl () { return impl$20; },
	type: type$27,
	config: config$19,
	default: valSafeInt
});

////// valSet validator

var REQUIRED$21 = qualifiers.REQUIRED;

var impl$21 = void 0; // @type {rtvref.impl}

/**
 * {@link rtvref.validator.validator_config Configuration Function}
  * @function rtvref.validator.valSet.config
 * @param {rtvref.validator.validator_config_settings} settings Configuration settings.
 */
var config$20 = function config(settings) {
  impl$21 = settings.impl;
};

/**
 * {@link rtvref.validator.type_validator Validator} for the
 *  {@link rtvref.types.SET SET} type.
 * @function rtvref.validator.valSet.default
 * @param {*} v Value to validate.
 * @param {string} [q] Validation qualifier. Defaults to
 *  {@link rtvref.qualifiers.REQUIRED REQUIRED}.
 * @param {rtvref.types.collection_args} [args] Type arguments.
 * @returns {(rtvref.RtvSuccess|rtvref.RtvError)} An `RtvSuccess` if valid; `RtvError` if not.
 */
function valSet(v) {
  var q = arguments.length > 1 && arguments[1] !== undefined ? arguments[1] : REQUIRED$21;
  var args = arguments[2];

  if (nilPermitted(v, q)) {
    return new RtvSuccess();
  }

  var valid = isSet$1(v);
  var result = void 0; // @type {(rtvref.RtvSuccess|rtvref.RtvError)}

  if (valid && args) {
    // then check args
    // start with the easiest/most efficient test: length
    if (valid && isFinite$1(args.length) && args.length >= 0) {
      valid = v.size === args.length;
    }

    // remaining args, if specified, require iterating potentially the entire set
    if (valid) {
      // get the typeset for values
      var tsValues = isTypeset(args.values) ? args.values : undefined;

      if (tsValues) {
        var it = v.values(); // iterator of straight values

        var _iteratorNormalCompletion = true;
        var _didIteratorError = false;
        var _iteratorError = undefined;

        try {
          for (var _iterator = it[Symbol.iterator](), _step; !(_iteratorNormalCompletion = (_step = _iterator.next()).done); _iteratorNormalCompletion = true) {
            var elem = _step.value;

            result = impl$21.check(elem, tsValues); // check value against typeset
            valid = result.valid;

            if (!result.valid) {
              // create a new error from the original, but with the value prepended to
              //  the path (since sets don't have indexes; they just have unique values)
              result = new RtvError(v, impl$21.toTypeset(type$3, q, args), [print(elem)].concat(result.path), result.cause);
            }

            if (!valid) {
              // break on first invalid value
              break;
            }
          }
        } catch (err) {
          _didIteratorError = true;
          _iteratorError = err;
        } finally {
          try {
            if (!_iteratorNormalCompletion && _iterator.return) {
              _iterator.return();
            }
          } finally {
            if (_didIteratorError) {
              throw _iteratorError;
            }
          }
        }
      }
    }
  }

  if (!result) {
    if (valid) {
      result = new RtvSuccess();
    } else {
      result = new RtvError(v, impl$21.toTypeset(type$3, q, args), [], impl$21.toTypeset(type$3, q, args, true));
    }
  }

  return result;
}

var valSet$1 = Object.freeze({
	get _impl () { return impl$21; },
	type: type$3,
	config: config$20,
	default: valSet
});

////// valString validator

var REQUIRED$22 = qualifiers.REQUIRED;

var impl$22 = void 0; // @type {rtvref.impl}

/**
 * {@link rtvref.validator.validator_config Configuration Function}
  * @function rtvref.validator.valString.config
 * @param {rtvref.validator.validator_config_settings} settings Configuration settings.
 */
var config$21 = function config(settings) {
  impl$22 = settings.impl;
};

/**
 * {@link rtvref.validator.type_validator Validator} for the
 *  {@link rtvref.types.STRING STRING} type.
 *
 * Determines if a value is a string literal __only__ (i.e. a
 *  {@link rtvref.types.primitives primitive}). It does not validate
 *  `new String('value')`, which is an object that is a string.
 *
 * @function rtvref.validator.valString.default
 * @param {*} v Value to validate.
 * @param {string} [q] Validation qualifier. Defaults to
 *  {@link rtvref.qualifiers.REQUIRED REQUIRED}.
 * @param {rtvref.types.STRING_args} [args] Type arguments.
 * @returns {(rtvref.RtvSuccess|rtvref.RtvError)} An `RtvSuccess` if valid; `RtvError` if not.
 */
function valString(v) {
  var q = arguments.length > 1 && arguments[1] !== undefined ? arguments[1] : REQUIRED$22;
  var args = arguments[2];

  if (nilPermitted(v, q)) {
    return new RtvSuccess();
  }

  var valid = isString(v) || q !== REQUIRED$22 && v === '';

  if (valid && args) {
    // then check args
    if (isString(args.exact)) {
      // empty string OK
      valid = v === args.exact;
    } else {
      var min = void 0;
      if (valid && isFinite$1(args.min) && args.min >= 0) {
        min = args.min;
        valid = v.length >= min;
      }

      if (valid && isFinite$1(args.max) && args.max >= 0) {
        if (min === undefined || args.max >= min) {
          valid = v.length <= args.max;
        } // else, ignore
      }

      if (valid && args.partial) {
        valid = v.includes(args.partial);
      }
    }
  }

  if (valid) {
    return new RtvSuccess();
  }

  return new RtvError(v, impl$22.toTypeset(type$10, q, args), [], impl$22.toTypeset(type$10, q, args, true));
}

var valString$1 = Object.freeze({
	get _impl () { return impl$22; },
	type: type$10,
	config: config$21,
	default: valString
});

////// isSymbol validation

/**
 * Type: {@link rtvref.types.SYMBOL SYMBOL}
 * @const {string} rtvref.validation.isSymbol.type
 */
var type$28 = types.SYMBOL;

/**
 * {@link rtvref.validation.method Validation} for the
 *  {@link rtvref.types.SYMBOL SYMBOL} type.
 * @function rtvref.validation.isSymbol.default
 * @param {*} v Value to validate.
 * @returns {boolean} `true` if validated; `false` otherwise.
 */
function isSymbol$1(v) {
  return isSymbol_1(v);
}

////// valSymbol validator

var REQUIRED$23 = qualifiers.REQUIRED;

var impl$23 = void 0; // @type {rtvref.impl}

/**
 * {@link rtvref.validator.validator_config Configuration Function}
  * @function rtvref.validator.valSymbol.config
 * @param {rtvref.validator.validator_config_settings} settings Configuration settings.
 */
var config$22 = function config(settings) {
  impl$23 = settings.impl;
};

/**
 * {@link rtvref.validator.type_validator Validator} for the
 *  {@link rtvref.types.SYMBOL SYMBOL} type.
 * @function rtvref.validator.valSymbol.default
 * @param {*} v Value to validate.
 * @param {string} [q] Validation qualifier. Defaults to
 *  {@link rtvref.qualifiers.REQUIRED REQUIRED}.
 * @returns {(rtvref.RtvSuccess|rtvref.RtvError)} An `RtvSuccess` if valid; `RtvError` if not.
 */
function valSymbol(v) {
  var q = arguments.length > 1 && arguments[1] !== undefined ? arguments[1] : REQUIRED$23;

  if (nilPermitted(v, q)) {
    return new RtvSuccess();
  }

  if (isSymbol$1(v)) {
    return new RtvSuccess();
  }

  return new RtvError(v, impl$23.toTypeset(type$28, q), [], impl$23.toTypeset(type$28, q, true));
}

var valSymbol$1 = Object.freeze({
	get _impl () { return impl$23; },
	type: type$28,
	config: config$22,
	default: valSymbol
});

////// valWeakMap validator

var REQUIRED$24 = qualifiers.REQUIRED;

var impl$24 = void 0; // @type {rtvref.impl}

/**
 * {@link rtvref.validator.validator_config Configuration Function}
  * @function rtvref.validator.valWeakMap.config
 * @param {rtvref.validator.validator_config_settings} settings Configuration settings.
 */
var config$23 = function config(settings) {
  impl$24 = settings.impl;
};

/**
 * {@link rtvref.validator.type_validator Validator} for the
 *  {@link rtvref.types.WEAK_MAP WEAK_MAP} type.
 * @function rtvref.validator.valWeakMap.default
 * @param {*} v Value to validate.
 * @param {string} [q] Validation qualifier. Defaults to
 *  {@link rtvref.qualifiers.REQUIRED REQUIRED}.
 * @returns {(rtvref.RtvSuccess|rtvref.RtvError)} An `RtvSuccess` if valid; `RtvError` if not.
 */
function valWeakMap(v) {
  var q = arguments.length > 1 && arguments[1] !== undefined ? arguments[1] : REQUIRED$24;

  if (nilPermitted(v, q)) {
    return new RtvSuccess();
  }

  if (isWeakMap$1(v)) {
    return new RtvSuccess();
  }

  return new RtvError(v, impl$24.toTypeset(type$2, q), [], impl$24.toTypeset(type$2, q, true));
}

var valWeakMap$1 = Object.freeze({
	get _impl () { return impl$24; },
	type: type$2,
	config: config$23,
	default: valWeakMap
});

////// valWeakSet validator

var REQUIRED$25 = qualifiers.REQUIRED;

var impl$25 = void 0; // @type {rtvref.impl}

/**
 * {@link rtvref.validator.validator_config Configuration Function}
  * @function rtvref.validator.valWeakSet.config
 * @param {rtvref.validator.validator_config_settings} settings Configuration settings.
 */
var config$24 = function config(settings) {
  impl$25 = settings.impl;
};

/**
 * {@link rtvref.validator.type_validator Validator} for the
 *  {@link rtvref.types.WEAK_SET WEAK_SET} type.
 * @function rtvref.validator.valWeakSet.default
 * @param {*} v Value to validate.
 * @param {string} [q] Validation qualifier. Defaults to
 *  {@link rtvref.qualifiers.REQUIRED REQUIRED}.
 * @returns {(rtvref.RtvSuccess|rtvref.RtvError)} An `RtvSuccess` if valid; `RtvError` if not.
 */
function valWeakSet(v) {
  var q = arguments.length > 1 && arguments[1] !== undefined ? arguments[1] : REQUIRED$25;

  if (nilPermitted(v, q)) {
    return new RtvSuccess();
  }

  if (isWeakSet$1(v)) {
    return new RtvSuccess();
  }

  return new RtvError(v, impl$25.toTypeset(type$4, q), [], impl$25.toTypeset(type$4, q, true));
}

var valWeakSet$1 = Object.freeze({
	get _impl () { return impl$25; },
	type: type$4,
	config: config$24,
	default: valWeakSet
});

////// Main entry point

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
 *  along with possible types. Only enumerable, own-properties of the shape are
 *  considered part of the shape.
 *
 * When a value is {@link rtv.check checked} or {@link rtv.verify verified} against
 *  a given shape, _properties on the value that are not part of the shape are
 *  ignored_. If successfully checked/verified, the value is guaranteed to provide
 *  the properties described in the shape, and each property is guaranteed to be
 *  assigned to a value of at least one type described in each property's typeset.
 *
 * The shape descriptor itself must be an {@link rtvref.types.OBJECT OBJECT}.
 *
 * @typedef {Object} rtvref.shape_descriptor
 * @see {@link rtvref.validation.isShape}
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
   * Determines if a value is a typeset.
   * @function rtv.isTypeset
   * @see {@link rtvref.validation.isTypeset.default}
   */
  isTypeset: isTypeset,

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
  check: function check(value, typeset) {
    if (this.config.enabled) {
      return impl.check(value, typeset);
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
 * [Internal] Library version.
 * @private
 * @name rtv._version
 * @type {string}
 */
Object.defineProperty(rtv, '_version', {
  enumerable: false, // internal
  configurable: true,
  writable: true,
  value: version
});

////////////////////////////////////////////////////////////////////////////////
// Register all known types with impl

(function () {
  // put in an IIFE so there's nothing unnecessarily retained in any closures
  // TODO[plugins]: In the future, with plugins, this should be dynamically-generated somehow.
  var validators = [valAny$1, valAnyObject$1, valArray$1, valBoolean$1, valClassObject$1, valDate$1, valError$1, valFinite$1, valFunction$1, valHashMap$1, valInt$1, valJson$1, valNull$1, valMap$1, valNumber$1, valObject$1, valPlainObject$1, valPromise$1, valRegExp$1, valSafeInt$1, valSet$1, valString$1, valSymbol$1, valWeakMap$1, valWeakSet$1];

  var publicImpl = {}; // impl for validators, excluding any internal parts

  Object.keys(impl).forEach(function (k) {
    // only enumerable methods/properties
    publicImpl[k] = impl[k];
  });

  validators.forEach(function (val) {
    val.config({ impl: publicImpl });
    impl._registerType(val);
  });
})();

export default rtv;
//# sourceMappingURL=rtv.esm.js.map
