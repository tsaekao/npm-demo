import {expect} from 'chai';

import * as vtu from '../validationTestUtil';
import types from '../../../src/lib/types';
import qualifiers from '../../../src/lib/qualifiers';
import * as val from '../../../src/lib/validator/valJson';

describe('module: lib/validator/valJson', function() {
  describe('validator', function() { // module, and value only
    let jsonValues;
    let invalidValues;

    beforeEach(function() {
      jsonValues = vtu.getJsonValues();
      invalidValues = vtu.getInvalidJsonValues();
    });

    it('#type', function() {
      expect(val.type).to.equal(types.JSON);
    });

    it('succeeds with an RtvSuccess', function() {
      vtu.expectValidatorSuccess(val, {});
    });

    it('valid values', function() {
      expect(vtu.testValues(val.type, val.default, jsonValues).failures).to.eql([]);
    });

    it('other types/values', function() {
      // nothing should pass
      expect(vtu.testValues(val.type, val.default, invalidValues).passes).to.eql([]);
    });
  });

  describe('qualifiers', function() {
    describe('rules are supported', function() {
      it('REQUIRED (other than values previously tested)', function() {
        vtu.expectValidatorError(val, undefined, qualifiers.REQUIRED);
        vtu.expectValidatorSuccess(val, null, qualifiers.REQUIRED);
        vtu.expectValidatorSuccess(val, '', qualifiers.REQUIRED);
        vtu.expectValidatorError(val, NaN, qualifiers.REQUIRED);
      });

      it('EXPECTED', function() {
        vtu.expectValidatorError(val, undefined, qualifiers.EXPECTED);
        vtu.expectValidatorSuccess(val, null, qualifiers.EXPECTED);
        vtu.expectValidatorSuccess(val, '', qualifiers.EXPECTED);
        vtu.expectValidatorError(val, NaN, qualifiers.EXPECTED);
      });

      it('OPTIONAL', function() {
        vtu.expectValidatorSuccess(val, undefined, qualifiers.OPTIONAL);
        vtu.expectValidatorSuccess(val, null, qualifiers.OPTIONAL);
        vtu.expectValidatorSuccess(val, '', qualifiers.OPTIONAL);
        vtu.expectValidatorError(val, NaN, qualifiers.OPTIONAL);
      });

      it('TRUTHY', function() {
        vtu.expectValidatorSuccess(val, undefined, qualifiers.TRUTHY);
        vtu.expectValidatorSuccess(val, null, qualifiers.TRUTHY);
        vtu.expectValidatorSuccess(val, '', qualifiers.TRUTHY);
        vtu.expectValidatorSuccess(val, NaN, qualifiers.TRUTHY);
      });
    });

    describe('are used in error typesets', function() {
      it('DEFAULT', function() {
        vtu.expectValidatorError(val, Symbol(1)); // default should be REQUIRED
      });

      it('REQUIRED', function() {
        vtu.expectValidatorError(val, Symbol(1), qualifiers.REQUIRED);
      });

      it('EXPECTED', function() {
        vtu.expectValidatorError(val, Symbol(1), qualifiers.EXPECTED);
      });

      it('OPTIONAL', function() {
        vtu.expectValidatorError(val, Symbol(1), qualifiers.OPTIONAL);
      });

      it('TRUTHY', function() {
        vtu.expectValidatorError(val, Symbol(1), qualifiers.TRUTHY);
      });
    });
  });
});
