import '../../../src/rtv'; // make sure all validators we might use in typesets get configured
import * as vtu from '../validationTestUtil';
import { types } from '../../../src/lib/types';
import * as val from '../../../src/lib/validation/isArray';

describe('module: lib/validation/isArray', () => {
  it('#type', () => {
    expect(val.type).toBe(types.ARRAY);
  });

  describe('#default', () => {
    it('valid values', () => {
      expect(vtu.testValues(val.type, val.check).failures).toEqual([]);
    });

    it('other types/values', () => {
      expect(vtu.testOtherValues(val.type, val.check)).toEqual([]);
    });
  });
});
