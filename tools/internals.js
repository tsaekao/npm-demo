////// Manual Node.js testing of rtv internals

import * as rtv from '../src/rtv';
import * as impl from '../src/lib/impl';
import * as types from '../src/lib/types';
import * as qualifiers from '../src/lib/qualifiers';
import * as util from '../src/lib/util';
import * as validation from '../src/lib/validation/validation';
import {validator as isAny} from '../src/lib/validation/isAny';
import {validator as isAnyObject} from '../src/lib/validation/isAnyObject';
import {validator as isArray} from '../src/lib/validation/isArray';
import {validator as isBoolean} from '../src/lib/validation/isBoolean';
import {validator as isFinite} from '../src/lib/validation/isFinite';
import {validator as isFunction} from '../src/lib/validation/isFunction';
import {validator as isMap} from '../src/lib/validation/isMap';
import {validator as isNumber} from '../src/lib/validation/isNumber';
import {validator as isObject} from '../src/lib/validation/isObject';
import {validator as isRegExp} from '../src/lib/validation/isRegExp';
import {validator as isSet} from '../src/lib/validation/isSet';
import {validator as isString} from '../src/lib/validation/isString';
import {validator as isSymbol} from '../src/lib/validation/isSymbol';
import {validator as isWeakMap} from '../src/lib/validation/isWeakMap';
import {validator as isWeakSet} from '../src/lib/validation/isWeakSet';

global.rtvi = {
  rtv,
  lib: {
    impl,
    types,
    qualifiers,
    util,
    validation: {
      validation,
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
