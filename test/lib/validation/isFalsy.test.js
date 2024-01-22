import '../../../src/rtv'; // make sure all validators we might use in typesets get configured
import * as vtu from '../validationTestUtil';
import * as val from '../../../src/lib/validation/isFalsy';

describe('module: lib/validation/isFalsy', () => {
  it('#type', () => {
    expect(val.type).toBeUndefined();
  });

  describe('#default', () => {
    const falsyValues = vtu.getFalsyValues();

    it('should validate JavaScript falsy values', () => {
      vtu.expectAllToPass('isFalsy', val.check, falsyValues);
    });

    it('should be validating values that are actually falsy', () => {
      falsyValues.forEach(function (value) {
        if (value) {
          expect(`Falsy value ${value}`).toBe('is actually truthy');
        }
      });
    });
  });
});
