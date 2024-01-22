import '../../../src/rtv'; // make sure all validators we might use in typesets get configured
import * as vtu from '../validationTestUtil';
import { types } from '../../../src/lib/types';
import * as val from '../../../src/lib/validation/isCustomValidator';

describe('module: lib/validation/isCustomValidator', () => {
  it('#type', () => {
    expect(val.type).toBeUndefined();
  });

  describe('#default', () => {
    let validValues;

    beforeEach(() => {
      validValues = vtu.getValidValues();
    });

    it('should validate custom validators', () => {
      expect(
        vtu.testValues(
          'isCustomValidator',
          val.check,
          validValues[types.FUNCTION]
        ).failures
      ).toEqual([]);
      expect(vtu.testOtherValues(types.FUNCTION, val.check)).toEqual([]);
    });
  });
});
