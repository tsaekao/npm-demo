import {expect} from 'chai';

import * as vtu from '../validationTestUtil';
import types from '../../../src/lib/types';
import isTypeArgs from '../../../src/lib/validation/isTypeArgs';

describe('module: lib/validation/isTypeArgs', function() {
  let validValues;

  beforeEach(function() {
    validValues = vtu.getValidValues();
  });

  describe('#isTypeArgs', function() {
    it('should validate type arguments', function() {
      expect(vtu.testValues('isTypeArgs', isTypeArgs, validValues[types.OBJECT]).failures).to.eql([]);
      expect(vtu.testOtherValues(types.OBJECT, isTypeArgs)).to.eql([]);
    });
  });
});
