import { types } from '../../src/lib/types';
import { qualifiers } from '../../src/lib/qualifiers';
import { RtvError } from '../../src/lib/RtvError';

describe('module: lib/RtvError', () => {
  it('should extend Error', () => {
    const value = null;
    const typeset = [types.STRING];
    const path = ['the', 'path'];
    const mismatch = [qualifiers.REQUIRED, types.STRING];
    const err = new RtvError(value, typeset, path, mismatch);
    expect(err instanceof Error).toBe(true);
    expect(err.name).toBe('RtvError');
  });

  it('should normalize falsy failures to undefined', () => {
    const value = null;
    const typeset = [types.STRING];
    const path = ['the', 'path'];
    const mismatch = [qualifiers.REQUIRED, types.STRING];

    let err = new RtvError(value, typeset, path, mismatch, 0);
    expect(err.rootCause).toBeUndefined();

    err = new RtvError(value, typeset, path, mismatch, false);
    expect(err.rootCause).toBeUndefined();

    err = new RtvError(value, typeset, path, mismatch, '');
    expect(err.rootCause).toBeUndefined();

    err = new RtvError(value, typeset, path, mismatch, null);
    expect(err.rootCause).toBeUndefined();
  });

  it('should accept any value', () => {
    const otherParams = [
      types.STRING,
      ['path'],
      [qualifiers.REQUIRED, types.STRING],
    ];

    expect(function () {
      new RtvError(undefined, ...otherParams);
    }).not.toThrow();

    expect(function () {
      new RtvError(null, ...otherParams);
    }).not.toThrow();

    expect(function () {
      new RtvError('', ...otherParams);
    }).not.toThrow();

    expect(function () {
      new RtvError(true, ...otherParams);
    }).not.toThrow();

    expect(function () {
      new RtvError(function () {}, ...otherParams);
    }).not.toThrow();

    expect(function () {
      new RtvError({}, ...otherParams);
    }).not.toThrow();

    expect(function () {
      new RtvError([], ...otherParams);
    }).not.toThrow();
  });

  it('should require a valid typeset', () => {
    const otherParams = [['path'], [qualifiers.REQUIRED, types.STRING]];

    expect(function () {
      new RtvError(null, types.STRING, ...otherParams);
    }).not.toThrow();

    expect(function () {
      new RtvError(null, [types.STRING], ...otherParams);
    }).not.toThrow();

    expect(function () {
      new RtvError(null, function () {}, ...otherParams);
    }).not.toThrow();

    expect(function () {
      new RtvError(null, { key: types.STRING }, ...otherParams);
    }).not.toThrow();

    expect(function () {
      new RtvError(null, {}, ...otherParams); // empty shapes are OK
    }).not.toThrow();

    expect(function () {
      new RtvError(null, null, ...otherParams);
    }).toThrow(/invalid typeset/i);

    expect(function () {
      new RtvError(null, '', ...otherParams);
    }).toThrow(/invalid typeset/i);

    expect(function () {
      new RtvError(null, [], ...otherParams);
    }).toThrow(/invalid typeset/i);
  });

  it('should require a valid path', () => {
    const otherParams = [[qualifiers.REQUIRED, types.STRING]];

    expect(function () {
      new RtvError(null, types.STRING, [], ...otherParams);
    }).not.toThrow();

    expect(function () {
      new RtvError(null, types.STRING, ['path'], ...otherParams);
    }).not.toThrow();

    expect(function () {
      new RtvError(null, types.STRING, '', ...otherParams);
    }).toThrow(/invalid path/i);

    expect(function () {
      new RtvError(null, types.STRING, true, ...otherParams);
    }).toThrow(/invalid path/i);

    expect(function () {
      new RtvError(null, types.STRING, {}, ...otherParams);
    }).toThrow(/invalid path/i);
  });

  it('should require a valid mismatch (fully-qualified typeset)', () => {
    expect(function () {
      new RtvError(
        null,
        types.STRING,
        ['path'],
        [qualifiers.REQUIRED, types.STRING]
      );
    }).not.toThrow();

    expect(function () {
      new RtvError(null, types.STRING, ['path'], [types.STRING]); // must be fully-qualified
    }).toThrow(/invalid mismatch/i);

    expect(function () {
      new RtvError(null, types.STRING, ['path'], types.STRING); // must be fully-qualified
    }).toThrow(/invalid mismatch/i);

    expect(function () {
      new RtvError(null, types.STRING, ['path'], [types.STRING]); // must be fully-qualified
    }).toThrow(/invalid mismatch/i);
  });

  it('should require a valid rootCause if specified', () => {
    expect(function () {
      new RtvError(
        null,
        types.STRING,
        ['path'],
        [qualifiers.REQUIRED, types.STRING],
        new Error()
      );
    }).not.toThrow();

    expect(function () {
      new RtvError(
        null,
        types.STRING,
        ['path'],
        [qualifiers.REQUIRED, types.STRING],
        new TypeError()
      );
    }).not.toThrow();

    expect(function () {
      new RtvError(
        null,
        types.STRING,
        ['path'],
        [qualifiers.REQUIRED, types.STRING],
        new RangeError()
      );
    }).not.toThrow();

    expect(function () {
      new RtvError(
        null,
        types.STRING,
        ['path'],
        [qualifiers.REQUIRED, types.STRING],
        'Error'
      );
    }).toThrow(/Invalid rootCause/);

    expect(function () {
      new RtvError(
        null,
        types.STRING,
        ['path'],
        [qualifiers.REQUIRED, types.STRING],
        null
      ); // falsy ignored
    }).not.toThrow();
  });

  it('should have a message including the value, path, mismatch', () => {
    const value = null;
    const typeset = [types.STRING];
    const path = ['the', 'path'];
    const mismatch = [qualifiers.REQUIRED, types.STRING];
    const err = new RtvError(value, typeset, path, mismatch);
    expect(err.message).toEqual(
      expect.stringContaining(` path="/${path.join('/')}"`)
    );
    expect(err.message).toEqual(
      expect.stringContaining(
        ` mismatch=["${qualifiers.REQUIRED}","${types.STRING}"]`
      )
    );
    expect(err.message).not.toContain(' rootCause='); // rootCause not provided, so no rootCause message
    expect(err.message).not.toContain(' typeset='); // typeset not provided, so no typeset message
    // for security reasons, should NOT contain the value in case it
    //  contains sensitive information like passwords
    expect(err.message).not.toContain(' value=');
  });

  // eslint-disable-next-line max-len
  it('should have a message including the value, path, mismatch, and rootCause message', () => {
    const value = null;
    const typeset = [types.STRING];
    const path = ['the', 'path'];
    const mismatch = [qualifiers.REQUIRED, types.STRING];
    const rootCause = new Error('rootCause');
    const err = new RtvError(value, typeset, path, mismatch, rootCause);
    expect(err.message).toEqual(
      expect.stringContaining(` path="/${path.join('/')}"`)
    );
    expect(err.message).toEqual(
      expect.stringContaining(
        ` mismatch=["${qualifiers.REQUIRED}","${types.STRING}"]`
      )
    );
    expect(err.message).toEqual(
      expect.stringContaining(` rootCause="${rootCause.message}"`)
    );
    expect(err.message).not.toContain(' typeset='); // typeset not provided, so no typeset message
    // for security reasons, should NOT contain the value in case it
    //  contains sensitive information like passwords
    expect(err.message).not.toContain(' value=');
  });

  it('should have a message including path="/" with path array is empty', () => {
    const value = null;
    const typeset = [types.STRING];
    const path = [];
    const mismatch = [qualifiers.REQUIRED, types.STRING];
    const err = new RtvError(value, typeset, path, mismatch);
    expect(err.message).toContain(' path="/"');
  });

  // eslint-disable-next-line max-len
  it('should provide readonly valid, value, typeset, path, mismatch, rootCause properties', () => {
    const value = { the: { path: 123 } };
    const typeset = [types.STRING];
    const path = ['the', 'path'];
    const mismatch = [qualifiers.REQUIRED, types.STRING];
    const rootCause = new Error('custom validator failed');
    const err = new RtvError(value, typeset, path, mismatch, rootCause);

    expect(err.valid).toBe(false); // always false
    expect(err.value).toBe(value);
    expect(err.typeset).toBe(typeset);
    expect(err.path).toBe(path);
    expect(err.mismatch).toBe(mismatch);
    expect(err.rootCause).toBe(rootCause);

    expect(function () {
      err.valid = true;
    }).toThrow(/Cannot assign to read only property 'valid'/);
    expect(function () {
      err.value = true;
    }).toThrow(/Cannot set property value of .+ which has only a getter/);
    expect(function () {
      err.typeset = {};
    }).toThrow(/Cannot set property typeset of .+ which has only a getter/);
    expect(function () {
      err.path = [];
    }).toThrow(/Cannot set property path of .+ which has only a getter/);
    expect(function () {
      err.mismatch = [];
    }).toThrow(/Cannot set property mismatch of .+ which has only a getter/);
    expect(function () {
      err.rootCause = new Error();
    }).toThrow(/Cannot set property rootCause of .+ which has only a getter/);

    // nothing changed all are readonly
    expect(err.valid).toBe(false);
    expect(err.value).toBe(value);
    expect(err.typeset).toBe(typeset);
    expect(err.path).toBe(path);
    expect(err.mismatch).toBe(mismatch);
    expect(err.rootCause).toBe(rootCause);
  });

  it('should have custom string serialization', () => {
    const value = null;
    const path = ['the', 'path'];
    const rootCause = new Error('custom validator failed');

    let err = new RtvError(value, types.STRING, path, [
      qualifiers.REQUIRED,
      types.STRING,
    ]);
    let str = err + '';

    expect(str.match(/^Error: /)).toBeNull(); // not the default serialization
    expect(str.match(/^{.+}$/)).not.toBeNull(); // wrapped in brackets
    expect(str).toContain('rtvref.RtvError');
    expect(str).toEqual(expect.stringContaining(` path="/${path.join('/')}"`));
    expect(str).toEqual(
      expect.stringContaining(
        ` mismatch=["${qualifiers.REQUIRED}","${types.STRING}"]`
      )
    );
    expect(str).toContain(' rootCause=<none>');
    expect(err.message).not.toContain(' typeset='); // typeset not provided, so no typeset message
    // for security reasons, should NOT contain the value in case it
    //  contains sensitive information like passwords
    expect(str).not.toContain(' value=');

    err = new RtvError(
      value,
      types.STRING,
      path,
      [qualifiers.REQUIRED, types.STRING],
      rootCause
    );
    str = err + '';

    expect(str.match(/^Error: /)).toBeNull(); // not the default serialization
    expect(str.match(/^{.+}$/)).not.toBeNull(); // wrapped in brackets
    expect(str).toContain('rtvref.RtvError');
    expect(str).toEqual(expect.stringContaining(` path="/${path.join('/')}"`));
    expect(str).toEqual(
      expect.stringContaining(
        ` mismatch=["${qualifiers.REQUIRED}","${types.STRING}"]`
      )
    );
    expect(str).toEqual(
      expect.stringContaining(` rootCause="${rootCause.message}"`)
    );
    expect(err.message).not.toContain(' typeset='); // typeset not provided, so no typeset message
    // for security reasons, should NOT contain the value in case it
    //  contains sensitive information like passwords
    expect(str).not.toContain(' value=');
  });
});
