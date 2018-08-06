import {expect} from 'chai';
import sinon from 'sinon';

import * as vtu from '../validationTestUtil';
import types from '../../../src/lib/types';
import qualifiers from '../../../src/lib/qualifiers';
import * as val from '../../../src/lib/validator/valAny';
import * as isAnyMod from '../../../src/lib/validation/isAny';

describe('module: lib/validator/valAny', function() {
  describe('validator', function() { // module, and value only
    it('#type', function() {
      expect(val.type).to.equal(types.ANY);
    });

    it('succeeds with an RtvSuccess', function() {
      vtu.expectValidatorSuccess(val, 1);
    });

    it('valid values', function() {
      expect(vtu.testValues(val.type, val.default).failures).to.eql([]);
    });

    it('other types/values', function() {
      // for ANY, _all_ other values should be _valid_ also
      expect(vtu.testOtherValues(val.type, val.default, true)).to.eql([]);
    });
  });

  describe('qualifiers', function() {
    describe('are used in error typesets', function() {
      let isAnyStub;

      beforeEach(function() {
        isAnyStub = sinon.stub(isAnyMod, 'default').returns(false);
      });

      afterEach(function() {
        isAnyStub.restore();
      });

      it('DEFAULT', function() {
        vtu.expectValidatorError(val, 1); // default should be REQUIRED
      });

      it('REQUIRED', function() {
        vtu.expectValidatorError(val, 1, qualifiers.REQUIRED);
      });

      it('EXPECTED', function() {
        vtu.expectValidatorError(val, 1, qualifiers.EXPECTED);
      });

      it('OPTIONAL', function() {
        vtu.expectValidatorError(val, 1, qualifiers.OPTIONAL);
      });
    });
  });
});
