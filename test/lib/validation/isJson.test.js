import '../../../src/rtv'; // make sure all validators we might use in typesets get configured
import * as vtu from '../validationTestUtil';
import { types } from '../../../src/lib/types';
import * as val from '../../../src/lib/validation/isJson';

describe('module: lib/validation/isJson', () => {
  it('#type', () => {
    expect(val.type).toBe(types.JSON);
  });

  describe('#default', () => {
    let jsonValues;
    let invalidValues;

    beforeEach(() => {
      jsonValues = vtu.getJsonValues();
      invalidValues = vtu.getInvalidJsonValues();
    });

    it('valid values', () => {
      expect(vtu.testValues(val.type, val.check, jsonValues).failures).toEqual(
        []
      );
    });

    it('other types/values', () => {
      // nothing should pass
      expect(vtu.testValues(val.type, val.check, invalidValues).passes).toEqual(
        []
      );
    });
  });
});
