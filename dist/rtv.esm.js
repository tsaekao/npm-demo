/*!
* rtvjs 0.0.1
* @license MIT, https://gitlab.com/stefcameron/rtvjs/blob/master/LICENSE.md
* Parts of Lodash used internally: https://github.com/lodash/lodash/
*/
var version = "0.0.1";

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

var defineProperty = function (obj, key, value) {
  if (key in obj) {
    Object.defineProperty(obj, key, {
      value: value,
      enumerable: true,
      configurable: true,
      writable: true
    });
  } else {
    obj[key] = value;
  }

  return obj;
};

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

////// Enumeration

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
 */

/**
 * <h3>Collection Arguments</h3>
 *
 * Describes the keys and values in a collection-based object, which is one of
 *  the following types:
 *
 * - {@link rtvref.types.MAP_OBJECT MAP_OBJECT} (NOTE: only __own-enumerable
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
 *  If the type is {@link rtvref.types.MAP_OBJECT MAP_OBJECT}, this argument is
 *   hard set to the {@link rtvref.types.STRING STRING} type due to the nature of
 *   its JavaScript `Object`-based implementation and does not need to be specified.
 *
 *  Applies to: {@link rtvref.types.MAP_OBJECT MAP_OBJECT} (with restrictions),
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
 *  Applies to: {@link rtvref.types.MAP_OBJECT MAP_OBJECT},
 *   {@link rtvref.types.MAP MAP}, {@link rtvref.types.MAP WEAK_MAP}.
 *
 * @property {string} [keyFlagSpec] A string specifying any flags to use with
 *  the regular expression specified in `keyExp`. Ignored if _falsy_ or if
 *  `keyExp` is not specified. See the
 *  {@link https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/RegExp RegExp#flags}
 *  parameter for more information.
 *
 *  Applies to: {@link rtvref.types.MAP_OBJECT MAP_OBJECT},
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
 *   of _implied_ {@link rtvref.types.OBJECT OBJECT} type (unless paired with a specific
 *   object type like {@link rtvref.types.PLAIN_OBJECT PLAIN_OBJECT}, for example, when
 *   using the `Array` notation, e.g. `[PLAIN_OBJECT, {...}]`). If the object is empty
 *   (has no properties), nothing will be verified (anything will pass).
 * - `String`: For a single type, such as {@link rtvref.types.FINITE FINITE}
 *   for a finite number. Must be one of the types defined in {@link rtvref.types}.
 * - `Function`: For a {@link rtvref.types.property_validator property validator}
 *   that will verify the value of the property using custom code. Since the Array
 *   form is not being used (only the validator is being provided), it's always
 *   invoked immediately. Since a type is not provided, the {@link rtvref.types.ANY ANY}
 *   type is implied.
 * - `Array`: For multiple type possibilities, optionally {@link rtvref.qualifiers qualified},
 *   using an __OR__ conjunction, which means the value of the property being described must
 *   match at _least one_ of the types listed, but not all. Matching is done in a short-circuit
 *   fashion, from the first to the last element in the typeset. If a simpler type is likely,
 *   it's more performant to specify it first/earlier in the typeset to avoid a match attempt
 *   on a nested shape or Array.
 *   - Cannot be an empty Array.
 *   - A given type may not be included more than once in the typeset, but may appear
 *     again in a nested typeset (when a parent typeset describes an
 *     {@link rtfref.types.ARRAY Array} or type of {@link rtfref.types.OBJECT Object}).
 *   - An Array is necessary to {@link rtvref.qualifiers qualify} the typeset as not
 *     required (see _Typeset Qualifiers_ below).
 *   - An Array is necessary if a type needs or requires
 *     {@link rtvref.types.type_arguments arguments}.
 *   - If the __first__ element (or second, if a {@link rtvref.types.qualifiers qualifier}
 *     is provided, but the typeset is not
 *     {@link rtvref.types.fully_qualified_typeset fully-qualified}), is an `Object`,
 *     it's treated as a nested {@link rtvref.shape_descriptor shape descriptor}
 *     describing an object of the default {@link rtvref.types.OBJECT OBJECT} type.
 *     To include a shape descriptor at any other position within the array, it
 *     __must__ be preceded by a type, even if the default `OBJECT` type is being
 *     used (i.e. `OBJECT` must be specified as the type).
 *   - If an element is an `Array` (any position), it's treated as a __nested list__
 *     with an implied {@link rtvref.types.ARRAY ARRAY} type, e.g.
 *     `[BOOLEAN, [STRING, FINITE]]` would describe a property that should be a boolean,
 *     or an array of non-empty strings or finite numbers. See the `ARRAY` type
 *     reference for more information on _shorthand_ and _full_ notations.
 *   - If an element is a `Function`, it must be the __last__ element in the Array
 *     and will be treated as a {@link rtvref.types.property_validator property validator}.
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
 *  parameter given to a {@link rtvref.types.property_validator property validator}.
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
 * <h3>Property Validator</h3>
 *
 * A function used as a {@link rtvref.types.typeset typeset}, or as a subset to
 *  a typeset, to provide custom verification of the value being verified.
 *
 * A typeset may only have one validator, and the validator is only called if
 *  the value being verified was verified by at least one type in the typeset.
 *  The validator must be the __last__ element within the typeset (if the typeset
 *  is an array, and a validator is needed). The validator must also be
 *  specified _after_ the {@link rtvref.qualifiers qualifier} in a typeset Array.
 *  The validator is invoked immediately after the first type match, but only if
 *  a type match is made. If the typeset is not
 *  {@link rtvref.types.fully_qualified_typeset fully-qualified} and does not
 *  explicitly specify a type, the {@link rtvref.types.ANY ANY} type is implied.
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

// Creates a definition object.
// @param {string} value Type value. Must not be empty.
// @param {boolean} [hasArgs=false] If the type takes arguments.
// @param {boolean} [isObject=false] If the type is an object type.
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
  ANY: def('any'),

  // TODO[future]: Add 'exp: string' and 'expFlags: string' args (strings because of JSON requirement...)
  //  for a regular expression test. Similar prop names to collection_args.
  /**
   * <h3>String Arguments</h3>
   * @typedef {Object} rtvref.types.STRING_args
   * @property {string} [exact] An exact string to match.
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
   * Arguments (optional): {@link rtvref.types.numeric_args}
   *
   * @name rtvref.types.NUMBER
   * @const {string}
   * @see {@link rtvref.qualifiers}
   * @see {@link rtvref.types.FINITE}
   */
  NUMBER: def('number', true),

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
  FINITE: def('finite', true),

  /**
   * Int rules per qualifiers: Must be a {@link rtvref.types.FINITE finite} integer,
   *  but is not necessarily _safe_. It must also be a number
   *  {@link rtvref.types.primitives primitive}.
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
  INT: def('int', true),

  /**
   * Float rules per qualifiers: Must be a {@link rtvref.types.FINITE finite}
   *  floating point number. It must also be a number
   *  {@link rtvref.types.primitives primitive}.
   *
   * Arguments (optional): {@link rtvref.types.numeric_args}
   *
   * @name rtvref.types.FLOAT
   * @const {string}
   * @see {@link rtvref.qualifiers}
   * @see {@link rtvref.types.INT}
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
   * Arguments (optional): {@link rtvref.types.ARRAY_args}. Note that the `ARRAY`
   *  type must be specified when using arguments (i.e. the shorthand notation
   *  cannot be used).
   *
   * When describing arrays, either _shorthand_ or _full_ notation may be used.
   *  In the shorthand notation, the `ARRAY` type isn't necessary, but
   *  {@link rtvref.types.ARRAY_args arguments} can't be specified. In the full
   *  notation, the `ARRAY` type is required, but arguments can optionally be
   *  specified.
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
   * The 'value' property must be either a boolean, or an array (possibly empty) of
   *  finite numbers of any value.
   *
   * <pre><code>{
   *   value: [BOOLEAN, [FINITE]]
   * }
   * </code></pre>
   *
   * <h4>Example: Full notation</h4>
   *
   * The 'value' property must be an array (possibly empty) of finite numbers of
   *  any value.
   *
   * <pre><code>{
   *   value: [ARRAY, [FINITE]]
   * }
   * </code></pre>
   *
   * <h4>Example: Full, mixed types, arguments</h4>
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
   * @see {@link rtvref.types.MAP_OBJECT}
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
   * @see {@link rtvref.types.MAP_OBJECT}
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
   * @see {@link rtvref.types.MAP_OBJECT}
   */
  PLAIN_OBJECT: def('plainObject', true, true),

  /**
   * {@link rtvref.types.CLASS_OBJECT CLASS_OBJECT} arguments.
   * @typedef {Object} rtvref.types.CLASS_OBJECT_args
   * @property {function} [ctr] A reference to a constructor function. If specified,
   *  the class object (instance) must have this class function in its inheritance
   *  chain such that `<class_object> instanceof <function> === true`. Note that
   *  this property is not serializable to JSON. If not specified, then the object
   *  must be an {@link rtvref.types.OBJECT OBJECT} that is not a
   *  {@link rtvref.types.PLAIN_OBJECT PLAIN_OBJECT} among the other values that
   *  are not considered class objects.
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
  CLASS_OBJECT: def('classObject', true, true),

  /**
   * A _map_ object is an {@link rtvref.types.OBJECT OBJECT} that is treated as a
   *  hash map with an expected set of keys and values. Keys can be described
   *  using a regular expression, and values can be described using a
   *  {@link rtvref.types.typeset typeset}. Empty maps are permitted.
   *
   * Map object rules per qualifiers: Same as {@link rtvref.types.OBJECT OBJECT} rules.
   *
   * Arguments (optional): {@link rtvref.types.collection_args}
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
  MAP_OBJECT: def('mapObject', true, true),

  /**
   * An ES6 map supports any value as its keys, unlike a
   *  {@link rtvref.types.MAP_OBJECT MAP_OBJECT} that only supports strings. Keys can
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
   * @see {@link rtvref.types.MAP_OBJECT}
   * @see {@link rtvref.types.WEAK_MAP}
   */
  MAP: def('map', true),

  /**
   * An ES6 weak map supports any _object_ as its keys, unlike a
   *  {@link rtvref.types.MAP_OBJECT MAP_OBJECT} that only supports strings,
   *  and a {@link rtvref.types.MAP MAP} that supports any type of value.
   *
   * Weak map rules per qualifiers: Must be a `WeakMap` instance.
   *
   * @name rtvref.types.WEAK_MAP
   * @const {string}
   * @see {@link rtvref.qualifiers}
   * @see {@link rtvref.types.MAP_OBJECT}
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
}());

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
}());

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
}());

////// isAny validator

/**
 * {@link rtvref.validation.validator Validator} function for the
 *  {@link rtvref.types.ANY ANY} type.
 * @function rtvref.validation.isAny
 * @param {*} v Value to validate.
 * @returns {boolean} `true` if validated; `false` otherwise.
 */
