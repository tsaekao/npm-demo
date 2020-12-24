import { expect } from 'chai';
import _ from 'lodash';

import * as pqs from '../../src/lib/pureQualifiers';
import * as mod from '../../src/lib/qualifiers';
import { Enumeration } from '../../src/lib/Enumeration';
import { check as isString } from '../../src/lib/validation/isString';
import { check as isFalsy } from '../../src/lib/validation/isFalsy';
import * as vtu from '../../test/lib/validationTestUtil';

describe('module: lib/qualifiers', function () {
  const qualifiers = mod.qualifiers;

  describe('#qualifiers', function () {
    it('should be an enumeration', function () {
      expect(qualifiers instanceof Enumeration).to.equal(true);
      expect(qualifiers.$name).to.equal('qualifiers');
    });

    it('should have as many qualifiers as pureQualifiers', function () {
      expect(_.difference(Object.keys(qualifiers), Object.keys(pqs))).to.eql(
        []
      );
    });

    it('should have non-empty strings as qualifiers', function () {
      // the library's implementation assumes a qualifier is always a non-empty
      //  (and therefore truthy) string, especially when checking with
      //  Enumeration#check() which returns the falsy `undefined` value if a
      //  given string is not in the enumeration
      qualifiers.$values.forEach(function (q) {
        expect(isString(q)).to.equal(true);
      });
    });
  });

  describe('default qualifier', function () {
    it('should be valid', function () {
      expect(qualifiers.check(mod.DEFAULT_QUALIFIER)).to.equal(
        mod.DEFAULT_QUALIFIER
      );
    });
  });

  describe('#valuePermitted', function () {
    it('Default: should not allow any falsy value', function () {
      // default should be REQUIRED
      expect(mod.valuePermitted(undefined)).to.be.false;
      expect(mod.valuePermitted(null)).to.be.false;
      expect(mod.valuePermitted(false)).to.be.false;
      expect(mod.valuePermitted(0)).to.be.false;
      expect(mod.valuePermitted('')).to.be.false;
    });

    it('REQUIRED: should not allow any falsy value', function () {
      expect(mod.valuePermitted(undefined, qualifiers.REQUIRED)).to.be.false;
      expect(mod.valuePermitted(null, qualifiers.REQUIRED)).to.be.false;
      expect(mod.valuePermitted(false, qualifiers.REQUIRED)).to.be.false;
      expect(mod.valuePermitted(0, qualifiers.REQUIRED)).to.be.false;
      expect(mod.valuePermitted('', qualifiers.REQUIRED)).to.be.false;
    });

    it('EXPECTED: should allow null only out of all falsy values', function () {
      expect(mod.valuePermitted(undefined, qualifiers.EXPECTED)).to.be.false;
      expect(mod.valuePermitted(null, qualifiers.EXPECTED)).to.be.true;
      expect(mod.valuePermitted(false, qualifiers.EXPECTED)).to.be.false;
      expect(mod.valuePermitted(0, qualifiers.EXPECTED)).to.be.false;
      expect(mod.valuePermitted('', qualifiers.EXPECTED)).to.be.false;
    });

    it('OPTIONAL: should allow null and undefined only out of all falsy values', function () {
      expect(mod.valuePermitted(undefined, qualifiers.OPTIONAL)).to.be.true;
      expect(mod.valuePermitted(null, qualifiers.OPTIONAL)).to.be.true;
      expect(mod.valuePermitted(false, qualifiers.OPTIONAL)).to.be.false;
      expect(mod.valuePermitted(0, qualifiers.OPTIONAL)).to.be.false;
      expect(mod.valuePermitted('', qualifiers.OPTIONAL)).to.be.false;
    });

    it('TRUTHY: should allow any falsy value', function () {
      expect(mod.valuePermitted(undefined, qualifiers.TRUTHY)).to.be.true;
      expect(mod.valuePermitted(null, qualifiers.TRUTHY)).to.be.true;
      expect(mod.valuePermitted(false, qualifiers.TRUTHY)).to.be.true;
      expect(mod.valuePermitted(0, qualifiers.TRUTHY)).to.be.true;
      expect(mod.valuePermitted('', qualifiers.TRUTHY)).to.be.true;
    });

    it('should not allow any truthy value (all qualifiers)', function () {
      vtu.getAllValues().forEach(function (value) {
        qualifiers.$values.forEach(function (q) {
          if (!isFalsy(value)) {
            expect(mod.valuePermitted(value, q)).to.equal(false);
          }
        });
      });
    });
  });
});
