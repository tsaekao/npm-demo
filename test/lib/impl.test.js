import {expect} from 'chai';
import sinon from 'sinon';

import '../../src/rtv'; // so that types get registered with `impl`
import impl from '../../src/lib/impl';
import {DEFAULT_OBJECT_TYPE, default as types} from '../../src/lib/types';
import {DEFAULT_QUALIFIER, default as qualifiers} from '../../src/lib/qualifiers';
import RtvSuccess from '../../src/lib/RtvSuccess';
import RtvError from '../../src/lib/RtvError';
import isObject from '../../src/lib/validation/isObject';
import isFunction from '../../src/lib/validation/isFunction';
import * as isTypesetMod from '../../src/lib/validation/isTypeset';
import * as isAnyMod from '../../src/lib/validation/isAny';

describe('module: lib/impl', function() {
  describe('._validatorMap', function() {
    it('should be an internal property', function() {
      expect(Object.getOwnPropertyDescriptor(impl, '_validatorMap')).to.eql({
        enumerable: false,
        configurable: true,
        writable: true,
        value: impl._validatorMap
      });
      expect(isObject(impl._validatorMap)).to.be.true;
      expect(Object.keys(impl._validatorMap).length).to.equal(26); // # of known types
    });
  });

  describe('#_registerType()', function() {
    const errorRE = /Cannot register an invalid validator/;
    let validator;
    let stringValidator;

    beforeEach(function() {
      stringValidator = impl._validatorMap[types.STRING];
      validator = {
        type: types.STRING,
        config: function() {},
        default: function() {}
      };
    });

    afterEach(function() {
      impl._validatorMap[types.STRING] = stringValidator;
    });

    it('should be an internal method', function() {
      expect(Object.getOwnPropertyDescriptor(impl, '_registerType')).to.eql({
        enumerable: false,
        configurable: true,
        writable: true,
        value: impl._registerType
      });
      expect(isFunction(impl._registerType)).to.be.true;
    });

    it('should throw if validator is invalid: not an object', function() {
      expect(impl._registerType.bind(impl, 'foo')).to.throw(errorRE);
    });

    it('should throw if validator is invalid: unknown type', function() {
      validator.type = 'unknown';
      expect(impl._registerType.bind(impl, validator)).to.throw(errorRE);
    });

    it('should throw if validator is invalid: missing .type', function() {
      delete validator.type;
      expect(impl._registerType.bind(impl, validator)).to.throw(errorRE);
    });

    it('should throw if validator is invalid: missing #config()', function() {
      validator.config = 123;
      expect(impl._registerType.bind(impl, validator)).to.throw(errorRE);
    });

    it('should throw if validator is invalid: missing #default()', function() {
      validator.default = 123;
      expect(impl._registerType.bind(impl, validator)).to.throw(errorRE);
    });
  });

  describe('#getQualifier()', function() {
    it('should not require a valid typeset', function() {
      expect(function() {
        impl.getQualifier(true);
      }).to.not.throw();
    });

    it('should assume the default qualifier for an invalid typeset', function() {
      expect(impl.getQualifier(/invalid/)).to.equal(DEFAULT_QUALIFIER);
    });

    it('should use the default qualifier if none specified', function() {
      expect(impl.getQualifier({})).to.equal(DEFAULT_QUALIFIER);
      expect(impl.getQualifier([types.STRING])).to.equal(DEFAULT_QUALIFIER);
    });

    it('should return specified qualifier', function() {
      expect(impl.getQualifier([qualifiers.OPTIONAL, types.STRING]))
        .to.equal(qualifiers.OPTIONAL);
    });
  });

  describe('#toTypeset()', function() {
    describe('Exceptions', function() {
      it('should throw if given an invalid type', function() {
        expect(function() {
          impl.toTypeset('invalid-type');
        }).to.throw(/Invalid value for "types" enumeration/);
      });

      it('should throw if given an invalid qualifier', function() {
        expect(function() {
          impl.toTypeset(types.BOOLEAN, 'invalid-qualifier');
        }).to.throw(/Invalid value for "qualifiers" enumeration/);
      });

      it('should throw if args are given for a type that does not take any', function() {
        expect(function() {
          impl.toTypeset(types.BOOLEAN, {});
        }).to.throw(/Invalid value for "argTypes" enumeration/);
      });

      it('should throw if non-undefined, non-boolean falsy value given for args', function() {
        expect(function() {
          impl.toTypeset(types.STRING, 0);
        }).to.throw(/Invalid type args/);

        expect(function() {
          impl.toTypeset(types.STRING, null);
        }).to.throw(/Invalid type args/);

        expect(function() {
          impl.toTypeset(types.STRING, '');
        }).to.throw(/Invalid type args/);

        expect(function() {
          impl.toTypeset(types.STRING, false); // interpreted as fullyQualified option
        }).not.to.throw(/Invalid type args/);

        expect(function() {
          impl.toTypeset(types.STRING, undefined); // ignored
        }).not.to.throw(/Invalid type args/);
      });

      it('should throw if args given twice', function() {
        expect(function() {
          impl.toTypeset(types.STRING, {}, {});
        }).to.throw(/args parameter already specified/);
      });

      it('should throw if parameters in wrong order', function() {
        expect(function() {
          impl.toTypeset(types.STRING, false, {});
        }).to.throw(/Expecting qualifier or args as the second parameter/);

        expect(function() {
          impl.toTypeset(types.STRING, false, DEFAULT_QUALIFIER);
        }).to.throw(/Expecting qualifier or args as the second parameter/);

        expect(function() {
          impl.toTypeset(types.STRING, {}, DEFAULT_QUALIFIER);
        }).to.throw(/args parameter already specified/);
      });

      it('should validate type, qualifier, and args', function() {
        expect(function() {
          impl.toTypeset('foo');
        }).to.throw(/Invalid value for "types" enum/);

        expect(function() {
          impl.toTypeset(types.FINITE, 'foo');
        }).to.throw(/Invalid value for "qualifiers" enum/);

        expect(function() {
          impl.toTypeset(types.FINITE, DEFAULT_QUALIFIER, []);
        }).to.throw(/Invalid type args/);
      });
    });

    describe('optional parameters', function() {
      it('should ignore undefined parameters', function() {
        expect(impl.toTypeset(types.STRING, undefined, true))
          .to.eql([DEFAULT_QUALIFIER, types.STRING]);

        expect(impl.toTypeset(types.STRING, undefined, {}))
          .to.eql([types.STRING, {}]);

        expect(impl.toTypeset(types.STRING, qualifiers.OPTIONAL, undefined, true))
          .to.eql([qualifiers.OPTIONAL, types.STRING]);

        expect(impl.toTypeset(types.STRING, qualifiers.OPTIONAL, undefined, undefined, {}, true))
          .to.eql([qualifiers.OPTIONAL, types.STRING, {}]);
      });
    });

    describe('non-qualified', function() {
      let otherQualifiers;

      beforeEach(function() {
        otherQualifiers = qualifiers.$values.filter((q) => q !== DEFAULT_QUALIFIER);
      });

      it('should return an array typeset when the qualifier is not the default', function() {
        otherQualifiers.forEach(function(q) {
          expect(impl.toTypeset(types.FINITE, q)).to.eql([q, types.FINITE]);
        });
      });

      it('should return an array typeset when args are specified', function() {
        const args = {max: 3};

        expect(impl.toTypeset(types.FINITE, args)).to.eql([types.FINITE, args]);
        expect(impl.toTypeset(types.FINITE, DEFAULT_QUALIFIER, args)).to.eql([types.FINITE, args]);

        otherQualifiers.forEach(function(q) {
          expect(impl.toTypeset(types.FINITE, q, args)).to.eql([q, types.FINITE, args]);
        });
      });

      it('should return a string typeset if given just a string typeset', function() {
        expect(impl.toTypeset(types.BOOLEAN)).to.equal(types.BOOLEAN);
      });

      it('should return just a string typeset when the default qualifier is used', function() {
        expect(impl.toTypeset(types.BOOLEAN, DEFAULT_QUALIFIER)).to.equal(types.BOOLEAN);
      });

      it('should return an Array typeset if not using the default qualifier', function() {
        expect(impl.toTypeset(types.BOOLEAN, qualifiers.EXPECTED))
          .to.eql([qualifiers.EXPECTED, types.BOOLEAN]);
      });

      it('should return an Array typeset when a type and args are provided', function() {
        expect(impl.toTypeset(types.HASH_MAP, {count: 2})).to.eql([types.HASH_MAP, {count: 2}]);
      });

      it('should return an Array typeset given a type, qualifier, and args', function() {
        expect(impl.toTypeset(types.PLAIN_OBJECT, qualifiers.OPTIONAL, {}))
          .to.eql([qualifiers.OPTIONAL, types.PLAIN_OBJECT, {}]);
      });
    });

    describe('fully-qualified', function() {
      it('should return an Array typeset given a type', function() {
        expect(impl.toTypeset(types.BOOLEAN, true)).to.eql([DEFAULT_QUALIFIER, types.BOOLEAN]);
      });

      it('should return an Array typeset given a type and qualifier', function() {
        expect(impl.toTypeset(types.STRING, qualifiers.EXPECTED, true))
          .to.eql([qualifiers.EXPECTED, types.STRING]);
      });

      it('should return an Array typeset given a type and args', function() {
        expect(impl.toTypeset(types.HASH_MAP, {count: 2}, true))
          .to.eql([DEFAULT_QUALIFIER, types.HASH_MAP, {count: 2}]);
      });

      it('should return an Array typeset given a type, qualifier, and args', function() {
        expect(impl.toTypeset(types.HASH_MAP, qualifiers.OPTIONAL, {count: 2}, true))
          .to.eql([qualifiers.OPTIONAL, types.HASH_MAP, {count: 2}]);
      });

      it('should produce fully-qualified typesets', function() {
        // without args
        expect(impl.toTypeset(types.FINITE, true)).to.eql(
            [DEFAULT_QUALIFIER, types.FINITE]);
        qualifiers.$values.forEach(function(q) {
          expect(impl.toTypeset(types.FINITE, q, true)).to.eql([q, types.FINITE]);
        });

        const args = {max: 3};
        qualifiers.$values.forEach(function(q) {
          expect(impl.toTypeset(types.FINITE, q, args, true)).to.eql([q, types.FINITE, args]);
        });
      });
    });
  });

  describe('#fullyQualify()', function() {
    it('should validate the type', function() {
      expect(function() {
        impl.fullyQualify('foo');
      }).to.throw(/Invalid typeset="foo"/);
    });

    it('should validate the qualifier', function() {
      expect(function() {
        impl.fullyQualify(types.STRING, 'foo');
      }).to.throw(/Invalid value for "qualifiers" enum/);
    });

    it('should FQ string typesets', function() {
      expect(impl.fullyQualify(types.STRING)).to.eql([DEFAULT_QUALIFIER, types.STRING]);
    });

    it('should FQ object typesets', function() {
      const shape = {};
      const fqts = impl.fullyQualify(shape);
      expect(fqts).to.eql([DEFAULT_QUALIFIER, DEFAULT_OBJECT_TYPE, {$: shape}]);
      expect(fqts[2].$).to.equal(shape); // objects within are not cloned
    });

    it('should FQ function typesets', function() {
      const fn = function() {};
      let fqts = impl.fullyQualify(fn);
      expect(fqts).to.eql([DEFAULT_QUALIFIER, types.ANY, fn]);
      expect(fqts[2]).to.equal(fn); // objects within are not cloned

      fqts = impl.fullyQualify([fn]);
      expect(fqts).to.eql([DEFAULT_QUALIFIER, types.ANY, fn]);
      expect(fqts[2]).to.equal(fn); // objects within are not cloned
    });

    it('should FQ array typesets', function() {
      let ts = [types.FINITE];
      let fqts = impl.fullyQualify(ts);
      expect(ts).not.to.equal(fqts); // should be a new array
      expect(fqts).to.eql([DEFAULT_QUALIFIER, types.FINITE]);

      ts = [types.JSON, function(v) {}];
      fqts = impl.fullyQualify(ts);
      expect(ts).not.to.equal(fqts); // should be a new array
      expect(fqts).to.eql([DEFAULT_QUALIFIER, types.JSON, ts[1]]);

      ts = [[types.FLOAT]];
      fqts = impl.fullyQualify(ts);
      expect(ts).not.to.equal(fqts); // should be a new array
      expect(fqts).to.eql([DEFAULT_QUALIFIER, types.ARRAY,
        {ts: [types.FLOAT]}]); // not deep

      const shape = {};
      ts = [shape, [types.STRING]];
      fqts = impl.fullyQualify(ts);
      expect(ts).not.to.equal(fqts); // should be a new array
      expect(fqts).to.eql([DEFAULT_QUALIFIER, DEFAULT_OBJECT_TYPE, {$: shape},
        types.ARRAY, {ts: [types.STRING]}]); // object is treated as shape, not array params
      expect(fqts[2].$).to.equal(shape); // same object, not cloned

      ts = [types.FINITE, [types.STRING]];
      fqts = impl.fullyQualify(ts);
      expect(ts).not.to.equal(fqts); // should be a new array
      expect(fqts).to.eql([DEFAULT_QUALIFIER, types.FINITE, types.ARRAY,
        {ts: [types.STRING]}]);

      ts = [types.ARRAY, {ts: types.STRING}];
      fqts = impl.fullyQualify(ts);
      expect(ts).not.to.equal(fqts); // should be a new array
      expect(fqts).to.eql([DEFAULT_QUALIFIER, types.ARRAY, {ts: types.STRING}]);

      const args = {min: 1, ts: [types.STRING]};
      ts = [shape, types.ARRAY, args];
      fqts = impl.fullyQualify(ts);
      expect(ts).not.to.equal(fqts); // should be a new array
      expect(fqts).to.eql([DEFAULT_QUALIFIER, DEFAULT_OBJECT_TYPE, {$: shape},
        types.ARRAY, args]);
      expect(fqts[2].$).to.equal(shape); // same object, not cloned
      expect(fqts[4]).to.equal(args); // same object, not cloned
    });

    it('should throw if typeset is invalid', function() {
      const re = /Invalid typeset=/;

      expect(function() { impl.fullyQualify([]); }).to.throw(re);
      expect(function() { impl.fullyQualify('foo'); }).to.throw(re);
      expect(function() { impl.fullyQualify(/asdf/); }).to.throw(re);
      expect(function() { impl.fullyQualify(null); }).to.throw(re);
      expect(function() { impl.fullyQualify(undefined); }).to.throw(re);
      expect(function() { impl.fullyQualify(1); }).to.throw(re);
      expect(function() { impl.fullyQualify(true); }).to.throw(re);
      expect(function() { impl.fullyQualify(new Map()); }).to.throw(re);
      expect(function() { impl.fullyQualify(Symbol('asdf')); }).to.throw(re);
    });

    it('should accept a qualifier override', function() {
      expect(impl.fullyQualify(types.STRING, qualifiers.EXPECTED))
        .to.eql([qualifiers.EXPECTED, types.STRING]);

      const shape = {foo: 1};
      expect(impl.fullyQualify(shape, qualifiers.OPTIONAL))
        .to.eql([qualifiers.OPTIONAL, DEFAULT_OBJECT_TYPE, {$: shape}]);

      const validator = function() {};
      expect(impl.fullyQualify(validator, qualifiers.EXPECTED))
        .to.eql([qualifiers.EXPECTED, types.ANY, validator]);

      expect(impl.fullyQualify([qualifiers.REQUIRED, types.STRING]))
        .to.eql([DEFAULT_QUALIFIER, types.STRING]);

      expect(impl.fullyQualify([qualifiers.REQUIRED, types.STRING], qualifiers.EXPECTED))
        .to.eql([qualifiers.EXPECTED, types.STRING]);
    });
  });

  describe('#extractNextType()', function() {
    it('should use the specified qualifier unless a qualifier is found', function() {
      let typeset = [qualifiers.EXPECTED, types.FUNCTION];
      let nextType = impl.extractNextType(typeset, qualifiers.OPTIONAL);

      expect(typeset).to.eql([]);
      expect(nextType).to.eql([qualifiers.EXPECTED, types.FUNCTION]);

      typeset = [types.FUNCTION];
      nextType = impl.extractNextType(typeset, qualifiers.OPTIONAL);

      expect(typeset).to.eql([]);
      expect(nextType).to.eql([qualifiers.OPTIONAL, types.FUNCTION]);
    });

    it('should use the qualifier, if any, if qualifier=true', function() {
      expect(impl.extractNextType([types.STRING], true)).to.eql([types.STRING]);
      expect(impl.extractNextType([qualifiers.REQUIRED, types.STRING], true))
        .to.eql([qualifiers.REQUIRED, types.STRING]);
      expect(impl.extractNextType([qualifiers.REQUIRED, types.STRING], false))
        .to.eql([types.STRING]);
    });

    it('should handle simple string types', function() {
      let typeset = [types.STRING, types.FINITE];
      let nextType = impl.extractNextType(typeset);

      expect(typeset).to.eql([types.FINITE]);
      expect(nextType).to.eql([types.STRING]);

      const args = {};
      const val = function() {};

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

      expect(function() {
        impl.extractNextType([types.BOOLEAN, args]);
      }).to.throw(/Invalid Array typeset/);
    });

    it('should handle shapes', function() {
      const shape = {foo: types.STRING};
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

    it('should handle arrays', function() {
      const arr = [types.STRING];
      let typeset = [arr];
      let nextType = impl.extractNextType(typeset);

      expect(typeset).to.eql([]);
      expect(nextType).to.eql([arr]);

      typeset = [arr];
      nextType = impl.extractNextType(typeset, qualifiers.REQUIRED);

      expect(typeset).to.eql([]);
      expect(nextType).to.eql([qualifiers.REQUIRED, arr]);

      const args = {ts: arr};
      typeset = [types.ARRAY, args];
      nextType = impl.extractNextType(typeset);

      expect(typeset).to.eql([]);
      expect(nextType).to.eql([types.ARRAY, args]);
    });

    it('should handle validators', function() {
      const val = function() {};
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

    it('should allow an empty array as the typeset', function() {
      expect(function() {
        impl.extractNextType([]);
      }).not.to.throw(/Invalid array typeset/);
      expect(impl.extractNextType([])).to.eql([]);
    });
  });

  describe('#_getCheckOptions()', function() {
    it('should return new default options if no current or override given', function() {
      expect(impl._getCheckOptions()).to.eql({
        path: [],
        isTypeset: false,
        qualifier: undefined
      });
    });

    it('should use current options', function() {
      let options = impl._getCheckOptions({
        path: [1],
        isTypeset: true,
        qualifier: qualifiers.EXPECTED,
        foo: 1
      });
      expect(options).to.eql({
        path: [1],
        isTypeset: true,
        qualifier: qualifiers.EXPECTED
      });
      // should not include extra property 'foo'
      expect(Object.keys(options)).to.eql(['path', 'isTypeset', 'qualifier']);

      // other properties are defaults
      options = impl._getCheckOptions({isTypeset: true});
      expect(options).to.eql({path: [], isTypeset: true, qualifier: undefined});
    });

    it('should use override options', function() {
      let options = impl._getCheckOptions(undefined,
          {path: [1], isTypeset: true, qualifier: 'string', foo: 1});
      expect(options).to.eql({
        path: [1],
        isTypeset: true,
        qualifier: 'string'
      });
      // should not include extra property 'foo'
      expect(Object.keys(options)).to.eql(['path', 'isTypeset', 'qualifier']);

      // other properties are defaults
      options = impl._getCheckOptions(undefined, {isTypeset: true});
      expect(options).to.eql({path: [], isTypeset: true, qualifier: undefined});
    });

    it('should require current.path to be an array', function() {
      expect(function() {
        impl._getCheckOptions({path: [1]});
      }).not.to.throw(/current.path must be an Array/);

      expect(function() {
        impl._getCheckOptions({path: 1});
      }).to.throw(/current.path must be an Array/);
    });

    it('should require override.path to be an array', function() {
      expect(function() {
        impl._getCheckOptions(undefined, {path: [1]});
      }).not.to.throw(/override.path must be an Array/);

      expect(function() {
        impl._getCheckOptions(undefined, {path: 1});
      }).to.throw(/override.path must be an Array/);
    });
  });

  describe('#checkWithType()', function() {
    describe('Exceptions', function() {
      it('should throw if type is not valid unless options.isTypeset is true', function() {
        expect(function() {
          impl.checkWithType('value', 'foo');
        }).to.throw(/Invalid typeset in singleType="foo"/);

        expect(function() {
          impl.checkWithType('value', 1);
        }).to.throw(/Invalid typeset in singleType=1/);

        expect(function() {
          impl.checkWithType('value', []);
        }).to.throw(/Invalid typeset in singleType=\[\]/);

        expect(function() {
          impl.checkWithType('value', 'foo', {isTypeset: true});
        }).not.to.throw(/Invalid typeset in singleType="foo"/);
      });

      it('should throw if type is not handled', function() {
        const typesVerifyStub = sinon.stub(types, 'verify').returns('foo');
        expect(function() {
          impl.checkWithType(2, 'foo', {isTypeset: true, qualifier: DEFAULT_QUALIFIER});
        }).to.throw(/Missing validator for type="foo"/);
        typesVerifyStub.restore();
      });

      it('should throw if more than one type is given', function() {
        expect(function() {
          impl.checkWithType(2, [types.STRING, types.NUMBER]);
        }).to.throw(/Specified singleType=.+ typeset must represent a single type/);
      });

      it('should throw if single type is not a string, shape, or Array', function() {
        expect(function() {
          impl.checkWithType(2, function() {});
        }).to.throw(/Specified singleType=.+ must be a string, shape, or Array/);
      });
    });

    it('should check simple types against values', function() {
      expect(impl.checkWithType(1, types.FINITE)).to.be.an.instanceof(RtvSuccess);
      expect(impl.checkWithType(1, [types.FINITE, {min: 2}])).to.be.an.instanceof(RtvError);
    });

    it('should check shapes against values', function() {
      expect(impl.checkWithType({name: 'Fred'}, {name: types.STRING}))
        .to.be.an.instanceof(RtvSuccess);
    });

    it('should check single type Array typesets against values', function() {
      expect(impl.checkWithType(/foo/, [types.REGEXP])).to.be.an.instanceof(RtvSuccess);
      expect(impl.checkWithType({name: 'Fred'}, [{name: types.STRING}]))
        .to.be.an.instanceof(RtvSuccess);
    });

    it('should use the options.qualifier if specified', function() {
      expect(impl.checkWithType('', types.STRING))
        .to.be.an.instanceof(RtvError);
      expect(impl.checkWithType('', [types.STRING]))
        .to.be.an.instanceof(RtvError);
      expect(impl.checkWithType('', [qualifiers.EXPECTED, types.STRING]))
        .to.be.an.instanceof(RtvSuccess);
      expect(impl.checkWithType('', types.STRING, {qualifier: qualifiers.EXPECTED}))
        .to.be.an.instanceof(RtvSuccess);
      expect(impl.checkWithType('', [types.STRING], {qualifier: qualifiers.EXPECTED}))
        .to.be.an.instanceof(RtvSuccess);
      expect(impl.checkWithType('', [qualifiers.EXPECTED, types.STRING],
          {qualifier: qualifiers.REQUIRED})).to.be.an.instanceof(RtvError);
    });

    it('should append the type error path to options.path', function() {
      const err = impl.checkWithType({foo: 3}, [{foo: types.STRING}], {path: ['a', 'b']});
      expect(err).to.be.an.instanceof(RtvError);
      expect(err.path).to.eql(['a', 'b', 'foo']);
    });
  });

  describe('#checkWithShape()', function() {
    it('should check the value as the implied default object type', function() {
      expect(impl.checkWithShape({foo: 1}, {foo: types.FINITE})).to.be.an.instanceof(RtvSuccess);
      expect(impl.checkWithShape([{foo: 1}], {foo: types.FINITE})).to.be.an.instanceof(RtvError);
    });

    it('should use given options', function() {
      expect(impl.checkWithShape(null, {foo: types.BOOLEAN}, {qualifier: qualifiers.EXPECTED}))
        .to.be.an.instanceof(RtvSuccess);
    });

    describe('null and undefined properties', function() {
      it('should disallow null and undefined properties when qualified as REQUIRED', function() {
        const typeset = {foo: types.STRING};
        expect(impl.checkWithShape({}, typeset)).to.be.an.instanceof(RtvError);
        expect(impl.checkWithShape({foo: undefined}, typeset)).to.be.an.instanceof(RtvError);
        expect(impl.checkWithShape({foo: null}, typeset)).to.be.an.instanceof(RtvError);
      });

      it('should disallow undefined properties when qualified as EXPECTED', function() {
        const typeset = {foo: [qualifiers.EXPECTED, types.STRING]};
        expect(impl.checkWithShape({}, typeset)).to.be.an.instanceof(RtvError);
        expect(impl.checkWithShape({foo: undefined}, typeset)).to.be.an.instanceof(RtvError);
        expect(impl.checkWithShape({foo: null}, typeset)).to.be.an.instanceof(RtvSuccess);
      });

      it('should allow null and undefined properties when qualified as OPTIONAL', function() {
        const typeset = {foo: [qualifiers.OPTIONAL, types.STRING]};
        expect(impl.checkWithShape({}, typeset)).to.be.an.instanceof(RtvSuccess);
        expect(impl.checkWithShape({foo: undefined}, typeset)).to.be.an.instanceof(RtvSuccess);
        expect(impl.checkWithShape({foo: null}, typeset)).to.be.an.instanceof(RtvSuccess);
      });

      it('should look up the prototype chain correctly', function() {
        const typeset = {foo: types.STRING};
        expect(impl.checkWithShape(Object.create({foo: 'bar'}), typeset))
          .to.be.an.instanceof(RtvSuccess);

        typeset.foo = [qualifiers.EXPECTED, typeset.foo];
        expect(impl.checkWithShape(Object.create({foo: null}), typeset))
          .to.be.an.instanceof(RtvSuccess);
      });
    });

    describe('Exceptions', function() {
      it('should throw if a shape is not given', function() {
        expect(function() {
          impl.checkWithShape({foo: 1}, []);
        }).to.throw(/Invalid shape/);
      });
    });
  });

  describe('#checkWithArray()', function() {
    it('should check a value against a simple Array typeset', function() {
      const result = impl.checkWithArray(Symbol(1), [types.SYMBOL]);
      expect(result).to.be.an.instanceof(RtvSuccess);
    });

    it('should check a value against a complex Array typeset', function() {
      const result = impl.checkWithArray(7, [
        types.STRING,
        types.REGEXP,
        types.FUNCTION,
        types.FINITE, {min: 8},
        types.NUMBER, {oneOf: 7} // match
      ]);
      expect(result).to.be.an.instanceof(RtvSuccess);
    });

    it('should invoke a custom validator if present', function() {
      const cvError = new Error('custom validator failed');
      const validator = sinon.stub().throws(cvError);

      let typeset = [validator];
      let result = impl.checkWithArray('foo', typeset);
      expect(validator.callCount).to.equal(1);
      expect(validator.firstCall.args).to.eql([
        'foo',
        [qualifiers.REQUIRED, types.ANY],
        typeset
      ]);
      expect(result).to.be.an.instanceof(RtvError);
      expect(result.valid).to.be.false;
      expect(result.value).to.equal('foo');
      expect(result.path).to.eql([]);
      expect(result.typeset).to.equal(typeset);
      expect(result.cause).to.eql([qualifiers.REQUIRED, types.ANY, validator]);
      expect(result.failure).to.equal(cvError);

      validator.resetHistory();

      typeset = [types.STRING, validator];
      result = impl.checkWithArray('foo', typeset);
      expect(validator.callCount).to.equal(1);
      expect(validator.firstCall.args).to.eql([
        'foo',
        [qualifiers.REQUIRED, types.STRING],
        typeset
      ]);
      expect(result).to.be.an.instanceof(RtvError);
      expect(result.valid).to.be.false;
      expect(result.value).to.equal('foo');
      expect(result.path).to.eql([]);
      expect(result.typeset).to.equal(typeset);
      expect(result.cause).to.eql([qualifiers.REQUIRED, types.STRING, validator]);
      expect(result.failure).to.equal(cvError);

      validator.resetHistory();
      validator.returns(true);

      typeset = [types.STRING, validator];
      result = impl.checkWithArray('foo', typeset);
      expect(validator.callCount).to.equal(1);
      expect(validator.firstCall.args).to.eql([
        'foo',
        [qualifiers.REQUIRED, types.STRING],
        typeset
      ]);
      expect(result).to.be.an.instanceof(RtvSuccess);
    });

    it('should not invoke a custom validator if no types matched', function() {
      const validator = sinon.stub().throws(new Error('failure'));
      const typeset = [types.FINITE, validator];
      const result = impl.checkWithArray('foo', typeset);
      expect(validator.callCount).to.equal(0);
      expect(result).to.be.an.instanceof(RtvError);
      expect(result.valid).to.be.false;
      expect(result.value).to.equal('foo');
      expect(result.path).to.eql([]);
      expect(result.typeset).to.equal(typeset);
      expect(result.cause).to.eql([qualifiers.REQUIRED, types.FINITE, validator]);
      expect(result.failure).to.equal(undefined);
    });

    describe('Options', function() {
      it('should assume typeset is valid', function() {
        const isTypesetStub = sinon.stub(isTypesetMod, 'default').callThrough();

        expect(function() {
          impl.checkWithArray(1, ['invalid-type'], {isTypeset: true});
        }).to.throw(/Invalid Array typeset/);

        // should only be called once, as a result of checkWithArray() calling extractNextType()
        //  (checkWithArray()'s call to isTypeset() should be avoided)
        expect(isTypesetStub.callCount).to.equal(1);

        isTypesetStub.restore();
      });

      it('should use the given qualifier', function() {
        const result = impl.checkWithArray(NaN, [types.NUMBER], {qualifier: qualifiers.EXPECTED});
        expect(result).to.be.an.instanceof(RtvSuccess);
      });
    });

    describe('Exceptions', function() {
      it('should throw if the typeset is not an Array', function() {
        expect(function() {
          impl.checkWithArray(1, {});
        }).to.throw(/Invalid typeset in array/);
      });

      it('should throw if the typeset is not valid', function() {
        expect(function() {
          impl.checkWithArray(1, ['invalid-type']);
        }).to.throw(/Invalid typeset in array/);
      });
    });
  });

  describe('#check()', function() {
    it('should return an RtvSuccess on successful validation', function() {
      expect(impl.check(1, [types.FINITE])).to.be.an.instanceof(RtvSuccess);
    });

    it('should return an RtvError with correct properties on failed validation', function() {
      let value = 1;
      let typeset = types.STRING;
      let err = impl.check(value, typeset);
      expect(err).to.be.an.instanceof(RtvError);
      expect(err.value).to.equal(value);
      expect(err.path).to.eql([]);
      expect(err.typeset).to.equal(typeset);
      expect(err.cause).to.eql([qualifiers.REQUIRED, types.STRING]);
      expect(err.failure).to.equal(undefined);

      const cvError = new Error('badness');
      typeset = function() { throw cvError; };
      err = impl.check(value, typeset);
      expect(err).to.be.an.instanceof(RtvError);
      expect(err.value).to.equal(value);
      expect(err.path).to.eql([]);
      expect(err.typeset).to.equal(typeset);
      expect(err.cause).to.eql([qualifiers.REQUIRED, types.ANY]); // validator alone means ANY
      expect(err.failure).to.equal(cvError);

      value = {foo: 'bar'};
      typeset = {foo: types.FINITE};
      err = impl.check(value, typeset);
      expect(err).to.be.an.instanceof(RtvError);
      expect(err.value).to.equal(value);
      expect(err.path).to.eql(['foo']);
      expect(err.typeset).to.equal(typeset);
      expect(err.cause).to.eql([qualifiers.REQUIRED, types.FINITE]);
      expect(err.failure).to.equal(undefined);

      value = {foo: {bar: {baz: -1}}};
      typeset = {
        foo: {
          bar: {
            baz: [types.STRING, types.FINITE, {oneOf: 0}]
          }
        }
      };
      err = impl.check(value, typeset);
      expect(err).to.be.an.instanceof(RtvError);
      expect(err.value).to.equal(value);
      expect(err.path).to.eql(['foo', 'bar', 'baz']);
      expect(err.typeset).to.equal(typeset);
      expect(err.cause).to.eql([qualifiers.REQUIRED, types.STRING, types.FINITE, {oneOf: 0}]);
      expect(err.failure).to.equal(undefined);

      value = 1;
      typeset = [types.STRING];
      err = impl.check(value, typeset);
      expect(err).to.be.an.instanceof(RtvError);
      expect(err.value).to.equal(value);
      expect(err.path).to.eql([]);
      expect(err.typeset).to.equal(typeset);
      expect(err.cause).to.eql([qualifiers.REQUIRED, types.STRING]);
      expect(err.failure).to.equal(undefined);
    });

    it('should check a string value as a string', function() {
      expect(impl.check('foo', types.STRING)).to.be.an.instanceof(RtvSuccess);
    });

    it('should not check a string value as a boolean', function() {
      expect(impl.check('foo', types.BOOLEAN)).to.be.an.instanceof(RtvError);
    });

    it('should invoke a custom validator', function() {
      const cvError = new Error('custom validator failed');
      const validator = sinon.stub().throws(cvError);
      const result = impl.check('foo', validator);

      expect(validator.callCount).to.equal(1);
      expect(validator.firstCall.args).to.eql([
        'foo',
        [qualifiers.REQUIRED, types.ANY],
        validator
      ]);
      expect(result).to.be.an.instanceof(RtvError);
      expect(result.valid).to.be.false;
      expect(result.value).to.equal('foo');
      expect(result.path).to.eql([]);
      expect(result.typeset).to.equal(validator);
      expect(result.cause).to.eql([qualifiers.REQUIRED, types.ANY]);
      expect(result.failure).to.equal(cvError);
    });

    it(`should not call the validator if the "${types.ANY}" validator fails`, function() {
      const stub = sinon.stub(isAnyMod, 'default').returns(false);
      const validator = sinon.spy();

      impl.check(1, validator);
      expect(validator.called).to.be.false;

      stub.restore();
    });

    describe('Options', function() {
      it('should not validate the typeset if isTypeset is true', function() {
        const isTypesetSpy = sinon.stub(isTypesetMod, 'default').callThrough();

        impl.check(1, types.FINITE, {isTypeset: true});
        expect(isTypesetSpy.called).to.be.false;

        isTypesetSpy.restore();
      });

      it('should use the qualifier if specified', function() {
        const validator = sinon.stub().returns(true);

        impl.check(1, validator, {qualifier: qualifiers.OPTIONAL});
        expect(validator.getCall(0).args).to.eql([
          1, // value
          [qualifiers.OPTIONAL, types.ANY], // FQ match
          validator // typeset
        ]);
      });
    });

    describe('Exceptions', function() {
      it('should throw if shape is not a valid typeset', function() {
        let err;
        try {
          impl.check(1, 'foo');
        } catch (checkErr) {
          err = checkErr;
        }

        expect(err).to.be.an.instanceof(Error);
        expect(err.message).to.contain('Cannot check value: Invalid typeset');
        expect(err.rootCause).to.be.an.instanceof(Error);
        expect(err.rootCause.message.indexOf('Invalid typeset')).to.equal(0);
      });

      it('should throw if typeset type is not supported', function() {
        const isTypesetStub = sinon.stub(isTypesetMod, 'default').returns(true);

        // expect(impl.check.bind(impl, 1, /asdf/))
        //   .to.throw(/Invalid JavaScript type for typeset/);
        let err;
        try {
          impl.check(1, /asdf/);
        } catch (checkErr) {
          err = checkErr;
        }

        expect(err).to.be.an.instanceof(Error);
        expect(err.message).to.contain('Cannot check value: Invalid JavaScript type for typeset');
        expect(err.rootCause).to.be.an.instanceof(Error);
        expect(err.rootCause.message.indexOf('Invalid JavaScript type for typeset')).to.equal(0);

        isTypesetStub.restore();
      });
    });
  });
});
