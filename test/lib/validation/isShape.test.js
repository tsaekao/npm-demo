import { expect } from 'chai';
import _ from 'lodash';

import * as vtu from '../validationTestUtil';
import { types } from '../../../src/lib/types';
import * as val from '../../../src/lib/validation/isShape';

/* eslint-disable no-new-wrappers */

describe('module: lib/validation/isShape', function () {
  it('#type', function () {
    expect(val.type).to.equal(undefined);
  });

  describe('#default', function () {
    let validValues;

    beforeEach(function () {
      validValues = vtu.getValidValues();
    });

    it('should validate shape descriptors', function () {
      expect(
        vtu.testValues('isShape', val.default, validValues[types.OBJECT])
          .failures
      ).to.eql([]);
    });

    it('should not validate other values', function () {
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
        vtu.testValues('isShape', val.default, invalidValues).passes
      ).to.eql([]);
    });
  });
});
