////// Main Implementation Module

import {default as _forEach} from 'lodash/forEach';

// NOTE: These 4 validators are used to verify the basic types related to typesets.
//  Validation of actual VALUES being checked should always be done via the
//  _validatorMap.
import isArray from './validator/isArray';
import isObject from './validator/isObject';
import isString from './validator/isString';
import isFunction from './validator/isFunction';

import isTypeset from './validation/isTypeset';
import isShape from './validation/isShape';
import isTypeArgs from './validation/isTypeArgs';
import isValidator from './validation/isValidator';

import {DEFAULT_OBJECT_TYPE, argTypes, default as types} from './types';
import {DEFAULT_QUALIFIER, default as qualifiers} from './qualifiers';
import {print} from './util';
import RtvSuccess from './RtvSuccess';
import RtvError from './RtvError';

/**
 * <h2>RTV Implementation Module</h2>
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
 * @function rtvref.impl.getQualifier
 * @param {rtvref.types.typeset} typeset The typeset in question.
 * @returns {string} The applicable {@link rtvref.qualifiers qualifier} for the
 *  specified typeset.
 * @throws {Error} If `typeset` is not a valid typeset.
 */
const getQualifier = function(typeset) {
  if (!isTypeset(typeset)) { // start by validating so we can be confident later
    throw new Error(`Invalid typeset="${print(typeset)}"`);
  }

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
 * Fully-qualifies a typeset, shallow (i.e. the first level only; nested typesets
 *  are not fully-qualified).
 *
 * This function does not modify the input `typeset`.
 *
 * @function rtvref.impl.fullyQualify
 * @param {rtvref.types.typeset} typeset Typeset to fully-qualify.
 * @param {rtvref.qualifiers} [qualifier=rtvref.qualifiers.DEFAULT_QUALIFIER]
 *  Qualifier to be used, especially if the typeset is
 *  a simple {@link rtvref.types type},
 *  a {@link rtvref.shape_descriptor shape}, or
 *  a {@link rtvref.types.custom_validator custom validator} that was
 *  cherry-picked out of a typeset whose qualifier should be used instead of
 *  the default one.
 * @returns {rtvref.types.fully_qualified_typeset} A new, fully-qualified typeset
 *  representing the input `typeset`. Only the first/immediate level of the
 *  input typeset is fully-qualified. The new array returned contains references
 *  to elements within the input typeset.
 * @throws {Error} If `typeset` is not a valid typeset.
 */
const fullyQualify = function(typeset, qualifier = DEFAULT_QUALIFIER) {
  if (!isTypeset(typeset)) { // start by validating so we can be confident later
    throw new Error(`Invalid typeset="${print(typeset)}"`);
  }

  qualifiers.verify(qualifier);

  // NOTE: from this point on, we ASSUME that the typeset is valid, which lets
  //  us make assumptions about what we find within it; without this knowledge,
  //  the algorithm below would not work

  if (!isArray(typeset)) {
    // must be either a string, shape, or function with an implied qualifier
    if (isShape(typeset)) {
      // must be a nested shape descriptor with default object type
      return [qualifier, DEFAULT_OBJECT_TYPE, typeset];
    }

    // if a validator, it has an implied type of ANY
    if (isValidator(typeset)) {
      return [qualifier, types.ANY, typeset];
    }

    // string (basic type)
    return [qualifier, typeset];
  }

  const fqts = []; // ALWAYS a new array
  let curType; // @type {(string|undefined)} current type in scope or undefined if none

  // typeset is an array: iterate its elements and build fqts iteratively
  typeset.forEach(function(rule, i) {
    // qualifiers are non-empty strings
    if (i === 0 && (!isString(rule) || !qualifiers.check(rule))) {
      // NOTE: since this is an Array typeset, it has its own qualifier; the
      //  in-context `options.qualifier` would not apply to it
      fqts.push(DEFAULT_QUALIFIER); // add implied qualifier
    }

    if (isString(rule)) {
      // must be a type
      curType = rule;
      fqts.push(curType);
    } else if (i === 0 && isShape(rule)) {
      // nested shape descriptor using default object type
      curType = DEFAULT_OBJECT_TYPE;
      fqts.push(curType, rule);
    } else if (isTypeArgs(rule)) {
      // args for curType since typeset is an array and object is not in first position
      fqts.push(rule);
    } else if (isValidator(rule)) {
      // validator: ANY is implied type if none specified
      if (!curType) {
        curType = types.ANY;
        fqts.push(curType);
      }

      fqts.push(rule);
    } else {
      // must be an array
      if (curType !== types.ARRAY) {
        // add implied ARRAY type
        curType = types.ARRAY;
        fqts.push(curType);
      }

      fqts.push(rule);
    }
  });

  return fqts;
};

/**
 * [Internal] Common options for the various `check*()` functions.
 * @private
 * @typedef rtvref.impl._checkOptions
 * @property {Array.<string>} path The current path into the typeset. Initially
 *  empty to signify the root (top-level) value being checked.
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
 * @see {@link rtvref.impl.checkShape}
 * @see {@link rtvref.impl.checkType}
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
 * @see {@link rtvref.impl.checkShape}
 * @see {@link rtvref.impl.checkType}
 * @throws {Error} If `current.path` or `override.path` is specified and not an array.
 */
const _getCheckOptions = function(current = {}, override = {}) {
  if (current.path && !isArray(current.path)) {
    throw new Error(`current.path must be an Array when specified, current.path=${print(current.path)}`);
  }

  if (override.path && !isArray(override.path)) {
    throw new Error(`override.path must be an Array when specified, override.path=${print(override.path)}`);
  }

  return {
    path: override.path || current.path || [],
    isTypeset: !!override.isTypeset || !!current.isTypeset || false,
    qualifier: override.qualifier || current.qualifier || undefined
  };
};

/**
 * Checks a value using a simple type assuming the
 *  {@link rtvref.qualifiers.DEFAULT_QUALIFIER default qualifier}.
 * @function rtvref.impl.checkType
 * @param {*} value Value to check.
 * @param {string} type Simple type name, must be one of {@link rtvref.types.types}.
 * @returns {(rtvref.RtvSuccess|rtvref.RtvError)} A success indicator if the
 *  `value` is compliant to the type; an error indicator if not.
 * @throws {Error} If `type` is not a valid type name.
 * @see {@link rtvref.types}
 */
// @param {rtvref.impl._checkOptions} [options] (internal parameter)
const checkWithType = function(value, type /*, options*/) {
  types.verify(type);

  const options = _getCheckOptions(arguments.length > 2 ? arguments[2] : undefined);

  if (_validatorMap[type]) {
    // call the validator for the specified type
    const valid = _validatorMap[type](value, options.qualifier || DEFAULT_QUALIFIER);

    if (valid) {
      return new RtvSuccess();
    }

    return new RtvError(value, type, options.path, fullyQualify(type, options.qualifier));
  }

  throw new Error(`Missing validator for type="${print(type)}"`);
};

/**
 * Checks a value using a {@link rtvref.shape_descriptor shape descriptor} and
 *  ensure the value's type is the default object type.
 * @function rtvref.impl.checkShape
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
  const shapeType = DEFAULT_OBJECT_TYPE;

  // value must be default object type
  if (!checkWithType(value, shapeType)) { // NOTE: always check values with the _validatorMap
    return new RtvError(value, shapeType, options.path,
        fullyQualify(shapeType, options.qualifier));
  }

  let err; // @type {(RtvError|undefined)}

  // only consider enumerable, own-properties of the shape
  _forEach(shape, function(typeset, prop) {
    // first, consider the qualifier and test the existence of the property
    const qualifier = getQualifier(typeset);
    if ((value[prop] === undefined && qualifier !== qualifiers.OPTIONAL) ||
        (value[prop] === null && qualifier === qualifiers.REQUIRED)) {

      // REQUIRED and EXPECTED require the property NOT to be undefined and to
      //  be somewhere in the prototype chain; if it wasn't in the prototype chain,
      //  it would still be undefined, so we don't need an 'in' operator check

      // REQUIRED properties cannot have a value of null/undefined, and they must
      //  exist somewhere in the prototype chain; if the property wasn't in the
      //  prototype chain, the value would be undefined, so we don't need to test
      //  this here either

      err = new RtvError(value, typeset, options.path.concat(prop),
          fullyQualify(typeset, qualifier));
      return false; // break
    }

    // then, test the property's value against the typeset (indirectly recursive)
    const result = check(value[prop], typeset, _getCheckOptions(options, { // eslint-disable-line no-use-before-define
      path: options.path.concat(prop),
      qualifier,
      isTypeset: false // don't assume it's valid since we only check shallow as we go
    }));

    if (!result.valid) {
      err = result;
      return false; // break
    }
  });

  return err || (new RtvSuccess());
};

/**
 * Extracts (modifies) the next complete type from an Array typeset.
 *
 * For example, if the given `typeset` is `[EXPECTED, STRING, {string_args}, FINITE]`,
 *  the returned array would be `[EXPECTED, STRING, {atring_args}]` and `typeset`
 *  would then be `[FINITE]`.
 *
 * @param {rtvref.types.typeset} typeset An Array typeset from which to extract
 *  the next complete type. __This Array will be modified.__
 * @param {rtvref.types.typeset} [qualifier] If specified __and a qualifier
 *  is not found in `typeset`__, this qualifier will be used to qualify the returned
 *  sub-type Array typeset. If a qualifier is found in `typeset`, this parameter
 *  is ignored. If a qualifier is __not__ found in `typeset` and this parameter
 *  is specified, then this qualifier will be used to qualify the returned
 *  sub-type Array typeset.
 *
 *  For example, if `typeset` is `[EXPECTED, STRING, FINITE]` then this parameter
 *   is ignored and the returned Array is `[EXPECTED, STRING]`, with `typeset`
 *   now just `[FINITE]`. Calling this method again with `typeset` as `[FINITE]`
 *   would return `[FINITE]` and leave `typeset` empty, if this parameter was not
 *   specified. Specify the original qualifier `EXPECTED` to get `[EXPECTED, FINITE]`
 *   back from this method.
 *
 * @returns {rtvref.types.typeset} The extracted __Array typeset__ as a new Array,
 *  which is a sub-type of the given `typeset`. This sub-typeset is not necessarily
 *  fully-qualified.
 * @throws {Error} If `typeset` is not a valid Array typeset.
 * @throws {Error} If `qualifier` is specified but not valid.
 */
const extractNextType = function(typeset, qualifier) {
  if (qualifier) {
    qualifiers.verify(qualifier);
  }

  // check for an array first since that's must faster than isTypeset()
  if (!isArray(typeset) || !isTypeset(typeset)) {
    throw new Error(`Invalid array typeset=${print(typeset)}`);
  }

  const subtype = []; // subset type of `typeset`
  let type = typeset.shift(); // NOTE: [].shift() === undefined

  // FIRST: check for the qualifier, which must be the first element, if specified
  if (qualifiers.check(type)) {
    subtype.push(type); // ignore the specified qualifier

    // next type: typeset cannot be empty because it's valid and since
    //  there's a qualifier, there must be at least one type in it too
    type = typeset.shift();
  } else {
    // must be a type or the validator, which we'll check for below
    // use the specified qualifier, if any
    if (qualifier) {
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

    // check for ARRAY since it could be `[ARRAY, {args}, [...]]` as complete type
    if (type === types.ARRAY && typeset.length > 0 && isArray(typeset[0])) {
      subtype.push(typeset.shift());
    }
  } else if (isShape(type) || isArray(type) || isValidator(type)) {
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
 * Checks a value using an Array typeset.
 * @function rtvref.impl.checkTypeset
 * @param {*} value Value to check.
 * @param {rtvref.types.typeset} typeset The Array typeset to check against.
 * @returns {(rtvref.RtvSuccess|rtvref.RtvError)} Success indicator if the `value`
 *  is compliant to the `typeset`; error indicator otherwise. An exception is
 *  __not__ thrown if the `value` is non-compliant.
 * @throws {Error} If `typeset` is not a valid Array typeset.
 */
// @param {rtvref.impl._checkOptions} [options] (internal parameter)
const checkWithArray = function(value, typeset /*, options*/) {
  const options = _getCheckOptions(arguments.length > 2 ? arguments[2] : undefined);

  // check for an array first since that's must faster than isTypeset()
  if (!isArray(typeset) || !(options.isTypeset || isTypeset(typeset))) {
    throw new Error(`Invalid array typeset=${print(typeset)}`);
  }

  let match; // @type {(rtvref.types.fully_qualified_typeset|undefined)}
  let qualifier = DEFAULT_QUALIFIER; // assume the default qualifier to begin
  let hasQualifier = false; // true if the typeset specifies a qualifier as its first element

  // consider each type in the typeset until we find one that matches the value
  // NOTE: an Array typeset represents multiple possibilities for a type match
  //  using a short-circuit OR conjunction
  // NOTE: due to the isTypeset check above, we can assume that each 'type' is
  //  a SHALLOW-valid typeset (meaning, if it's an Array typeset, we cannot
  //  assume that itself is valid because the isTypeset check was just shallow)
  const typesetCopy = typeset.concat(); // shallow clone so we can modify the array locally
  let idx = 0;
  let type = typesetCopy.shift(); // must be >= 1 element since array typesets cannot be empty
  console.log('===== entering while, typesetCopy=%s, idx=%s, type=%s', print(typesetCopy), idx, type); // DEBUG
  let count = -1; // DEBUG remove
  while (type) { // [].shift() === undefined; undefined isn't a valid type; we'll stop when done
    count++;
    if (count > 4) {
      console.log('===== breaking on count>4, typesetCopy=%s, idx=%s, type=%s', print(typesetCopy), idx, type); // DEBUG
      break;
    }
    console.log('===== starting while, typesetCopy=%s, idx=%s, type=%s', print(typesetCopy), idx, type); // DEBUG
    if (idx === 0) {
      // check for the qualifier, which must be the first element, if specified
      if (qualifiers.check(type)) {
        hasQualifier = true;
        qualifier = type;

        // next type
        type = typesetCopy.shift();
        idx++;
        console.log('===== looping from qualifier=%s, typesetCopy=%s, idx=%s, type=%s', qualifier, print(typesetCopy), idx, type); // DEBUG
        continue;
      }
      // else, must be a type or the validator, which we'll check for below
    }

    console.log('===== will check for validator, typesetCopy=%s, idx=%s, type=%s', print(typesetCopy), idx, type); // DEBUG

    // Before going further, we have to check for an important case in __typeset__:
    //  an Array that has 1-4 elements and represents a single type, possibly with
    //  args (but it could also be 2+ different types, in which case, we need to
    //  process each one individually).
    // For example:
    //  [STRING]
    //  [EXPECTED, {shape}]: one type, qualified
    //  [[...]]: nested array
    //  [OPTIONAL, ARRAY, {args}, [...]]: fully-qualified nested array with args
    //  and more...
    // NOTE: by definition, an Array typeset cannot be empty, and since we've eliminated
    //  the qualifier, if any, with the `idx === 0` case above, the length of typesetCopy
    //  must be at most 3 at this point
    if (typesetCopy.length <= 3) {
      if (typesetCopy.length) {
      }
    }

    if ((!hasQualifier && idx === 0 && typesetCopy.length <= 2) ||
        (hasQualifier && idx === 1 && typesetCopy.length === 1)) {

      if (hasQualifier) {
        // idx === 1 is implied, otherwise hasQualifier would have to be false
        if (typesetCopy.length === 1) {
          // what remains is either another type (string), a function (validator),
          //  or args for `type` (which could be a shape if `type` is an object type)

          // DEBUG TODO

          // since the typeset is valid, the single type cannot be a qualifier: must
          //  be either a string, function, object/shape, array; or args for type

        } else {
          // length must be 2, which means a type and args, or two types

        }
      }
    }

    // check for the validator
    if (isValidator(type)) {
      console.log('===== is validator, typesetCopy=%s, idx=%s, type=%s', print(typesetCopy), idx, type); // DEBUG
      // if we reach the validator (which must be the very last element) in this
      //  loop, none of the types matched, unless the validator is the only
      //  type in the typeset, at which point it gets an implied type of ANY,
      //  which matches any value
      if (typeset.length === 1 || (typeset.length === 2 && hasQualifier)) {
        match = fullyQualify(types.ANY);
      }

      break; // break (since this must be the last element anyway)
    } else {
      console.log('===== not validator, checking argTypes, typesetCopy=%s, idx=%s, type=%s', print(typesetCopy), idx, type); // DEBUG
      // look for type args (if applicable) before checking the value against this type
      let typeArgs;
      if (isString(type) && argTypes.check(type) && typesetCopy.length > 0 &&
          isTypeArgs(typesetCopy[0])) {

        typeArgs = typesetCopy.shift();
        idx++;
      }

      console.log('===== calling check, typesetCopy=%s, idx=%s, type=%s, typeArgs=%s, value=%s', print(typesetCopy), idx, type, print(typeArgs), print(value)); // DEBUG
      const result = check(value, typeArgs ? [type, typeArgs] : type, _getCheckOptions(options, {
        qualifier,
        isTypeset: false // don't assume it's valid since we only check shallow as we go
      }));

      console.log('===== check result=%s, typesetCopy=%s, idx=%s, type=%s', print(result), print(typesetCopy), idx, type); // DEBUG
      if (result.valid) {
        match = fullyQualify(type, qualifier);
        console.log('===== exiting loop on break, match=%s, typesetCopy=%s, idx=%s, type=%s', print(match), print(typesetCopy), idx, type); // DEBUG
        break; // break on first match
      }
    }

    // next type
    type = typesetCopy.shift();
    idx++;
    console.log('===== looping, typesetCopy=%s, idx=%s, type=%s', print(typesetCopy), idx, type); // DEBUG
  };

  let err; // @type {(RtvError|undefined)}

  if (match) {
    // check for a validator at the end of the Array typeset and invoke it
    const lastType = typeset[typeset.length - 1];
    if (isValidator(lastType)) {
      if (!lastType(value, match, typeset)) {
        // invalid in spite of the match since the validator said no
        err = new RtvError(value, typeset, options.path, fullyQualify(typeset, qualifier));
      }
      // else, valid!
    }
    // else, valid, since we have a match
  } else {
    // no match
    err = new RtvError(value, typeset, options.path, fullyQualify(typeset, qualifier));
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
    if (isTypeset(typeset)) {
      options.isTypeset = true;

      if (isString(typeset)) {
        // simple type: check value is of the type
        return checkWithType(value, typeset, options);
      }

      if (isValidator(typeset)) {
        // custom validator: bare function implies the ANY type
        const match = types.ANY;
        const fqMatch = fullyQualify(match);

        // value must be ANY type, and custom validator must return true
        // NOTE: always check values against the _validatorMap
        const result = checkWithType(value, match, options);
        if (!result.valid) {
          return result;
        }

        if (typeset(value, fqMatch, match)) {
          return new RtvSuccess();
        }

        return new RtvError(value, match, options.path, fqMatch);
      }

      if (isShape(typeset)) {
        // shape descriptor: check value against shape
        return checkWithShape(value, typeset, options);
      }

      if (isArray(typeset)) {
        // Array typeset: check value against all types in typeset
        return checkWithArray(value, typeset, options);
      }

      throw new Error(`Missing handler for type of specified typeset=${print(typeset)}`);
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

    throw new Error(`Cannot register an invalid validator for type="${print(validator && validator.type)}": missing at least one required property in [type, config, default]`);
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
  _getCheckOptions,
  // public
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
