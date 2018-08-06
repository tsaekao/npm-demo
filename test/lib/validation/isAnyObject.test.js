import {expect} from 'chai';
import _ from 'lodash';

import * as vtu from '../validationTestUtil';
import types from '../../../src/lib/types';
import * as val from '../../../src/lib/validation/isAnyObject';

describe('module: lib/validation/isAnyObject', function() {
  it('type', function() {
    expect(val.type).to.equal(types.ANY_OBJECT);
  });

  describe('#default', function() {
    it('should validate any object', function() {
      const validValues = vtu.getValidValues(); // @type {Object}
      const validTypes = Object.keys(validValues); // @type {Array}

      // remove primitives
      _.pull(validTypes, types.ANY, types.STRING, types.BOOLEAN, types.NUMBER,
          types.FINITE, types.INT, types.FLOAT, types.SYMBOL);

      let values = [];
      _.forEach(validTypes, function(type) {
        values = values.concat(validValues[type]);
      });

      expect(vtu.testValues(val.type, val.default, values).failures).to.eql([]);
    });
  });
});
