////// Manual Node.js testing of rtv internals

import rtv from '../src/rtv';
import impl from '../src/lib/impl';
import * as types from '../src/lib/types';
import * as qualifiers from '../src/lib/qualifiers';
import * as util from '../src/lib/util';

import isTypeset from '../src/lib/validation/isTypeset';
import isPrimitive from '../src/lib/validation/isPrimitive';

import * as isAny from '../src/lib/validator/isAny';
import * as isAnyObject from '../src/lib/validator/isAnyObject';
import * as isArray from '../src/lib/validator/isArray';
import * as isBoolean from '../src/lib/validator/isBoolean';
import * as isFinite from '../src/lib/validator/isFinite';
import * as isFunction from '../src/lib/validator/isFunction';
import * as isMap from '../src/lib/validator/isMap';
import * as isNumber from '../src/lib/validator/isNumber';
import * as isObject from '../src/lib/validator/isObject';
import * as isRegExp from '../src/lib/validator/isRegExp';
import * as isSet from '../src/lib/validator/isSet';
import * as isString from '../src/lib/validator/isString';
import * as isSymbol from '../src/lib/validator/isSymbol';
import * as isWeakMap from '../src/lib/validator/isWeakMap';
import * as isWeakSet from '../src/lib/validator/isWeakSet';

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
