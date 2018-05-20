//// Main Implementation Module \\\\

import {isString, isBoolean, isArray, isFunction, isObject, isTypeset} from './validation';
import {DEFAULT_OBJECT_TYPE, default as types} from './types';
import {DEFAULT_QUALIFIER, default as qualifiers} from './qualifiers';
import {print} from './util';
import RtvSuccess from './RtvSuccess';

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
    throw new Error(`Invalid typeset='${print(typeset)}'`);
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
    if (i === 0 && (!isString(rule) || !qualifiers.check(rule))) { // qualifiers are non-empty strs
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
    } else if (isFunction(rule)) { // must be a validator, ANY is implied type if none specified
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
 * Checks a value against a simple type.
 * @function rtv.impl.checkSimple
 * @param {*} value Value to check.
 * @param {string} typeset Simple typeset name, must be one of {@link rtvref.types.types}.
 * @returns {(rtvref.RtvSuccess|rtvref.RtvError)} A success indicator if the
 *  `value` is compliant to the type; an error indicator if not.
 * @throws {Error} If `typeset` is not a valid type name.
 * @see {@link rtvref.types}
 */
export const checkSimple = function(value, typeset) {
  types.verify(typeset);

  let valid = false;
  if (typeset === types.STRING) {
    valid = isString(value);
  } else if (typeset === types.BOOLEAN) {
    valid = isBoolean(value);
  } else {
    throw new Error(`Missing handler for '${print(typeset)}' type`);
  }

  if (valid) {
    return new RtvSuccess();
  }

  // TODO return RtvError if fails
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
      if (isString(typeset)) {
        return checkSimple(value, typeset);
      }

      // TODO other typeset types

      throw new Error(`Missing handler for typeset='${print(typeset)}' type specified`);
    } else {
      throw new Error(`Invalid typeset='${print(typeset)}' specified`);
    }
  } catch (checkErr) {
    const err = new Error(`Cannot check value: ${checkErr.message}`);
    err.rootCause = checkErr;
    throw err;
  }
};
