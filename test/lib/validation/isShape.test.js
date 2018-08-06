import {expect} from 'chai';

import * as vtu from '../validationTestUtil';
import types from '../../../src/lib/types';
import * as val from '../../../src/lib/validation/isShape';

describe('module: lib/validation/isShape', function() {
  it('#type', function() {
    expect(val.type).to.equal(undefined);
  });

  describe('#default', function() {
    let validValues;

    beforeEach(function() {
      validValues = vtu.getValidValues();
    });

    it('should validate shape descriptors', function() {
      // NOTE: If ever a shape is no longer just an OBJECT type (and therefore
      //  isShape(shape) !== isObject(shape)), isTypeset validation will need
      //  to be updated to no longer use isObject() to test for either a shape
      //  or type args.
      expect(vtu.testValues('isShape', val.default,
          validValues[types.OBJECT]).failures).to.eql([]);
      expect(vtu.testOtherValues(types.OBJECT, val.default)).to.eql([]);
    });
  });
});
