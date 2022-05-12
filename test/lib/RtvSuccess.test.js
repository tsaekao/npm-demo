import { expect } from 'chai';

import { RtvSuccess } from '../../src/lib/RtvSuccess';

describe('module: lib/RtvSuccess', function () {
  it('should extend Object', function () {
    const result = new RtvSuccess({});
    expect(result instanceof Object).to.equal(true);
  });

  it('should have a readonly valid=true property', function () {
    const result = new RtvSuccess({});
    expect(result.hasOwnProperty('valid')).to.equal(true);
    expect(result.valid).to.equal(true);

    expect(function () {
      result.valid = false;
    }).to.throw(/Cannot assign to read only property 'valid'/);

    // not changed since readonly
    expect(result.valid).to.equal(true);
  });

  it('should have custom string serialization', function () {
    const result = new RtvSuccess({});
    const str = result + '';
    expect(str).to.contain('RtvSuccess');
  });

  it('should have a readonly mvv property as set from constructor', () => {
    const mvv = 1;
    const result = new RtvSuccess({ mvv });
    expect(result.hasOwnProperty('mvv')).to.equal(true);
    expect(result.mvv).to.equal(mvv);

    expect(function () {
      result.mvv = mvv + 1;
    }).to.throw(/Cannot assign to read only property 'mvv'/);

    // not changed since readonly
    expect(result.mvv).to.equal(mvv);
  });

  it('allows mvv to be undefined', () => {
    expect(new RtvSuccess({}).mvv).to.equal(undefined);
  });
});
