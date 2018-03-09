//// Main entry point \\\\

'use strict';

import { default as isString } from 'lodash-es/isString';
import { version as VERSION } from '../package.json';
import * as typeMap from './lib/types';
import * as qualifierMap from './lib/qualiiers';
import Enumeration from './lib/Enumeration';

/**
 * RTV.js - Reference
 *
 * Members herein are _indirectly_ exposed through the {@link rtv} object.
 * @namespace rtvref
 */

/**
 * Shape Descriptor
 *
 * // TODO: document rtvref.shape_descriptor (already referenced)
 *
 * @typedef {Object} rtvref.shape_descriptor
 */

const types = new Enumeration(typeMap);
const qualifiers = new Enumeration(qualifierMap);

/**
 * RTV.js - Runtime Verification Library.
 * @namespace rtv
 */
const rtv = {
  /**
   * Enumeration of {@link rtvref.types types}.
   * @name rtv.t
   * @type {rtvref.Enumeration}
   */
  t: types,

  /**
   * Enumeration of {@link rtvref.qualifiers qualifiers}.
   * @name rtv.q
   * @type {rtvref.Enumeration}
   */
  q: qualifiers,

  /**
   * Checks a value against a shape for compliance.
   * @param {*} value Value to check.
   * @param {rtvref.types.typeset} shape Expected shape of the value.
   * @returns {Boolean} `true` if the `value` is compliant to the `shape`; `false`
   *  otherwise. An exception is __not__ thrown if the `value` is non-compliant.
   * @see rtv.verify
   */
  check(value, shape) {
    // TODO: testing 'check'
    return isString(value) && !!value;
  },

  /**
   * __Requires__ a value to be compliant to a shape.
   * @param {*} value Value to check.
   * @param {rtvref.types.typeset} shape Expected shape of the value.
   * @returns {Boolean} `true` if the `value` is compliant to the `shape`; otherwise,
   *  an exception is thrown.
   * @throws {Error} If the `value` is not compliant to the `shape`.
   * @see rtv.verify
   */
  verify(value, shape) {
    // TODO: testing 'verify'
    if (this.config.enabled) {
      if (!this.check(value, shape)) {
        throw new Error('value must be a ' + types.STRING + ': ' + value);
      }
    }
  },

  // TODO: docs
  config: Object.defineProperties({}, {
    enabled: (function() {
      let value = true;
      return {
        enumerable: true,
        configurable: true,
        get() {
          return value;
        },
        set(newValue) {
          rtv.verify(newValue, types.BOOLEAN);
          value = newValue;
        }
      }
    })()
  }),

  // TODO: docs
  Context(context) {
    // TODO: a version with same API (less 'config') that will include 'context' in errors thrown
  }
};

/**
 * [internal] Library version.
 * @name rtv._version
 * @type {String}
 */
Object.defineProperty(rtv, '_version', {
  enumerable: false, // internal
  configurable: true,
  value: VERSION
});

export default rtv;
