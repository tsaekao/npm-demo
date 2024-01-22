import _ from 'lodash';

import * as pts from '../../src/lib/onlyTypes';
import * as mod from '../../src/lib/types';
import { Enumeration } from '../../src/lib/Enumeration';
import { check as isString } from '../../src/lib/validation/isString';

describe('module: lib/types', () => {
  const types = mod.types;

  it('should export a "types" enumeration', () => {
    expect(types instanceof Enumeration).toBe(true);
    expect(types.$name).toBe('types');
  });

  it('should have as many types as onlyTypes', () => {
    expect(_.difference(Object.keys(types), Object.keys(pts))).toEqual([]);
  });

  it('should export a default object type', () => {
    expect(types.check(mod.DEFAULT_OBJECT_TYPE)).toBe(mod.DEFAULT_OBJECT_TYPE);
  });

  it('should have non-empty strings as types', () => {
    // the library's implementation assumes a type is always a non-empty
    //  (and therefore truthy) string, especially when checking with
    //  Enumeration#check() which returns the falsy `undefined` value if a
    //  given string is not in the enumeration
    types.$values.forEach(function (t) {
      expect(isString(t)).toBe(true);
    });
  });

  it('should export an enumeration of all object types', () => {
    // types known to be object types
    const knownTypes = [
      types.ANY_OBJECT,
      types.OBJECT,
      types.PLAIN_OBJECT,
      types.CLASS_OBJECT,
    ];

    expect(mod.objTypes.$values.length).toBe(knownTypes.length);
    expect(_.difference(mod.objTypes.$values, knownTypes)).toEqual([]);
    expect(mod.objTypes.$name).toBe('objTypes');
  });

  it('should export an enumeration of all types that accept arguments', () => {
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

    expect(mod.argTypes.$values.length).toBe(knownTypes.length);
    expect(_.difference(mod.argTypes.$values, knownTypes)).toEqual([]);
    expect(mod.argTypes.$name).toBe('argTypes');
  });
});