var validator = function isAny(v) {
  return true; // anything goes, even undefined and null
};

var type = types.ANY;

////// isBoolean validator

/**
 * {@link rtvref.validation.validator Validator} function for the
 *  {@link rtvref.types.BOOLEAN BOOLEAN} type.
 *
 * Determines if a value is a boolean literal __only__ (i.e. a
 *  {@link rtvref.types.primitives primitive}). It does not validate
 *  `new Boolean(true)`, which is an object that is a boolean.
 *
 * @function rtvref.validation.isBoolean
 * @param {*} v Value to validate.
 * @returns {boolean} `true` if validated; `false` otherwise.
 */
var validator$1 = function isBoolean(v) {
  return v === true || v === false;
};

var type$1 = types.BOOLEAN;

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

////// Qualifier Definitions

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
// ^^^^^^^ INSERT NEW QUALIFIERS ^^^^^^^ ABOVE THIS SECTION ^^^^^^^
//

/**
 * Default qualifier: {@link rtvref.qualifiers.REQUIRED}
 * @const {string} rtvref.qualifiers.DEFAULT_QUALIFIER
 */
var DEFAULT_QUALIFIER = REQUIRED;

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

////// isFinite validator

/**
 * {@link rtvref.validation.validator Validator} function for the
 *  {@link rtvref.types.FINITE FINITE} type.
 *
 * Determines if a value is a number literal __only__ (i.e. a
 *  {@link rtvref.types.primitives primitive}). It does not validate
 *  `new Number(1)`, which is an object that is a number.
 *
 * @function rtvref.validation.isFinite
 * @param {*} v Value to validate.
 * @param {string} [q] Validation qualifier. Defaults to
 *  {@link rtvref.qualifiers.REQUIRED REQUIRED}.
 * @param {rtvref.types.numeric_args} [args] Type arguments.
 * @returns {boolean} `true` if validated; `false` otherwise.
 */
