import {expect} from 'chai';
import _ from 'lodash';

import * as mod from '../../src/lib/qualifiers';
import Enumeration from '../../src/lib/Enumeration';
import isString from '../../src/lib/validator/isString';

describe('module: lib/qualifiers', function() {
  const qualifiers = mod.default;

  it('should export a "qualifiers" enumeration', function() {
    expect(qualifiers instanceof Enumeration).to.equal(true);
  });

  it('should export a default qualifier', function() {
    expect(qualifiers.check(mod.DEFAULT_QUALIFIER)).to.equal(mod.DEFAULT_QUALIFIER);
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
