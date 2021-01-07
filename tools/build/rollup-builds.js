////// Rollup Build Configurations

const jsonPlugin = require('@rollup/plugin-json');
const { nodeResolve: resolvePlugin } = require('@rollup/plugin-node-resolve');
const cjsPlugin = require('@rollup/plugin-commonjs');
const {
  default: babelPlugin,
  getBabelOutputPlugin,
} = require('@rollup/plugin-babel');
const replacePlugin = require('@rollup/plugin-replace');
const { terser: terserPlugin } = require('rollup-plugin-terser');

const {
  RU_FORMAT_CJS,
  RU_FORMAT_ESM,
  RU_FORMAT_UMD,
  OUTPUT_DEV,
  OUTPUT_SLIM,
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
// - format {string}: (REQUIRED) set to Rollup build format
// - isSlim: set to true for a slimmer non-bundled build
const getBabelConfig = function (
  options = {
    isSlim: false,
  }
) {
  const { isSlim, format } = options;

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

  // slim builds (except for UMD) rely on external Babel helpers
  if (isSlim && format !== RU_FORMAT_UMD) {
    // NOTE: because of this, @babel/runtime must also be installed to use a slim
    //  build, and we build it with 'runtime' Babel helpers using `@rollup/plugin-babel`
    //  when targetting slim
    config.plugins.push('@babel/plugin-transform-runtime');
  }

  return config;
};

// base config with NO outputs, relative to the repo root
// - format {string}: (REQUIRED) set to Rollup build format
// - isDev: set to true for a development (i.e. non-minified) build
// - isSlim: set to true for a slimmer non-bundled build
const getBaseConfig = function (
  options = {
    isDev: false,
    isSlim: false,
  }
) {
  const { isDev, isSlim, format } = options;

  if (
    !format ||
    ![RU_FORMAT_CJS, RU_FORMAT_ESM, RU_FORMAT_UMD].includes(format)
  ) {
    throw new Error(`A valid output format is required, format=${format}`);
  }

  // slim builds bundle noting; fat ones bundle everything
  const externals = isSlim ? Object.keys(pkg.peerDependencies || {}) : []; // {Array<string>}

  if (isSlim && format === RU_FORMAT_UMD) {
    // never mark @babel/runtime dependencies as external for UMD because
    //  that package isn't meant to be used directly in the browser (i.e. it's
    //  meant to be bundled, or referenced externally in a CJS/ESM scenario
    //  where some other build will bundle them)
    const idx = externals.indexOf('@babel/runtime');
    if (idx >= 0) {
      externals.splice(idx, 1);
    }
  }

  const replaceTokens = {};
  const babelConfig = getBabelConfig({ format, isSlim });

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
  // for UMD, we transpile AFTER bundling (see `output` config)
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

        // for CJS and ESM builds, IIF SLIM, have all Babel helpers reference an external
        //  @babel/runtime dependency that consumers can provide and bundle into their
        //  app code; this is the recommendation for library modules, which is what
        //  this package is, and we use this in conjunction with `@babel/plugin-transform-runtime`
        // @see https://github.com/rollup/plugins/tree/master/packages/babel#babelhelpers
        babelHelpers: isSlim ? 'runtime' : 'bundled',
      })
    );
  }
  // else, for UMD, we transpile the bundle as a whole (i.e. post-bundling)

  return config;
};

// terser plugin configuration
const getTerserConfig = function () {
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
// - isDev: set to true for a development (i.e. non-minified) build
// - isSlim: set to true for a slimmer non-bundled build
const getUmdConfig = function (
  options = {
    isDev: false,
    isSlim: false,
  }
) {
  const { isDev, isSlim } = options;
  const format = RU_FORMAT_UMD;
  const config = getBaseConfig({ isDev, isSlim, format });
  const babelConfig = getBabelConfig({ format, isSlim });

  config.output = {
    ...baseOutput(),
    file: `${DIR_DIST}/${FILE_NAME}.umd${isSlim ? `.${OUTPUT_SLIM}` : ''}${
      isDev ? `.${OUTPUT_DEV}` : ''
    }.js`,
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

  if (isSlim) {
    // provide Lodash-related globals for external references
    // NOTE: per https://unpkg.com/lodash, Lodash registers the `_` global
    config.output.globals = (id) => {
      // `id` is module name like 'lodash'
      if (id === 'lodash') {
        return '_';
      } else if (id.startsWith('lodash/')) {
        // a deep reference like `import isObjectLike from 'lodash/isObjectLike'`
        //  becomes `_.isObjectLike`
        return `_.${id.substr('lodash/'.length)}`;
      } else if (id === pkg.name) {
        return pkg.name;
      }

      throw new Error(`Unexpected external package reference, id="${id}"`);
    };
  }

  if (!isDev) {
    const terserConfig = getTerserConfig();
    config.plugins.push(terserPlugin(terserConfig));
  }

  return config;
};

// CJS (ES5) build config
// - isSlim: set to true for a slimmer non-bundled build
const getCjsConfig = function (
  options = {
    isSlim: false,
  }
) {
  const { isSlim } = options;
  const format = RU_FORMAT_CJS;
  const config = getBaseConfig({ format, isSlim });

  config.output = {
    ...baseOutput(),
    file: `${DIR_DIST}/${FILE_NAME}${isSlim ? `.${OUTPUT_SLIM}` : ''}.js`,
    format,
    exports: 'named',
  };

  return config;
};

// ESM (ES6+) build config
// - isSlim: set to true for a slimmer non-bundled build
const getEsmConfig = function (
  options = {
    isSlim: false,
  }
) {
  const { isSlim } = options;
  const format = RU_FORMAT_ESM;
  const config = getBaseConfig({ format, isSlim });

  config.output = {
    ...baseOutput(),
    file: `${DIR_DIST}/${FILE_NAME}.esm${isSlim ? `.${OUTPUT_SLIM}` : ''}.js`,
    format,
  };

  return config;
};

module.exports = {
  getCjsConfig,
  getEsmConfig,
  getUmdConfig,
};
