import '../../../src/rtv'; // make sure all validators we might use in typesets get configured
import * as vtu from '../validationTestUtil';
import { types } from '../../../src/lib/types';
import * as val from '../../../src/lib/validation/isNull';

describe('module: lib/validation/isNull', () => {
  it('#type', () => {
    expect(val.type).toBe(types.NULL);
  });

  describe('#default', () => {
    it('valid values', () => {
      expect(val.check(null)).toBe(true);
    });

    it('other types/values', () => {
      expect(val.check(undefined)).toBe(false);

      // does not test for undefined/null
      expect(vtu.testOtherValues(val.type, val.check)).toEqual([]);
    });
  });
});
