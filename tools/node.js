////// Manual Node.js Testing

// NOTE: this will load because Node will naturally resolve the external references
//  to @babel/runtime and lodash in ../node_modules
// eslint-disable-next-line node/no-missing-require -- only exists if `npm run build` has run
global.rtv = require('../dist/rtv.slim.js');

global.ld = require('lodash');
global.ostr = function (v) {
  return Object.prototype.toString.call(v);
};
