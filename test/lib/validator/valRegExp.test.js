import '../../../src/rtv'; // make sure all validators we might use in typesets get configured
import * as vtu from '../validationTestUtil';
import { types } from '../../../src/lib/types';
import { qualifiers } from '../../../src/lib/qualifiers';
import * as val from '../../../src/lib/validator/valRegExp';

describe('module: lib/validator/valRegExp', () => {
  describe('validator', () => {
    // module, and value only
    it('#type', () => {
      expect(val.type).toBe(types.REGEXP);
    });

    it('succeeds with an RtvSuccess', () => {
      vtu.expectValidatorSuccess(val, /foo/);
    });

    it('valid values', () => {
      expect(vtu.testValues(val.type, val.validate).failures).toEqual([]);
    });

    it('other types/values', () => {
      expect(vtu.testOtherValues(val.type, val.validate)).toEqual([]);
    });
  });

  describe('qualifiers', () => {
    describe('rules are supported', () => {
      it('REQUIRED (other than values previously tested)', () => {
        const restrictedValues = vtu.getRestrictedValues(qualifiers.REQUIRED);
        vtu.expectAllToFail(
          val.type,
          val.validate,
          restrictedValues,
          qualifiers.REQUIRED
        );

        const permittedValues = vtu.getPermittedValues(qualifiers.REQUIRED);
        vtu.expectAllToPass(
          val.type,
          val.validate,
          permittedValues,
          qualifiers.REQUIRED
        );
      });

      it('EXPECTED', () => {
        const restrictedValues = vtu.getRestrictedValues(qualifiers.EXPECTED);
        vtu.expectAllToFail(
          val.type,
          val.validate,
          restrictedValues,
          qualifiers.EXPECTED
        );

        const permittedValues = vtu.getPermittedValues(qualifiers.EXPECTED);
        vtu.expectAllToPass(
          val.type,
          val.validate,
          permittedValues,
          qualifiers.EXPECTED
        );
      });

      it('OPTIONAL', () => {
        const restrictedValues = vtu.getRestrictedValues(qualifiers.OPTIONAL);
        vtu.expectAllToFail(
          val.type,
          val.validate,
          restrictedValues,
          qualifiers.OPTIONAL
        );

        const permittedValues = vtu.getPermittedValues(qualifiers.OPTIONAL);
        vtu.expectAllToPass(
          val.type,
          val.validate,
          permittedValues,
          qualifiers.OPTIONAL
        );
      });

      it('TRUTHY', () => {
        const restrictedValues = vtu.getRestrictedValues(qualifiers.TRUTHY);
        vtu.expectAllToFail(
          val.type,
          val.validate,
          restrictedValues,
          qualifiers.TRUTHY
        );

        const permittedValues = vtu.getPermittedValues(qualifiers.TRUTHY);
        vtu.expectAllToPass(
          val.type,
          val.validate,
          permittedValues,
          qualifiers.TRUTHY
        );
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
