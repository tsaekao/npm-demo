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
      expect(vtu.testValues('isShape', val.default,
          validValues[types.OBJECT]).failures).to.eql([]);
      expect(vtu.testOtherValues(types.OBJECT, val.default)).to.eql([]);
    });
  });
});
