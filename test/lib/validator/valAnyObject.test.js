import {expect} from 'chai';
import _ from 'lodash';

import * as vtu from '../validationTestUtil';
import types from '../../../src/lib/types';
import qualifiers from '../../../src/lib/qualifiers';
import * as val from '../../../src/lib/validator/valAnyObject';

describe('module: lib/validator/valAnyObject', function() {
  describe('validator', function() { // module, and value only
    it('#type', function() {
      expect(val.type).to.equal(types.ANY_OBJECT);
    });

    it('succeeds with an RtvSuccess', function() {
      vtu.expectValidatorSuccess(val, {});
    });

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

  describe('qualifiers', function() {
    describe('are used in error typesets', function() {
      it('DEFAULT', function() {
        vtu.expectValidatorError(val, 1); // default should be REQUIRED
      });

      it('REQUIRED', function() {
        vtu.expectValidatorError(val, 1, qualifiers.REQUIRED);
      });

      it('EXPECTED', function() {
        vtu.expectValidatorError(val, 1, qualifiers.EXPECTED);
      });

      it('OPTIONAL', function() {
        vtu.expectValidatorError(val, 1, qualifiers.OPTIONAL);
      });
    });
  });
});
