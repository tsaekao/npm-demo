//
// NODE SCRIPT: Builds the library.
//

const path = require('path');
const { spawn } = require('child_process');

// load the package.json (use path relative to location from which this script
//  will be run, which is the repo root)
const pkgFilePath = path.resolve('./package.json');
const pkg = require(pkgFilePath);

// default process close handler
const closeHandler = function (code) {
  process.exit(code);
};

// add 'data' and 'close' handlers to a given process
const addProcessHandlers = function (cmd, onClose = closeHandler) {
  cmd.stdout.on('data', function (data) {
    console.log(data.toString());
  });

  cmd.stderr.on('data', function (data) {
    console.error(data.toString());
  });

  cmd.on('close', onClose);
};

if (!pkg.main) {
  throw new Error(
    `'main' property in ${pkgFilePath} must be set to CJS bundle`
  );
}

if (!pkg.module) {
  throw new Error(
    `'module' property in ${pkgFilePath} must be set to ESM bundle`
  );
}

// run rollup with the rollup.config.js file in the repo root
const cmd = spawn('rollup', ['-c'], {
  env: {
    BABEL_ENV: 'build',
    ...process.env, // let item's script override the above default if it wants to
  },
});

addProcessHandlers(cmd, function (code) {
  if (code !== 0) {
    process.exit(code);
  }

  process.exit(0);
});
