import '../../../src/rtv'; // make sure all validators we might use in typesets get configured
import * as vtu from '../validationTestUtil';
import { types } from '../../../src/lib/types';
import * as val from '../../../src/lib/validation/isPrimitive';

describe('module: lib/validation/isPrimitive', () => {
  it('#type', () => {
    expect(val.type).toBeUndefined();
  });

  describe('#default', () => {
    let validValues;

    beforeEach(() => {
      validValues = vtu.getValidValues();
    });

    it('should validate JavaScript primitives', () => {
      const values = [''].concat(
        validValues[types.STRING],
        validValues[types.BOOLEAN],
        validValues[types.NUMBER],
        validValues[types.SYMBOL]
      );
      expect(vtu.testValues('isPrimitive', val.check, values).failures).toEqual(
        []
      );
    });
  });
});
