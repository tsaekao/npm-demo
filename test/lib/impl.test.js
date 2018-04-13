import {expect} from 'chai';

import * as impl from '../../src/lib/impl';
import types from '../../src/lib/types';
import qualifiers from '../../src/lib/qualifiers';

describe('module: lib/impl', function() {
  it('should export a default qualifier', function() {
    expect(qualifiers.check(impl.DEFAULT_QUALIFIER)).to.equal(impl.DEFAULT_QUALIFIER);
  });

  it('should export a default object ype', function() {
    expect(types.check(impl.DEFAULT_OBJ_TYPE)).to.equal(impl.DEFAULT_OBJ_TYPE);
  });

  describe('#check()', function() {
    it('should check a string value as a string', function() {
      expect(impl.check('foo', types.STRING)).to.equal(true);
    });

    it('should not check a string value as a boolean', function() {
      expect(impl.check('foo', types.BOOLEAN)).to.equal(false);
    });

    it('should throw if shape is not a valid typeset', function() {
      expect(impl.check.bind(impl, 1, 'foo')).to.throw('shape is not a valid typeset');
    });
  });

  describe('#checkSimple()', function() {
    it('should check simple types against values', function() {
      // TODO
    });
  });

  describe('#fullyQualify()', function() {
    it('should FQ string typesets', function() {
      expect(impl.fullyQualify(types.STRING)).to.eql([impl.DEFAULT_QUALIFIER, types.STRING]);
    });

    it('should FQ object typesets', function() {
      const shape = {};
      const fqts = impl.fullyQualify(shape);
      expect(fqts).to.eql([impl.DEFAULT_QUALIFIER, impl.DEFAULT_OBJ_TYPE, shape]);
      expect(fqts[2]).to.equal(shape); // objects within are not cloned
    });

    it('should FQ function typesets', function() {
      const fn = function() {};
      const fqts = impl.fullyQualify(fn);
      expect(fqts).to.eql([impl.DEFAULT_QUALIFIER, fn]);
      expect(fqts[1]).to.equal(fn); // objects within are not cloned
    });

    it('should FQ array typesets', function() {
      let ts = [types.FINITE];
      let fqts = impl.fullyQualify(ts);
      expect(ts).not.to.equal(fqts); // should be a new array
      expect(fqts).to.eql([impl.DEFAULT_QUALIFIER, types.FINITE]);

      ts = [types.JSON, function(v) {}];
      fqts = impl.fullyQualify(ts);
      expect(ts).not.to.equal(fqts); // should be a new array
      expect(fqts).to.eql([impl.DEFAULT_QUALIFIER, types.JSON, ts[1]]);

      ts = [[types.FLOAT]];
      fqts = impl.fullyQualify(ts);
      expect(ts).not.to.equal(fqts); // should be a new array
      expect(fqts).to.eql([impl.DEFAULT_QUALIFIER, types.ARRAY,
          [types.FLOAT]]); // not deep

      let shape = {};
      ts = [shape, [types.STRING]];
      fqts = impl.fullyQualify(ts);
      expect(ts).not.to.equal(fqts); // should be a new array
      expect(fqts).to.eql([impl.DEFAULT_QUALIFIER, types.OBJECT, shape, types.ARRAY,
          [types.STRING]]); // object is treated as shape, not array params
      expect(fqts[2]).to.equal(shape); // same object, not cloned

      let params = {min: 1};
      ts = [shape, types.ARRAY, params, [types.STRING]];
      fqts = impl.fullyQualify(ts);
      expect(ts).not.to.equal(fqts); // should be a new array
      expect(fqts).to.eql([impl.DEFAULT_QUALIFIER, types.OBJECT, shape, types.ARRAY,
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
  });
});
