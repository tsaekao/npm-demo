import {expect} from 'chai';
import _ from 'lodash';

import * as mod from '../../src/lib/types';
import Enumeration from '../../src/lib/Enumeration';

describe('module: lib/types', function() {
  const types = mod.default;

  it('should export a "types" enumeration', function() {
    expect(types instanceof Enumeration).to.equal(true);
  });

  it('should export an enumeration of all types (keys)', function() {
    // keys the module exports, less 'types'
    const modKeys = _.pull(Object.keys(mod), 'types');
    // keys in the types enum
    const typesKeys = Object.keys(types);

    // anything in modKeys that is not in typesKeys?
    // this will break if a new type was added to the module, but wasn't added
    //  to the module's 'types' enum
    expect(_.difference(typesKeys, modKeys)).to.eql([]);
  });

  it('should export an enumeration of all types (values)', function() {
    // values the module exports, less 'types' enum
    const modValues = _.pull(_.values(mod), types);
    // values in the types enum
    const typesValues = types.$values;

    expect(_.difference(typesValues, modValues)).to.eql([]);
  });
});
