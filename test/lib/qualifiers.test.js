import _ from 'lodash';

import * as pqs from '../../src/lib/onlyQualifiers';
import * as mod from '../../src/lib/qualifiers';
import { Enumeration } from '../../src/lib/Enumeration';
import { check as isString } from '../../src/lib/validation/isString';
import { check as isFalsy } from '../../src/lib/validation/isFalsy';
import * as vtu from '../../test/lib/validationTestUtil';

describe('module: lib/qualifiers', () => {
  const qualifiers = mod.qualifiers;

  describe('#qualifiers', () => {
    it('should be an enumeration', () => {
      expect(qualifiers instanceof Enumeration).toBe(true);
      expect(qualifiers.$name).toBe('qualifiers');
    });

    it('should have as many qualifiers as onlyQualifiers', () => {
      expect(_.difference(Object.keys(qualifiers), Object.keys(pqs))).toEqual(
        []
      );
    });

    it('should have non-empty strings as qualifiers', () => {
      // the library's implementation assumes a qualifier is always a non-empty
      //  (and therefore truthy) string, especially when checking with
      //  Enumeration#check() which returns the falsy `undefined` value if a
      //  given string is not in the enumeration
      qualifiers.$values.forEach(function (q) {
        expect(isString(q)).toBe(true);
      });
    });
  });

  describe('default qualifier', () => {
    it('should be valid', () => {
      expect(qualifiers.check(mod.DEFAULT_QUALIFIER)).toBe(
        mod.DEFAULT_QUALIFIER
      );
    });
  });

  describe('#valuePermitted', () => {
    it('Default: should not allow any falsy value', () => {
      // default should be REQUIRED
      expect(mod.valuePermitted(undefined)).toBe(false);
      expect(mod.valuePermitted(null)).toBe(false);
      expect(mod.valuePermitted(false)).toBe(false);
      expect(mod.valuePermitted(0)).toBe(false);
      expect(mod.valuePermitted('')).toBe(false);
    });

    it('REQUIRED: should not allow any falsy value', () => {
      expect(mod.valuePermitted(undefined, qualifiers.REQUIRED)).toBe(false);
      expect(mod.valuePermitted(null, qualifiers.REQUIRED)).toBe(false);
      expect(mod.valuePermitted(false, qualifiers.REQUIRED)).toBe(false);
      expect(mod.valuePermitted(0, qualifiers.REQUIRED)).toBe(false);
      expect(mod.valuePermitted('', qualifiers.REQUIRED)).toBe(false);
    });

    it('EXPECTED: should allow null only out of all falsy values', () => {
      expect(mod.valuePermitted(undefined, qualifiers.EXPECTED)).toBe(false);
      expect(mod.valuePermitted(null, qualifiers.EXPECTED)).toBe(true);
      expect(mod.valuePermitted(false, qualifiers.EXPECTED)).toBe(false);
      expect(mod.valuePermitted(0, qualifiers.EXPECTED)).toBe(false);
      expect(mod.valuePermitted('', qualifiers.EXPECTED)).toBe(false);
    });

    it('OPTIONAL: should allow null and undefined only out of all falsy values', () => {
      expect(mod.valuePermitted(undefined, qualifiers.OPTIONAL)).toBe(true);
      expect(mod.valuePermitted(null, qualifiers.OPTIONAL)).toBe(true);
      expect(mod.valuePermitted(false, qualifiers.OPTIONAL)).toBe(false);
      expect(mod.valuePermitted(0, qualifiers.OPTIONAL)).toBe(false);
      expect(mod.valuePermitted('', qualifiers.OPTIONAL)).toBe(false);
    });

    it('TRUTHY: should allow any falsy value', () => {
      expect(mod.valuePermitted(undefined, qualifiers.TRUTHY)).toBe(true);
      expect(mod.valuePermitted(null, qualifiers.TRUTHY)).toBe(true);
      expect(mod.valuePermitted(false, qualifiers.TRUTHY)).toBe(true);
      expect(mod.valuePermitted(0, qualifiers.TRUTHY)).toBe(true);
      expect(mod.valuePermitted('', qualifiers.TRUTHY)).toBe(true);
    });

    it('should not allow any truthy value (all qualifiers)', () => {
      vtu.getAllValues().forEach(function (value) {
        qualifiers.$values.forEach(function (q) {
          if (!isFalsy(value)) {
            expect(mod.valuePermitted(value, q)).toBe(false);
          }
        });
      });
    });
  });
});
