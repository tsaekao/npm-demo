////// Utility for testing validation modules

import _ from 'lodash';

import types from '../../../src/lib/types';
import * as util from '../../../src/lib/util';

/**
 * Get a fresh copy of the valid values type map, or just one valid value type array.
 * @param {string} [type] The valid value type array to get.
 * @returns {(Object|Array|undefined)} If `type` is specified and a known type,
 *  returns an array of valid values for that type. If `type` is unknown, returns
 *  `undefined`. If `type` is not specified, returns a map of type to array of
 *  valid values for each type.
 */
export const getValidValues = function(type) {
  // map of type to _valid_ values for that type
  const validValues = {
    //
    // primitives
    //

    [types.ANY]: [undefined, null],
    [types.STRING]: ['literal-string'],
    [types.BOOLEAN]: [true, false],
    [types.SYMBOL]: [Symbol(), Symbol('symbol'), Symbol(1), Symbol.for('other')],

    [types.NUMBER]: [-1, -0, 0, 1, Number.MIN_VALUE, Number.MIN_SAFE_INTEGER,
      Number.MAX_VALUE, Number.MAX_SAFE_INTEGER, Number.EPSILON,
      7.7, -7.7, Infinity, -Infinity, Number.POSITIVE_INFINITY, Number.NEGATIVE_INFINITY],
    [types.FINITE]: [-1, -0, 0, 1, Number.MIN_VALUE, Number.MIN_SAFE_INTEGER,
      Number.MAX_VALUE, Number.MAX_SAFE_INTEGER, Number.EPSILON, 7.7, -7.7],
    [types.INT]: [-1, -0, 0, 1, Number.MIN_VALUE, Number.MIN_SAFE_INTEGER,
      Number.MAX_VALUE, Number.MAX_SAFE_INTEGER, Number.EPSILON],
    [types.FLOAT]: [7.7, -7.7],

    //
    // non-primitives
    //

    [types.ARRAY]: [[], [1], [false], [{}], ['foo'], [function() {}]],
    [types.MAP]: [new Map(), new Map([[1, 'one'], [2, 'two']])],
    [types.WEAK_MAP]: (function() {
      const pairs = [[{}, 'one'], [{}, 'two']]; // hold refs so objects don't get GC'ed during tests
      return [new WeakMap(), new WeakMap(pairs)]; // keys must be objects
    }()),
    [types.SET]: [new Set(), new Set([undefined, null, 1, false, 'foo', {}, [],
      function() {}, /regex/])],
    [types.WEAK_SET]: (function() {
      // NOTE: weak sets can only contain objects
      const values = [{}, [], function() {}, /regex/]; // hold refs so objects don't get GC'ed during tests
      return [new WeakSet(), new WeakSet(values)];
    }()),
    [types.REGEXP]: [/regexp/, new RegExp('regexp')],
    [types.FUNCTION]: [function() {}, new Function('a', 'b', 'return a + b;')],
    [types.OBJECT]: [new String('new-string'), new Boolean(true), new Boolean(false), // eslint-disable-line no-new-wrappers
      new Number(1), new Object(), {}, new (function() {})()] // eslint-disable-line no-new-wrappers
  };

  return type ? validValues[type] : validValues;
};

/**
 * Test valid values against a type's validation function. All of them should pass.
 * @param {string} type The type being tested. Not validated as a type if
 *  `values` is specified.
 * @param {function} valFn The type's validation function.
 * @param {Array} [values] Optional override list of values to test.
 * @param {Object} [valFnParams] Optional settings object to pass to the
 *  validation function.
 * @returns {Object} Results:
 *  - {Array.<string>} failures Empty array if all values were validated (good).
 *    Otherwise, messages indicating which values failed (bad).
 *  - {Array.<number>} passes Array of indexes in `values` that passed validation.
 */
export const testValues = function(type, valFn, values, valFnParams) {
  values = values || getValidValues(types.verify(type)); // get valid values for the type
  if (!values || values.length === 0) {
    throw new Error(`Missing values for ${util.print(type)}`);
  }

  const passes = [];
  const failures = [];
  _.forEach(values, function(v, i) {
    if (valFn(v, valFnParams)) {
      passes.push(i);
    } else {
      failures.push(`${util.print(type)}[${i}] failed, v=${util.print(v)}`);
    }
  });

  return {
    passes,
    failures
  };
};

/**
 * Test other values against a type's validation function. _None_ of them should pass.
 * @param {string} type The type being tested. Must be a valid type and be in
 *  `validValues`.
 * @param {function} valFn The type's validation function.
 * @param {boolean} [treatAsValid=false] If truthy, the tests are reversed (treats
 *  all other values as valid instead of invalid).
 * @returns {Array.<string>} Empty array if no other values were validated (good).
 *  Otherwise, messages indicating which other values passed (bad). The opposite
 *  is true if `treatAsValid` is truthy.
 */
export const testOtherValues = function(type, valFn, treatAsValid) {
  types.verify(type);
  const validValues = getValidValues();
  if (!validValues.hasOwnProperty(type) || validValues[type].length === 0) {
    throw new Error(`Missing valid test values for ${util.print(type)}`);
  }

  delete validValues[type]; // keep other (invalid) values

  const violations = [];
  _.forEach(validValues, function(otherValues, otherType) {
    _.forEach(otherValues, function(v, i) {
      const result = valFn(v);
      if ((result && !treatAsValid) || (!result && treatAsValid)) {
        violations.push(
            `${util.print(type)}: ${util.print(otherType)}[${i}] passed, v=${util.print(v)}`);
      }
    });
  });

  return violations;
};
