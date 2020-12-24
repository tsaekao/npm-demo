import { expect } from 'chai';

import * as vtu from '../validationTestUtil';
import { types } from '../../../src/lib/types';
import { qualifiers } from '../../../src/lib/qualifiers';
import * as val from '../../../src/lib/validator/valNull';

describe('module: lib/validator/valNull', function () {
  let restrictedValues;

  beforeEach(function () {
    restrictedValues = vtu.getRestrictedValues().filter((v) => v !== null);
  });

  describe('validator', function () {
    // module, and value only
    it('#type', function () {
      expect(val.type).to.equal(types.NULL);
    });

    it('succeeds with an RtvSuccess', function () {
      vtu.expectValidatorSuccess(val, null);
    });

    it('valid values', function () {
      vtu.expectValidatorSuccess(val, null);
    });

    it('other types/values', function () {
      vtu.expectAllToFail(val.type, val.validate, restrictedValues);

      // this does not test for undefined/null
      expect(vtu.testOtherValues(val.type, val.validate)).to.eql([]);
    });
  });

  describe('qualifiers', function () {
    describe('rules are supported', function () {
      it('REQUIRED (other than values previously tested)', function () {
        vtu.expectAllToFail(
          val.type,
          val.validate,
          restrictedValues,
          qualifiers.REQUIRED
        );

        // here, null succeeds because it's the value null, which is what the type is
        vtu.expectValidatorSuccess(val, null, qualifiers.REQUIRED);
      });

      it('EXPECTED', function () {
        vtu.expectAllToFail(
          val.type,
          val.validate,
          restrictedValues,
          qualifiers.EXPECTED
        );

        // here, null succeeds because the qualifier permits it
        vtu.expectValidatorSuccess(val, null, qualifiers.EXPECTED);
      });

      it('OPTIONAL', function () {
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

      it('TRUTHY', function () {
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

    describe('are used in error typesets', function () {
      it('DEFAULT', function () {
        vtu.expectValidatorError(val, 1); // default should be REQUIRED
      });

      it('REQUIRED', function () {
        vtu.expectValidatorError(val, 1, qualifiers.REQUIRED);
      });

      it('EXPECTED', function () {
        vtu.expectValidatorError(val, 1, qualifiers.EXPECTED);
      });

      it('OPTIONAL', function () {
        vtu.expectValidatorError(val, 1, qualifiers.OPTIONAL);
      });

      it('TRUTHY', function () {
        vtu.expectValidatorError(val, 1, qualifiers.TRUTHY);
      });
    });
  });
});
