////// RtvError Class

import { check as isTypeset } from './validation/isTypeset';
import { check as isArray } from './validation/isArray';
import { check as isError } from './validation/isError';

import { print } from './util';

// @type {function} The super class.
const extendsFrom = Error;

// Renders a path array as a string.
// @param {Array.<string>} path
// @returns {string}
const renderPath = function (path) {
  // returns '/' if the path is empty
  return path.reduce(function (strPath, elem) {
    // cast `elem` to string rather than print() to avoid quotes (should be a
    //  string anyway)
    return `${strPath}${strPath === '/' ? '' : '/'}${elem + ''}`;
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
 *  {@link rtvref.types.shape_descriptor shape} or {@link rtvref.types.typeset typeset}
 *  (note that a shape is a type of typeset).
 *
 * @class rtvref.RtvError
 * @extends {external:JS_Error}
 * @param {*} value The value being verified.
 * @param {rtvref.types.typeset} typeset The typeset used for verification.
 * @param {Array.<string>} path The path deep into `value` where the failure occurred.
 *  An empty array signifies the _root_ (top-level) value that was checked.
 * @param {rtvref.types.fully_qualified_typeset} mismatch The fully qualified typeset
 *  that resulted in the failed validation. This is normally the fully-qualified version
 *  of `typeset`, but could be a subtype if `typeset` is an Array typeset or a
 *  {@link rtvref.types.shape_descriptor shape descriptor}.
 * @param {(rtvref.RtvError|Error)} [rootCause] {@link rtvref.types.custom_validator Custom Validator}
 *  error, if the `RtvError` is a result of a failed custom validation and the validator threw an
 *  exception; or some other nested error that was the root cause for the failed validation.
 * @throws {Error} If `typeset`, `path`, or `mismatch` is invalid.
 */
export const RtvError = function (value, typeset, path, mismatch, rootCause) {
  // NOTE: We're using the old ES5 way of doing classical inheritance rather than
  //  an ES6 'class' because extending from Error doesn't appear to work very well,
  //  at least not with Babel 6.x. It seems OK in Node 9.x, however. Anyway,
  //  declaring it as `class RtvError extends Error {...}` and then attempting to
  //  override `toString()` does not work. Calls to this method, whether direct
  //  or implicit, continue to call `Error.prototype.toString()`, as confirmed
  //  by checking the prototype chain, which isn't properly constructed.

  if (!isTypeset(typeset)) {
    throw new Error(`Invalid typeset: ${print(typeset, { isTypeset: true })}`);
  }

  if (!isArray(path)) {
    throw new Error(`Invalid path: ${print(path)}`);
  }

  if (!isTypeset(mismatch, { fullyQualified: true })) {
    throw new Error(
      `Invalid mismatch (expecting fully-qualified typeset): ${print(mismatch, {
        isTypeset: true,
      })}`
    );
  }

  if (rootCause && !isError(rootCause)) {
    throw new Error(
      `Invalid rootCause (expecting JavaScript Error): ${print(rootCause)}`
    );
  } else if (!rootCause) {
    rootCause = undefined; // normalize falsy values
  }

  // NOTE: For some reason, calling `extendsFrom.call(this, message)` has
  //  no effect on `this` whatsoever, perhaps because it's calling native code,
  //  or there's something strange about the built-in Error type, so we just
  //  call the super's constructor as a formality.
  extendsFrom.call(this);

  this.name = 'RtvError';

  // NOTE: for security reasons, no part of the value should be included in the
  //  message in case it contains sensitive information like secrets or passwords
  // NOTE: we don't include the `typeset` in the message since it could be VERY long;
  //  the `path` and `mismatch` should be enough for debugging purposes
  this.message = `Verification failed: path="${renderPath(
    path
  )}", mismatch=${print(mismatch, { isTypeset: true })}`;
  if (rootCause) {
    this.message += `, rootCause="${rootCause.message}"`;
  }

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
      value: false,
    },

    /**
     * Value that failed verification against the
     *  {@link rtvref.RtvError#typeset typeset}.
     * @readonly
     * @name rtvref.RtvError#value
     * @type {*}
     */
    value: {
      enumerable: true,
      configurable: true,
      get() {
        return value;
      },
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
      get() {
        return typeset;
      },
    },

    /**
     * Path from {@link rtvref.RtvError#value value} to the nested property that
     *  caused the failure.
     *
     * Note that paths into collections such as {@link rtvref.types.HASH_MAP HASH_MAP}
     *  or ES6 structures such as {@link rtvref.types.MAP MAP}, where it's possible
     *  to specify arguments to verify keys vs values, will have elements with special
     *  prefixes to differentiate whether the path points to a key ("`key={key-name}`")
     *  or a value ("`valueKey={key-name}`").
     *
     * For example, given the has map `{hello: 'world'}`, if all keys were supposed to be
     *  numerical, then the path for the validation error would be `["key=hello"]`, indicating
     *  that the problem occurred with the __key__ named "hello", not the associated __value__.
     *
     * If, however, keys could be anything, but values had to be numerical, then the path
     *  would be `["valueKey=hello"]`, indicating that the problem occurred with the __value__
     *  associated to the key rather than the key itself.
     *
     * <h4>SECURITY</h4>
     *
     * Some collection types, such as {@link rtvref.types.MAP MAP} and
     *  {@link rtvref.types.SET SET}, can have actual objects as keys or elements,
     *  and these are used (in JSON-stringified form) as part of the error path.
     *  If these objects happen to contain sensitive information, that information
     *  may end-up in the path, and the path gets included in this error's
     *  `message` property, which may get logged by your systems.
     *
     * Other object types where keys can technically be any string value could also
     *  contain sensitive information depending on how these keys are defined. These
     *  keys will also end-up in the path that gets included in this error's `message`
     *  property.
     *
     * __It is YOUR responsibility to exercise necessary caution when validating
     *  data structures containing sensitive data.__
     *
     * @readonly
     * @name rtvref.RtvError#path
     * @type {Array.<string>}
     */
    path: {
      enumerable: true,
      configurable: true,
      get() {
        return path;
      },
    },

    /**
     * {@link rtvref.types.fully_qualified_typeset Fully qualified typeset} that caused the
     *  validation error (i.e. the mismatched subtype). This will be a subset/subtype of the
     *  {@link rtvref.RtvError#typeset typeset}, and possibly of a nested typeset within it,
     *  expressing only the direct cause of the error.
     *
     * For example, of `typeset` is `[[rtv.STRING]]` (a required array of required strings),
     *  and `value` is `['a', 2]`, this property would be `[rtv.REQUIRED, rtv.STRING]`
     *  because the validation error would ultimately have been caused by the nested
     *  `rtv.STRING` typeset.
     *
     * Remember that the fully-qualified `typeset` would be
     *  `[rtv.REQUIRED, rtv.ARRAY, {$: [rtv.REQUIRED, rtv.STRING]}]`, which demonstrates
     *  that `[rtv.REQUIRED, rtv.STRING]` is indeed a subset/subtype.
     *
     * @readonly
     * @name rtvref.RtvError#mismatch
     * @type {rtvref.types.fully_qualified_typeset}
     */
    mismatch: {
      enumerable: true,
      configurable: true,
      get() {
        return mismatch;
      },
    },

    /**
     * Validation error thrown by a {@link rtvref.types.custom_validator Custom Validator},
     *  which resulted in this `RtvError`. `undefined` if this error was not the result
     *  of a failed custom validation. If the custom validator throw an error, this will
     *  be a reference to the error it threw; otherwise, it'll be a generic `Error`
     *  generated by the library.
     * @readonly
     * @name rtvref.RtvError#rootCause
     * @type {(Error|undefined)}
     */
    rootCause: {
      enumerable: true,
      configurable: true,
      get() {
        return rootCause;
      },
    },
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
  // NOTE: for security reasons, no part of the value should be included in the
  //  serialization in case it contains sensitive information like secrets or
  //  passwords
  // NOTE: we don't include the `typeset` in the serialization since it could be VERY long;
  //  the `path` and `mismatch` should be enough for debugging purposes

  let str = `{rtvref.RtvError path="${renderPath(
    this.path
  )}", mismatch=${print(this.mismatch, { isTypeset: true })}`;

  if (this.rootCause) {
    str += `, rootCause="${this.rootCause.message}"`;
  } else {
    str += ', rootCause=<none>';
  }

  str += '}';

  return str;
};
