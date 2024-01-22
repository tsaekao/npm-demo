import '../../../src/rtv'; // make sure all validators we might use in typesets get configured
import * as vtu from '../validationTestUtil';
import { types } from '../../../src/lib/types';
import { qualifiers } from '../../../src/lib/qualifiers';
import * as val from '../../../src/lib/validator/valNull';

describe('module: lib/validator/valNull', () => {
  let restrictedValues;

  beforeEach(() => {
    restrictedValues = vtu.getRestrictedValues().filter((v) => v !== null);
  });

  describe('validator', () => {
    // module, and value only
    it('#type', () => {
      expect(val.type).toBe(types.NULL);
    });

    it('succeeds with an RtvSuccess', () => {
      vtu.expectValidatorSuccess(val, null);
    });

    it('valid values', () => {
      vtu.expectValidatorSuccess(val, null);
    });

    it('other types/values', () => {
      vtu.expectAllToFail(val.type, val.validate, restrictedValues);

      // this does not test for undefined/null
      expect(vtu.testOtherValues(val.type, val.validate)).toEqual([]);
    });
  });

  describe('qualifiers', () => {
    describe('rules are supported', () => {
      it('REQUIRED (other than values previously tested)', () => {
        vtu.expectAllToFail(
          val.type,
          val.validate,
          restrictedValues,
          qualifiers.REQUIRED
        );

        // here, null succeeds because it's the value null, which is what the type is
        vtu.expectValidatorSuccess(val, null, qualifiers.REQUIRED);
      });

      it('EXPECTED', () => {
        vtu.expectAllToFail(
          val.type,
          val.validate,
          restrictedValues,
          qualifiers.EXPECTED
        );

        // here, null succeeds because the qualifier permits it
        vtu.expectValidatorSuccess(val, null, qualifiers.EXPECTED);
      });

      it('OPTIONAL', () => {
        restrictedValues.splice(restrictedValues.indexOf(undefined), 1);
        vtu.expectAllToFail(
          val.type,
          val.validate,
          restrictedValues,
          qualifiers.OPTIONAL
        );

        // here, undefined and null both succeed because the qualifier permits them
        vtu.expectValidatorSuccess(val, undefined, qualifiers.OPTIONAL);
        vtu.expectValidatorSuccess(val, null, qualifiers.OPTIONAL);
      });

      it('TRUTHY', () => {
        // here, ALL restricted values succeed because the qualifier permits them
        vtu.expectAllToPass(
          val.type,
          val.validate,
          restrictedValues,
          qualifiers.TRUTHY
        );
        vtu.expectValidatorSuccess(val, null, qualifiers.TRUTHY);
      });
    });

    describe('are used in error typesets', () => {
      it('DEFAULT', () => {
        vtu.expectValidatorError(val, 1); // default should be REQUIRED
      });

      it('REQUIRED', () => {
        vtu.expectValidatorError(val, 1, qualifiers.REQUIRED);
      });

      it('EXPECTED', () => {
        vtu.expectValidatorError(val, 1, qualifiers.EXPECTED);
      });

      it('OPTIONAL', () => {
        vtu.expectValidatorError(val, 1, qualifiers.OPTIONAL);
      });

      it('TRUTHY', () => {
        vtu.expectValidatorError(val, 1, qualifiers.TRUTHY);
      });
    });
  });

  // Minimum Viable Value
  describe('mvv', () => {
    vtu.testMvvVerbatimType(val);
  });
});
