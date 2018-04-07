//// Main entry point \\\\

import {version as VERSION} from '../package.json';
import * as impl from './lib/impl';
import types from './lib/types';
import qualifiers from './lib/qualifiers';

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
   * Checks a value against a shape for compliance.
   * @function rtv.check
   * @param {*} value Value to check.
   * @param {rtvref.types.typeset} shape Expected shape of the value.
   * @returns {(boolean|rtvref.RtvError)} `true` if the `value` is compliant to
   *  the `shape`; `RtvError` if not. An exception is __not__ thrown if the
   *  `value` is non-compliant. Test for `rtv.check(...) !== true`.
   *
   * __NOTE:__ This method always returns `true` if RTV.js is currently
   *  {@link rtv.config.enabled disabled}.
   *
   * @throws {Error} If `shape` is not a valid typeset.
   * @see {@link rtv.verify}
   */
  check(value, shape) {
    if (this.config.enabled) {
      return impl.check(value, shape);
    }

    return true;
  },

  /**
   * __Requires__ a value to be compliant to a shape.
   *
   * NOTE: This method does nothing if RTV.js is currently
   *  {@link rtv.config.enabled disabled}.
   *
   * @function rtv.verify
   * @param {*} value Value to check.
   * @param {rtvref.types.typeset} shape Expected shape of the value. Normally,
   *  this is a {@link rtvref.shape_descriptor shape descriptor}.
   * @throws {RtvError} If the `value` is not compliant to the `shape`.
   * @throws {Error} If `shape` is not a valid typeset.
   * @see {@link rtv.check}
   * @see {@link rtv.config.enabled}
   */
  verify(value, shape) {
    if (this.config.enabled) {
      const result = this.check(value, shape);
      if (result !== true) {
        throw result; // expected to be an RtvError
      }
    }
  },

  /**
   * Shortcut proxy to {@link rtv.verify}.
   * @param {*} value Value to check.
   * @param {rtvref.types.typeset} shape Expected shape of the value.
   * @throws {Error} If the `value` is not compliant to the `shape`.
   */
  v(value, shape) {
    this.verify(value, shape);
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
  },

  /**
   * Contextual RTV Generator // TODO[docs]
   * @function rtv.Context
   * @param {string} context
   */
  Context(context) {
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
  value: VERSION
});

export default rtv;
