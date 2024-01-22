import _ from 'lodash';

import '../../../src/rtv'; // make sure all validators we might use in typesets get configured
import * as vtu from '../validationTestUtil';
import { types } from '../../../src/lib/types';
import * as val from '../../../src/lib/validation/isSafeInt';

describe('module: lib/validation/isSafeInt', () => {
  it('#type', () => {
    expect(val.type).toBe(types.SAFE_INT);
  });

  describe('#default', () => {
    it('valid values', () => {
      expect(vtu.testValues(val.type, val.check).failures).toEqual([]);
    });

    it('other types/values', () => {
      const validValues = vtu.getValidValues(); // @type {Object}
      const invalidTypes = Object.keys(validValues); // @type {Array}

      // remove subset types (FLOAT is a subset because of zero)
      _.pull(
        invalidTypes,
        types.NUMBER,
        types.FINITE,
        types.INT,
        types.SAFE_INT,
        types.FLOAT
      );

      // build a list of all remaining invalid values
      let invalidValues = [
        // put some NUMBER values back in which aren't overlaps
        NaN,
        Infinity,
        Number.POSITIVE_INFINITY,
        -Infinity,
        Number.NEGATIVE_INFINITY,
        Number.EPSILON,
        Number.MIN_VALUE, // float, number closest to zero
        Number.MAX_VALUE, // int, unsafe
        Number.MIN_SAFE_INTEGER - 1, // int, unsafe
        Number.MAX_SAFE_INTEGER + 1, // int, unsafe
        -1.1,
        1.1,
      ];
      _.forEach(invalidTypes, function (type) {
        invalidValues = invalidValues.concat(validValues[type]);
      });

      // nothing should pass
      expect(vtu.testValues(val.type, val.check, invalidValues).passes).toEqual(
        []
      );
    });
  });
});
