import {expect} from 'chai';

import * as vtu from '../validationTestUtil';
import types from '../../../src/lib/types';
import qualifiers from '../../../src/lib/qualifiers';
import * as val from '../../../src/lib/validator/valMap';

describe('module: lib/validator/valMap', function() {
  describe('validator', function() { // module, and value only
    it('#type', function() {
      expect(val.type).to.equal(types.MAP);
    });

    it('succeeds with an RtvSuccess', function() {
      vtu.expectValidatorSuccess(val, new Map());
    });

    it('valid values', function() {
      expect(vtu.testValues(val.type, val.default).failures).to.eql([]);
    });

    it('other types/values', function() {
      expect(vtu.testOtherValues(val.type, val.default)).to.eql([]);
    });
  });

  describe('qualifiers', function() {
    describe('rules are supported', function() {
      it('REQUIRED (other than values previously tested)', function() {
        vtu.expectValidatorError(val, undefined, qualifiers.REQUIRED);
        vtu.expectValidatorError(val, null, qualifiers.REQUIRED);
      });

      it('EXPECTED', function() {
        vtu.expectValidatorError(val, undefined, qualifiers.EXPECTED);
        vtu.expectValidatorSuccess(val, null, qualifiers.EXPECTED);
      });

      it('OPTIONAL', function() {
        vtu.expectValidatorSuccess(val, undefined, qualifiers.OPTIONAL);
        vtu.expectValidatorSuccess(val, null, qualifiers.OPTIONAL);
      });
    });

    describe('are used in error typesets', function() {
      it('DEFAULT', function() {
        vtu.expectValidatorError(val, 1); // default should be REQUIRED
      });

      it('REQUIRED', function() {
        vtu.expectValidatorError(val, 1, qualifiers.REQUIRED);
      });

      it('EXPECTED', function() {
        vtu.expectValidatorError(val, 1, qualifiers.EXPECTED);
      });

      it('OPTIONAL', function() {
        vtu.expectValidatorError(val, 1, qualifiers.OPTIONAL);
      });
    });
  });

  describe('arguments', function() {
    it('checks for an exact length', function() {
      const map = new Map([[1, 'one'], [2, 'two'], [3, 'three']]);

      vtu.expectValidatorSuccess(val, new Map(), undefined, {length: 0});
      vtu.expectValidatorSuccess(val, map, undefined, {length: 3});

      vtu.expectValidatorError(val, map, undefined, {length: 2});
      vtu.expectValidatorError(val, map, undefined, {length: 1.1});
      vtu.expectValidatorError(val, map, undefined, {length: -0});

      // all these lengths should be ignored
      vtu.expectValidatorSuccess(val, map, undefined, {length: '1'});
      vtu.expectValidatorSuccess(val, map, undefined, {length: -1});
      vtu.expectValidatorSuccess(val, map, undefined, {length: NaN});
      vtu.expectValidatorSuccess(val, map, undefined, {length: Infinity});
      vtu.expectValidatorSuccess(val, map, undefined, {length: -Infinity});
      vtu.expectValidatorSuccess(val, map, undefined, {length: Number.POSITIVE_INFINITY});
      vtu.expectValidatorSuccess(val, map, undefined, {length: Number.NEGATIVE_INFINITY});
    });

    it('checks for keys with specified typeset', function() {
      const map = new Map([[1, 'one'], [2, 'two'], [3, 'three']]);

      vtu.expectValidatorSuccess(val, map, undefined, {keys: types.FINITE});

      vtu.expectValidatorError(val, map, undefined, {keys: types.STRING}, {
        path: ['key=1'],
        cause: [qualifiers.REQUIRED, types.STRING]
      });

      vtu.expectValidatorSuccess(val, new Map(), undefined, {keys: types.REGEXP});
    });

    it('checks for string keys that match a pattern', function() {
      let map = new Map([[1, 'one'], [2, 'two']]);

      vtu.expectValidatorSuccess(val, map, undefined, {
        keys: types.FINITE,
        keyExp: 'key' // ignored: keys aren't expected to be strings
      });

      map = new Map([['key1', 1], ['key2', 2]]);
      let args = {keys: types.FINITE};

      vtu.expectValidatorError(val, map, undefined, args, {
        path: ['key="key1"'],
        cause: [qualifiers.REQUIRED, types.FINITE]
      }); // keys are not numbers in this map

      vtu.expectValidatorSuccess(val, map, undefined, {
        keys: types.STRING,
        keyExp: 'key\\d'
      });
      vtu.expectValidatorSuccess(val, map, undefined, {
        keys: types.STRING,
        keyExp: function() {} // ignored: not string
      });
      vtu.expectValidatorSuccess(val, map, undefined, {
        keys: [types.STRING],
        keyExp: 'key\\d'
      });
      vtu.expectValidatorSuccess(val, map, undefined, {
        keys: [qualifiers.EXPECTED, types.STRING],
        keyExp: 'key\\d'
      });

      args = {
        keys: [qualifiers.EXPECTED, types.STRING],
        keyExp: 'KEY\\d'
      };
      vtu.expectValidatorError(val, map, undefined, args, {
        path: ['key="key1"'],
        cause: [qualifiers.REQUIRED, types.MAP, args]
      }); // case-sensitive by default

      vtu.expectValidatorSuccess(val, map, undefined, {
        keys: [qualifiers.EXPECTED, types.STRING],
        keyExp: 'KEY\\d',
        keyFlagSpec: 'i' // case-insensitive flag
      });

      args = {
        keys: [qualifiers.EXPECTED, types.STRING],
        keyExp: 'KEY\\d',
        keyFlagSpec: {} // ignored: not string (so still case-sensitive)
      };
      vtu.expectValidatorError(val, map, undefined, args, {
        path: ['key="key1"'],
        cause: [qualifiers.REQUIRED, types.MAP, args]
      });
    });

    it('checks for values with specified typeset', function() {
      let map = new Map([[1, 'one'], [2, 'two'], [3, 'three']]);

      vtu.expectValidatorSuccess(val, map, undefined, {
        values: types.STRING
      });

      let args = {values: types.BOOLEAN};
      vtu.expectValidatorError(val, map, undefined, args, {
        path: ['valueKey=1'],
        cause: [qualifiers.REQUIRED, types.BOOLEAN]
      });

      map = new Map([[1, 'one'], [2, 'two'], [3, '']]);

      args = {
        values: types.STRING // required by default, so will fail
      };
      vtu.expectValidatorError(val, map, undefined, args, {
        path: ['valueKey=3'],
        cause: [qualifiers.REQUIRED, types.STRING]
      });

      vtu.expectValidatorSuccess(val, map, undefined, {
        values: [qualifiers.EXPECTED, types.STRING]
      });
    });

    it('checks for keys and values with specified typeset', function() {
      const map = new Map([
        [1, new Map([['a', true]])],
        [2, new Map([['b', false]])],
        [3, new Map([['c', true]])]
      ]);

      vtu.expectValidatorSuccess(val, map, undefined, {
        keys: types.FINITE,
        values: [types.MAP, {
          keys: types.STRING,
          values: types.BOOLEAN
        }]
      });

      // keys in nested maps are not strings of >= 2 chars
      const valuesTypeset = [types.MAP, {
        keys: [types.STRING, {min: 2}],
        values: types.BOOLEAN
      }];
      const args = {
        keys: types.FINITE,
        values: valuesTypeset
      };
      vtu.expectValidatorError(val, map, undefined, args, {
        path: ['valueKey=1', 'key="a"'],
        cause: [qualifiers.REQUIRED, types.STRING, {min: 2}]
      });
    });
  });
});
