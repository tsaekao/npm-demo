import {expect} from 'chai';
import _ from 'lodash';

import * as vtu from '../validationTestUtil';
import types from '../../../src/lib/types';
import qualifiers from '../../../src/lib/qualifiers';
import * as val from '../../../src/lib/validator/valArray';

describe('module: lib/validator/valArray', function() {
  describe('validator', function() { // module, and value only
    it('#type', function() {
      expect(val.type).to.equal(types.ARRAY);
    });

    it('succeeds with an RtvSuccess', function() {
      vtu.expectValidatorSuccess(val, []);
    });

    it('valid values', function() {
      expect(vtu.testValues(val.type, val.default).failures).to.eql([]);
    });

    it('other types/values', function() {
      expect(vtu.testOtherValues(val.type, val.default)).to.eql([]);
    });
  });

  describe('qualifiers', function() {
    it('empty arrays allowed', function() {
      _.forEach(qualifiers, function(qualifier) {
        vtu.expectValidatorSuccess(val, [], qualifier);
      });
    });

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
      const arr = [7];

      vtu.expectValidatorSuccess(val, [], undefined, {length: 0});
      vtu.expectValidatorSuccess(val, [], undefined, {length: -0});
      vtu.expectValidatorSuccess(val, arr, undefined, {length: 1});

      vtu.expectValidatorError(val, arr, undefined, {length: 2});
      vtu.expectValidatorError(val, arr, undefined, {length: 1.1});

      // all these lengths should be ignored
      vtu.expectValidatorSuccess(val, arr, undefined, {length: '1'});
      vtu.expectValidatorSuccess(val, arr, undefined, {length: -1});
      vtu.expectValidatorSuccess(val, arr, undefined, {length: NaN});
      vtu.expectValidatorSuccess(val, arr, undefined, {length: Infinity});
      vtu.expectValidatorSuccess(val, arr, undefined, {length: -Infinity});
      vtu.expectValidatorSuccess(val, arr, undefined, {length: Number.POSITIVE_INFINITY});
      vtu.expectValidatorSuccess(val, arr, undefined, {length: Number.NEGATIVE_INFINITY});
    });

    it('length takes precedence over min/max', function() {
      const arr = [7, 8, 9];
      vtu.expectValidatorSuccess(val, arr, undefined, {length: 3, min: 4});
      vtu.expectValidatorSuccess(val, arr, undefined, {length: 3, max: 2});
      vtu.expectValidatorSuccess(val, arr, undefined, {length: 3, min: 4, max: 2});
    });

    it('checks for a minimum length', function() {
      const arr = [7, 8, 9];

      vtu.expectValidatorSuccess(val, arr, undefined, {min: 3});
      vtu.expectValidatorSuccess(val, arr, undefined, {min: 0});

      // all these minimums should be ignored
      vtu.expectValidatorSuccess(val, arr, undefined, {min: '7'});
      vtu.expectValidatorSuccess(val, arr, undefined, {min: -7});
      vtu.expectValidatorSuccess(val, arr, undefined, {min: NaN});
      vtu.expectValidatorSuccess(val, arr, undefined, {min: Infinity});
      vtu.expectValidatorSuccess(val, arr, undefined, {min: -Infinity});
      vtu.expectValidatorSuccess(val, arr, undefined, {min: Number.POSITIVE_INFINITY});
      vtu.expectValidatorSuccess(val, arr, undefined, {min: Number.NEGATIVE_INFINITY});
    });

    it('checks for a maximum length', function() {
      const arr = [7, 8, 9];

      vtu.expectValidatorSuccess(val, arr, undefined, {max: 3});

      vtu.expectValidatorError(val, arr, undefined, {max: 0});

      // all these maximums should be ignored
      vtu.expectValidatorSuccess(val, arr, undefined, {max: '7'});
      vtu.expectValidatorSuccess(val, arr, undefined, {max: -7});
      vtu.expectValidatorSuccess(val, arr, undefined, {max: NaN});
      vtu.expectValidatorSuccess(val, arr, undefined, {max: Infinity});
      vtu.expectValidatorSuccess(val, arr, undefined, {max: -Infinity});
      vtu.expectValidatorSuccess(val, arr, undefined, {max: Number.POSITIVE_INFINITY});
      vtu.expectValidatorSuccess(val, arr, undefined, {max: Number.NEGATIVE_INFINITY});
    });

    it('max ignored if less than min', function() {
      vtu.expectValidatorSuccess(val, [7, 8, 9], undefined, {min: 2, max: 1});
    });

    it('checks each element against typeset', function() {
      let arr = ['a', 'b', ''];
      let args = {ts: [qualifiers.EXPECTED, types.STRING]};

      vtu.expectValidatorSuccess(val, arr, undefined, args);

      args = {ts: [qualifiers.REQUIRED, types.STRING]};
      vtu.expectValidatorError(val, arr, undefined, args, {
        path: ['2'],
        mismatch: args.ts
      });

      arr = [1, 'a'];
      args = {ts: [types.FINITE, {min: 1}, types.STRING, {oneOf: 'a'}]};
      vtu.expectValidatorSuccess(val, arr, undefined, args);

      arr = [1, 'a'];
      args = {ts: [types.FINITE, {min: 2}, types.STRING, {oneOf: 'a'}]};
      vtu.expectValidatorError(val, arr, undefined, args, {
        path: ['0'],
        mismatch: (function() {
          const ts = args.ts.concat();
          ts.unshift(qualifiers.REQUIRED);
          return ts;
        })()
      });

      args = {ts: /invalid typeset/}; // ignored
      vtu.expectValidatorSuccess(val, arr, undefined, args);
    });

    it('creates error paths that are arrays of strings', function() {
      vtu.expectValidatorError(val, ['a', 2], undefined, {ts: types.STRING}, {
        path: ['1'], // index as a string, not a number, since RtvError#path is array of strings
        mismatch: [qualifiers.REQUIRED, types.STRING]
      });
    });
  });
});
