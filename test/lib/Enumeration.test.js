import { expect } from 'chai';
import _ from 'lodash';

import Enumeration from '../../src/lib/Enumeration';

describe('module: lib/Enumeration', function () {
  let en;

  beforeEach(function () {
    en = new Enumeration({ a: 1, b: 2 });
  });

  it('should require at least one key', function () {
    const msg = 'map must contain at least one key';

    expect(function () {
      new Enumeration();
    }).to.throw(msg);

    expect(function () {
      new Enumeration({});
    }).to.throw(msg);

    expect(function () {
      new Enumeration([]);
    }).to.throw(msg);

    expect(function () {
      new Enumeration(2);
    }).to.throw(msg);

    expect(function () {
      new Enumeration('foo');
    }).not.to.throw(msg); // strings are iterable, keys are 0..2

    expect(function () {
      new Enumeration({ foo: 'bar' });
    }).not.to.throw(msg);
  });

  it('should disallow undefined values', function () {
    expect(function () {
      new Enumeration({ foo: undefined });
    }).to.throw(/cannot be undefined/);
  });

  it('should prevent duplicate values', function () {
    expect(function () {
      new Enumeration({ foo: 1, bar: 1 });
    }).to.throw(/duplicate value/);
  });

  it('should disallow keys that begin with "$"', function () {
    expect(function () {
      new Enumeration({ $foo: 1 });
    }).to.throw(/cannot start with "\$"/);
  });

  it('should allow a null value', function () {
    expect(function () {
      new Enumeration({ foo: null });
    }).not.to.throw();
  });

  it('should have keys as its own properties', function () {
    const keys = Object.keys(en);
    expect(keys.length).to.equal(2);
    expect(_.difference(keys, ['a', 'b'])).to.eql([]);
  });

  it('should provide a readonly $values property with all values', function () {
    expect(en.hasOwnProperty('$values')).to.be.true;
    expect(Object.keys(en).includes('$values')).to.be.false; // non-enumerable
    expect(en.$values).to.eql([1, 2]);

    expect(function () {
      en.$values = []; // cannot write
    }).to.throw();

    _.pull(en.$values, 1);
    expect(en.$values).to.eql([1, 2]); // should be a shallow clone, so pull should have no effect

    const en2 = new Enumeration({ a: [1], b: [2] });
    expect(en2.$values).to.eql([[1], [2]]);
    _.pull(en2.$values[0], 1); // since it's a shallow clone, if we modify a referenced value, it should be permanent
    expect(en2.$values[0]).to.eql([]);
    expect(en2.a).to.eql([]);
  });

  it('should verify it has a value', function () {
    expect(function () {
      en.verify(1);
    }).not.to.throw;
  });

  it('should throw if it does not have a value', function () {
    expect(function () {
      en.verify(3);
    }).to.throw('Invalid value for enum');
  });

  it('should return the value when it is verified', function () {
    expect(en.verify(1)).to.equal(1);
  });

  it('should return undefined when a value is not verified in silent mode', function () {
    expect(en.verify(3, true)).to.equal(undefined);
  });

  it('should have custom string serialization', function () {
    const str = en + '';
    expect(str).not.to.equal({} + ''); // not the default serialization
    expect(str).to.contain('Enumeration');
    expect(str).to.contain('$name=""');
    expect(str).to.contain('pairs=');
  });

  it('should default to an empty name', function () {
    expect(en.$name).to.equal('');
  });

  it('should have a non-enumerable, read-only "$name" property', function () {
    const desc = Object.getOwnPropertyDescriptor(en, '$name');
    expect(desc.enumerable).to.be.false;
    expect(desc.configurable).to.be.true;
    expect(desc.writable).to.be.false;
  });

  it('should use its name in validation error messages', function () {
    const en2 = new Enumeration({ a: 1 }, 'foo');
    const str = en2 + '';
    expect(str).to.contain('$name="foo"');
    expect(function () {
      en2.verify(2);
    }).to.throw(/for "foo" enum/);
  });
});
