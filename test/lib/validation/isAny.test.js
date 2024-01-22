import _ from 'lodash';

import '../../../src/rtv'; // make sure all validators we might use in typesets get configured
import * as vtu from '../validationTestUtil';
import { types } from '../../../src/lib/types';
import * as val from '../../../src/lib/validation/isAny';

describe('module: lib/validation/isAny', () => {
  it('#type', () => {
    expect(val.type).toBe(types.ANY);
  });

  describe('#default', () => {
    it('should validate any value including undefined and null', () => {
      const validValues = vtu.getValidValues(); // @type {Object}
      const validTypes = Object.keys(validValues); // @type {Array}

      let values = [undefined, null];
      _.forEach(validTypes, function (type) {
        values = values.concat(validValues[type]);
      });

      expect(vtu.testValues(val.type, val.check, values).failures).toEqual([]);
    });

    it('other types/values', () => {
      // for ANY, _all_ other values should be _valid_ also
      expect(vtu.testOtherValues(val.type, val.check, true)).toEqual([]);
    });
  });
});
