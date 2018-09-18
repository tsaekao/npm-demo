////// RtvError Class

import isTypeset from './validation/isTypeset';
import isArray from './validation/isArray';
import isError from './validation/isError';

import {print} from './util';

// @type {function} The super class.
const extendsFrom = Error;

// Renders a path array as a string.
// @param {Array.<string>} path
// @returns {string}
const renderPath = function(path) {
  // returns '/' if the path is empty
  return path.reduce(function(strPath, elem) {
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
 * @param {rtvref.types.fully_qualified_typeset} cause The fully qualified typeset
 *  that caused the failure. This is normally the fully-qualified version of `typeset`,
 *  but could be a sub-type if `typeset` is an Array typeset or a
 *  {@link rtvref.types.shape_descriptor shape descriptor}.
 * @param {Error} [failure] {@link rtvref.types.custom_validator Custom Validator}
 *  error, if the `RtvError` is a result of a failed custom validation.
 * @throws {Error} If `typeset`, `path`, or `cause` is invalid.
 */
const RtvError = function(value, typeset, path, cause, failure) {
  // NOTE: We're using the old ES5 way of doing classical inheritance rather than
  //  an ES6 'class' because extending from Error doesn't appear to work very well,
  //  at least not with Babel 6.x. It seems OK in Node 9.x, however. Anyway,
  //  declaring it as `class RtvError extends Error {...}` and then attempting to
  //  override `toString()` does not work. Calls to this method, whether direct
  //  or implicit, continue to call `Error.prototype.toString()`, as confirmed
  //  by checking the prototype chain, which isn't properly constructed.

  if (!isTypeset(typeset)) {
    throw new Error(`Invalid typeset: ${print(typeset)}`);
  }

  if (!isArray(path)) {
    throw new Error(`Invalid path: ${print(path)}`);
  }

  if (!isTypeset(cause, {fullyQualified: true})) {
    throw new Error(`Invalid cause (expecting a fully-qualified typeset): ${print(cause)}`);
  }

  if (failure && !isError(failure)) {
    throw new Error(`Invalid failure (expecting JavaScript Error): ${print(failure)}`);
  } else if (!failure) {
    failure = undefined; // normalize falsy values
  }

  // NOTE: For some reason, calling `extendsFrom.call(this, message)` has
  //  no effect on `this` whatsoever, perhaps because it's calling native code,
  //  or there's something strange about the built-in Error type, so we just
  //  call the super's constructor as a formality.
  extendsFrom.call(this);

  this.name = 'RtvError';
  this.message = `Verification failed: value=${print(value)}, path="${renderPath(path)}", cause=${print(cause)}`;
  if (failure) {
    this.message += `, failure="${failure.message}"`;
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
      get() {
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
      get() {
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
      get() {
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
      get() {
        return cause;
      }
    },

    /**
     * Validation error thrown by a {@link rtvref.types.custom_validator Custom Validator},
     *  which resulted in this `RtvError`. `undefined` if this error was not the result
     *  of a failed custom validation.
     * @readonly
     * @name rtvref.RtvError#failure
     * @type {(Error|undefined)}
     */
    failure: {
      enumerable: true,
      configurable: true,
      get() {
        return failure;
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
RtvError.prototype.toString = function() {
  let str = `{rtvref.RtvError value=${print(this.value)}, path="${renderPath(this.path)}", cause=${print(this.cause)}}`;

  if (this.failure) {
    str += `, failure="${this.failure.message}"`;
  } else {
    str += ', failure=<none>';
  }

  return str;
};

export default RtvError;
