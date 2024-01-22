import '../../../src/rtv'; // make sure all validators we might use in typesets get configured
import * as vtu from '../validationTestUtil';
import { types } from '../../../src/lib/types';
import { qualifiers } from '../../../src/lib/qualifiers';
import * as val from '../../../src/lib/validator/valJson';

describe('module: lib/validator/valJson', () => {
  describe('validator', () => {
    // module, and value only
    let jsonValues;
    let invalidValues;

    beforeEach(() => {
      jsonValues = vtu.getJsonValues();
      invalidValues = vtu.getInvalidJsonValues();
    });

    it('#type', () => {
      expect(val.type).toBe(types.JSON);
    });

    it('succeeds with an RtvSuccess', () => {
      vtu.expectValidatorSuccess(val, {});
    });

    it('valid values', () => {
      expect(
        vtu.testValues(val.type, val.validate, jsonValues).failures
      ).toEqual([]);
    });

    it('other types/values', () => {
      // nothing should pass
      expect(
        vtu.testValues(val.type, val.validate, invalidValues).passes
      ).toEqual([]);
    });
  });

  describe('qualifiers', () => {
    describe('rules are supported', () => {
      it('REQUIRED (other than values previously tested)', () => {
        vtu.expectValidatorError(val, undefined, qualifiers.REQUIRED);
        vtu.expectValidatorSuccess(val, null, qualifiers.REQUIRED);
        vtu.expectValidatorSuccess(val, '', qualifiers.REQUIRED);
        vtu.expectValidatorError(val, NaN, qualifiers.REQUIRED);
      });

      it('EXPECTED', () => {
        vtu.expectValidatorError(val, undefined, qualifiers.EXPECTED);
        vtu.expectValidatorSuccess(val, null, qualifiers.EXPECTED);
        vtu.expectValidatorSuccess(val, '', qualifiers.EXPECTED);
        vtu.expectValidatorError(val, NaN, qualifiers.EXPECTED);
      });

      it('OPTIONAL', () => {
        vtu.expectValidatorSuccess(val, undefined, qualifiers.OPTIONAL);
        vtu.expectValidatorSuccess(val, null, qualifiers.OPTIONAL);
        vtu.expectValidatorSuccess(val, '', qualifiers.OPTIONAL);
        vtu.expectValidatorError(val, NaN, qualifiers.OPTIONAL);
      });

      it('TRUTHY', () => {
        vtu.expectValidatorSuccess(val, undefined, qualifiers.TRUTHY);
        vtu.expectValidatorSuccess(val, null, qualifiers.TRUTHY);
        vtu.expectValidatorSuccess(val, '', qualifiers.TRUTHY);
        vtu.expectValidatorSuccess(val, NaN, qualifiers.TRUTHY);
      });
    });

    describe('are used in error typesets', () => {
      it('DEFAULT', () => {
        vtu.expectValidatorError(val, Symbol(1)); // default should be REQUIRED
      });

      it('REQUIRED', () => {
        vtu.expectValidatorError(val, Symbol(1), qualifiers.REQUIRED);
      });

      it('EXPECTED', () => {
        vtu.expectValidatorError(val, Symbol(1), qualifiers.EXPECTED);
      });

      it('OPTIONAL', () => {
        vtu.expectValidatorError(val, Symbol(1), qualifiers.OPTIONAL);
      });

      it('TRUTHY', () => {
        vtu.expectValidatorError(val, Symbol(1), qualifiers.TRUTHY);
      });
    });
  });

  // Minimum Viable Value
  describe('mvv', () => {
    vtu.testMvvVerbatimType(val);
  });
});
