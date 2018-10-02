////// Main Implementation Module

// NOTE: These validators are used for internal purposes. Validation of actual
//  VALUES being checked should always be done via the _validatorMap.
import isArray from './validation/isArray';
import isObject from './validation/isObject';
import isString from './validation/isString';
import isFunction from './validation/isFunction';
import isBoolean from './validation/isBoolean';

import isTypeset from './validation/isTypeset';
import isShape from './validation/isShape';
import isTypeArgs from './validation/isTypeArgs';
import isCustomValidator from './validation/isCustomValidator';

import {DEFAULT_OBJECT_TYPE, argTypes, default as types} from './types';
import {DEFAULT_QUALIFIER, default as qualifiers} from './qualifiers';
import {print} from './util';
import RtvSuccess from './RtvSuccess';
import RtvError from './RtvError';

/**
 * <h3>RTV.js Implementation</h3>
 *
 * Provides the internal implementation for the externally-facing {@link rtv RTV}
 *  API, as well as utilities for {@link rtvref.validator type validators}.
 *
 * @namespace rtvref.impl
 */

/**
 * [Internal] Map of validator type (string) to validator function.
 * @private
 * @name rtvref.impl._validatorMap
 * @type {Object.<string,rtvref.validator.type_validator>}
 */
const _validatorMap = {};

/**
 * Get the qualifier given any kind of typeset.
 *
 * The typeset's validity is __not__ checked. The function attempts to get a
 *  qualifier, and defaults to the {@link qualifiers.DEFAULT_QUALIFIER default qualifier}
 *  if it cannot.
 *
 * @function rtvref.impl.getQualifier
 * @param {rtvref.types.typeset} typeset The typeset in question.
 * @returns {string} The applicable {@link rtvref.qualifiers qualifier} for the
 *  specified typeset, which is assumed to be valid.
 */
const getQualifier = function(typeset) {
  let qualifier = DEFAULT_QUALIFIER;

  if (isArray(typeset)) {
    // if there's a qualifier, it must be the first element, and since it's a
    //  valid typeset, it cannot be an empty array
    if (isString(typeset[0]) && qualifiers.check(typeset[0])) {
      qualifier = typeset[0];
    }
  }
  // else, it's either an object, function, or string, which implies the default
  //  qualifier

  return qualifier;
};

/**
 * Convert a type, qualifier, and args into a typeset.
 *
 * While the `qualifier`, `args`, and `fullyQualified` parameters are all
 *  optional and may be omitted, their order must be maintained: If needed,
 *  the `qualifier` must always be before `args`, and `args` before
 *  `fullyQualified`. Parameters with `undefined` values will be ignored.
 *
 * @function rtvref.impl.toTypeset
 * @param {string} type A single type from {@link rtvref.types.types}.
 * @param {(string|Object|boolean)} [qualifier=rtvref.qualifiers.DEFAULT_QUALIFIER]
 *  Optional qualifier from {@link rtvref.qualifiers.qualifiers}. Can also be
 *  either the `args` parameter, or the `fullyQualified` parameter if the
 *  default qualifier is being used.
 * @param {(Object|boolean)} [args] Optional
 *  {@link rtvref.types.type_arguments type arguments}. If specified, this
 *  parameter must be an {@link rtvref.types.OBJECT object}, however the
 *  properties of the object are not validated against the specified `type`
 *  (i.e. they are not guaranteed to be valid for that type). Can also be
 *  the `fullyQualified` parameter if type arguments aren't applicable.
 * @param {boolean} [fullyQualified=false] If _truthy_, the generated typeset
 *  will always be {@link rtvref.types.fully_qualified_typeset fully-qualified}.
 *  Otherwise, it'll be the simplest typeset possible.
 * @returns {rtvref.types.typeset} The simplest typeset that represents the
 *  combination of the specified type, qualifier, and args, unless `fullyQualified`
 *  was set to `true`, in which case it'll always be an array typeset and
 *  fully-qualified.
 * @throws {Error} If `type`, `qualifier`, or `args` is invalid.
 */
