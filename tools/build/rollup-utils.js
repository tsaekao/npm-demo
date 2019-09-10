//// Utilities for Rollup Builds

// {string} Rollup CJS output format
const RU_FORMAT_CJS = 'cjs';

// {string} Rollup UMD output format
const RU_FORMAT_UMD = 'umd';

// {string} Sub-extension used in development (i.e. non-minified) builds
const OUTPUT_DEV = '.dev';

// {string} input directory relative path, no trailing slash
const DIR_SRC = 'src';

// {string} output directory relative path, no trailing slash
const DIR_DIST = 'dist';

// {string} CJS builds output directory relative path, no trailing slash
const DIR_DIST_CJS = `${DIR_DIST}/${RU_FORMAT_CJS}`;

// {string} UMD builds output directory relative path, no trailing slash
const DIR_DIST_UMD = `${DIR_DIST}/${RU_FORMAT_UMD}`;

module.exports = {
  RU_FORMAT_CJS,
  RU_FORMAT_UMD,
  OUTPUT_DEV,
  DIR_SRC,
  DIR_DIST,
  DIR_DIST_CJS,
  DIR_DIST_UMD
};
