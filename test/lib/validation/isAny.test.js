import { expect } from 'chai';
import _ from 'lodash';

import * as vtu from '../validationTestUtil';
import { types } from '../../../src/lib/types';
import * as val from '../../../src/lib/validation/isAny';

describe('module: lib/validation/isAny', function () {
  it('#type', function () {
    expect(val.type).to.equal(types.ANY);
  });

  describe('#default', function () {
    it('should validate any value including undefined and null', function () {
      const validValues = vtu.getValidValues(); // @type {Object}
      const validTypes = Object.keys(validValues); // @type {Array}

      let values = [undefined, null];
      _.forEach(validTypes, function (type) {
        values = values.concat(validValues[type]);
      });

      expect(vtu.testValues(val.type, val.check, values).failures).to.eql([]);
    });

    it('other types/values', function () {
      // for ANY, _all_ other values should be _valid_ also
      expect(vtu.testOtherValues(val.type, val.check, true)).to.eql([]);
    });
  });
});
