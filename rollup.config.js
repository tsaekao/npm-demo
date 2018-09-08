////// Rollup Configuration

const jsonPlugin = require('rollup-plugin-json');
const resolvePlugin = require('rollup-plugin-node-resolve');
const cjsPlugin = require('rollup-plugin-commonjs');
const babelPlugin = require('rollup-plugin-babel');
const {uglify: uglifyEs5Plugin} = require('rollup-plugin-uglify');
const {terser: uglifyEs6Plugin} = require('rollup-plugin-terser');
const pkg = require('./package.json');

const LIB_NAME = 'rtv';

const banner = `/*!
* ${pkg.name} ${pkg.version}
* @license MIT, https://gitlab.com/stefcameron/rtvjs/blob/master/LICENSE.md
* Parts of Lodash used internally: https://github.com/lodash/lodash/
*/`;

// base config with NO outputs
const getBaseConfig = function() {
  return {
    input: 'src/rtv.js',
    output: [],
    plugins: [
      jsonPlugin(),
      resolvePlugin(),
      cjsPlugin({
        include: 'node_modules/**'
      }),

      // NOTE: As of Babel 7, this plugin now ensures that Babel helpers are not
      //  repeated, and are inserted at the top of the generated bundle:
      //  "This rollup plugin automatically deduplicates those helpers, keeping
      //  only one copy of each one used in the output bundle. Rollup will combine
      //  the helpers in a single block at the top of your bundle."
      //  @see https://github.com/rollup/rollup-plugin-babel#helpers
      babelPlugin({
        exclude: 'node_modules/**'
      })
    ],
    watch: {
      include: 'src/**',
      exclude: ['node_modules/**', 'dist/**', 'dist_tools/**']
    }
  };
};

// uglify plugin (ES5 and ES6) configuration
const getUglifyConfig = function() {
  return {
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
};

// UMD (ES5) build config
const getUmdConfig = function(minified) {
  const config = getBaseConfig();

  config.output.push({
    file: `dist/${LIB_NAME}.umd.${minified ? 'min.js' : 'js'}`,
    format: 'umd',
    name: pkg.name,
    noConflict: true,
    sourcemap: true,
    banner
  });

  if (minified) {
    const uglifyConfig = getUglifyConfig();
    config.plugins.push(uglifyEs5Plugin(uglifyConfig));
  }

  return config;
};

// ESM (ES5 but using ES6 module syntax) build config
const getEsmConfig = function(minified) {
  const config = getBaseConfig();

  config.output.push({
    file: `dist/${LIB_NAME}.esm.${minified ? 'min.js' : 'js'}`,
    format: 'es',
    sourcemap: true,
    banner
  });

  if (minified) {
    const uglifyConfig = getUglifyConfig();
    config.plugins.push(uglifyEs6Plugin(uglifyConfig));
  }

  return config;
};

module.exports = [
  getUmdConfig(),
  getUmdConfig(true), // minified
  getEsmConfig(),
  getEsmConfig(true) // minified
];
