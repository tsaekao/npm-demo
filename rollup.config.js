////// Rollup Configuration

const builds = require('./tools/build/rollup-builds');

module.exports = [
  builds.getCjsConfig(), // Dev and Prod combined
  builds.getCjsConfig({ isSlim: true }), // Dev and Prod combined, externals
  builds.getEsmConfig(), // Dev and Prod combined
  builds.getEsmConfig({ isSlim: true }), // Dev and Prod combined, externals
  builds.getUmdConfig({ isDev: true }), // Dev (not minified)
  builds.getUmdConfig({ isDev: true, isSlim: true }), // Dev (not minified), externals
  builds.getUmdConfig(), // Prod + minified
  builds.getUmdConfig({ isSlim: true }), // Prod + minified, externals
];