var validator$2 = function isFinite(v) {
  var args = arguments[2];

  var valid = _isFinite(v); // eliminates NaN, +/-Infinity

  if (valid && args) {
    // then check args
    if (_isFinite(args.exact)) {
      // ignore if NaN, +/-Infinity
      valid = v === args.exact;
    } else {
      var min = void 0;
      if (valid && _isFinite(args.min)) {
        // ignore if NaN, +/-Infinity
        min = args.min;
        valid = v >= min;
      }

      if (valid && _isFinite(args.max)) {
        // ignore if NaN, +/-Infinity
        if (min === undefined || args.max >= min) {
          valid = v <= args.max;
        } // else, ignore
      }
    }
  }

  return valid;
};

var type$2 = types.FINITE;

////// isString validator

/**
 * {@link rtvref.validation.validator Validator} function for the
 *  {@link rtvref.types.STRING STRING} type.
 *
 * Determines if a value is a string literal __only__ (i.e. a
 *  {@link rtvref.types.primitives primitive}). It does not validate
 *  `new String('value')`, which is an object that is a string.
 *
 * @function rtvref.validation.isString
 * @param {*} v Value to validate.
 * @param {string} [q] Validation qualifier. Defaults to
 *  {@link rtvref.qualifiers.REQUIRED REQUIRED}.
 * @param {rtvref.types.STRING_args} [args] Type arguments.
 * @returns {boolean} `true` if validated; `false` otherwise.
 */
var validator$3 = function isString(v) {
  var q = arguments.length > 1 && arguments[1] !== undefined ? arguments[1] : qualifiers.REQUIRED;
  var args = arguments[2];

  var valid = typeof v === 'string';

  if (valid) {
    if (q === qualifiers.REQUIRED) {
      valid = !!v; // cannot be empty when required
    }

    if (valid && args) {
      // then check args
      if (isString(args.exact, qualifiers.EXPECTED)) {
        valid = v === args.exact;
      } else {
        var min = void 0;
        if (valid && validator$2(args.min) && args.min >= 0) {
          min = args.min;
          valid = v.length >= min;
        }

        if (valid && validator$2(args.max) && args.max >= 0) {
          if (min === undefined || args.max >= min) {
            valid = v.length <= args.max;
          } // else, ignore
        }

        if (valid && args.partial) {
          valid = v.includes(args.partial);
        }
      }
    }
  }

  return valid;
};

var type$3 = types.STRING;

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

////// isFunction validator

/**
 * {@link rtvref.validation.validator Validator} function for the
 *  {@link rtvref.types.FUNCTION FUNCTION} type.
 * @function rtvref.validation.isFunction
 * @param {*} v Value to validate.
 * @returns {boolean} `true` if validated; `false` otherwise.
 */
var validator$4 = function isFunction(v) {
  return isFunction_1(v);
};

var type$4 = types.FUNCTION;

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

////// isRegExp validator

/**
 * {@link rtvref.validation.validator Validator} function for the
 *  {@link rtvref.types.REGEXP REGEXP} type.
 * @function rtvref.validation.isRegExp
 * @param {*} v Value to validate.
 * @returns {boolean} `true` if validated; `false` otherwise.
 */
var validator$5 = function isRegExp(v) {
  return isRegExp_1(v);
};

var type$5 = types.REGEXP;

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

////// isSymbol validator

/**
 * {@link rtvref.validation.validator Validator} function for the
 *  {@link rtvref.types.SYMBOL SYMBOL} type.
 * @function rtvref.validation.isSymbol
 * @param {*} v Value to validate.
 * @returns {boolean} `true` if validated; `false` otherwise.
 */
var validator$6 = function isSymbol(v) {
  return isSymbol_1(v);
};

var type$6 = types.SYMBOL;

/** `Object#toString` result references. */
var numberTag = '[object Number]';

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
    (isObjectLike_1(value) && _baseGetTag(value) == numberTag);
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

////// isNumber validator

/**
 * {@link rtvref.validation.validator Validator} function for the
 *  {@link rtvref.types.NUMBER NUMBER} type.
 *
 * Determines if a value is a number literal __only__ (i.e. a
 *  {@link rtvref.types.primitives primitive}). It does not validate
 *  `new Number(1)`, which is an object that is a number.
 *
 * @function rtvref.validation.isNumber
 * @param {*} v Value to validate.
 * @param {string} [q] Validation qualifier. Defaults to
 *  {@link rtvref.qualifiers.REQUIRED REQUIRED}.
 * @param {rtvref.types.numeric_args} [args] Type arguments.
 * @returns {boolean} `true` if validated; `false` otherwise.
 */
