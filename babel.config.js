module.exports = {
  // Options: https://babeljs.io/docs/en/babel-preset-env#options

  // environment specified via BABEL_ENV env var
  env: {
    build: {
      // @see tools/build/rollup-builds.js#getBabelConfig()
    },

    test: {
      presets: [
        ['@babel/preset-env', {
          modules: 'commonjs'
        }]
      ],
      plugins: [
        'istanbul'
      ]
    }
  }
};
