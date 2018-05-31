import {expect} from 'chai';
import _ from 'lodash';

import * as vtu from './validationTestUtil';
import types from '../../../src/lib/types';
import qualifiers from '../../../src/lib/qualifiers';
import * as val from '../../../src/lib/validation/isArray';

describe('module: lib/validation/isArray', function() {
  describe('validator', function() {
    it('type', function() {
      expect(val.type).to.equal(types.ARRAY);
    });

    it('valid values', function() {
      expect(vtu.testValues(val.type, val.validator).failures).to.eql([]);
    });

    it('other types/values', function() {
      expect(vtu.testOtherValues(val.type, val.validator)).to.eql([]);
    });
  });

  describe('qualifiers', function() {
    it('empty arrays allowed', function() {
      _.forEach(qualifiers, function(qualifier) {
        expect(val.validator([], qualifier)).to.equal(true);
      });
    });
  });

  describe('arguments', function() {
    it('checks for an exact length', function() {
      const arr = [7];

      expect(val.validator([], undefined, {length: 0})).to.be.true;
      expect(val.validator([], undefined, {length: -0})).to.be.true;
      expect(val.validator(arr, undefined, {length: 1})).to.be.true;
      expect(val.validator(arr, undefined, {length: 2})).to.be.false;
      expect(val.validator(arr, undefined, {length: 1.1})).to.be.false;

      expect(val.validator(arr, undefined, {length: '1'})).to.be.true; // ignored
      expect(val.validator(arr, undefined, {length: -1})).to.be.true; // ignored
      expect(val.validator(arr, undefined, {length: NaN})).to.be.true; // ignored
      expect(val.validator(arr, undefined, {length: Infinity})).to.be.true; // ignored
      expect(val.validator(arr, undefined, {length: -Infinity})).to.be.true; // ignored
      expect(val.validator(arr, undefined, {length: Number.POSITIVE_INFINITY})).to.be.true; // ignored
      expect(val.validator(arr, undefined, {length: Number.NEGATIVE_INFINITY})).to.be.true; // ignored
    });

    it('length takes precedence over min/max', function() {
      const arr = [7, 8, 9];
      expect(val.validator(arr, undefined, {length: 3, min: 4})).to.be.true;
      expect(val.validator(arr, undefined, {length: 3, max: 2})).to.be.true;
      expect(val.validator(arr, undefined, {length: 3, min: 4, max: 2})).to.be.true;
    });

    it('checks for a minimum length', function() {
      const arr = [7, 8, 9];

      expect(val.validator(arr, undefined, {min: 3})).to.be.true;
      expect(val.validator(arr, undefined, {min: 0})).to.be.true;

      expect(val.validator(arr, undefined, {min: '7'})).to.be.true; // ignored
      expect(val.validator(arr, undefined, {min: -7})).to.be.true; // ignored
      expect(val.validator(arr, undefined, {min: NaN})).to.be.true; // ignored
      expect(val.validator(arr, undefined, {min: Infinity})).to.be.true; // ignored
      expect(val.validator(arr, undefined, {min: -Infinity})).to.be.true; // ignored
      expect(val.validator(arr, undefined, {min: Number.POSITIVE_INFINITY})).to.be.true; // ignored
      expect(val.validator(arr, undefined, {min: Number.NEGATIVE_INFINITY})).to.be.true; // ignored
    });

    it('checks for a maximum length', function() {
      const arr = [7, 8, 9];

      expect(val.validator(arr, undefined, {max: 3})).to.be.true;
      expect(val.validator(arr, undefined, {max: 0})).to.be.false;

      expect(val.validator(arr, undefined, {max: '7'})).to.be.true; // ignored
      expect(val.validator(arr, undefined, {max: -7})).to.be.true; // ignored
      expect(val.validator(arr, undefined, {max: NaN})).to.be.true; // ignored
      expect(val.validator(arr, undefined, {max: Infinity})).to.be.true; // ignored
      expect(val.validator(arr, undefined, {max: -Infinity})).to.be.true; // ignored
      expect(val.validator(arr, undefined, {max: Number.POSITIVE_INFINITY})).to.be.true; // ignored
      expect(val.validator(arr, undefined, {max: Number.NEGATIVE_INFINITY})).to.be.true; // ignored
    });

    it('max ignored if less than min', function() {
      expect(val.validator([7, 8, 9], undefined, {min: 2, max: 1})).to.be.true;
    });
  });
});
