import {expect} from 'chai';

import * as vtu from '../validationTestUtil';
import types from '../../../src/lib/types';
import isShape from '../../../src/lib/validation/isShape';

describe('module: lib/validation/isShape', function() {
  let validValues;

  beforeEach(function() {
    validValues = vtu.getValidValues();
  });

  describe('#isShape', function() {
    it('should validate shape descriptors', function() {
      expect(vtu.testValues('isShape', isShape, validValues[types.OBJECT]).failures).to.eql([]);
      expect(vtu.testOtherValues(types.OBJECT, isShape)).to.eql([]);
    });
  });
});
