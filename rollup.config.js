////// Rollup Configuration

const builds = require('./tools/build/rollup-builds');

module.exports = [
  builds.getUmdConfig(),
  builds.getUmdConfig(true), // minified
  builds.getCjsConfig(),
  builds.getCjsConfig(true) // minified
];
