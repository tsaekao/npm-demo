import _ from 'lodash';

import '../../../src/rtv'; // make sure all validators we might use in typesets get configured
import * as vtu from '../validationTestUtil';
import { print } from '../../../src/lib/util';
import { types } from '../../../src/lib/types';
import { qualifiers } from '../../../src/lib/qualifiers';
import { check as isPlainObject } from '../../../src/lib/validation/isPlainObject';
import * as val from '../../../src/lib/validator/valObject';

/* eslint-disable no-new-wrappers */

describe('module: lib/validator/valObject', () => {
  describe('validator', () => {
    // module, and value only
    it('#type', () => {
      expect(val.type).toBe(types.OBJECT);
    });

    it('succeeds with an RtvSuccess', () => {
      vtu.expectValidatorSuccess(val, {});
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
    let checkStub;

    beforeEach(() => {
      checkStub = jest.spyOn(val._impl, 'check');
    });

    afterEach(() => {
      checkStub.mockRestore();
    });

    it('should ignore args.$ if not a shape', () => {
      vtu.expectValidatorSuccess(val, { foo: 3 }, {});
      expect(checkStub).not.toHaveBeenCalled();
      checkStub.mockClear();

      vtu.expectValidatorSuccess(val, { foo: 3 }, { $: undefined });
      expect(checkStub).not.toHaveBeenCalled();
      checkStub.mockClear();

      vtu.expectValidatorSuccess(val, { foo: 3 }, { $: null });
      expect(checkStub).not.toHaveBeenCalled();
      checkStub.mockClear();

      vtu.expectValidatorSuccess(val, { foo: 3 }, { $: [3] });
      expect(checkStub).not.toHaveBeenCalled();
      checkStub.mockClear();
    });

    it('should check value against shape', () => {
      vtu.expectValidatorSuccess(val, { foo: 3 }, undefined, {
        $: { foo: types.FINITE },
      });
      expect(checkStub).toHaveBeenCalled();
      checkStub.mockClear();

      vtu.expectValidatorError(
        val,
        { foo: 3 },
        undefined,
        { $: { foo: types.STRING } },
        {
          typeset: { foo: types.STRING },
          mismatch: [qualifiers.REQUIRED, types.STRING],
          path: ['foo'],
        }
      );
      expect(checkStub).toHaveBeenCalled();
      checkStub.mockClear();
    });

    it('should require exact own-properties if exact=true', () => {
      const obj = { foo: 1, bar: true };
      const args = { $: { foo: types.NUMBER } };

      // by default, exact=false
      vtu.expectValidatorSuccess(val, obj, undefined, args);

      args.exact = true;
      vtu.expectValidatorError(val, obj, undefined, args);
    });

    it('should require an empty object if shape is empty and exact=true', () => {
      vtu.expectValidatorError(val, { foo: 1 }, undefined, {
        $: {},
        exact: true,
      });
    });
  });

  describe('context', () => {
    it('should set parent to object and parentKey to property', () => {
      const validator = jest.fn();
      const shape = {
        foo: validator,
      };
      const value = {
        foo: 'bar',
      };
      val.validate(value, undefined, { $: shape });

      expect(validator).toHaveBeenCalledTimes(1);
      expect(validator.mock.calls[0]).toEqual([
        'bar',
        [qualifiers.REQUIRED, types.ANY],
        validator,
        { originalValue: value, parent: value, parentKey: 'foo' },
      ]);
    });

    it('should check for exact shapes if exactShapes=true', () => {
      const obj = { foo: 1, bar: true, baz: 'a' };
      const args = { $: { foo: types.NUMBER } };
      const context = {};

      // by default, exactShapes=false
      vtu.expectValidatorSuccess(val, obj, undefined, args, context);

      context.options = {}; // still default as false
      vtu.expectValidatorSuccess(val, obj, undefined, args, context);

      context.options.exactShapes = true;
      vtu.expectValidatorError(
        val,
        obj,
        undefined,
        args,
        { rootCause: "Found unexpected properties in value: 'bar', 'baz'" },
        context
      );
    });

    it('should NOT check for exact shapes if exactShapes=false', () => {
      const args = { $: { foo: types.NUMBER } };

      vtu.expectValidatorError(
        val,
        null, // value to check
        undefined, // default qualifier
        args,
        { rootCause: false } // NO rootCause
      );

      vtu.expectValidatorError(
        val,
        {}, // value to check
        undefined, // default qualifier
        args,
        {
          typeset: args.$,
          mismatch: [qualifiers.REQUIRED, types.NUMBER],
          path: ['foo'],
          rootCause: false, // NO rootCause
        }
      );
    });

    it('should NOT check for exact shapes if exactShapes=true but shape NOT specified', () => {
      const args = {};
      const context = {
        options: {
          exactShapes: true,
        },
      };

      vtu.expectValidatorSuccess(
        val,
        { foo: 123 }, // value to check
        undefined, // default qualifier
        args,
        context
      );
    });

    it('should allow args.exact to override exactShapes=true', () => {
      let context = { options: { exactShapes: true } };
      let obj = { foo: 1, bar: true };
      let args = { $: { foo: types.NUMBER }, exact: false };

      // exact=false overrides exactShapes=true
      vtu.expectValidatorSuccess(val, obj, undefined, args, context);

      // exact=true overrides exactShapes=false
      args.exact = true;
      context.options.exactShapes = false;
      vtu.expectValidatorError(val, obj, undefined, args, undefined, context);

      // deep override
      context = { exactShapes: true }; // all shapes, nested included, must be exact
      obj = {
        foo: 1,
        bar: true,
        baz: { one: 1, two: 2 },
      };
      args = {
        $: {
          foo: types.NUMBER,
          bar: types.BOOLEAN,
          baz: [
            types.OBJECT,
            {
              $: { one: types.NUMBER },
              exact: false, // override exactShapes=true such that obj.baz validates
            },
          ],
        },
        // exact=false by default, therefore shape must be exact because of exactShapes=true
      };
      vtu.expectValidatorSuccess(val, obj, undefined, args, context);
    });

    vtu.getFalsyValues().forEach((falsyValue) => {
      it(`ignores unspecified shape property typesets set to falsy value |${print(
        falsyValue
      )}|`, () => {
        const args = { $: { foo: types.NUMBER, bar: undefined } };

        vtu.expectValidatorSuccess(
          val,
          { foo: 123 }, // value to check
          undefined, // default qualifier
          args
        );
      });
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
          $: {
            one: { foo: types.SAFE_INT },
          },
        }
      );

      expect(result.mvv).toEqual({ one: { foo: 1 } });
    });
  });
});
