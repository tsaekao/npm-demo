////// Rollup Configuration

const builds = require('./tools/build/rollup-builds');

module.exports = [
  builds.getCjsConfig(), // Dev and Prod combined
  builds.getEsmConfig(), // Dev and Prod combined
  builds.getUmdConfig(true), // Dev (not minified)
  builds.getUmdConfig(), // Prod + minified
];
