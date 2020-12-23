import { expect } from 'chai';

import * as vtu from '../validationTestUtil';
import * as val from '../../../src/lib/validation/isFalsy';

describe('module: lib/validation/isFalsy', function () {
  it('#type', function () {
    expect(val.type).to.equal(undefined);
  });

  describe('#default', function () {
    const falsyValues = vtu.getFalsyValues();

    it('should validate JavaScript falsy values', function () {
      vtu.expectAllToPass('isFalsy', val.default, falsyValues);
    });

    it('should be validating values that are actually falsy', function () {
      falsyValues.forEach(function (value) {
        if (value) {
          expect(`Falsy value ${value}`).to.equal('is actually truthy');
        }
      });
    });
  });
});
