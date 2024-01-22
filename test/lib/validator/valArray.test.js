import _ from 'lodash';

import '../../../src/rtv'; // make sure all validators we might use in typesets get configured
import * as vtu from '../validationTestUtil';
import { types } from '../../../src/lib/types';
import { qualifiers } from '../../../src/lib/qualifiers';
import { check as isArray } from '../../../src/lib/validation/isArray';
import * as val from '../../../src/lib/validator/valArray';

describe('module: lib/validator/valArray', () => {
  describe('validator', () => {
    // module, and value only
    it('#type', () => {
      expect(val.type).toBe(types.ARRAY);
    });

    it('succeeds with an RtvSuccess', () => {
      vtu.expectValidatorSuccess(val, []);
    });

    it('valid values', () => {
      expect(vtu.testValues(val.type, val.validate).failures).toEqual([]);
    });

    it('other types/values', () => {
      expect(vtu.testOtherValues(val.type, val.validate)).toEqual([]);
    });
  });

  describe('qualifiers', () => {
    it('empty arrays allowed', () => {
      _.forEach(qualifiers, function (qualifier) {
        vtu.expectValidatorSuccess(val, [], qualifier);
      });
    });

    describe('rules are supported', () => {
      it('REQUIRED (other than values previously tested)', () => {
        const restrictedValues = vtu.getRestrictedValues(qualifiers.REQUIRED);
        vtu.expectAllToFail(
          val.type,
          val.validate,
          restrictedValues,
          qualifiers.REQUIRED
        );

        const permittedValues = vtu.getPermittedValues(qualifiers.REQUIRED);
        vtu.expectAllToPass(
          val.type,
          val.validate,
          permittedValues,
          qualifiers.REQUIRED
        );
      });

      it('EXPECTED', () => {
        const restrictedValues = vtu.getRestrictedValues(qualifiers.EXPECTED);
        vtu.expectAllToFail(
          val.type,
          val.validate,
          restrictedValues,
          qualifiers.EXPECTED
        );

        const permittedValues = vtu.getPermittedValues(qualifiers.EXPECTED);
        vtu.expectAllToPass(
          val.type,
          val.validate,
          permittedValues,
          qualifiers.EXPECTED
        );
      });

      it('OPTIONAL', () => {
        const restrictedValues = vtu.getRestrictedValues(qualifiers.OPTIONAL);
        vtu.expectAllToFail(
          val.type,
          val.validate,
          restrictedValues,
          qualifiers.OPTIONAL
        );

        const permittedValues = vtu.getPermittedValues(qualifiers.OPTIONAL);
        vtu.expectAllToPass(
          val.type,
          val.validate,
          permittedValues,
          qualifiers.OPTIONAL
        );
      });

      it('TRUTHY', () => {
        const restrictedValues = vtu.getRestrictedValues(qualifiers.TRUTHY);
        vtu.expectAllToFail(
          val.type,
          val.validate,
          restrictedValues,
          qualifiers.TRUTHY
        );

        const permittedValues = vtu.getPermittedValues(qualifiers.TRUTHY);
        vtu.expectAllToPass(
          val.type,
          val.validate,
          permittedValues,
          qualifiers.TRUTHY
        );
      });
    });

    describe('are used in error typesets', () => {
      it('DEFAULT', () => {
        vtu.expectValidatorError(val, 1); // default should be REQUIRED
      });

      it('REQUIRED', () => {
        vtu.expectValidatorError(val, 1, qualifiers.REQUIRED);
      });

      it('EXPECTED', () => {
        vtu.expectValidatorError(val, 1, qualifiers.EXPECTED);
      });

      it('OPTIONAL', () => {
        vtu.expectValidatorError(val, 1, qualifiers.OPTIONAL);
      });

      it('TRUTHY', () => {
        vtu.expectValidatorError(val, 1, qualifiers.TRUTHY);
      });
    });
  });

  describe('arguments', () => {
    it('checks for an exact length', () => {
      const arr = [7];

      vtu.expectValidatorSuccess(val, [], undefined, { length: 0 });
      vtu.expectValidatorSuccess(val, [], undefined, { length: -0 });
      vtu.expectValidatorSuccess(val, arr, undefined, { length: 1 });

      vtu.expectValidatorError(val, arr, undefined, { length: 2 });
      vtu.expectValidatorError(val, arr, undefined, { length: 1.1 });

      // all these lengths should be ignored
      vtu.expectValidatorSuccess(val, arr, undefined, { length: '1' });
      vtu.expectValidatorSuccess(val, arr, undefined, { length: -1 });
      vtu.expectValidatorSuccess(val, arr, undefined, { length: NaN });
      vtu.expectValidatorSuccess(val, arr, undefined, { length: Infinity });
      vtu.expectValidatorSuccess(val, arr, undefined, { length: -Infinity });
      vtu.expectValidatorSuccess(val, arr, undefined, {
        length: Number.POSITIVE_INFINITY,
      });
      vtu.expectValidatorSuccess(val, arr, undefined, {
        length: Number.NEGATIVE_INFINITY,
      });
    });

    it('length takes precedence over min/max', () => {
      const arr = [7, 8, 9];
      vtu.expectValidatorSuccess(val, arr, undefined, { length: 3, min: 4 });
      vtu.expectValidatorSuccess(val, arr, undefined, { length: 3, max: 2 });
      vtu.expectValidatorSuccess(val, arr, undefined, {
        length: 3,
        min: 4,
        max: 2,
      });
    });

    it('checks for a minimum length', () => {
      const arr = [7, 8, 9];

      vtu.expectValidatorSuccess(val, arr, undefined, { min: 3 });
      vtu.expectValidatorSuccess(val, arr, undefined, { min: 0 });

      // all these minimums should be ignored
      vtu.expectValidatorSuccess(val, arr, undefined, { min: '7' });
      vtu.expectValidatorSuccess(val, arr, undefined, { min: -7 });
      vtu.expectValidatorSuccess(val, arr, undefined, { min: NaN });
      vtu.expectValidatorSuccess(val, arr, undefined, { min: Infinity });
      vtu.expectValidatorSuccess(val, arr, undefined, { min: -Infinity });
      vtu.expectValidatorSuccess(val, arr, undefined, {
        min: Number.POSITIVE_INFINITY,
      });
      vtu.expectValidatorSuccess(val, arr, undefined, {
        min: Number.NEGATIVE_INFINITY,
      });
    });

    it('checks for a maximum length', () => {
      const arr = [7, 8, 9];

      vtu.expectValidatorSuccess(val, arr, undefined, { max: 3 });

      vtu.expectValidatorError(val, arr, undefined, { max: 0 });

      // all these maximums should be ignored
      vtu.expectValidatorSuccess(val, arr, undefined, { max: '7' });
      vtu.expectValidatorSuccess(val, arr, undefined, { max: -7 });
      vtu.expectValidatorSuccess(val, arr, undefined, { max: NaN });
      vtu.expectValidatorSuccess(val, arr, undefined, { max: Infinity });
      vtu.expectValidatorSuccess(val, arr, undefined, { max: -Infinity });
      vtu.expectValidatorSuccess(val, arr, undefined, {
        max: Number.POSITIVE_INFINITY,
      });
      vtu.expectValidatorSuccess(val, arr, undefined, {
        max: Number.NEGATIVE_INFINITY,
      });
    });

    it('max ignored if less than min', () => {
      vtu.expectValidatorSuccess(val, [7, 8, 9], undefined, { min: 2, max: 1 });
    });

    it('checks each element against typeset', () => {
      let arr = ['a', 'b', ''];
      let args = { $: [qualifiers.EXPECTED, types.STRING] };

      vtu.expectValidatorSuccess(val, arr, undefined, args);

      args = { $: [qualifiers.REQUIRED, types.STRING] };
      vtu.expectValidatorError(val, arr, undefined, args, {
        path: ['2'],
        mismatch: args.$,
      });

      arr = [1, 'a'];
      args = { $: [types.FINITE, { min: 1 }, types.STRING, { oneOf: 'a' }] };
      vtu.expectValidatorSuccess(val, arr, undefined, args);

      arr = [1, 'a'];
      args = { $: [types.FINITE, { min: 2 }, types.STRING, { oneOf: 'a' }] };
      vtu.expectValidatorError(val, arr, undefined, args, {
        path: ['0'],
        mismatch: (function () {
          const ts = args.$.concat();
          ts.unshift(qualifiers.REQUIRED);
          return ts;
        })(),
      });

      args = { $: /invalid typeset/ }; // ignored
      vtu.expectValidatorSuccess(val, arr, undefined, args);
    });

    it('creates error paths that are arrays of strings', () => {
      vtu.expectValidatorError(
        val,
        ['a', 2],
        undefined,
        { $: types.STRING },
        {
          path: ['1'], // index as a string, not a number, since RtvError#path is array of strings
          mismatch: [qualifiers.REQUIRED, types.STRING],
        }
      );
    });
  });

  describe('context', () => {
    it('should set parent to array and parentKey to index', () => {
      const validator = jest.fn();
      const value = ['bar'];
      val.validate(value, undefined, { $: validator });

      expect(validator).toHaveBeenCalledTimes(1);
      expect(validator.mock.calls[0]).toEqual([
        'bar',
        [qualifiers.REQUIRED, types.ANY],
        validator,
        { originalValue: value, parent: value, parentKey: 0 },
      ]);
    });
  });

  // Minimum Viable Value
  describe('mvv', () => {
    it('interprets original value as array', () => {
      const value = [1, 2, 3];
      const result = val.validate(value);
      expect(result.mvv).not.toBe(value);
      expect(isArray(result.mvv)).toBe(true);
    });

    it('interprets falsy values verbatim', () => {
      vtu.getFalsyValues().forEach((falsyValue) => {
        const result = val.validate(falsyValue, qualifiers.TRUTHY);
        if (isNaN(falsyValue)) {
          // ${print(falsyValue)} verbatim
          expect(isNaN(result.mvv)).toBe(true);
        } else {
          // ${print(falsyValue)} verbatim
          expect(result.mvv).toBe(falsyValue);
        }
      });
    });

    it('reduces the original value', () => {
      const result = val.validate(
        [
          { foo: 1, bar: 1 },
          { foo: 2, bar: 2 },
        ],
        undefined,
        {
          $: {
            foo: types.SAFE_INT,
          },
        }
      );

      expect(result.mvv).toEqual([{ foo: 1 }, { foo: 2 }]);
    });
  });
});
