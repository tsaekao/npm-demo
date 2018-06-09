import {expect} from 'chai';
import _ from 'lodash';

import * as vtu from '../validationTestUtil';
import types from '../../../src/lib/types';
import qualifiers from '../../../src/lib/qualifiers';
import * as val from '../../../src/lib/validator/isNumber';

describe('module: lib/validator/isNumber', function() {
  describe('validator', function() {
    it('type', function() {
      expect(val.type).to.equal(types.NUMBER);
    });

    it('valid values', function() {
      expect(vtu.testValues(val.type, val.default).failures).to.eql([]);
    });

    it('other types/values', function() {
      const validValues = vtu.getValidValues(); // @type {Object}
      const invalidTypes = Object.keys(validValues); // @type {Array}

      // remove subset types
      _.pull(invalidTypes, types.NUMBER, types.FINITE, types.INT, types.FLOAT);

      // build a list of all remaining invalid values, along with NaN
      let invalidValues = [NaN];
      _.forEach(invalidTypes, function(type) {
        invalidValues = invalidValues.concat(validValues[type]);
      });

      // nothing should pass
      expect(vtu.testValues(val.type, val.default, invalidValues).passes).to.eql([]);
    });
  });

  describe('qualifiers', function() {
    it('allows NaN if not REQUIRED', function() {
      expect(val.default(NaN)).to.be.false; // defaults to REQUIRED

      _.forEach(qualifiers, function(qualifier) {
        // rejects unless not REQUIRED
        expect(val.default(NaN, qualifier)).to.equal(qualifier !== qualifiers.REQUIRED);
      });
    });
  });

  describe('arguments', function() {
    it('checks for an exact number', function() {
      expect(val.default(7, undefined, {exact: 7})).to.be.true;
      expect(val.default(7.7, undefined, {exact: 7.7})).to.be.true;
      expect(val.default(7, undefined, {exact: 8})).to.be.false;
      expect(val.default(7.7, undefined, {exact: 7.6 + Number.EPSILON})).to.be.false;

      expect(val.default(NaN, undefined, {exact: NaN})).to.be.false; // qualifier takes precedence
      expect(val.default(NaN, qualifiers.EXPECTED, {exact: NaN})).to.be.true;

      expect(val.default(7, undefined, {exact: '6'})).to.be.true; // ignored
      expect(val.default(Infinity, undefined, {exact: Infinity})).to.be.true; // ignored
      expect(val.default(-Infinity, undefined, {exact: -Infinity})).to.be.true; // ignored
      expect(val.default(Number.POSITIVE_INFINITY, undefined, {exact: Number.POSITIVE_INFINITY})).to.be.true; // ignored
      expect(val.default(Number.NEGATIVE_INFINITY, undefined, {exact: Number.NEGATIVE_INFINITY})).to.be.true; // ignored
    });

    it('exact takes precedence over min/max', function() {
      expect(val.default(7, undefined, {exact: 7, min: 8})).to.be.true;
      expect(val.default(7, undefined, {exact: 7, max: 6})).to.be.true;
      expect(val.default(7, undefined, {exact: 7, min: 8, max: 6})).to.be.true;
    });

    it('checks for a minimum number', function() {
      expect(val.default(7, undefined, {min: 7})).to.be.true;
      expect(val.default(7, undefined, {min: 0})).to.be.true;
      expect(val.default(7, undefined, {min: '8'})).to.be.true; // ignored
      expect(val.default(7, undefined, {min: NaN})).to.be.true; // ignored
      expect(val.default(-8, undefined, {min: -7})).to.be.false;
      expect(val.default(7, undefined, {min: 6})).to.be.true;
      expect(val.default(7, undefined, {min: Infinity})).to.be.false;
      expect(val.default(7, undefined, {min: -Infinity})).to.be.true;
      expect(val.default(7, undefined, {min: Number.POSITIVE_INFINITY})).to.be.false;
      expect(val.default(7, undefined, {min: Number.NEGATIVE_INFINITY})).to.be.true;
    });

    it('checks for a maximum number', function() {
      expect(val.default(7, undefined, {max: 7})).to.be.true;
      expect(val.default(7, undefined, {max: 0})).to.be.false;
      expect(val.default(7, undefined, {max: '7'})).to.be.true; // ignored
      expect(val.default(7, undefined, {max: NaN})).to.be.true; // ignored
      expect(val.default(-7, undefined, {max: -8})).to.be.false;
      expect(val.default(7, undefined, {max: 6})).to.be.false;
      expect(val.default(7, undefined, {max: Infinity})).to.be.true;
      expect(val.default(7, undefined, {max: -Infinity})).to.be.false;
      expect(val.default(7, undefined, {max: Number.POSITIVE_INFINITY})).to.be.true;
      expect(val.default(7, undefined, {max: Number.NEGATIVE_INFINITY})).to.be.false;
    });

    it('max ignored if less than min', function() {
      expect(val.default(7, undefined, {min: 7, max: 6})).to.be.true;
    });
  });
});
