import { expect } from 'chai';
import _ from 'lodash';

import * as vtu from '../validationTestUtil';
import { types } from '../../../src/lib/types';
import * as val from '../../../src/lib/validation/isAnyObject';

describe('module: lib/validation/isAnyObject', function () {
  it('type', function () {
    expect(val.type).to.equal(types.ANY_OBJECT);
  });

  describe('#default', function () {
    it('should validate any object', function () {
      const validValues = vtu.getValidValues(); // @type {Object}
      const validTypes = Object.keys(validValues); // @type {Array}
      const primitives = [
        types.ANY,
        types.NULL,
        types.STRING,
        types.BOOLEAN,
        types.NUMBER,
        types.FINITE,
        types.INT,
        types.SAFE_INT,
        types.FLOAT,
        types.SYMBOL,
      ];

      // remove primitives
      _.pullAll(validTypes, primitives);

      let anyObjectValues = [];
      _.forEach(validTypes, function (type) {
        anyObjectValues = anyObjectValues.concat(validValues[type]);
      });

      // all the any object values should pass
      expect(
        vtu.testValues(val.type, val.check, anyObjectValues).failures
      ).to.eql([]);

      // all the primitives should fail
      expect(vtu.testValues(val.type, val.check, primitives).passes).to.eql([]);
    });
  });
});