const toTypeset = function(type, ...rest) {
  const params = rest.filter((p) => p !== undefined);
  let qualifier = DEFAULT_QUALIFIER;
  let typeArgs;
  let typeArgsGiven = false;
  let fullyQualified = false;

  if (params.length === 1) {
    if (isString(params[0])) {
      qualifier = params[0];
    } else if (!isBoolean(params[0])) {
      typeArgsGiven = true;
      typeArgs = params[0];
    } else {
      fullyQualified = params[0]; // must be boolean
    }
  } else if (params.length === 2) {
    if (isBoolean(params[0])) {
      throw new Error('Expecting qualifier or args as the second parameter');
    }

    if (isString(params[0])) {
      qualifier = params[0];
    } else {
      typeArgsGiven = true;
      typeArgs = params[0]; // must be args
    }

    if (!isBoolean(params[1])) {
      if (typeArgs) {
        throw new Error('args parameter already specified');
      }
      typeArgsGiven = true;
      typeArgs = params[1];
    } else {
      fullyQualified = params[1]; // must be boolean
    }
  } else if (params.length >= 3) {
    qualifier = params[0];
    typeArgsGiven = true;
    typeArgs = params[1];
    fullyQualified = !!params[2]; // cast to boolean
  }

  types.verify(type); // catches the falsy value case too
  qualifiers.verify(qualifier); // catches the falsy value case too

  if (typeArgsGiven) {
    argTypes.verify(type);
    if (!isTypeArgs(typeArgs)) {
      throw new Error(`Invalid type args=${print(typeArgs)}`);
    }
  }

  let typeset;

  if (fullyQualified) {
    typeset = [qualifier, type];
    if (typeArgs) {
      typeset.push(typeArgs);
    }
  } else {
    if (qualifier === DEFAULT_QUALIFIER) {
      if (!typeArgs) {
        typeset = type;
      } else {
        typeset = [type, typeArgs];
      }
    } else {
      typeset = [qualifier, type];
      if (typeArgs) {
        typeset.push(typeArgs);
      }
    }
  }

  return typeset;
};

/**
 * Fully-qualifies a typeset, shallow (i.e. the first level only; nested typesets
 *  are not fully-qualified).
 *
 * This function does not modify the input `typeset`.
 *
 * @function rtvref.impl.fullyQualify
 * @param {rtvref.types.typeset} typeset Typeset to fully-qualify.
 * @param {rtvref.qualifiers} [qualifier] Optional qualifier to be used.
 *
 *  If the typeset is a simple {@link rtvref.types type},
 *   a {@link rtvref.types.shape_descriptor shape}, or
 *   a {@link rtvref.types.custom_validator custom validator} that was
 *   cherry-picked out of a typeset whose qualifier should be used instead of
 *   the {@link rtvref.qualifiers.DEFAULT_QUALIFIER default} one.
 *
 *  If `typeset` is an Array typeset, specifying this parameter will __override__
 *   the typeset's qualifier (otherwise, its own qualifier will be used).
 *
 * @returns {rtvref.types.fully_qualified_typeset} A new, fully-qualified typeset
 *  representing the input `typeset`. Only the first/immediate level of the
 *  input typeset is fully-qualified. The new array returned contains references
 *  to elements within the input typeset.
 * @throws {Error} If `typeset` or `qualifier` is not a valid.
 */
const fullyQualify = function(typeset, qualifier) {
  if (!isTypeset(typeset)) { // start by validating so we can be confident later
    throw new Error(`Invalid typeset=${print(typeset)}`);
  }

  if (qualifier) {
    qualifiers.verify(qualifier);
  }

  // NOTE: from this point on, we ASSUME that the typeset is valid, which lets
  //  us make assumptions about what we find within it; without this knowledge,
  //  the algorithm below would not work

  if (!isArray(typeset)) {
    qualifier = qualifier || DEFAULT_QUALIFIER;

    // must be either a string, shape, or function with an implied qualifier
    if (isShape(typeset)) {
      // must be a nested shape descriptor with default object type: move shape
      //  into args
      return [qualifier, DEFAULT_OBJECT_TYPE, {$: typeset}];
    }

    // if a validator, it has an implied type of ANY
    if (isCustomValidator(typeset)) {
      return [qualifier, types.ANY, typeset];
    }

    // string (basic type)
    return [qualifier, typeset];
  }

  const fqts = []; // ALWAYS a new array
  let curType; // @type {(string|undefined)} current type in scope or undefined if none

  // typeset is an array: iterate its elements and build fqts iteratively
  typeset.forEach(function(rule, i) {
    // qualifiers are non-empty strings and must appear in the first element, if specified
    if (i === 0) {
      if (isString(rule) && qualifiers.check(rule)) {
        fqts.push(qualifier || rule); // qualifier overrides the one in the typeset
        return; // next rule
      }

      // rule isn't a qualifier: use override or the default, and keep processing the rule
      fqts.push(qualifier || DEFAULT_QUALIFIER);
    }

    if (isString(rule)) {
      // must be a type
      curType = rule;
      fqts.push(curType);
    } else if (i === 0 && isShape(rule)) {
      // nested shape descriptor using default object type: move shape into args
      curType = DEFAULT_OBJECT_TYPE;
      fqts.push(curType, {$: rule});
    } else if (isTypeArgs(rule)) {
      // args for curType since typeset is an array and object is not in first position
      fqts.push(rule);
    } else if (isCustomValidator(rule)) {
      // validator: ANY is implied type if none specified
      if (!curType) {
        curType = types.ANY;
        fqts.push(curType);
      }

      fqts.push(rule);
    } else {
      // must be an array: move Array typeset into args
      curType = types.ARRAY;
      fqts.push(curType, {ts: rule});
    }
  });

  return fqts;
};

