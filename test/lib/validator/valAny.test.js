import { expect } from 'chai';
import sinon from 'sinon';
import _ from 'lodash';

import * as vtu from '../validationTestUtil';
import types from '../../../src/lib/types';
import qualifiers from '../../../src/lib/qualifiers';
import * as val from '../../../src/lib/validator/valAny';
import * as isAnyMod from '../../../src/lib/validation/isAny';

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
      const validValues = vtu.getValidValues(); // @type {Object}
      const validTypes = Object.keys(validValues); // @type {Array}

      let values = vtu.getRestrictedValues(); // undefined, null, etc.
      _.forEach(validTypes, function (type) {
        values = values.concat(validValues[type]);
      });

      expect(vtu.testValues(val.type, val.default, values).failures).to.eql([]);
    });

    it('other types/values', function () {
      // for ANY, _all_ other values should be _valid_ also
      expect(vtu.testOtherValues(val.type, val.default, true)).to.eql([]);
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
          val.default,
          restrictedValues,
          qualifiers.REQUIRED
        );
      });

      it('EXPECTED', function () {
        vtu.expectAllToPass(
          val.type,
          val.default,
          restrictedValues,
          qualifiers.EXPECTED
        );
      });

      it('OPTIONAL', function () {
        vtu.expectAllToPass(
          val.type,
          val.default,
          restrictedValues,
          qualifiers.OPTIONAL
        );
      });

      it('TRUTHY', function () {
        vtu.expectAllToPass(
          val.type,
          val.default,
          restrictedValues,
          qualifiers.TRUTHY
        );
      });
    });

    describe('are used in error typesets', function () {
      let isAnyStub;

      beforeEach(function () {
        isAnyStub = sinon.stub(isAnyMod, 'default').returns(false);
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
});
