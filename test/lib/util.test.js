import {expect} from 'chai';

import * as util from '../../src/lib/util';

describe('module: lib/util', function() {
  it('should print just about anything', function() {
    expect(util.print(() => {})).to.equal('<function>');
    expect(util.print(null)).to.equal('null');
    expect(util.print(undefined)).to.equal('undefined');
    expect(util.print([])).to.equal('[]');
    expect(util.print([true])).to.equal('[true]');
    expect(util.print({})).to.equal('{}');
    expect(util.print({foo: 1})).to.equal('{"foo":1}');
    expect(util.print('')).to.equal('""');
    expect(util.print(123)).to.equal('123');
  });
});
