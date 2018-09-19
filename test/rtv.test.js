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
      expect('t' in rtv).to.equal(true);
      expect(rtv.t).to.equal(types);
      expect(rtv.t instanceof Enumeration).to.equal(true);
    });
  });

  describe('#q', function() {
    it('should provide all qualifiers', function() {
      expect('q' in rtv).to.equal(true);
      expect(rtv.q).to.equal(qualifiers);
      expect(rtv.q instanceof Enumeration).to.equal(true);
    });
  });

  describe('#isTypeset()', function() {
    it('should verify a value is a typeset', function() {
      expect('isTypeset' in rtv).to.equal(true);
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

  describe('#version', function() {
    it('should provide version property', function() {
      expect('version' in rtv).to.equal(true);
      expect(rtv.version).to.equal(pkg.version);
    });
  });

  describe('#e proxy', function() {
    it('should have a shortcut proxy rtv.e -> rtv.config.enabled', function() {
      expect('e' in rtv).to.equal(true);
      expect(rtv.e).to.equal(rtv.config.enabled);
      rtv.config.enabled = false;
      expect(rtv.e).to.equal(rtv.config.enabled);
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
  });
});