/**
 * Extracts (modifies) the next complete type from an Array typeset.
 *
 * For example, if the given `typeset` is `[EXPECTED, STRING, {string_args}, FINITE]`,
 *  the returned array would be `[EXPECTED, STRING, {atring_args}]` and `typeset`
 *  would then be `[FINITE]`.
 *
 * @function rtvref.impl.extractNextType
 * @param {(rtvref.types.typeset|Array)} typeset An Array typeset from which to
 *  extract the next complete type. __This Array will be modified.__ Can also
 *  be an empty array (which is not a valid typeset, but is tolerated; see the
 *  return value for more information).
 * @param {(rtvref.qualifiers|boolean)} [qualifier] Optional, and can either
 *  be a valid qualifier, `true`, or `false`.
 *
 *  <h4>Parameter is specified, and is a qualifier</h4>
 *
 *  If __a qualifier is not found in `typeset`__, this qualifier will be used to
 *  qualify the returned sub-type Array typeset. If a qualifier is found in `typeset`,
 *  this parameter is ignored. If a qualifier is __not__ found in `typeset` and
 *  this parameter is specified, then this qualifier will be used to qualify the
 *  returned sub-type Array typeset.
 *
 *  __Examples:__
 *  - `typeset = [EXPECTED, STRING, FINITE];`
 *  - `extractNextType(typeset, REQUIRED) === [EXPECTED, STRING]`, `typeset === [FINITE]`
 *  - `extractNextType(typeset) === [FINITE]`, `typeset === []`
 *  - `typeset = [FINITE];`
 *  - `extractNextType(typeset, EXPECTED) === [EXPECTED, FINITE]`
 *
 *  <h4>Parameter is specified, and is a boolean</h4>
 *
 *  If `true`, the qualifier, if any, will be included in the returned sub-type
 *  Array typeset.
 *
 *  If `false`, the qualifier, if any, will be ignored.
 *
 *  __Examples:__
 *  - `extractNextType([STRING], true) === [STRING]`
 *  - `extractNextType([REQUIRED, STRING], true) === [EXPECTED, STRING]`
 *  - `extractNextType([REQUIRED, STRING], false) === [STRING]`
 *
 * @returns {(rtvref.types.typeset|Array)} The extracted __Array typeset__ as a
 *  new Array, which is a sub-type of the given `typeset`. This sub-typeset is
 *  not necessarily fully-qualified. If `typeset` was an empty array, an empty
 *  array is returned (which is the only case where an invalid Array typeset
 *  is tolerated, so that this function is easy to use in loops, checking for
 *  the stopping condition where the returned sub-typeset is empty).
 * @throws {Error} If `typeset` is not empty and not a valid Array typeset.
 * @throws {Error} If `qualifier` is specified but not valid.
 */
