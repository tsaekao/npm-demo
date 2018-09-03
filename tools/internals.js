////// Manual Node.js testing of rtv internals

import rtv from '../src/rtv';
import impl from '../src/lib/impl';
import * as types from '../src/lib/types';
import * as qualifiers from '../src/lib/qualifiers';
import * as util from '../src/lib/util';

// pseudo-types
import * as isPrimitive from '../src/lib/validation/isPrimitive';
import * as isShape from '../src/lib/validation/isShape';
import * as isTypeArgs from '../src/lib/validation/isTypeArgs';
import * as isTypeset from '../src/lib/validation/isTypeset';
import * as isValidator from '../src/lib/validation/isValidator';

// validations
import * as isAny from '../src/lib/validation/isAny';
import * as isAnyObject from '../src/lib/validation/isAnyObject';
import * as isArray from '../src/lib/validation/isArray';
import * as isBoolean from '../src/lib/validation/isBoolean';
import * as isDate from '../src/lib/validation/isDate';
import * as isError from '../src/lib/validation/isError';
import * as isFinite from '../src/lib/validation/isFinite';
import * as isFunction from '../src/lib/validation/isFunction';
import * as isInt from '../src/lib/validation/isInt';
import * as isMap from '../src/lib/validation/isMap';
import * as isNull from '../src/lib/validation/isNull';
import * as isNumber from '../src/lib/validation/isNumber';
import * as isObject from '../src/lib/validation/isObject';
import * as isPromise from '../src/lib/validation/isPromise';
import * as isRegExp from '../src/lib/validation/isRegExp';
import * as isSafeInt from '../src/lib/validation/isSafeInt';
import * as isSet from '../src/lib/validation/isSet';
import * as isString from '../src/lib/validation/isString';
import * as isSymbol from '../src/lib/validation/isSymbol';
import * as isWeakMap from '../src/lib/validation/isWeakMap';
import * as isWeakSet from '../src/lib/validation/isWeakSet';

// validators
import * as valAny from '../src/lib/validator/valAny';
import * as valAnyObject from '../src/lib/validator/valAnyObject';
import * as valArray from '../src/lib/validator/valArray';
import * as valBoolean from '../src/lib/validator/valBoolean';
import * as valDate from '../src/lib/validator/valDate';
import * as valError from '../src/lib/validator/valError';
import * as valFinite from '../src/lib/validator/valFinite';
import * as valFunction from '../src/lib/validator/valFunction';
import * as valInt from '../src/lib/validator/valInt';
import * as valMap from '../src/lib/validator/valMap';
import * as valNull from '../src/lib/validator/valNull';
import * as valNumber from '../src/lib/validator/valNumber';
import * as valObject from '../src/lib/validator/valObject';
import * as valPromise from '../src/lib/validator/valPromise';
import * as valRegExp from '../src/lib/validator/valRegExp';
import * as valSafeInt from '../src/lib/validator/valSafeInt';
import * as valSet from '../src/lib/validator/valSet';
import * as valString from '../src/lib/validator/valString';
import * as valSymbol from '../src/lib/validator/valSymbol';
import * as valWeakMap from '../src/lib/validator/valWeakMap';
import * as valWeakSet from '../src/lib/validator/valWeakSet';

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
      // NOTE: these are the full modules, so it'll look like
      //  `isAny.default(value)` when executing the type validation

      // pseudo-types
      isPrimitive,
      isShape,
      isTypeArgs,
      isTypeset,
      isValidator,

      // validations
      isAny,
      isAnyObject,
      isArray,
      isBoolean,
      isDate,
      isError,
      isFinite,
      isFunction,
      isInt,
      isMap,
      isNull,
      isNumber,
      isObject,
      isPromise,
      isRegExp,
      isSafeInt,
      isSet,
      isString,
      isSymbol,
      isWeakMap,
      isWeakSet
    },
    validator: {
      // NOTE: these are the full modules, so it'll look like
      //  `valAny.default(value)` when executing the type validator
      valAny,
      valAnyObject,
      valArray,
      valBoolean,
      valDate,
      valError,
      valFinite,
      valFunction,
      valInt,
      valMap,
      valNull,
      valNumber,
      valObject,
      valPromise,
      valRegExp,
      valSafeInt,
      valSet,
      valString,
      valSymbol,
      valWeakMap,
      valWeakSet
    }
  }
};
