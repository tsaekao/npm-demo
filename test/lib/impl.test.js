import {expect} from 'chai';
import * as impl from '../../src/lib/impl';

describe('module: impl', function() {
  it('should check a string value as a string', function() {
    expect(impl.check('foo', impl.types.STRING)).to.equal(true);
  });

  it('should not check a string value as a boolean', function() {
    expect(impl.check('foo', impl.types.BOOLEAN)).to.equal(false);
  });

  it('should throw if shape is not a valid typeset', function() {
    expect(impl.check.bind(impl, 1, 'foo')).to.throw('shape is not a valid typeset');
  });
});
