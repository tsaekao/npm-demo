//// Main Implementation Module \\\\

import {isString, isBoolean} from './validation';
import types from './types';

/**
 * RTV Implementation Module
 * @private
 * @namespace rtv.impl
 */

// TODO
// const fullyQualify = function(typeset) {
//   if (!isTypeset(typeset)) {
//     throw new Error(`Invalid typeset=${typeset}`);
//   }

//   const fqts = [];

//   if (isArray(typeset)) {
//     if (!qualifiers.check(typeset[0])) {
//       fqts.push(qualifiers.REQUIRED, ...typeset); // TODO this needs serious TLC...
//     }
//   } else {
//     fqts.push(qualifiers.REQUIRED, typeset); // TODO this needs serious TLC...
//   }

//   return fqts;
// };

/**
 * Checks a value against a simple type.
 * @function rtv.impl.checkSimple
 * @param {*} value Value to check.
 * @param {string} typeset Simple typeset name, must be one of {@link rtvref.types.types}.
 * @returns {(boolean|rtvref.RtvError)}
 * @throws {Error} If `typeset` is not a valid type name.
 */
const checkSimple = function(value, typeset) {
  types.verify(typeset);

  if (typeset === types.STRING) {
    return isString(value); // TODO return RtvError if fails
  } else if (typeset === types.BOOLEAN) {
    return isBoolean(value); // TODO return RtvError if fails
  }

  throw new Error(`Missing handler for '${typeset}' type`);
};

/**
 * Checks a value against a shape.
 * @function rtv.impl.check
 * @param {*} value Value to check.
 * @param {rtvref.types.typeset} typeset Expected shape/type of the value.
 * @returns {(boolean|rtvref.RtvError)} `true` if the `value` is compliant to the
 *  `typeset`; `RtvError` otherwise. An exception is __not__ thrown if the `value`
 *  is non-compliant.
 * @throws {Error} If `typeset` is not a valid typeset.
 * @see {@link rtv.impl.verify}
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
