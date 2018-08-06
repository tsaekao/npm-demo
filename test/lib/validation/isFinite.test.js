import {expect} from 'chai';
import _ from 'lodash';

import * as vtu from '../validationTestUtil';
import types from '../../../src/lib/types';
import * as val from '../../../src/lib/validation/isFinite';

describe('module: lib/validation/isFinite', function() {
  it('#type', function() {
    expect(val.type).to.equal(types.FINITE);
  });

  describe('#default', function() {
    it('valid values', function() {
      expect(vtu.testValues(val.type, val.default).failures).to.eql([]);
    });

    it('other types/values', function() {
      const validValues = vtu.getValidValues(); // @type {Object}
      const invalidTypes = Object.keys(validValues); // @type {Array}

      // remove subset types (NUMBER is partial subset)
      _.pull(invalidTypes, types.NUMBER, types.FINITE, types.INT, types.FLOAT);

      // build a list of all remaining invalid values
      let invalidValues = [];
      _.forEach(invalidTypes, function(type) {
        invalidValues = invalidValues.concat(validValues[type]);
      });

      // add some invalid NUMBER values back in
      invalidValues.splice(0, 0, NaN, Infinity, -Infinity, Number.POSITIVE_INFINITY,
          Number.NEGATIVE_INFINITY);

      // nothing should pass
      expect(vtu.testValues(val.type, val.default, invalidValues).passes).to.eql([]);
    });
  });
});
