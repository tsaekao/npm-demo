import {expect} from 'chai';
import _ from 'lodash';

import * as mod from '../../src/lib/types';
import Enumeration from '../../src/lib/Enumeration';
import * as val from '../../src/lib/validation';

describe('module: lib/types', function() {
  const types = mod.default;

  it('should export a "types" enumeration', function() {
    expect(types instanceof Enumeration).to.equal(true);
  });

  it('should export a default object type', function() {
    expect(types.check(mod.DEFAULT_OBJECT_TYPE)).to.equal(mod.DEFAULT_OBJECT_TYPE);
  });

  it('should have non-empty strings as types', function() {
    // the library's implementation assumes a type is always a non-empty
    //  (and therefore truthy) string, especially when checking with
    //  Enumeration#check() which returns the falsy `undefined` value if a
    //  given string is not in the enumeration
    types.$values.forEach(function(t) {
      expect(val.isString(t)).to.equal(true);
    });
  });

  it('should export an enumeration of all object types', function() {
    // types known to be object types
    const knownTypes = [
      types.ANY_OBJECT,
      types.OBJECT,
      types.PLAIN_OBJECT,
      types.CLASS_OBJECT,
      types.MAP_OBJECT
    ];

    expect(_.difference(mod.objTypes.$values, knownTypes)).to.eql([]);
  });

  it('should export an enumeration of all types that accept arguments', function() {
    // types known to take arguments
    const knownTypes = [
      types.STRING,
      types.NUMBER,
      types.FINITE,
      types.INT,
      types.FLOAT,
      types.ARRAY,
      types.ANY_OBJECT,
      types.OBJECT,
      types.PLAIN_OBJECT,
      types.CLASS_OBJECT,
      types.MAP_OBJECT,
      types.MAP,
      types.WEAK_MAP,
      types.SET,
      types.WEAK_SET
    ];

    expect(_.difference(mod.argTypes.$values, knownTypes)).to.eql([]);
  });
});
