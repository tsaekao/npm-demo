import {expect} from 'chai';

import * as vtu from '../validationTestUtil';
import types from '../../../src/lib/types';
import * as val from '../../../src/lib/validation/isTypeArgs';

describe('module: lib/validation/isTypeArgs', function() {
  it('#type', function() {
    expect(val.type).to.equal(undefined);
  });

  describe('#default', function() {
    let validValues;

    beforeEach(function() {
      validValues = vtu.getValidValues();
    });

    it('should validate type arguments', function() {
      // NOTE: If ever type args are no longer just an OBJECT type (and therefore
      //  isTypeArgs(args) !== isObject(args)), isTypeset validation will need
      //  to be updated to no longer use isObject() to test for either a shape
      //  or type args.
      expect(vtu.testValues('isTypeArgs', val.default,
          validValues[types.OBJECT]).failures).to.eql([]);
      expect(vtu.testOtherValues(types.OBJECT, val.default)).to.eql([]);
    });
  });
});
