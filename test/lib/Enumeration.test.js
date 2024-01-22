import _ from 'lodash';

import { Enumeration } from '../../src/lib/Enumeration';

describe('module: lib/Enumeration', () => {
  let en;

  beforeEach(() => {
    en = new Enumeration({ a: 1, b: 2 });
  });

  it('should require at least one key', () => {
    const msg = 'map must contain at least one key';

    expect(function () {
      new Enumeration();
    }).toThrow(msg);

    expect(function () {
      new Enumeration({});
    }).toThrow(msg);

    expect(function () {
      new Enumeration([]);
    }).toThrow(msg);

    expect(function () {
      new Enumeration(2);
    }).toThrow(msg);

    expect(function () {
      new Enumeration('foo');
    }).not.toThrow(msg); // strings are iterable, keys are 0..2

    expect(function () {
      new Enumeration({ foo: 'bar' });
    }).not.toThrow(msg);
  });

  it('should disallow undefined values', () => {
    expect(function () {
      new Enumeration({ foo: undefined });
    }).toThrow(/cannot be undefined/);
  });

  it('should prevent duplicate values', () => {
    expect(function () {
      new Enumeration({ foo: 1, bar: 1 });
    }).toThrow(/duplicate value/);
  });

  it('should disallow keys that begin with "$"', () => {
    expect(function () {
      new Enumeration({ $foo: 1 });
    }).toThrow(/cannot start with "\$"/);
  });

  it('should allow a null value', () => {
    expect(function () {
      new Enumeration({ foo: null });
    }).not.toThrow();
  });

  it('should have keys as its own properties', () => {
    const keys = Object.keys(en);
    expect(keys.length).toBe(2);
    expect(_.difference(keys, ['a', 'b'])).toEqual([]);
  });

  it('should provide a readonly $values property with all values', () => {
    expect(en.hasOwnProperty('$values')).toBe(true);
    expect(Object.keys(en).includes('$values')).toBe(false); // non-enumerable
    expect(en.$values).toEqual([1, 2]);

    expect(function () {
      en.$values = []; // cannot write
    }).toThrow();

    _.pull(en.$values, 1);
    expect(en.$values).toEqual([1, 2]); // should be a shallow clone, so pull should have no effect

    const en2 = new Enumeration({ a: [1], b: [2] });
    expect(en2.$values).toEqual([[1], [2]]);
    _.pull(en2.$values[0], 1); // since it's a shallow clone, if we modify a referenced value, it should be permanent
    expect(en2.$values[0]).toEqual([]);
    expect(en2.a).toEqual([]);
  });

  it('should verify it has a value', () => {
    expect(function () {
      en.verify(1);
    }).not.toThrow();
  });

  it('should throw if it does not have a value', () => {
    expect(function () {
      en.verify(3);
    }).toThrow('Invalid value for enum');
  });

  it('should return the value when it is verified', () => {
    expect(en.verify(1)).toBe(1);
  });

  it('should return undefined when a value is not verified in silent mode', () => {
    expect(en.verify(3, true)).toBeUndefined();
  });

  it('should have custom string serialization', () => {
    const str = en + '';
    expect(str).not.toBe({} + ''); // not the default serialization
    expect(str).toContain('Enumeration');
    expect(str).toContain('$name=""');
    expect(str).toContain('pairs=');
  });

  it('should default to an empty name', () => {
    expect(en.$name).toBe('');
  });

  it('should have a non-enumerable, read-only "$name" property', () => {
    const desc = Object.getOwnPropertyDescriptor(en, '$name');
    expect(desc.enumerable).toBe(false);
    expect(desc.configurable).toBe(true);
    expect(desc.writable).toBe(false);
  });

  it('should use its name in validation error messages', () => {
    const en2 = new Enumeration({ a: 1 }, 'foo');
    const str = en2 + '';
    expect(str).toContain('$name="foo"');
    expect(function () {
      en2.verify(2);
    }).toThrow(/for "foo" enum/);
  });
});
