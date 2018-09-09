import {expect} from 'chai';

import * as mod from '../../src/lib/qualifiers';
import Enumeration from '../../src/lib/Enumeration';
import isString from '../../src/lib/validation/isString';
import * as vtu from '../../test/lib/validationTestUtil';

describe('module: lib/qualifiers', function() {
  const qualifiers = mod.default;

  describe('#qualifiers', function() {
    it('should be an enumeration', function() {
      expect(qualifiers instanceof Enumeration).to.equal(true);
      expect(qualifiers.$name).to.equal('qualifiers');
    });

    it('should have non-empty strings as qualifiers', function() {
      // the library's implementation assumes a qualifier is always a non-empty
      //  (and therefore truthy) string, especially when checking with
      //  Enumeration#check() which returns the falsy `undefined` value if a
      //  given string is not in the enumeration
      qualifiers.$values.forEach(function(q) {
        expect(isString(q)).to.equal(true);
      });
    });
  });

  describe('default qualifier', function() {
    it('should be valid', function() {
      expect(qualifiers.check(mod.DEFAULT_QUALIFIER)).to.equal(mod.DEFAULT_QUALIFIER);
    });
  });

  describe('#nilPermitted', function() {
    it('Default: should not allow null/undefined', function() {
      // default should be REQUIRED
      expect(mod.nilPermitted(undefined)).to.be.false;
      expect(mod.nilPermitted(null)).to.be.false;
    });

    it('REQUIRED: should not allow null/undefined', function() {
      expect(mod.nilPermitted(undefined, qualifiers.REQUIRED)).to.be.false;
      expect(mod.nilPermitted(null, qualifiers.REQUIRED)).to.be.false;
    });

    it('EXPECTED: should allow null but not undefined', function() {
      expect(mod.nilPermitted(undefined, qualifiers.EXPECTED)).to.be.false;
      expect(mod.nilPermitted(null, qualifiers.EXPECTED)).to.be.true;
    });

    it('OPTIONAL: should allow null and undefined', function() {
      expect(mod.nilPermitted(undefined, qualifiers.OPTIONAL)).to.be.true;
      expect(mod.nilPermitted(null, qualifiers.OPTIONAL)).to.be.true;
    });

    it('should only validate null/undefined regardless of qualifier', function() {
      vtu.getAllValues().forEach(function(value) {
        qualifiers.$values.forEach(function(q) {
          const result = {
            qualifier: q,
            permitted: mod.nilPermitted(value, q)
          };
          expect(result).to.eql({qualifier: q, permitted: false});
        });
      });
    });
  });
});