const extractNextType = function(typeset, qualifier) {
  if (qualifier && !isBoolean(qualifier)) {
    qualifiers.verify(qualifier);
  }

  // check for an array first since that's much faster than isTypeset()
  if (!isArray(typeset) || (typeset.length > 0 && !isTypeset(typeset))) {
    throw new Error(`Invalid Array typeset=${print(typeset)}`);
  }

  if (typeset.length === 0) {
    return [];
  }

  const subtype = []; // subset type of `typeset`
  let type = typeset.shift(); // NOTE: [].shift() === undefined

  // FIRST: check for the qualifier, which must be the first element, if specified
  if (qualifiers.check(type)) {
    if (qualifier !== false) {
      subtype.push(type); // include, and ignore the specified qualifier
    }

    // next type: typeset cannot be empty because it's valid and since
    //  there's a qualifier, there must be at least one type in it too
    type = typeset.shift();
  } else {
    // must be a type or the validator, which we'll check for below
    // use the specified qualifier, if any, and if allowed
    if (qualifier && !isBoolean(qualifier)) {
      subtype.push(qualifier);
    }
  }

  if (isString(type)) {
    // simple type
    subtype.push(type);

    // check for args if applicable to type (as of now, there are no types that
    //  require args)
    if (argTypes.check(type) && typeset.length > 0 && isTypeArgs(typeset[0])) {
      subtype.push(typeset.shift());
    }
  } else {
    // Must be either a shape, an array (nested typeset), or a validator:
    // - Shape: if the given typeset was in its original form (nothing extracted from it)
    //  then the first type could be a shape, in which case it has an implied type of
    //  OBJECT and is itself the args for it
    // - Array: a nested array is an Array typeset with an implied type of ARRAY and no args
    // - Validator: a custom validator has an implied type of ANY and no args
    subtype.push(type);
  }

  return subtype;
};

/**
 * [Internal] Invokes a custom validator function found in a typeset.
 * @private
 * @function rtvref.impl._callCustomValidator
 * @param {rtvref.types.custom_validator} validator Custom validator to invoke.
 * @param {*} value Value being verified.
 * @param {rtvref.types.fully_qualified_typeset} match Fully-qualified typeset
 *  for the subtype of `typeset` that matched.
 * @param {rtvref.types.typeset} typeset Typeset used for verification.
 * @returns {(undefined|Error)} `undefined` if the validator succeeded; `Error`
 *  if the validator failed.
 */
const _callCustomValidator = function(validator, value, match, typeset) {
  let failure;

  try {
    const result = validator(value, match, typeset);

    if (result !== undefined && !result) { // undefined === no action === success
      failure = new Error('Verification failed because of the custom validator');
    }
  } catch (err) {
    failure = err;
  }

  return failure;
};

/**
 * [Internal] Common options for the various `check*()` functions.
 * @private
 * @typedef {Object} rtvref.impl._checkOptions
 * @property {Array.<string>} path The current path into the original typeset.
 *  Initially empty to signify the root (top-level) value being checked.
 * @property {boolean} isTypeset `true` if the typeset specified in the public
 *  parameters has already been validated and is a valid __shallow__ typeset;
 *  `false` otherwise (which means the typeset should first be validated before
 *  being processed).
 * @property {(string|undefined)} qualifier The {@link rtvref.qualifiers qualifier}
 *  in context; `undefined` if none. This property should be used when calling
 *  a `check*()` function for a typeset subtype where the typeset's qualifier
 *  should be attributed to the subtype rather than the
 *  {@link rtvref.qualifiers.DEFAULT_QUALIFIER default qualifier}.
 * @see {@link rtvref.impl.check}
 * @see {@link rtvref.impl.checkWithShape}
 * @see {@link rtvref.impl.checkWithType}
 */

/**
 * [Internal] Gets check options for any of the `check*()` functions.
 * @private
 * @function rtvref.impl._getCheckOptions
 * @param {Object} [current] Current options, used as a basis for new options.
 * @param {Object} [override] Override options, which will overwrite any `current`
 *  options.
 * @returns {rtvref.impl._checkOptions} A full, new options object, based on
 *  `given` options, if any. Invalid given options will be ignored. The object
 *  returned may contain references to objects in `given` depending on property
 *  types.
 * @see {@link rtvref.impl.check}
 * @see {@link rtvref.impl.checkWithShape}
 * @see {@link rtvref.impl.checkWithType}
 * @throws {Error} If `current.path` or `override.path` is specified and not an array.
 */
