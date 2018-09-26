import {expect} from 'chai';

import types from '../../src/lib/types';
import qualifiers from '../../src/lib/qualifiers';
import RtvError from '../../src/lib/RtvError';
import {print} from '../../src/lib/util';

describe('module: lib/RtvError', function() {
  it('should extend Error', function() {
    const value = null;
    const typeset = [types.STRING];
    const path = ['the', 'path'];
    const cause = [qualifiers.REQUIRED, types.STRING];
    const err = new RtvError(value, typeset, path, cause);
    expect(err instanceof Error).to.equal(true);
    expect(err.name).to.equal('RtvError');
  });

  it('should normalize falsy failures to undefined', function() {
    const value = null;
    const typeset = [types.STRING];
    const path = ['the', 'path'];
    const cause = [qualifiers.REQUIRED, types.STRING];

    let err = new RtvError(value, typeset, path, cause, 0);
    expect(err.failure).to.equal(undefined);

    err = new RtvError(value, typeset, path, cause, false);
    expect(err.failure).to.equal(undefined);

    err = new RtvError(value, typeset, path, cause, '');
    expect(err.failure).to.equal(undefined);

    err = new RtvError(value, typeset, path, cause, null);
    expect(err.failure).to.equal(undefined);
  });

  it('should accept any value', function() {
    const otherParams = [types.STRING, ['path'], [qualifiers.REQUIRED, types.STRING]];

    expect(function() {
      new RtvError(undefined, ...otherParams);
    }).not.to.throw();

    expect(function() {
      new RtvError(null, ...otherParams);
    }).not.to.throw();

    expect(function() {
      new RtvError('', ...otherParams);
    }).not.to.throw();

    expect(function() {
      new RtvError(true, ...otherParams);
    }).not.to.throw();

    expect(function() {
      new RtvError(function() {}, ...otherParams);
    }).not.to.throw();

    expect(function() {
      new RtvError({}, ...otherParams);
    }).not.to.throw();

    expect(function() {
      new RtvError([], ...otherParams);
    }).not.to.throw();
  });

  it('should require a valid typeset', function() {
    const otherParams = [['path'], [qualifiers.REQUIRED, types.STRING]];

    expect(function() {
      new RtvError(null, types.STRING, ...otherParams);
    }).not.to.throw();

    expect(function() {
      new RtvError(null, [types.STRING], ...otherParams);
    }).not.to.throw();

    expect(function() {
      new RtvError(null, function() {}, ...otherParams);
    }).not.to.throw();

    expect(function() {
      new RtvError(null, {key: types.STRING}, ...otherParams);
    }).not.to.throw();

    expect(function() {
      new RtvError(null, {}, ...otherParams); // empty shapes are OK
    }).not.to.throw();

    expect(function() {
      new RtvError(null, null, ...otherParams);
    }).to.throw(/invalid typeset/i);

    expect(function() {
      new RtvError(null, '', ...otherParams);
    }).to.throw(/invalid typeset/i);

    expect(function() {
      new RtvError(null, [], ...otherParams);
    }).to.throw(/invalid typeset/i);
  });

  it('should require a valid path', function() {
    const otherParams = [[qualifiers.REQUIRED, types.STRING]];

    expect(function() {
      new RtvError(null, types.STRING, [], ...otherParams);
    }).not.to.throw();

    expect(function() {
      new RtvError(null, types.STRING, ['path'], ...otherParams);
    }).not.to.throw();

    expect(function() {
      new RtvError(null, types.STRING, '', ...otherParams);
    }).to.throw(/invalid path/i);

    expect(function() {
      new RtvError(null, types.STRING, true, ...otherParams);
    }).to.throw(/invalid path/i);

    expect(function() {
      new RtvError(null, types.STRING, {}, ...otherParams);
    }).to.throw(/invalid path/i);
  });

  it('should require a valid cause (fully-qualified typeset)', function() {
    expect(function() {
      new RtvError(null, types.STRING, ['path'], [qualifiers.REQUIRED, types.STRING]);
    }).not.to.throw();

    expect(function() {
      new RtvError(null, types.STRING, ['path'], [types.STRING]); // must be FQ'ed
    }).to.throw(/invalid cause/i);

    expect(function() {
      new RtvError(null, types.STRING, ['path'], types.STRING); // must be FQ'ed
    }).to.throw(/invalid cause/i);

    expect(function() {
      new RtvError(null, types.STRING, ['path'], [types.STRING]); // must be FQ'ed
    }).to.throw(/invalid cause/i);
  });

  it('should require a valid failure if specified', function() {
    expect(function() {
      new RtvError(null, types.STRING, ['path'], [qualifiers.REQUIRED, types.STRING], new Error());
    }).not.to.throw();

    expect(function() {
      new RtvError(null, types.STRING, ['path'], [qualifiers.REQUIRED, types.STRING],
          new TypeError());
    }).not.to.throw();

    expect(function() {
      new RtvError(null, types.STRING, ['path'], [qualifiers.REQUIRED, types.STRING],
          new RangeError());
    }).not.to.throw();

    expect(function() {
      new RtvError(null, types.STRING, ['path'], [qualifiers.REQUIRED, types.STRING], 'Error');
    }).to.throw(/Invalid failure/);

    expect(function() {
      new RtvError(null, types.STRING, ['path'], [qualifiers.REQUIRED, types.STRING], null); // falsy ignored
    }).not.to.throw();
  });

  it('should have a message including the value, path, cause', function() {
    const value = null;
    const typeset = [types.STRING];
    const path = ['the', 'path'];
    const cause = [qualifiers.REQUIRED, types.STRING];
    const err = new RtvError(value, typeset, path, cause);
    expect(err.message).to.contain(` path="/${path.join('/')}"`);
    expect(err.message).to.contain(` cause=["${qualifiers.REQUIRED}","${types.STRING}"]`);
    expect(err.message).not.to.contain(' failure='); // failure not provided, so no failure message
    expect(err.message).to.contain(` typeset=${print(typeset)}`);
    // for security reasons, should NOT contain the value in case it
    //  contains sensitive information like passwords
    expect(err.message).not.to.contain(' value=');
  });

  it('should have a message including the value, path, cause, and failure message', function() {
    const value = null;
    const typeset = [types.STRING];
    const path = ['the', 'path'];
    const cause = [qualifiers.REQUIRED, types.STRING];
    const failure = new Error('failure');
    const err = new RtvError(value, typeset, path, cause, failure);
    expect(err.message).to.contain(` path="/${path.join('/')}"`);
    expect(err.message).to.contain(` cause=["${qualifiers.REQUIRED}","${types.STRING}"]`);
    expect(err.message).to.contain(` failure="${failure.message}"`);
    expect(err.message).to.contain(` typeset=${print(typeset)}`);
    // for security reasons, should NOT contain the value in case it
    //  contains sensitive information like passwords
    expect(err.message).not.to.contain(' value=');
  });

  it('should have a message including path="/" with path array is empty', function() {
    const value = null;
    const typeset = [types.STRING];
    const path = [];
    const cause = [qualifiers.REQUIRED, types.STRING];
    const err = new RtvError(value, typeset, path, cause);
    expect(err.message).to.contain(' path="/"');
  });

  it('should provide readonly valid, value, typeset, path, cause, failure properties', function() {
    const value = {the: {path: 123}};
    const typeset = [types.STRING];
    const path = ['the', 'path'];
    const cause = [qualifiers.REQUIRED, types.STRING];
    const failure = new Error('custom validator failed');
    const err = new RtvError(value, typeset, path, cause, failure);

    expect(err.valid).to.equal(false); // always false
    expect(err.value).to.equal(value);
    expect(err.typeset).to.equal(typeset);
    expect(err.path).to.equal(path);
    expect(err.cause).to.equal(cause);
    expect(err.failure).to.equal(failure);

    expect(function() {
      err.valid = true;
    }).to.throw(/Cannot assign to read only property 'valid'/);
    expect(function() {
      err.value = true;
    }).to.throw(/Cannot set property value of .+ which has only a getter/);
    expect(function() {
      err.typeset = {};
    }).to.throw(/Cannot set property typeset of .+ which has only a getter/);
    expect(function() {
      err.path = [];
    }).to.throw(/Cannot set property path of .+ which has only a getter/);
    expect(function() {
      err.cause = [];
    }).to.throw(/Cannot set property cause of .+ which has only a getter/);
    expect(function() {
      err.failure = new Error();
    }).to.throw(/Cannot set property failure of .+ which has only a getter/);

    // nothing changed all are readonly
    expect(err.valid).to.equal(false);
    expect(err.value).to.equal(value);
    expect(err.typeset).to.equal(typeset);
    expect(err.path).to.equal(path);
    expect(err.cause).to.equal(cause);
    expect(err.failure).to.equal(failure);
  });

  it('should have custom string serialization', function() {
    const value = null;
    const path = ['the', 'path'];
    const failure = new Error('custom validator failed');

    let err = new RtvError(value, types.STRING, path, [qualifiers.REQUIRED, types.STRING]);
    let str = err + '';

    expect(str.match(/^Error: /)).to.equal(null); // not the default serialization
    expect(str).to.contain('rtvref.RtvError');
    expect(str).to.contain(` path="/${path.join('/')}"`);
    expect(str).to.contain(` cause=["${qualifiers.REQUIRED}","${types.STRING}"]`);
    expect(str).to.contain(' failure=<none>');
    expect(str).to.contain(` typeset=${print(err.typeset)}`);
    // for security reasons, should NOT contain the value in case it
    //  contains sensitive information like passwords
    expect(str).not.to.contain(' value=');

    err = new RtvError(value, types.STRING, path, [qualifiers.REQUIRED, types.STRING], failure);
    str = err + '';

    expect(str.match(/^Error: /)).to.equal(null); // not the default serialization
    expect(str).to.contain('RtvError');
    expect(str).to.contain(` path="/${path.join('/')}"`);
    expect(str).to.contain(` cause=["${qualifiers.REQUIRED}","${types.STRING}"]`);
    expect(str).to.contain(` failure="${failure.message}"`);
    expect(str).to.contain(` typeset=${print(err.typeset)}`);
    // for security reasons, should NOT contain the value in case it
    //  contains sensitive information like passwords
    expect(str).not.to.contain(' value=');
  });
});
