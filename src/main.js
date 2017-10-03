//// Main entry point \\\\

'use strict';

import { default as isString } from 'lodash-es/isString';
import { version as VERSION } from '../package.json';
import * as typeMap from './types';
import * as qualifierMap from './qualiiers';
import Enumeration from './Enumeration';

/**
 * RTV.js
 * @namespace rtv
 */

var types = new Enumeration(typeMap);
var qualifiers = new Enumeration(qualifierMap);

var rtv = {
  _version: VERSION,

  check: function(value, shape) {
    return isString(value) && !!value;
  },
  verify: function(value, shape) {
    if (this.config.enabled) {
      if (!this.check(value, shape)) {
        throw new Error('value must be a ' + types.STRING + ': ' + value);
      }
    }
  },

  config: {
    enabled: true
  },

  Context: function(context) {
    // TODO: a version with same API (less 'config') that will include 'context' in errors thrown
  },

  types: types,
  qualifiers: qualifiers
};

export default rtv;
