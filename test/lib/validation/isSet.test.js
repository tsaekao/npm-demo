import { expect } from 'chai';

import * as vtu from '../validationTestUtil';
import { types } from '../../../src/lib/types';
import * as val from '../../../src/lib/validation/isSet';

describe('module: lib/validation/isSet', function () {
  it('#type', function () {
    expect(val.type).to.equal(types.SET);
  });

  describe('#default', function () {
    it('valid values', function () {
      expect(vtu.testValues(val.type, val.default).failures).to.eql([]);
    });

    it('other types/values', function () {
      expect(vtu.testOtherValues(val.type, val.default)).to.eql([]);
    });
  });
});
