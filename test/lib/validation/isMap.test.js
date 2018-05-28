import {expect} from 'chai';
import _ from 'lodash';

import * as vtu from './validationTestUtil';
import types from '../../../src/lib/types';
import * as val from '../../../src/lib/validation/isMap';

describe('module: lib/validation/isMap', function() {
  describe('validator', function() {
    it('type', function() {
      expect(val.type).to.equal(types.MAP);
    });

    it('valid values', function() {
      expect(vtu.testValues(val.type, val.validator).failures).to.eql([]);
    });

    it('other types/values', function() {
      expect(vtu.testOtherValues(val.type, val.validator)).to.eql([]);
    });
  });

  describe('arguments', function() {
    it('checks for an exact length', function() {
      const map = new Map([[1, 'one'], [2, 'two'], [3, 'three']]);

      expect(val.validator(new Map(), undefined, {length: 0})).to.be.true;
      expect(val.validator(map, undefined, {length: 3})).to.be.true;
      expect(val.validator(map, undefined, {length: 2})).to.be.false;
      expect(val.validator(map, undefined, {length: 1.1})).to.be.false;

      expect(val.validator(map, undefined, {length: '1'})).to.be.true; // ignored
      expect(val.validator(map, undefined, {length: -0})).to.be.true; // ignored
      expect(val.validator(map, undefined, {length: -1})).to.be.true; // ignored
      expect(val.validator(map, undefined, {length: NaN})).to.be.true; // ignored
      expect(val.validator(map, undefined, {length: Infinity})).to.be.true; // ignored
      expect(val.validator(map, undefined, {length: -Infinity})).to.be.true; // ignored
      expect(val.validator(map, undefined, {length: Number.POSITIVE_INFINITY})).to.be.true; // ignored
      expect(val.validator(map, undefined, {length: Number.NEGATIVE_INFINITY})).to.be.true; // ignored
    });

    it('checks for keys with specified typeset'); // TODO

    it('checks for strings keys that match a pattern'); // TODO

    it('checks for values with specified typeset'); // TODO
  });
});
