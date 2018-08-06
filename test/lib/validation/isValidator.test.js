import {expect} from 'chai';

import * as vtu from '../validationTestUtil';
import types from '../../../src/lib/types';
import * as val from '../../../src/lib/validation/isValidator';

describe('module: lib/validation/isValidator', function() {
  it('#type', function() {
    expect(val.type).to.equal(undefined);
  });

  describe('#default', function() {
    let validValues;

    beforeEach(function() {
      validValues = vtu.getValidValues();
    });

    it('should validate custom validators', function() {
      expect(vtu.testValues('isValidator', val.default,
          validValues[types.FUNCTION]).failures).to.eql([]);
      expect(vtu.testOtherValues(types.FUNCTION, val.default)).to.eql([]);
    });
  });
});
