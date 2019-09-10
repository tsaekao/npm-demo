//
// NODE SCRIPT: Builds the library.
//

const fs = require('fs');
const path = require('path');
const {spawn} = require('child_process');
const {
  RU_FORMAT_CJS,
  OUTPUT_DEV,
  DIR_DIST_CJS
} = require('../build/rollup-utils');

// get the build configurations used for this component/package
const configFilePath = path.resolve('./rollup.config.js');
const builds = require(configFilePath);

// load the package.json (use path relative to location from which this script
//  will be run, which is the repo root)
const pkgFilePath = path.resolve('./package.json');
const pkg = require(pkgFilePath);

// default process close handler
const closeHandler = function(code) {
  process.exit(code);
};

// add 'data' and 'close' handlers to a given process
const addProcessHandlers = function(cmd, onClose = closeHandler) {
  cmd.stdout.on('data', function(data) {
    console.log(data.toString());
  });

  cmd.stderr.on('data', function(data) {
    console.error(data.toString());
  });

  cmd.on('close', onClose);
};

/**
 * Generates the index.js file the package.json points to for CJS builds.
 *
 * While both paths are optional, at least one must be specified.
 *
 * @param {string} [devPath] Relative path, from package.json, to the dev build.
 * @param {string} [prodPath} Relative path, from package.json, to the prod build.
 * @returns {string} Contents to write to the index.js file.
 * @throws {Error} If neither path is given.
 */
const generateIndex = function(devPath, prodPath) {
  const makeLocal = function(filePath) {
    return filePath.replace(DIR_DIST_CJS, '.');
  };

  if ((devPath && !prodPath) || (!devPath && prodPath)) {
    // only one path specified
    return `'use strict';

module.exports = require('${makeLocal(devPath || prodPath)}');
`;
  } else if (devPath && prodPath) {
    return `'use strict';

if (process.env.NODE_ENV === 'production') {
  module.exports = require('${makeLocal(prodPath)}');
} else {
  module.exports = require('${makeLocal(devPath)}');
}
`;
  }

  throw new Error(`At least one path must be specified (error from ${configFilePath})!`);
};

if (pkg.main !== `${DIR_DIST_CJS}/index.js`) {
  throw new Error(`Main property in ${pkgFilePath} must be set to ${DIR_DIST_CJS}/index.js`);
}

// map of output format -> {dev: string, prod: string} (object with paths
//  to dev and prod build output files)
const outputs = {};

// look at all build configurations and find the ones that are CJS, making sure
//  they're properly configured to work with the index.js file we're going to
//  generate after the build is done
builds.forEach(function(build) {
  build.output.forEach(function(out) {
    outputs[out.format] = outputs[out.format] || {};
    const type = (new RegExp(`\\${OUTPUT_DEV}\\.js$`)).test(out.file) ? 'dev' : 'prod';

    if (outputs[out.format][type]) {
      throw new Error(`Found more than one ${out.format}/${type} build outputs in ${configFilePath}`);
    }

    if (out.format === RU_FORMAT_CJS && out.file.indexOf(DIR_DIST_CJS) !== 0) {
      throw new Error(
          `File output path for ${out.format}/${type} build is not from ${DIR_DIST_CJS} in ${configFilePath}: "${out.file}"`);
    }

    outputs[out.format][type] = out.file;
  });
});

if (!outputs.cjs) {
  throw new Error(`Missing ${RU_FORMAT_CJS.toUpperCase()} build output(s) in ${configFilePath}`);
}

// run rollup with the rollup.config.js file in the repo root
const cmd = spawn('rollup', ['-c'], {
  env: {
    BABEL_ENV: 'build',
    ...process.env // let item's script override the above default if it wants to
  }
});

addProcessHandlers(cmd, function(code) {
  if (code !== 0) {
    process.exit(code);
  }

  // generate the index.js file for the CJS build(s)
  const indexJs = generateIndex(outputs.cjs.dev, outputs.cjs.prod);
  const indexPath = `./${DIR_DIST_CJS}/index.js`;
  fs.writeFileSync(indexPath, indexJs); // overwrite if exists
  console.log(`Generated ${path.resolve(indexPath)}`);

  process.exit(0);
});