const _getCheckOptions = function(current = {}, override = {}) {
  if (current.path && !isArray(current.path)) {
    throw new Error(`current.path must be an Array when specified, current.path=${print(current.path)}`);
  }

  if (override.path && !isArray(override.path)) {
    throw new Error(`override.path must be an Array when specified, override.path=${print(override.path)}`);
  }

  const options = {
    path: override.path || current.path || [],
    isTypeset: false,
    qualifier: override.qualifier || current.qualifier || undefined
  };

  // careful with isTypeset since it's a boolean: check for property existence
  //  so we don't misinterpret undefined as a falsy value we should use
  if (override.hasOwnProperty('isTypeset')) {
    options.isTypeset = !!override.isTypeset;
  } else if (current.hasOwnProperty('isTypeset')) {
    options.isTypeset = !!current.isTypeset;
  }

  return options;
};

/**
 * Checks a value using a single type.
 * @function rtvref.impl.checkWithType
 * @param {*} value Value to check.
 * @param {(string|Array|Object)} singleType Either a simple type name (one of
 *  {@link rtvref.types.types}), a {@link rtvref.types.shape_descriptor shape descriptor},
 *  or an Array {@link rtvref.types.typeset typeset} which represents a single type.
 *
 *  In the string/simple case, the
 *   {@link rtvref.qualifiers.DEFAULT_QUALIFIER default qualifier} is assumed.
 *
 *  In the shape descriptor case, the
 *   {@link rtvref.types.DEFAULT_OBJECT_TYPE default object type} is assumed.
 *
 *  In the Array case, the qualifier is optional, and a type, along with args,
 *   if any, is expected (e.g. `[type]`, `[qualifier, type]`, `[type, args]`, or
 *   `[qualifier, type, args]`). Note that the type may be implied the shorthand
 *   notation is being used for an ARRAY, or if the
 *   {@link rtvref.types.DEFAULT_OBJECT_TYPE default object type} is being implied.
 *
 *  NOTE: A {@link rtvref.types.custom_validator custom validator} is not considered
 *   a valid single type. It's also considered a __separate type__ if it were passed-in
 *   via an Array, e.g. `[STRING, validator]`, which would violate the fact that
 *   `singleType` should be one type, and therefore cause an exception to be thrown.
 *
 * @returns {(rtvref.RtvSuccess|rtvref.RtvError)} A success indicator if the
 *  `value` is compliant to the type; an error indicator if not.
 * @throws {Error} If `singleType` is not a valid simple type or single type.
 * @see {@link rtvref.types}
 */
// @param {rtvref.impl._checkOptions} [options] (internal parameter)
const checkWithType = function(value, singleType /*, options*/) {
  const options = _getCheckOptions(arguments.length > 2 ? arguments[2] : undefined);

  if (!options.isTypeset && !isTypeset(singleType)) {
    throw new Error(`Invalid typeset in singleType=${print(singleType)}`);
  }

  options.isTypeset = true;

  const qualifier = options.qualifier || getQualifier(singleType);

  let type; // @type {string}
  let args; // @type {Object}

  if (isString(singleType)) {
    type = singleType;
    // simple type: no args
  } else if (isShape(singleType)) {
    type = DEFAULT_OBJECT_TYPE;
    args = {$: singleType}; // move shape into args.$
  } else if (isArray(singleType)) {
    const singleTypeCopy = fullyQualify(singleType); // make any implied types concrete
    const typeset = extractNextType(singleTypeCopy, false);

    if (singleTypeCopy.length > 0) { // if singleType was just one type, copy should be empty now
      throw new Error(`Specified singleType=${print(singleType)} typeset must represent a single type`);
    }

    type = typeset[0];
    args = typeset.length > 1 ? typeset[1] : undefined;
  } else {
    throw new Error(`Specified singleType=${print(singleType)} must be a string, shape, or Array`);
  }

  if (_validatorMap[type]) {
    // call the validator for the specified type
    let result = _validatorMap[type](value, qualifier, args);

    if (!result.valid) {
      // create a new error from the original, but with the current path and the
      //  original path combined
      result = new RtvError(value, singleType, options.path.concat(result.path),
          result.cause);
    }

    return result;
  }

  throw new Error(`Missing validator for type=${print(type)}`);
};

/**
 * Checks a value using a {@link rtvref.types.shape_descriptor shape descriptor} and
 *  ensure the value's type is the default object type.
 * @function rtvref.impl.checkWithShape
 * @param {Object} value Value to check. Must be of the
 *  {@link rtvref.types.DEFAULT_OBJECT_TYPE default} object type.
 * @param {Object} shape Expected shape of the `value`. Must be an
 *  {@link rtvref.types.OBJECT OBJECT}.
 * @returns {(rtvref.RtvSuccess|rtvref.RtvError)} A success indicator if the
 *  `value` is compliant to the shape; an error indicator if not.
 * @throws {Error} If `shape` is not an {@link rtvref.types.OBJECT OBJECT}.
 */
