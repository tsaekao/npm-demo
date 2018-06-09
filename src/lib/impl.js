////// Main Implementation Module

import isArray from './validator/isArray';
import isObject from './validator/isObject';
import isString from './validator/isString';
import isFunction from './validator/isFunction';

import isTypeset from './validation/isTypeset';

import {DEFAULT_OBJECT_TYPE, default as types} from './types';
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
 * Fully-qualifies a typeset, shallow (i.e. the first level only; nested typesets
 *  are not fully-qualified).
 *
 * This function does not modify the input `typeset`.
 *
 * @function rtvref.impl.fullyQualify
 * @param {rtvref.types.typeset} typeset Typeset to fully-qualify.
 * @returns {rtvref.types.fully_qualified_typeset} A new, fully-qualified typeset
 *  representing the input `typeset`. Only the first/immediate level of the
 *  input typeset is fully-qualified. The new array returned contains references
 *  to elements within the input typeset.
 * @throws {Error} If `typeset` is not a valid typeset.
 */
const fullyQualify = function(typeset) {
  if (!isTypeset(typeset)) { // start by validating so we can be confident later
    throw new Error(`Invalid typeset="${print(typeset)}"`);
  }

  // NOTE: from this point on, we ASSUME that the typeset is valid, which lets
  //  us make assumptions about what we find within it; without this knowledge,
  //  the algorithm below would not work

  if (!isArray(typeset)) {
    // must be either a string, object, or function with an implied qualifier
    if (isObject(typeset)) {
      // must be a nested shape descriptor with default object type
      return [DEFAULT_QUALIFIER, DEFAULT_OBJECT_TYPE, typeset];
    }

    // if a function, it has an implied type of ANY
    if (isFunction(typeset)) {
      return [DEFAULT_QUALIFIER, types.ANY, typeset];
    }

    // string (basic type)
    return [DEFAULT_QUALIFIER, typeset];
  }

  const fqts = []; // ALWAYS a new array
  let curType; // @type {(string|undefined)} current type in scope or undefined if none

  // typeset is an array: iterate its elements and build fqts iteratively
  typeset.forEach(function(rule, i) {
    // qualifiers are non-empty strings
    if (i === 0 && (!isString(rule) || !qualifiers.check(rule))) {
      fqts.push(DEFAULT_QUALIFIER); // add implied qualifier
    }

    if (isString(rule)) {
      // must be a type
      curType = rule;
      fqts.push(curType);
    } else if (isObject(rule)) {
      if (i === 0) {
        // must be a nested shape descriptor using default object type
        curType = DEFAULT_OBJECT_TYPE;
        fqts.push(curType, rule);
      } else {
        // must be args for curType since typeset is an array and object is not
        //  in first position
        fqts.push(rule);
      }
    // must be a validator, ANY is implied type if none specified
    } else if (isFunction(rule)) {
      if (!curType) {
        curType = types.ANY;
        fqts.push(curType);
      }

      fqts.push(rule);
    } else { // must be an array
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
 * Checks a value against a simple type using the
 *  {@link rtvref.qualifiers.DEFAULT_QUALIFIER default qualifier}.
 * @function rtvref.impl.checkType
 * @param {*} value Value to check.
 * @param {string} type Simple type name, must be one of {@link rtvref.types.types}.
 * @returns {(rtvref.RtvSuccess|rtvref.RtvError)} A success indicator if the
 *  `value` is compliant to the type; an error indicator if not.
 * @throws {Error} If `type` is not a valid type name.
 * @see {@link rtvref.types}
 */
const checkType = function(value, type) {
  types.verify(type);

  if (_validatorMap[type]) {
    // call the validator for the specified type
    const valid = validatorMap[type](value, DEFAULT_QUALIFIER);

    if (valid) {
      return new RtvSuccess();
    }

    return new RtvError(value, type, 'unknown.path', fullyQualify(type)); // TODO: add right params...
  }

  throw new Error(`Missing validator for type="${print(type)}"`);
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
const check = function(value, typeset) {
  // TODO: on check failure (with a valid typeset), return a special RtvError object that
  //  contains extra properties to indicate what didn't match, what was expected,
  //  the shape that was checked, the value that was checked, etc.
  //  If check succeeds, return boolean `true`. rtv.check/verify can then test
  //  for the return type since impl shouldn't be exposed externally anyway.
  try {
    if (isTypeset(typeset)) {
      if (isString(typeset)) {
        return checkType(value, typeset);
      }

      // TODO other typeset types

      throw new Error(`Missing handler for typeset="${print(typeset)}" type specified`);
    } else {
      throw new Error(`Invalid typeset="${print(typeset)}" specified`);
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

  _validatorMap[validator.type, validator.default];
};

////////////////////////////////////////////////////////////////////////////////
// Define and export the module

// define the module to be exported: properties/methods with an underscore prefix
//  will be converted to non-enumerable properties/methods
const impl = {
  // internal
  _validatorMap, // exposed mainly to support unit testing
  _registerType,
  // public
  fullyQualify,
  checkType,
  check
};

// make properties/methods with underscore prefix internal by making them
//  non-enumerable (but otherwise, a normal property)
Object.keys(impl).forEach(function(method, name) {
  if (name.indexOf('_') === 0) {
    Object.defineProperty(impl, name, {
      enumerable: false,
      configurable: true,
      writable: true,
      value: method
    });
  }
});

export default impl;
