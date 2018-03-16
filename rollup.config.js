//// Rollup Configuration \\\\

'use strict';

const jsonPlugin = require('rollup-plugin-json');
const resolvePlugin = require('rollup-plugin-node-resolve');
const cjsPlugin = require('rollup-plugin-commonjs');
const babelPlugin = require('rollup-plugin-babel');
const uglifyPlugin = require('rollup-plugin-uglify');
const merge = require('lodash/merge');
const cloneDeep = require('lodash/cloneDeep');
const pkg = require('./package.json');

const LIB_NAME = 'rtv';

const banner = `/*!
* ${pkg.name} ${pkg.version}
* @license MIT, https://gitlab.com/stefcameron/rtvjs/blob/master/LICENSE.md
* Parts of Lodash used internally: https://github.com/lodash/lodash/
*/`;

const config = {
  input: 'src/rtv.js',
  output: [
    // ES Module build
    {
      file: `dist/${LIB_NAME}.esm.js`,
      format: 'es',
      sourcemap: true,
      banner
    },
    // UMD build
    {
      file: `dist/${LIB_NAME}.umd.js`,
      format: 'umd',
      name: pkg.name,
      noConflict: true,
      sourcemap: true,
      banner
    }
  ],
  plugins: [
    jsonPlugin(),
    resolvePlugin(),
    cjsPlugin({
      include: 'node_modules/**'
    }),
    babelPlugin({
      exclude: 'node_modules/**'
    })
  ],
  watch: {
    include: 'src/**',
    exclude: ['node_modules/**', 'dist/**']
  }
};

// uglify plugin configuration
const uglifyConfig = {
  output: {
    // comments: /^\/\*!/
    comments(node, comment) {
      const text = comment.value;
      const type = comment.type;
      if (type === 'comment2') {
        // multiline comment: keep if it starts with a bang or contains
        //  some common preservation keywords
        return text.indexOf('!') === 0 ||
            (/@preserve|@license|@cc_on/i).test(text);
      }
    }
  }
};

// since plugins is an array, we have to shallow-clone it before adding the uglify
//  plugin so we don't add it to all full build configs (which are all referencing
//  the same plugins array from baseConfig) since it's all the same array in memory
//  (and we don't really want/need to deep-clone it since we're just going to add
//  to the array, not modify any elements within it)
const minPlugins = config.plugins.concat();
minPlugins.push(uglifyPlugin(uglifyConfig));

const minConfig = merge({}, config);
minConfig.plugins = minPlugins;
minConfig.output = cloneDeep(minConfig.output); // deep-clone this because we'll change objects within
minConfig.output.forEach(function(out) {
  out.file = out.file.replace('.js', '.min.js');
});

module.exports = [config, minConfig];
