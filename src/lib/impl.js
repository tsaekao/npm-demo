////// Main Implementation Module

import * as isAny from './validation/isAny';
import * as isBoolean from './validation/isBoolean';
import * as isString from './validation/isString';
import * as isFunction from './validation/isFunction';
import * as isRegExp from './validation/isRegExp';
import * as isSymbol from './validation/isSymbol';

import * as isFinite from './validation/isFinite';
import * as isNumber from './validation/isNumber';

import * as isArray from './validation/isArray';

import * as isAnyObject from './validation/isAnyObject';
import * as isObject from './validation/isObject';

import * as isMap from './validation/isMap';
import * as isWeakMap from './validation/isWeakMap';

import * as isSet from './validation/isSet';
import * as isWeakSet from './validation/isWeakSet';

import {isTypeset} from './validation/validation';
import {DEFAULT_OBJECT_TYPE, default as types} from './types';
import {DEFAULT_QUALIFIER, default as qualifiers} from './qualifiers';
import {print} from './util';
import RtvSuccess from './RtvSuccess';
import RtvError from './RtvError';

// @type {Object.<string,function>} Map of validator type (string) to validator
//  function.
// TODO: In the future, with plugins, this should be dynamically-generated somehow.
const validatorMap = {
  [isAny.type]: isAny.validator,
  [isBoolean.type]: isBoolean.validator,
  [isString.type]: isString.validator,
  [isFunction.type]: isFunction.validator,
  [isRegExp.type]: isRegExp.validator,
  [isSymbol.type]: isSymbol.validator,
  [isFinite.type]: isFinite.validator,
  [isNumber.type]: isNumber.validator,
  [isArray.type]: isArray.validator,
  [isAnyObject.type]: isAnyObject.validator,
  [isObject.type]: isObject.validator,
  [isMap.type]: isMap.validator,
  [isWeakMap.type]: isWeakMap.validator,
  [isSet.type]: isSet.validator,
  [isWeakSet.type]: isWeakSet.validator
};

/**
 * RTV Implementation Module
 * @private
 * @namespace rtv.impl
 */

/**
 * Fully-qualifies a typeset, shallow (i.e. the first level only; nested typesets
 *  are not fully-qualified).
 *
 * This function does not modify the input `typeset`.
 *
 * @function rtv.impl.fullyQualify
 * @param {rtvref.types.typeset} typeset Typeset to fully-qualify.
 * @returns {rtvref.types.fully_qualified_typeset} A new, fully-qualified typeset
 *  representing the input `typeset`. Only the first/immediate level of the
 *  input typeset is fully-qualified. The new array returned contains references
 *  to elements within the input typeset.
 * @throws {Error} If `typeset` is not a valid typeset.
 */
export const fullyQualify = function(typeset) {
  if (!isTypeset(typeset)) { // start by validating so we can be confident later
    throw new Error(`Invalid typeset="${print(typeset)}"`);
  }

  // NOTE: from this point on, we ASSUME that the typeset is valid, which lets
  //  us make assumptions about what we find within it; without this knowledge,
  //  the algorithm below would not work

  if (!isArray.validator(typeset)) {
    // must be either a string, object, or function with an implied qualifier
    if (isObject.validator(typeset)) {
      // must be a nested shape descriptor with default object type
      return [DEFAULT_QUALIFIER, DEFAULT_OBJECT_TYPE, typeset];
    }

    // if a function, it has an implied type of ANY
    if (isFunction.validator(typeset)) {
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
    if (i === 0 && (!isString.validator(rule) || !qualifiers.check(rule))) {
      fqts.push(DEFAULT_QUALIFIER); // add implied qualifier
    }

    if (isString.validator(rule)) {
      // must be a type
      curType = rule;
      fqts.push(curType);
    } else if (isObject.validator(rule)) {
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
    } else if (isFunction.validator(rule)) {
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
 * @function rtv.impl.checkSimple
 * @param {*} value Value to check.
 * @param {string} typeset Simple type name, must be one of {@link rtvref.types.types}.
 * @returns {(rtvref.RtvSuccess|rtvref.RtvError)} A success indicator if the
 *  `value` is compliant to the type; an error indicator if not.
 * @throws {Error} If `typeset` is not a valid type name.
 * @see {@link rtvref.types}
 */
export const checkSimple = function(value, typeset) {
  types.verify(typeset);

  if (validatorMap[typeset]) {
    // call the validator for the specified type
    const valid = validatorMap[typeset](value, DEFAULT_QUALIFIER);

    if (valid) {
      return new RtvSuccess();
    }

    return new RtvError(value, typeset, 'unknown.path', fullyQualify(typeset)); // TODO: add right params...
  }

  throw new Error(`Missing validator for "${print(typeset)}" type`);
};

/**
 * Checks a value against a shape/typeset.
 * @function rtv.impl.check
 * @param {*} value Value to check.
 * @param {rtvref.types.typeset} typeset Expected shape/type of the value.
 * @returns {(rtvref.RtvSuccess|rtvref.RtvError)} Success indicator if the `value`
 *  is compliant to the `typeset`; error indicator otherwise. An exception is
 *  __not__ thrown if the `value` is non-compliant.
 * @throws {Error} If `typeset` is not a valid typeset.
 * @see {@link rtvref.types.typeset}
 * @see {@link rtvref.shape_descriptor}
 */
export const check = function(value, typeset) {
  // TODO: on check failure (with a valid typeset), return a special RtvError object that
  //  contains extra properties to indicate what didn't match, what was expected,
  //  the shape that was checked, the value that was checked, etc.
  //  If check succeeds, return boolean `true`. rtv.check/verify can then test
  //  for the return type since impl shouldn't be exposed externally anyway.
  try {
    if (isTypeset(typeset)) {
      if (isString.validator(typeset)) {
        return checkSimple(value, typeset);
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
