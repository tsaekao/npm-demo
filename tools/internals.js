////// Manual Node.js testing of rtv internals

import * as rtv from '../src/rtv';
import * as impl from '../src/lib/impl';
import * as types from '../src/lib/types';
import * as qualifiers from '../src/lib/qualifiers';
import * as util from '../src/lib/util';
import * as validation from '../src/lib/validation';

global.rtvi = {
  rtv,
  lib: {
    impl,
    types,
    qualifiers,
    util,
    validation
  }
};
