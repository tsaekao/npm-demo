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
      expect(Object.keys(impl._validatorMap).length).to.equal(15); // # of known types
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
      const arr = [];
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

      const args = {typeset: arr};
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

  describe('#check()', function() {
    it('should return an RtvSuccess on successful validation', function() {
      expect(impl.check(1, [types.FINITE])).to.be.an.instanceof(RtvSuccess);
    });

    it('should return an RtvError on failed validation', function() {
      expect(impl.check(1, types.STRING)).to.be.an.instanceof(RtvError);
      expect(impl.check(1, function() { return false; })).to.be.an.instanceof(RtvError);
      expect(impl.check({foo: 'bar'}, {foo: types.FINITE})).to.be.an.instanceof(RtvError);
      expect(impl.check(1, [types.STRING])).to.be.an.instanceof(RtvError);
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

      typeset = function() { return false; };
      err = impl.check(value, typeset);
      expect(err).to.be.an.instanceof(RtvError);
      expect(err.value).to.equal(value);
      expect(err.path).to.eql([]);
      expect(err.typeset).to.equal(types.ANY); // validator alone means ANY
      expect(err.cause).to.eql([qualifiers.REQUIRED, types.ANY]);

      value = {foo: 'bar'};
      typeset = {foo: types.FINITE};
      err = impl.check(value, typeset);
      expect(err).to.be.an.instanceof(RtvError);
      expect(err.value).to.equal(value);
      expect(err.path).to.eql(['foo']);
      expect(err.typeset).to.equal(typeset);
      expect(err.cause).to.eql([qualifiers.REQUIRED, types.FINITE]);

      value = {foo: {bar: {baz: -1}}};
      typeset = {
        foo: {
          bar: {
            baz: [types.STRING, types.FINITE, {exact: 0}]
          }
        }
      };
      err = impl.check(value, typeset);
      expect(err).to.be.an.instanceof(RtvError);
      expect(err.value).to.equal(value);
      expect(err.path).to.eql(['foo', 'bar', 'baz']);
      expect(err.typeset).to.equal(typeset);
      expect(err.cause).to.eql([qualifiers.REQUIRED, types.STRING, types.FINITE, {exact: 0}]);

      value = 1;
      typeset = [types.STRING];
      err = impl.check(value, typeset);
      expect(err).to.be.an.instanceof(RtvError);
      expect(err.value).to.equal(value);
      expect(err.path).to.eql([]);
      expect(err.typeset).to.equal(typeset);
      expect(err.cause).to.eql([qualifiers.REQUIRED, types.STRING]);
    });

    it('should check a string value as a string', function() {
      expect(impl.check('foo', types.STRING)).to.be.an.instanceof(RtvSuccess);
    });

    xit('should not check a string value as a boolean', function() { // TODO needs to return RtvError...
      expect(impl.check('foo', types.BOOLEAN)).to.be.an.instanceof(RtvError);
    });

    it('should throw if shape is not a valid typeset', function() {
      expect(impl.check.bind(impl, 1, 'foo')).to.throw(/Cannot check value: Invalid typeset/);
    });

    it('should throw if typeset type is not supported', function() {
      const isTypesetStub = sinon.stub(isTypesetMod, 'default').returns(true);
      expect(impl.check.bind(impl, 1, /asdf/))
        .to.throw(/Missing handler for type of specified typeset/);
      isTypesetStub.restore();
    });
  });

  describe('#checkWithType()', function() {
    it('should check simple types against values'); // TODO

    it('should throw if type is not valid', function() {
      expect(function() {
        impl.checkWithType('value', 'foo');
      }).to.throw(/Invalid typeset in singleType="foo"/);
    });

    it('should throw if type is not handled', function() {
      const typesVerifyStub = sinon.stub(types, 'verify').returns('foo');
      expect(function() {
        impl.checkWithType(2, 'foo', {isTypeset: true, qualifier: DEFAULT_QUALIFIER});
      }).to.throw(/Missing validator for type="foo"/);
      typesVerifyStub.restore();
    });

    it('should return an RtvError if a value is not verified against a type'); // TODO

    it('should use the options.qualifier if specified, only for non-array typesets'); // TODO
  });

  describe('#checkWithShape()', function() {
    it('should check a shape'); // TODO
  });

  describe('#checkWithArray()', function() {
    it('should check an array typeset'); // TODO
  });

  describe('#toTypeset()', function() {
    let otherQualifiers;

    beforeEach(function() {
      otherQualifiers = qualifiers.$values.filter((q) => q !== DEFAULT_QUALIFIER);
    });

    it('should return a simple type with default qualifier and no args', function() {
      expect(impl.toTypeset(types.FINITE)).to.equal(types.FINITE);
      expect(impl.toTypeset(types.FINITE, DEFAULT_QUALIFIER)).to.equal(types.FINITE);
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
      expect(fqts).to.eql([DEFAULT_QUALIFIER, DEFAULT_OBJECT_TYPE, shape]);
      expect(fqts[2]).to.equal(shape); // objects within are not cloned
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
        {typeset: [types.FLOAT]}]); // not deep

      const shape = {};
      ts = [shape, [types.STRING]];
      fqts = impl.fullyQualify(ts);
      expect(ts).not.to.equal(fqts); // should be a new array
      expect(fqts).to.eql([DEFAULT_QUALIFIER, types.OBJECT, shape, types.ARRAY,
        {typeset: [types.STRING]}]); // object is treated as shape, not array params
      expect(fqts[2]).to.equal(shape); // same object, not cloned

      ts = [types.FINITE, [types.STRING]];
      fqts = impl.fullyQualify(ts);
      expect(ts).not.to.equal(fqts); // should be a new array
      expect(fqts).to.eql([DEFAULT_QUALIFIER, types.FINITE, types.ARRAY,
        {typeset: [types.STRING]}]);

      ts = [types.ARRAY, {typeset: types.STRING}];
      fqts = impl.fullyQualify(ts);
      expect(ts).not.to.equal(fqts); // should be a new array
      expect(fqts).to.eql([DEFAULT_QUALIFIER, types.ARRAY, {typeset: types.STRING}]);

      const args = {min: 1, typeset: [types.STRING]};
      ts = [shape, types.ARRAY, args];
      fqts = impl.fullyQualify(ts);
      expect(ts).not.to.equal(fqts); // should be a new array
      expect(fqts).to.eql([DEFAULT_QUALIFIER, types.OBJECT, shape, types.ARRAY,
        args]);
      expect(fqts[2]).to.equal(shape); // same object, not cloned
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

      const shape = {foo: 1}
      expect(impl.fullyQualify(shape, qualifiers.OPTIONAL))
        .to.eql([qualifiers.OPTIONAL, DEFAULT_OBJECT_TYPE, shape]);

      const validator = function() {};
      expect(impl.fullyQualify(validator, qualifiers.EXPECTED))
        .to.eql([qualifiers.EXPECTED, types.ANY, validator]);

      expect(impl.fullyQualify([qualifiers.REQUIRED, types.STRING]))
        .to.eql([DEFAULT_QUALIFIER, types.STRING]);

      expect(impl.fullyQualify([qualifiers.REQUIRED, types.STRING], qualifiers.EXPECTED))
        .to.eql([qualifiers.EXPECTED, types.STRING]);
    });
  });
});