// @param {rtvref.impl._checkOptions} [options] (internal parameter)
const checkWithShape = function(value, shape /*, options*/) {
  if (!isShape(shape)) {
    throw new Error(`Invalid shape=${print(shape)}`);
  }

  const options = _getCheckOptions(arguments.length > 2 ? arguments[2] : undefined);

  // type validators are ultimately responsible for checking values against shapes
  return checkWithType(value, shape, _getCheckOptions(options));
};

/**
 * Checks a value using an Array typeset.
 * @function rtvref.impl.checkWithArray
 * @param {*} value Value to check.
 * @param {Array} array The Array {@link rtvref.types.typeset typeset} to check
 *  against.
 * @returns {(rtvref.RtvSuccess|rtvref.RtvError)} Success indicator if the `value`
 *  is compliant to the `typeset`; error indicator otherwise. An exception is
 *  __not__ thrown if the `value` is non-compliant.
 * @throws {Error} If `typeset` is not a valid Array typeset.
 */
// @param {rtvref.impl._checkOptions} [options] (internal parameter)
const checkWithArray = function(value, array /*, options*/) {
  const options = _getCheckOptions(arguments.length > 2 ? arguments[2] : undefined);

  // check for an array first since that's must faster than isTypeset()
  if (!isArray(array) || !(options.isTypeset || isTypeset(array))) {
    throw new Error(`Invalid typeset in array=${print(array)}`);
  }

  options.isTypeset = true;

  let match; // @type {(rtvref.types.fully_qualified_typeset|undefined)}
  let err; // @type {(RtvError|undefined)}
  const qualifier = options.qualifier || getQualifier(array);

  // consider each type in the typeset until we find one that matches the value
  // NOTE: an Array typeset represents multiple possibilities for a type match
  //  using a short-circuit OR conjunction
  // NOTE: due to the isTypeset check above, we can assume that each 'type' is
  //  a SHALLOW-valid typeset (meaning, if it's an Array typeset, we cannot
  //  assume that itself is valid because the isTypeset check was just shallow)
  const typesetCopy = array.concat(); // shallow clone so we can modify the array locally
  let subtype = extractNextType(typesetCopy, false); // exclude qualifier we already have
  const isSingleType = typesetCopy.length === 0; // was there just one type in the Array typeset?
  while (subtype.length > 0) {
    // check for the validator, which will always come alone, and since the validator
    //  must be at the end of an Array typeset, it also signals the end of all subtypes
    if (subtype.length === 1 && isCustomValidator(subtype[0])) {
      // if we reach the validator (which must be the very last element) in this
      //  loop, none of the types matched, unless the validator is the only
      //  type in the typeset, at which point it gets an implied type of ANY,
      //  which matches any value
      // NOTE: we have to test the original typeset for the ANY condition
      if (array.length === 1 || (array.length === 2 && qualifiers.check(array[0]))) {
        match = fullyQualify(types.ANY, qualifier);
      }

      break; // break (since this must be the last element in typeset)
    } else {
      const result = checkWithType(value, subtype, _getCheckOptions(options, {
        path: options.path,
        qualifier,
        isTypeset: true // subtype must be valid per extractNextType()
      }));

      if (result.valid) {
        match = fullyQualify(subtype, qualifier);
        break; // break on first match
      } else if (isSingleType) {
        // capture the error since the Array typeset is a single type; this way,
        //  we can provide more helpful error reporting
        err = result;
      }
    }

    // next subtype
    subtype = extractNextType(typesetCopy);
  }

  if (match) {
    // check for a validator at the end of the Array typeset and invoke it
    const lastType = array[array.length - 1];
    if (isCustomValidator(lastType)) {
      const failure = _callCustomValidator(lastType, value, match, array);
      if (failure !== undefined) {
        // invalid in spite of the match since the validator said no
        err = new RtvError(value, array, options.path, fullyQualify(array, qualifier), failure);
      }
    }
    // else, valid, since we have a match
  } else {
    // no match: if we already have an error, then the Array typeset should have
    //  contained a single type, e.g. `[qualifier, type, args]`, so build a new
    //  error from that one; otherwise, the Array typeset should have contained
    //  multiple types, in which case we can't tailor an error to any one type
    //  since the value failed against all of them
    if (err) {
      err = new RtvError(value, array, options.path.concat(err.path), err.cause);
    } else {
      // make a generic error for the value not matching any of the multiple types
      //  in the Array typeset
      err = new RtvError(value, array, options.path, fullyQualify(array, qualifier));
    }
  }

  return err || (new RtvSuccess());
};

