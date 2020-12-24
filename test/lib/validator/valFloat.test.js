import { expect } from 'chai';
import _ from 'lodash';

import * as vtu from '../validationTestUtil';
import { types } from '../../../src/lib/types';
import { qualifiers } from '../../../src/lib/qualifiers';
import * as val from '../../../src/lib/validator/valFloat';

describe('module: lib/validator/valFloat', function () {
  describe('validator', function () {
    // module, and value only
    it('#type', function () {
      expect(val.type).to.equal(types.FLOAT);
    });

    it('succeeds with an RtvSuccess', function () {
      vtu.expectValidatorSuccess(val, 1.1);
    });

    it('valid values', function () {
      expect(vtu.testValues(val.type, val.default).failures).to.eql([]);
    });

    it('other types/values', function () {
      const validValues = vtu.getValidValues(); // @type {Object}
      const invalidTypes = Object.keys(validValues); // @type {Array}

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
        Infinity,
        Number.POSITIVE_INFINITY,
        -Infinity,
        Number.NEGATIVE_INFINITY,
        Number.MAX_VALUE, // int, unsafe
        Number.MIN_SAFE_INTEGER - 1, // int, unsafe
        Number.MIN_SAFE_INTEGER,
        Number.MAX_SAFE_INTEGER,
        Number.MAX_SAFE_INTEGER + 1, // int, unsafe
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
    it('only allows NaN if TRUTHY', function () {
      _.forEach(qualifiers, function (qualifier) {
        if (qualifier !== qualifiers.TRUTHY) {
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
      // NaN not permitted
      vtu.expectValidatorError(val, NaN, qualifiers.EXPECTED, { oneOf: NaN });

      // zero is in type range
      vtu.expectValidatorError(val, 7.7, undefined, { oneOf: 0 });

      // TRUTHY allows NaN even if not allowed for exact
      vtu.expectValidatorSuccess(val, NaN, qualifiers.TRUTHY, { oneOf: 1.1 });
      // TRUTHY allows 0 even if not allowed for exact
      vtu.expectValidatorSuccess(val, 0, qualifiers.TRUTHY, { oneOf: 1.1 });

      // ignored: not in type range
      vtu.expectValidatorSuccess(val, 7.7, undefined, { oneOf: NaN });
      vtu.expectValidatorSuccess(val, 7.7, undefined, { oneOf: -Infinity });
      vtu.expectValidatorSuccess(val, 7.7, undefined, {
        oneOf: Number.NEGATIVE_INFINITY,
      });
      vtu.expectValidatorSuccess(val, 7.7, undefined, { oneOf: Infinity });
      vtu.expectValidatorSuccess(val, 7.7, undefined, {
        oneOf: Number.POSITIVE_INFINITY,
      });
      vtu.expectValidatorSuccess(val, 7.7, undefined, { oneOf: 7 });
      vtu.expectValidatorSuccess(val, 7.7, undefined, {
        oneOf: Number.MAX_VALUE,
      });
      vtu.expectValidatorSuccess(val, 7.7, undefined, {
        oneOf: Number.MIN_SAFE_INTEGER - 1,
      }); // unsafe
      vtu.expectValidatorSuccess(val, 7.7, undefined, {
        oneOf: Number.MIN_SAFE_INTEGER,
      });
      vtu.expectValidatorSuccess(val, 7.7, undefined, {
        oneOf: Number.MAX_SAFE_INTEGER,
      });
      vtu.expectValidatorSuccess(val, 7.7, undefined, {
        oneOf: Number.MAX_SAFE_INTEGER + 1,
      }); // unsafe

      // ignored: invalid type
      vtu.expectValidatorSuccess(val, 7.7, undefined, { oneOf: '6.1' });
    });

    it('checks for an exact number in a list', function () {
      vtu.expectValidatorSuccess(val, 7.7, undefined, {
        oneOf: [6.1, 7.7, 8.1],
      });
      vtu.expectValidatorError(val, 7.7, undefined, { oneOf: [6.1, 8.1] });
      vtu.expectValidatorSuccess(val, 7.7, undefined, { oneOf: [7.7] });
      vtu.expectValidatorSuccess(val, 7.7, undefined, { oneOf: [] }); // ignored

      // TRUTHY allows NaN even if not allowed for exact
      vtu.expectValidatorSuccess(val, NaN, qualifiers.TRUTHY, { oneOf: [1.1] });
      // TRUTHY allows 0 even if not allowed for exact
      vtu.expectValidatorSuccess(val, 0, qualifiers.TRUTHY, { oneOf: [1.1] });

      // ignores non-type values in a list
      vtu.expectValidatorError(val, 7.7, undefined, {
        oneOf: [null, '7.7', true],
      });

      // ignores non-arrays
      vtu.expectValidatorSuccess(val, 7.7, undefined, {
        oneOf: new Set([6.1, 8.1]),
      });
    });

    it('exact takes precedence over min/max', function () {
      vtu.expectValidatorSuccess(val, 7.7, undefined, { oneOf: 7.7, min: 8.1 });
      vtu.expectValidatorSuccess(val, 7.7, undefined, { oneOf: 7.7, max: 6.1 });
      vtu.expectValidatorSuccess(val, 7.7, undefined, {
        oneOf: 7.7,
        min: 8.1,
        max: 6.1,
      });
      vtu.expectValidatorSuccess(val, 7.7, undefined, {
        oneOf: [7.7],
        min: 8.1,
        max: 6.1,
      });
    });

    it('checks for a minimum number', function () {
      validTypeValues.forEach(function (value) {
        vtu.expectValidatorSuccess(val, value, undefined, { min: value });
      });

      vtu.expectValidatorError(val, -8.1, undefined, { min: -7.7 });
      vtu.expectValidatorSuccess(val, 7.7, undefined, { min: 6.1 });

      // zero is in type range
      vtu.expectValidatorError(val, -7.7, undefined, { min: 0 });

      // TRUTHY allows NaN even if not allowed in range
      vtu.expectValidatorSuccess(val, NaN, qualifiers.TRUTHY, { min: 1.1 });
      // TRUTHY allows 0 even if not allowed in range
      vtu.expectValidatorSuccess(val, 0, qualifiers.TRUTHY, { min: 1.1 });

      // these are all ignored min values
      vtu.expectValidatorSuccess(val, 7.7, undefined, { min: '8.1' });
      vtu.expectValidatorSuccess(val, 7.7, undefined, { min: NaN });
      vtu.expectValidatorSuccess(val, 7.7, undefined, { min: -Infinity });
      vtu.expectValidatorSuccess(val, 7.7, undefined, {
        min: Number.NEGATIVE_INFINITY,
      });
      vtu.expectValidatorSuccess(val, 7.7, undefined, { min: Infinity });
      vtu.expectValidatorSuccess(val, 7.7, undefined, {
        min: Number.POSITIVE_INFINITY,
      });
      vtu.expectValidatorSuccess(val, 7.7, undefined, { min: 8 });
      vtu.expectValidatorSuccess(val, 7.7, undefined, {
        min: Number.MAX_VALUE,
      });
      vtu.expectValidatorSuccess(val, 7.7, undefined, {
        min: Number.MIN_SAFE_INTEGER - 1,
      }); // unsafe
      vtu.expectValidatorSuccess(val, 7.7, undefined, {
        min: Number.MIN_SAFE_INTEGER,
      });
      vtu.expectValidatorSuccess(val, 7.7, undefined, {
        min: Number.MAX_SAFE_INTEGER,
      });
      vtu.expectValidatorSuccess(val, 7.7, undefined, {
        min: Number.MAX_SAFE_INTEGER + 1,
      }); // unsafe
    });

    it('checks for a maximum number', function () {
      validTypeValues.forEach(function (value) {
        vtu.expectValidatorSuccess(val, value, undefined, { max: value });
      });

      vtu.expectValidatorError(val, -7.7, undefined, { max: -8.1 });
      vtu.expectValidatorError(val, 7.7, undefined, { max: 6.1 });

      // zero is in type range
      vtu.expectValidatorError(val, 7.7, undefined, { max: 0 });

      // TRUTHY allows NaN even if not allowed in range
      vtu.expectValidatorSuccess(val, NaN, qualifiers.TRUTHY, { max: 1.1 });
      // TRUTHY allows 0 even if not allowed in range
      vtu.expectValidatorSuccess(val, 0, qualifiers.TRUTHY, { max: -1.1 });

      // these are all ignored max values
      vtu.expectValidatorSuccess(val, 7.7, undefined, { max: '6.1' });
      vtu.expectValidatorSuccess(val, 7.7, undefined, { max: NaN });
      vtu.expectValidatorSuccess(val, 7.7, undefined, { max: Infinity });
      vtu.expectValidatorSuccess(val, 7.7, undefined, {
        max: Number.POSITIVE_INFINITY,
      });
      vtu.expectValidatorSuccess(val, 7.7, undefined, { max: -Infinity });
      vtu.expectValidatorSuccess(val, 7.7, undefined, {
        max: Number.NEGATIVE_INFINITY,
      });
      vtu.expectValidatorSuccess(val, 7.7, undefined, { max: 7 });
      vtu.expectValidatorSuccess(val, 7.7, undefined, {
        max: Number.MAX_VALUE,
      });
      vtu.expectValidatorSuccess(val, 7.7, undefined, {
        max: Number.MIN_SAFE_INTEGER - 1,
      }); // unsafe
      vtu.expectValidatorSuccess(val, 7.7, undefined, {
        max: Number.MIN_SAFE_INTEGER,
      });
      vtu.expectValidatorSuccess(val, 7.7, undefined, {
        max: Number.MAX_SAFE_INTEGER,
      });
      vtu.expectValidatorSuccess(val, 7.7, undefined, {
        max: Number.MAX_SAFE_INTEGER + 1,
      }); // unsafe
    });

    it('max ignored if less than min', function () {
      vtu.expectValidatorSuccess(val, 7.7, undefined, { min: 7.7, max: 6.1 });
    });

    it('checks for a number in a range', function () {
      vtu.expectValidatorSuccess(val, 5.1, undefined, { min: 1.1, max: 10.1 });
      vtu.expectValidatorError(val, 0, undefined, { min: 1.1, max: 10.1 });

      // TRUTHY allows NaN even if not allowed in range
      vtu.expectValidatorSuccess(val, NaN, qualifiers.TRUTHY, {
        min: 1.1,
        max: 10.1,
      });
      // TRUTHY allows 0 even if not allowed in range
      vtu.expectValidatorSuccess(val, 0, qualifiers.TRUTHY, {
        min: 1.1,
        max: 10.1,
      });
    });
  });
});
