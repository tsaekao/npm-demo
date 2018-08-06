import {expect} from 'chai';

import * as vtu from '../validationTestUtil';
import types from '../../../src/lib/types';
import qualifiers from '../../../src/lib/qualifiers';
import {print} from '../../../src/lib/util';
import * as val from '../../../src/lib/validator/valSet';

describe('module: lib/validator/valSet', function() {
  describe('validator', function() { // module, and value only
    it('#type', function() {
      expect(val.type).to.equal(types.SET);
    });

    it('succeeds with an RtvSuccess', function() {
      vtu.expectValidatorSuccess(val, new Set());
    });

    it('valid values', function() {
      expect(vtu.testValues(val.type, val.default).failures).to.eql([]);
    });

    it('other types/values', function() {
      expect(vtu.testOtherValues(val.type, val.default)).to.eql([]);
    });
  });

  describe('qualifiers', function() {
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
      const set = new Set([1, 2, 3]);

      vtu.expectValidatorSuccess(val, new Set(), undefined, {length: 0});
      vtu.expectValidatorSuccess(val, set, undefined, {length: 3});

      vtu.expectValidatorError(val, set, undefined, {length: 2});
      vtu.expectValidatorError(val, set, undefined, {length: 1.1});
      vtu.expectValidatorError(val, set, undefined, {length: 0});

      // all these lengths should be ignored
      vtu.expectValidatorSuccess(val, set, undefined, {length: '1'});
      vtu.expectValidatorSuccess(val, set, undefined, {length: -1});
      vtu.expectValidatorSuccess(val, set, undefined, {length: NaN});
      vtu.expectValidatorSuccess(val, set, undefined, {length: Infinity});
      vtu.expectValidatorSuccess(val, set, undefined, {length: -Infinity});
      vtu.expectValidatorSuccess(val, set, undefined, {length: Number.POSITIVE_INFINITY});
      vtu.expectValidatorSuccess(val, set, undefined, {length: Number.NEGATIVE_INFINITY});
    });

    it('checks for values with specified typeset', function() {
      let set = new Set(['one', 'two', 'three']);

      vtu.expectValidatorSuccess(val, set, undefined, {values: types.STRING});

      let args = {values: types.BOOLEAN};
      vtu.expectValidatorError(val, set, undefined, args, {
        path: ['"one"'],
        cause: [qualifiers.REQUIRED, types.BOOLEAN]
      });

      set = new Set(['one', 'two', '']);

      args = {
        values: types.STRING // required by default, so will fail
      };
      vtu.expectValidatorError(val, set, undefined, args, {
        path: ['""'],
        cause: [qualifiers.REQUIRED, types.STRING]
      });

      vtu.expectValidatorSuccess(val, set, undefined, {
        values: [qualifiers.EXPECTED, types.STRING]
      });

      set = new Set([
        new Set(['1']),
        new Set(['2']),
        new Set(['3'])
      ]);

      vtu.expectValidatorSuccess(val, set, undefined, {
        values: [types.SET, {
          keys: types.STRING // ignored: sets don't have keys
        }]
      });

      vtu.expectValidatorSuccess(val, set, undefined, {
        values: [types.SET, {
          values: types.STRING
        }]
      });

      args = {
        values: [types.SET, {
          length: 2, // nested sets do not have length >= 2 so this should fail
          values: types.STRING
        }]
      };
      vtu.expectValidatorError(val, set, undefined, args, {
        path: [print(set.values().next().value)],
        cause: [qualifiers.REQUIRED, ...args.values]
      });
    });
  });
});
