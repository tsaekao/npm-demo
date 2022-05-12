import { expect } from 'chai';
import sinon from 'sinon';
import _ from 'lodash';

import * as vtu from '../validationTestUtil';
import { print } from '../../../src/lib/util';
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

describe('module: lib/validator/valAny', function () {
  describe('validator', function () {
    // module, and value only
    it('#type', function () {
      expect(val.type).to.equal(types.ANY);
    });

    it('succeeds with an RtvSuccess', function () {
      vtu.expectValidatorSuccess(val, 1);
    });

    it('should validate any value including undefined and null', function () {
      const values = Object.values(getValidValues()).flat();
      expect(vtu.testValues(val.type, val.validate, values).failures).to.eql(
        []
      );
    });

    it('other types/values', function () {
      // for ANY, _all_ other values should be _valid_ also
      expect(vtu.testOtherValues(val.type, val.validate, true)).to.eql([]);
    });
  });

  describe('qualifiers', function () {
    describe('rules are supported', function () {
      let restrictedValues;

      beforeEach(function () {
        restrictedValues = vtu.getRestrictedValues();
      });

      // NOTE: because of the nature of the ANY type, there are NO restrictions
      //  on any value...

      it('REQUIRED (other than values previously tested)', function () {
        vtu.expectAllToPass(
          val.type,
          val.validate,
          restrictedValues,
          qualifiers.REQUIRED
        );
      });

      it('EXPECTED', function () {
        vtu.expectAllToPass(
          val.type,
          val.validate,
          restrictedValues,
          qualifiers.EXPECTED
        );
      });

      it('OPTIONAL', function () {
        vtu.expectAllToPass(
          val.type,
          val.validate,
          restrictedValues,
          qualifiers.OPTIONAL
        );
      });

      it('TRUTHY', function () {
        vtu.expectAllToPass(
          val.type,
          val.validate,
          restrictedValues,
          qualifiers.TRUTHY
        );
      });
    });

    describe('are used in error typesets', function () {
      let isAnyStub;

      beforeEach(function () {
        isAnyStub = sinon.stub(isAnyMod, 'check').returns(false);
      });

      afterEach(function () {
        isAnyStub.restore();
      });

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
            expect(isNaN(result.mvv), `${type}/${idx} verbatim (NaN)`).to.be
              .true;
          } else {
            expect(result.mvv, `${type}/${idx} verbatim`).to.be.equal(value);
          }
        });
      });
    });

    it('interprets falsy values verbatim', () => {
      vtu.getFalsyValues().forEach((falsyValue) => {
        const result = val.validate(falsyValue, qualifiers.TRUTHY);
        if (isNaN(falsyValue)) {
          expect(isNaN(result.mvv), `${print(falsyValue)} verbatim`).to.be.true;
        } else {
          expect(result.mvv, `${print(falsyValue)} verbatim`).to.equal(
            falsyValue
          );
        }
      });
    });
  });
});