var validator$7 = function isNumber(v) {
  var q = arguments.length > 1 && arguments[1] !== undefined ? arguments[1] : qualifiers.REQUIRED;
  var args = arguments[2];

  var valid = typeof v === 'number';

  if (valid) {
    if (q === qualifiers.REQUIRED) {
      // cannot be NaN
      valid = !_isNaN(v);
    }

    if (valid && args) {
      // then check args
      if (isNumber_1(args.exact)) {
        // NaN OK for this arg (careful: NaN !== NaN...)
        valid = v === args.exact || _isNaN(v) && _isNaN(args.exact);
      } else {
        var min = void 0;
        if (valid && isNumber_1(args.min) && !_isNaN(args.min)) {
          min = args.min;
          valid = v >= min;
        }

        if (valid && isNumber_1(args.max) && !_isNaN(args.max)) {
          if (min === undefined || args.max >= min) {
            valid = v <= args.max;
          } // else, ignore
        }
      }
    }
  }

  return valid;
};

var type$7 = types.NUMBER;

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

////// isArray validator

/**
 * {@link rtvref.validation.validator Validator} function for the
 *  {@link rtvref.types.ARRAY ARRAY} type.
 * @function rtvref.validation.isArray
 * @param {*} v Value to validate.
 * @param {string} [q] Validation qualifier. Defaults to
 *  {@link rtvref.qualifiers.REQUIRED REQUIRED}.
 * @param {rtvref.types.ARRAY_args} [args] Type arguments.
 * @returns {boolean} `true` if validated; `false` otherwise.
 */
var validator$8 = function isArray(v) {
  var args = arguments[2];

  var valid = isArray_1(v);

  if (valid && args) {
    // then check args
    if (validator$2(args.length) && args.length >= 0) {
      valid = v.length === args.length;
    } else {
      var min = void 0;
      if (valid && validator$2(args.min) && args.min >= 0) {
        min = args.min;
        valid = v.length >= min;
      }

      if (valid && validator$2(args.max) && args.max >= 0) {
        if (min === undefined || args.max >= min) {
          valid = v.length <= args.max;
        } // else, ignore
      }
    }
  }

  return valid;
};

var type$8 = types.ARRAY;

////// isAnyObject validator

/**
 * {@link rtvref.validation.validator Validator} function for the
 *  {@link rtvref.types.ANY_OBJECT ANY_OBJECT} type.
 *
 * Determines if a value is _any_ type of object except a primitive.
 *
 * @function rtvref.validation.isAnyObject
 * @param {*} v Value to validate.
 * @returns {boolean} `true` if validated; `false` otherwise.
 */
var validator$9 = function isAnyObject(v) {
  return isObject_1(v);
};

var type$9 = types.ANY_OBJECT;

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

////// isWeakMap validator

/**
 * {@link rtvref.validation.validator Validator} function for the
 *  {@link rtvref.types.WEAK_MAP WEAK_MAP} type.
 * @function rtvref.validation.isWeakMap
 * @param {*} v Value to validate.
 * @returns {boolean} `true` if validated; `false` otherwise.
 */
var validator$10 = function isWeakMap(v) {
  return isWeakMap_1(v);
};

var type$10 = types.WEAK_MAP;

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

////// isWeakSet validator

/**
 * {@link rtvref.validation.validator Validator} function for the
 *  {@link rtvref.types.WEAK_SET WEAK_SET} type.
 * @function rtvref.validation.isWeakSet
 * @param {*} v Value to validate.
 * @returns {boolean} `true` if validated; `false` otherwise.
 */
var validator$11 = function isWeakSet(v) {
  return isWeakSet_1(v);
};

var type$11 = types.WEAK_SET;

////// isObject validator

/**
 * {@link rtvref.validation.validator Validator} function for the
 *  {@link rtvref.types.OBJECT OBJECT} type.
 *
 * Determines if a value is an object that extends from `JavaScript.Object` and
 *  is not a function, array, regex, map, weak map, set, weak set, or primitive.
 *
 * @function rtvref.validation.isObject
 * @param {*} v Value to validate.
 * @returns {boolean} `true` if validated; `false` otherwise.
 */
var validator$12 = function isObject(v) {
  // no qualifier rules, no args
  return isObjectLike_1(v) && // excludes primitives and functions
  !validator$8(v) && // excludes arrays which are otherwise object-like (typeof [] === 'object')
  !isMap_1(v) && !validator$10(v) && // excludes weak/maps
  !isSet_1(v) && !validator$11(v) && // excludes weak/sets
  !validator$5(v); // excludes regex
};

var type$12 = types.OBJECT;

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
var objectProto$3 = Object.prototype;

/** Used to check objects for own properties. */
var hasOwnProperty$2 = objectProto$3.hasOwnProperty;

/** Built-in value references. */
var propertyIsEnumerable = objectProto$3.propertyIsEnumerable;

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
  return isObjectLike_1(value) && hasOwnProperty$2.call(value, 'callee') &&
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
    dateTag = '[object Date]',
    errorTag = '[object Error]',
    funcTag$1 = '[object Function]',
    mapTag$2 = '[object Map]',
    numberTag$1 = '[object Number]',
    objectTag$1 = '[object Object]',
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
typedArrayTags[dataViewTag$1] = typedArrayTags[dateTag] =
typedArrayTags[errorTag] = typedArrayTags[funcTag$1] =
typedArrayTags[mapTag$2] = typedArrayTags[numberTag$1] =
typedArrayTags[objectTag$1] = typedArrayTags[regexpTag$1] =
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
var objectProto$4 = Object.prototype;

