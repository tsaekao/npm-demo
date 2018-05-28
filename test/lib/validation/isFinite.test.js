import {expect} from 'chai';
import _ from 'lodash';

import * as vtu from './validationTestUtil';
import types from '../../../src/lib/types';
import * as val from '../../../src/lib/validation/isFinite';

describe('module: lib/validation/isFinite', function() {
  describe('validator', function() {
    it('type', function() {
      expect(val.type).to.equal(types.FINITE);
    });

    it('valid values', function() {
      expect(vtu.testValues(val.type, val.validator).failures).to.eql([]);
    });

    it('other types/values', function() {
      const validValues = vtu.getValidValues(); // @type {Object}
      const invalidTypes = Object.keys(validValues); // @type {Array}

      // remove subset types (NUMBER is partial subset)
      _.pull(invalidTypes, types.NUMBER, types.FINITE, types.INT, types.FLOAT);

      // build a list of all remaining invalid values
      let invalidValues = [];
      _.forEach(invalidTypes, function(type) {
        invalidValues = invalidValues.concat(validValues[type]);
      });

      // add some invalid NUMBER values back in
      invalidValues.splice(0, 0, NaN, Infinity, -Infinity, Number.POSITIVE_INFINITY,
          Number.NEGATIVE_INFINITY);

      // nothing should pass
      expect(vtu.testValues(val.type, val.validator, invalidValues).passes).to.eql([]);
    });
  });

  describe('qualifiers', function() {
    it('never allows NaN', function() {
      _.forEach(qualifiers, function(qualifier) {
        expect(val.validator(NaN, qualifier)).to.equal(false);
      });
    });
  });

  describe('arguments', function() {
    it('checks for an exact number', function() {
      expect(val.validator(7, undefined, {exact: 7})).to.be.true;
      expect(val.validator(7.7, undefined, {exact: 7.7})).to.be.true;
      expect(val.validator(7, undefined, {exact: 8})).to.be.false;
      expect(val.validator(7.7, undefined, {exact: 7.6 + Number.EPSILON})).to.be.false;

      expect(val.validator(7, undefined, {exact: '7'})).to.be.false; // ignored
      expect(val.validator(NaN, undefined, {exact: NaN})).to.be.false; // ignored
      expect(val.validator(NaN, qualifiers.EXPECTED, {exact: NaN})).to.be.false; // ignored
      expect(val.validator(Infinity, undefined, {exact: Infinity})).to.be.false; // ignored
      expect(val.validator(-Infinity, undefined, {exact: -Infinity})).to.be.false; // ignored
      expect(val.validator(Number.POSITIVE_INFINITY, undefined, {exact: Number.POSITIVE_INFINITY})).to.be.false; // ignored
      expect(val.validator(Number.NEGATIVE_INFINITY, undefined, {exact: Number.NEGATIVE_INFINITY})).to.be.false; // ignored
    });

    it('exact takes precedence over min/max', function() {
      expect(val.validator(7, undefined, {exact: 7, min: 8})).to.be.true;
      expect(val.validator(7, undefined, {exact: 7, max: 6})).to.be.true;
      expect(val.validator(7, undefined, {exact: 7, min: 8, max: 6})).to.be.true;
    });

    it('checks for a minimum number', function() {
      expect(val.validator(7, undefined, {min: 7})).to.be.true;
      expect(val.validator(7, undefined, {min: 0})).to.be.true;
      expect(val.validator(7, undefined, {min: '7'})).to.be.true; // ignored
      expect(val.validator(7, undefined, {min: NaN})).to.be.true; // ignored
      expect(val.validator(-8, undefined, {min: -7})).to.be.false;
      expect(val.validator(7, undefined, {min: 6})).to.be.false;
      expect(val.validator(7, undefined, {min: Infinity})).to.be.true; // ignored
      expect(val.validator(7, undefined, {min: -Infinity})).to.be.true; // ignored
      expect(val.validator(7, undefined, {min: Number.POSITIVE_INFINITY})).to.be.true; // ignored
      expect(val.validator(7, undefined, {min: Number.NEGATIVE_INFINITY})).to.be.true; // ignored
    });

    it('checks for a maximum number', function() {
      expect(val.validator(7, undefined, {max: 7})).to.be.true;
      expect(val.validator(7, undefined, {max: 0})).to.be.false;
      expect(val.validator(7, undefined, {max: '7'})).to.be.true; // ignored
      expect(val.validator(7, undefined, {max: NaN})).to.be.true; // ignored
      expect(val.validator(-7, undefined, {max: -8})).to.be.false;
      expect(val.validator(7, undefined, {max: 6})).to.be.false;
      expect(val.validator(7, undefined, {max: Infinity})).to.be.true; // ignored
      expect(val.validator(7, undefined, {max: -Infinity})).to.be.true; // ignored
      expect(val.validator(7, undefined, {max: Number.POSITIVE_INFINITY})).to.be.true; // ignored
      expect(val.validator(7, undefined, {max: Number.NEGATIVE_INFINITY})).to.be.true; // ignored
    });

    it('max ignored if less than min', function() {
      expect(val.validator(7, undefined, {min: 8, max: 6})).to.be.true;
    });
  });
});
