import _ from 'lodash';

import '../../../src/rtv'; // make sure all validators we might use in typesets get configured
import * as vtu from '../validationTestUtil';
import { types } from '../../../src/lib/types';
import { qualifiers } from '../../../src/lib/qualifiers';
import * as val from '../../../src/lib/validator/valAny';
import * as isAnyMod from '../../../src/lib/validation/isAny';

// returns map of valid type to array of sample values
const getValidValues = () => {
  const validValues = vtu.getValidValues(); // @type {Object}
  const validTypes = Object.keys(validValues); // @type {Array}

  const values = {};
  _.forEach(validTypes, function (type) {
    values[type] = validValues[type];
  });

  values.RESTRICTED_VALUES = vtu.getRestrictedValues(); // undefined, null, etc.

  return values;
};

describe('module: lib/validator/valAny', () => {
  describe('validator', () => {
    // module, and value only
    it('#type', () => {
      expect(val.type).toBe(types.ANY);
    });

    it('succeeds with an RtvSuccess', () => {
      vtu.expectValidatorSuccess(val, 1);
    });

    it('should validate any value including undefined and null', () => {
      const values = Object.values(getValidValues()).flat();
      expect(vtu.testValues(val.type, val.validate, values).failures).toEqual(
        []
      );
    });

    it('other types/values', () => {
      // for ANY, _all_ other values should be _valid_ also
      expect(vtu.testOtherValues(val.type, val.validate, true)).toEqual([]);
    });
  });

  describe('qualifiers', () => {
    describe('rules are supported', () => {
      let restrictedValues;

      beforeEach(() => {
        restrictedValues = vtu.getRestrictedValues();
      });

      // NOTE: because of the nature of the ANY type, there are NO restrictions
      //  on any value...

      it('REQUIRED (other than values previously tested)', () => {
        vtu.expectAllToPass(
          val.type,
          val.validate,
          restrictedValues,
          qualifiers.REQUIRED
        );
      });

      it('EXPECTED', () => {
        vtu.expectAllToPass(
          val.type,
          val.validate,
          restrictedValues,
          qualifiers.EXPECTED
        );
      });

      it('OPTIONAL', () => {
        vtu.expectAllToPass(
          val.type,
          val.validate,
          restrictedValues,
          qualifiers.OPTIONAL
        );
      });

      it('TRUTHY', () => {
        vtu.expectAllToPass(
          val.type,
          val.validate,
          restrictedValues,
          qualifiers.TRUTHY
        );
      });
    });

    describe('are used in error typesets', () => {
      let isAnyStub;

      beforeEach(() => {
        isAnyStub = jest
          .spyOn(isAnyMod, 'check')
          .mockClear()
          .mockReturnValue(false);
      });

      afterEach(() => {
        isAnyStub.mockRestore();
      });

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
    it('uses original value', () => {
      const validValues = getValidValues();
      Object.entries(validValues).forEach(([type, values]) => {
        values.forEach((value, idx) => {
          const result = val.validate(value);
          // NOTE: isNaN(Symbol) fails because isNaN() tries to convert the Symbol to a number
          //  and can't so throws an error
          if (typeof value === 'number' && isNaN(value)) {
            // ${type}/${idx} verbatim (NaN)
            expect(isNaN(result.mvv)).toBe(true);
          } else {
            // ${type}/${idx} verbatim
            expect(result.mvv).toBe(value);
          }
        });
      });
    });

    it('interprets falsy values verbatim', () => {
      vtu.getFalsyValues().forEach((falsyValue) => {
        const result = val.validate(falsyValue, qualifiers.TRUTHY);
        if (isNaN(falsyValue)) {
          // ${print(falsyValue)} verbatim
          expect(isNaN(result.mvv)).toBe(true);
        } else {
          // ${print(falsyValue)} verbatim
          expect(result.mvv).toBe(falsyValue);
        }
      });
    });
  });
});
