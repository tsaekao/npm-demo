import { expect } from 'chai';

import * as vtu from '../validationTestUtil';
import { types } from '../../../src/lib/types';
import * as val from '../../../src/lib/validation/isPromise';

describe('module: lib/validation/isPromise', function () {
  it('#type', function () {
    expect(val.type).to.equal(types.PROMISE);
  });

  describe('#default', function () {
    it('valid values', function () {
      expect(vtu.testValues(val.type, val.check).failures).to.eql([]);
    });

    it('other types/values', function () {
      expect(vtu.testOtherValues(val.type, val.check)).to.eql([]);
    });
  });
});
