//// Rollup Configuration for internals.js module \\\\

const jsonPlugin = require('rollup-plugin-json');
const resolvePlugin = require('rollup-plugin-node-resolve');
const cjsPlugin = require('rollup-plugin-commonjs');

// DEBUG: not needed?
// const babelPlugin = require('rollup-plugin-babel');
// const uglifyPlugin = require('rollup-plugin-uglify');
// const merge = require('lodash/merge');
// const cloneDeep = require('lodash/cloneDeep');
// const pkg = require('./package.json');

const LIB_NAME = 'internals';

const config = {
  input: 'tools/internals.js',
  output: [
    // CJS Module build
    {
      file: `dist_tools/${LIB_NAME}.js`,
      format: 'cjs',
      sourcemap: true
    }
  ],
  plugins: [
    jsonPlugin(),
    resolvePlugin(),
    cjsPlugin({
      include: 'node_modules/**'
    // DEBUG: not needed?
    // }),
    // babelPlugin({
    //   exclude: 'node_modules/**'
    })
  ],
  watch: {
    include: 'src/**',
    exclude: ['node_modules/**', 'dist/**', 'dist_tools/**']
  }
};

module.exports = [config];
