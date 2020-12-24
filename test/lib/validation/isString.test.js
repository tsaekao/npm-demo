import { expect } from 'chai';

import * as vtu from '../validationTestUtil';
import { types } from '../../../src/lib/types';
import * as val from '../../../src/lib/validation/isString';

describe('module: lib/validation/isString', function () {
  it('#type', function () {
    expect(val.type).to.equal(types.STRING);
  });

  describe('#default', function () {
    it('valid values', function () {
      expect(vtu.testValues(val.type, val.check).failures).to.eql([]);
    });

    it('other types/values', function () {
      expect(vtu.testOtherValues(val.type, val.check)).to.eql([]);
    });

    it('does not allow an empty string by default', function () {
      expect(val.check('')).to.be.false;
    });

    it('allows an empty string when options.allowEmpty is truthy', function () {
      expect(val.check('', { allowEmpty: true })).to.be.true;
    });
  });
});
