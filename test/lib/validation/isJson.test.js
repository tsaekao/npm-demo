import { expect } from 'chai';

import * as vtu from '../validationTestUtil';
import { types } from '../../../src/lib/types';
import * as val from '../../../src/lib/validation/isJson';

describe('module: lib/validation/isJson', function () {
  it('#type', function () {
    expect(val.type).to.equal(types.JSON);
  });

  describe('#default', function () {
    let jsonValues;
    let invalidValues;

    beforeEach(function () {
      jsonValues = vtu.getJsonValues();
      invalidValues = vtu.getInvalidJsonValues();
    });

    it('valid values', function () {
      expect(vtu.testValues(val.type, val.default, jsonValues).failures).to.eql(
        []
      );
    });

    it('other types/values', function () {
      // nothing should pass
      expect(
        vtu.testValues(val.type, val.default, invalidValues).passes
      ).to.eql([]);
    });
  });
});
