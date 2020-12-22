////// Manual Node.js Testing

// NOTE: this will load because Node will naturally resolve the external references
//  to @babel/runtime and lodash in ../node_modules
global.rtv = require('../dist/rtv.js');

global.ld = require('lodash');
global.ostr = function(v) { return Object.prototype.toString.call(v); };
