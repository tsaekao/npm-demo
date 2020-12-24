import { expect } from 'chai';
import _ from 'lodash';

import * as vtu from '../validationTestUtil';
import { types } from '../../../src/lib/types';
import * as val from '../../../src/lib/validation/isObject';

/* eslint-disable no-new-wrappers */

describe('module: lib/validation/isObject', function () {
  it('#type', function () {
    expect(val.type).to.equal(types.OBJECT);
  });

  describe('#default', function () {
    it('valid values', function () {
      expect(vtu.testValues(val.type, val.check).failures).to.eql([]);
    });

    it('other types/values', function () {
      const validValues = vtu.getValidValues(); // @type {Object}
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
      expect(vtu.testValues(val.type, val.check, invalidValues).passes).to.eql(
        []
      );
    });
  });
});
