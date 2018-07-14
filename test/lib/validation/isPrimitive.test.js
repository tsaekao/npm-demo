import {expect} from 'chai';

import * as vtu from '../validationTestUtil';
import types from '../../../src/lib/types';
import isPrimitive from '../../../src/lib/validation/isPrimitive';

describe('module: lib/validation/isPrimitive', function() {
  let validValues;

  beforeEach(function() {
    validValues = vtu.getValidValues();
  });

  describe('#isPrimitive', function() {
    it('should validate JavaScript primitives', function() {
      const values = [''].concat(validValues[types.STRING],
          validValues[types.BOOLEAN], validValues[types.NUMBER],
          validValues[types.SYMBOL]);
      expect(vtu.testValues('isPrimitive', isPrimitive, values).failures).to.eql([]);
    });
  });
});
