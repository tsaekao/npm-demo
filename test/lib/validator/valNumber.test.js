import {expect} from 'chai';
import _ from 'lodash';

import * as vtu from '../validationTestUtil';
import types from '../../../src/lib/types';
import qualifiers from '../../../src/lib/qualifiers';
import * as val from '../../../src/lib/validator/valNumber';

describe('module: lib/validator/valNumber', function() {
  describe('validator', function() { // module, and value only
    it('#type', function() {
      expect(val.type).to.equal(types.NUMBER);
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

      // remove subset types
      _.pull(invalidTypes, types.NUMBER, types.FINITE, types.INT, types.SAFE_INT,
          types.FLOAT);

      // build a list of all remaining invalid values, along with NaN
      let invalidValues = [NaN];
      _.forEach(invalidTypes, function(type) {
        invalidValues = invalidValues.concat(validValues[type]);
      });

      // nothing should pass
      expect(vtu.testValues(val.type, val.default, invalidValues).passes).to.eql([]);
    });
  });

  describe('qualifiers', function() {
    it('allows NaN if not REQUIRED', function() {
      vtu.expectValidatorError(val, NaN); // defaults to REQUIRED

      _.forEach(qualifiers, function(qualifier) {
        // rejects unless not REQUIRED
        if (qualifier === qualifiers.REQUIRED) {
          vtu.expectValidatorError(val, NaN, qualifier);
        } else {
          vtu.expectValidatorSuccess(val, NaN, qualifier);
        }
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
      // EXPECTED allows NaN and NaN is permitted for exact
      vtu.expectValidatorSuccess(val, NaN, qualifiers.EXPECTED, {exact: NaN});
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
      vtu.expectValidatorSuccess(val, 7, undefined, {min: -Infinity});
      vtu.expectValidatorSuccess(val, 7, undefined, {min: Number.NEGATIVE_INFINITY});
      vtu.expectValidatorError(val, 7, undefined, {min: Infinity});
      vtu.expectValidatorError(val, 7, undefined, {min: Number.POSITIVE_INFINITY});

      // these are all ignored min values
      vtu.expectValidatorSuccess(val, 7, undefined, {min: '8'});
      vtu.expectValidatorSuccess(val, 7, undefined, {min: NaN});
    });

    it('checks for a maximum number', function() {
      validTypeValues.forEach(function(value) {
        vtu.expectValidatorSuccess(val, value, undefined, {max: value});
      });

      vtu.expectValidatorError(val, 7, undefined, {max: 0});
      vtu.expectValidatorError(val, -7, undefined, {max: -8});
      vtu.expectValidatorError(val, 7, undefined, {max: 6});
      vtu.expectValidatorSuccess(val, 7, undefined, {max: Infinity});
      vtu.expectValidatorSuccess(val, 7, undefined, {max: Number.POSITIVE_INFINITY});
      vtu.expectValidatorError(val, 7, undefined, {max: -Infinity});
      vtu.expectValidatorError(val, 7, undefined, {max: Number.NEGATIVE_INFINITY});

      // these are all ignored max values
      vtu.expectValidatorSuccess(val, 7, undefined, {max: '6'});
      vtu.expectValidatorSuccess(val, 7, undefined, {max: NaN});
    });

    it('max ignored if less than min', function() {
      vtu.expectValidatorSuccess(val, 7, undefined, {min: 7, max: 6});
    });
  });
});
