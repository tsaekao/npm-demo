import { expect } from 'chai';
import _ from 'lodash';

import * as vtu from '../validationTestUtil';
import { types } from '../../../src/lib/types';
import { qualifiers } from '../../../src/lib/qualifiers';
import * as val from '../../../src/lib/validator/valNumber';

describe('module: lib/validator/valNumber', function () {
  describe('validator', function () {
    // module, and value only
    it('#type', function () {
      expect(val.type).to.equal(types.NUMBER);
    });

    it('succeeds with an RtvSuccess', function () {
      vtu.expectValidatorSuccess(val, 1);
    });

    it('valid values', function () {
      expect(vtu.testValues(val.type, val.default).failures).to.eql([]);
    });

    it('other types/values', function () {
      const validValues = vtu.getValidValues(); // @type {Object}
      const invalidTypes = Object.keys(validValues); // @type {Array}

      // remove subset types
      _.pull(
        invalidTypes,
        types.NUMBER,
        types.FINITE,
        types.INT,
        types.SAFE_INT,
        types.FLOAT
      );

      // build a list of all remaining invalid values
      let invalidValues = [
        // put some NUMBER values back in which aren't overlaps
        NaN,
      ];
      _.forEach(invalidTypes, function (type) {
        invalidValues = invalidValues.concat(validValues[type]);
      });

      // nothing should pass
      expect(
        vtu.testValues(val.type, val.default, invalidValues).passes
      ).to.eql([]);
    });
  });

  describe('qualifiers', function () {
    it('allows NaN if not REQUIRED', function () {
      vtu.expectValidatorError(val, NaN); // defaults to REQUIRED

      _.forEach(qualifiers, function (qualifier) {
        // rejects unless not REQUIRED
        if (qualifier === qualifiers.REQUIRED) {
          vtu.expectValidatorError(val, NaN, qualifier);
        } else {
          vtu.expectValidatorSuccess(val, NaN, qualifier);
        }
      });
    });

    describe('rules are supported', function () {
      it('REQUIRED (other than values previously tested)', function () {
        const restrictedValues = vtu
          .getRestrictedValues(qualifiers.REQUIRED)
          .filter((v) => v !== 0);
        vtu.expectAllToFail(
          val.type,
          val.default,
          restrictedValues,
          qualifiers.REQUIRED
        );

        const permittedValues = vtu.getPermittedValues(qualifiers.REQUIRED);
        vtu.expectAllToPass(
          val.type,
          val.default,
          permittedValues,
          qualifiers.REQUIRED
        );
      });

      it('EXPECTED', function () {
        const restrictedValues = vtu
          .getRestrictedValues(qualifiers.EXPECTED)
          .filter((v) => v !== 0 && !isNaN(v));
        vtu.expectAllToFail(
          val.type,
          val.default,
          restrictedValues,
          qualifiers.EXPECTED
        );

        const permittedValues = vtu.getPermittedValues(qualifiers.EXPECTED);
        vtu.expectAllToPass(
          val.type,
          val.default,
          permittedValues,
          qualifiers.EXPECTED
        );
      });

      it('OPTIONAL', function () {
        const restrictedValues = vtu
          .getRestrictedValues(qualifiers.OPTIONAL)
          .filter((v) => v !== 0 && !isNaN(v));
        vtu.expectAllToFail(
          val.type,
          val.default,
          restrictedValues,
          qualifiers.OPTIONAL
        );

        const permittedValues = vtu.getPermittedValues(qualifiers.OPTIONAL);
        vtu.expectAllToPass(
          val.type,
          val.default,
          permittedValues,
          qualifiers.OPTIONAL
        );
      });

      it('TRUTHY', function () {
        const restrictedValues = vtu.getRestrictedValues(qualifiers.TRUTHY);
        vtu.expectAllToFail(
          val.type,
          val.default,
          restrictedValues,
          qualifiers.TRUTHY
        );

        const permittedValues = vtu.getPermittedValues(qualifiers.TRUTHY);
        vtu.expectAllToPass(
          val.type,
          val.default,
          permittedValues,
          qualifiers.TRUTHY
        );
      });
    });

    describe('are used in error typesets', function () {
      it('DEFAULT', function () {
        vtu.expectValidatorError(val, /foo/); // default should be REQUIRED
      });

      it('REQUIRED', function () {
        vtu.expectValidatorError(val, /foo/, qualifiers.REQUIRED);
      });

      it('EXPECTED', function () {
        vtu.expectValidatorError(val, /foo/, qualifiers.EXPECTED);
      });

      it('OPTIONAL', function () {
        vtu.expectValidatorError(val, /foo/, qualifiers.OPTIONAL);
      });

      it('TRUTHY', function () {
        vtu.expectValidatorError(val, /foo/, qualifiers.TRUTHY);
      });
    });
  });

  describe('arguments', function () {
    let validTypeValues;

    beforeEach(function () {
      validTypeValues = vtu.getValidValues(val.type);
    });

    it('checks for an exact number', function () {
      validTypeValues.forEach(function (value) {
        vtu.expectValidatorSuccess(val, value, undefined, { oneOf: value });
      });

      // qualifier takes precedence
      vtu.expectValidatorError(val, NaN, undefined, { oneOf: NaN });
      // EXPECTED allows NaN and NaN is permitted for exact
      vtu.expectValidatorSuccess(val, NaN, qualifiers.EXPECTED, { oneOf: NaN });
      // OPTIONAL allows NaN and NaN is permitted for exact
      vtu.expectValidatorSuccess(val, NaN, qualifiers.OPTIONAL, { oneOf: NaN });
      // TRUTHY allows NaN even if not allowed for exact
      vtu.expectValidatorSuccess(val, NaN, qualifiers.TRUTHY, { oneOf: 1 });
      // TRUTHY allows 0 even if not allowed for exact
      vtu.expectValidatorSuccess(val, 0, qualifiers.TRUTHY, { oneOf: 1 });
      // zero is in type range
      vtu.expectValidatorError(val, 7, undefined, { oneOf: 0 });
      // ignored: invalid type
      vtu.expectValidatorSuccess(val, 7, undefined, { oneOf: '6' });
    });

    it('checks for an exact number in a list', function () {
      vtu.expectValidatorSuccess(val, 7, undefined, { oneOf: [6, 7, 8] });
      vtu.expectValidatorError(val, 7, undefined, { oneOf: [6, 8] });
      vtu.expectValidatorSuccess(val, 7, undefined, { oneOf: [7] });
      vtu.expectValidatorSuccess(val, 7, undefined, { oneOf: [] }); // ignored

      // TRUTHY allows NaN even if not allowed for exact
      vtu.expectValidatorSuccess(val, NaN, qualifiers.TRUTHY, { oneOf: [1] });
      // TRUTHY allows 0 even if not allowed for exact
      vtu.expectValidatorSuccess(val, 0, qualifiers.TRUTHY, { oneOf: [1] });

      // ignores non-type values in a list
      vtu.expectValidatorError(val, 7, undefined, { oneOf: [null, '7', true] });

      // ignores non-arrays
      vtu.expectValidatorSuccess(val, 7, undefined, { oneOf: new Set([6, 8]) });
    });

    it('exact takes precedence over min/max', function () {
      vtu.expectValidatorSuccess(val, 7, undefined, { oneOf: 7, min: 8 });
      vtu.expectValidatorSuccess(val, 7, undefined, { oneOf: 7, max: 6 });
      vtu.expectValidatorSuccess(val, 7, undefined, {
        oneOf: 7,
        min: 8,
        max: 6,
      });
      vtu.expectValidatorSuccess(val, 7, undefined, {
        oneOf: [7],
        min: 8,
        max: 6,
      });
    });

    it('checks for a minimum number', function () {
      validTypeValues.forEach(function (value) {
        vtu.expectValidatorSuccess(val, value, undefined, { min: value });
      });

      vtu.expectValidatorError(val, -8, undefined, { min: -7 });
      vtu.expectValidatorSuccess(val, 7, undefined, { min: 6 });
      vtu.expectValidatorSuccess(val, 7, undefined, { min: -Infinity });
      vtu.expectValidatorSuccess(val, 7, undefined, {
        min: Number.NEGATIVE_INFINITY,
      });
      vtu.expectValidatorError(val, 7, undefined, { min: Infinity });
      vtu.expectValidatorError(val, 7, undefined, {
        min: Number.POSITIVE_INFINITY,
      });

      // zero is in type range
      vtu.expectValidatorError(val, -7, undefined, { min: 0 });

      // TRUTHY allows NaN even if not allowed in range
      vtu.expectValidatorSuccess(val, NaN, qualifiers.TRUTHY, { min: 1 });
      // TRUTHY allows 0 even if not allowed in range
      vtu.expectValidatorSuccess(val, 0, qualifiers.TRUTHY, { min: 1 });

      // these are all ignored min values
      vtu.expectValidatorSuccess(val, 7, undefined, { min: '8' });
      vtu.expectValidatorSuccess(val, 7, undefined, { min: NaN });
    });

    it('checks for a maximum number', function () {
      validTypeValues.forEach(function (value) {
        vtu.expectValidatorSuccess(val, value, undefined, { max: value });
      });

      vtu.expectValidatorError(val, -7, undefined, { max: -8 });
      vtu.expectValidatorError(val, 7, undefined, { max: 6 });
      vtu.expectValidatorSuccess(val, 7, undefined, { max: Infinity });
      vtu.expectValidatorSuccess(val, 7, undefined, {
        max: Number.POSITIVE_INFINITY,
      });
      vtu.expectValidatorError(val, 7, undefined, { max: -Infinity });
      vtu.expectValidatorError(val, 7, undefined, {
        max: Number.NEGATIVE_INFINITY,
      });

      // zero is in type range
      vtu.expectValidatorError(val, 7, undefined, { max: 0 });

      // TRUTHY allows NaN even if not allowed in range
      vtu.expectValidatorSuccess(val, NaN, qualifiers.TRUTHY, { max: 1 });
      // TRUTHY allows 0 even if not allowed in range
      vtu.expectValidatorSuccess(val, 0, qualifiers.TRUTHY, { max: -1 });

      // these are all ignored max values
      vtu.expectValidatorSuccess(val, 7, undefined, { max: '6' });
      vtu.expectValidatorSuccess(val, 7, undefined, { max: NaN });
    });

    it('max ignored if less than min', function () {
      vtu.expectValidatorSuccess(val, 7, undefined, { min: 7, max: 6 });
    });

    it('checks for a number in a range', function () {
      vtu.expectValidatorSuccess(val, 5, undefined, { min: 1, max: 10 });
      vtu.expectValidatorError(val, 0, undefined, { min: 1, max: 10 });

      // TRUTHY allows NaN even if not allowed in range
      vtu.expectValidatorSuccess(val, NaN, qualifiers.TRUTHY, {
        min: 1,
        max: 10,
      });
      // TRUTHY allows 0 even if not allowed in range
      vtu.expectValidatorSuccess(val, 0, qualifiers.TRUTHY, {
        min: 1,
        max: 10,
      });
    });
  });
});