/** Used to check objects for own properties. */
var hasOwnProperty$3 = objectProto$4.hasOwnProperty;

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
    if ((inherited || hasOwnProperty$3.call(value, key)) &&
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
var objectProto$5 = Object.prototype;

/**
 * Checks if `value` is likely a prototype object.
 *
 * @private
 * @param {*} value The value to check.
 * @returns {boolean} Returns `true` if `value` is a prototype, else `false`.
 */
function isPrototype(value) {
  var Ctor = value && value.constructor,
      proto = (typeof Ctor == 'function' && Ctor.prototype) || objectProto$5;

  return value === proto;
}

var _isPrototype = isPrototype;

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

/* Built-in method references for those with the same name as other `lodash` methods. */
var nativeKeys = _overArg(Object.keys, Object);

var _nativeKeys = nativeKeys;

/** Used for built-in method references. */
var objectProto$6 = Object.prototype;

/** Used to check objects for own properties. */
var hasOwnProperty$4 = objectProto$6.hasOwnProperty;

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
    if (hasOwnProperty$4.call(object, key) && key != 'constructor') {
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

////// Validation Module

/**
 * Determines if a value is a typeset.
 * @function rtvref.validation.isValidTypeset
 * @param {*} v Value to validate.
 * @param {Object} [options] Validation options.
 * @param {boolean} [options.deep=false] If truthy, deeply-validates any nested typesets. Note
 *  that typesets in nested shapes are also deeply-validated.
 * @param {boolean} [options.fullyQualified=false] If truthy, the typeset must be fully-qualified.
 * @returns {boolean} `true` if it is; `false` otherwise.
 * @see {@link rtvref.types.typeset}
 */
var isTypeset = function isTypeset(v) {
  var _ref = arguments.length > 1 && arguments[1] !== undefined ? arguments[1] : {},
      _ref$deep = _ref.deep,
      deep = _ref$deep === undefined ? false : _ref$deep,
      _ref$fullyQualified = _ref.fullyQualified,
      fullyQualified = _ref$fullyQualified === undefined ? false : _ref$fullyQualified;

  var valid = !!(v && (validator$12(v) || validator$3(v) && types.check(v) || validator$4(v) || validator$8(v) && v.length > 0));

  // FIRST: check if needs to be fully-qualified, and check deep within if requested
  if (valid && fullyQualified) {
    // must now be an array with at least 2 elements: [qualifier, type]
    if (validator$8(v) && v.length >= 2) {
      var usedTypes = {}; // @type {Object.<string,boolean>} map of simple type to `true`
      var curType = void 0; // @type {string} current in-scope type
      var argType = void 0; // @type {(string|undefined)} current in-scope type IIF it accepts args

      // Updates the current in-scope type (curType) and marks it as used in usedTypes.
      //  If the type has already been used, it sets valid to false.
      // @param {string} type New in-scope type.
      var updateCurType = function updateCurType(type) {
        // set the rule as the current in-scope type
        curType = type;

        if (usedTypes[curType]) {
          // a type cannot appear more than once in a typeset (but nested is OK)
          valid = false;
        }
        usedTypes[curType] = true;
      };

      // iterate through each element in the typeset array to make sure all required
      //  rules/properties of a fully-qualified typeset are specified
      forEach_1(v, function (rule, i) {
        if (i === 0) {
          // first position must always be the qualifier
          // more efficient to check for a string first than to always iterate
          //  all qualifiers (or all types, below) when it isn't since we know
          //  they're always strings
          valid = validator$3(rule) && !!qualifiers.check(rule);
        } else if (validator$3(rule)) {
          // additional qualifier, or simple type
          if (qualifiers.check(rule)) {
            // cannot have more than one qualifier and qualifier must be in first position
            //  (and this is not the first position because that's handled specially, above)
            valid = false;
          } else if (!types.check(rule)) {
            // if not a qualifier, it must be a valid type (since it's a string)
            valid = false;
          } else {
            // set the rule as the current in-scope type
            updateCurType(rule);

            // update the in-scope arg type: reset to undefined if it doesn't take
            //  args; otherwise, update it (NOTE: currently, there are no types that
            //  _require_ args, only ones that optionally have args, so we don't
            //  have to ensure that args were given when we change the type)
            argType = argTypes.check(rule);
          }
        } else if (validator$4(rule)) {
          // must be a validator, but there can't be more than 1, it must be
          //  in the last position (and always after the qualifier), and since
          //  the typeset must be FQ'd, we must have an in-scope type
          valid = !!(curType && i + 1 === v.length);
        } else if (validator$12(rule)) {
          // could be a shape, or type args (either way, it's a single object)
          // since the typeset must be fully-qualified, argType must already be
          //  a type that takes arguments, since arguments are always provided
          //  via objects (NOTE: for object types, the args are the shapes themselves,
          //  except for CLASS_OBJECT where the shape is specified within the args;
          //  still, there is always only ever at most one object per type that
          //  accepts args, never more)
          if (argType) {
            // consume the object as the in-scope arg type's arguments
            argType = undefined;
          } else {
            // since the typeset must be fully-qualified and we don't already
            //  have an in-scope arg type, the typeset is invalid
            valid = false;
          }

          // only go deep if the object is a shape, which means the current in-scope
          //  type must be an object type
          if (valid && deep && objTypes.check(curType)) {
            // if it's a class object, the shape is an optional sub-property of the object;
            //  if it's a map object, there is no shape; otherwise, it's the object itself
            var shape = curType === types.CLASS_OBJECT ? rule.shape : curType === types.MAP_OBJECT ? undefined : rule;

            // validate all of the shape's typesets (each own-prop should be a typeset)
            shape && forEach_1(shape, function (ts, prop) {
              valid = isTypeset(ts, { deep: deep, fullyQualified: fullyQualified }); // recursive
              return valid; // break on first invalid
            });
          }
        } else if (validator$8(rule)) {
          // nested typeset for an array type: in-scope type must be ARRAY
          if (curType === types.ARRAY) {
            // go deep if requested; otherwise, assume it's valid
            valid = !deep || isTypeset(rule, { deep: deep, fullyQualified: fullyQualified });
          } else {
            valid = false;
          }
        } else {
          // any other type in an array typeset is not supported
          valid = false;
        }

        return valid; // break if no longer valid
      });

      // make sure at least one type was specified
      valid = valid && !!curType;
    } else {
      // automatically invalid if not an array because a typeset must be in the
      //  array form in order to be FQ'd
      valid = false;
    }

    // NEXT: if it's an array, valid, and does not need to be FQ'd, check its
    //  definition, and deep (if requested)
  } else if (valid && !fullyQualified && validator$8(v)) {
    var _usedTypes = {}; // @type {Object.<string,boolean>} map of simple type to `true`
    var _curType = void 0; // @type {string} current in-scope type
    var _argType = void 0; // @type {(string|undefined)} current in-scope type IIF it accepts args
    var hasQualifier = false; // true if a qualifier is specified (not implied)

    // Updates the current in-scope type (curType) and marks it as used in usedTypes.
    //  If the type has already been used, it sets valid to false.
    // @param {string} type New in-scope type.
    var _updateCurType = function _updateCurType(type) {
      // set the rule as the current in-scope type
      _curType = type;

      if (_usedTypes[_curType]) {
        // a type cannot appear more than once in a typeset (but nested is OK)
        valid = false;
      }
      _usedTypes[_curType] = true;
    };

    // iterate through each element in the typeset array to make sure all required
    //  rules/properties of a typeset are specified
    forEach_1(v, function (rule, i) {
      if (validator$3(rule)) {
        if (qualifiers.check(rule)) {
          hasQualifier = true;
          valid = i === 0; // must be in the first position
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
        }
      } else if (validator$4(rule)) {
        // must be a validator, but there can't be more than 1, and it must be
        //  in the last position (and always after the qualifier, if any)
        valid = i + 1 === v.length;
        if (valid && !_curType) {
          // if we have a validator but no in-scope type, ANY is implied
          _updateCurType(types.ANY);
        }
      } else if (validator$12(rule)) {
        // could be a shape, or type args (either way, it's just one object)
        // NOTE: for object types, the args are the shapes themselves, except
        //  for CLASS_OBJECT where the shape is specified within the args; still,
        //  there is always only ever at most one object per type that accepts
        //  args, never more
        if (!_argType) {
          // since there's no in-scope arg type, the object must be a shape using
          //  the default OBJECT type, but it must be in the first position (or
          //  second if the first element was a qualifier)
          _updateCurType(DEFAULT_OBJECT_TYPE);
          valid = valid && (i === 0 || hasQualifier && i === 1);
          // NOTE: do not set argType because the shape is the default object type's
          //  args, so they should be consumed by the in-scope arg type
        } else {
          // consume the object as the in-scope arg type's arguments
          // NOTE: currently, there are no types that _require_ args, only ones
          //  that optionally have args, so we don't have to ensure that args
          //  were given when we change the type
          _argType = undefined;
        }

        // only go deep if the object is a shape, which means the current in-scope
        //  type must be an object type
        if (valid && deep && objTypes.check(_curType)) {
          // if it's a class object, the shape is an optional sub-property of the object;
          //  if it's a map object, there is no shape; otherwise, it's the object itself
          var shape = _curType === types.CLASS_OBJECT ? rule.shape : _curType === types.MAP_OBJECT ? undefined : rule;

          // validate all of the shape's typesets (each own-prop should be a typeset)
          shape && forEach_1(shape, function (ts, prop) {
            valid = isTypeset(ts, { deep: deep, fullyQualified: fullyQualified }); // recursive
            return valid; // break on first invalid
          });
        }
      } else if (validator$8(rule)) {
        // if the current in-scope type is not ARRAY, set it since a nested array
        //  implies the ARRAY type
        if (_curType !== types.ARRAY) {
          _updateCurType(types.ARRAY);
          // in this case, the in-scope arg type should be updated to ARRAY since
          //  arrays accept optional args, but since the current in-scope type
          //  was not set, this must be a short-hand ARRAY notation, which means
          //  args cannot be specified, therefore we update argType to undefined
          //  to clear it from the previous type (if it was set) and clear it
          //  from this type as well
          _argType = undefined;
        }

        if (valid && deep) {
          valid = isTypeset(rule, { deep: deep, fullyQualified: fullyQualified }); // recursive
        }
      } else {
        // any other type in an array typeset is not supported
        valid = false;
      }

      return valid; // break if no longer valid
    });

    // make sure at least one type was specified
    valid = valid && !!_curType;

    // NEXT: if it's a shape descriptor, check if deep is requested as long as it's
    //  valid and does not need to be FQ'd (otherwise, 'v' must be an array and
    //  would be invalid as a FQ'd typeset)
  } else if (valid && deep && !fullyQualified && validator$12(v)) {
    // we need to deep-validate a shape descriptor, which means each one of its
    //  own-properties must be a valid typeset
    var props = Object.keys(v);
    forEach_1(props, function (prop) {
      valid = isTypeset(v[prop], { deep: deep, fullyQualified: fullyQualified }); // recursive
      return valid; // break if no longer valid
    });
  }
  // else, must be invalid, or valid but non-array and doesn't need to be FQ'd
  //  (and we can't go deep because it isn't an array)

  return valid;
};

////// isMap validator

/**
 * Determines if a typeset represents a string, and only a string.
 * @param {rtvref.types.typeset} ts Typeset to check.
 * @return {boolean} `true` if so; `false` otherwise.
 */
var isStringTypeset = function isStringTypeset(ts) {
  var fqts = fullyQualify(ts);

  // must be `[qualifier, STRING]`, otherwise no
  return fqts.length === 2 && fqts[1] === types.STRING;
};

/**
 * {@link rtvref.validation.validator Validator} function for the
 *  {@link rtvref.types.MAP MAP} type.
 * @function rtvref.validation.isMap
 * @param {*} v Value to validate.
 * @param {string} [q] Validation qualifier. Defaults to
 *  {@link rtvref.qualifiers.REQUIRED REQUIRED}.
 * @param {rtvref.types.collection_args} [args] Type arguments.
 * @returns {boolean} `true` if validated; `false` otherwise.
 */
var validator$13 = function isMap(v) {
  var args = arguments[2];

  var valid = isMap_1(v);

  if (valid && args) {
    // then check args
    // start with the easiest/most efficient test: length
    if (valid && validator$2(args.length) && args.length >= 0) {
      valid = v.size === args.length;
    }

    // remaining args, if specified, require iterating potentially the entire map
    if (valid) {
      // get the typeset for keys
      var tsKeys = isTypeset(args.keys) ? args.keys : undefined;
      // get the key expression only if the keys are expected to be strings
      var tsKeysIsString = !!(tsKeys && isStringTypeset(tsKeys));
      var keyExp = tsKeysIsString && validator$3(args.keyExp) ? args.keyExp : undefined;
      // get the key expression flags only if we have a key expression
      var keyFlagSpec = keyExp && validator$3(args.keyFlagSpec) ? args.keyFlagSpec : undefined;
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
              valid = check(key, tsKeys).valid; // check key against typeset
              if (valid && tsKeysIsString && reKeys) {
                valid = reKeys.test(key); // check key against regex since it's a string
              }
            }

            if (valid && tsValues) {
              valid = check(value, tsValues).valid; // check value against typeset
            }

            if (!valid) {
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

  return valid;
};

var type$13 = types.MAP;

////// isSet validator

/**
 * {@link rtvref.validation.validator Validator} function for the
 *  {@link rtvref.types.SET SET} type.
 * @function rtvref.validation.isSet
 * @param {*} v Value to validate.
 * @param {string} [q] Validation qualifier. Defaults to
 *  {@link rtvref.qualifiers.REQUIRED REQUIRED}.
 * @param {rtvref.types.collection_args} [args] Type arguments.
 * @returns {boolean} `true` if validated; `false` otherwise.
 */
var validator$14 = function isSet(v) {
  var args = arguments[2];

  var valid = isSet_1(v);

  if (valid && args) {
    // then check args
    // start with the easiest/most efficient test: length
    if (valid && validator$2(args.length) && args.length >= 0) {
      valid = v.size === args.length;
    }

    // remaining args, if specified, require iterating potentially the entire set
    if (valid) {
      // get the typeset for values
      var tsValues = isTypeset(args.values) ? args.values : undefined;

      if (tsValues) {
        var it = v.entries(); // iterator

        var _iteratorNormalCompletion = true;
        var _didIteratorError = false;
        var _iteratorError = undefined;

        try {
          for (var _iterator = it[Symbol.iterator](), _step; !(_iteratorNormalCompletion = (_step = _iterator.next()).done); _iteratorNormalCompletion = true) {
            var elem = _step.value;

            var value = elem.value[1];
            valid = check(value, tsValues); // check value against typeset
            if (!valid) {
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

  return valid;
};

var type$14 = types.SET;

////// Utilities

// NOTE: Ideally, this module has no dependencies.

/**
 * RTV Utilities Module
 * @private
 * @namespace rtv.util
 */

/**
 * Pretty-print a value.
 * @function rtv.util.print
 * @param {*} value Value to print.
 * @returns {string} Pretty-printed value. It's not perfect and may not catch
 *  all types, but attempts to be good enough.
 */
var print = function print(value) {
  var replacer = function replacer(key, val) {
    if (typeof val === 'function') {
      return '<function>';
    } else if ((typeof val === 'undefined' ? 'undefined' : _typeof(val)) === 'symbol') {
      return '<<' + val.toString() + '>>';
    } else if (val === null || val === undefined) {
      return val + '';
    }

    return val;
  };

  // do an initial pass to see if we have a string
  var result = replacer(undefined, value);

  // if it's just a string, return it
  if (typeof result === 'string') {
    return result;
  }

  // otherwise, stringify it
  return JSON.stringify(value, replacer);
};

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
 * @param {string} path The path deep into `value` where the failure occurred.
 * @param {rtvref.types.fully_qualified_typeset} cause The fully qualified typeset
 *  that caused the failure.
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
    throw new Error('Invalid typeset: ' + typeset);
  }

  if (!validator$3(path)) {
    throw new Error('Invalid path: ' + path);
  }

  if (!isTypeset(cause, { fullyQualified: true })) {
    throw new Error('Invalid cause (expecting a fully-qualified typeset): ' + cause);
  }

  // NOTE: For some reason, calling `extendsFrom.call(this, message)` has
  //  no effect on `this` whatsoever, perhaps because it's calling native code,
  //  or there's something strange about the built-in Error type, so we just
  //  call the super's constructor as a formality.
  extendsFrom.call(this);
  this.message = 'Verification failed: value=' + value + ', path=' + path;
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
     * Path from `value` to the nested property that caused the failure.
     * @readonly
     * @name rtvref.RtvError#path
     * @type {string}
     */
    path: {
      enumerable: true,
      configurable: true,
      get: function get() {
        return path;
      }
    },

    /**
     * Fully qualified typeset that caused the failure. This will be a subset
     *  of `typeset`, and possibly of a nested typeset within `typeset`
     *  expressing only the direct cause of the failure.
     *
     * // TODO: make sure this is what it ends-up being...:
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
  return '{rtvref.RtvError value=' + this.value + ', path=' + this.path + '}';
};

var _validatorMap;

// @type {Object.<string,function>} Map of validator type (string) to validator
//  function.
// TODO: In the future, with plugins, this should be dynamically-generated somehow.
var validatorMap = (_validatorMap = {}, defineProperty(_validatorMap, type, validator), defineProperty(_validatorMap, type$1, validator$1), defineProperty(_validatorMap, type$3, validator$3), defineProperty(_validatorMap, type$4, validator$4), defineProperty(_validatorMap, type$5, validator$5), defineProperty(_validatorMap, type$6, validator$6), defineProperty(_validatorMap, type$2, validator$2), defineProperty(_validatorMap, type$7, validator$7), defineProperty(_validatorMap, type$8, validator$8), defineProperty(_validatorMap, type$9, validator$9), defineProperty(_validatorMap, type$12, validator$12), defineProperty(_validatorMap, type$13, validator$13), defineProperty(_validatorMap, type$10, validator$10), defineProperty(_validatorMap, type$14, validator$14), defineProperty(_validatorMap, type$11, validator$11), _validatorMap);

/**
 * RTV Implementation Module
 * @private
 * @namespace rtv.impl
 */

/**
 * Fully-qualifies a typeset, shallow (i.e. the first level only; nested typesets
 *  are not fully-qualified).
 *
 * This function does not modify the input `typeset`.
 *
 * @function rtv.impl.fullyQualify
 * @param {rtvref.types.typeset} typeset Typeset to fully-qualify.
 * @returns {rtvref.types.fully_qualified_typeset} A new, fully-qualified typeset
 *  representing the input `typeset`. Only the first/immediate level of the
 *  input typeset is fully-qualified. The new array returned contains references
 *  to elements within the input typeset.
 * @throws {Error} If `typeset` is not a valid typeset.
 */
var fullyQualify = function fullyQualify(typeset) {
  if (!isTypeset(typeset)) {
    // start by validating so we can be confident later
    throw new Error('Invalid typeset="' + print(typeset) + '"');
  }

  // NOTE: from this point on, we ASSUME that the typeset is valid, which lets
  //  us make assumptions about what we find within it; without this knowledge,
  //  the algorithm below would not work

  if (!validator$8(typeset)) {
    // must be either a string, object, or function with an implied qualifier
    if (validator$12(typeset)) {
      // must be a nested shape descriptor with default object type
      return [DEFAULT_QUALIFIER, DEFAULT_OBJECT_TYPE, typeset];
    }

    // if a function, it has an implied type of ANY
    if (validator$4(typeset)) {
      return [DEFAULT_QUALIFIER, types.ANY, typeset];
    }

    // string (basic type)
    return [DEFAULT_QUALIFIER, typeset];
  }

  var fqts = []; // ALWAYS a new array
  var curType = void 0; // @type {(string|undefined)} current type in scope or undefined if none

  // typeset is an array: iterate its elements and build fqts iteratively
  typeset.forEach(function (rule, i) {
    // qualifiers are non-empty strings
    if (i === 0 && (!validator$3(rule) || !qualifiers.check(rule))) {
      fqts.push(DEFAULT_QUALIFIER); // add implied qualifier
    }

    if (validator$3(rule)) {
      // must be a type
      curType = rule;
      fqts.push(curType);
    } else if (validator$12(rule)) {
      if (i === 0) {
        // must be a nested shape descriptor using default object type
        curType = DEFAULT_OBJECT_TYPE;
        fqts.push(curType, rule);
      } else {
        // must be args for curType since typeset is an array and object is not
        //  in first position
        fqts.push(rule);
      }
      // must be a validator, ANY is implied type if none specified
    } else if (validator$4(rule)) {
      if (!curType) {
        curType = types.ANY;
        fqts.push(curType);
      }

      fqts.push(rule);
    } else {
      // must be an array
      if (curType !== types.ARRAY) {
        // add implied ARRAY type
        curType = types.ARRAY;
        fqts.push(curType);
      }

      fqts.push(rule);
    }
  });

  return fqts;
};

/**
 * Checks a value against a simple type using the
 *  {@link rtvref.qualifiers.DEFAULT_QUALIFIER default qualifier}.
 * @function rtv.impl.checkSimple
 * @param {*} value Value to check.
 * @param {string} typeset Simple type name, must be one of {@link rtvref.types.types}.
 * @returns {(rtvref.RtvSuccess|rtvref.RtvError)} A success indicator if the
 *  `value` is compliant to the type; an error indicator if not.
 * @throws {Error} If `typeset` is not a valid type name.
 * @see {@link rtvref.types}
 */
var checkSimple = function checkSimple(value, typeset) {
  types.verify(typeset);

  if (validatorMap[typeset]) {
    // call the validator for the specified type
    var valid = validatorMap[typeset](value, DEFAULT_QUALIFIER);

    if (valid) {
      return new RtvSuccess();
    }

    return new RtvError(value, typeset, 'unknown.path', fullyQualify(typeset)); // TODO: add right params...
  }

  throw new Error('Missing validator for "' + print(typeset) + '" type');
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
    if (isTypeset(typeset)) {
      if (validator$3(typeset)) {
        return checkSimple(value, typeset);
      }

      // TODO other typeset types

      throw new Error('Missing handler for typeset="' + print(typeset) + '" type specified');
    } else {
      throw new Error('Invalid typeset="' + print(typeset) + '" specified');
    }
  } catch (checkErr) {
    var err = new Error('Cannot check value: ' + checkErr.message);
    err.rootCause = checkErr;
    throw err;
  }
};

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
