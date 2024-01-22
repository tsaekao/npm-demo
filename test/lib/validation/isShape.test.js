import _ from 'lodash';

import '../../../src/rtv'; // make sure all validators we might use in typesets get configured
import * as vtu from '../validationTestUtil';
import { types } from '../../../src/lib/types';
import * as val from '../../../src/lib/validation/isShape';

/* eslint-disable no-new-wrappers */

describe('module: lib/validation/isShape', () => {
  it('#type', () => {
    expect(val.type).toBeUndefined();
  });

  describe('#default', () => {
    let validValues;

    beforeEach(() => {
      validValues = vtu.getValidValues();
    });

    it('should validate shape descriptors', () => {
      expect(
        vtu.testValues('isShape', val.check, validValues[types.OBJECT]).failures
      ).toEqual([]);
    });

    it('should not validate other values', () => {
      const validTypes = Object.keys(validValues); // @type {Array}
      const overlaps = [
        types.ANY_OBJECT,
        types.OBJECT,
        types.PLAIN_OBJECT,
        types.CLASS_OBJECT,
        types.HASH_MAP,
      ];

      // remove overlaps
      _.pullAll(validTypes, overlaps);

      let invalidValues = [];
      _.forEach(validTypes, function (type) {
        invalidValues = invalidValues.concat(validValues[type]);
      });

      // add some non-overlap values back in
      invalidValues = invalidValues.concat([
        new String('new-string'),
        new Boolean(true),
        new Boolean(false),
        new Number(1),
      ]);

      // nothing should pass
      expect(
        vtu.testValues('isShape', val.check, invalidValues).passes
      ).toEqual([]);
    });
  });
});
