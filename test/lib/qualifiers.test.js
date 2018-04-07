import {expect} from 'chai';
import _ from 'lodash';

import * as mod from '../../src/lib/qualifiers';
import Enumeration from '../../src/lib/Enumeration';

describe('module: lib/qualifiers', function() {
  const qualifiers = mod.default;

  it('should export a "qualifiers" enumeration', function() {
    expect(qualifiers instanceof Enumeration).to.equal(true);
  });

  it('should export an enumeration of all qualifiers (keys)', function() {
    // keys the module exports, less 'qualifiers'
    const modKeys = _.pull(Object.keys(mod), 'qualifiers');
    // keys in the qualifiers enum
    const qualifiersKeys = Object.keys(qualifiers);

    // anything in modKeys that is not in qualifiersKeys?
    // this will break if a new type was added to the module, but wasn't added
    //  to the module's 'qualifiers' enum
    expect(_.difference(qualifiersKeys, modKeys)).to.eql([]);
  });

  it('should export an enumeration of all qualifiers (values)', function() {
    // values the module exports, less 'qualifiers' enum
    const modValues = _.pull(_.values(mod), qualifiers);
    // values in the qualifiers enum
    const qualifiersValues = qualifiers.$values;

    expect(_.difference(qualifiersValues, modValues)).to.eql([]);
  });
});
