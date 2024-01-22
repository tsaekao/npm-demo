import _ from 'lodash';

import '../../../src/rtv'; // make sure all validators we might use in typesets get configured
import * as vtu from '../validationTestUtil';
import { print } from '../../../src/lib/util';
import { types } from '../../../src/lib/types';
import { qualifiers } from '../../../src/lib/qualifiers';
import { check as isPlainObject } from '../../../src/lib/validation/isPlainObject';
import * as val from '../../../src/lib/validator/valClassObject';

/* eslint-disable no-new-wrappers */

class Shape {
  constructor(name = 'shape') {
    this.name = name;
    this.color = 0x00ff00; // green
  }
}

class Rectangle extends Shape {
  constructor() {
    super('rectangle');
  }
}

describe('module: lib/validator/valClassObject', () => {
  let classObject;

  beforeEach(() => {
    classObject = new Rectangle();
  });

  describe('validator', () => {
    // module, and value only
    it('#type', () => {
      expect(val.type).toBe(types.CLASS_OBJECT);
    });

    it('succeeds with an RtvSuccess', () => {
      vtu.expectValidatorSuccess(val, classObject);
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
        new Object(),
        Object.create(null),
        {},
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

    it('should ignore args.ctor if not a function', () => {
      vtu.expectValidatorSuccess(val, classObject, undefined, { ctor: 3 });
    });

    it('should require being an instanceof args.ctor', () => {
      vtu.expectValidatorSuccess(val, classObject, undefined, { ctor: Shape });

      vtu.expectValidatorError(val, classObject, undefined, {
        ctor: class {},
      });
    });

    it('should ignore args.$ if not a shape', () => {
      vtu.expectValidatorSuccess(val, classObject, {});
      expect(checkStub).not.toHaveBeenCalled();
      checkStub.mockClear();

      vtu.expectValidatorSuccess(val, classObject, { $: undefined });
      expect(checkStub).not.toHaveBeenCalled();
      checkStub.mockClear();

      vtu.expectValidatorSuccess(val, classObject, { $: null });
      expect(checkStub).not.toHaveBeenCalled();
      checkStub.mockClear();

      vtu.expectValidatorSuccess(val, classObject, { $: [3] });
      expect(checkStub).not.toHaveBeenCalled();
      checkStub.mockClear();
    });

    it('should check value against shape', () => {
      vtu.expectValidatorSuccess(val, classObject, undefined, {
        $: { name: types.STRING },
      });
      expect(checkStub).toHaveBeenCalled();
      checkStub.mockClear();

      vtu.expectValidatorError(
        val,
        classObject,
        undefined,
        {
          $: { name: types.INT },
        },
        {
          mismatch: [qualifiers.REQUIRED, types.INT],
          path: ['name'],
        }
      );
      expect(checkStub).toHaveBeenCalled();
      checkStub.mockClear();
    });

    it('should not check args.$ if not an instanceof args.ctor', () => {
      vtu.expectValidatorError(val, classObject, undefined, {
        ctor: class {}, // this will fail
        $: { name: types.STRING }, // shape would match
      });
      expect(checkStub).not.toHaveBeenCalled();
      checkStub.mockClear();
    });

    it('should require exact own-properties if exact=true', () => {
      const args = { $: { name: types.STRING } };

      // by default, exact=false
      vtu.expectValidatorSuccess(val, classObject, undefined, args);

      // cause failure because of extra `color` property
      args.exact = true;
      vtu.expectValidatorError(val, classObject, undefined, args);
    });

    it('should require an empty object if shape is empty and exact=true', () => {
      vtu.expectValidatorError(val, classObject, undefined, {
        $: {},
        exact: true,
      });
    });
  });

  describe('context', () => {
    it('should set parent to object and parentKey to property', () => {
      const validator = jest.fn();
      const shape = {
        name: validator,
      };
      val.validate(classObject, undefined, { $: shape });

      expect(validator).toHaveBeenCalledTimes(1);
      expect(validator.mock.calls[0]).toEqual([
        classObject.name,
        [qualifiers.REQUIRED, types.ANY],
        validator,
        { originalValue: classObject, parent: classObject, parentKey: 'name' },
      ]);
    });

    it('should check for exact shapes if exactShapes=true', () => {
      const args = { $: { name: types.STRING } };
      const context = {};

      // by default, exactShapes=false
      vtu.expectValidatorSuccess(val, classObject, undefined, args, context);

      context.options = {}; // still default as false
      vtu.expectValidatorSuccess(val, classObject, undefined, args, context);

      context.options.exactShapes = true;
      vtu.expectValidatorError(
        val,
        classObject,
        undefined,
        args,
        { rootCause: "Found unexpected properties in value: 'color'" },
        context
      );
    });

    it('should NOT check for exact shapes if exactShapes=false', () => {
      const args = { $: { type: types.STRING } };

      vtu.expectValidatorError(
        val,
        null, // value to check
        undefined, // default qualifier
        args,
        { rootCause: false } // NO rootCause
      );

      vtu.expectValidatorError(
        val,
        classObject, // value to check
        undefined, // default qualifier
        args,
        {
          mismatch: [qualifiers.REQUIRED, types.STRING],
          path: ['type'],
          rootCause: false, // NO rootCause
        }
      );
    });

    it('should NOT check for exact shapes if exactShapes=true but shape NOT specified', () => {
      const args = { ctor: Rectangle };
      const context = {
        options: {
          exactShapes: true,
        },
      };

      vtu.expectValidatorSuccess(
        val,
        classObject,
        undefined, // default qualifier
        args,
        context
      );
    });

    it('should allow args.exact to override exactShapes=true', () => {
      let context = { options: { exactShapes: true } };
      let args = { $: { name: types.STRING }, exact: false };

      // exact=false overrides exactShapes=true
      vtu.expectValidatorSuccess(val, classObject, undefined, args, context);

      // exact=true overrides exactShapes=false
      // cause failure because of extra `color` property
      args.exact = true;
      context.options.exactShapes = false;
      vtu.expectValidatorError(
        val,
        classObject,
        undefined,
        args,
        undefined,
        context
      );

      // deep override
      context = { exactShapes: true }; // all shapes, nested included, must be exact
      classObject.other = { one: 1, two: 2 };
      args = {
        $: {
          name: types.STRING,
          color: types.NUMBER,
          other: [
            types.OBJECT,
            {
              $: { one: types.NUMBER },
              exact: false, // override exactShapes=true such that obj.baz validates
            },
          ],
        },
        // exact=false by default, therefore shape must be exact because of exactShapes=true
      };
      vtu.expectValidatorSuccess(val, classObject, undefined, args, context);
    });

    vtu.getFalsyValues().forEach((falsyValue) => {
      it(`ignores unspecified shape property typesets set to falsy value |${print(
        falsyValue
      )}|`, () => {
        const args = { $: { width: types.NUMBER, bar: undefined } };
        classObject.width = 7;

        vtu.expectValidatorSuccess(
          val,
          classObject, // value to check
          undefined, // default qualifier
          args
        );
      });
    });
  });

  // Minimum Viable Value
  describe('mvv', () => {
    class TestClass {
      constructor(props = {}) {
        Object.entries(props).forEach(([key, value]) => {
          this[key] = value;
        });
      }
    }

    it('interprets original value as plain object', () => {
      const value = new TestClass();
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
      const prop = 'property';
      const result = val.validate(new TestClass({ prop, foo: 1 }), undefined, {
        $: { prop: types.STRING },
      });

      expect(result.mvv).toEqual({ prop });
    });
  });
});
