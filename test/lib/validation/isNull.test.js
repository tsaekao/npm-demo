import {expect} from 'chai';

import * as vtu from '../validationTestUtil';
import types from '../../../src/lib/types';
import * as val from '../../../src/lib/validation/isNull';

describe('module: lib/validation/isNull', function() {
  it('#type', function() {
    expect(val.type).to.equal(types.NULL);
  });

  describe('#default', function() {
    it('valid values', function() {
      expect(val.default(null)).to.be.true;
    });

    it('other types/values', function() {
      expect(val.default(undefined)).to.be.false;

      // does not test for undefined/null
      expect(vtu.testOtherValues(val.type, val.default)).to.eql([]);
    });
  });
});
