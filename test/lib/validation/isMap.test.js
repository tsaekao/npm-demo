import {expect} from 'chai';

import * as vtu from './validationTestUtil';
import types from '../../../src/lib/types';
import * as val from '../../../src/lib/validation/isMap';

describe.only('module: lib/validation/isMap', function() { // DEBUG remove 'only'
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
      expect(val.validator(map, undefined, {length: -0})).to.be.false;

      expect(val.validator(map, undefined, {length: '1'})).to.be.true; // ignored
      expect(val.validator(map, undefined, {length: -1})).to.be.true; // ignored
      expect(val.validator(map, undefined, {length: NaN})).to.be.true; // ignored
      expect(val.validator(map, undefined, {length: Infinity})).to.be.true; // ignored
      expect(val.validator(map, undefined, {length: -Infinity})).to.be.true; // ignored
      expect(val.validator(map, undefined, {length: Number.POSITIVE_INFINITY})).to.be.true; // ignored
      expect(val.validator(map, undefined, {length: Number.NEGATIVE_INFINITY})).to.be.true; // ignored
    });

    it('checks for keys with specified typeset', function() {
      const map = new Map([[1, 'one'], [2, 'two'], [3, 'three']]);

      expect(val.validator(map, undefined, {
        keys: types.FINITE
      })).to.be.true;
      expect(val.validator(map, undefined, {
        keys: types.STRING
      })).to.be.false;

      expect(val.validator(new Map(), undefined, {
        keys: types.REGEXP
      })).to.be.true;
    });

    it('checks for strings keys that match a pattern', function() {
      let map = new Map([[1, 'one'], [2, 'two']]);

      expect(val.validator(map, undefined, {
        keys: types.FINITE,
        keyExp: 'key' // ignored: keys aren't expected to be strings
      })).to.be.true;

      map = new Map(['key1', 1], ['key2', 2]);

      expect(val.validator(map, undefined, {
        keys: types.FINITE
      })).to.be.false; // keys are not strings in this map
      expect(val.validator(map, undefined, {
        keys: types.STRING,
        keyExp: 'key\\d'
      })).to.be.true;
      expect(val.validator(map, undefined, {
        keys: types.STRING,
        keyExp: function() {} // ignored: not string
      })).to.be.true;
      expect(val.validator(map, undefined, {
        keys: [types.STRING],
        keyExp: 'key\\d'
      })).to.be.true;
      expect(val.validator(map, undefined, {
        keys: [qualifiers.EXPECTED, types.STRING],
        keyExp: 'key\\d'
      })).to.be.true;
      expect(val.validator(map, undefined, {
        keys: [qualifiers.EXPECTED, types.STRING],
        keyExp: 'KEY\\d'
      })).to.be.false; // case-sensitive by default
      expect(val.validator(map, undefined, {
        keys: [qualifiers.EXPECTED, types.STRING],
        keyExp: 'KEY\\d',
        keyFlagSpec: 'i' // case-insensitive flag
      })).to.be.true;
      expect(val.validator(map, undefined, {
        keys: [qualifiers.EXPECTED, types.STRING],
        keyExp: 'KEY\\d',
        keyFlagSpec: {} // ignored: not string
      })).to.be.false;
    });

    it('checks for values with specified typeset', function() {
      let map = new Map([[1, 'one'], [2, 'two'], [3, 'three']]);

      expect(val.validator(map, undefined, {
        values: types.STRING
      })).to.be.true;
      expect(val.validator(map, undefined, {
        values: types.BOOLEAN
      })).to.be.false;

      map = new Map([[1, 'one'], [2, 'two'], [3, '']]);

      expect(val.validator(map, undefined, {
        values: types.STRING // required by default, so will fail
      })).to.be.false;
      expect(val.validator(map, undefined, {
        values: [qualifiers.EXPECTED, types.STRING]
      })).to.be.true;
    });

    it('checks for keys and values with specified typeset', function() {
      const map = new Map([
        [1, new Map([['1', true]])],
        [2, new Map([['2', false]])],
        [3, new Map([['3', true]])]
      ]);

      expect(val.validator(map, undefined, {
        keys: types.FINITE,
        values: [types.MAP, {
          keys: types.STRING,
          values: types.BOOLEAN
        }]
      })).to.be.true;
      expect(val.validator(map, undefined, {
        keys: types.FINITE,
        values: [types.MAP, {
          keys: [types.STRING, {min: 2}],
          values: types.BOOLEAN
        }]
      })).to.be.false; // keys in nested maps are not strings of >= 2 chars
    });
  });
});