/**
 * Checks a value against a typeset.
 * @function rtvref.impl.check
 * @param {*} value Value to check.
 * @param {rtvref.types.typeset} typeset Expected shape/type of the value.
 * @returns {(rtvref.RtvSuccess|rtvref.RtvError)} Success indicator if the `value`
 *  is compliant to the `typeset`; error indicator otherwise. An exception is
 *  __not__ thrown if the `value` is non-compliant.
 * @throws {Error} If `typeset` is not a valid typeset.
 */
// @param {rtvref.impl._checkOptions} [options] (internal parameter)
const check = function(value, typeset /*, options*/) {
  const options = _getCheckOptions(arguments.length > 2 ? arguments[2] : undefined);

  try {
    if (options.isTypeset || isTypeset(typeset)) {
      options.isTypeset = true;

      if (isString(typeset)) {
        // simple type: check value is of the type
        return checkWithType(value, typeset, options);
      }

      if (isCustomValidator(typeset)) {
        // custom validator: bare function implies the ANY type
        const impliedType = types.ANY;

        // value must be ANY type, and custom validator must return true
        const result = checkWithType(value, impliedType, options);
        if (!result.valid) {
          return result;
        }

        // the fully-qualified match should NOT include the validator, only
        //  the subtype within the implied typeset that matched
        const match = fullyQualify(impliedType, options.qualifier);

        const failure = _callCustomValidator(typeset, value, match, typeset);
        if (failure !== undefined) {
          return new RtvError(value, typeset, options.path,
              fullyQualify(typeset, options.qualifier), failure);
        }

        return new RtvSuccess();
      }

      if (isShape(typeset)) {
        // shape descriptor: check value against shape
        return checkWithShape(value, typeset, options);
      }

      if (isArray(typeset)) {
        // Array typeset: check value against all types in typeset
        return checkWithArray(value, typeset, options);
      }

      throw new Error(`Invalid JavaScript type for typeset=${print(typeset)}`);
    } else {
      throw new Error(`Invalid typeset=${print(typeset)} specified`);
    }
  } catch (checkErr) {
    const err = new Error(`Cannot check value: ${checkErr.message}`);
    err.rootCause = checkErr;
    throw err;
  }
};

/**
 * [Internal] Registers a validator, adding a new type that can be
 *  {@link rtvref.impl.check checked}.
 *
 * If a validator has already been registered for a particular type, the previous
 *  validator is replaced by the newer one.
 *
 * @private
 * @function rtvref.impl._registerType
 * @param {rtvref.validator} validator The validator representing the type to be
 *  registered.
 * @throws {Error} if `validator` does not have the expected interface.
 */
const _registerType = function(validator) {
  // NOTE: we can't dogfood and describe a shape to check() because the types
  //  needed may not have been registered yet
  if (!isObject(validator) || !types.check(validator.type) ||
      !isFunction(validator.config) || !isFunction(validator.default)) {

    throw new Error(`Cannot register an invalid validator for type=${print(validator && validator.type)}: missing at least one required property in [type, config, default]`);
  }

  _validatorMap[validator.type] = validator.default;
};

////////////////////////////////////////////////////////////////////////////////
// Define and export the module

// define the module to be exported: properties/methods with an underscore prefix
//  will be converted to non-enumerable properties/methods
const impl = {
  // internal
  _validatorMap, // exposed mainly to support unit testing
  _registerType,
  _callCustomValidator,
  _getCheckOptions,
  // public
  getQualifier,
  toTypeset,
  fullyQualify,
  extractNextType,
  checkWithType,
  checkWithShape,
  checkWithArray,
  check
};

// make properties/methods with underscore prefix internal by making them
//  non-enumerable (but otherwise, a normal property)
Object.keys(impl).forEach(function(prop) {
  if (prop.indexOf('_') === 0) {
    Object.defineProperty(impl, prop, {
      enumerable: false,
      configurable: true,
      writable: true,
      value: impl[prop]
    });
  }
});

export default impl;
