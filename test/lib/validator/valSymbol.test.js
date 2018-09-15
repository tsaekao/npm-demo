import {expect} from 'chai';

import * as vtu from '../validationTestUtil';
import types from '../../../src/lib/types';
import qualifiers from '../../../src/lib/qualifiers';
import * as val from '../../../src/lib/validator/valSymbol';

describe('module: lib/validator/valSymbol', function() {
  describe('validator', function() { // module, and value only
    it('#type', function() {
      expect(val.type).to.equal(types.SYMBOL);
    });

    it('succeeds with an RtvSuccess', function() {
      vtu.expectValidatorSuccess(val, Symbol(1));
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
    const sym6 = Symbol(6);
    const sym7 = Symbol(7);
    const sym8 = Symbol(8);
    let validTypeValues;

    beforeEach(function() {
      validTypeValues = vtu.getValidValues(val.type);
    });

    it('checks for an exact symbol', function() {
      validTypeValues.forEach(function(value) {
        vtu.expectValidatorSuccess(val, value, undefined, {oneOf: value});
      });

      // ignored: invalid type
      vtu.expectValidatorSuccess(val, sym7, undefined, {oneOf: null});
      vtu.expectValidatorSuccess(val, sym7, undefined, {oneOf: '7'});
      vtu.expectValidatorSuccess(val, sym7, undefined, {oneOf: 7});
      vtu.expectValidatorSuccess(val, sym7, undefined, {oneOf: /7/});
    });

    it('checks for an exact symbol in a list', function() {
      vtu.expectValidatorSuccess(val, sym7, undefined, {oneOf: [sym6, sym7, sym8]});
      vtu.expectValidatorError(val, sym7, undefined, {oneOf: [sym6, sym8]});
      vtu.expectValidatorSuccess(val, sym7, undefined, {oneOf: [sym7]});
      vtu.expectValidatorSuccess(val, sym7, undefined, {oneOf: []}); // ignored

      // ignores non-type values in a list
      vtu.expectValidatorError(val, sym7, undefined, {oneOf: [null, '7', true]});

      // ignores non-arrays
      vtu.expectValidatorSuccess(val, sym7, undefined, {oneOf: new Set([sym6, sym8])});
    });
  });
});
