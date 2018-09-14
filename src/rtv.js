////// Main entry point

import {version as VERSION} from '../package.json';
import impl from './lib/impl';
import types from './lib/types';
import qualifiers from './lib/qualifiers';
import RtvSuccess from './lib/RtvSuccess';
import isTypeset from './lib/validation/isTypeset';

// all known types
// TODO[plugins]: In the future, with plugins, this should be dynamically-generated somehow.
import * as valAny from './lib/validator/valAny';
import * as valAnyObject from './lib/validator/valAnyObject';
import * as valArray from './lib/validator/valArray';
import * as valBoolean from './lib/validator/valBoolean';
import * as valClassObject from './lib/validator/valClassObject';
import * as valDate from './lib/validator/valDate';
import * as valError from './lib/validator/valError';
import * as valFinite from './lib/validator/valFinite';
import * as valFloat from './lib/validator/valFloat';
import * as valFunction from './lib/validator/valFunction';
import * as valHashMap from './lib/validator/valHashMap';
import * as valInt from './lib/validator/valInt';
import * as valJson from './lib/validator/valJson';
import * as valMap from './lib/validator/valMap';
import * as valNull from './lib/validator/valNull';
import * as valNumber from './lib/validator/valNumber';
import * as valObject from './lib/validator/valObject';
import * as valPlainObject from './lib/validator/valPlainObject';
import * as valPromise from './lib/validator/valPromise';
import * as valRegExp from './lib/validator/valRegExp';
import * as valSafeInt from './lib/validator/valSafeInt';
import * as valSet from './lib/validator/valSet';
import * as valString from './lib/validator/valString';
import * as valSymbol from './lib/validator/valSymbol';
import * as valWeakMap from './lib/validator/valWeakMap';
import * as valWeakSet from './lib/validator/valWeakSet';

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
const rtv = {
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
  isTypeset,

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
  check(value, typeset) {
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
  c(value, typeset) {
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
  verify(value, typeset) {
    if (this.config.enabled) {
      const result = this.check(value, typeset);
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
  v(value, typeset) {
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
    enabled: (function() {
      let value = true;
      return {
        enumerable: true,
        configurable: true,
        get() {
          return value;
        },
        set(newValue) {
          rtv.verify(newValue, rtv.t.BOOLEAN);
          value = newValue;
        }
      };
    })()
  }),

  /**
   * Shortcut proxy for reading {@link rtv.config.enabled}.
   * @readonly
   * @name rtv.e
   * @type {boolean}
   */
  get e() {
    return this.config.enabled;
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
  value: VERSION
});

export default rtv;

////////////////////////////////////////////////////////////////////////////////
// Register all known types with impl

(function() { // put in an IIFE so there's nothing unnecessarily retained in any closures
  // TODO[plugins]: In the future, with plugins, this should be dynamically-generated somehow.
  const validators = [
    valAny,
    valAnyObject,
    valArray,
    valBoolean,
    valClassObject,
    valDate,
    valError,
    valFinite,
    valFloat,
    valFunction,
    valHashMap,
    valInt,
    valJson,
    valNull,
    valMap,
    valNumber,
    valObject,
    valPlainObject,
    valPromise,
    valRegExp,
    valSafeInt,
    valSet,
    valString,
    valSymbol,
    valWeakMap,
    valWeakSet
  ];

  const publicImpl = {}; // impl for validators, excluding any internal parts

  Object.keys(impl).forEach(function(k) { // only enumerable methods/properties
    publicImpl[k] = impl[k];
  });

  validators.forEach(function(val) {
    val.config({impl: publicImpl});
    impl._registerType(val);
  });
})();
