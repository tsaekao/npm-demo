module.exports = {
  // Options: https://babeljs.io/docs/en/babel-preset-env#options

  // NOTE: VSCode and other IDEs will use whatever is in the root/base configuration
  //  since they don't know (at least not by default) about any specific env to use

  // when BABEL_ENV='<name>', that environment is merge on top of the root/base config
  // @see https://babeljs.io/docs/en/options#env
  // @see https://babeljs.io/docs/en/options#merging
  env: {
    build: {
      // @see tools/build/rollup-builds.js#getBabelConfig()
    },

    test: {
      presets: [
        [
          '@babel/preset-env',
          {
            modules: 'commonjs',
          },
        ],
      ],
      plugins: ['istanbul'],
    },
  },
};
