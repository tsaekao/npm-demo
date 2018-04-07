import {expect} from 'chai';
import _ from 'lodash';

import * as val from '../../src/lib/validation';
import types from '../../src/lib/types';

describe('module: lib/validation', function() {
  let validValues;

  // Test valid values against a type's validation function. All of them should pass.
  // @param {string} type The type being tested. Not validated as a type if
  //  `values` is specified.
  // @param {function} valFn The type's validation function.
  // @param {Array} [values] Optional override list of values to test.
  // @returns {Array.<string>} Empty array if all values were validated (good).
  //  Otherwise, messages indicating which values failed (bad).
  const testValues = function(type, valFn, values) {
    values = values || validValues[types.verify(type)]; // get valid values for the type
    if (!values || values.length === 0) {
      throw new Error(`Missing values for ${type}`);
    }

    const failures = [];
    _.forEach(values, function(v, i) {
      if (!valFn(v)) {
        failures.push(`${type}[${i}] failed, v=${v}`);
      }
    });

    return failures;
  };

  // Test other values against a type's validation function. _None_ of them should pass.
  // @param {string} type The type being tested. Must be a valid type and be in
  //  `validValues`.
  // @param {function} valFn The type's validation function.
  // @param {boolean} [treatAsValid=false] If truthy, the tests are reversed (treats
  //  all other values as valid instead of invalid).
  // @returns {Array.<string>} Empty array if no other values were validated (good).
  //  Otherwise, messages indicating which other values passed (bad). The opposite
  //  is true if `treatAsValid` is truthy.
  const testOtherValues = function(type, valFn, treatAsValid) {
    types.verify(type);
    if (!validValues.hasOwnProperty(type) || validValues[type].length === 0) {
      throw new Error(`validValues is missing values for ${type}`);
    }

    delete validValues[type]; // keep other (invalid) values

    const violations = [];
    _.forEach(validValues, function(otherValues, otherType) {
      _.forEach(otherValues, function(v, i) {
        const result = valFn(v);
        if ((result && !treatAsValid) || (!result && treatAsValid)) {
          violations.push(`${type}: ${otherType}[${i}] passed, v=${v}`);
        }
      });
    });

    return violations;
  };

  beforeEach(function() {
    // map of type to _valid_ values for that type
    validValues = {
      //
      // primitives
      //

      [types.ANY]: [undefined, null],
      [types.STRING]: ['literal-string'],
      [types.BOOLEAN]: [true, false],
      [types.SYMBOL]: [Symbol(), Symbol('symbol'), Symbol(1), Symbol.for('other')],
      [types.NUMBER]: [-1, -0, 0, 1, Number.MIN_VALUE, Number.MIN_SAFE_INTEGER,
          Number.MAX_VALUE, Number.MAX_SAFE_INTEGER, NaN, Infinity, -Infinity],

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
      [types.OBJECT]: [new String('new-string'), new Boolean(true), new Boolean(false),
          new Number(1), new Object(), {}, new function() {}]
    };
  });

  describe('#isAny', function() {
    it('valid values', function() {
      expect(testValues(types.ANY, val.isAny)).to.eql([]);
    });

    it('other types/values', function() {
      // for ANY, _all_ other values should be _valid_ also
      expect(testOtherValues(types.ANY, val.isAny, true)).to.eql([]);
    });
  });

  describe('#isString', function() {
    it('valid values', function() {
      expect(testValues(types.STRING, val.isString)).to.eql([]);
    });

    it('other types/values', function() {
      expect(testOtherValues(types.STRING, val.isString)).to.eql([]);
    });

    it('optionally allows empty strings', function() {
      expect(val.isString('')).to.equal(false);
      expect(val.isString('', true)).to.equal(true);
    });
  });

  describe('#isBoolean', function() {
    it('valid values', function() {
      expect(testValues(types.BOOLEAN, val.isBoolean)).to.eql([]);
    });

    it('other types/values', function() {
      expect(testOtherValues(types.BOOLEAN, val.isBoolean)).to.eql([]);
    });
  });

  describe('#isSymbol', function() {
    it('valid values', function() {
      expect(testValues(types.SYMBOL, val.isSymbol)).to.eql([]);
    });

    it('other types/values', function() {
      expect(testOtherValues(types.SYMBOL, val.isSymbol)).to.eql([]);
    });
  });

  describe('#isNumber', function() {
    it('valid values', function() {
      expect(testValues(types.NUMBER, val.isNumber)).to.eql([]);
    });

    it('other types/values', function() {
      expect(testOtherValues(types.NUMBER, val.isNumber)).to.eql([]);
    });
  });

  describe('#isArray', function() {
    it('valid values', function() {
      expect(testValues(types.ARRAY, val.isArray)).to.eql([]);
    });

    it('other types/values', function() {
      expect(testOtherValues(types.ARRAY, val.isArray)).to.eql([]);
    });
  });

  describe('#isPrimitive', function() {
    it('should validate JavaScript primitives', function() {
      const values = [''].concat(validValues[types.STRING],
          validValues[types.BOOLEAN], validValues[types.NUMBER],
          validValues[types.SYMBOL]);
      expect(testValues('isPrimitive', val.isPrimitive, values)).to.eql([]);
    });
  });

  describe('#isAnyObject', function() {
    it('should validate any object', function() {
      const validTypes = Object.keys(validValues);
      _.pull(validTypes, types.ANY, types.STRING, types.BOOLEAN, types.NUMBER, types.SYMBOL); // remove primitives

      let values = [];
      _.forEach(validTypes, function(type) {
        values = values.concat(validValues[type]);
      });

      expect(testValues('isAnyObject', val.isAnyObject, values)).to.eql([]);
    });
  });

  describe('#isTypeset', function() {
    it('should validate shallow typesets', function() {
      const values = [
        {foo: null}, // not checking deep
        types.STRING,
        [types.ANY],
        function() {}
      ];
      expect(testValues('isTypeset', val.isTypeset, values)).to.eql([]);
    });

    it('should validate deep typesets'); // TODO
    it('should validate fully-qualified shallow typesets'); // TODO
    it('should validate fully-qualified deep typesets'); // TODO
  });
});
