import {expect} from 'chai';

import * as vtu from '../validationTestUtil';
import types, {DEFAULT_OBJECT_TYPE} from '../../../src/lib/types';
import qualifiers, {DEFAULT_QUALIFIER} from '../../../src/lib/qualifiers';
import isTypeset from '../../../src/lib/validation/isTypeset';

describe('module: lib/validation/isTypeset', function() {
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
      let results = vtu.testValues('isTypeset', isTypeset, goodValues);
      expect(results.failures).to.eql([]);

      results = vtu.testValues('isTypeset', isTypeset, badValues);
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

      let results = vtu.testValues('isTypeset', isTypeset, goodValues, {fullyQualified: true});
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

      results = vtu.testValues('isTypeset', isTypeset, badValues, {fullyQualified: true});
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
      let results = vtu.testValues('isTypeset', isTypeset, goodValues, {deep: true});
      expect(results.failures).to.eql([]);

      results = vtu.testValues('isTypeset', isTypeset, badValues, {deep: true});
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

      let results = vtu.testValues('isTypeset', isTypeset, goodValues,
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

      results = vtu.testValues('isTypeset', isTypeset, badValues,
          {deep: true, fullyQualified: true});
      expect(results.passes).to.eql([]);
    });
  });

  describe('other', function() {
    it('should not allow more than 1 custom validator', function() {
      expect(isTypeset(function() {})).to.be.true;
      expect(isTypeset([function() {}])).to.be.true;
      expect(isTypeset([types.STRING, function() {}])).to.be.true;

      // too many
      expect(isTypeset([function() {}, function() {}])).to.be.false;
      expect(isTypeset([types.STRING, function() {}, function() {}])).to.be.false;
      expect(isTypeset([types.STRING, [function() {}, function() {}]], {deep: true})).to.be.false;
      expect(isTypeset([DEFAULT_QUALIFIER, types.STRING,
        [DEFAULT_QUALIFIER, function() {}, function() {}]],
        {deep: true, fullyQualified: true})).to.be.false;
    });

    it('should not validate with only the qualifier', function() {
      expect(isTypeset(DEFAULT_QUALIFIER)).to.be.false;
      expect(isTypeset([])).to.be.false;
      expect(isTypeset([DEFAULT_QUALIFIER])).to.be.false;
    });
  });
});
