////// Rollup Configuration for internals.js module

const jsonPlugin = require('@rollup/plugin-json');
const { nodeResolve: resolvePlugin } = require('@rollup/plugin-node-resolve');
const cjsPlugin = require('@rollup/plugin-commonjs');

const LIB_NAME = 'internals';

const config = {
  input: 'tools/internals.js',
  output: [
    // CJS Module build
    {
      file: `dist_tools/${LIB_NAME}.js`,
      format: 'cjs',
      sourcemap: true,
    },
  ],
  plugins: [
    jsonPlugin(),
    resolvePlugin(),
    cjsPlugin({
      include: 'node_modules/**',
    }),
  ],
  watch: {
    include: 'src/**',
    exclude: ['node_modules/**', 'dist/**', 'dist_tools/**'],
  },
};

module.exports = [config];
