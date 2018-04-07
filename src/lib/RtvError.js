//// RtvError Class \\\\

import {isString, isTypeset} from './validation';

/**
 * Runtime Verification Error (extends `JavaScript.Error`)
 *
 * Describes a failed runtime verification of a value against a given
 *  {@link rtvref.shape_descriptor shape} or {@link rtvref.types.typeset typeset}
 *  (note that a shape is a type of typeset).
 *
 * @class rtvref.RtvError
 * @param {*} value The value being verified.
 * @param {rtvref.types.typeset} typeset The typeset used for verification.
 * @param {string} path The path deep into `value` where the failure occurred.
 * @param {rtvref.types.fully_qualified_typeset} cause The actual cause of
 *  the failure.
 * @throws {Error} If `typeset`, `path`, or `cause` is invalid.
 */
export default class RtvError extends Error {
  // JSDoc is provided at the @class level
  constructor(value, typeset, path, cause) {
    if (!isTypeset(typeset)) {
      throw new Error('Invalid typeset: ' + typeset);
    }

    if (!isString(path)) {
      throw new Error('Invalid path: ' + path);
    }

    if (!isTypeset(cause, true)) {
      throw new Error('Invalid cause (expecting a fully-qualified typeset): ' + cause);
    }

    super(`Verification failed: value=${value}, path=${path}`);
    this.name = 'RtvError';

    Object.defineProperties(this, {
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
       * Path from `value` to the nested property that caused the failure.
       * @readonly
       * @name rtvref.RtvError#path
       * @type {string}
       */
      path: {
        enumerable: true,
        configurable: true,
        get() {
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
        get() {
          return cause;
        }
      }
    });
  }

  /**
   * A string representation of this instance.
   * @method rtvref.RtvError#toString
   * @returns {string} String representation.
   */
  toString() {
    return `{rtvref.RtvError value=${this.value}, path=${this.path}}`;
  }
}
