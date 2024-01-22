import '../../src/rtv';
import * as impl from '../../src/lib/impl';
import { DEFAULT_OBJECT_TYPE, types } from '../../src/lib/types';
import { DEFAULT_QUALIFIER, qualifiers } from '../../src/lib/qualifiers';
import { RtvSuccess } from '../../src/lib/RtvSuccess';
import { RtvError } from '../../src/lib/RtvError';
import { check as isObject } from '../../src/lib/validation/isObject';
import { check as isFunction } from '../../src/lib/validation/isFunction';
import * as isTypesetMod from '../../src/lib/validation/isTypeset';
import * as isAnyMod from '../../src/lib/validation/isAny';
import * as vtu from './validationTestUtil';

describe('module: lib/impl', () => {
  describe('._validatorMap', () => {
    it('should map all known types', () => {
      expect(isObject(impl._validatorMap)).toBe(true);
      expect(Object.keys(impl._validatorMap).length).toBe(26); // # of known types
    });
  });

  describe('#_registerType()', () => {
    const errorRE = /Cannot register an invalid validator/;
    let validator;
    let stringValidator;

    beforeEach(() => {
      stringValidator = impl._validatorMap[types.STRING];
      validator = {
        type: types.STRING,
        config: function () {},
        default: function () {},
      };
    });

    afterEach(() => {
      impl._validatorMap[types.STRING] = stringValidator;
    });

    it('should be a function', () => {
      expect(isFunction(impl._registerType)).toBe(true);
    });

    it('should throw if validator is invalid: not an object', () => {
      expect(impl._registerType.bind(impl, 'foo')).toThrow(errorRE);
    });

    it('should throw if validator is invalid: unknown type', () => {
      validator.type = 'unknown';
      expect(impl._registerType.bind(impl, validator)).toThrow(errorRE);
    });

    it('should throw if validator is invalid: missing .type', () => {
      delete validator.type;
      expect(impl._registerType.bind(impl, validator)).toThrow(errorRE);
    });

    it('should throw if validator is invalid: missing #config()', () => {
      validator.config = 123;
      expect(impl._registerType.bind(impl, validator)).toThrow(errorRE);
    });

    it('should throw if validator is invalid: missing #validate()', () => {
      validator.validate = 123;
      expect(impl._registerType.bind(impl, validator)).toThrow(errorRE);
    });
  });

  describe('#getQualifier()', () => {
    it('should not require a valid typeset', () => {
      expect(function () {
        impl.getQualifier(true);
      }).not.toThrow();
    });

    it('should assume the default qualifier for an invalid typeset', () => {
      expect(impl.getQualifier(/invalid/)).toBe(DEFAULT_QUALIFIER);
    });

    it('should use the default qualifier if none specified', () => {
      expect(impl.getQualifier({})).toBe(DEFAULT_QUALIFIER);
      expect(impl.getQualifier([types.STRING])).toBe(DEFAULT_QUALIFIER);
    });

    it('should return specified qualifier', () => {
      expect(impl.getQualifier([qualifiers.OPTIONAL, types.STRING])).toBe(
        qualifiers.OPTIONAL
      );
    });
  });

  describe('#toTypeset()', () => {
    describe('Exceptions', () => {
      it('should throw if given an invalid type', () => {
        expect(function () {
          impl.toTypeset('invalid-type');
        }).toThrow(/Invalid value for "types" enumeration/);
      });

      it('should throw if given an invalid qualifier', () => {
        expect(function () {
          impl.toTypeset(types.BOOLEAN, 'invalid-qualifier');
        }).toThrow(/Invalid value for "qualifiers" enumeration/);
      });

      it('should throw if args are given for a type that does not take any', () => {
        expect(function () {
          impl.toTypeset(types.BOOLEAN, {});
        }).toThrow(/Invalid value for "argTypes" enumeration/);
      });

      it('should throw if non-undefined, non-boolean falsy value given for args', () => {
        expect(function () {
          impl.toTypeset(types.STRING, 0);
        }).toThrow(/Invalid type args/);

        expect(function () {
          impl.toTypeset(types.STRING, null);
        }).toThrow(/Invalid type args/);

        expect(function () {
          impl.toTypeset(types.STRING, '');
        }).toThrow(/Invalid type args/);

        expect(function () {
          impl.toTypeset(types.STRING, false); // interpreted as fullyQualified option
        }).not.toThrow(/Invalid type args/);

        expect(function () {
          impl.toTypeset(types.STRING, undefined); // ignored
        }).not.toThrow(/Invalid type args/);
      });

      it('should throw if args given twice', () => {
        expect(function () {
          impl.toTypeset(types.STRING, {}, {});
        }).toThrow(/args parameter already specified/);
      });

      it('should throw if parameters in wrong order', () => {
        expect(function () {
          impl.toTypeset(types.STRING, false, {});
        }).toThrow(/Expecting qualifier or args as the second parameter/);

        expect(function () {
          impl.toTypeset(types.STRING, false, DEFAULT_QUALIFIER);
        }).toThrow(/Expecting qualifier or args as the second parameter/);

        expect(function () {
          impl.toTypeset(types.STRING, {}, DEFAULT_QUALIFIER);
        }).toThrow(/args parameter already specified/);
      });

      it('should validate type, qualifier, and args', () => {
        expect(function () {
          impl.toTypeset('foo');
        }).toThrow(/Invalid value for "types" enum/);

        expect(function () {
          impl.toTypeset(types.FINITE, 'foo');
        }).toThrow(/Invalid value for "qualifiers" enum/);

        expect(function () {
          impl.toTypeset(types.FINITE, DEFAULT_QUALIFIER, []);
        }).toThrow(/Invalid type args/);
      });
    });

    describe('optional parameters', () => {
      it('should ignore undefined parameters', () => {
        expect(impl.toTypeset(types.STRING, undefined, true)).toEqual([
          DEFAULT_QUALIFIER,
          types.STRING,
        ]);

        expect(impl.toTypeset(types.STRING, undefined, {})).toEqual([
          types.STRING,
          {},
        ]);

        expect(
          impl.toTypeset(types.STRING, qualifiers.OPTIONAL, undefined, true)
        ).toEqual([qualifiers.OPTIONAL, types.STRING]);

        expect(
          impl.toTypeset(
            types.STRING,
            qualifiers.OPTIONAL,
            undefined,
            undefined,
            {},
            true
          )
        ).toEqual([qualifiers.OPTIONAL, types.STRING, {}]);
      });
    });

    describe('non-qualified', () => {
      let otherQualifiers;

      beforeEach(() => {
        otherQualifiers = qualifiers.$values.filter(
          (q) => q !== DEFAULT_QUALIFIER
        );
      });

      it('should return an array typeset when the qualifier is not the default', () => {
        otherQualifiers.forEach(function (q) {
          expect(impl.toTypeset(types.FINITE, q)).toEqual([q, types.FINITE]);
        });
      });

      it('should return an array typeset when args are specified', () => {
        const args = { max: 3 };

        expect(impl.toTypeset(types.FINITE, args)).toEqual([
          types.FINITE,
          args,
        ]);
        expect(impl.toTypeset(types.FINITE, DEFAULT_QUALIFIER, args)).toEqual([
          types.FINITE,
          args,
        ]);

        otherQualifiers.forEach(function (q) {
          expect(impl.toTypeset(types.FINITE, q, args)).toEqual([
            q,
            types.FINITE,
            args,
          ]);
        });
      });

      it('should return a string typeset if given just a string typeset', () => {
        expect(impl.toTypeset(types.BOOLEAN)).toBe(types.BOOLEAN);
      });

      it('should return just a string typeset when the default qualifier is used', () => {
        expect(impl.toTypeset(types.BOOLEAN, DEFAULT_QUALIFIER)).toBe(
          types.BOOLEAN
        );
      });

      it('should return an Array typeset if not using the default qualifier', () => {
        expect(impl.toTypeset(types.BOOLEAN, qualifiers.EXPECTED)).toEqual([
          qualifiers.EXPECTED,
          types.BOOLEAN,
        ]);
      });

      it('should return an Array typeset when a type and args are provided', () => {
        expect(impl.toTypeset(types.HASH_MAP, { count: 2 })).toEqual([
          types.HASH_MAP,
          { count: 2 },
        ]);
      });

      it('should return an Array typeset given a type, qualifier, and args', () => {
        expect(
          impl.toTypeset(types.PLAIN_OBJECT, qualifiers.OPTIONAL, {})
        ).toEqual([qualifiers.OPTIONAL, types.PLAIN_OBJECT, {}]);
      });
    });

    describe('fully-qualified', () => {
      it('should return an Array typeset given a type', () => {
        expect(impl.toTypeset(types.BOOLEAN, true)).toEqual([
          DEFAULT_QUALIFIER,
          types.BOOLEAN,
        ]);
      });

      it('should return an Array typeset given a type and qualifier', () => {
        expect(impl.toTypeset(types.STRING, qualifiers.EXPECTED, true)).toEqual(
          [qualifiers.EXPECTED, types.STRING]
        );
      });

      it('should return an Array typeset given a type and args', () => {
        expect(impl.toTypeset(types.HASH_MAP, { count: 2 }, true)).toEqual([
          DEFAULT_QUALIFIER,
          types.HASH_MAP,
          { count: 2 },
        ]);
      });

      it('should return an Array typeset given a type, qualifier, and args', () => {
        expect(
          impl.toTypeset(
            types.HASH_MAP,
            qualifiers.OPTIONAL,
            { count: 2 },
            true
          )
        ).toEqual([qualifiers.OPTIONAL, types.HASH_MAP, { count: 2 }]);
      });

      it('should produce fully-qualified typesets', () => {
        // without args
        expect(impl.toTypeset(types.FINITE, true)).toEqual([
          DEFAULT_QUALIFIER,
          types.FINITE,
        ]);
        qualifiers.$values.forEach(function (q) {
          expect(impl.toTypeset(types.FINITE, q, true)).toEqual([
            q,
            types.FINITE,
          ]);
        });

        const args = { max: 3 };
        qualifiers.$values.forEach(function (q) {
          expect(impl.toTypeset(types.FINITE, q, args, true)).toEqual([
            q,
            types.FINITE,
            args,
          ]);
        });
      });
    });
  });

  describe('#fullyQualify()', () => {
    it('should validate the type', () => {
      expect(function () {
        impl.fullyQualify('foo');
      }).toThrow(/Invalid typeset="foo"/);
    });

    it('should validate the qualifier', () => {
      expect(function () {
        impl.fullyQualify(types.STRING, 'foo');
      }).toThrow(/Invalid value for "qualifiers" enum/);
    });

    it('should FQ string typesets', () => {
      expect(impl.fullyQualify(types.STRING)).toEqual([
        DEFAULT_QUALIFIER,
        types.STRING,
      ]);
    });

    it('should FQ object typesets', () => {
      const shape = {};
      const fqts = impl.fullyQualify(shape);
      expect(fqts).toEqual([
        DEFAULT_QUALIFIER,
        DEFAULT_OBJECT_TYPE,
        { $: shape },
      ]);
      expect(fqts[2].$).toBe(shape); // objects within are not cloned
    });

    it('should FQ function typesets', () => {
      const fn = function () {};
      let fqts = impl.fullyQualify(fn);
      expect(fqts).toEqual([DEFAULT_QUALIFIER, types.ANY, fn]);
      expect(fqts[2]).toBe(fn); // objects within are not cloned

      fqts = impl.fullyQualify([fn]);
      expect(fqts).toEqual([DEFAULT_QUALIFIER, types.ANY, fn]);
      expect(fqts[2]).toBe(fn); // objects within are not cloned
    });

    it('should FQ array typesets', () => {
      let ts = [types.FINITE];
      let fqts = impl.fullyQualify(ts);
      expect(ts).not.toBe(fqts); // should be a new array
      expect(fqts).toEqual([DEFAULT_QUALIFIER, types.FINITE]);

      ts = [types.JSON, function (v) {}];
      fqts = impl.fullyQualify(ts);
      expect(ts).not.toBe(fqts); // should be a new array
      expect(fqts).toEqual([DEFAULT_QUALIFIER, types.JSON, ts[1]]);

      ts = [[types.FLOAT]];
      fqts = impl.fullyQualify(ts);
      expect(ts).not.toBe(fqts); // should be a new array
      expect(fqts).toEqual([
        DEFAULT_QUALIFIER,
        types.ARRAY,
        { $: [types.FLOAT] },
      ]); // not deep

      const shape = {};
      ts = [shape];
      fqts = impl.fullyQualify(ts);
      expect(ts).not.toBe(fqts); // should be a new array
      expect(fqts).toEqual([
        DEFAULT_QUALIFIER,
        DEFAULT_OBJECT_TYPE,
        { $: shape },
      ]); // object is treated as shape, not array params
      expect(fqts[2].$).toBe(shape); // same object, not cloned

      ts = [qualifiers.EXPECTED, shape];
      fqts = impl.fullyQualify(ts);
      expect(ts).not.toBe(fqts); // should be a new array
      expect(fqts).toEqual([
        qualifiers.EXPECTED,
        DEFAULT_OBJECT_TYPE,
        { $: shape },
      ]); // object is treated as shape, not array params
      expect(fqts[2].$).toBe(shape); // same object, not cloned

      ts = [shape, [types.STRING]];
      fqts = impl.fullyQualify(ts);
      expect(ts).not.toBe(fqts); // should be a new array
      expect(fqts).toEqual([
        DEFAULT_QUALIFIER,
        DEFAULT_OBJECT_TYPE,
        { $: shape },
        types.ARRAY,
        { $: [types.STRING] },
      ]); // object is treated as shape, not array params
      expect(fqts[2].$).toBe(shape); // same object, not cloned

      ts = [types.FINITE, [types.STRING]];
      fqts = impl.fullyQualify(ts);
      expect(ts).not.toBe(fqts); // should be a new array
      expect(fqts).toEqual([
        DEFAULT_QUALIFIER,
        types.FINITE,
        types.ARRAY,
        { $: [types.STRING] },
      ]);

      ts = [types.ARRAY, { $: types.STRING }];
      fqts = impl.fullyQualify(ts);
      expect(ts).not.toBe(fqts); // should be a new array
      expect(fqts).toEqual([
        DEFAULT_QUALIFIER,
        types.ARRAY,
        { $: types.STRING },
      ]);

      const args = { min: 1, $: [types.STRING] };
      ts = [shape, types.ARRAY, args];
      fqts = impl.fullyQualify(ts);
      expect(ts).not.toBe(fqts); // should be a new array
      expect(fqts).toEqual([
        DEFAULT_QUALIFIER,
        DEFAULT_OBJECT_TYPE,
        { $: shape },
        types.ARRAY,
        args,
      ]);
      expect(fqts[2].$).toBe(shape); // same object, not cloned
      expect(fqts[4]).toBe(args); // same object, not cloned
    });

    it('should throw if typeset is invalid', () => {
      const re = /Invalid typeset=/;

      expect(function () {
        impl.fullyQualify([]);
      }).toThrow(re);
      expect(function () {
        impl.fullyQualify('foo');
      }).toThrow(re);
      expect(function () {
        impl.fullyQualify(/asdf/);
      }).toThrow(re);
      expect(function () {
        impl.fullyQualify(null);
      }).toThrow(re);
      expect(function () {
        impl.fullyQualify(undefined);
      }).toThrow(re);
      expect(function () {
        impl.fullyQualify(1);
      }).toThrow(re);
      expect(function () {
        impl.fullyQualify(true);
      }).toThrow(re);
      expect(function () {
        impl.fullyQualify(new Map());
      }).toThrow(re);
      expect(function () {
        impl.fullyQualify(Symbol('asdf'));
      }).toThrow(re);
    });

    it('should accept a qualifier override', () => {
      expect(impl.fullyQualify(types.STRING, qualifiers.EXPECTED)).toEqual([
        qualifiers.EXPECTED,
        types.STRING,
      ]);

      const shape = { foo: 1 };
      expect(impl.fullyQualify(shape, qualifiers.OPTIONAL)).toEqual([
        qualifiers.OPTIONAL,
        DEFAULT_OBJECT_TYPE,
        { $: shape },
      ]);

      const validator = function () {};
      expect(impl.fullyQualify(validator, qualifiers.EXPECTED)).toEqual([
        qualifiers.EXPECTED,
        types.ANY,
        validator,
      ]);

      expect(impl.fullyQualify([qualifiers.REQUIRED, types.STRING])).toEqual([
        DEFAULT_QUALIFIER,
        types.STRING,
      ]);

      expect(
        impl.fullyQualify(
          [qualifiers.REQUIRED, types.STRING],
          qualifiers.EXPECTED
        )
      ).toEqual([qualifiers.EXPECTED, types.STRING]);
    });
  });

  describe('#extractNextType()', () => {
    it('should use the specified qualifier unless a qualifier is found', () => {
      let typeset = [qualifiers.EXPECTED, types.FUNCTION];
      let nextType = impl.extractNextType(typeset, qualifiers.OPTIONAL);

      expect(typeset).toEqual([]);
      expect(nextType).toEqual([qualifiers.EXPECTED, types.FUNCTION]);

      typeset = [types.FUNCTION];
      nextType = impl.extractNextType(typeset, qualifiers.OPTIONAL);

      expect(typeset).toEqual([]);
      expect(nextType).toEqual([qualifiers.OPTIONAL, types.FUNCTION]);
    });

    it('should use the qualifier, if any, if qualifier=true', () => {
      expect(impl.extractNextType([types.STRING], true)).toEqual([
        types.STRING,
      ]);
      expect(
        impl.extractNextType([qualifiers.REQUIRED, types.STRING], true)
      ).toEqual([qualifiers.REQUIRED, types.STRING]);
      expect(
        impl.extractNextType([qualifiers.REQUIRED, types.STRING], false)
      ).toEqual([types.STRING]);
    });

    it('should handle simple string types', () => {
      let typeset = [types.STRING, types.FINITE];
      let nextType = impl.extractNextType(typeset);

      expect(typeset).toEqual([types.FINITE]);
      expect(nextType).toEqual([types.STRING]);

      const args = {};
      const val = function () {};

      typeset = [types.ARRAY, args, val];
      nextType = impl.extractNextType(typeset);

      expect(typeset).toEqual([val]);
      expect(nextType).toEqual([types.ARRAY, args]);

      typeset = [types.PLAIN_OBJECT, args, types.ARRAY];
      nextType = impl.extractNextType(typeset);

      expect(typeset).toEqual([types.ARRAY]);
      expect(nextType).toEqual([types.PLAIN_OBJECT, args]);

      nextType = impl.extractNextType(typeset);

      expect(typeset).toEqual([]);
      expect(nextType).toEqual([types.ARRAY]);

      typeset = [types.STRING, args, val];
      nextType = impl.extractNextType(typeset);

      expect(typeset).toEqual([val]);
      expect(nextType).toEqual([types.STRING, args]);

      expect(function () {
        impl.extractNextType([types.BOOLEAN, args]);
      }).toThrow(/Invalid Array typeset/);
    });

    it('should handle shapes', () => {
      const shape = { foo: types.STRING };
      let typeset = [shape];
      let nextType = impl.extractNextType(typeset);

      expect(typeset).toEqual([]);
      expect(nextType).toEqual([shape]);

      typeset = [shape];
      nextType = impl.extractNextType(typeset, qualifiers.REQUIRED);

      expect(typeset).toEqual([]);
      expect(nextType).toEqual([qualifiers.REQUIRED, shape]);

      typeset = [types.PLAIN_OBJECT, shape];
      nextType = impl.extractNextType(typeset);

      expect(typeset).toEqual([]);
      expect(nextType).toEqual([types.PLAIN_OBJECT, shape]);
    });

    it('should handle arrays', () => {
      const arr = [types.STRING];
      let typeset = [arr];
      let nextType = impl.extractNextType(typeset);

      expect(typeset).toEqual([]);
      expect(nextType).toEqual([arr]);

      typeset = [arr];
      nextType = impl.extractNextType(typeset, qualifiers.REQUIRED);

      expect(typeset).toEqual([]);
      expect(nextType).toEqual([qualifiers.REQUIRED, arr]);

      const args = { $: arr };
      typeset = [types.ARRAY, args];
      nextType = impl.extractNextType(typeset);

      expect(typeset).toEqual([]);
      expect(nextType).toEqual([types.ARRAY, args]);
    });

    it('should handle validators', () => {
      const val = function () {};
      let typeset = [val];
      let nextType = impl.extractNextType(typeset);

      expect(typeset).toEqual([]);
      expect(nextType).toEqual([val]);

      typeset = [val];
      nextType = impl.extractNextType(typeset, qualifiers.REQUIRED);

      expect(typeset).toEqual([]);
      expect(nextType).toEqual([qualifiers.REQUIRED, val]);

      typeset = [types.ANY, val];
      nextType = impl.extractNextType(typeset);

      expect(typeset).toEqual([val]);
      expect(nextType).toEqual([types.ANY]);

      nextType = impl.extractNextType(typeset);

      expect(typeset).toEqual([]);
      expect(nextType).toEqual([val]);
    });

    it('should allow an empty array as the typeset', () => {
      expect(function () {
        impl.extractNextType([]);
      }).not.toThrow(/Invalid array typeset/);
      expect(impl.extractNextType([])).toEqual([]);
    });
  });

  describe('#_validateContext', () => {
    it('should validate a valid context', () => {
      expect(function () {
        impl._validateContext({
          originalValue: undefined,
          parent: undefined,
          parentKey: undefined,
        });
      }).not.toThrow();
      expect(function () {
        impl._validateContext({
          originalValue: null,
          parent: {},
          parentKey: 1,
        });
      }).not.toThrow();
      expect(function () {
        impl._validateContext({
          originalValue: 123,
          parent: [],
          parentKey: 'a',
        });
      }).not.toThrow();
      expect(function () {
        impl._validateContext({
          originalValue: 'bar',
          parent: new Map(),
          parentKey: {},
        });
      }).not.toThrow();
      expect(function () {
        impl._validateContext({
          originalValue: true,
          parent: new Set(),
          parentKey: undefined,
        });
      }).not.toThrow();
      expect(function () {
        impl._validateContext({
          originalValue: true,
          parent: undefined,
          parentKey: function () {},
        });
      }).not.toThrow();

      vtu.getFalsyValues().forEach((falsyValue) => {
        expect(function () {
          impl._validateContext({
            originalValue: true,
            parent: undefined,
            parentKey: undefined,
            options: falsyValue, // ignored when falsy
          });
        }).not.toThrow();
      });
      expect(function () {
        impl._validateContext({
          originalValue: true,
          parent: undefined,
          parentKey: undefined,
          options: {}, // when truthy, must be an object
        });
      }).not.toThrow();
    });

    it('should throw for an invalid context', () => {
      const msg = 'Invalid type validator context';

      expect(function () {
        impl._validateContext();
      }).toThrow(msg);
      expect(function () {
        impl._validateContext(undefined);
      }).toThrow(msg);
      expect(function () {
        impl._validateContext(null);
      }).toThrow(msg);
      expect(function () {
        impl._validateContext(new Map());
      }).toThrow(msg);
      expect(function () {
        impl._validateContext([]);
      }).toThrow(msg);
      expect(function () {
        impl._validateContext({});
      }).toThrow(msg);
      expect(function () {
        impl._validateContext({ originalValue: [] });
      }).toThrow(msg);
      expect(function () {
        impl._validateContext({ parent: [] });
      }).toThrow(msg);
      expect(function () {
        impl._validateContext({ parentKey: function () {} });
      }).toThrow(msg);
      expect(function () {
        impl._validateContext({ originalValue: 1, parentKey: 1 });
      }).toThrow(msg);
      expect(function () {
        impl._validateContext({ originalValue: 1, parent: {} });
      }).toThrow(msg);
      expect(function () {
        impl._validateContext({ parent: {}, parentKey: 'foo' });
      }).toThrow(msg);

      //// with all 3 required properties, but invalid values

      expect(function () {
        impl._validateContext({ originalValue: 1, parent: null, parentKey: 1 });
      }).toThrow(msg);
      expect(function () {
        impl._validateContext({ originalValue: 1, parent: 1, parentKey: 1 });
      }).toThrow(msg);
      expect(function () {
        impl._validateContext({ originalValue: 1, parent: true, parentKey: 1 });
      }).toThrow(msg);
      expect(function () {
        impl._validateContext({
          originalValue: 1,
          parent: 'foo',
          parentKey: 1,
        });
      }).toThrow(msg);
      expect(function () {
        // eslint-disable-next-line no-new-wrappers
        impl._validateContext({
          originalValue: 1,
          // eslint-disable-next-line no-new-wrappers
          parent: new String('foo'),
          parentKey: 1,
        });
      }).toThrow(msg);
      expect(function () {
        impl._validateContext({
          originalValue: 1,
          parent: function () {},
          parentKey: 1,
        });
      }).toThrow(msg);
      expect(function () {
        impl._validateContext({
          originalValue: 1,
          parent: /foo/,
          parentKey: 1,
        });
      }).toThrow(msg);
      expect(function () {
        impl._validateContext({
          originalValue: 1,
          parent: new WeakMap(),
          parentKey: 1,
        });
      }).toThrow(msg);
      expect(function () {
        impl._validateContext({
          originalValue: 1,
          parent: new WeakSet(),
          parentKey: 1,
        });
      }).toThrow(msg);

      //// with invalid options

      expect(function () {
        impl._validateContext({
          originalValue: 1,
          parent: [],
          parentKey: 1,
          options: [],
        });
      }).toThrow(msg);
    });
  });

  describe('#_createContext', () => {
    it('should create a new context', () => {
      expect(function () {
        impl._validateContext(impl._createContext({}));
      }).not.toThrow();
      expect(function () {
        impl._validateContext(impl._createContext({ originalValue: null }));
      }).not.toThrow();
      expect(function () {
        impl._validateContext(impl._createContext({ originalValue: 123 }));
      }).not.toThrow();
      expect(function () {
        impl._validateContext(impl._createContext({ originalValue: {} }));
      }).not.toThrow();

      let originalValue = undefined;
      let parent = undefined;
      let parentKey = undefined;
      expect(impl._createContext({ originalValue, parent, parentKey })).toEqual(
        {
          originalValue,
          parent,
          parentKey,
        }
      );

      originalValue = null;
      expect(impl._createContext({ originalValue, parent, parentKey })).toEqual(
        {
          originalValue,
          parent,
          parentKey,
        }
      );

      originalValue = 123;
      expect(impl._createContext({ originalValue, parent, parentKey })).toEqual(
        {
          originalValue,
          parent,
          parentKey,
        }
      );

      parent = {};
      expect(impl._createContext({ originalValue, parent, parentKey })).toEqual(
        {
          originalValue,
          parent,
          parentKey,
        }
      );

      originalValue = true;
      parent = [];
      expect(impl._createContext({ originalValue, parent, parentKey })).toEqual(
        {
          originalValue,
          parent,
          parentKey,
        }
      );

      originalValue = 'foo';
      parent = new Map();
      expect(impl._createContext({ originalValue, parent, parentKey })).toEqual(
        {
          originalValue,
          parent,
          parentKey,
        }
      );

      parent = new Set();
      expect(impl._createContext({ originalValue, parent, parentKey })).toEqual(
        {
          originalValue,
          parent,
          parentKey,
        }
      );

      originalValue = function () {};
      parent = {};
      expect(impl._createContext({ originalValue, parent, parentKey })).toEqual(
        {
          originalValue,
          parent,
          parentKey,
        }
      );

      originalValue = [];
      parent = [];
      expect(impl._createContext({ originalValue, parent, parentKey })).toEqual(
        {
          originalValue,
          parent,
          parentKey,
        }
      );

      originalValue = {};
      parent = new Map();
      expect(impl._createContext({ originalValue, parent, parentKey })).toEqual(
        {
          originalValue,
          parent,
          parentKey,
        }
      );

      originalValue = {};
      parent = new Set();
      expect(impl._createContext({ originalValue, parent, parentKey })).toEqual(
        {
          originalValue,
          parent,
          parentKey,
        }
      );

      parentKey = 1;
      expect(impl._createContext({ originalValue, parent, parentKey })).toEqual(
        {
          originalValue,
          parent,
          parentKey,
        }
      );

      parentKey = 'key';
      expect(impl._createContext({ originalValue, parent, parentKey })).toEqual(
        {
          originalValue,
          parent,
          parentKey,
        }
      );

      parentKey = {};
      expect(impl._createContext({ originalValue, parent, parentKey })).toEqual(
        {
          originalValue,
          parent,
          parentKey,
        }
      );

      parentKey = [];
      expect(impl._createContext({ originalValue, parent, parentKey })).toEqual(
        {
          originalValue,
          parent,
          parentKey,
        }
      );

      parentKey = function () {};
      expect(impl._createContext({ originalValue, parent, parentKey })).toEqual(
        {
          originalValue,
          parent,
          parentKey,
        }
      );

      parentKey = /key/;
      expect(impl._createContext({ originalValue, parent, parentKey })).toEqual(
        {
          originalValue,
          parent,
          parentKey,
        }
      );
    });
  });

  describe('#_getContext', () => {
    it('should use the given context when valid', () => {
      const context = {
        originalValue: 123,
        parent: undefined,
        parentKey: undefined,
      };
      expect(impl._getContext(context, { originalValue: 456 })).toBe(context);

      context.options = {}; // with options
      expect(impl._getContext(context, { originalValue: 456 })).toBe(context);
    });

    it('should create a new context when invalid', () => {
      const context = []; // should be an object, not an array
      expect(impl._getContext(context, { originalValue: 456 })).not.toBe(
        context
      );
    });

    it('should use options from given context when creating new context and options is valid', () => {
      const context = { originalValue: 123, options: { exactShapes: true } };
      const result = impl._getContext(context, { originalValue: 456 });
      expect(result).not.toBe(context); // new object
      expect(result.originalValue).toBe(456); // used specified instead of given in context
      expect(result.options).not.toBe(context.options); // new options object created
      Object.keys(context.options).forEach((key) => {
        expect(result.options[key]).toEqual(context.options[key]); // incorporated given options into default options
      });
    });

    it('should not use options from given context when creating new context and options are invalid', () => {
      const context = { originalValue: 123, options: [] }; // options must be an object
      const result = impl._getContext(context, { originalValue: 456 });
      expect(result).not.toBe(context); // new object
      expect(result.originalValue).toBe(456); // used specified instead of given in context
      expect(result.options).toBeUndefined(); // did not use given options because invalid
    });
  });

  describe('#_callCustomValidator', () => {
    let context;

    beforeEach(() => {
      context = { originalValue: {}, parent: {}, parentKey: 'key' };
    });

    it('should return undefined if the validator did not return anything', () => {
      expect(
        impl._callCustomValidator(() => {}, 'foo', [], [], context)
      ).toBeUndefined();
    });

    it('should return undefined if the validator returned a truthy value', () => {
      expect(
        impl._callCustomValidator(() => true, 'foo', [], [], context)
      ).toBeUndefined();
      expect(
        impl._callCustomValidator(() => ({}), 'foo', [], [], context)
      ).toBeUndefined();
      expect(
        impl._callCustomValidator(() => [], 'foo', [], [], context)
      ).toBeUndefined();
      expect(
        impl._callCustomValidator(() => /hello/, 'foo', [], [], context)
      ).toBeUndefined();
      expect(
        impl._callCustomValidator(() => 1, 'foo', [], [], context)
      ).toBeUndefined();
    });

    it('should return an Error if validator returned falsy value but not undefined', () => {
      const failure = impl._callCustomValidator(
        () => false,
        'foo',
        [],
        [],
        context
      );
      expect(failure).toBeInstanceOf(Error);
      expect(failure.message).toContain(
        'Verification failed by the custom validator'
      );

      expect(
        impl._callCustomValidator(() => null, 'foo', [], [], context)
      ).toBeInstanceOf(Error);
      expect(
        impl._callCustomValidator(() => 0, 'foo', [], [], context)
      ).toBeInstanceOf(Error);
      expect(
        impl._callCustomValidator(() => '', 'foo', [], [], context)
      ).toBeInstanceOf(Error);
    });

    it('should return what the custom validator threw', () => {
      let err = new Error('bar');
      const validator = function () {
        throw err;
      };

      let failure = impl._callCustomValidator(
        validator,
        'foo',
        [],
        [],
        context
      );
      expect(failure).toBe(err);

      err = [];
      failure = impl._callCustomValidator(validator, 'foo', [], [], context);
      expect(failure).toBe(err);

      err = {};
      failure = impl._callCustomValidator(validator, 'foo', [], [], context);
      expect(failure).toBe(err);

      err = 'error';
      failure = impl._callCustomValidator(validator, 'foo', [], [], context);
      expect(failure).toBe(err);
    });
  });

  describe('#_getCheckOptions()', () => {
    it('should return new default options if no current or override given', () => {
      expect(impl._getCheckOptions()).toEqual({
        path: [],
        isTypeset: false,
        qualifier: undefined,
      });
    });

    it('should use current options', () => {
      let options = impl._getCheckOptions({
        path: [1],
        isTypeset: true,
        qualifier: qualifiers.EXPECTED,
        foo: 1,
      });
      expect(options).toEqual({
        path: [1],
        isTypeset: true,
        qualifier: qualifiers.EXPECTED,
      });
      // should not include extra property 'foo'
      expect(Object.keys(options)).toEqual(['path', 'isTypeset', 'qualifier']);

      // other properties are defaults
      options = impl._getCheckOptions({ isTypeset: true });
      expect(options).toEqual({
        path: [],
        isTypeset: true,
        qualifier: undefined,
      });
    });

    it('should require current.path to be an array', () => {
      expect(function () {
        impl._getCheckOptions({ path: [1] });
      }).not.toThrow(/current.path must be an Array/);

      expect(function () {
        impl._getCheckOptions({ path: 1 });
      }).toThrow(/current.path must be an Array/);
    });
  });

  describe('#checkWithType()', () => {
    describe('Exceptions', () => {
      it('should throw if type is not valid unless options.isTypeset is true', () => {
        expect(function () {
          impl.checkWithType('value', 'foo');
        }).toThrow(/Invalid typeset in singleType="foo"/);

        expect(function () {
          impl.checkWithType('value', 1);
        }).toThrow(/Invalid typeset in singleType=1/);

        expect(function () {
          impl.checkWithType('value', []);
        }).toThrow(/Invalid typeset in singleType=\[\]/);

        expect(function () {
          impl.checkWithType('value', 'foo', undefined, { isTypeset: true });
        }).not.toThrow(/Invalid typeset in singleType="foo"/);
      });

      it('should throw if type is not handled', () => {
        const typesVerifyStub = jest
          .spyOn(types, 'verify')
          .mockClear()
          .mockReturnValue('foo');
        expect(function () {
          impl.checkWithType(2, 'foo', undefined, {
            isTypeset: true,
            qualifier: DEFAULT_QUALIFIER,
          });
        }).toThrow(/Missing validator for type="foo"/);
        typesVerifyStub.mockRestore();
      });

      it('should throw if more than one type is given', () => {
        expect(function () {
          impl.checkWithType(2, [types.STRING, types.NUMBER]);
        }).toThrow(
          /Specified singleType=.+ typeset must represent a single type/
        );
      });

      it('should throw if single type is not a string, shape, or Array', () => {
        expect(function () {
          impl.checkWithType(2, function () {});
        }).toThrow(/Specified singleType=.+ must be a string, shape, or Array/);
      });
    });

    it('should check simple types against values', () => {
      expect(impl.checkWithType(1, types.FINITE)).toBeInstanceOf(RtvSuccess);
      expect(impl.checkWithType(1, [types.FINITE, { min: 2 }])).toBeInstanceOf(
        RtvError
      );
    });

    it('should check shapes against values', () => {
      expect(
        impl.checkWithType({ name: 'Fred' }, { name: types.STRING })
      ).toBeInstanceOf(RtvSuccess);
    });

    it('should check single type Array typesets against values', () => {
      expect(impl.checkWithType(/foo/, [types.REGEXP])).toBeInstanceOf(
        RtvSuccess
      );
      expect(
        impl.checkWithType({ name: 'Fred' }, [{ name: types.STRING }])
      ).toBeInstanceOf(RtvSuccess);
    });

    it('should use the options.qualifier if specified', () => {
      expect(impl.checkWithType('', types.STRING)).toBeInstanceOf(RtvError);
      expect(impl.checkWithType('', [types.STRING])).toBeInstanceOf(RtvError);
      expect(
        impl.checkWithType('', [qualifiers.EXPECTED, types.STRING])
      ).toBeInstanceOf(RtvSuccess);
      expect(
        impl.checkWithType('', types.STRING, undefined, {
          qualifier: qualifiers.EXPECTED,
        })
      ).toBeInstanceOf(RtvSuccess);
      expect(
        impl.checkWithType('', [types.STRING], undefined, {
          qualifier: qualifiers.EXPECTED,
        })
      ).toBeInstanceOf(RtvSuccess);
      expect(
        impl.checkWithType('', [qualifiers.EXPECTED, types.STRING], undefined, {
          qualifier: qualifiers.REQUIRED,
        })
      ).toBeInstanceOf(RtvError);
    });

    it('should append the type error path to options.path', () => {
      const err = impl.checkWithType(
        { foo: 3 },
        [{ foo: types.STRING }],
        undefined,
        { path: ['a', 'b'] }
      );
      expect(err).toBeInstanceOf(RtvError);
      expect(err.path).toEqual(['a', 'b', 'foo']);
    });
  });

  describe('#checkWithShape()', () => {
    it('should check the value as the implied default object type', () => {
      expect(
        impl.checkWithShape({ foo: 1 }, { foo: types.FINITE })
      ).toBeInstanceOf(RtvSuccess);
      expect(
        impl.checkWithShape([{ foo: 1 }], { foo: types.FINITE })
      ).toBeInstanceOf(RtvError);
    });

    it('should use given options', () => {
      expect(
        impl.checkWithShape(null, { foo: types.BOOLEAN }, undefined, {
          qualifier: qualifiers.EXPECTED,
        })
      ).toBeInstanceOf(RtvSuccess);
    });

    it('should capture a nested custom validator error as RtvError#failure', () => {
      const cvError = new Error('custom validator failed');
      const validator = jest.fn(() => {
        throw cvError;
      });
      const value = { foo: { bar: 'baz' } };
      const context = {
        originalValue: value,
        parent: value.foo,
        parentKey: 'bar',
      };

      const typeset = { foo: { bar: validator } };
      const result = impl.checkWithShape(value, typeset);

      expect(validator).toHaveBeenCalledTimes(1);
      expect(validator.mock.calls[0]).toEqual([
        'baz',
        [qualifiers.REQUIRED, types.ANY],
        validator,
        context,
      ]);

      // the resulting RtvError should represent the original check and should
      //  have a path that points to the 'bar' property in the nested object that
      //  failed validation
      expect(result).toBeInstanceOf(RtvError);
      expect(result.valid).toBe(false);
      expect(result.value).toBe(value);
      expect(result.path).toEqual(['foo', 'bar']);
      expect(result.typeset).toBe(typeset);
      expect(result.mismatch).toEqual([
        qualifiers.REQUIRED,
        types.ANY,
        validator,
      ]);
      expect(result.rootCause).toBe(cvError); // points to the error thrown by nested validator
    });

    describe('null and undefined properties', () => {
      it('should disallow null and undefined properties when qualified as REQUIRED', () => {
        const typeset = { foo: types.STRING };
        expect(impl.checkWithShape({}, typeset)).toBeInstanceOf(RtvError);
        expect(impl.checkWithShape({ foo: undefined }, typeset)).toBeInstanceOf(
          RtvError
        );
        expect(impl.checkWithShape({ foo: null }, typeset)).toBeInstanceOf(
          RtvError
        );
      });

      it('should disallow undefined properties when qualified as EXPECTED', () => {
        const typeset = { foo: [qualifiers.EXPECTED, types.STRING] };
        expect(impl.checkWithShape({}, typeset)).toBeInstanceOf(RtvError);
        expect(impl.checkWithShape({ foo: undefined }, typeset)).toBeInstanceOf(
          RtvError
        );
        expect(impl.checkWithShape({ foo: null }, typeset)).toBeInstanceOf(
          RtvSuccess
        );
      });

      it('should allow null and undefined properties when qualified as OPTIONAL', () => {
        const typeset = { foo: [qualifiers.OPTIONAL, types.STRING] };
        expect(impl.checkWithShape({}, typeset)).toBeInstanceOf(RtvSuccess);
        expect(impl.checkWithShape({ foo: undefined }, typeset)).toBeInstanceOf(
          RtvSuccess
        );
        expect(impl.checkWithShape({ foo: null }, typeset)).toBeInstanceOf(
          RtvSuccess
        );
      });

      it('should look up the prototype chain correctly', () => {
        const typeset = { foo: types.STRING };
        expect(
          impl.checkWithShape(Object.create({ foo: 'bar' }), typeset)
        ).toBeInstanceOf(RtvSuccess);

        typeset.foo = [qualifiers.EXPECTED, typeset.foo];
        expect(
          impl.checkWithShape(Object.create({ foo: null }), typeset)
        ).toBeInstanceOf(RtvSuccess);
      });
    });

    describe('Exceptions', () => {
      it('should throw if a shape is not given', () => {
        expect(function () {
          impl.checkWithShape({ foo: 1 }, []);
        }).toThrow(/Invalid shape/);
      });
    });
  });

  describe('#checkWithArray()', () => {
    it('should check a value against a simple Array typeset', () => {
      const result = impl.checkWithArray(Symbol(1), [types.SYMBOL]);
      expect(result).toBeInstanceOf(RtvSuccess);
    });

    it('should check a value against a complex Array typeset', () => {
      const result = impl.checkWithArray(7, [
        types.STRING,
        types.REGEXP,
        types.FUNCTION,
        types.FINITE,
        { min: 8 },
        types.NUMBER,
        { oneOf: 7 }, // match
      ]);
      expect(result).toBeInstanceOf(RtvSuccess);
    });

    it('should invoke a custom validator if present (generated context)', () => {
      const cvError = new Error('custom validator failed');
      const validator = jest.fn(() => {
        throw cvError;
      });
      const value = 'foo';
      const context = {
        originalValue: value,
        parent: undefined,
        parentKey: undefined,
      };

      let typeset = [validator];
      let result = impl.checkWithArray(value, typeset);
      expect(validator).toHaveBeenCalledTimes(1);
      expect(validator.mock.calls[0]).toEqual([
        value,
        [qualifiers.REQUIRED, types.ANY],
        typeset,
        context,
      ]);
      expect(result).toBeInstanceOf(RtvError);
      expect(result.valid).toBe(false);
      expect(result.value).toBe(value);
      expect(result.path).toEqual([]);
      expect(result.typeset).toBe(typeset);
      expect(result.mismatch).toEqual([
        qualifiers.REQUIRED,
        types.ANY,
        validator,
      ]);
      expect(result.rootCause).toBe(cvError);

      validator.mockClear();

      typeset = [types.STRING, validator];
      result = impl.checkWithArray(value, typeset);
      expect(validator).toHaveBeenCalledTimes(1);
      expect(validator.mock.calls[0]).toEqual([
        value,
        [qualifiers.REQUIRED, types.STRING],
        typeset,
        context,
      ]);
      expect(result).toBeInstanceOf(RtvError);
      expect(result.valid).toBe(false);
      expect(result.value).toBe(value);
      expect(result.path).toEqual([]);
      expect(result.typeset).toBe(typeset);
      expect(result.mismatch).toEqual([
        qualifiers.REQUIRED,
        types.STRING,
        validator,
      ]);
      expect(result.rootCause).toBe(cvError);

      validator.mockReset();
      validator.mockReturnValue(true);

      typeset = [types.STRING, validator];
      result = impl.checkWithArray(value, typeset);
      expect(validator).toHaveBeenCalledTimes(1);
      expect(validator.mock.calls[0]).toEqual([
        value,
        [qualifiers.REQUIRED, types.STRING],
        typeset,
        context,
      ]);
      expect(result).toBeInstanceOf(RtvSuccess);
    });

    it('should invoke a custom validator if present (provided context)', () => {
      const cvError = new Error('custom validator failed');
      const validator = jest.fn(() => {
        throw cvError;
      });
      const value = 'foo';
      const context = {
        originalValue: value,
        parent: undefined,
        parentKey: undefined,
      };

      const typeset = [validator];
      const result = impl.checkWithArray(value, typeset, context);
      expect(validator).toHaveBeenCalledTimes(1);
      expect(validator.mock.calls[0]).toEqual([
        value,
        [qualifiers.REQUIRED, types.ANY],
        typeset,
        context,
      ]);
      expect(validator.mock.calls[0][3]).toBe(context); // same provided context
      expect(result).toBeInstanceOf(RtvError);
      expect(result.valid).toBe(false);
      expect(result.value).toBe(value);
      expect(result.path).toEqual([]);
      expect(result.typeset).toBe(typeset);
      expect(result.mismatch).toEqual([
        qualifiers.REQUIRED,
        types.ANY,
        validator,
      ]);
      expect(result.rootCause).toBe(cvError);
    });

    it('should provide the given context to a custom validator', () => {
      const cvError = new Error('custom validator failed');
      const validator = jest.fn(() => {
        throw cvError;
      });
      const value = { foo: 1 };
      const context = {
        originalValue: value,
        parent: undefined,
        parentKey: undefined,
      };

      const typeset = [validator];
      const result = impl.checkWithArray(value, typeset, context);
      expect(validator).toHaveBeenCalledTimes(1);
      expect(validator.mock.calls[0]).toEqual([
        value,
        [qualifiers.REQUIRED, types.ANY],
        typeset,
        context,
      ]);
      expect(validator.mock.calls[0][3]).toBe(context); // same provided context
      expect(validator.mock.calls[0][3].originalValue).toBe(value); // identical value ref
      expect(result).toBeInstanceOf(RtvError);
      expect(result.valid).toBe(false);
      expect(result.value).toBe(value);
      expect(result.path).toEqual([]);
      expect(result.typeset).toBe(typeset);
      expect(result.mismatch).toEqual([
        qualifiers.REQUIRED,
        types.ANY,
        validator,
      ]);
      expect(result.rootCause).toBe(cvError);
    });

    it('should not invoke a custom validator if no types matched', () => {
      const validator = jest.fn(() => {
        throw new Error('rootCause');
      });
      const typeset = [types.FINITE, validator];
      const result = impl.checkWithArray('foo', typeset);

      expect(validator).toHaveBeenCalledTimes(0);
      expect(result).toBeInstanceOf(RtvError);
      expect(result.valid).toBe(false);
      expect(result.value).toBe('foo');
      expect(result.path).toEqual([]);
      expect(result.typeset).toBe(typeset);
      expect(result.mismatch).toEqual([
        qualifiers.REQUIRED,
        types.FINITE,
        validator,
      ]);
      expect(result.rootCause).toBeUndefined();
    });

    it('should invoke all nested custom validators with respective values', () => {
      const validator1 = jest.fn();
      const validator2 = jest.fn();
      const validator3 = jest.fn();
      const typeset = [
        {
          prop1: [types.STRING, validator1],
          prop2: [types.INT, validator2],
        },
        validator3,
      ];
      const value = {
        prop1: 'foo',
        prop2: 77,
      };
      const result = impl.checkWithArray(value, typeset);

      expect(result).toBeInstanceOf(RtvSuccess);

      expect(validator1).toHaveBeenCalledTimes(1);
      expect(validator1.mock.calls[0]).toEqual([
        'foo',
        [qualifiers.REQUIRED, types.STRING],
        [types.STRING, validator1],
        { originalValue: value, parent: value, parentKey: 'prop1' },
      ]);
      expect(validator1.mock.calls[0][3].originalValue).toBe(value); // identical value ref

      expect(validator2).toHaveBeenCalledTimes(1);
      expect(validator2.mock.calls[0]).toEqual([
        77,
        [qualifiers.REQUIRED, types.INT],
        [types.INT, validator2],
        { originalValue: value, parent: value, parentKey: 'prop2' },
      ]);
      expect(validator2.mock.calls[0][3].originalValue).toBe(value); // identical value ref

      expect(validator3).toHaveBeenCalledTimes(1);
      expect(validator3.mock.calls[0]).toEqual([
        value,
        [
          qualifiers.REQUIRED,
          types.OBJECT,
          {
            $: {
              prop1: typeset[0].prop1,
              prop2: typeset[0].prop2,
            },
          },
        ],
        typeset,
        { originalValue: value, parent: undefined, parentKey: undefined },
      ]);
      expect(validator3.mock.calls[0][3].originalValue).toBe(value); // identical value ref
    });

    it('should invoke a custom validator when value is null and qualifier is EXPECTED', () => {
      const validator = jest.fn().mockReturnValue(true);
      const typeset = [qualifiers.EXPECTED, types.STRING, validator];
      let result = impl.checkWithArray(null, typeset);

      expect(result).toBeInstanceOf(RtvSuccess);
      expect(validator).toHaveBeenCalled();
      expect(validator.mock.calls[0]).toEqual([
        null,
        [qualifiers.EXPECTED, types.STRING],
        typeset,
        { originalValue: null, parent: undefined, parentKey: undefined },
      ]);

      validator.mockReset();

      typeset[0] = qualifiers.OPTIONAL;
      result = impl.checkWithArray(undefined, typeset);

      expect(result).toBeInstanceOf(RtvSuccess);
      expect(validator).toHaveBeenCalled();
      expect(validator.mock.calls[0]).toEqual([
        undefined,
        [qualifiers.OPTIONAL, types.STRING],
        typeset,
        { originalValue: undefined, parent: undefined, parentKey: undefined },
      ]);
    });

    it('should capture a nested custom validator error as RtvError#failure', () => {
      const cvError = new Error('custom validator failed');
      const validator = jest.fn(function (v) {
        if (v === 'bar') {
          throw cvError;
        }
      });
      const value = [['foo', 'bar']];
      const context = { originalValue: value, parent: value[0], parentKey: 1 };

      const typeset = [types.ARRAY, { $: [types.ARRAY, { $: validator }] }];
      const result = impl.checkWithArray(value, typeset);

      // the validator should get called 2 times, and fail only the second time
      expect(validator).toHaveBeenCalledTimes(2); // 'bar' is second element
      expect(validator.mock.calls[1]).toEqual([
        'bar',
        [qualifiers.REQUIRED, types.ANY],
        validator,
        context,
      ]);

      // the resulting RtvError should represent the original check and should
      //  have a path that points to the 'bar' element in the nested array that
      //  failed validation
      expect(result).toBeInstanceOf(RtvError);
      expect(result.valid).toBe(false);
      expect(result.value).toBe(value);
      expect(result.path).toEqual(['0', '1']);
      expect(result.typeset).toBe(typeset);
      expect(result.mismatch).toEqual([
        qualifiers.REQUIRED,
        types.ANY,
        validator,
      ]);
      expect(result.rootCause).toBe(cvError); // points to the error thrown by nested validator
    });

    describe('Options', () => {
      it('should assume typeset is valid', () => {
        const isTypesetStub = jest.spyOn(isTypesetMod, 'check');

        expect(function () {
          impl.checkWithArray(1, ['invalid-type'], undefined, {
            isTypeset: true,
          });
        }).toThrow(/Invalid Array typeset/);

        // should only be called once, as a result of checkWithArray() calling extractNextType()
        //  (checkWithArray()'s call to isTypeset() should be avoided)
        expect(isTypesetStub).toHaveBeenCalledTimes(1);

        isTypesetStub.mockRestore();
      });

      it('should use the given qualifier', () => {
        const result = impl.checkWithArray(NaN, [types.NUMBER], undefined, {
          qualifier: qualifiers.EXPECTED,
        });
        expect(result).toBeInstanceOf(RtvSuccess);
      });
    });

    describe('Exceptions', () => {
      it('should throw if the typeset is not an Array', () => {
        expect(function () {
          impl.checkWithArray(1, {});
        }).toThrow(/Invalid typeset in array/);
      });

      it('should throw if the typeset is not valid', () => {
        expect(function () {
          impl.checkWithArray(1, ['invalid-type']);
        }).toThrow(/Invalid typeset in array/);
      });
    });

    // Minimum Viable Value
    describe('mvv', () => {
      it('should return the MVV in successful results', () => {
        const value = {
          number: 1,
          string: 'hello',
        };
        const result = impl.checkWithArray(value, [{ number: types.SAFE_INT }]);
        expect(result.mvv).toEqual({
          number: 1,
        });
      });
    });
  });

  describe('#check()', () => {
    it('should return an RtvSuccess on successful validation', () => {
      expect(impl.check(1, [types.FINITE])).toBeInstanceOf(RtvSuccess);
    });

    it('should return an RtvError with correct properties on failed validation', () => {
      let value = 1;
      let typeset = types.STRING;
      let err = impl.check(value, typeset);
      expect(err).toBeInstanceOf(RtvError);
      expect(err.value).toBe(value);
      expect(err.path).toEqual([]);
      expect(err.typeset).toBe(typeset);
      expect(err.mismatch).toEqual([qualifiers.REQUIRED, types.STRING]);
      expect(err.rootCause).toBeUndefined();

      const cvError = new Error('badness');
      typeset = function () {
        throw cvError;
      };
      err = impl.check(value, typeset);
      expect(err).toBeInstanceOf(RtvError);
      expect(err.value).toBe(value);
      expect(err.path).toEqual([]);
      expect(err.typeset).toBe(typeset);
      expect(err.mismatch).toEqual([qualifiers.REQUIRED, types.ANY, typeset]); // validator alone means ANY
      expect(err.rootCause).toBe(cvError);

      value = { foo: 'bar' };
      typeset = { foo: types.FINITE };
      err = impl.check(value, typeset);
      expect(err).toBeInstanceOf(RtvError);
      expect(err.value).toBe(value);
      expect(err.path).toEqual(['foo']);
      expect(err.typeset).toBe(typeset);
      expect(err.mismatch).toEqual([qualifiers.REQUIRED, types.FINITE]);
      expect(err.rootCause).toBeUndefined();

      value = { foo: { bar: { baz: -1 } } };
      typeset = {
        foo: {
          bar: {
            baz: [types.STRING, types.FINITE, { oneOf: 0 }],
          },
        },
      };
      err = impl.check(value, typeset);
      expect(err).toBeInstanceOf(RtvError);
      expect(err.value).toBe(value);
      expect(err.path).toEqual(['foo', 'bar', 'baz']);
      expect(err.typeset).toBe(typeset);
      expect(err.mismatch).toEqual([
        qualifiers.REQUIRED,
        types.STRING,
        types.FINITE,
        { oneOf: 0 },
      ]);
      expect(err.rootCause).toBeUndefined();

      value = 1;
      typeset = [types.STRING];
      err = impl.check(value, typeset);
      expect(err).toBeInstanceOf(RtvError);
      expect(err.value).toBe(value);
      expect(err.path).toEqual([]);
      expect(err.typeset).toBe(typeset);
      expect(err.mismatch).toEqual([qualifiers.REQUIRED, types.STRING]);
      expect(err.rootCause).toBeUndefined();
    });

    it('should check a string value as a string', () => {
      expect(impl.check('foo', types.STRING)).toBeInstanceOf(RtvSuccess);
    });

    it('should not check a string value as a boolean', () => {
      expect(impl.check('foo', types.BOOLEAN)).toBeInstanceOf(RtvError);
    });

    it('should invoke a custom validator', () => {
      const cvError = new Error('custom validator failed');
      const validator = jest.fn(() => {
        throw cvError;
      });
      const result = impl.check('foo', validator);

      expect(validator).toHaveBeenCalledTimes(1);
      expect(validator.mock.calls[0]).toEqual([
        'foo',
        [qualifiers.REQUIRED, types.ANY],
        validator,
        { originalValue: 'foo', parent: undefined, parentKey: undefined },
      ]);
      expect(result).toBeInstanceOf(RtvError);
      expect(result.valid).toBe(false);
      expect(result.value).toBe('foo');
      expect(result.path).toEqual([]);
      expect(result.typeset).toBe(validator);
      expect(result.mismatch).toEqual([
        qualifiers.REQUIRED,
        types.ANY,
        validator,
      ]);
      expect(result.rootCause).toBe(cvError);
    });

    it(`should not call the validator if the "${types.ANY}" validator fails`, () => {
      const stub = jest
        .spyOn(isAnyMod, 'check')
        .mockClear()
        .mockReturnValue(false);
      const validator = jest.fn();

      impl.check(1, validator);
      expect(validator).not.toHaveBeenCalled();

      stub.mockRestore();
    });

    describe('Options', () => {
      it('should not validate the typeset if isTypeset is true', () => {
        const isTypesetSpy = jest.spyOn(isTypesetMod, 'check');

        impl.check(1, types.FINITE, undefined, { isTypeset: true });
        expect(isTypesetSpy).not.toHaveBeenCalled();

        isTypesetSpy.mockRestore();
      });

      it('should use the qualifier if specified', () => {
        const validator = jest.fn().mockReturnValue(true);

        impl.check(1, validator, undefined, { qualifier: qualifiers.OPTIONAL });
        expect(validator.mock.calls[0]).toEqual([
          1, // value
          [qualifiers.OPTIONAL, types.ANY], // FQ match
          validator, // typeset
          { originalValue: 1, parent: undefined, parentKey: undefined },
        ]);
      });
    });

    describe('Exceptions', () => {
      it('should throw if typeset is invalid (simple)', () => {
        let err;
        try {
          impl.check(1, 'foo');
        } catch (checkErr) {
          err = checkErr;
        }

        expect(err).toBeInstanceOf(Error);
        expect(err.message.indexOf('Invalid typeset=')).toBe(0);
      });

      it('should throw if typeset is invalid (nested)', () => {
        let err;
        try {
          impl.check({ foo: { bar: 1 } }, { foo: { bar: 'baz' } });
        } catch (checkErr) {
          err = checkErr;
        }

        expect(err).toBeInstanceOf(Error);
        expect(err.message.indexOf('Invalid typeset')).toBe(0);
      });

      it('should throw if typeset type is not supported', () => {
        const isTypesetStub = jest
          .spyOn(isTypesetMod, 'check')
          .mockClear()
          .mockReturnValue(true);

        let err;
        try {
          impl.check(1, /asdf/);
        } catch (checkErr) {
          err = checkErr;
        }

        expect(err).toBeInstanceOf(Error);
        expect(err.message.indexOf('Invalid JavaScript type for typeset')).toBe(
          0
        );

        isTypesetStub.mockRestore();
      });
    });
  });
});
