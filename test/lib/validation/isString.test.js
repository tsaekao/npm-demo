import '../../../src/rtv'; // make sure all validators we might use in typesets get configured
import * as vtu from '../validationTestUtil';
import { types } from '../../../src/lib/types';
import * as val from '../../../src/lib/validation/isString';

describe('module: lib/validation/isString', () => {
  it('#type', () => {
    expect(val.type).toBe(types.STRING);
  });

  describe('#default', () => {
    it('valid values', () => {
      expect(vtu.testValues(val.type, val.check).failures).toEqual([]);
    });

    it('other types/values', () => {
      expect(vtu.testOtherValues(val.type, val.check)).toEqual([]);
    });

    it('does not allow an empty string by default', () => {
      expect(val.check('')).toBe(false);
    });

    it('allows an empty string when options.allowEmpty is truthy', () => {
      expect(val.check('', { allowEmpty: true })).toBe(true);
    });
  });
});
