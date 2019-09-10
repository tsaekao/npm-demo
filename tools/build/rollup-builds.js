////// Rollup Build Configurations

const jsonPlugin = require('rollup-plugin-json');
const resolvePlugin = require('rollup-plugin-node-resolve');
const cjsPlugin = require('rollup-plugin-commonjs');
const babelPlugin = require('rollup-plugin-babel');
const {uglify: uglifyEs5Plugin} = require('rollup-plugin-uglify');
const replacePlugin = require('rollup-plugin-replace');

const {
  RU_FORMAT_CJS,
  RU_FORMAT_UMD,
  OUTPUT_DEV,
  DIR_SRC,
  DIR_DIST,
  DIR_DIST_CJS,
  DIR_DIST_UMD
} = require('./rollup-utils');

const pkg = require('../../package.json');

const LIB_NAME = 'rtv';

const banner = `/*!
* ${pkg.name} ${pkg.version}
* @license MIT, https://gitlab.com/stefcameron/rtvjs/blob/master/LICENSE.md
* Parts of Lodash used internally: https://github.com/lodash/lodash/
*/`;

// base config with NO outputs, relative to the repo root
// - isDev: set to true for a development (i.e. non-minified) build
const getBaseConfig = function(options = {
  isDev: false
}) {
  const {isDev} = options;
  const peerDeps = Object.keys(pkg.peerDependencies || {});

  return {
    input: `${DIR_SRC}/rtv.js`,
    output: [],
    preserveModules: false, // NOTE: must be false to 'roll-up' all code into one file
    external: [...peerDeps],
    plugins: [
      jsonPlugin(),
      resolvePlugin(),
      cjsPlugin({
        include: 'node_modules/**'
      }),

      // NOTE: As of Babel 7, this plugin now ensures that Babel helpers are not
      //  repeated, and are inserted at the top of the generated bundle:
      //  "This rollup plugin automatically de-duplicates those helpers, keeping
      //  only one copy of each one used in the output bundle. Rollup will combine
      //  the helpers in a single block at the top of your bundle."
      //  @see https://github.com/rollup/rollup-plugin-babel#helpers
      babelPlugin({
        exclude: 'node_modules/**'
      }),

      replacePlugin({
        DEV_ENV: JSON.stringify(isDev)
      })
    ],
    watch: {
      include: `${DIR_SRC}/**`,
      exclude: ['node_modules/**', `${DIR_DIST}/**`, 'dist_tools/**']
    }
  };
};

// uglify plugin (ES5 and ES6) configuration
const getUglifyPluginConfig = function() {
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
const getUmdConfig = function(minified = false) {
  const config = getBaseConfig({isDev: !minified});

  config.output.push({
    file: `${DIR_DIST_UMD}/${LIB_NAME}${minified ? '.js' : `${OUTPUT_DEV}.js`}`,
    format: RU_FORMAT_UMD,
    name: LIB_NAME,
    noConflict: true,
    sourcemap: true,
    banner
  });

  if (minified) {
    const uglifyConfig = getUglifyPluginConfig();
    config.plugins.push(uglifyEs5Plugin(uglifyConfig));
  }

  return config;
};

// CJS (ES5) build config
const getCjsConfig = function(minified = false) {
  const config = getBaseConfig({isDev: !minified});

  config.output.push({
    file: `${DIR_DIST_CJS}/${LIB_NAME}${minified ? '.js' : `${OUTPUT_DEV}.js`}`,
    format: RU_FORMAT_CJS,
    sourcemap: true,
    banner
  });

  if (minified) {
    const uglifyConfig = getUglifyPluginConfig();
    config.plugins.push(uglifyEs5Plugin(uglifyConfig));
  }

  return config;
};

module.exports = {
  getCjsConfig,
  getUmdConfig
};
