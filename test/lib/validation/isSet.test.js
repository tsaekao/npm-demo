import {expect} from 'chai';

import * as vtu from './validationTestUtil';
import types from '../../../src/lib/types';
import * as val from '../../../src/lib/validation/isSet';

describe('module: lib/validation/isSet', function() {
  describe('validator', function() {
    it('type', function() {
      expect(val.type).to.equal(types.SET);
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
      const set = new Set([1, 2, 3]);

      expect(val.validator(new Set(), undefined, {length: 0})).to.be.true;
      expect(val.validator(set, undefined, {length: 3})).to.be.true;
      expect(val.validator(set, undefined, {length: 2})).to.be.false;
      expect(val.validator(set, undefined, {length: 1.1})).to.be.false;
      expect(val.validator(set, undefined, {length: 0})).to.be.false;

      expect(val.validator(set, undefined, {length: '1'})).to.be.true; // ignored
      expect(val.validator(set, undefined, {length: -1})).to.be.true; // ignored
      expect(val.validator(set, undefined, {length: NaN})).to.be.true; // ignored
      expect(val.validator(set, undefined, {length: Infinity})).to.be.true; // ignored
      expect(val.validator(set, undefined, {length: -Infinity})).to.be.true; // ignored
      expect(val.validator(set, undefined, {length: Number.POSITIVE_INFINITY})).to.be.true; // ignored
      expect(val.validator(set, undefined, {length: Number.NEGATIVE_INFINITY})).to.be.true; // ignored
    });

    xit('checks for values with specified typeset', function() { // TODO need to finish implement impl.check before this spec can be run
      let set = new Set(['one', 'two', 'three']);

      expect(val.validator(set, undefined, {
        values: types.STRING
      })).to.be.true;
      expect(val.validator(set, undefined, {
        values: types.BOOLEAN
      })).to.be.false;

      set = new Set(['one', 'two', '']);

      expect(val.validator(set, undefined, {
        values: types.STRING // required by default, so will fail
      })).to.be.false;
      expect(val.validator(set, undefined, {
        values: [qualifiers.EXPECTED, types.STRING]
      })).to.be.true;

      set = new Set([
        new Set(['1']),
        new Set(['2']),
        new Set(['3'])
      ]);

      expect(val.validator(set, undefined, {
        values: [types.SET, {
          keys: types.STRING // ignored: sets don't have keys
        }]
      })).to.be.true;
      expect(val.validator(set, undefined, {
        values: [types.SET, {
          values: types.STRING
        }]
      })).to.be.true;
      expect(val.validator(set, undefined, {
        values: [types.SET, {
          length: 2,
          values: types.STRING
        }]
      })).to.be.false; // nested sets do not have length >= 2
    });
  });
});
