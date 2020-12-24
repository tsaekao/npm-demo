import { expect } from 'chai';

import { types } from '../../src/lib/types';
import { qualifiers } from '../../src/lib/qualifiers';
import RtvSuccess from '../../src/lib/RtvSuccess';

describe('module: lib/RtvSuccess', function () {
  it('should extend Object', function () {
    const succ = new RtvSuccess();
    expect(succ instanceof Object).to.equal(true);
  });

  it('should have a readonly valid=true property', function () {
    const succ = new RtvSuccess('', types.STRING, 'path', [
      qualifiers.REQUIRED,
      types.STRING,
    ]);
    expect(succ.hasOwnProperty('valid')).to.equal(true);
    expect(succ.valid).to.equal(true);

    expect(function () {
      succ.valid = false;
    }).to.throw(/Cannot assign to read only property 'valid'/);

    // not changed since readonly
    expect(succ.valid).to.equal(true);
  });

  it('should have custom string serialization', function () {
    const succ = new RtvSuccess();
    const str = succ + '';
    expect(str).to.contain('RtvSuccess');
  });
});
