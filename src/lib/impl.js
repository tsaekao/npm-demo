//// Main Implementation Module \\\\

import {isString, isBoolean, isArray, isFunction, isObject, isTypeset} from './validation';
import types from './types';
import qualifiers from './qualifiers';
import * as util from './util';
import RtvSuccess from './RtvSuccess';

/**
 * RTV Implementation Module
 * @private
 * @namespace rtv.impl
 */

/**
 * Default qualifier: {@link rtvref.qualifiers.REQUIRED}
 * @const {string} rtv.impl.DEFAULT_QUALIFIER
 */
export const DEFAULT_QUALIFIER = qualifiers.REQUIRED;

/**
 * Default object type: {@link rtvref.types.OBJECT}
 * @const {string} rtv.impl.DEFAULT_OBJ_TYPE
 */
export const DEFAULT_OBJ_TYPE = types.OBJECT;

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
    throw new Error(`Invalid typeset=${util.print(typeset)}`);
  }

  // NOTE: from this point on, we ASSUME that the typeset is valid, which lets
  //  us make assumptions about what we find within it; without this knowledge,
  //  the algorithm below would not work

  if (!isArray(typeset)) {
    // must be either a string, object, or function with an implied qualifier
    if (isObject(typeset)) {
      // must be a nested shape descriptor with default object type
      return [DEFAULT_QUALIFIER, DEFAULT_OBJ_TYPE, typeset];
    }

    // either a string (type) or a function, neither of which have an implied type
    return [DEFAULT_QUALIFIER, typeset];
  }

  const fqts = []; // ALWAYS a new array
  let curType; // @type {(string|undefined)} current type in scope or undefined if none

  // typeset is an array: iterate its elements and build fqts iteratively
  typeset.forEach(function(rule, i) {
    if (i === 0 && !qualifiers.check(rule)) {
      fqts.push(DEFAULT_QUALIFIER); // add implied qualifier
    }

    if (isString(rule)) {
      // must be a type
      curType = rule;
      fqts.push(curType);
    } else if (isObject(rule)) {
      if (i === 0) {
        // must be a nested shape descriptor using default object type
        curType = DEFAULT_OBJ_TYPE;
        fqts.push(curType, rule);
      } else {
        // must be args for curType since typeset is an array and object is not
        //  in first position
        fqts.push(rule);
      }
    } else if (isFunction(rule)) { // must be a validator, no implied type
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
    throw new Error(`Missing handler for '${typeset}' type`);
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
    if (isString(typeset)) {
      return checkSimple(value, typeset);
    }
  } catch (checkErr) {
    const err = new Error(
        `Cannot check value: shape is not a valid typeset -- rootCause: ${checkErr.message}`);
    err.rootCause = checkErr;
    throw err;
  }
};
