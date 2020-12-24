////// Main entry point

import { version as VERSION } from '../package.json';
import impl from './lib/impl';
import { types } from './lib/types';
import { qualifiers } from './lib/qualifiers';
import { RtvSuccess } from './lib/RtvSuccess';
import { RtvError } from './lib/RtvError';
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
 * <h3>RTV.js Public Interface</h3>
 *
 * Provides the externally-facing API. It wraps the
 *  {@link rtvref.impl implementation}, adding a bit of syntactic sugar, and
 *  adds the {@link rtv.config configuration} facilities.
 *
 * @namespace rtv
 */
const rtv = {
  /**
   * Enumeration of {@link rtvref.types.types types}.
   *
   * __For convenience, each type is also available directly from this object__,
   *  e.g. `rtv.STRING`, `rtv.FINITE`, etc.
   *
   * The Enumeration can be used to perform additional validations (e.g.
   *  `rtv.types.verify('foo')` would throw because "foo" is not a valid type),
   *  however whether the type is referenced as `rtv.STRING` or `rtv.types.STRING`
   *  makes no difference to typeset validation.
   *
   * @readonly
   * @name rtv.types
   * @type {rtvref.Enumeration}
   */
  get types() {
    return types;
  },

  // also spread ALL enumerable properties of the enumeration into here so that
  //  we can just call `rtv.STRING` instead of `rtv.types.STRING`
  ...types,

  /**
   * Enumeration of {@link rtvref.qualifiers.qualifiers qualifiers}.
   *
   * __For convenience, each qualifier is also available directly from this object__,
   *  e.g. `rtv.EXPECTED`, `rtv.OPTIONAL`, etc.
   *
   * The Enumeration can be used to perform additional validations (e.g.
   *  `rtv.qualifiers.verify('x')` would throw because "x" is not a valid qualifier),
   *  however whether the qualifier is referenced as `rtv.EXPECTED` or
   *  `rtv.qualifiers.EXPECTED`` makes no difference to typeset validation.
   *
   * @readonly
   * @name rtv.qualifiers
   * @type {rtvref.Enumeration}
   */
  get qualifiers() {
    return qualifiers;
  },

  // also spread ALL enumerable properties of the enumeration into here so that
  //  we can just call `rtv.REQUIRED` instead of `rtv.qualifiers.REQUIRED`
  ...qualifiers,

  /**
   * Determines if a value is a typeset.
   * @function rtv.isTypeset
   * @see {@link rtvref.validation.isTypeset}
   */
  get isTypeset() {
    return isTypeset;
  },

  /**
   * Fully-qualifies a given typeset.
   * @function rtv.fullyQualify
   * @see {@link rtvref.impl.fullyQualify}
   */
  get fullyQualify() {
    return impl.fullyQualify;
  },

  /**
   * Shortcut proxy for reading {@link rtv.config.enabled}.
   * @readonly
   * @name rtv.enabled
   * @type {boolean}
   */
  get enabled() {
    return this.config.enabled;
  },

  /**
   * Library version.
   * @readonly
   * @name rtv.version
   * @type {string}
   */
  get version() {
    return VERSION;
  },

  /**
   * Checks a value against a typeset for compliance.
   * @function rtv.check
   * @param {*} value Value to check.
   * @param {rtvref.types.typeset} typeset Expected shape of (or typeset describing)
   *  the `value`. A shape is a kind of typeset. Normally, this is a
   *  {@link rtvref.types.shape_descriptor shape descriptor}.
   * @returns {(rtvref.RtvSuccess|rtvref.RtvError)} Success indicator if the
   *  `value` is compliant to the `shape`; `RtvError` if not. __Unlike
   *  {@link rtv.verify verify()}, an exception is not thrown__ if the
   *  `value` is non-compliant.
   *
   *  Since both {@link rtvref.RtvSuccess RtvSuccess} (returned when
   *   the check succeeds) as well as {@link rtvref.RtvError RtvError} (returned
   *   when the check fails) have a `valid: boolean` property in common, it's
   *   easy to test for success/failure like this:
   *   `if (rtv.check(2, rtv.FINITE).valid) {...}`.
   *
   *  __NOTE:__ This method always returns a success indicator if RTV.js is currently
   *   {@link rtv.config.enabled disabled}.
   *
   * @throws {Error} If `typeset` is not a valid typeset.
   * @see {@link rtv.verify}
   * @see {@link rtv.config.enabled}
   * @see {@link rtvref.types}
   * @see {@link rtvref.types.shape_descriptor}
   */
  check(value, typeset) {
    if (this.config.enabled) {
      return impl.check(value, typeset);
    }

    return new RtvSuccess();
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
   *  {@link rtvref.types.shape_descriptor shape descriptor}.
   * @returns {rtvref.RtvSuccess} Success indicator IIF the `value` is compliant
   *  to the `shape`. Otherwise, an {@link rtvref.RtvError RtvError} __is thrown__.
   * @throws {rtvref.RtvError} If the `value` is not compliant to the `shape`.
   * @throws {Error} If `typeset` is not a valid typeset.
   * @see {@link rtv.check}
   * @see {@link rtv.config.enabled}
   * @see {@link rtvref.types}
   * @see {@link rtvref.types.shape_descriptor}
   */
  verify(value, typeset) {
    if (this.config.enabled) {
      const result = this.check(value, typeset);
      if (result instanceof RtvSuccess) {
        return result;
      }

      throw result; // expected to be an RtvError
    }

    // NOTE: this method still returns a truthy value so that expressions like
    //  `rtv.enabled && rtv.verify(...) && do_something_on_success()` work when this
    //  method doesn't throw an exception
    return new RtvSuccess();
  },

  /**
   * Reference to the {@link rtvref.RtvSuccess RtvSuccess} class/constructor.
   *
   * This can be used to determine, for example, if the result of {@link rtv.check rtv.check()}
   *  is the success indicator: `if (result instanceof rtv.RtvSuccess) ...` Note that both
   *  {@link rtvref.RtvSuccess RtvSuccess} and {@link rtvref.RtvError RtvError} have a
   *  `valid: boolean` property which you can also use to easily test for success or failure.
   *
   * @type {function}
   * @see {@link rtv.check}
   */
  RtvSuccess,

  /**
   * Reference to the {@link rtvref.RtvError RtvError} class/constructor.
   *
   * This is useful if you need to determine whether an `Error` is an `RtvError`
   *  using the `instanceof` operator: `if (err instanceof rtv.RtvError) ...`
   *
   * @type {function}
   */
  RtvError,

  /**
   * <h3>RTV.js Configuration</h3>
   * @namespace rtv.config
   */
  config: Object.defineProperties(
    {},
    {
      /**
       * Globally enables or disables {@link rtv.verify} and {@link rtv.check}. When set
       *  to `false`, these methods are no-ops.
       *
       * Use this, or the shortcut {@link rtv.enabled}, to enable code optimization
       *  when building source with a bundler that supports _tree shaking_, like
       *  {@link https://rollupjs.org/ Rollup} or {@link https://webpack.js.org/ Webpack}.
       *
       * The following plugins can redefine the statement `rtv.enabled` or `rtv.config.enabled`
       *  as `false` prior to code optimizations that remove unreachable code:
       *
       * - Rollup: {@link https://github.com/rollup/rollup-plugin-replace rollup-plugin-replace}
       * - Webpack: {@link https://webpack.js.org/plugins/define-plugin/ DefinePlugin}
       *
       * <h4>Enabled Example: Rollup</h4>
       *
       * By conditionally calling {@link rtv.verify} based on the state of
       *  {@link rtv.config.enabled}, a bundler can be configured to completely
       *  remove the code from a production build.
       *
       * Given this module code snippet:
       *
       * <pre><code>...
       *
       * if (rtv.config.enabled) {
       *  rtv.verify(jsonResult, expectedShape);
       * }
       *
       * rtv.enabled && rtv.verify(jsonResult, expectedShape); // shorter
       *
       * ...
       * </code></pre>
       *
       * And using this `rollup.config.js` snippet:
       *
       * <pre><code>const replacePlugin = require('rollup-plugin-replace');
       *
       * module.exports = {
       *   ...
       *   plugins: [
       *     // invoke this plugin _before_ any other plugins
       *     replacePlugin({
       *       'rtv.enabled': 'false',
       *       'rtv.config.enabled': 'false'
       *     }),
       *     ...
       *   ]
       * };
       * </code></pre>
       *
       * The code in the module snippet above would be completely removed from the
       *  build's output, thereby removing any rtv.js overhead from production.
       *
       * @name rtv.config.enabled
       * @type {boolean}
       * @see {@link rtv.enabled}
       */
      enabled: (function () {
        let value = true;
        return {
          enumerable: true,
          configurable: true,
          get() {
            return value;
          },
          set(newValue) {
            rtv.verify(newValue, rtv.BOOLEAN);
            value = newValue;
          },
        };
      })(),
    }
  ),
};

export default rtv;

////////////////////////////////////////////////////////////////////////////////
// Register all known types with impl

(function () {
  // put in an IIFE so there's nothing unnecessarily retained in any closures
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
    valWeakSet,
  ];

  const publicImpl = {}; // impl for validators, excluding any internal parts

  Object.keys(impl).forEach(function (k) {
    // only enumerable methods/properties
    publicImpl[k] = impl[k];
  });

  validators.forEach(function (val) {
    val.config({ impl: publicImpl });
    impl._registerType(val);
  });
})();
