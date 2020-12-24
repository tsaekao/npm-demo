import { expect } from 'chai';

import { types } from '../../src/lib/types';
import { qualifiers } from '../../src/lib/qualifiers';
import RtvError from '../../src/lib/RtvError';

describe('module: lib/RtvError', function () {
  it('should extend Error', function () {
    const value = null;
    const typeset = [types.STRING];
    const path = ['the', 'path'];
    const mismatch = [qualifiers.REQUIRED, types.STRING];
    const err = new RtvError(value, typeset, path, mismatch);
    expect(err instanceof Error).to.equal(true);
    expect(err.name).to.equal('RtvError');
  });

  it('should normalize falsy failures to undefined', function () {
    const value = null;
    const typeset = [types.STRING];
    const path = ['the', 'path'];
    const mismatch = [qualifiers.REQUIRED, types.STRING];

    let err = new RtvError(value, typeset, path, mismatch, 0);
    expect(err.rootCause).to.equal(undefined);

    err = new RtvError(value, typeset, path, mismatch, false);
    expect(err.rootCause).to.equal(undefined);

    err = new RtvError(value, typeset, path, mismatch, '');
    expect(err.rootCause).to.equal(undefined);

    err = new RtvError(value, typeset, path, mismatch, null);
    expect(err.rootCause).to.equal(undefined);
  });

  it('should accept any value', function () {
    const otherParams = [
      types.STRING,
      ['path'],
      [qualifiers.REQUIRED, types.STRING],
    ];

    expect(function () {
      new RtvError(undefined, ...otherParams);
    }).not.to.throw();

    expect(function () {
      new RtvError(null, ...otherParams);
    }).not.to.throw();

    expect(function () {
      new RtvError('', ...otherParams);
    }).not.to.throw();

    expect(function () {
      new RtvError(true, ...otherParams);
    }).not.to.throw();

    expect(function () {
      new RtvError(function () {}, ...otherParams);
    }).not.to.throw();

    expect(function () {
      new RtvError({}, ...otherParams);
    }).not.to.throw();

    expect(function () {
      new RtvError([], ...otherParams);
    }).not.to.throw();
  });

  it('should require a valid typeset', function () {
    const otherParams = [['path'], [qualifiers.REQUIRED, types.STRING]];

    expect(function () {
      new RtvError(null, types.STRING, ...otherParams);
    }).not.to.throw();

    expect(function () {
      new RtvError(null, [types.STRING], ...otherParams);
    }).not.to.throw();

    expect(function () {
      new RtvError(null, function () {}, ...otherParams);
    }).not.to.throw();

    expect(function () {
      new RtvError(null, { key: types.STRING }, ...otherParams);
    }).not.to.throw();

    expect(function () {
      new RtvError(null, {}, ...otherParams); // empty shapes are OK
    }).not.to.throw();

    expect(function () {
      new RtvError(null, null, ...otherParams);
    }).to.throw(/invalid typeset/i);

    expect(function () {
      new RtvError(null, '', ...otherParams);
    }).to.throw(/invalid typeset/i);

    expect(function () {
      new RtvError(null, [], ...otherParams);
    }).to.throw(/invalid typeset/i);
  });

  it('should require a valid path', function () {
    const otherParams = [[qualifiers.REQUIRED, types.STRING]];

    expect(function () {
      new RtvError(null, types.STRING, [], ...otherParams);
    }).not.to.throw();

    expect(function () {
      new RtvError(null, types.STRING, ['path'], ...otherParams);
    }).not.to.throw();

    expect(function () {
      new RtvError(null, types.STRING, '', ...otherParams);
    }).to.throw(/invalid path/i);

    expect(function () {
      new RtvError(null, types.STRING, true, ...otherParams);
    }).to.throw(/invalid path/i);

    expect(function () {
      new RtvError(null, types.STRING, {}, ...otherParams);
    }).to.throw(/invalid path/i);
  });

  it('should require a valid mismatch (fully-qualified typeset)', function () {
    expect(function () {
      new RtvError(
        null,
        types.STRING,
        ['path'],
        [qualifiers.REQUIRED, types.STRING]
      );
    }).not.to.throw();

    expect(function () {
      new RtvError(null, types.STRING, ['path'], [types.STRING]); // must be FQ'ed
    }).to.throw(/invalid mismatch/i);

    expect(function () {
      new RtvError(null, types.STRING, ['path'], types.STRING); // must be FQ'ed
    }).to.throw(/invalid mismatch/i);

    expect(function () {
      new RtvError(null, types.STRING, ['path'], [types.STRING]); // must be FQ'ed
    }).to.throw(/invalid mismatch/i);
  });

  it('should require a valid rootCause if specified', function () {
    expect(function () {
      new RtvError(
        null,
        types.STRING,
        ['path'],
        [qualifiers.REQUIRED, types.STRING],
        new Error()
      );
    }).not.to.throw();

    expect(function () {
      new RtvError(
        null,
        types.STRING,
        ['path'],
        [qualifiers.REQUIRED, types.STRING],
        new TypeError()
      );
    }).not.to.throw();

    expect(function () {
      new RtvError(
        null,
        types.STRING,
        ['path'],
        [qualifiers.REQUIRED, types.STRING],
        new RangeError()
      );
    }).not.to.throw();

    expect(function () {
      new RtvError(
        null,
        types.STRING,
        ['path'],
        [qualifiers.REQUIRED, types.STRING],
        'Error'
      );
    }).to.throw(/Invalid rootCause/);

    expect(function () {
      new RtvError(
        null,
        types.STRING,
        ['path'],
        [qualifiers.REQUIRED, types.STRING],
        null
      ); // falsy ignored
    }).not.to.throw();
  });

  it('should have a message including the value, path, mismatch', function () {
    const value = null;
    const typeset = [types.STRING];
    const path = ['the', 'path'];
    const mismatch = [qualifiers.REQUIRED, types.STRING];
    const err = new RtvError(value, typeset, path, mismatch);
    expect(err.message).to.contain(` path="/${path.join('/')}"`);
    expect(err.message).to.contain(
      ` mismatch=["${qualifiers.REQUIRED}","${types.STRING}"]`
    );
    expect(err.message).not.to.contain(' rootCause='); // rootCause not provided, so no rootCause message
    expect(err.message).not.to.contain(' typeset='); // typeset not provided, so no typeset message
    // for security reasons, should NOT contain the value in case it
    //  contains sensitive information like passwords
    expect(err.message).not.to.contain(' value=');
  });

  // eslint-disable-next-line max-len
  it('should have a message including the value, path, mismatch, and rootCause message', function () {
    const value = null;
    const typeset = [types.STRING];
    const path = ['the', 'path'];
    const mismatch = [qualifiers.REQUIRED, types.STRING];
    const rootCause = new Error('rootCause');
    const err = new RtvError(value, typeset, path, mismatch, rootCause);
    expect(err.message).to.contain(` path="/${path.join('/')}"`);
    expect(err.message).to.contain(
      ` mismatch=["${qualifiers.REQUIRED}","${types.STRING}"]`
    );
    expect(err.message).to.contain(` rootCause="${rootCause.message}"`);
    expect(err.message).not.to.contain(' typeset='); // typeset not provided, so no typeset message
    // for security reasons, should NOT contain the value in case it
    //  contains sensitive information like passwords
    expect(err.message).not.to.contain(' value=');
  });

  it('should have a message including path="/" with path array is empty', function () {
    const value = null;
    const typeset = [types.STRING];
    const path = [];
    const mismatch = [qualifiers.REQUIRED, types.STRING];
    const err = new RtvError(value, typeset, path, mismatch);
    expect(err.message).to.contain(' path="/"');
  });

  // eslint-disable-next-line max-len
  it('should provide readonly valid, value, typeset, path, mismatch, rootCause properties', function () {
    const value = { the: { path: 123 } };
    const typeset = [types.STRING];
    const path = ['the', 'path'];
    const mismatch = [qualifiers.REQUIRED, types.STRING];
    const rootCause = new Error('custom validator failed');
    const err = new RtvError(value, typeset, path, mismatch, rootCause);

    expect(err.valid).to.equal(false); // always false
    expect(err.value).to.equal(value);
    expect(err.typeset).to.equal(typeset);
    expect(err.path).to.equal(path);
    expect(err.mismatch).to.equal(mismatch);
    expect(err.rootCause).to.equal(rootCause);

    expect(function () {
      err.valid = true;
    }).to.throw(/Cannot assign to read only property 'valid'/);
    expect(function () {
      err.value = true;
    }).to.throw(/Cannot set property value of .+ which has only a getter/);
    expect(function () {
      err.typeset = {};
    }).to.throw(/Cannot set property typeset of .+ which has only a getter/);
    expect(function () {
      err.path = [];
    }).to.throw(/Cannot set property path of .+ which has only a getter/);
    expect(function () {
      err.mismatch = [];
    }).to.throw(/Cannot set property mismatch of .+ which has only a getter/);
    expect(function () {
      err.rootCause = new Error();
    }).to.throw(/Cannot set property rootCause of .+ which has only a getter/);

    // nothing changed all are readonly
    expect(err.valid).to.equal(false);
    expect(err.value).to.equal(value);
    expect(err.typeset).to.equal(typeset);
    expect(err.path).to.equal(path);
    expect(err.mismatch).to.equal(mismatch);
    expect(err.rootCause).to.equal(rootCause);
  });

  it('should have custom string serialization', function () {
    const value = null;
    const path = ['the', 'path'];
    const rootCause = new Error('custom validator failed');

    let err = new RtvError(value, types.STRING, path, [
      qualifiers.REQUIRED,
      types.STRING,
    ]);
    let str = err + '';

    expect(str.match(/^Error: /)).to.equal(null); // not the default serialization
    expect(str.match(/^{.+}$/)).not.to.equal(null); // wrapped in brackets
    expect(str).to.contain('rtvref.RtvError');
    expect(str).to.contain(` path="/${path.join('/')}"`);
    expect(str).to.contain(
      ` mismatch=["${qualifiers.REQUIRED}","${types.STRING}"]`
    );
    expect(str).to.contain(' rootCause=<none>');
    expect(err.message).not.to.contain(' typeset='); // typeset not provided, so no typeset message
    // for security reasons, should NOT contain the value in case it
    //  contains sensitive information like passwords
    expect(str).not.to.contain(' value=');

    err = new RtvError(
      value,
      types.STRING,
      path,
      [qualifiers.REQUIRED, types.STRING],
      rootCause
    );
    str = err + '';

    expect(str.match(/^Error: /)).to.equal(null); // not the default serialization
    expect(str.match(/^{.+}$/)).not.to.equal(null); // wrapped in brackets
    expect(str).to.contain('rtvref.RtvError');
    expect(str).to.contain(` path="/${path.join('/')}"`);
    expect(str).to.contain(
      ` mismatch=["${qualifiers.REQUIRED}","${types.STRING}"]`
    );
    expect(str).to.contain(` rootCause="${rootCause.message}"`);
    expect(err.message).not.to.contain(' typeset='); // typeset not provided, so no typeset message
    // for security reasons, should NOT contain the value in case it
    //  contains sensitive information like passwords
    expect(str).not.to.contain(' value=');
  });
});
