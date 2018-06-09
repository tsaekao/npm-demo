////// isPrimitive validation module

import isString from '../validator/isString';
import isBoolean from '../validator/isBoolean';
import isNumber from '../validator/isNumber';
import isSymbol from '../validator/isSymbol';

import qualifiers from '../qualifiers';

/**
 * Determines if a value is a JavaScript {@link rtvref.types.primitives primitive}.
 * @function rtvref.validation.isPrimitive
 * @param {*} v Value to validate.
 * @returns {boolean} `true` if it is; `false` otherwise.
 */
export default isPrimitive = function(v) {
  return v === undefined || v === null ||
      isString(v, qualifiers.EXPECTED) || // empty strings are OK in this case
      isBoolean(v) ||
      isNumber(v) ||
      isSymbol(v);
};
