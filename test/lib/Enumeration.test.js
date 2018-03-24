import {expect} from 'chai';
import _ from 'lodash';
import Enumeration from '../../src/lib/Enumeration';

describe('module: Enumeration', function() {
  let en;

  beforeEach(function() {
    en = new Enumeration({a: 1, b: 2});
  });

  it('should require at least one key', function() {
    const msg = 'map must contain at least one key';

    expect(function() {
      new Enumeration();
    }).to.throw(msg);

    expect(function() {
      new Enumeration({});
    }).to.throw(msg);

    expect(function() {
      new Enumeration([]);
    }).to.throw(msg);

    expect(function() {
      new Enumeration(2);
    }).to.throw(msg);

    expect(function() {
      new Enumeration('foo');
    }).not.to.throw(msg); // strings are iterable, keys are 0..2

    expect(function() {
      new Enumeration({foo: 'bar'});
    }).not.to.throw(msg);
  });

  it('should disallow undefined values', function() {
    expect(function() {
      new Enumeration({foo: undefined});
    }).to.throw(/cannot be undefined/);
  });

  it('should have keys as its own properties', function() {
    const keys = Object.keys(en);
    expect(keys.length).to.equal(2);
    expect(_.difference(keys, ['a', 'b'])).to.eql([]);
  });

  it('should verify it has a value', function() {
    expect(function() {
      en.verify(1);
    }).not.to.throw;
  });

  it('should throw if it does not have a value', function() {
    expect(function() {
      en.verify(3);
    }).to.throw('invalid value for enum');
  });

  it('should return the value when it is verified', function() {
    expect(en.verify(1)).to.equal(1);
  });

  it('should return undefined when a value is not verified in silent mode', function() {
    expect(en.verify(3, true)).to.equal(undefined);
  });

  it('should have custom string serialization', function() {
    const str = en + '';
    expect(str).not.to.equal({} + ''); // not the default serialization
    expect(str).to.contain('Enumeration');
    expect(str).to.contain('pairs=');
  });
});
