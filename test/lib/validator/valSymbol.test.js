import '../../../src/rtv'; // make sure all validators we might use in typesets get configured
import * as vtu from '../validationTestUtil';
import { types } from '../../../src/lib/types';
import { qualifiers } from '../../../src/lib/qualifiers';
import * as val from '../../../src/lib/validator/valSymbol';

describe('module: lib/validator/valSymbol', () => {
  describe('validator', () => {
    // module, and value only
    it('#type', () => {
      expect(val.type).toBe(types.SYMBOL);
    });

    it('succeeds with an RtvSuccess', () => {
      vtu.expectValidatorSuccess(val, Symbol(1));
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

  describe('arguments', () => {
    const sym6 = Symbol(6);
    const sym7 = Symbol(7);
    const sym8 = Symbol(8);
    let validTypeValues;

    beforeEach(() => {
      validTypeValues = vtu.getValidValues(val.type);
    });

    it('checks for an exact symbol', () => {
      validTypeValues.forEach(function (value) {
        vtu.expectValidatorSuccess(val, value, undefined, { oneOf: value });
      });

      // ignored: invalid type
      vtu.expectValidatorSuccess(val, sym7, undefined, { oneOf: null });
      vtu.expectValidatorSuccess(val, sym7, undefined, { oneOf: '7' });
      vtu.expectValidatorSuccess(val, sym7, undefined, { oneOf: 7 });
      vtu.expectValidatorSuccess(val, sym7, undefined, { oneOf: /7/ });
    });

    it('checks for an exact symbol in a list', () => {
      vtu.expectValidatorSuccess(val, sym7, undefined, {
        oneOf: [sym6, sym7, sym8],
      });
      vtu.expectValidatorError(val, sym7, undefined, { oneOf: [sym6, sym8] });
      vtu.expectValidatorSuccess(val, sym7, undefined, { oneOf: [sym7] });
      vtu.expectValidatorSuccess(val, sym7, undefined, { oneOf: [] }); // ignored

      // ignores non-type values in a list
      vtu.expectValidatorError(val, sym7, undefined, {
        oneOf: [null, '7', true],
      });

      // ignores non-arrays
      vtu.expectValidatorSuccess(val, sym7, undefined, {
        oneOf: new Set([sym6, sym8]),
      });
    });
  });

  // Minimum Viable Value
  describe('mvv', () => {
    vtu.testMvvVerbatimType(val);
  });
});
