import '../../../src/rtv'; // make sure all validators we might use in typesets get configured
import * as vtu from '../validationTestUtil';
import { print } from '../../../src/lib/util';
import { types } from '../../../src/lib/types';
import { qualifiers } from '../../../src/lib/qualifiers';
import { check as isSet } from '../../../src/lib/validation/isSet';
import * as val from '../../../src/lib/validator/valSet';

describe('module: lib/validator/valSet', () => {
  describe('validator', () => {
    // module, and value only
    it('#type', () => {
      expect(val.type).toBe(types.SET);
    });

    it('succeeds with an RtvSuccess', () => {
      vtu.expectValidatorSuccess(val, new Set());
    });

    it('valid values', () => {
      expect(vtu.testValues(val.type, val.validate).failures).toEqual([]);
    });

    it('other types/values', () => {
      expect(vtu.testOtherValues(val.type, val.validate)).toEqual([]);
    });
  });

  describe('qualifiers', () => {
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
      const set = new Set([1, 2, 3]);

      vtu.expectValidatorSuccess(val, new Set(), undefined, { length: 0 });
      vtu.expectValidatorSuccess(val, set, undefined, { length: 3 });

      vtu.expectValidatorError(val, set, undefined, { length: 2 });
      vtu.expectValidatorError(val, set, undefined, { length: 1.1 });
      vtu.expectValidatorError(val, set, undefined, { length: 0 });

      // all these lengths should be ignored
      vtu.expectValidatorSuccess(val, set, undefined, { length: '1' });
      vtu.expectValidatorSuccess(val, set, undefined, { length: -1 });
      vtu.expectValidatorSuccess(val, set, undefined, { length: NaN });
      vtu.expectValidatorSuccess(val, set, undefined, { length: Infinity });
      vtu.expectValidatorSuccess(val, set, undefined, { length: -Infinity });
      vtu.expectValidatorSuccess(val, set, undefined, {
        length: Number.POSITIVE_INFINITY,
      });
      vtu.expectValidatorSuccess(val, set, undefined, {
        length: Number.NEGATIVE_INFINITY,
      });
    });

    it('checks for values with specified typeset', () => {
      let set = new Set(['one', 'two', 'three']);

      vtu.expectValidatorSuccess(val, set, undefined, {
        $values: types.STRING,
      });

      let args = { $values: types.BOOLEAN };
      vtu.expectValidatorError(val, set, undefined, args, {
        path: ['"one"'],
        mismatch: [qualifiers.REQUIRED, types.BOOLEAN],
      });

      set = new Set(['one', 'two', '']);

      args = {
        $values: types.STRING, // required by default, so will fail
      };
      vtu.expectValidatorError(val, set, undefined, args, {
        path: ['""'],
        mismatch: [qualifiers.REQUIRED, types.STRING],
      });

      vtu.expectValidatorSuccess(val, set, undefined, {
        $values: [qualifiers.EXPECTED, types.STRING],
      });

      set = new Set([new Set(['1']), new Set(['2']), new Set(['3'])]);

      vtu.expectValidatorSuccess(val, set, undefined, {
        $values: [
          types.SET,
          {
            $keys: types.STRING, // ignored: sets don't have keys
          },
        ],
      });

      vtu.expectValidatorSuccess(val, set, undefined, {
        $values: [
          types.SET,
          {
            $values: types.STRING,
          },
        ],
      });

      args = {
        $values: [
          types.SET,
          {
            length: 2, // nested sets do not have length >= 2 so this should fail
            $values: types.STRING,
          },
        ],
      };
      vtu.expectValidatorError(val, set, undefined, args, {
        path: [print(set.values().next().value)],
        mismatch: [qualifiers.REQUIRED, ...args.$values],
      });
    });

    vtu.getFalsyValues().forEach((falsyValue) => {
      it(`ignores unspecified $values shape property typesets set to falsy value |${print(
        falsyValue
      )}|`, () => {
        const set = new Set([
          { number: 1, string: true },
          { number: 2, string: false },
          { number: 3, string: true },
        ]);

        const args = {
          $values: {
            number: types.NUMBER,
            string: falsyValue,
          },
        };

        vtu.expectValidatorSuccess(val, set, undefined, args);
      });
    });
  });

  describe('context', () => {
    it('should set parent to Set and parentKey to undefined', () => {
      const validator = jest.fn();
      const value = new Set(['bar']);
      val.validate(value, undefined, { $values: validator });

      expect(validator).toHaveBeenCalledTimes(1);
      expect(validator.mock.calls[0]).toEqual([
        'bar',
        [qualifiers.REQUIRED, types.ANY],
        validator,
        { originalValue: value, parent: value, parentKey: undefined },
      ]);
    });
  });

  // Minimum Viable Value
  describe('mvv', () => {
    it('interprets original value as Set', () => {
      const value = new Set([1, 2]);
      const result = val.validate(value);
      expect(result.mvv).not.toBe(value);
      expect(isSet(result.mvv)).toBe(true);
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
      const set = new Set([
        { value: 1, foo: 1 },
        { value: 2, foo: 2 },
      ]);

      const result = val.validate(set, undefined, {
        $values: {
          value: types.SAFE_INT,
        },
      });

      expect(Array.from(result.mvv.values())).toEqual([
        { value: 1 },
        { value: 2 },
      ]);
    });
  });
});
