import _ from 'lodash';

import '../../../src/rtv'; // make sure all validators we might use in typesets get configured
import * as vtu from '../validationTestUtil';
import { print } from '../../../src/lib/util';
import { types } from '../../../src/lib/types';
import { qualifiers } from '../../../src/lib/qualifiers';
import { check as isPlainObject } from '../../../src/lib/validation/isPlainObject';
import * as val from '../../../src/lib/validator/valHashMap';

/* eslint-disable no-new-wrappers */

describe('module: lib/validator/valHashMap', () => {
  describe('validator', () => {
    // module, and value only
    it('#type', () => {
      expect(val.type).toBe(types.HASH_MAP);
    });

    it('succeeds with an RtvSuccess', () => {
      vtu.expectValidatorSuccess(val, { foo: 'bar' });
    });

    it('valid values', () => {
      expect(vtu.testValues(val.type, val.validate).failures).toEqual([]);
    });

    it('other types/values', () => {
      const validValues = vtu.getValidValues(); // @type {Object}
      const validTypes = Object.keys(validValues); // @type {Array}
      const overlaps = [
        types.ANY_OBJECT,
        types.OBJECT,
        types.PLAIN_OBJECT,
        types.CLASS_OBJECT,
        types.HASH_MAP,
      ];

      // remove overlaps
      _.pullAll(validTypes, overlaps);

      let invalidValues = [];
      _.forEach(validTypes, function (type) {
        invalidValues = invalidValues.concat(validValues[type]);
      });

      // add some non-overlap values back in
      invalidValues = invalidValues.concat([
        new String('new-string'),
        new Boolean(true),
        new Boolean(false),
        new Number(1),
      ]);

      // nothing should pass
      expect(
        vtu.testValues(val.type, val.validate, invalidValues).passes
      ).toEqual([]);
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
    let map;

    beforeEach(() => {
      map = {
        1: 'one',
        2: 'two',
        3: 'three',
      };
    });

    it('checks for an exact length', () => {
      vtu.expectValidatorSuccess(val, {}, undefined, { length: 0 });
      vtu.expectValidatorSuccess(val, map, undefined, { length: 3 });

      vtu.expectValidatorError(val, map, undefined, { length: 2 });
      vtu.expectValidatorError(val, map, undefined, { length: 1.1 });
      vtu.expectValidatorError(val, map, undefined, { length: -0 });

      // all these lengths should be ignored
      vtu.expectValidatorSuccess(val, map, undefined, { length: '1' });
      vtu.expectValidatorSuccess(val, map, undefined, { length: -1 });
      vtu.expectValidatorSuccess(val, map, undefined, { length: NaN });
      vtu.expectValidatorSuccess(val, map, undefined, { length: Infinity });
      vtu.expectValidatorSuccess(val, map, undefined, { length: -Infinity });
      vtu.expectValidatorSuccess(val, map, undefined, {
        length: Number.POSITIVE_INFINITY,
      });
      vtu.expectValidatorSuccess(val, map, undefined, {
        length: Number.NEGATIVE_INFINITY,
      });
    });

    it('checks for string keys that match a pattern', () => {
      map = { key1: 1, key2: 2 };

      vtu.expectValidatorSuccess(val, map, undefined, {
        keyExp: 'key\\d',
      });
      vtu.expectValidatorSuccess(val, map, undefined, {
        keyExp: function () {}, // ignored: not string
      });

      vtu.expectValidatorSuccess(val, map, undefined, {
        keyExp: 'KEY\\d',
        keyFlags: 'i', // case-insensitive flag
      });

      let args = {
        keyExp: 'KEY\\d',
      };
      vtu.expectValidatorError(val, map, undefined, args, {
        path: ['key="key1"'],
        mismatch: [qualifiers.REQUIRED, types.HASH_MAP, args],
      }); // case-sensitive by default

      args = {
        keyExp: 'KEY\\d',
        keyFlags: {}, // ignored: not string (so still case-sensitive)
      };
      vtu.expectValidatorError(val, map, undefined, args, {
        path: ['key="key1"'],
        mismatch: [qualifiers.REQUIRED, types.HASH_MAP, args],
      });
    });

    it('checks for values with specified typeset', () => {
      vtu.expectValidatorSuccess(val, map, undefined, {
        $values: types.STRING,
      });

      let args = { $values: types.BOOLEAN };
      vtu.expectValidatorError(val, map, undefined, args, {
        path: ['valueKey="1"'],
        mismatch: [qualifiers.REQUIRED, types.BOOLEAN],
      });

      map[3] = '';

      args = {
        $values: types.STRING, // required by default, so will fail
      };
      vtu.expectValidatorError(val, map, undefined, args, {
        path: ['valueKey="3"'],
        mismatch: [qualifiers.REQUIRED, types.STRING],
      });

      vtu.expectValidatorSuccess(val, map, undefined, {
        $values: [qualifiers.EXPECTED, types.STRING],
      });
    });

    it('checks for keys and values with specified typeset', () => {
      map[1] = { a: true };
      map[2] = { b: false };
      map[3] = { c: true };

      vtu.expectValidatorSuccess(val, map, undefined, {
        keyExp: '\\d',
        $values: [
          types.HASH_MAP,
          {
            keyExp: '\\w',
            $values: types.BOOLEAN,
          },
        ],
      });

      // keys in nested maps are not strings of >= 2 word chars
      const valuesTypeset = [
        types.HASH_MAP,
        {
          keyExp: '\\w{2,}',
          $values: types.BOOLEAN,
        },
      ];
      const args = {
        keyExp: '\\d',
        $values: valuesTypeset,
      };
      vtu.expectValidatorError(val, map, undefined, args, {
        path: ['valueKey="1"', 'key="a"'],
        mismatch: [qualifiers.REQUIRED, types.HASH_MAP, valuesTypeset[1]],
      });
    });

    it('recurses into nested hash maps when deep=true', () => {
      map[0] = {
        4: 'four',
        5: 'five',
        6: 'six',
      };
      const args = {
        keyExp: '\\d',
        $values: types.STRING,
      };

      // this will fail because `map[0]` is an object, not a string
      vtu.expectValidatorError(val, map, undefined, args, {
        path: ['valueKey="0"'],
        mismatch: [qualifiers.REQUIRED, types.STRING],
      });

      // now it will succeed because we enable `deep` and `map[0]` is another
      //  hash map with the same structure as its parent
      args.deep = true;
      vtu.expectValidatorSuccess(val, map, undefined, args);
    });

    it('only recurses into nested hash maps when deep=true', () => {
      map[0] = [4, 5, 6];
      const args = {
        deep: true,
        keyExp: '\\d',
        $values: types.STRING,
      };

      // this will fail because `map[0]` is not a hash map
      vtu.expectValidatorError(val, map, undefined, args, {
        path: ['valueKey="0"'],
        mismatch: [qualifiers.REQUIRED, types.HASH_MAP, args],
      });
    });

    vtu.getFalsyValues().forEach((falsyValue) => {
      it(`ignores unspecified $values shape property typesets set to falsy value |${print(
        falsyValue
      )}|`, () => {
        map = {
          one: { number: 1, string: true },
          two: { number: 2, string: false },
          three: { number: 3, string: true },
        };

        const args = {
          $values: {
            number: types.NUMBER,
            string: falsyValue,
          },
        };

        vtu.expectValidatorSuccess(val, map, undefined, args);
      });
    });
  });

  describe('context', () => {
    it('should set parent to object and parentKey to property', () => {
      const validator = jest.fn();
      const value = {
        foo: 'bar',
      };
      val.validate(value, undefined, { $values: validator });

      expect(validator).toHaveBeenCalledTimes(1);
      expect(validator.mock.calls[0]).toEqual([
        'bar',
        [qualifiers.REQUIRED, types.ANY],
        validator,
        { originalValue: value, parent: value, parentKey: 'foo' },
      ]);
    });
  });

  // Minimum Viable Value
  describe('mvv', () => {
    it('interprets original value as plain object', () => {
      const value = new Object();
      const result = val.validate(value);
      expect(result.mvv).not.toBe(value);
      expect(isPlainObject(result.mvv)).toBe(true);
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
        { one: { foo: 1, bar: 1 }, two: { foo: 2, bar: 2 } },
        undefined,
        {
          $values: { foo: types.SAFE_INT },
        }
      );

      expect(result.mvv).toEqual({ one: { foo: 1 }, two: { foo: 2 } });
    });
  });
});
