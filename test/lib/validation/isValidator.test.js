import {expect} from 'chai';

import * as vtu from '../validationTestUtil';
import types from '../../../src/lib/types';
import isValidator from '../../../src/lib/validation/isValidator';

describe('module: lib/validation/isValidator', function() {
  let validValues;

  beforeEach(function() {
    validValues = vtu.getValidValues();
  });

  describe('#isValidator', function() {
    it('should validate shape descriptors', function() {
      expect(vtu.testValues('isValidator', isValidator,
          validValues[types.FUNCTION]).failures).to.eql([]);
      expect(vtu.testOtherValues(types.OBJECT, isValidator)).to.eql([]);
    });
  });
});
