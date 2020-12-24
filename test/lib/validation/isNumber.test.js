import { expect } from 'chai';
import _ from 'lodash';

import * as vtu from '../validationTestUtil';
import { types } from '../../../src/lib/types';
import * as val from '../../../src/lib/validation/isNumber';

describe('module: lib/validation/isNumber', function () {
  it('#type', function () {
    expect(val.type).to.equal(types.NUMBER);
  });

  describe('#default', function () {
    it('valid values', function () {
      expect(vtu.testValues(val.type, val.check).failures).to.eql([]);
    });

    it('other types/values', function () {
      const validValues = vtu.getValidValues(); // @type {Object}
      const invalidTypes = Object.keys(validValues); // @type {Array}

      // remove subset types
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
      ];
      _.forEach(invalidTypes, function (type) {
        invalidValues = invalidValues.concat(validValues[type]);
      });

      // nothing should pass
      expect(vtu.testValues(val.type, val.check, invalidValues).passes).to.eql(
        []
      );
    });
  });
});
