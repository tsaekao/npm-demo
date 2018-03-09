//// Rollup Configuration \\\\

'use strict';

import { default as jsonPlugin } from 'rollup-plugin-json';
import { default as resolvePlugin } from 'rollup-plugin-node-resolve';
import { default as babel } from 'rollup-plugin-babel';
import pkg from './package.json';

const LIB_NAME = 'rtv';

export default {
  input: 'src/rtv.js',
  output: [
    // ES Modules build
    // TODO: Is this format useful?
    {
      file: `dist/${LIB_NAME}.esm.js`,
      format: 'es',
      sourcemap: true
    },
    // UMD build
    {
      file: `dist/${LIB_NAME}.umd.js`,
      format: 'umd',
      name: LIB_NAME,
      noConflict: true,
      sourcemap: true
    }
  ],
  banner:
    '/*!\n' +
    ' * ' + LIB_NAME + ' ' + pkg.version + '\n' +
    ' * @license MIT, https://gitlab.com/stefcameron/rtvjs/blob/master/LICENSE.md\n' +
    ' * Parts of Lodash used internally: https://github.com/lodash/lodash/\n' +
    ' */',
  plugins: [
    jsonPlugin(),
    resolvePlugin(),
    babel({
      exclude: 'node_modules/**'
    })
  ],
  watch: {
    include: 'src/**',
    exclude: ['node_modules/**', 'dist/**']
  }
};
