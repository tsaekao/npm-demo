////// Manual Node.js testing of rtv internals

import rtv from '../src/rtv';
import impl from '../src/lib/impl';
import * as types from '../src/lib/types';
import * as qualifiers from '../src/lib/qualifiers';
import * as util from '../src/lib/util';

import isTypeset from '../src/lib/validation/isTypeset';
import isPrimitive from '../src/lib/validation/isPrimitive';

import * as isAny from '../src/lib/validation/isAny';
import * as isAnyObject from '../src/lib/validation/isAnyObject';
import * as isArray from '../src/lib/validation/isArray';
import * as isBoolean from '../src/lib/validation/isBoolean';
import * as isFinite from '../src/lib/validation/isFinite';
import * as isFunction from '../src/lib/validation/isFunction';
import * as isMap from '../src/lib/validation/isMap';
import * as isNumber from '../src/lib/validation/isNumber';
import * as isObject from '../src/lib/validation/isObject';
import * as isRegExp from '../src/lib/validation/isRegExp';
import * as isSet from '../src/lib/validation/isSet';
import * as isString from '../src/lib/validation/isString';
import * as isSymbol from '../src/lib/validation/isSymbol';
import * as isWeakMap from '../src/lib/validation/isWeakMap';
import * as isWeakSet from '../src/lib/validation/isWeakSet';

global.rtvi = {
  rtv,
  lib: {
    impl,

    // NOTE: these are the full modules, therefore all types are in
    //  `types.default` and all qualifiers are in `qualifiers.default`
    types,
    qualifiers,

    util,
    validation: {
      isTypeset,
      isPrimitive
    },
    validator: {
      // NOTE: these are the full modules, so it'll look like
      //  `isAny.default(value)` when executing the type validator
      isAny,
      isAnyObject,
      isArray,
      isBoolean,
      isFinite,
      isFunction,
      isMap,
      isNumber,
      isObject,
      isRegExp,
      isSet,
      isString,
      isSymbol,
      isWeakMap,
      isWeakSet
    }
  }
};
