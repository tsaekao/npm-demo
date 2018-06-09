import {expect} from 'chai';

import * as vtu from '../validationTestUtil';
import types from '../../../src/lib/types';
import * as val from '../../../src/lib/validator/isAny';

describe('module: lib/validation/isAny', function() {
  describe('validator', function() {
    it('type', function() {
      expect(val.type).to.equal(types.ANY);
    });

    it('valid values', function() {
      expect(vtu.testValues(val.type, val.validator).failures).to.eql([]);
    });

    it('other types/values', function() {
      // for ANY, _all_ other values should be _valid_ also
      expect(vtu.testOtherValues(val.type, val.validator, true)).to.eql([]);
    });
  });
});
