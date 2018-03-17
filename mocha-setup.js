//// Mocha Env Setup \\\\

// auto-compile files on-the-fly as they are require()'d in Node by Mocha; this
//  way, we can write our test files as ES6 modules instead of CJS modules
require('babel-register');

// TODO: Eventually, we could create integration tests where we setup a DOM
//  instance here, using jsdomify or jsdom-globals, and also require the UMD
//  version of rtv.js, and then run some tests on the whole thing.
// @see https://github.com/dmatteo/jsdomify
// @see https://github.com/rstacruz/jsdom-global
// @see https://github.com/jsdom/jsdom
// @see https://github.com/airbnb/enzyme/blob/master/docs/guides/jsdom.md

module.exports = {}; // nothing for now
