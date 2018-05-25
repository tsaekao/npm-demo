import {expect} from 'chai';
import _ from 'lodash';

import * as val from '../../src/lib/validation';
import types, {DEFAULT_OBJECT_TYPE} from '../../src/lib/types';
import qualifiers, {DEFAULT_QUALIFIER} from '../../src/lib/qualifiers';
import * as util from '../../src/lib/util';

describe('module: lib/validation', function() {
  let validValues;

  // Test valid values against a type's validation function. All of them should pass.
  // @param {string} type The type being tested. Not validated as a type if
  //  `values` is specified.
  // @param {function} valFn The type's validation function.
  // @param {Array} [values] Optional override list of values to test.
  // @param {Object} [valFnParams] Optional settings object to pass to the
  //  validation function.
  // @returns {Object} Results:
  //  - {Array.<string>} failures Empty array if all values were validated (good).
  //    Otherwise, messages indicating which values failed (bad).
  //  - {Array.<number>} passes Array of indexes in `values` that passed validation.
  const testValues = function(type, valFn, values, valFnParams) {
    values = values || validValues[types.verify(type)]; // get valid values for the type
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
      throw new Error(`validValues is missing values for ${util.print(type)}`);
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
      [types.OBJECT]: [new String('new-string'), new Boolean(true), new Boolean(false), // eslint-disable-line no-new-wrappers
        new Number(1), new Object(), {}, new (function() {})()] // eslint-disable-line no-new-wrappers
    };
  });

  describe('#isAny', function() {
    it('valid values', function() {
      expect(testValues(types.ANY, val.isAny).failures).to.eql([]);
    });

    it('other types/values', function() {
      // for ANY, _all_ other values should be _valid_ also
      expect(testOtherValues(types.ANY, val.isAny, true)).to.eql([]);
    });
  });

  describe('#isString', function() {
    it('valid values', function() {
      expect(testValues(types.STRING, val.isString).failures).to.eql([]);
    });

    it('other types/values', function() {
      expect(testOtherValues(types.STRING, val.isString)).to.eql([]);
    });

    it('optionally allows empty strings', function() {
      expect(val.isString('')).to.equal(false);
      expect(val.isString('', {emptyOk: true})).to.equal(true);
    });
  });

  describe('#isBoolean', function() {
    it('valid values', function() {
      expect(testValues(types.BOOLEAN, val.isBoolean).failures).to.eql([]);
    });

    it('other types/values', function() {
      expect(testOtherValues(types.BOOLEAN, val.isBoolean)).to.eql([]);
    });
  });

  describe('#isSymbol', function() {
    it('valid values', function() {
      expect(testValues(types.SYMBOL, val.isSymbol).failures).to.eql([]);
    });

    it('other types/values', function() {
      expect(testOtherValues(types.SYMBOL, val.isSymbol)).to.eql([]);
    });
  });

  describe('#isNumber', function() {
    it('valid values', function() {
      expect(testValues(types.NUMBER, val.isNumber).failures).to.eql([]);
    });

    it('other types/values', function() {
      expect(testOtherValues(types.NUMBER, val.isNumber)).to.eql([]);
    });
  });

  describe('#isArray', function() {
    it('valid values', function() {
      expect(testValues(types.ARRAY, val.isArray).failures).to.eql([]);
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
      expect(testValues('isPrimitive', val.isPrimitive, values).failures).to.eql([]);
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

      expect(testValues('isAnyObject', val.isAnyObject, values).failures).to.eql([]);
    });
  });

  describe('#isTypeset', function() {
    describe('shallow', function() {
      let goodValues; // @type {Array}
      let badValues; // @type {Array}

      beforeEach(function() {
        goodValues = [
          {foo: null}, // null is invalid, but we aren't checking deep
          types.STRING,
          [types.ANY],
          [[types.FLOAT]],
          function() {},
          [{foo: types.STRING}],

          // ANY type is implied since there are no other types before the validator
          [DEFAULT_QUALIFIER, function() {}],

          // OBJECT type is implied since the shape descriptor is first immediately
          //  after the qualifier
          [DEFAULT_QUALIFIER, {foo: types.STRING}],

          // object type specified before shape that is not in first position after qualifier
          [DEFAULT_QUALIFIER, types.ANY, DEFAULT_OBJECT_TYPE, {foo: types.STRING}],

          {}, // empty shapes are OK
          [types.PLAIN_OBJECT, {}], // shape is type's args

          // an array with args
          [types.ARRAY, {min: 1}, [types.FINITE]],

          // since we aren't going deep, we should ignore the fact that the shape
          //  of the class object has a property with an invalid typeset
          [types.CLASS_OBJECT, {shape: {foo: ['invalid-type']}}],

          // should be fine as a class object without args (or a shape)
          types.CLASS_OBJECT,
          [types.CLASS_OBJECT],

          [types.MAP_OBJECT, {count: 2}],
          [[{foo: types.STRING}]]
        ];

        badValues = [
          undefined,
          null,
          1,
          /asdf/,
          Symbol('foo'),
          [],
          'invalid-type',
          true,
          false,

          // a type may only be specified once
          [types.STRING, types.STRING],

          // shape descriptor is not second after qualifier, and ANY does not
          //  take any args
          [DEFAULT_QUALIFIER, types.ANY, {foo: types.FINITE}],

          // invalid value type in typeset
          [Symbol('foo')],

          // invalid/unknown type in array typeset
          ['invalid-type'],

          // qualifier in wrong position
          [types.STRING, DEFAULT_QUALIFIER],

          // second object/shape is un-typed since it's not first in the array typeset
          [types.PLAIN_OBJECT, {}, {}],

          // duplicate type
          [DEFAULT_QUALIFIER, types.FUNCTION, types.FUNCTION],

          // cannot have more than one qualifier
          [qualifiers.REQUIRED, qualifiers.OPTIONAL, types.STRING],
          [qualifiers.REQUIRED, types.STRING, qualifiers.OPTIONAL],

          [DEFAULT_QUALIFIER, 'invalid-type'], // invalid type
          [DEFAULT_QUALIFIER, true] // invalid value type in typeset
        ];
      });

      it('should validate shallow typesets', function() {
        let results = testValues('isTypeset', val.isTypeset, goodValues);
        expect(results.failures).to.eql([]);

        results = testValues('isTypeset', val.isTypeset, badValues);
        expect(results.passes).to.eql([]);
      });

      it('should validate shallow fully-qualified typesets', function() {
        goodValues[0] = [DEFAULT_QUALIFIER, DEFAULT_OBJECT_TYPE, goodValues[0]];
        goodValues[1] = [DEFAULT_QUALIFIER, goodValues[1]];
        goodValues[2].unshift(DEFAULT_QUALIFIER);
        goodValues[3] = [DEFAULT_QUALIFIER, types.ARRAY, goodValues[3]]; // make it pass by qualifying
        goodValues[4] = [DEFAULT_QUALIFIER, types.ANY, goodValues[4]];
        goodValues[5] = [DEFAULT_QUALIFIER, types.ARRAY, goodValues[5]];
        goodValues[6].splice(1, 0, types.STRING);
        goodValues[7].splice(1, 0, types.PLAIN_OBJECT);
        goodValues[9] = [DEFAULT_QUALIFIER, types.MAP_OBJECT, goodValues[9]];
        goodValues[10].unshift(DEFAULT_QUALIFIER);
        goodValues[11].unshift(DEFAULT_QUALIFIER);
        goodValues[12].unshift(DEFAULT_QUALIFIER);
        goodValues[13] = [DEFAULT_QUALIFIER, goodValues[13]];
        goodValues[14].unshift(DEFAULT_QUALIFIER);
        goodValues[15].unshift(DEFAULT_QUALIFIER);
        goodValues[16].unshift(DEFAULT_QUALIFIER, types.ARRAY);

        goodValues.push(
            [DEFAULT_QUALIFIER, DEFAULT_OBJECT_TYPE, {foo: types.STRING}]
        );

        let results = testValues('isTypeset', val.isTypeset, goodValues, {fullyQualified: true});
        expect(results.failures).to.eql([]);

        badValues.push(
            // qualifier is always first
            [function() {}, DEFAULT_QUALIFIER, types.ANY],

            // only one validator
            [DEFAULT_QUALIFIER, types.ANY, function() {}, function() {}],

            // missing type (when not FQ'd, then ANY is implied)
            [DEFAULT_QUALIFIER, function() {}],

            // validator must be last element
            [DEFAULT_QUALIFIER, types.STRING, function() {}, types.FINITE],

            // missing ARRAY type
            [DEFAULT_QUALIFIER, [types.STRING]]
        );

        results = testValues('isTypeset', val.isTypeset, badValues, {fullyQualified: true});
        expect(results.passes).to.eql([]);
      });
    });

    describe('deep', function() {
      let goodValues; // @type {Array}
      let badValues; // @type {Array}

      beforeEach(function() {
        const shapeWithNonEnumerable = {
          foo: types.FUNCTION
        };
        Object.defineProperty(shapeWithNonEnumerable, 'invalid', {
          value: null // invalid typeset, but prop non-enumerable so shouldn't cause failure
        });

        const shapeWithProtoProp = Object.create({
          invalid: null // invalid typeset, but on prototype so shouldn't cause failure
        })
        .foo = types.JSON;

        goodValues = [
          {foo: types.FINITE},
          types.STRING,
          [types.ANY],
          function() {},
          [types.STRING, [types.STRING]],
          {foo: {bar: [types.STRING]}},

          // a shape with property 'foo' that's either an array of strings (maybe empty)
          //  or a finite number that is exactly 7
          {foo: [[types.STRING], types.FINITE, {exact: 7}]},

          shapeWithNonEnumerable,
          shapeWithProtoProp,
          [types.CLASS_OBJECT, {shape: {foo: [types.PLAIN_OBJECT]}}],

          // should be fine deep as a class object without args (or a shape)
          types.CLASS_OBJECT,
          [qualifiers.OPTIONAL, types.CLASS_OBJECT],

          [types.MAP_OBJECT, {count: 2}]
        ];

        badValues = [
          {foo: null},
          undefined,
          null,
          1,
          /asdf/,
          Symbol('foo'),
          true,
          false,

          // STRING type appears more than once in the nested (array) typeset
          [types.STRING, [types.STRING, types.STRING]],

          // nested shape with an invalid type
          {foo: {bar: ['invalid-type']}},

          // validator is not last element in deep-nested typeset
          [{foo: [{bar: [{baz: [types.STRING, function() {}, types.REGEXP]}] }] }],

          // for class object, we should be going deep into the shape property of
          //  the args object and finding the invalid typeset
          [types.CLASS_OBJECT, {shape: {foo: [types.STRING, DEFAULT_QUALIFIER]}}]
        ];
      });

      it('should validate deep typesets', function() {
        let results = testValues('isTypeset', val.isTypeset, goodValues, {deep: true});
        expect(results.failures).to.eql([]);

        results = testValues('isTypeset', val.isTypeset, badValues, {deep: true});
        expect(results.passes).to.eql([]);
      });

      it('should validate deep fully-qualified typesets', function() {
        goodValues[0].foo = [DEFAULT_QUALIFIER, goodValues[0].foo];
        goodValues[0] = [DEFAULT_QUALIFIER, DEFAULT_OBJECT_TYPE, goodValues[0]];

        goodValues[1] = [DEFAULT_QUALIFIER, goodValues[1]];
        goodValues[2].unshift(DEFAULT_QUALIFIER);
        goodValues[3] = [DEFAULT_QUALIFIER, types.ANY, goodValues[3]];

        goodValues[4][1].unshift(DEFAULT_QUALIFIER);
        goodValues[4].splice(1, 0, types.ARRAY);
        goodValues[4].unshift(DEFAULT_QUALIFIER);

        goodValues[5].foo.bar.unshift(DEFAULT_QUALIFIER);
        goodValues[5].foo = [DEFAULT_QUALIFIER, DEFAULT_OBJECT_TYPE, goodValues[5].foo];
        goodValues[5] = [DEFAULT_QUALIFIER, DEFAULT_OBJECT_TYPE, goodValues[5]];

        goodValues[6].foo[0].unshift(DEFAULT_QUALIFIER);
        goodValues[6] = [DEFAULT_QUALIFIER, types.ARRAY, goodValues[6]];

        goodValues[7].foo = [DEFAULT_QUALIFIER, types.ANY, goodValues[7].foo];
        goodValues[7] = [DEFAULT_QUALIFIER, DEFAULT_OBJECT_TYPE, goodValues[7]];

        goodValues[8] = [DEFAULT_QUALIFIER, DEFAULT_OBJECT_TYPE, goodValues[8]];

        goodValues[9][1].shape.foo.unshift(DEFAULT_QUALIFIER);
        goodValues[9].unshift(DEFAULT_QUALIFIER);

        goodValues[10] = [DEFAULT_QUALIFIER, goodValues[10]];
        // goodValues[11] is already FQ
        goodValues[12].unshift(DEFAULT_QUALIFIER);

        let results = testValues('isTypeset', val.isTypeset, goodValues,
            {deep: true, fullyQualified: true});
        expect(results.failures).to.eql([]);

        badValues.push(
            // foo has invalid typeset
            [DEFAULT_QUALIFIER, types.CLASS_OBJECT, {
              shape: {
                foo: [types.STRING, DEFAULT_QUALIFIER]
              }
            }],

            [DEFAULT_QUALIFIER, DEFAULT_OBJECT_TYPE, {
              foo: [DEFAULT_QUALIFIER, DEFAULT_OBJECT_TYPE, {
                bar: [DEFAULT_QUALIFIER, DEFAULT_OBJECT_TYPE, {
                  // validator is not last element here
                  baz: [DEFAULT_QUALIFIER, types.STRING, function() {}, types.REGEXP]
                }]
              }]
            }]
        );

        results = testValues('isTypeset', val.isTypeset, badValues,
            {deep: true, fullyQualified: true});
        expect(results.passes).to.eql([]);
      });
    });
  });
});
