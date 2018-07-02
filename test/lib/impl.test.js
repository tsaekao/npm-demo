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
    it('// TODO');
  });

  describe('#check()', function() {
    it('should return an RtvSuccess on successful validation'); // TODO
    it('should return an RtvError on failed validation'); // TODO

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
      expect(impl.check.bind(impl, 1, function() {})).to.throw(/Missing handler for type of specified typeset/);
    });
  });

  describe('#checkType()', function() {
    it('should check simple types against values'); // TODO

    it('should throw if type is not valid', function() {
      expect(function() {
        impl.checkType('value', 'foo');
      }).to.throw(/Invalid value for enum/);
    });

    it('should throw if type is not handled', function() {
      const typesVerifyStub = sinon.stub(types, 'verify'); // prevent verification of unknown/invalid type
      expect(function() {
        impl.checkType(2, 'foo');
      }).to.throw(/Missing validator for type="foo"/);
      typesVerifyStub.restore();
    });

    it('should return an RtvError if a value is not verified against a type'); // TODO

    it('should use the options.qualifier if specified, only for non-array typesets'); // TODO
  });

  describe('#checkShape()', function() {
    it('// TODO');
  });
  describe('#checkTypeset()', function() {
    it('// TODO');
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
