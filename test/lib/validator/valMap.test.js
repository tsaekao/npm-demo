import { expect } from 'chai';
import sinon from 'sinon';

import * as vtu from '../validationTestUtil';
import { print } from '../../../src/lib/util';
import { types } from '../../../src/lib/types';
import { qualifiers } from '../../../src/lib/qualifiers';
import { check as isMap } from '../../../src/lib/validation/isMap';
import * as val from '../../../src/lib/validator/valMap';

describe('module: lib/validator/valMap', function () {
  describe('validator', function () {
    // module, and value only
    it('#type', function () {
      expect(val.type).to.equal(types.MAP);
    });

    it('succeeds with an RtvSuccess', function () {
      vtu.expectValidatorSuccess(val, new Map());
    });

    it('valid values', function () {
      expect(vtu.testValues(val.type, val.validate).failures).to.eql([]);
    });

    it('other types/values', function () {
      expect(vtu.testOtherValues(val.type, val.validate)).to.eql([]);
    });
  });

  describe('qualifiers', function () {
    describe('rules are supported', function () {
      it('REQUIRED (other than values previously tested)', function () {
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

      it('EXPECTED', function () {
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

      it('OPTIONAL', function () {
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

      it('TRUTHY', function () {
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

    describe('are used in error typesets', function () {
      it('DEFAULT', function () {
        vtu.expectValidatorError(val, 1); // default should be REQUIRED
      });

      it('REQUIRED', function () {
        vtu.expectValidatorError(val, 1, qualifiers.REQUIRED);
      });

      it('EXPECTED', function () {
        vtu.expectValidatorError(val, 1, qualifiers.EXPECTED);
      });

      it('OPTIONAL', function () {
        vtu.expectValidatorError(val, 1, qualifiers.OPTIONAL);
      });

      it('TRUTHY', function () {
        vtu.expectValidatorError(val, 1, qualifiers.TRUTHY);
      });
    });
  });

  describe('arguments', function () {
    it('checks for an exact length', function () {
      const map = new Map([
        [1, 'one'],
        [2, 'two'],
        [3, 'three'],
      ]);

      vtu.expectValidatorSuccess(val, new Map(), undefined, { length: 0 });
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

    it('checks for keys with specified typeset', function () {
      const map = new Map([
        [1, 'one'],
        [2, 'two'],
        [3, 'three'],
      ]);

      vtu.expectValidatorSuccess(val, map, undefined, { $keys: types.FINITE });

      vtu.expectValidatorError(
        val,
        map,
        undefined,
        { $keys: types.STRING },
        {
          path: ['key=1'],
          mismatch: [qualifiers.REQUIRED, types.STRING],
        }
      );

      vtu.expectValidatorSuccess(val, new Map(), undefined, {
        $keys: types.REGEXP,
      });
    });

    it('checks for string keys that match a pattern', function () {
      let map = new Map([
        [1, 'one'],
        [2, 'two'],
      ]);

      vtu.expectValidatorSuccess(val, map, undefined, {
        $keys: types.FINITE,
        keyExp: 'key', // ignored: keys aren't expected to be strings
      });

      map = new Map([
        ['key1', 1],
        ['key2', 2],
      ]);
      let args = { $keys: types.FINITE };

      vtu.expectValidatorError(val, map, undefined, args, {
        path: ['key="key1"'],
        mismatch: [qualifiers.REQUIRED, types.FINITE],
      }); // keys are not numbers in this map

      vtu.expectValidatorSuccess(val, map, undefined, {
        $keys: types.STRING,
        keyExp: 'key\\d',
      });
      vtu.expectValidatorSuccess(val, map, undefined, {
        $keys: types.STRING,
        keyExp: function () {}, // ignored: not string
      });
      vtu.expectValidatorSuccess(val, map, undefined, {
        $keys: [types.STRING],
        keyExp: 'key\\d',
      });
      vtu.expectValidatorSuccess(val, map, undefined, {
        $keys: [qualifiers.EXPECTED, types.STRING],
        keyExp: 'key\\d',
      });

      args = {
        $keys: [qualifiers.EXPECTED, types.STRING],
        keyExp: 'KEY\\d',
      };
      vtu.expectValidatorError(val, map, undefined, args, {
        path: ['key="key1"'],
        mismatch: [qualifiers.REQUIRED, types.MAP, args],
      }); // case-sensitive by default

      vtu.expectValidatorSuccess(val, map, undefined, {
        $keys: [qualifiers.EXPECTED, types.STRING],
        keyExp: 'KEY\\d',
        keyFlags: 'i', // case-insensitive flag
      });

      args = {
        $keys: [qualifiers.EXPECTED, types.STRING],
        keyExp: 'KEY\\d',
        keyFlags: {}, // ignored: not string (so still case-sensitive)
      };
      vtu.expectValidatorError(val, map, undefined, args, {
        path: ['key="key1"'],
        mismatch: [qualifiers.REQUIRED, types.MAP, args],
      });
    });

    it('checks for values with specified typeset', function () {
      let map = new Map([
        [1, 'one'],
        [2, 'two'],
        [3, 'three'],
      ]);

      vtu.expectValidatorSuccess(val, map, undefined, {
        $values: types.STRING,
      });

      let args = { $values: types.BOOLEAN };
      vtu.expectValidatorError(val, map, undefined, args, {
        path: ['valueKey=1'],
        mismatch: [qualifiers.REQUIRED, types.BOOLEAN],
      });

      map = new Map([
        [1, 'one'],
        [2, 'two'],
        [3, ''],
      ]);

      args = {
        $values: types.STRING, // required by default, so will fail
      };
      vtu.expectValidatorError(val, map, undefined, args, {
        path: ['valueKey=3'],
        mismatch: [qualifiers.REQUIRED, types.STRING],
      });

      vtu.expectValidatorSuccess(val, map, undefined, {
        $values: [qualifiers.EXPECTED, types.STRING],
      });
    });

    it('checks for keys and values with specified typeset', function () {
      const map = new Map([
        [1, new Map([['a', true]])],
        [2, new Map([['b', false]])],
        [3, new Map([['c', true]])],
      ]);

      vtu.expectValidatorSuccess(val, map, undefined, {
        $keys: types.FINITE,
        $values: [
          types.MAP,
          {
            $keys: types.STRING,
            $values: types.BOOLEAN,
          },
        ],
      });

      // keys in nested maps are not strings of >= 2 chars
      const valuesTypeset = [
        types.MAP,
        {
          $keys: [types.STRING, { min: 2 }],
          $values: types.BOOLEAN,
        },
      ];
      const args = {
        $keys: types.FINITE,
        $values: valuesTypeset,
      };
      vtu.expectValidatorError(val, map, undefined, args, {
        path: ['valueKey=1', 'key="a"'],
        mismatch: [qualifiers.REQUIRED, types.STRING, { min: 2 }],
      });
    });

    vtu.getFalsyValues().forEach((falsyValue) => {
      it(`ignores unspecified $values shape property typesets set to falsy value |${print(
        falsyValue
      )}|`, () => {
        const map = new Map([
          [
            { keyNumber: 1, keyString: true },
            { valueNumber: 1, valueString: true },
          ],
          [
            { keyNumber: 2, keyString: false },
            { valueNumber: 2, valueString: false },
          ],
          [
            { keyNumber: 3, keyString: true },
            { valueNumber: 3, valueString: true },
          ],
        ]);

        const args = {
          $keys: {
            keyNumber: types.NUMBER,
            keyString: falsyValue,
          },
          $values: {
            valueNumber: types.NUMBER,
            valueString: falsyValue,
          },
        };

        vtu.expectValidatorSuccess(val, map, undefined, args);
      });
    });
  });

  describe('context', function () {
    it('should set parent to Map and parentKey to undefined for keys', function () {
      const validator = sinon.spy();
      const value = new Map([['key', 'bar']]);
      val.validate(value, undefined, { $keys: validator });

      expect(validator.callCount).to.equal(1);
      expect(validator.firstCall.args).to.eql([
        'key',
        [qualifiers.REQUIRED, types.ANY],
        validator,
        { originalValue: value, parent: value, parentKey: undefined },
      ]);
    });

    it('should set parent to Map and parentKey to key for values', function () {
      const validator = sinon.spy();
      const value = new Map([['key', 'bar']]);
      val.validate(value, undefined, { $values: validator });

      expect(validator.callCount).to.equal(1);
      expect(validator.firstCall.args).to.eql([
        'bar',
        [qualifiers.REQUIRED, types.ANY],
        validator,
        { originalValue: value, parent: value, parentKey: 'key' },
      ]);
    });
  });

  // Minimum Viable Value
  describe('mvv', () => {
    it('interprets original value as Map', () => {
      const value = new Map([['key', 'value']]);
      const result = val.validate(value);
      expect(result.mvv).not.to.be.equal(value);
      expect(isMap(result.mvv)).to.be.true;
    });

    it('interprets falsy values verbatim', () => {
      vtu.getFalsyValues().forEach((falsyValue) => {
        const result = val.validate(falsyValue, qualifiers.TRUTHY);
        if (isNaN(falsyValue)) {
          expect(isNaN(result.mvv), `${print(falsyValue)} verbatim`).to.be.true;
        } else {
          expect(result.mvv, `${print(falsyValue)} verbatim`).to.equal(
            falsyValue
          );
        }
      });
    });

    it('reduces the original value', () => {
      const map = new Map([
        [
          { key: 1, foo: 1 },
          { value: 1, foo: 1 },
        ],
        [
          { key: 2, foo: 2 },
          { value: 2, foo: 2 },
        ],
      ]);

      const result = val.validate(map, undefined, {
        $keys: {
          key: types.SAFE_INT,
        },
        $values: {
          value: types.SAFE_INT,
        },
      });

      expect(Array.from(result.mvv.entries())).to.eql([
        [{ key: 1 }, { value: 1 }],
        [{ key: 2 }, { value: 2 }],
      ]);
    });
  });
});
