//// Utilities for Rollup Builds

// {string} Rollup CJS output format
const RU_FORMAT_CJS = 'cjs';

// {string} Rollup ESM output format
const RU_FORMAT_ESM = 'es';

// {string} Rollup UMD output format
const RU_FORMAT_UMD = 'umd';

// {string} Sub-extension used in development (i.e. non-minified) builds
const OUTPUT_DEV = 'dev';

// {string} input directory relative path, no trailing slash
const DIR_SRC = 'src';

// {string} output directory relative path, no trailing slash
const DIR_DIST = 'dist';

module.exports = {
  RU_FORMAT_CJS,
  RU_FORMAT_ESM,
  RU_FORMAT_UMD,
  OUTPUT_DEV,
  DIR_SRC,
  DIR_DIST,
};
