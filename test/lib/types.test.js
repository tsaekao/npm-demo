import { expect } from 'chai';
import _ from 'lodash';

import * as pts from '../../src/lib/pureTypes';
import * as mod from '../../src/lib/types';
import { Enumeration } from '../../src/lib/Enumeration';
import { check as isString } from '../../src/lib/validation/isString';

describe('module: lib/types', function () {
  const types = mod.types;

  it('should export a "types" enumeration', function () {
    expect(types instanceof Enumeration).to.equal(true);
    expect(types.$name).to.equal('types');
  });

  it('should have as many types as pureTypes', function () {
    expect(_.difference(Object.keys(types), Object.keys(pts))).to.eql([]);
  });

  it('should export a default object type', function () {
    expect(types.check(mod.DEFAULT_OBJECT_TYPE)).to.equal(
      mod.DEFAULT_OBJECT_TYPE
    );
  });

  it('should have non-empty strings as types', function () {
    // the library's implementation assumes a type is always a non-empty
    //  (and therefore truthy) string, especially when checking with
    //  Enumeration#check() which returns the falsy `undefined` value if a
    //  given string is not in the enumeration
    types.$values.forEach(function (t) {
      expect(isString(t)).to.equal(true);
    });
  });

  it('should export an enumeration of all object types', function () {
    // types known to be object types
    const knownTypes = [
      types.ANY_OBJECT,
      types.OBJECT,
      types.PLAIN_OBJECT,
      types.CLASS_OBJECT,
    ];

    expect(mod.objTypes.$values.length).to.equal(knownTypes.length);
    expect(_.difference(mod.objTypes.$values, knownTypes)).to.eql([]);
    expect(mod.objTypes.$name).to.equal('objTypes');
  });

  it('should export an enumeration of all types that accept arguments', function () {
    // types known to take arguments
    const knownTypes = [
      types.STRING,
      types.SYMBOL,
      types.NUMBER,
      types.FINITE,
      types.INT,
      types.SAFE_INT,
      types.FLOAT,
      types.ARRAY,
      types.ANY_OBJECT,
      types.OBJECT,
      types.PLAIN_OBJECT,
      types.CLASS_OBJECT,
      types.HASH_MAP,
      types.MAP,
      types.SET,
    ];

    expect(mod.argTypes.$values.length).to.equal(knownTypes.length);
    expect(_.difference(mod.argTypes.$values, knownTypes)).to.eql([]);
    expect(mod.argTypes.$name).to.equal('argTypes');
  });
});
