////// Rollup Build Configurations

const jsonPlugin = require('@rollup/plugin-json');
const { nodeResolve: resolvePlugin } = require('@rollup/plugin-node-resolve');
const cjsPlugin = require('@rollup/plugin-commonjs');
const {
  default: babelPlugin,
  getBabelOutputPlugin,
} = require('@rollup/plugin-babel');
const replacePlugin = require('@rollup/plugin-replace');
const { uglify: uglifyEs5Plugin } = require('rollup-plugin-uglify');

const {
  RU_FORMAT_CJS,
  RU_FORMAT_ESM,
  RU_FORMAT_UMD,
  OUTPUT_DEV,
  DIR_SRC,
  DIR_DIST,
} = require('./rollup-utils');

const pkg = require('../../package.json');

const FILE_NAME = 'rtv'; // skip the 'js' since that's in the extension, e.g. 'rtv.js'

const banner = `/*!
 * ${pkg.name} ${pkg.version}
 * @license MIT, https://gitlab.com/stefcameron/rtvjs/blob/master/LICENSE.md
 * Parts of Lodash used internally: https://github.com/lodash/lodash/
 */`;

// base Babel configuration
const getBabelConfig = function ({ format }) {
  if (
    !format ||
    ![RU_FORMAT_CJS, RU_FORMAT_ESM, RU_FORMAT_UMD].includes(format)
  ) {
    throw new Error(`A valid output format is required, format=${format}`);
  }

  // NOTE: we don't define anything in /babel.config.js for the build env so
  //  that we can manipulate everything here, and ensure that every build uses
  //  a distinct Babel config object (if we `require('../../babel.config')`
  //  here, that's not what happens...
  const config = {
    presets: [
      [
        '@babel/preset-env',
        {
          modules: format === RU_FORMAT_UMD ? 'umd' : false,
          // @see https://github.com/browserslist/browserslist#full-list
          targets: 'defaults',
        },
      ],
    ],
    plugins: [],
  };

  // CJS and ESM rely on external Babel helpers
  if (format !== RU_FORMAT_UMD) {
    // NOTE: because of this, rtvjs declares a peer of @babel/runtime and we
    //  build it with 'runtime' Babel helpers using `@rollup/plugin-babel`
    //  when targetting CJS and ESM
    config.plugins.push('@babel/plugin-transform-runtime');
  }
  // else, in UMD, we bundle all the necessary helpers

  return config;
};

// base config with NO outputs, relative to the repo root
// - format {string}: (REQUIRED) set to Rollup build format
// - isDev: set to true for a development (i.e. non-minified) build
const getBaseConfig = function (
  options = {
    isDev: false,
  }
) {
  const { isDev, format } = options;

  if (
    !format ||
    ![RU_FORMAT_CJS, RU_FORMAT_ESM, RU_FORMAT_UMD].includes(format)
  ) {
    throw new Error(`A valid output format is required, format=${format}`);
  }

  // UMD builds bundle everything
  const externals =
    format === RU_FORMAT_UMD ? [] : Object.keys(pkg.peerDependencies || {}); // {Array<string>}

  const replaceTokens = {};
  const babelConfig = getBabelConfig({ format });

  if (format === RU_FORMAT_UMD) {
    replaceTokens['process.env.NODE_ENV'] = JSON.stringify(
      isDev ? 'development' : 'production'
    );
  }
  // else, for CJS and ESM, `process.env.NODE_ENV` stays in the code for a combined
  //  Dev/Prod build that expects the consumer to define the global

  const config = {
    input: `${DIR_SRC}/rtv.js`,
    output: null,
    external(moduleName) {
      // NOTE: if we just provided an array of module names, Rollup would do
      //  an exact match, but would then miss treating as external any imports
      //  that are deeper into the package, like 'lodash/merge', for example,
      //  if we just stated that 'lodash' should be an external package, so we
      //  have to treat the list of externals as substrings of the module name
      // @see https://rollupjs.org/guide/en/#peer-dependencies
      const result = !!externals.find((ex) => moduleName.includes(ex));
      return result;
    },
    plugins: [
      // ALWAYS FIRST: string token replacement
      replacePlugin(replaceTokens),

      jsonPlugin(),
      resolvePlugin(),
      cjsPlugin({
        include: 'node_modules/**',
      }),
    ],
    watch: {
      include: `${DIR_SRC}/**`,
      exclude: ['node_modules/**', `${DIR_DIST}/**`, 'dist_tools/**'],
    },
  };

  // for CJS and ESM, we transpile during the bundling process
  if (format !== RU_FORMAT_UMD) {
    config.plugins.push(
      // NOTE: As of Babel 7, this plugin now ensures that Babel helpers are not
      //  repeated, and are inserted at the top of the generated bundle:
      //  "This rollup plugin automatically de-duplicates those helpers, keeping
      //  only one copy of each one used in the output bundle. Rollup will combine
      //  the helpers in a single block at the top of your bundle."
      //  @see https://github.com/rollup/rollup-plugin-babel#helpers
      babelPlugin({
        ...babelConfig,
        exclude: 'node_modules/**',

        // for UMD builds, bundle all the helpers;
        // for CJS and ESM builds, have all Babel helpers reference an external
        //  @babel/runtime dependency that consumers can provide and bundle into their
        //  app code; this is the recommendation for library modules, which is what
        //  this package is, and we use this in conjunction with `@babel/plugin-transform-runtime`
        // @see https://github.com/rollup/plugins/tree/master/packages/babel#babelhelpers
        babelHelpers: 'runtime',
      })
    );
  }
  // else, for UMD, we transpile the bundle as a whole (i.e. post-bundling)

  return config;
};

