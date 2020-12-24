import { expect } from 'chai';
import sinon from 'sinon';

import '../../src/rtv'; // so that types get registered with `impl`
import * as impl from '../../src/lib/impl';
import { DEFAULT_OBJECT_TYPE, types } from '../../src/lib/types';
import { DEFAULT_QUALIFIER, qualifiers } from '../../src/lib/qualifiers';
import { RtvSuccess } from '../../src/lib/RtvSuccess';
import { RtvError } from '../../src/lib/RtvError';
import { check as isObject } from '../../src/lib/validation/isObject';
import { check as isFunction } from '../../src/lib/validation/isFunction';
import * as isTypesetMod from '../../src/lib/validation/isTypeset';
import * as isAnyMod from '../../src/lib/validation/isAny';

describe('module: lib/impl', function () {
  describe('._validatorMap', function () {
    it('should map all known types', function () {
      expect(isObject(impl._validatorMap)).to.be.true;
      expect(Object.keys(impl._validatorMap).length).to.equal(26); // # of known types
    });
  });

  describe('#_registerType()', function () {
    const errorRE = /Cannot register an invalid validator/;
    let validator;
    let stringValidator;

    beforeEach(function () {
      stringValidator = impl._validatorMap[types.STRING];
      validator = {
        type: types.STRING,
        config: function () {},
        default: function () {},
      };
    });

    afterEach(function () {
      impl._validatorMap[types.STRING] = stringValidator;
    });

    it('should be a function', function () {
      expect(isFunction(impl._registerType)).to.be.true;
    });

    it('should throw if validator is invalid: not an object', function () {
      expect(impl._registerType.bind(impl, 'foo')).to.throw(errorRE);
    });

    it('should throw if validator is invalid: unknown type', function () {
      validator.type = 'unknown';
      expect(impl._registerType.bind(impl, validator)).to.throw(errorRE);
    });

    it('should throw if validator is invalid: missing .type', function () {
      delete validator.type;
      expect(impl._registerType.bind(impl, validator)).to.throw(errorRE);
    });

    it('should throw if validator is invalid: missing #config()', function () {
      validator.config = 123;
      expect(impl._registerType.bind(impl, validator)).to.throw(errorRE);
    });

    it('should throw if validator is invalid: missing #validate()', function () {
      validator.validate = 123;
      expect(impl._registerType.bind(impl, validator)).to.throw(errorRE);
    });
  });

  describe('#getQualifier()', function () {
    it('should not require a valid typeset', function () {
      expect(function () {
        impl.getQualifier(true);
      }).to.not.throw();
    });

    it('should assume the default qualifier for an invalid typeset', function () {
      expect(impl.getQualifier(/invalid/)).to.equal(DEFAULT_QUALIFIER);
    });

    it('should use the default qualifier if none specified', function () {
      expect(impl.getQualifier({})).to.equal(DEFAULT_QUALIFIER);
      expect(impl.getQualifier([types.STRING])).to.equal(DEFAULT_QUALIFIER);
    });

    it('should return specified qualifier', function () {
      expect(impl.getQualifier([qualifiers.OPTIONAL, types.STRING])).to.equal(
        qualifiers.OPTIONAL
      );
    });
  });

  describe('#toTypeset()', function () {
    describe('Exceptions', function () {
      it('should throw if given an invalid type', function () {
        expect(function () {
          impl.toTypeset('invalid-type');
        }).to.throw(/Invalid value for "types" enumeration/);
      });

      it('should throw if given an invalid qualifier', function () {
        expect(function () {
          impl.toTypeset(types.BOOLEAN, 'invalid-qualifier');
        }).to.throw(/Invalid value for "qualifiers" enumeration/);
      });

      it('should throw if args are given for a type that does not take any', function () {
        expect(function () {
          impl.toTypeset(types.BOOLEAN, {});
        }).to.throw(/Invalid value for "argTypes" enumeration/);
      });

      it('should throw if non-undefined, non-boolean falsy value given for args', function () {
        expect(function () {
          impl.toTypeset(types.STRING, 0);
        }).to.throw(/Invalid type args/);

        expect(function () {
          impl.toTypeset(types.STRING, null);
        }).to.throw(/Invalid type args/);

        expect(function () {
          impl.toTypeset(types.STRING, '');
        }).to.throw(/Invalid type args/);

        expect(function () {
          impl.toTypeset(types.STRING, false); // interpreted as fullyQualified option
        }).not.to.throw(/Invalid type args/);

        expect(function () {
          impl.toTypeset(types.STRING, undefined); // ignored
        }).not.to.throw(/Invalid type args/);
      });

      it('should throw if args given twice', function () {
        expect(function () {
          impl.toTypeset(types.STRING, {}, {});
        }).to.throw(/args parameter already specified/);
      });

      it('should throw if parameters in wrong order', function () {
        expect(function () {
          impl.toTypeset(types.STRING, false, {});
        }).to.throw(/Expecting qualifier or args as the second parameter/);

        expect(function () {
          impl.toTypeset(types.STRING, false, DEFAULT_QUALIFIER);
        }).to.throw(/Expecting qualifier or args as the second parameter/);

        expect(function () {
          impl.toTypeset(types.STRING, {}, DEFAULT_QUALIFIER);
        }).to.throw(/args parameter already specified/);
      });

      it('should validate type, qualifier, and args', function () {
        expect(function () {
          impl.toTypeset('foo');
        }).to.throw(/Invalid value for "types" enum/);

        expect(function () {
          impl.toTypeset(types.FINITE, 'foo');
        }).to.throw(/Invalid value for "qualifiers" enum/);

        expect(function () {
          impl.toTypeset(types.FINITE, DEFAULT_QUALIFIER, []);
        }).to.throw(/Invalid type args/);
      });
    });

    describe('optional parameters', function () {
      it('should ignore undefined parameters', function () {
        expect(impl.toTypeset(types.STRING, undefined, true)).to.eql([
          DEFAULT_QUALIFIER,
          types.STRING,
        ]);

        expect(impl.toTypeset(types.STRING, undefined, {})).to.eql([
          types.STRING,
          {},
        ]);

        expect(
          impl.toTypeset(types.STRING, qualifiers.OPTIONAL, undefined, true)
        ).to.eql([qualifiers.OPTIONAL, types.STRING]);

        expect(
          impl.toTypeset(
            types.STRING,
            qualifiers.OPTIONAL,
            undefined,
            undefined,
            {},
            true
          )
        ).to.eql([qualifiers.OPTIONAL, types.STRING, {}]);
      });
    });

    describe('non-qualified', function () {
      let otherQualifiers;

      beforeEach(function () {
        otherQualifiers = qualifiers.$values.filter(
          (q) => q !== DEFAULT_QUALIFIER
        );
      });

      it('should return an array typeset when the qualifier is not the default', function () {
        otherQualifiers.forEach(function (q) {
          expect(impl.toTypeset(types.FINITE, q)).to.eql([q, types.FINITE]);
        });
      });

      it('should return an array typeset when args are specified', function () {
        const args = { max: 3 };

        expect(impl.toTypeset(types.FINITE, args)).to.eql([types.FINITE, args]);
        expect(impl.toTypeset(types.FINITE, DEFAULT_QUALIFIER, args)).to.eql([
          types.FINITE,
          args,
        ]);

        otherQualifiers.forEach(function (q) {
          expect(impl.toTypeset(types.FINITE, q, args)).to.eql([
            q,
            types.FINITE,
            args,
          ]);
        });
      });

      it('should return a string typeset if given just a string typeset', function () {
        expect(impl.toTypeset(types.BOOLEAN)).to.equal(types.BOOLEAN);
      });

      it('should return just a string typeset when the default qualifier is used', function () {
        expect(impl.toTypeset(types.BOOLEAN, DEFAULT_QUALIFIER)).to.equal(
          types.BOOLEAN
        );
      });

      it('should return an Array typeset if not using the default qualifier', function () {
        expect(impl.toTypeset(types.BOOLEAN, qualifiers.EXPECTED)).to.eql([
          qualifiers.EXPECTED,
          types.BOOLEAN,
        ]);
      });

      it('should return an Array typeset when a type and args are provided', function () {
        expect(impl.toTypeset(types.HASH_MAP, { count: 2 })).to.eql([
          types.HASH_MAP,
          { count: 2 },
        ]);
      });

      it('should return an Array typeset given a type, qualifier, and args', function () {
        expect(
          impl.toTypeset(types.PLAIN_OBJECT, qualifiers.OPTIONAL, {})
        ).to.eql([qualifiers.OPTIONAL, types.PLAIN_OBJECT, {}]);
      });
    });

    describe('fully-qualified', function () {
      it('should return an Array typeset given a type', function () {
        expect(impl.toTypeset(types.BOOLEAN, true)).to.eql([
          DEFAULT_QUALIFIER,
          types.BOOLEAN,
        ]);
      });

      it('should return an Array typeset given a type and qualifier', function () {
        expect(impl.toTypeset(types.STRING, qualifiers.EXPECTED, true)).to.eql([
          qualifiers.EXPECTED,
          types.STRING,
        ]);
      });

      it('should return an Array typeset given a type and args', function () {
        expect(impl.toTypeset(types.HASH_MAP, { count: 2 }, true)).to.eql([
          DEFAULT_QUALIFIER,
          types.HASH_MAP,
          { count: 2 },
        ]);
      });

      it('should return an Array typeset given a type, qualifier, and args', function () {
        expect(
          impl.toTypeset(
            types.HASH_MAP,
            qualifiers.OPTIONAL,
            { count: 2 },
            true
          )
        ).to.eql([qualifiers.OPTIONAL, types.HASH_MAP, { count: 2 }]);
      });

      it('should produce fully-qualified typesets', function () {
        // without args
        expect(impl.toTypeset(types.FINITE, true)).to.eql([
          DEFAULT_QUALIFIER,
          types.FINITE,
        ]);
        qualifiers.$values.forEach(function (q) {
          expect(impl.toTypeset(types.FINITE, q, true)).to.eql([
            q,
            types.FINITE,
          ]);
        });

        const args = { max: 3 };
        qualifiers.$values.forEach(function (q) {
          expect(impl.toTypeset(types.FINITE, q, args, true)).to.eql([
            q,
            types.FINITE,
            args,
          ]);
        });
      });
    });
  });

  describe('#fullyQualify()', function () {
    it('should validate the type', function () {
      expect(function () {
        impl.fullyQualify('foo');
      }).to.throw(/Invalid typeset="foo"/);
    });

    it('should validate the qualifier', function () {
      expect(function () {
        impl.fullyQualify(types.STRING, 'foo');
      }).to.throw(/Invalid value for "qualifiers" enum/);
    });

    it('should FQ string typesets', function () {
      expect(impl.fullyQualify(types.STRING)).to.eql([
        DEFAULT_QUALIFIER,
        types.STRING,
      ]);
    });

    it('should FQ object typesets', function () {
      const shape = {};
      const fqts = impl.fullyQualify(shape);
      expect(fqts).to.eql([
        DEFAULT_QUALIFIER,
        DEFAULT_OBJECT_TYPE,
        { $: shape },
      ]);
      expect(fqts[2].$).to.equal(shape); // objects within are not cloned
    });

    it('should FQ function typesets', function () {
      const fn = function () {};
      let fqts = impl.fullyQualify(fn);
      expect(fqts).to.eql([DEFAULT_QUALIFIER, types.ANY, fn]);
      expect(fqts[2]).to.equal(fn); // objects within are not cloned

      fqts = impl.fullyQualify([fn]);
      expect(fqts).to.eql([DEFAULT_QUALIFIER, types.ANY, fn]);
      expect(fqts[2]).to.equal(fn); // objects within are not cloned
    });

    it('should FQ array typesets', function () {
      let ts = [types.FINITE];
      let fqts = impl.fullyQualify(ts);
      expect(ts).not.to.equal(fqts); // should be a new array
      expect(fqts).to.eql([DEFAULT_QUALIFIER, types.FINITE]);

      ts = [types.JSON, function (v) {}];
      fqts = impl.fullyQualify(ts);
      expect(ts).not.to.equal(fqts); // should be a new array
      expect(fqts).to.eql([DEFAULT_QUALIFIER, types.JSON, ts[1]]);

      ts = [[types.FLOAT]];
      fqts = impl.fullyQualify(ts);
      expect(ts).not.to.equal(fqts); // should be a new array
      expect(fqts).to.eql([
        DEFAULT_QUALIFIER,
        types.ARRAY,
        { ts: [types.FLOAT] },
      ]); // not deep

      const shape = {};
      ts = [shape, [types.STRING]];
      fqts = impl.fullyQualify(ts);
      expect(ts).not.to.equal(fqts); // should be a new array
      expect(fqts).to.eql([
        DEFAULT_QUALIFIER,
        DEFAULT_OBJECT_TYPE,
        { $: shape },
        types.ARRAY,
        { ts: [types.STRING] },
      ]); // object is treated as shape, not array params
      expect(fqts[2].$).to.equal(shape); // same object, not cloned

      ts = [types.FINITE, [types.STRING]];
      fqts = impl.fullyQualify(ts);
      expect(ts).not.to.equal(fqts); // should be a new array
      expect(fqts).to.eql([
        DEFAULT_QUALIFIER,
        types.FINITE,
        types.ARRAY,
        { ts: [types.STRING] },
      ]);

      ts = [types.ARRAY, { ts: types.STRING }];
      fqts = impl.fullyQualify(ts);
      expect(ts).not.to.equal(fqts); // should be a new array
      expect(fqts).to.eql([
        DEFAULT_QUALIFIER,
        types.ARRAY,
        { ts: types.STRING },
      ]);

      const args = { min: 1, ts: [types.STRING] };
      ts = [shape, types.ARRAY, args];
      fqts = impl.fullyQualify(ts);
      expect(ts).not.to.equal(fqts); // should be a new array
      expect(fqts).to.eql([
        DEFAULT_QUALIFIER,
        DEFAULT_OBJECT_TYPE,
        { $: shape },
        types.ARRAY,
        args,
      ]);
      expect(fqts[2].$).to.equal(shape); // same object, not cloned
      expect(fqts[4]).to.equal(args); // same object, not cloned
    });

    it('should throw if typeset is invalid', function () {
      const re = /Invalid typeset=/;

      expect(function () {
        impl.fullyQualify([]);
      }).to.throw(re);
      expect(function () {
        impl.fullyQualify('foo');
      }).to.throw(re);
      expect(function () {
        impl.fullyQualify(/asdf/);
      }).to.throw(re);
      expect(function () {
        impl.fullyQualify(null);
      }).to.throw(re);
      expect(function () {
        impl.fullyQualify(undefined);
      }).to.throw(re);
      expect(function () {
        impl.fullyQualify(1);
      }).to.throw(re);
      expect(function () {
        impl.fullyQualify(true);
      }).to.throw(re);
      expect(function () {
        impl.fullyQualify(new Map());
      }).to.throw(re);
      expect(function () {
        impl.fullyQualify(Symbol('asdf'));
      }).to.throw(re);
    });

    it('should accept a qualifier override', function () {
      expect(impl.fullyQualify(types.STRING, qualifiers.EXPECTED)).to.eql([
        qualifiers.EXPECTED,
        types.STRING,
      ]);

      const shape = { foo: 1 };
      expect(impl.fullyQualify(shape, qualifiers.OPTIONAL)).to.eql([
        qualifiers.OPTIONAL,
        DEFAULT_OBJECT_TYPE,
        { $: shape },
      ]);

      const validator = function () {};
      expect(impl.fullyQualify(validator, qualifiers.EXPECTED)).to.eql([
        qualifiers.EXPECTED,
        types.ANY,
        validator,
      ]);

      expect(impl.fullyQualify([qualifiers.REQUIRED, types.STRING])).to.eql([
        DEFAULT_QUALIFIER,
        types.STRING,
      ]);

      expect(
        impl.fullyQualify(
          [qualifiers.REQUIRED, types.STRING],
          qualifiers.EXPECTED
        )
      ).to.eql([qualifiers.EXPECTED, types.STRING]);
    });
  });

  describe('#extractNextType()', function () {
    it('should use the specified qualifier unless a qualifier is found', function () {
      let typeset = [qualifiers.EXPECTED, types.FUNCTION];
      let nextType = impl.extractNextType(typeset, qualifiers.OPTIONAL);

      expect(typeset).to.eql([]);
      expect(nextType).to.eql([qualifiers.EXPECTED, types.FUNCTION]);

      typeset = [types.FUNCTION];
      nextType = impl.extractNextType(typeset, qualifiers.OPTIONAL);

      expect(typeset).to.eql([]);
      expect(nextType).to.eql([qualifiers.OPTIONAL, types.FUNCTION]);
    });

    it('should use the qualifier, if any, if qualifier=true', function () {
      expect(impl.extractNextType([types.STRING], true)).to.eql([types.STRING]);
      expect(
        impl.extractNextType([qualifiers.REQUIRED, types.STRING], true)
      ).to.eql([qualifiers.REQUIRED, types.STRING]);
      expect(
        impl.extractNextType([qualifiers.REQUIRED, types.STRING], false)
      ).to.eql([types.STRING]);
    });

    it('should handle simple string types', function () {
      let typeset = [types.STRING, types.FINITE];
      let nextType = impl.extractNextType(typeset);

      expect(typeset).to.eql([types.FINITE]);
      expect(nextType).to.eql([types.STRING]);

      const args = {};
      const val = function () {};

      typeset = [types.ARRAY, args, val];
      nextType = impl.extractNextType(typeset);

      expect(typeset).to.eql([val]);
      expect(nextType).to.eql([types.ARRAY, args]);

      typeset = [types.PLAIN_OBJECT, args, types.ARRAY];
      nextType = impl.extractNextType(typeset);

      expect(typeset).to.eql([types.ARRAY]);
      expect(nextType).to.eql([types.PLAIN_OBJECT, args]);

      nextType = impl.extractNextType(typeset);

      expect(typeset).to.eql([]);
      expect(nextType).to.eql([types.ARRAY]);

      typeset = [types.STRING, args, val];
      nextType = impl.extractNextType(typeset);

      expect(typeset).to.eql([val]);
      expect(nextType).to.eql([types.STRING, args]);

      expect(function () {
        impl.extractNextType([types.BOOLEAN, args]);
      }).to.throw(/Invalid Array typeset/);
    });

    it('should handle shapes', function () {
      const shape = { foo: types.STRING };
      let typeset = [shape];
      let nextType = impl.extractNextType(typeset);

      expect(typeset).to.eql([]);
      expect(nextType).to.eql([shape]);

      typeset = [shape];
      nextType = impl.extractNextType(typeset, qualifiers.REQUIRED);

      expect(typeset).to.eql([]);
      expect(nextType).to.eql([qualifiers.REQUIRED, shape]);

      typeset = [types.PLAIN_OBJECT, shape];
      nextType = impl.extractNextType(typeset);

      expect(typeset).to.eql([]);
      expect(nextType).to.eql([types.PLAIN_OBJECT, shape]);
    });

    it('should handle arrays', function () {
      const arr = [types.STRING];
      let typeset = [arr];
      let nextType = impl.extractNextType(typeset);

      expect(typeset).to.eql([]);
      expect(nextType).to.eql([arr]);

      typeset = [arr];
      nextType = impl.extractNextType(typeset, qualifiers.REQUIRED);

      expect(typeset).to.eql([]);
      expect(nextType).to.eql([qualifiers.REQUIRED, arr]);

      const args = { ts: arr };
      typeset = [types.ARRAY, args];
      nextType = impl.extractNextType(typeset);

      expect(typeset).to.eql([]);
      expect(nextType).to.eql([types.ARRAY, args]);
    });

    it('should handle validators', function () {
      const val = function () {};
      let typeset = [val];
      let nextType = impl.extractNextType(typeset);

      expect(typeset).to.eql([]);
      expect(nextType).to.eql([val]);

      typeset = [val];
      nextType = impl.extractNextType(typeset, qualifiers.REQUIRED);

      expect(typeset).to.eql([]);
      expect(nextType).to.eql([qualifiers.REQUIRED, val]);

      typeset = [types.ANY, val];
      nextType = impl.extractNextType(typeset);

      expect(typeset).to.eql([val]);
      expect(nextType).to.eql([types.ANY]);

      nextType = impl.extractNextType(typeset);

      expect(typeset).to.eql([]);
      expect(nextType).to.eql([val]);
    });

    it('should allow an empty array as the typeset', function () {
      expect(function () {
        impl.extractNextType([]);
      }).not.to.throw(/Invalid array typeset/);
      expect(impl.extractNextType([])).to.eql([]);
    });
  });

  describe('#_validateContext', function () {
    it('should validate a valid context', function () {
      expect(function () {
        impl._validateContext({
          originalValue: undefined,
          parent: undefined,
          parentKey: undefined,
        });
      }).not.to.throw();
      expect(function () {
        impl._validateContext({
          originalValue: null,
          parent: {},
          parentKey: 1,
        });
      }).not.to.throw();
      expect(function () {
        impl._validateContext({
          originalValue: 123,
          parent: [],
          parentKey: 'a',
        });
      }).not.to.throw();
      expect(function () {
        impl._validateContext({
          originalValue: 'bar',
          parent: new Map(),
          parentKey: {},
        });
      }).not.to.throw();
      expect(function () {
        impl._validateContext({
          originalValue: true,
          parent: new Set(),
          parentKey: undefined,
        });
      }).not.to.throw();
      expect(function () {
        impl._validateContext({
          originalValue: true,
          parent: undefined,
          parentKey: function () {},
        });
      }).not.to.throw();
    });

    it('should throw for an invalid context', function () {
      const msg = 'Invalid type validator context';

      expect(function () {
        impl._validateContext();
      }).to.throw(msg);
      expect(function () {
        impl._validateContext(undefined);
      }).to.throw(msg);
      expect(function () {
        impl._validateContext(null);
      }).to.throw(msg);
      expect(function () {
        impl._validateContext(new Map());
      }).to.throw(msg);
      expect(function () {
        impl._validateContext([]);
      }).to.throw(msg);
      expect(function () {
        impl._validateContext({});
      }).to.throw(msg);
      expect(function () {
        impl._validateContext({ originalValue: [] });
      }).to.throw(msg);
      expect(function () {
        impl._validateContext({ parent: [] });
      }).to.throw(msg);
      expect(function () {
        impl._validateContext({ parentKey: function () {} });
      }).to.throw(msg);
      expect(function () {
        impl._validateContext({ originalValue: 1, parentKey: 1 });
      }).to.throw(msg);
      expect(function () {
        impl._validateContext({ originalValue: 1, parent: {} });
      }).to.throw(msg);
      expect(function () {
        impl._validateContext({ parent: {}, parentKey: 'foo' });
      }).to.throw(msg);

      expect(function () {
        impl._validateContext({ originalValue: 1, parent: null, parentKey: 1 });
      }).to.throw(msg);
      expect(function () {
        impl._validateContext({ originalValue: 1, parent: 1, parentKey: 1 });
      }).to.throw(msg);
      expect(function () {
        impl._validateContext({ originalValue: 1, parent: true, parentKey: 1 });
      }).to.throw(msg);
      expect(function () {
        impl._validateContext({
          originalValue: 1,
          parent: 'foo',
          parentKey: 1,
        });
      }).to.throw(msg);
      expect(function () {
        // eslint-disable-next-line no-new-wrappers
        impl._validateContext({
          originalValue: 1,
          // eslint-disable-next-line no-new-wrappers
          parent: new String('foo'),
          parentKey: 1,
        });
      }).to.throw(msg);
      expect(function () {
        impl._validateContext({
          originalValue: 1,
          parent: function () {},
          parentKey: 1,
        });
      }).to.throw(msg);
      expect(function () {
        impl._validateContext({
          originalValue: 1,
          parent: /foo/,
          parentKey: 1,
        });
      }).to.throw(msg);
      expect(function () {
        impl._validateContext({
          originalValue: 1,
          parent: new WeakMap(),
          parentKey: 1,
        });
      }).to.throw(msg);
      expect(function () {
        impl._validateContext({
          originalValue: 1,
          parent: new WeakSet(),
          parentKey: 1,
        });
      }).to.throw(msg);
    });
  });

  describe('#_createContext', function () {
    it('should create a new context', function () {
      expect(function () {
        impl._validateContext(impl._createContext({}));
      }).not.to.throw();
      expect(function () {
        impl._validateContext(impl._createContext({ originalValue: null }));
      }).not.to.throw();
      expect(function () {
        impl._validateContext(impl._createContext({ originalValue: 123 }));
      }).not.to.throw();
      expect(function () {
        impl._validateContext(impl._createContext({ originalValue: {} }));
      }).not.to.throw();

      let originalValue = undefined;
      let parent = undefined;
      let parentKey = undefined;
      expect(impl._createContext({ originalValue, parent, parentKey })).to.eql({
        originalValue,
        parent,
        parentKey,
      });

      originalValue = null;
      expect(impl._createContext({ originalValue, parent, parentKey })).to.eql({
        originalValue,
        parent,
        parentKey,
      });

      originalValue = 123;
      expect(impl._createContext({ originalValue, parent, parentKey })).to.eql({
        originalValue,
        parent,
        parentKey,
      });

      parent = {};
      expect(impl._createContext({ originalValue, parent, parentKey })).to.eql({
        originalValue,
        parent,
        parentKey,
      });

      originalValue = true;
      parent = [];
      expect(impl._createContext({ originalValue, parent, parentKey })).to.eql({
        originalValue,
        parent,
        parentKey,
      });

      originalValue = 'foo';
      parent = new Map();
      expect(impl._createContext({ originalValue, parent, parentKey })).to.eql({
        originalValue,
        parent,
        parentKey,
      });

      parent = new Set();
      expect(impl._createContext({ originalValue, parent, parentKey })).to.eql({
        originalValue,
        parent,
        parentKey,
      });

      originalValue = function () {};
      parent = {};
      expect(impl._createContext({ originalValue, parent, parentKey })).to.eql({
        originalValue,
        parent,
        parentKey,
      });

      originalValue = [];
      parent = [];
      expect(impl._createContext({ originalValue, parent, parentKey })).to.eql({
        originalValue,
        parent,
        parentKey,
      });

      originalValue = {};
      parent = new Map();
      expect(impl._createContext({ originalValue, parent, parentKey })).to.eql({
        originalValue,
        parent,
        parentKey,
      });

      originalValue = {};
      parent = new Set();
      expect(impl._createContext({ originalValue, parent, parentKey })).to.eql({
        originalValue,
        parent,
        parentKey,
      });

      parentKey = 1;
      expect(impl._createContext({ originalValue, parent, parentKey })).to.eql({
        originalValue,
        parent,
        parentKey,
      });

      parentKey = 'key';
      expect(impl._createContext({ originalValue, parent, parentKey })).to.eql({
        originalValue,
        parent,
        parentKey,
      });

      parentKey = {};
      expect(impl._createContext({ originalValue, parent, parentKey })).to.eql({
        originalValue,
        parent,
        parentKey,
      });

      parentKey = [];
      expect(impl._createContext({ originalValue, parent, parentKey })).to.eql({
        originalValue,
        parent,
        parentKey,
      });

      parentKey = function () {};
      expect(impl._createContext({ originalValue, parent, parentKey })).to.eql({
        originalValue,
        parent,
        parentKey,
      });

      parentKey = /key/;
      expect(impl._createContext({ originalValue, parent, parentKey })).to.eql({
        originalValue,
        parent,
        parentKey,
      });
    });
  });

  describe('#_callCustomValidator', function () {
    let context;

    beforeEach(function () {
      context = { originalValue: {}, parent: {}, parentKey: 'key' };
    });

    it('should return undefined if the validator did not return anything', function () {
      expect(
        impl._callCustomValidator(() => {}, 'foo', [], [], context)
      ).to.equal(undefined);
    });

    it('should return undefined if the validator returned a truthy value', function () {
      expect(
        impl._callCustomValidator(() => true, 'foo', [], [], context)
      ).to.equal(undefined);
      expect(
        impl._callCustomValidator(() => ({}), 'foo', [], [], context)
      ).to.equal(undefined);
      expect(
        impl._callCustomValidator(() => [], 'foo', [], [], context)
      ).to.equal(undefined);
      expect(
        impl._callCustomValidator(() => /hello/, 'foo', [], [], context)
      ).to.equal(undefined);
      expect(
        impl._callCustomValidator(() => 1, 'foo', [], [], context)
      ).to.equal(undefined);
    });

    it('should return an Error if validator returned falsy value but not undefined', function () {
      const failure = impl._callCustomValidator(
        () => false,
        'foo',
        [],
        [],
        context
      );
      expect(failure).to.be.an.instanceof(Error);
      expect(failure.message).to.contain(
        'Verification failed by the custom validator'
      );

      expect(
        impl._callCustomValidator(() => null, 'foo', [], [], context)
      ).to.be.an.instanceof(Error);
      expect(
        impl._callCustomValidator(() => 0, 'foo', [], [], context)
      ).to.be.an.instanceof(Error);
      expect(
        impl._callCustomValidator(() => '', 'foo', [], [], context)
      ).to.be.an.instanceof(Error);
    });

    it('should return what the custom validator threw', function () {
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
      expect(failure).to.equal(err);

      err = [];
      failure = impl._callCustomValidator(validator, 'foo', [], [], context);
      expect(failure).to.equal(err);

      err = {};
      failure = impl._callCustomValidator(validator, 'foo', [], [], context);
      expect(failure).to.equal(err);

      err = 'error';
      failure = impl._callCustomValidator(validator, 'foo', [], [], context);
      expect(failure).to.equal(err);
    });
  });

  describe('#_getCheckOptions()', function () {
    it('should return new default options if no current or override given', function () {
      expect(impl._getCheckOptions()).to.eql({
        path: [],
        isTypeset: false,
        qualifier: undefined,
      });
    });

    it('should use current options', function () {
      let options = impl._getCheckOptions({
        path: [1],
        isTypeset: true,
        qualifier: qualifiers.EXPECTED,
        foo: 1,
      });
      expect(options).to.eql({
        path: [1],
        isTypeset: true,
        qualifier: qualifiers.EXPECTED,
      });
      // should not include extra property 'foo'
      expect(Object.keys(options)).to.eql(['path', 'isTypeset', 'qualifier']);

      // other properties are defaults
      options = impl._getCheckOptions({ isTypeset: true });
      expect(options).to.eql({
        path: [],
        isTypeset: true,
        qualifier: undefined,
      });
    });

    it('should require current.path to be an array', function () {
      expect(function () {
        impl._getCheckOptions({ path: [1] });
      }).not.to.throw(/current.path must be an Array/);

      expect(function () {
        impl._getCheckOptions({ path: 1 });
      }).to.throw(/current.path must be an Array/);
    });
  });

  describe('#checkWithType()', function () {
    describe('Exceptions', function () {
      it('should throw if type is not valid unless options.isTypeset is true', function () {
        expect(function () {
          impl.checkWithType('value', 'foo');
        }).to.throw(/Invalid typeset in singleType="foo"/);

        expect(function () {
          impl.checkWithType('value', 1);
        }).to.throw(/Invalid typeset in singleType=1/);

        expect(function () {
          impl.checkWithType('value', []);
        }).to.throw(/Invalid typeset in singleType=\[\]/);

        expect(function () {
          impl.checkWithType('value', 'foo', undefined, { isTypeset: true });
        }).not.to.throw(/Invalid typeset in singleType="foo"/);
      });

      it('should throw if type is not handled', function () {
        const typesVerifyStub = sinon.stub(types, 'verify').returns('foo');
        expect(function () {
          impl.checkWithType(2, 'foo', undefined, {
            isTypeset: true,
            qualifier: DEFAULT_QUALIFIER,
          });
        }).to.throw(/Missing validator for type="foo"/);
        typesVerifyStub.restore();
      });

      it('should throw if more than one type is given', function () {
        expect(function () {
          impl.checkWithType(2, [types.STRING, types.NUMBER]);
        }).to.throw(
          /Specified singleType=.+ typeset must represent a single type/
        );
      });

      it('should throw if single type is not a string, shape, or Array', function () {
        expect(function () {
          impl.checkWithType(2, function () {});
        }).to.throw(
          /Specified singleType=.+ must be a string, shape, or Array/
        );
      });
    });

    it('should check simple types against values', function () {
      expect(impl.checkWithType(1, types.FINITE)).to.be.an.instanceof(
        RtvSuccess
      );
      expect(
        impl.checkWithType(1, [types.FINITE, { min: 2 }])
      ).to.be.an.instanceof(RtvError);
    });

    it('should check shapes against values', function () {
      expect(
        impl.checkWithType({ name: 'Fred' }, { name: types.STRING })
      ).to.be.an.instanceof(RtvSuccess);
    });

    it('should check single type Array typesets against values', function () {
      expect(impl.checkWithType(/foo/, [types.REGEXP])).to.be.an.instanceof(
        RtvSuccess
      );
      expect(
        impl.checkWithType({ name: 'Fred' }, [{ name: types.STRING }])
      ).to.be.an.instanceof(RtvSuccess);
    });

    it('should use the options.qualifier if specified', function () {
      expect(impl.checkWithType('', types.STRING)).to.be.an.instanceof(
        RtvError
      );
      expect(impl.checkWithType('', [types.STRING])).to.be.an.instanceof(
        RtvError
      );
      expect(
        impl.checkWithType('', [qualifiers.EXPECTED, types.STRING])
      ).to.be.an.instanceof(RtvSuccess);
      expect(
        impl.checkWithType('', types.STRING, undefined, {
          qualifier: qualifiers.EXPECTED,
        })
      ).to.be.an.instanceof(RtvSuccess);
      expect(
        impl.checkWithType('', [types.STRING], undefined, {
          qualifier: qualifiers.EXPECTED,
        })
      ).to.be.an.instanceof(RtvSuccess);
      expect(
        impl.checkWithType('', [qualifiers.EXPECTED, types.STRING], undefined, {
          qualifier: qualifiers.REQUIRED,
        })
      ).to.be.an.instanceof(RtvError);
    });

    it('should append the type error path to options.path', function () {
      const err = impl.checkWithType(
        { foo: 3 },
        [{ foo: types.STRING }],
        undefined,
        { path: ['a', 'b'] }
      );
      expect(err).to.be.an.instanceof(RtvError);
      expect(err.path).to.eql(['a', 'b', 'foo']);
    });
  });

  describe('#checkWithShape()', function () {
    it('should check the value as the implied default object type', function () {
      expect(
        impl.checkWithShape({ foo: 1 }, { foo: types.FINITE })
      ).to.be.an.instanceof(RtvSuccess);
      expect(
        impl.checkWithShape([{ foo: 1 }], { foo: types.FINITE })
      ).to.be.an.instanceof(RtvError);
    });

    it('should use given options', function () {
      expect(
        impl.checkWithShape(null, { foo: types.BOOLEAN }, undefined, {
          qualifier: qualifiers.EXPECTED,
        })
      ).to.be.an.instanceof(RtvSuccess);
    });

    it('should capture a nested custom validator error as RtvError#failure', function () {
      const cvError = new Error('custom validator failed');
      const validator = sinon.stub().throws(cvError);
      const value = { foo: { bar: 'baz' } };
      const context = {
        originalValue: value,
        parent: value.foo,
        parentKey: 'bar',
      };

      const typeset = { foo: { bar: validator } };
      const result = impl.checkWithShape(value, typeset);

      expect(validator.callCount).to.equal(1);
      expect(validator.firstCall.args).to.eql([
        'baz',
        [qualifiers.REQUIRED, types.ANY],
        validator,
        context,
      ]);

      // the resulting RtvError should represent the original check and should
      //  have a path that points to the 'bar' property in the nested object that
      //  failed validation
      expect(result).to.be.an.instanceof(RtvError);
      expect(result.valid).to.be.false;
      expect(result.value).to.equal(value);
      expect(result.path).to.eql(['foo', 'bar']);
      expect(result.typeset).to.equal(typeset);
      expect(result.mismatch).to.eql([
        qualifiers.REQUIRED,
        types.ANY,
        validator,
      ]);
      expect(result.rootCause).to.equal(cvError); // points to the error thrown by nested validator
    });

    describe('null and undefined properties', function () {
      it('should disallow null and undefined properties when qualified as REQUIRED', function () {
        const typeset = { foo: types.STRING };
        expect(impl.checkWithShape({}, typeset)).to.be.an.instanceof(RtvError);
        expect(
          impl.checkWithShape({ foo: undefined }, typeset)
        ).to.be.an.instanceof(RtvError);
        expect(impl.checkWithShape({ foo: null }, typeset)).to.be.an.instanceof(
          RtvError
        );
      });

      it('should disallow undefined properties when qualified as EXPECTED', function () {
        const typeset = { foo: [qualifiers.EXPECTED, types.STRING] };
        expect(impl.checkWithShape({}, typeset)).to.be.an.instanceof(RtvError);
        expect(
          impl.checkWithShape({ foo: undefined }, typeset)
        ).to.be.an.instanceof(RtvError);
        expect(impl.checkWithShape({ foo: null }, typeset)).to.be.an.instanceof(
          RtvSuccess
        );
      });

      it('should allow null and undefined properties when qualified as OPTIONAL', function () {
        const typeset = { foo: [qualifiers.OPTIONAL, types.STRING] };
        expect(impl.checkWithShape({}, typeset)).to.be.an.instanceof(
          RtvSuccess
        );
        expect(
          impl.checkWithShape({ foo: undefined }, typeset)
        ).to.be.an.instanceof(RtvSuccess);
        expect(impl.checkWithShape({ foo: null }, typeset)).to.be.an.instanceof(
          RtvSuccess
        );
      });

      it('should look up the prototype chain correctly', function () {
        const typeset = { foo: types.STRING };
        expect(
          impl.checkWithShape(Object.create({ foo: 'bar' }), typeset)
        ).to.be.an.instanceof(RtvSuccess);

        typeset.foo = [qualifiers.EXPECTED, typeset.foo];
        expect(
          impl.checkWithShape(Object.create({ foo: null }), typeset)
        ).to.be.an.instanceof(RtvSuccess);
      });
    });

    describe('Exceptions', function () {
      it('should throw if a shape is not given', function () {
        expect(function () {
          impl.checkWithShape({ foo: 1 }, []);
        }).to.throw(/Invalid shape/);
      });
    });
  });

  describe('#checkWithArray()', function () {
    it('should check a value against a simple Array typeset', function () {
      const result = impl.checkWithArray(Symbol(1), [types.SYMBOL]);
      expect(result).to.be.an.instanceof(RtvSuccess);
    });

    it('should check a value against a complex Array typeset', function () {
      const result = impl.checkWithArray(7, [
        types.STRING,
        types.REGEXP,
        types.FUNCTION,
        types.FINITE,
        { min: 8 },
        types.NUMBER,
        { oneOf: 7 }, // match
      ]);
      expect(result).to.be.an.instanceof(RtvSuccess);
    });

    it('should invoke a custom validator if present (generated context)', function () {
      const cvError = new Error('custom validator failed');
      const validator = sinon.stub().throws(cvError);
      const value = 'foo';
      const context = {
        originalValue: value,
        parent: undefined,
        parentKey: undefined,
      };

      let typeset = [validator];
      let result = impl.checkWithArray(value, typeset);
      expect(validator.callCount).to.equal(1);
      expect(validator.firstCall.args).to.eql([
        value,
        [qualifiers.REQUIRED, types.ANY],
        typeset,
        context,
      ]);
      expect(result).to.be.an.instanceof(RtvError);
      expect(result.valid).to.be.false;
      expect(result.value).to.equal(value);
      expect(result.path).to.eql([]);
      expect(result.typeset).to.equal(typeset);
      expect(result.mismatch).to.eql([
        qualifiers.REQUIRED,
        types.ANY,
        validator,
      ]);
      expect(result.rootCause).to.equal(cvError);

      validator.resetHistory();

      typeset = [types.STRING, validator];
      result = impl.checkWithArray(value, typeset);
      expect(validator.callCount).to.equal(1);
      expect(validator.firstCall.args).to.eql([
        value,
        [qualifiers.REQUIRED, types.STRING],
        typeset,
        context,
      ]);
      expect(result).to.be.an.instanceof(RtvError);
      expect(result.valid).to.be.false;
      expect(result.value).to.equal(value);
      expect(result.path).to.eql([]);
      expect(result.typeset).to.equal(typeset);
      expect(result.mismatch).to.eql([
        qualifiers.REQUIRED,
        types.STRING,
        validator,
      ]);
      expect(result.rootCause).to.equal(cvError);

      validator.resetHistory();
      validator.returns(true);

      typeset = [types.STRING, validator];
      result = impl.checkWithArray(value, typeset);
      expect(validator.callCount).to.equal(1);
      expect(validator.firstCall.args).to.eql([
        value,
        [qualifiers.REQUIRED, types.STRING],
        typeset,
        context,
      ]);
      expect(result).to.be.an.instanceof(RtvSuccess);
    });

    it('should invoke a custom validator if present (provided context)', function () {
      const cvError = new Error('custom validator failed');
      const validator = sinon.stub().throws(cvError);
      const value = 'foo';
      const context = {
        originalValue: value,
        parent: undefined,
        parentKey: undefined,
      };

      const typeset = [validator];
      const result = impl.checkWithArray(value, typeset, context);
      expect(validator.callCount).to.equal(1);
      expect(validator.firstCall.args).to.eql([
        value,
        [qualifiers.REQUIRED, types.ANY],
        typeset,
        context,
      ]);
      expect(validator.firstCall.args[3]).to.equal(context); // same provided context
      expect(result).to.be.an.instanceof(RtvError);
      expect(result.valid).to.be.false;
      expect(result.value).to.equal(value);
      expect(result.path).to.eql([]);
      expect(result.typeset).to.equal(typeset);
      expect(result.mismatch).to.eql([
        qualifiers.REQUIRED,
        types.ANY,
        validator,
      ]);
      expect(result.rootCause).to.equal(cvError);
    });

    it('should provide the given context to a custom validator', function () {
      const cvError = new Error('custom validator failed');
      const validator = sinon.stub().throws(cvError);
      const value = { foo: 1 };
      const context = {
        originalValue: value,
        parent: undefined,
        parentKey: undefined,
      };

      const typeset = [validator];
      const result = impl.checkWithArray(value, typeset, context);
      expect(validator.callCount).to.equal(1);
      expect(validator.firstCall.args).to.eql([
        value,
        [qualifiers.REQUIRED, types.ANY],
        typeset,
        context,
      ]);
      expect(validator.firstCall.args[3]).to.equal(context); // same provided context
      expect(validator.firstCall.args[3].originalValue).to.equal(value); // identical value ref
      expect(result).to.be.an.instanceof(RtvError);
      expect(result.valid).to.be.false;
      expect(result.value).to.equal(value);
      expect(result.path).to.eql([]);
      expect(result.typeset).to.equal(typeset);
      expect(result.mismatch).to.eql([
        qualifiers.REQUIRED,
        types.ANY,
        validator,
      ]);
      expect(result.rootCause).to.equal(cvError);
    });

    it('should not invoke a custom validator if no types matched', function () {
      const validator = sinon.stub().throws(new Error('rootCause'));
      const typeset = [types.FINITE, validator];
      const result = impl.checkWithArray('foo', typeset);

      expect(validator.callCount).to.equal(0);
      expect(result).to.be.an.instanceof(RtvError);
      expect(result.valid).to.be.false;
      expect(result.value).to.equal('foo');
      expect(result.path).to.eql([]);
      expect(result.typeset).to.equal(typeset);
      expect(result.mismatch).to.eql([
        qualifiers.REQUIRED,
        types.FINITE,
        validator,
      ]);
      expect(result.rootCause).to.equal(undefined);
    });

    it('should invoke all nested custom validators with respective values', function () {
      const validator1 = sinon.spy();
      const validator2 = sinon.spy();
      const validator3 = sinon.spy();
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

      expect(result).to.be.an.instanceof(RtvSuccess);

      expect(validator1.callCount).to.equal(1);
      expect(validator1.firstCall.args).to.eql([
        'foo',
        [qualifiers.REQUIRED, types.STRING],
        [types.STRING, validator1],
        { originalValue: value, parent: value, parentKey: 'prop1' },
      ]);
      expect(validator1.firstCall.args[3].originalValue).to.equal(value); // identical value ref

      expect(validator2.callCount).to.equal(1);
      expect(validator2.firstCall.args).to.eql([
        77,
        [qualifiers.REQUIRED, types.INT],
        [types.INT, validator2],
        { originalValue: value, parent: value, parentKey: 'prop2' },
      ]);
      expect(validator2.firstCall.args[3].originalValue).to.equal(value); // identical value ref

      expect(validator3.callCount).to.equal(1);
      expect(validator3.firstCall.args).to.eql([
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
      expect(validator3.firstCall.args[3].originalValue).to.equal(value); // identical value ref
    });

    it('should invoke a custom validator when value is null and qualifier is EXPECTED', function () {
      const validator = sinon.stub().returns(true);
      const typeset = [qualifiers.EXPECTED, types.STRING, validator];
      let result = impl.checkWithArray(null, typeset);

      expect(result).be.an.instanceof(RtvSuccess);
      expect(validator.called).to.be.true;
      expect(validator.firstCall.args).to.eql([
        null,
        [qualifiers.EXPECTED, types.STRING],
        typeset,
        { originalValue: null, parent: undefined, parentKey: undefined },
      ]);

      validator.resetHistory();

      typeset[0] = qualifiers.OPTIONAL;
      result = impl.checkWithArray(undefined, typeset);

      expect(result).be.an.instanceof(RtvSuccess);
      expect(validator.called).to.be.true;
      expect(validator.firstCall.args).to.eql([
        undefined,
        [qualifiers.OPTIONAL, types.STRING],
        typeset,
        { originalValue: undefined, parent: undefined, parentKey: undefined },
      ]);
    });

    it('should capture a nested custom validator error as RtvError#failure', function () {
      const cvError = new Error('custom validator failed');
      const validator = sinon.spy(function (v) {
        if (v === 'bar') {
          throw cvError;
        }
      });
      const value = [['foo', 'bar']];
      const context = { originalValue: value, parent: value[0], parentKey: 1 };

      const typeset = [types.ARRAY, { ts: [types.ARRAY, { ts: validator }] }];
      const result = impl.checkWithArray(value, typeset);

      // the validator should get called 2 times, and fail only the second time
      expect(validator.callCount).to.equal(2); // 'bar' is second element
      expect(validator.secondCall.args).to.eql([
        'bar',
        [qualifiers.REQUIRED, types.ANY],
        validator,
        context,
      ]);

      // the resulting RtvError should represent the original check and should
      //  have a path that points to the 'bar' element in the nested array that
      //  failed validation
      expect(result).to.be.an.instanceof(RtvError);
      expect(result.valid).to.be.false;
      expect(result.value).to.equal(value);
      expect(result.path).to.eql(['0', '1']);
      expect(result.typeset).to.equal(typeset);
      expect(result.mismatch).to.eql([
        qualifiers.REQUIRED,
        types.ANY,
        validator,
      ]);
      expect(result.rootCause).to.equal(cvError); // points to the error thrown by nested validator
    });

    describe('Options', function () {
      it('should assume typeset is valid', function () {
        const isTypesetStub = sinon.stub(isTypesetMod, 'check').callThrough();

        expect(function () {
          impl.checkWithArray(1, ['invalid-type'], undefined, {
            isTypeset: true,
          });
        }).to.throw(/Invalid Array typeset/);

        // should only be called once, as a result of checkWithArray() calling extractNextType()
        //  (checkWithArray()'s call to isTypeset() should be avoided)
        expect(isTypesetStub.callCount).to.equal(1);

        isTypesetStub.restore();
      });

      it('should use the given qualifier', function () {
        const result = impl.checkWithArray(NaN, [types.NUMBER], undefined, {
          qualifier: qualifiers.EXPECTED,
        });
        expect(result).to.be.an.instanceof(RtvSuccess);
      });
    });

    describe('Exceptions', function () {
      it('should throw if the typeset is not an Array', function () {
        expect(function () {
          impl.checkWithArray(1, {});
        }).to.throw(/Invalid typeset in array/);
      });

      it('should throw if the typeset is not valid', function () {
        expect(function () {
          impl.checkWithArray(1, ['invalid-type']);
        }).to.throw(/Invalid typeset in array/);
      });
    });
  });

  describe('#check()', function () {
    it('should return an RtvSuccess on successful validation', function () {
      expect(impl.check(1, [types.FINITE])).to.be.an.instanceof(RtvSuccess);
    });

    it('should return an RtvError with correct properties on failed validation', function () {
      let value = 1;
      let typeset = types.STRING;
      let err = impl.check(value, typeset);
      expect(err).to.be.an.instanceof(RtvError);
      expect(err.value).to.equal(value);
      expect(err.path).to.eql([]);
      expect(err.typeset).to.equal(typeset);
      expect(err.mismatch).to.eql([qualifiers.REQUIRED, types.STRING]);
      expect(err.rootCause).to.equal(undefined);

      const cvError = new Error('badness');
      typeset = function () {
        throw cvError;
      };
      err = impl.check(value, typeset);
      expect(err).to.be.an.instanceof(RtvError);
      expect(err.value).to.equal(value);
      expect(err.path).to.eql([]);
      expect(err.typeset).to.equal(typeset);
      expect(err.mismatch).to.eql([qualifiers.REQUIRED, types.ANY, typeset]); // validator alone means ANY
      expect(err.rootCause).to.equal(cvError);

      value = { foo: 'bar' };
      typeset = { foo: types.FINITE };
      err = impl.check(value, typeset);
      expect(err).to.be.an.instanceof(RtvError);
      expect(err.value).to.equal(value);
      expect(err.path).to.eql(['foo']);
      expect(err.typeset).to.equal(typeset);
      expect(err.mismatch).to.eql([qualifiers.REQUIRED, types.FINITE]);
      expect(err.rootCause).to.equal(undefined);

      value = { foo: { bar: { baz: -1 } } };
      typeset = {
        foo: {
          bar: {
            baz: [types.STRING, types.FINITE, { oneOf: 0 }],
          },
        },
      };
      err = impl.check(value, typeset);
      expect(err).to.be.an.instanceof(RtvError);
      expect(err.value).to.equal(value);
      expect(err.path).to.eql(['foo', 'bar', 'baz']);
      expect(err.typeset).to.equal(typeset);
      expect(err.mismatch).to.eql([
        qualifiers.REQUIRED,
        types.STRING,
        types.FINITE,
        { oneOf: 0 },
      ]);
      expect(err.rootCause).to.equal(undefined);

      value = 1;
      typeset = [types.STRING];
      err = impl.check(value, typeset);
      expect(err).to.be.an.instanceof(RtvError);
      expect(err.value).to.equal(value);
      expect(err.path).to.eql([]);
      expect(err.typeset).to.equal(typeset);
      expect(err.mismatch).to.eql([qualifiers.REQUIRED, types.STRING]);
      expect(err.rootCause).to.equal(undefined);
    });

    it('should check a string value as a string', function () {
      expect(impl.check('foo', types.STRING)).to.be.an.instanceof(RtvSuccess);
    });

    it('should not check a string value as a boolean', function () {
      expect(impl.check('foo', types.BOOLEAN)).to.be.an.instanceof(RtvError);
    });

    it('should invoke a custom validator', function () {
      const cvError = new Error('custom validator failed');
      const validator = sinon.stub().throws(cvError);
      const result = impl.check('foo', validator);

      expect(validator.callCount).to.equal(1);
      expect(validator.firstCall.args).to.eql([
        'foo',
        [qualifiers.REQUIRED, types.ANY],
        validator,
        { originalValue: 'foo', parent: undefined, parentKey: undefined },
      ]);
      expect(result).to.be.an.instanceof(RtvError);
      expect(result.valid).to.be.false;
      expect(result.value).to.equal('foo');
      expect(result.path).to.eql([]);
      expect(result.typeset).to.equal(validator);
      expect(result.mismatch).to.eql([
        qualifiers.REQUIRED,
        types.ANY,
        validator,
      ]);
      expect(result.rootCause).to.equal(cvError);
    });

    it(`should not call the validator if the "${types.ANY}" validator fails`, function () {
      const stub = sinon.stub(isAnyMod, 'check').returns(false);
      const validator = sinon.spy();

      impl.check(1, validator);
      expect(validator.called).to.be.false;

      stub.restore();
    });

    describe('Options', function () {
      it('should not validate the typeset if isTypeset is true', function () {
        const isTypesetSpy = sinon.stub(isTypesetMod, 'check').callThrough();

        impl.check(1, types.FINITE, undefined, { isTypeset: true });
        expect(isTypesetSpy.called).to.be.false;

        isTypesetSpy.restore();
      });

      it('should use the qualifier if specified', function () {
        const validator = sinon.stub().returns(true);

        impl.check(1, validator, undefined, { qualifier: qualifiers.OPTIONAL });
        expect(validator.getCall(0).args).to.eql([
          1, // value
          [qualifiers.OPTIONAL, types.ANY], // FQ match
          validator, // typeset
          { originalValue: 1, parent: undefined, parentKey: undefined },
        ]);
      });
    });

    describe('Exceptions', function () {
      it('should throw if typeset is invalid (simple)', function () {
        let err;
        try {
          impl.check(1, 'foo');
        } catch (checkErr) {
          err = checkErr;
        }

        expect(err).to.be.an.instanceof(Error);
        expect(err.message.indexOf('Invalid typeset=')).to.equal(0);
      });

      it('should throw if typeset is invalid (nested)', function () {
        let err;
        try {
          impl.check({ foo: { bar: 1 } }, { foo: { bar: 'baz' } });
        } catch (checkErr) {
          err = checkErr;
        }

        expect(err).to.be.an.instanceof(Error);
        expect(err.message.indexOf('Invalid typeset')).to.equal(0);
      });

      it('should throw if typeset type is not supported', function () {
        const isTypesetStub = sinon.stub(isTypesetMod, 'check').returns(true);

        let err;
        try {
          impl.check(1, /asdf/);
        } catch (checkErr) {
          err = checkErr;
        }

        expect(err).to.be.an.instanceof(Error);
        expect(
          err.message.indexOf('Invalid JavaScript type for typeset')
        ).to.equal(0);

        isTypesetStub.restore();
      });
    });
  });
});
