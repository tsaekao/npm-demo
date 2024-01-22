import _ from 'lodash';

import * as rtv from '../src/rtv';
import { types } from '../src/lib/types';
import { qualifiers } from '../src/lib/qualifiers';
import * as impl from '../src/lib/impl';
import { Enumeration } from '../src/lib/Enumeration';
import { RtvSuccess } from '../src/lib/RtvSuccess';
import { RtvError } from '../src/lib/RtvError';
import pkg from '../package.json';

describe('module: rtv', () => {
  describe('#types', () => {
    it('should provide all types', () => {
      expect('types' in rtv).toBe(true);
      expect(rtv.types).toBe(types);
      expect(rtv.types instanceof Enumeration).toBe(true);
    });
  });

  describe('#...types', () => {
    it('should provide all enumerable "types" enum props', () => {
      expect(
        Object.keys(types).every(function (key) {
          return rtv[key] === types[key];
        })
      ).toBe(true);
    });
  });

  describe('#qualifiers', () => {
    it('should provide all qualifiers', () => {
      expect('qualifiers' in rtv).toBe(true);
      expect(rtv.qualifiers).toBe(qualifiers);
      expect(rtv.qualifiers instanceof Enumeration).toBe(true);
    });
  });

  describe('#...qualifiers', () => {
    it('should provide all enumerable "qualifiers" enum props', () => {
      expect(
        Object.keys(qualifiers).every(function (key) {
          return rtv[key] === qualifiers[key];
        })
      ).toBe(true);
    });
  });

  describe('#isTypeset()', () => {
    it('should verify a value is a typeset', () => {
      expect('isTypeset' in rtv).toBe(true);
      expect(rtv.isTypeset({})).toBe(true);
      expect(rtv.isTypeset([])).toBe(false);
    });
  });

  describe('#fullyQualify()', () => {
    it('should fully-qualify a typeset', () => {
      expect('fullyQualify' in rtv).toBe(true);
      expect(rtv.fullyQualify(types.FUNCTION)).toEqual([
        qualifiers.REQUIRED,
        types.FUNCTION,
      ]);
    });
  });

  describe('#check()', () => {
    it('should check a value', () => {
      expect(rtv.check('foo', rtv.STRING)).toBeInstanceOf(RtvSuccess);
    });

    it('should support exactShapes option', () => {
      const obj = { parent: { child: 1, sibbling: 2 } };
      const shape = {
        parent: {
          child: rtv.SAFE_INT,
        },
      };

      expect(rtv.check(obj, shape, { exactShapes: true })).toBeInstanceOf(
        RtvError
      );
    });
  });

  describe('#verify()', () => {
    it('should verify a value', () => {
      const params = ['foo', rtv.STRING];
      expect(rtv.verify.bind(rtv, ...params)).not.toThrow();
      expect(rtv.verify(...params)).toBeInstanceOf(RtvSuccess);
    });

    it('should throw an RtvError if verify fails', () => {
      try {
        rtv.verify('foo', rtv.BOOLEAN);
        expect('statement above should have thrown').toBe(true); // fail this test
      } catch (err) {
        expect(err).toBeInstanceOf(RtvError);
      }
    });

    it('should support exactShapes option', () => {
      const obj = { parent: { child: 1, sibbling: 2 } };
      const shape = {
        parent: {
          child: rtv.SAFE_INT,
        },
      };

      try {
        rtv.verify(obj, shape, { exactShapes: true });
        expect('statement above should have thrown').toBe(true); // fail this test
      } catch (err) {
        expect(err).toBeInstanceOf(RtvError);
      }
    });
  });

  describe('#RtvSuccess', () => {
    it('should provide RtvSuccess property', () => {
      expect('RtvSuccess' in rtv).toBe(true);
      expect(rtv.RtvSuccess).toBe(RtvSuccess);
    });
  });

  describe('#RtvError', () => {
    it('should provide RtvError property', () => {
      expect('RtvError' in rtv).toBe(true);
      expect(rtv.RtvError).toBe(RtvError);
    });
  });

  describe('#version', () => {
    it('should provide version property', () => {
      expect('version' in rtv).toBe(true);
      expect(rtv.version).toBe(pkg.version);
    });
  });

  describe('#config', () => {
    let rtvVerifySpy;
    let implCheckSpy;

    beforeEach(() => {
      rtv.config.enabled = true; // initially enabled
      rtvVerifySpy = jest.spyOn(rtv, 'verify').mockClear();
      implCheckSpy = jest.spyOn(impl, 'check').mockClear();
    });

    afterEach(() => {
      rtv.config.enabled = true; // reset enabled
      rtvVerifySpy.mockRestore();
      implCheckSpy.mockRestore();
    });

    describe('#enabled', () => {
      it('should be a boolean value', () => {
        expect(_.isBoolean(rtv.config.enabled)).toBe(true);
      });

      it('should cast non-boolean values to booleans', () => {
        rtv.config.enabled = 0;
        expect(rtv.config.enabled).toBe(false);

        rtv.config.enabled = {};
        expect(rtv.config.enabled).toBe(true);
      });

      it('should not check when disabled', () => {
        rtv.config.enabled = false;
        const result = rtv.check('foobar', rtv.BOOLEAN);
        expect(result).toBeInstanceOf(RtvSuccess);
        expect(result.mvv).toBeUndefined();
        expect(implCheckSpy).not.toHaveBeenCalled();
      });

      it('should not verify when disabled', () => {
        rtvVerifySpy.mockRestore(); // disable spy
        rtv.config.enabled = false;
        const result = rtv.verify('foobar', rtv.BOOLEAN);
        expect(result).toBeInstanceOf(RtvSuccess);
        expect(result.mvv).toBeUndefined();
        expect(implCheckSpy).not.toHaveBeenCalled();
      });
    });
  });
});
