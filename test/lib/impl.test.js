import {expect} from 'chai';
import * as impl from '../../src/lib/impl';

describe('module: impl', function() {
  it('should check a string value', function() {
    expect(impl.check('foo', impl.types.STRING)).to.equal(true);
  });
});
