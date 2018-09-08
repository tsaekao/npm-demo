import {expect} from 'chai';
import sinon from 'sinon';

import * as vtu from '../validationTestUtil';
import types, {DEFAULT_OBJECT_TYPE} from '../../../src/lib/types';
import qualifiers, {DEFAULT_QUALIFIER} from '../../../src/lib/qualifiers';
import * as isShapeMod from '../../../src/lib/validation/isShape';
import {default as isTypeset, type as isTypesetType} from '../../../src/lib/validation/isTypeset';

describe('module: lib/validation/isTypeset', function() {
  it('#type', function() {
    expect(isTypesetType).to.equal(undefined);
  });

  describe('#default', function() {
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
          [types.ARRAY, {min: 1, typeset: [types.FINITE]}],

          // since we aren't going deep, we should ignore the fact that the shape
          //  of the class object has a property with an invalid typeset
          [types.CLASS_OBJECT, {shape: {foo: ['invalid-type']}}],

          // should be fine as a class object without args (or a shape)
          types.CLASS_OBJECT,
          [types.CLASS_OBJECT],

          [types.HASH_MAP, {count: 2}],
          [[{foo: types.STRING}]],
          [[]], // inner array won't be validated since we aren't going deep
          [types.BOOLEAN, [types.FINITE]]
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
          [DEFAULT_QUALIFIER, true], // invalid value type in typeset

          [[types.STRING], {typeset: types.FINITE}], // missing object type

          // two ARRAY types
          [types.ARRAY, []],
          [types.ARRAY, {min: 1}, [types.FINITE]],

          // second shape has no type
          [{}, {}]
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
        goodValues[3] = [DEFAULT_QUALIFIER, types.ARRAY, {typeset: goodValues[3][0]}];
        goodValues[4] = [DEFAULT_QUALIFIER, types.ANY, goodValues[4]];

        // result: [DEFAULT_QUALIFIER, DEFAULT_OBJECT_TYPE, {foo: types.STRING}]
        goodValues[5] = [DEFAULT_QUALIFIER, DEFAULT_OBJECT_TYPE, goodValues[5][0]];

        goodValues[6].splice(1, 0, types.STRING);
        goodValues[7].splice(1, 0, types.PLAIN_OBJECT);
        goodValues[9] = [DEFAULT_QUALIFIER, types.HASH_MAP, goodValues[9]];
        goodValues[10].unshift(DEFAULT_QUALIFIER);
        goodValues[11].unshift(DEFAULT_QUALIFIER);
        goodValues[12].unshift(DEFAULT_QUALIFIER);
        goodValues[13] = [DEFAULT_QUALIFIER, goodValues[13]];
        goodValues[14].unshift(DEFAULT_QUALIFIER);
        goodValues[15].unshift(DEFAULT_QUALIFIER);
        goodValues[16] = [DEFAULT_QUALIFIER, types.ARRAY, {typeset: goodValues[16][0]}];
        goodValues[17] = [DEFAULT_QUALIFIER, types.ARRAY, {typeset: goodValues[17][0]}];
        goodValues[18] = [DEFAULT_QUALIFIER, goodValues[18][0], types.ARRAY, {typeset: goodValues[18][1]}];

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

            // missing ARRAY type and args, and ARRAY shorthand notation is not
            //  supported in fully-qualified typesets
            [DEFAULT_QUALIFIER, [types.STRING]],

            // missing a type
            [DEFAULT_QUALIFIER]
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

          [types.HASH_MAP, {count: 2}],
          [types.ARRAY, {typeset: types.FINITE}]
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
          [[]], // outer array typeset is OK, but inner one is not

          // 2 ARRAY types in one, and missing object type since object would
          //  be considered a shape, not ARRAY args
          [types.ARRAY, [types.STRING], {typeset: types.FINITE}],

          // STRING type appears more than once in the nested (array) typeset
          [types.STRING, [types.STRING, types.STRING]],

          // nested shape with an invalid type
          {foo: {bar: ['invalid-type']}},

          // validator is not last element in deep-nested typeset
          [{foo: [{bar: [{baz: [types.STRING, function() {}, types.REGEXP]}] }] }],

          // for class object, we should be going deep into the shape property of
          //  the args object and finding the invalid typeset
          [types.CLASS_OBJECT, {shape: {foo: [types.STRING, DEFAULT_QUALIFIER]}}],

          // nested shape is not a shape
          [types.CLASS_OBJECT, {shape: false}],

          // nested typeset has invalid value
          [types.ARRAY, {typeset: false}]
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
        goodValues[4][1] = {typeset: goodValues[4][1]};
        goodValues[4].splice(1, 0, types.ARRAY);
        goodValues[4].unshift(DEFAULT_QUALIFIER);

        goodValues[5].foo.bar.unshift(DEFAULT_QUALIFIER);
        goodValues[5].foo = [DEFAULT_QUALIFIER, DEFAULT_OBJECT_TYPE, goodValues[5].foo];
        goodValues[5] = [DEFAULT_QUALIFIER, DEFAULT_OBJECT_TYPE, goodValues[5]];

        goodValues[6].foo[0].unshift(DEFAULT_QUALIFIER);
        goodValues[6].foo[0] = {typeset: goodValues[6].foo[0]};
        goodValues[6].foo.unshift(DEFAULT_QUALIFIER, types.ARRAY);
        goodValues[6] = [DEFAULT_QUALIFIER, DEFAULT_OBJECT_TYPE, goodValues[6]];

        goodValues[7].foo = [DEFAULT_QUALIFIER, types.ANY, goodValues[7].foo];
        goodValues[7] = [DEFAULT_QUALIFIER, DEFAULT_OBJECT_TYPE, goodValues[7]];

        goodValues[8] = [DEFAULT_QUALIFIER, DEFAULT_OBJECT_TYPE, goodValues[8]];

        goodValues[9][1].shape.foo.unshift(DEFAULT_QUALIFIER);
        goodValues[9].unshift(DEFAULT_QUALIFIER);

        goodValues[10] = [DEFAULT_QUALIFIER, goodValues[10]];
        // goodValues[11] is already FQ
        goodValues[12].unshift(DEFAULT_QUALIFIER);

        goodValues[13][1].typeset = [DEFAULT_QUALIFIER, goodValues[13][1].typeset];
        goodValues[13].unshift(DEFAULT_QUALIFIER);

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
            }],

            [DEFAULT_QUALIFIER, types.ARRAY, {typeset: [DEFAULT_QUALIFIER, 'invalid-type']}]
        );

        results = vtu.testValues('isTypeset', isTypeset, badValues,
            {deep: true, fullyQualified: true});
        expect(results.passes).to.eql([]);
      });

      it('should fail if the given type args are not a valid shape', function() {
        // NOTE: this can't be an entry in 'badValues' in the previous spec because
        //  at this time, shape === type args, so there would never be a real case
        //  where shape !== type args; for the sake of unit testing that future
        //  possibility in the code, we have to fabricate it
        const isShapeStub = sinon.stub(isShapeMod, 'default').returns(false);

        expect(isTypeset([types.PLAIN_OBJECT, {invalidShape: DEFAULT_OBJECT_TYPE}], {deep: true}))
          .to.be.false;

        isShapeStub.restore();
      });

      it('should fail without index in failure message when deep-validating a non-qualified shape',
          function() {
            // NOTE: a little contrived, but the logic in the inner deepVerifyShape()
            //  function should cover the case where the index isn't needed because it
            //  shouldn't depend on the caller having checked that the value is a shape,
            //  but in the case of a shape descriptor typeset, the caller must also
            //  check that it's a shape...
            let count = 0;
            const isShapeStub = sinon.stub(isShapeMod, 'default').callsFake(function() {
              count++;
              return count < 3;
            });

            const options = {deep: true};
            expect(isTypeset({}, options)).to.be.false;
            expect(options.failure).to.include(`Expecting a valid shape descriptor for type="${types.OBJECT}"`);

            isShapeStub.restore();
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
});
