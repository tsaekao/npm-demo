import {expect} from 'chai';

import * as vtu from '../validationTestUtil';
import types from '../../../src/lib/types';
import * as val from '../../../src/lib/validation/isPrimitive';

describe('module: lib/validation/isPrimitive', function() {
  it('#type', function() {
    expect(val.type).to.equal(undefined);
  });

  describe('#default', function() {
    let validValues;

    beforeEach(function() {
      validValues = vtu.getValidValues();
    });

    it('should validate JavaScript primitives', function() {
      const values = [''].concat(validValues[types.STRING],
          validValues[types.BOOLEAN], validValues[types.NUMBER],
          validValues[types.SYMBOL]);
      expect(vtu.testValues('isPrimitive', val.default, values).failures).to.eql([]);
    });
  });
});
