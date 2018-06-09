import {expect} from 'chai';

import * as vtu from '../validationTestUtil';
import types from '../../../src/lib/types';
import qualifiers from '../../../src/lib/qualifiers';
import * as val from '../../../src/lib/validator/isMap';

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

      expect(val.default(new Map(), undefined, {length: 0})).to.be.true;
      expect(val.default(map, undefined, {length: 3})).to.be.true;
      expect(val.default(map, undefined, {length: 2})).to.be.false;
      expect(val.default(map, undefined, {length: 1.1})).to.be.false;
      expect(val.default(map, undefined, {length: -0})).to.be.false;

      expect(val.default(map, undefined, {length: '1'})).to.be.true; // ignored
      expect(val.default(map, undefined, {length: -1})).to.be.true; // ignored
      expect(val.default(map, undefined, {length: NaN})).to.be.true; // ignored
      expect(val.default(map, undefined, {length: Infinity})).to.be.true; // ignored
      expect(val.default(map, undefined, {length: -Infinity})).to.be.true; // ignored
      expect(val.default(map, undefined, {length: Number.POSITIVE_INFINITY})).to.be.true; // ignored
      expect(val.default(map, undefined, {length: Number.NEGATIVE_INFINITY})).to.be.true; // ignored
    });

    it('checks for keys with specified typeset', function() {
      const map = new Map([[1, 'one'], [2, 'two'], [3, 'three']]);

      expect(val.default(map, undefined, {
        keys: types.FINITE
      })).to.be.true;
      expect(val.default(map, undefined, {
        keys: types.STRING
      })).to.be.false;

      expect(val.default(new Map(), undefined, {
        keys: types.REGEXP
      })).to.be.true;
    });

    xit('checks for strings keys that match a pattern', function() { // TODO need to finish implement impl.check before this spec can be run
      let map = new Map([[1, 'one'], [2, 'two']]);

      expect(val.default(map, undefined, {
        keys: types.FINITE,
        keyExp: 'key' // ignored: keys aren't expected to be strings
      })).to.be.true;

      map = new Map([['key1', 1], ['key2', 2]]);

      expect(val.default(map, undefined, {
        keys: types.FINITE
      })).to.be.false; // keys are not strings in this map
      expect(val.default(map, undefined, {
        keys: types.STRING,
        keyExp: 'key\\d'
      })).to.be.true;
      expect(val.default(map, undefined, {
        keys: types.STRING,
        keyExp: function() {} // ignored: not string
      })).to.be.true;
      expect(val.default(map, undefined, {
        keys: [types.STRING],
        keyExp: 'key\\d'
      })).to.be.true;
      expect(val.default(map, undefined, {
        keys: [qualifiers.EXPECTED, types.STRING],
        keyExp: 'key\\d'
      })).to.be.true;
      expect(val.default(map, undefined, {
        keys: [qualifiers.EXPECTED, types.STRING],
        keyExp: 'KEY\\d'
      })).to.be.false; // case-sensitive by default
      expect(val.default(map, undefined, {
        keys: [qualifiers.EXPECTED, types.STRING],
        keyExp: 'KEY\\d',
        keyFlagSpec: 'i' // case-insensitive flag
      })).to.be.true;
      expect(val.default(map, undefined, {
        keys: [qualifiers.EXPECTED, types.STRING],
        keyExp: 'KEY\\d',
        keyFlagSpec: {} // ignored: not string
      })).to.be.false;
    });

    xit('checks for values with specified typeset', function() {  // TODO need to finish implement impl.check before this spec can be run
      let map = new Map([[1, 'one'], [2, 'two'], [3, 'three']]);

      expect(val.default(map, undefined, {
        values: types.STRING
      })).to.be.true;
      expect(val.default(map, undefined, {
        values: types.BOOLEAN
      })).to.be.false;

      map = new Map([[1, 'one'], [2, 'two'], [3, '']]);

      expect(val.default(map, undefined, {
        values: types.STRING // required by default, so will fail
      })).to.be.false;
      expect(val.default(map, undefined, {
        values: [qualifiers.EXPECTED, types.STRING]
      })).to.be.true;
    });

    // TODO Enable this once impl module supports array typesets
    xit('checks for keys and values with specified typeset', function() {
      const map = new Map([
        [1, new Map([['1', true]])],
        [2, new Map([['2', false]])],
        [3, new Map([['3', true]])]
      ]);

      expect(val.default(map, undefined, {
        keys: types.FINITE,
        values: [types.MAP, {
          keys: types.STRING,
          values: types.BOOLEAN
        }]
      })).to.be.true;
      expect(val.default(map, undefined, {
        keys: types.FINITE,
        values: [types.MAP, {
          keys: [types.STRING, {min: 2}],
          values: types.BOOLEAN
        }]
      })).to.be.false; // keys in nested maps are not strings of >= 2 chars
    });
  });
});
