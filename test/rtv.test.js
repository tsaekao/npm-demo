import { expect } from 'chai';
import sinon from 'sinon';
import _ from 'lodash';

import * as rtv from '../src/rtv';
import { types } from '../src/lib/types';
import { qualifiers } from '../src/lib/qualifiers';
import * as impl from '../src/lib/impl';
import { Enumeration } from '../src/lib/Enumeration';
import { RtvSuccess } from '../src/lib/RtvSuccess';
import { RtvError } from '../src/lib/RtvError';
import pkg from '../package.json';

describe('module: rtv', function () {
  describe('#types', function () {
    it('should provide all types', function () {
      expect('types' in rtv).to.equal(true);
      expect(rtv.types).to.equal(types);
      expect(rtv.types instanceof Enumeration).to.equal(true);
    });
  });

  describe('#...types', function () {
    it('should provide all enumerable "types" enum props', function () {
      expect(
        Object.keys(types).every(function (key) {
          return rtv[key] === types[key];
        })
      ).to.be.true;
    });
  });

  describe('#qualifiers', function () {
    it('should provide all qualifiers', function () {
      expect('qualifiers' in rtv).to.equal(true);
      expect(rtv.qualifiers).to.equal(qualifiers);
      expect(rtv.qualifiers instanceof Enumeration).to.equal(true);
    });
  });

  describe('#...qualifiers', function () {
    it('should provide all enumerable "qualifiers" enum props', function () {
      expect(
        Object.keys(qualifiers).every(function (key) {
          return rtv[key] === qualifiers[key];
        })
      ).to.be.true;
    });
  });

  describe('#isTypeset()', function () {
    it('should verify a value is a typeset', function () {
      expect('isTypeset' in rtv).to.equal(true);
      expect(rtv.isTypeset({})).to.be.true;
      expect(rtv.isTypeset([])).to.be.false;
    });
  });

  describe('#fullyQualify()', function () {
    it('should fully-qualify a typeset', function () {
      expect('fullyQualify' in rtv).to.equal(true);
      expect(rtv.fullyQualify(types.FUNCTION)).to.eql([
        qualifiers.REQUIRED,
        types.FUNCTION,
      ]);
    });
  });

  describe('#check()', function () {
    it('should check a value', function () {
      expect(rtv.check('foo', rtv.STRING)).to.be.an.instanceof(RtvSuccess);
    });

    it('should support exactShapes option', function () {
      const obj = { parent: { child: 1, sibbling: 2 } };
      const shape = {
        parent: {
          child: rtv.SAFE_INT,
        },
      };

      expect(rtv.check(obj, shape, { exactShapes: true })).to.be.an.instanceof(
        RtvError
      );
    });
  });

  describe('#verify()', function () {
    it('should verify a value', function () {
      const params = ['foo', rtv.STRING];
      expect(rtv.verify.bind(rtv, ...params)).not.to.throw();
      expect(rtv.verify(...params)).to.be.an.instanceof(RtvSuccess);
    });

    it('should throw an RtvError if verify fails', function () {
      try {
        rtv.verify('foo', rtv.BOOLEAN);
        expect('statement above should have thrown').to.be.true; // fail this test
      } catch (err) {
        expect(err).to.be.an.instanceof(RtvError);
      }
    });

    it('should support exactShapes option', function () {
      const obj = { parent: { child: 1, sibbling: 2 } };
      const shape = {
        parent: {
          child: rtv.SAFE_INT,
        },
      };

      try {
        rtv.verify(obj, shape, { exactShapes: true });
        expect('statement above should have thrown').to.be.true; // fail this test
      } catch (err) {
        expect(err).to.be.an.instanceof(RtvError);
      }
    });
  });

  describe('#RtvSuccess', function () {
    it('should provide RtvSuccess property', function () {
      expect('RtvSuccess' in rtv).to.equal(true);
      expect(rtv.RtvSuccess).to.equal(RtvSuccess);
    });
  });

  describe('#RtvError', function () {
    it('should provide RtvError property', function () {
      expect('RtvError' in rtv).to.equal(true);
      expect(rtv.RtvError).to.equal(RtvError);
    });
  });

  describe('#version', function () {
    it('should provide version property', function () {
      expect('version' in rtv).to.equal(true);
      expect(rtv.version).to.equal(pkg.version);
    });
  });

  describe('#config', function () {
    let rtvVerifySpy;
    let implCheckSpy;

    beforeEach(function () {
      rtv.config.enabled = true; // initially enabled
      rtvVerifySpy = sinon.spy(rtv, 'verify');
      implCheckSpy = sinon.spy(impl, 'check');
    });

    afterEach(function () {
      rtv.config.enabled = true; // reset enabled
      rtvVerifySpy.restore();
      implCheckSpy.restore();
    });

    describe('#enabled', function () {
      it('should be a boolean value', function () {
        expect(_.isBoolean(rtv.config.enabled)).to.equal(true);
      });

      it('should cast non-boolean values to booleans', function () {
        rtv.config.enabled = 0;
        expect(rtv.config.enabled).to.equal(false);

        rtv.config.enabled = {};
        expect(rtv.config.enabled).to.equal(true);
      });

      it('should not check when disabled', function () {
        rtv.config.enabled = false;
        const result = rtv.check('foobar', rtv.BOOLEAN);
        expect(result).to.be.an.instanceof(RtvSuccess);
        expect(result.mvv).to.be.undefined;
        expect(implCheckSpy.called).to.equal(false);
      });

      it('should not verify when disabled', function () {
        rtvVerifySpy.restore(); // disable spy
        rtv.config.enabled = false;
        const result = rtv.verify('foobar', rtv.BOOLEAN);
        expect(result).to.be.an.instanceof(RtvSuccess);
        expect(result.mvv).to.be.undefined;
        expect(implCheckSpy.called).to.equal(false);
      });
    });
  });
});
