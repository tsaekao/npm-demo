//// Main entry point \\\\

'use strict';

import { default as isString } from 'lodash-es/isString';
import { version as VERSION } from '../package.json';
import * as types from './types';

var rtv = {
  _version: VERSION,

  check: function(value) {
    return isString(value) && !!value;
  },
  verify: function(value) {
    if (this.config.enabled) {
      if (!this.check(value)) {
        throw new Error('value must be a ' + types.STRING + ': ' + value);
      }
    }
  },

  config: {
    enabled: true
  },

  Context: function(context) {
    // TODO: a version with same API (less 'config') that will include 'context' in errors thrown
  }
};

export default rtv;
