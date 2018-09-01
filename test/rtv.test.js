import {expect} from 'chai';
import sinon from 'sinon';
import _ from 'lodash';

import rtv from '../src/rtv';
import types from '../src/lib/types';
import qualifiers from '../src/lib/qualifiers';
import impl from '../src/lib/impl';
import Enumeration from '../src/lib/Enumeration';
import RtvSuccess from '../src/lib/RtvSuccess';
import RtvError from '../src/lib/RtvError';
import pkg from '../package.json';

describe('module: rtv', function() {
  describe('#t', function() {
    it('should provide all types', function() {
      expect(rtv.t).to.equal(types);
      expect(rtv.t instanceof Enumeration).to.equal(true);
    });
  });

  describe('#q', function() {
    it('should provide all qualifiers', function() {
      expect(rtv.q).to.equal(qualifiers);
      expect(rtv.q instanceof Enumeration).to.equal(true);
    });
  });

  describe('#isTypeset()', function() {
    it('should verify a value is a typeset', function() {
      expect(rtv.isTypeset({})).to.be.true;
      expect(rtv.isTypeset([])).to.be.false;
    });
  });

  describe('#check()', function() {
    it('should check a value', function() {
      expect(rtv.check('foo', rtv.t.STRING)).to.be.an.instanceof(RtvSuccess);
    });
  });

  describe('#verify()', function() {
    it('should verify a value', function() {
      const params = ['foo', rtv.t.STRING];
      expect(rtv.verify.bind(rtv, ...params)).not.to.throw();
      expect(rtv.verify(...params)).to.be.an.instanceof(RtvSuccess);
    });

    it('should throw an RtvError if verify fails', function() {
      try {
        rtv.verify('foo', rtv.t.BOOLEAN);
        expect('statement above should have thrown').to.be.true; // fail this test
      } catch (err) {
        expect(err).to.be.an.instanceof(RtvError);
      }
    });
  });

  describe('#_version', function() {
    it('should provide version as internal property', function() {
      expect(rtv.hasOwnProperty('_version')).to.equal(true);
      expect(Object.keys(rtv).indexOf('_version')).to.equal(-1); // not enumerable
      expect(Object.getOwnPropertyDescriptor(rtv, '_version')).to.eql({
        value: pkg.version,
        enumerable: false,
        configurable: true,
        writable: true
      });
    });
  });

  describe('#v() proxy', function() {
    let spy;

    beforeEach(function() {
      spy = sinon.spy(rtv, 'verify');
    });

    afterEach(function() {
      spy.restore();
    });

    it('should have a shortcut proxy rtv.v()', function() {
      expect('v' in rtv).to.equal(true);
      expect(_.isFunction(rtv.v)).to.equal(true);
      rtv.v('foo', rtv.t.STRING);
      expect(spy.called).to.equal(true);
    });
  });

  describe('#c() proxy', function() {
    let spy;

    beforeEach(function() {
      spy = sinon.spy(rtv, 'check');
    });

    afterEach(function() {
      spy.restore();
    });

    it('should have a shortcut proxy rtv.c()', function() {
      expect('c' in rtv).to.equal(true);
      expect(_.isFunction(rtv.c)).to.equal(true);
      rtv.c('foo', rtv.t.STRING);
      expect(spy.called).to.equal(true);
    });
  });

  describe('.config', function() {
    let rtvVerifySpy;
    let implCheckSpy;

    beforeEach(function() {
      rtv.config.enabled = true; // initially enabled
      rtvVerifySpy = sinon.spy(rtv, 'verify');
      implCheckSpy = sinon.spy(impl, 'check');
    });

    afterEach(function() {
      rtv.config.enabled = true; // reset enabled
      rtvVerifySpy.restore();
      implCheckSpy.restore();
    });

    describe('#enabled', function() {
      it('should be a boolean value', function() {
        expect(_.isBoolean(rtv.config.enabled)).to.equal(true);
      });

      it('should verify a boolean is being set', function() {
        rtv.config.enabled = false;
        expect(rtvVerifySpy.called).to.equal(true);
        expect(rtvVerifySpy.calledWith(false, rtv.t.BOOLEAN)).to.equal(true);
      });

      it('should not check when disabled', function() {
        rtv.config.enabled = false;
        implCheckSpy.resetHistory(); // call above would have called spy
        expect(rtv.check('foobar', rtv.t.STRING)).to.be.an.instanceof(RtvSuccess);
        expect(implCheckSpy.called).to.equal(false);
      });

      it('should not verify when disabled', function() {
        rtvVerifySpy.restore(); // disable spy
        rtv.config.enabled = false;
        implCheckSpy.resetHistory(); // call above would have called spy
        expect(rtv.verify('foobar', rtv.t.STRING)).to.be.an.instanceof(RtvSuccess);
        expect(implCheckSpy.called).to.equal(false);
      });
    });

    describe('#e proxy', function() {
      it('should have a shortcut proxy rtv.e', function() {
        expect('e' in rtv).to.equal(true);
        expect(rtv.e).to.equal(rtv.config.enabled);
        rtv.config.enabled = false;
        expect(rtv.e).to.equal(rtv.config.enabled);
      });
    });
  });

  describe('#Context()', function() {
    it('should create contextual rtv verifiers'); // TODO
  });
});
