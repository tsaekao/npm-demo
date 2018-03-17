import {expect} from 'chai';
import rtv from '../src/rtv';

describe('./rtv.js', function() {
  it('should verify a string value', function() {
    expect(rtv.verify.bind(rtv, 'foo', rtv.t.STRING)).not.to.throw();
  });
});