// uglify plugin (ES5 and ES6) configuration
const getUglifyPluginConfig = function () {
  return {
    output: {
      // comments: /^\/\*!/
      comments(node, comment) {
        const text = comment.value;
        const type = comment.type;
        if (type === 'comment2') {
          // multiline comment: keep if it starts with a bang or contains
          //  some common preservation keywords
          return (
            text.indexOf('!') === 0 || /@preserve|@license|@cc_on/i.test(text)
          );
        }
      },
    },
  };
};

// default/common options for all build outputs.
const baseOutput = function () {
  return {
    banner,
    sourcemap: true,
    preserveModules: false, // roll everything up into one file
  };
};

// UMD (ES5) build config
const getUmdConfig = function (isDev = false) {
  const format = RU_FORMAT_UMD;
  const config = getBaseConfig({ isDev, format });
  const babelConfig = getBabelConfig({ format });

  config.output = {
    ...baseOutput(),
    file: `${DIR_DIST}/${FILE_NAME}.umd${isDev ? `.${OUTPUT_DEV}` : ''}.js`,
    format,
    name: pkg.name,
    noConflict: true,
    plugins: [
      getBabelOutputPlugin({
        ...babelConfig,

        // this is required in order to let Rollup do the UMD wrapper, and Babel
        //  do the transpiling, which will result in a single instance of all the
        //  necessary Babel Helpers defined as inner-module globals in the UMD
        //  bundle (meaning the browser will load them, but not on `window`, just
        //  for use in the closure that the UMD creates)
        allowAllFormats: true,
      }),
    ],
  };

  if (!isDev) {
    const uglifyConfig = getUglifyPluginConfig();
    config.plugins.push(uglifyEs5Plugin(uglifyConfig));
  }

  return config;
};

// CJS (ES5) build config
const getCjsConfig = function () {
  const format = RU_FORMAT_CJS;
  const config = getBaseConfig({ format });

  config.output = {
    ...baseOutput(),
    file: `${DIR_DIST}/${FILE_NAME}.js`,
    format,
    exports: 'default',
  };

  return config;
};

// ESM (ES6+) build config
const getEsmConfig = function () {
  const format = RU_FORMAT_ESM;
  const config = getBaseConfig({ format });

  config.output = {
    ...baseOutput(),
    file: `${DIR_DIST}/${FILE_NAME}.esm.js`,
    format,
  };

  return config;
};

module.exports = {
  getCjsConfig,
  getEsmConfig,
  getUmdConfig,
};
