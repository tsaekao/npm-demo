import {expect} from 'chai';
import _ from 'lodash';

import * as vtu from '../validationTestUtil';
import types from '../../../src/lib/types';
import qualifiers from '../../../src/lib/qualifiers';
import * as val from '../../../src/lib/validator/valSafeInt';

describe('module: lib/validator/valSafeInt', function() {
  describe('validator', function() { // module, and value only
    it('#type', function() {
      expect(val.type).to.equal(types.SAFE_INT);
    });

    it('succeeds with an RtvSuccess', function() {
      vtu.expectValidatorSuccess(val, 1);
    });

    it('valid values', function() {
      expect(vtu.testValues(val.type, val.default).failures).to.eql([]);
    });

    it('other types/values', function() {
      const validValues = vtu.getValidValues(); // @type {Object}
      const invalidTypes = Object.keys(validValues); // @type {Array}

      // remove subset types: keep FLOAT since it isn't a subset
      _.pull(invalidTypes, types.NUMBER, types.FINITE, types.INT, types.SAFE_INT);

      // build a list of all remaining invalid values
      let invalidValues = [
        // put some NUMBER values back in which aren't overlaps
        NaN,
        Infinity,
        Number.POSITIVE_INFINITY,
        -Infinity,
        Number.NEGATIVE_INFINITY,
        Number.MIN_VALUE, // float, number closest to zero
        Number.MAX_VALUE, // int, unsafe
        Number.MIN_SAFE_INTEGER - 1, // unsafe
        Number.MAX_SAFE_INTEGER + 1 // unsafe
      ];
      _.forEach(invalidTypes, function(type) {
        invalidValues = invalidValues.concat(validValues[type]);
      });

      // nothing should pass
      expect(vtu.testValues(val.type, val.default, invalidValues).passes).to.eql([]);
    });
  });

  describe('qualifiers', function() {
    it('never allows NaN', function() {
      _.forEach(qualifiers, function(qualifier) {
        vtu.expectValidatorError(val, NaN, qualifier);
      });
    });

    describe('rules are supported', function() {
      it('REQUIRED (other than values previously tested)', function() {
        vtu.expectValidatorError(val, undefined, qualifiers.REQUIRED);
        vtu.expectValidatorError(val, null, qualifiers.REQUIRED);
      });

      it('EXPECTED', function() {
        vtu.expectValidatorError(val, undefined, qualifiers.EXPECTED);
        vtu.expectValidatorSuccess(val, null, qualifiers.EXPECTED);
      });

      it('OPTIONAL', function() {
        vtu.expectValidatorSuccess(val, undefined, qualifiers.OPTIONAL);
        vtu.expectValidatorSuccess(val, null, qualifiers.OPTIONAL);
      });
    });

    describe('are used in error typesets', function() {
      it('DEFAULT', function() {
        vtu.expectValidatorError(val, false); // default should be REQUIRED
      });

      it('REQUIRED', function() {
        vtu.expectValidatorError(val, false, qualifiers.REQUIRED);
      });

      it('EXPECTED', function() {
        vtu.expectValidatorError(val, false, qualifiers.EXPECTED);
      });

      it('OPTIONAL', function() {
        vtu.expectValidatorError(val, false, qualifiers.OPTIONAL);
      });
    });
  });

  describe('arguments', function() {
    let validTypeValues;

    beforeEach(function() {
      validTypeValues = vtu.getValidValues(val.type);
    });

    it('checks for an exact number', function() {
      validTypeValues.forEach(function(value) {
        vtu.expectValidatorSuccess(val, value, undefined, {exact: value});
      });

      // qualifier takes precedence
      vtu.expectValidatorError(val, NaN, undefined, {exact: NaN});
      // NaN not permitted
      vtu.expectValidatorError(val, NaN, qualifiers.EXPECTED, {exact: NaN});

      // ignored: not in type range
      vtu.expectValidatorSuccess(val, 7, undefined, {exact: NaN});
      vtu.expectValidatorSuccess(val, 7, undefined, {exact: -Infinity});
      vtu.expectValidatorSuccess(val, 7, undefined, {exact: Number.NEGATIVE_INFINITY});
      vtu.expectValidatorSuccess(val, 7, undefined, {exact: Infinity});
      vtu.expectValidatorSuccess(val, 7, undefined, {exact: Number.POSITIVE_INFINITY});
      vtu.expectValidatorSuccess(val, 7, undefined, {exact: Number.EPSILON});
      vtu.expectValidatorSuccess(val, 7, undefined, {exact: 7.7});
      vtu.expectValidatorSuccess(val, 7, undefined, {exact: Number.MIN_VALUE});
      vtu.expectValidatorSuccess(val, 7, undefined, {exact: Number.MAX_VALUE});
      vtu.expectValidatorSuccess(val, 7, undefined, {exact: Number.MIN_SAFE_INTEGER - 1}); // unsafe
      vtu.expectValidatorSuccess(val, 7, undefined, {exact: Number.MAX_SAFE_INTEGER + 1}); // unsafe

      // ignored: invalid type
      vtu.expectValidatorSuccess(val, 7, undefined, {exact: '6'});
    });

    it('exact takes precedence over min/max', function() {
      vtu.expectValidatorSuccess(val, 7, undefined, {exact: 7, min: 8});
      vtu.expectValidatorSuccess(val, 7, undefined, {exact: 7, max: 6});
      vtu.expectValidatorSuccess(val, 7, undefined, {exact: 7, min: 8, max: 6});
    });

    it('checks for a minimum number', function() {
      validTypeValues.forEach(function(value) {
        vtu.expectValidatorSuccess(val, value, undefined, {min: value});
      });

      vtu.expectValidatorSuccess(val, 7, undefined, {min: 0});
      vtu.expectValidatorError(val, -8, undefined, {min: -7});
      vtu.expectValidatorSuccess(val, 7, undefined, {min: 6});

      // these are all ignored min values
      vtu.expectValidatorSuccess(val, 7, undefined, {min: '8'});
      vtu.expectValidatorSuccess(val, 7, undefined, {min: NaN});
      vtu.expectValidatorSuccess(val, 7, undefined, {min: -Infinity});
      vtu.expectValidatorSuccess(val, 7, undefined, {min: Number.NEGATIVE_INFINITY});
      vtu.expectValidatorSuccess(val, 7, undefined, {min: Infinity});
      vtu.expectValidatorSuccess(val, 7, undefined, {min: Number.POSITIVE_INFINITY});
      vtu.expectValidatorSuccess(val, 7, undefined, {min: Number.EPSILON});
      vtu.expectValidatorSuccess(val, 7, undefined, {min: 7.7});
      vtu.expectValidatorSuccess(val, 7, undefined, {min: Number.MIN_VALUE});
      vtu.expectValidatorSuccess(val, 7, undefined, {min: Number.MAX_VALUE});
      vtu.expectValidatorSuccess(val, 7, undefined, {min: Number.MIN_SAFE_INTEGER - 1}); // unsafe
      vtu.expectValidatorSuccess(val, 7, undefined, {min: Number.MAX_SAFE_INTEGER + 1}); // unsafe
    });

    it('checks for a maximum number', function() {
      validTypeValues.forEach(function(value) {
        vtu.expectValidatorSuccess(val, value, undefined, {max: value});
      });

      vtu.expectValidatorError(val, 7, undefined, {max: 0});
      vtu.expectValidatorError(val, -7, undefined, {max: -8});
      vtu.expectValidatorError(val, 7, undefined, {max: 6});

      // these are all ignored max values
      vtu.expectValidatorSuccess(val, 7, undefined, {max: '6'});
      vtu.expectValidatorSuccess(val, 7, undefined, {max: NaN});
      vtu.expectValidatorSuccess(val, 7, undefined, {max: Infinity});
      vtu.expectValidatorSuccess(val, 7, undefined, {max: Number.POSITIVE_INFINITY});
      vtu.expectValidatorSuccess(val, 7, undefined, {max: -Infinity});
      vtu.expectValidatorSuccess(val, 7, undefined, {max: Number.NEGATIVE_INFINITY});
      vtu.expectValidatorSuccess(val, 7, undefined, {max: Number.EPSILON});
      vtu.expectValidatorSuccess(val, 7, undefined, {max: 7.7});
      vtu.expectValidatorSuccess(val, 7, undefined, {max: Number.MIN_VALUE});
      vtu.expectValidatorSuccess(val, 7, undefined, {max: Number.MAX_VALUE});
      vtu.expectValidatorSuccess(val, 7, undefined, {max: Number.MIN_SAFE_INTEGER - 1}); // unsafe
      vtu.expectValidatorSuccess(val, 7, undefined, {max: Number.MAX_SAFE_INTEGER + 1}); // unsafe
    });

    it('max ignored if less than min', function() {
      vtu.expectValidatorSuccess(val, 7, undefined, {min: 7, max: 6});
    });
  });
});
