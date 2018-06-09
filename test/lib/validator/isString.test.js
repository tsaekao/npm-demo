import {expect} from 'chai';
import _ from 'lodash';

import * as vtu from '../validationTestUtil';
import types from '../../../src/lib/types';
import qualifiers from '../../../src/lib/qualifiers';
import * as val from '../../../src/lib/validator/isString';

describe('module: lib/validation/isString', function() {
  describe('validator', function() {
    it('type', function() {
      expect(val.type).to.equal(types.STRING);
    });

    it('valid values', function() {
      expect(vtu.testValues(val.type, val.validator).failures).to.eql([]);
    });

    it('other types/values', function() {
      expect(vtu.testOtherValues(val.type, val.validator)).to.eql([]);
    });
  });

  describe('qualifiers', function() {
    it('allows empty strings if not REQUIRED', function() {
      expect(val.default('')).to.be.false; // defaults to REQUIRED

      _.forEach(qualifiers, function(qualifier) {
        // rejects unless not REQUIRED
        expect(val.default('', qualifier)).to.equal(qualifier !== qualifiers.REQUIRED);
      });
    });
  });

  describe('arguments', function() {
    it('checks for an exact value', function() {
      expect(val.default('foo', undefined, {exact: 'foo'})).to.be.true;
      expect(val.default('bar', undefined, {exact: 'foo'})).to.be.false;
    });

    it('checks for a partial value if "exact" is not specified', function() {
      expect(val.default('partial', undefined, {partial: 'art'})).to.be.true;
      expect(val.default('partial', undefined, {partial: 'foo'})).to.be.false;
      expect(val.default('partial', undefined, {exact: 'art', partial: 'art'})).to.be.false;
    });

    it('checks for min length if "exact" is not specified', function() {
      expect(val.default('minimum', undefined, {min: 7})).to.be.true;
      expect(val.default('minimum', undefined, {min: 8})).to.be.false;
      expect(val.default('minimum', undefined, {min: -100})).to.be.true;
      expect(val.default('minimum', undefined, {min: '100'})).to.be.true; // ignored: not finite
      expect(val.default('minimum', undefined, {min: NaN})).to.be.true; // ignored: not finite
      expect(val.default('minimum', undefined, {min: Infinity})).to.be.true; // ignored: not finite
      expect(val.default('minimum', undefined, {min: -Infinity})).to.be.true; // ignored: not finite
      expect(val.default('', undefined, {min: 0})).to.be.false; // default qualifier requires non-empty
      expect(val.default('', qualifiers.OPTIONAL, {min: 0})).to.be.true;
    });

    it('min takes precedence over partial', function() {
      expect(val.default('minimum', undefined, {min: 7, partial: 'nim'})).to.be.true;
      expect(val.default('minimum', undefined, {min: 8, partial: 'nim'})).to.be.false;
      expect(val.default('minimum', undefined, {min: -100, partial: 'foo'})).to.be.false;
      expect(val.default('minimum', undefined, {min: -1, partial: 'nim'})).to.be.true;
      expect(val.default('', undefined, {min: 0, partial: ''})).to.be.false; // default qualifier requires non-empty
      expect(val.default('', qualifiers.OPTIONAL, {min: 0, partial: ''})).to.be.true;
      expect(val.default('foo', undefined, {min: 0, partial: ''})).to.be.true;
    });

    it('checks for max length if "exact" is not specified', function() {
      expect(val.default('maximum', undefined, {max: 7})).to.be.true;
      expect(val.default('maximum', undefined, {max: 6})).to.be.false;
      expect(val.default('maximum', undefined, {max: -100})).to.be.true;
      expect(val.default('maximum', undefined, {max: '1'})).to.be.true; // ignored: not finite
      expect(val.default('maximum', undefined, {max: NaN})).to.be.true; // ignored: not finite
      expect(val.default('maximum', undefined, {max: Infinity})).to.be.true; // ignored: not finite
      expect(val.default('maximum', undefined, {max: -Infinity})).to.be.true; // ignored: not finite
      expect(val.default('', undefined, {max: 0})).to.be.false; // default qualifier requires non-empty
      expect(val.default('', qualifiers.OPTIONAL, {max: 0})).to.be.true;
    });

    it('max takes precedence over partial', function() {
      expect(val.default('maximum', undefined, {max: 7, partial: 'xim'})).to.be.true;
      expect(val.default('maximum', undefined, {max: 6, partial: 'xim'})).to.be.false;
      expect(val.default('maximum', undefined, {max: -100, partial: 'foo'})).to.be.false;
      expect(val.default('maximum', undefined, {max: -1, partial: 'xim'})).to.be.true;
      expect(val.default('', undefined, {max: 0, partial: ''})).to.be.false; // default qualifier requires non-empty
      expect(val.default('', qualifiers.OPTIONAL, {max: 0, partial: ''})).to.be.true;
      expect(val.default('foo', undefined, {max: -1, partial: ''})).to.be.true;
    });

    it('checks for min/max length if "exact" is not specified', function() {
      expect(val.default('minandmax', undefined, {min: 9, max: 100})).to.be.true;
      expect(val.default('minandmax', undefined, {min: 9, max: 1})).to.be.true; // max ignored
      expect(val.default('minandmax', undefined, {min: 9, max: 9})).to.be.true;
      expect(val.default('minandmax', undefined, {min: 10, max: 100})).to.be.false;
      expect(val.default('minandmax', undefined, {min: -1, max: 100})).to.be.true;
      expect(val.default('minandmax', undefined, {min: -1, max: -1})).to.be.true;
    });

    it('min/max take precedence over partial', function() {
      expect(val.default('minandmax', undefined, {min: 9, max: 100, partial: 'and'})).to.be.true;
      expect(val.default('minandmax', undefined, {min: 9, max: 1, partial: 'and'})).to.be.true; // max ignored
      expect(val.default('minandmax', undefined, {min: 9, max: 9, partial: 'and'})).to.be.true;
      expect(val.default('minandmax', undefined, {min: 10, max: 100, partial: 'and'})).to.be.false;
      expect(val.default('minandmax', undefined, {min: -1, max: 100, partial: 'and'})).to.be.true;
      expect(val.default('minandmax', undefined, {min: -1, max: -1, partial: 'and'})).to.be.true;
      expect(val.default('minandmax', undefined, {min: -1, max: -1, partial: 'foo'})).to.be.false;
    });
  });
});
