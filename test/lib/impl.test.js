import {expect} from 'chai';
import sinon from 'sinon';

import '../../src/rtv'; // so that types get registered with `impl`
import impl from '../../src/lib/impl';
import {DEFAULT_OBJECT_TYPE, default as types} from '../../src/lib/types';
import {DEFAULT_QUALIFIER, default as qualifiers} from '../../src/lib/qualifiers';
import RtvSuccess from '../../src/lib/RtvSuccess';
import RtvError from '../../src/lib/RtvError';
import isObject from '../../src/lib/validator/isObject';
import isFunction from '../../src/lib/validator/isFunction';
import * as isTypesetMod from '../../src/lib/validation/isTypeset';

describe.only('module: lib/impl', function() { // DEBUG remove only
  this.timeout(0); // DEBUG remove

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

  describe('#extractNextType()', function() { // DEBUG remove only
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

      typeset = [types.ARRAY, args, arr, val];
      nextType = impl.extractNextType(typeset);

      expect(typeset).to.eql([val]);
      expect(nextType).to.eql([types.ARRAY, args, arr]);

      typeset = [types.PLAIN_OBJECT, args, types.ARRAY, arr];
      nextType = impl.extractNextType(typeset);

      expect(typeset).to.eql([types.ARRAY, arr]);
      expect(nextType).to.eql([types.PLAIN_OBJECT, args]);

      nextType = impl.extractNextType(typeset);

      expect(typeset).to.eql([]);
      expect(nextType).to.eql([types.ARRAY, arr]);

      typeset = [types.STRING, args, val];
      nextType = impl.extractNextType(typeset);

      expect(typeset).to.eql([val]);
      expect(nextType).to.eql([types.STRING, args]);

      expect(function() {
        impl.extractNextType([types.BOOLEAN, args]);
      }).to.throw(/Invalid array typeset/);
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

      typeset = [types.ARRAY, arr];
      nextType = impl.extractNextType(typeset);

      expect(typeset).to.eql([]);
      expect(nextType).to.eql([types.ARRAY, arr]);
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

  describe.only('#check()', function() { // DEBUG remove only
    it('should return an RtvSuccess on successful validation', function() {
      expect(impl.check(1, types.FINITE)).to.be.an.instanceof(RtvSuccess);
      expect(impl.check(1, function() { return true; })).to.be.an.instanceof(RtvSuccess);
      expect(impl.check({foo: 'bar'}, {foo: types.STRING})).to.be.an.instanceof(RtvSuccess);
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
      expect(err.value).to.equal(value);
      expect(err.path).to.eql([]);
      expect(err.typeset).to.equal(typeset);
      expect(err.cause).to.eql([qualifiers.REQUIRED, types.STRING]);

      typeset = function() { return false; };
      err = impl.check(value, typeset);
      expect(err.value).to.equal(value);
      expect(err.path).to.eql([]);
      expect(err.typeset).to.equal(types.ANY); // validator alone means ANY
      expect(err.cause).to.eql([qualifiers.REQUIRED, types.ANY]);

      value = {foo: 'bar'};
      typeset = {foo: types.FINITE};
      err = impl.check(value, typeset);
      expect(err.value).to.equal('bar');
      expect(err.path).to.eql(['foo']);
      expect(err.typeset).to.equal(typeset.foo);
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
      expect(err.value).to.equal(-1);
      expect(err.path).to.eql(['foo', 'bar', 'baz']);
      expect(err.typeset).to.equal(typeset.foo.bar.baz);
      expect(err.cause).to.eql([qualifiers.REQUIRED, types.FINITE, {exact: 0}]);

      value = 1;
      typeset = [types.STRING];
      err = impl.check(value, typeset);
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
      }).to.throw(/Invalid value for types enum/);
    });

    it('should throw if type is not handled', function() {
      const typesVerifyStub = sinon.stub(types, 'verify'); // prevent verification of unknown/invalid type
      expect(function() {
        impl.checkWithType(2, 'foo');
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

  describe('#fullyQualify()', function() {
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
        [types.FLOAT]]); // not deep

      let shape = {};
      ts = [shape, [types.STRING]];
      fqts = impl.fullyQualify(ts);
      expect(ts).not.to.equal(fqts); // should be a new array
      expect(fqts).to.eql([DEFAULT_QUALIFIER, types.OBJECT, shape, types.ARRAY,
        [types.STRING]]); // object is treated as shape, not array params
      expect(fqts[2]).to.equal(shape); // same object, not cloned

      let params = {min: 1};
      ts = [shape, types.ARRAY, params, [types.STRING]];
      fqts = impl.fullyQualify(ts);
      expect(ts).not.to.equal(fqts); // should be a new array
      expect(fqts).to.eql([DEFAULT_QUALIFIER, types.OBJECT, shape, types.ARRAY,
        params, [types.STRING]]);
      expect(fqts[2]).to.equal(shape); // same object, not cloned
      expect(fqts[4]).to.equal(params); // same object, not cloned
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

    it('should accept a qualifier override'); // TODO
  });
});
