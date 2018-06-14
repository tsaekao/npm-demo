import {expect} from 'chai';
import _ from 'lodash';

import types from '../../src/lib/types';
import qualifiers from '../../src/lib/qualifiers';
import RtvError from '../../src/lib/RtvError';

describe('module: lib/RtvError', function() {
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

  it('should have a message including the value and path', function() {
    const value = null;
    const typeset = [types.STRING];
    const path = 'the.path';
    const cause = [qualifiers.REQUIRED, types.STRING];
    const err = new RtvError(value, typeset, path, cause);
    expect(err.message).to.contain(`value=${value}`);
    expect(err.message).to.contain(`path=${path}`);
  });

  it('should extend Error', function() {
    const value = null;
    const typeset = [types.STRING];
    const path = 'the.path';
    const cause = [qualifiers.REQUIRED, types.STRING];
    const err = new RtvError(value, typeset, path, cause);
    expect(err instanceof Error).to.equal(true);
    expect(err.name).to.equal('RtvError');
  });

  it('should have a readonly valid=false property', function() {
    const err = new RtvError('', types.STRING, ['path'], [qualifiers.REQUIRED, types.STRING]);
    expect(err.hasOwnProperty('valid')).to.equal(true);
    expect(err.valid).to.equal(false);

    expect(function() {
      err.valid = true;
    }).to.throw(/Cannot assign to read only property 'valid'/);

    // not changed since readonly
    expect(err.valid).to.equal(false);
  });

  it('should provide a readonly value, typeset, path, and cause property', function() {
    const value = null;
    const typeset = [types.STRING];
    const path = ['the', 'path'];
    const cause = [qualifiers.REQUIRED, types.STRING];
    const err = new RtvError(value, typeset, path, cause);

    expect(err.value).to.equal(value);
    expect(err.typeset).to.equal(typeset);
    expect(err.cause).to.equal(cause);
    expect(err.path).not.to.equal(path); // shallow-clone, so not same reference
    expect(err.path).to.eql(['the', 'path']); // shallow-clone

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

    // nothing changed all are readonly
    expect(err.value).to.equal(value);
    expect(err.typeset).to.equal(typeset);
    expect(err.cause).to.equal(cause);
    expect(err.path).not.to.equal(path); // shallow-clone, so not same reference
    expect(err.path).to.eql(['the', 'path']); // shallow-clone
  });

  it('should have custom string serialization', function() { // TODO fix this test
    const value = null;
    const path = ['the', 'path'];
    const err = new RtvError(value, types.STRING, path, [qualifiers.REQUIRED, types.STRING]);
    const str = err + '';
    expect(str.match(/^Error\: /)).to.equal(null); // not the default serialization
    expect(str).to.contain('RtvError');
    expect(str).to.contain(`value=${value}`);
    expect(str).to.contain(`path="${path.join('/')}"`);
  });
});
