import { RtvSuccess } from '../../src/lib/RtvSuccess';

describe('module: lib/RtvSuccess', () => {
  it('should extend Object', () => {
    const result = new RtvSuccess({});
    expect(result instanceof Object).toBe(true);
  });

  it('should have a readonly valid=true property', () => {
    const result = new RtvSuccess({});
    expect(result.hasOwnProperty('valid')).toBe(true);
    expect(result.valid).toBe(true);

    expect(function () {
      result.valid = false;
    }).toThrow(/Cannot assign to read only property 'valid'/);

    // not changed since readonly
    expect(result.valid).toBe(true);
  });

  it('should have custom string serialization', () => {
    const result = new RtvSuccess({});
    const str = result + '';
    expect(str).toContain('RtvSuccess');
  });

  it('should have a readonly mvv property as set from constructor', () => {
    const mvv = 1;
    const result = new RtvSuccess({ mvv });
    expect(result.hasOwnProperty('mvv')).toBe(true);
    expect(result.mvv).toBe(mvv);

    expect(function () {
      result.mvv = mvv + 1;
    }).toThrow(/Cannot assign to read only property 'mvv'/);

    // not changed since readonly
    expect(result.mvv).toBe(mvv);
  });

  it('allows mvv to be undefined', () => {
    expect(new RtvSuccess({}).mvv).toBeUndefined();
  });
});
