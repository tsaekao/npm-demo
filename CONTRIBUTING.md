# RTV.js Contributions

Thank you for considering a contribution to RTV.js!

## Development

Local development is straightforward. Use the following versions of Node.js and npm:

*   Node.js: `>=10.11.0`
*   npm: `>=6.4.1`

Install all project dependencies:

```bash
$ npm install
```

The following npm commands will get you started:

*   `build`: Builds the library, outputs to `/dist`
*   `docs`: Builds the API documentation, _overwritting_ `/API.md`
*   `test`: Runs all unit tests and linting.
*   `test:unit`: Runs unit tests only.
*   `test:unit:watch`: Runs unit tests in watch mode, re-running tests as you make changes to code.
*   `test:unit:debug`: Runs unit tests in debug mode so you can step through code.
    *   Use Mocha's `describe.only()` and `it.only()` helpers to isolate the test you want to debug, but be sure to remove them when you're done, otherwise coverage will fail.
*   `test:coverage`: Checks for code coverage after running unit tests, outputs to `/coverage`
*   `lint`: Checks the code for lint.
*   `start`: Builds the library, starts Node.js in debug mode (with `--inspect`) and automatically loads the library into the global environment as `rtv` (along with `lodash` as `ld`) by running the following script: `/tolls/node.js`

See `/package.json` scripts for other commands.

## Pre-commit Scripts

`npm install` will configure a pre-commit hook, for this repository, that will perform these steps when you attempt to commit to your local repository:

*   Check the code for lint.
*   Build the API documentation and add `/API.md` to your commit if there were any changes.

## Best Practices

*   Use [JSDoc](http://usejsdoc.org/) syntax for __ALL__ function and class comments.
    *   Name internal functions with an underscore prefix (e.g. `_foo()`).
    *   Add a leading `[Internal]` prefix in the comment's description block.
    *   Include the JSDoc `@private` directive.
*   Favor `function() {}` over arrow functions unless contextual binding is required.
*   Use the latest standardized ES syntax.
*   Avoid using syntax that is still under active proposal.

## Merge Requests

In general, once your merge request is posted, you can expect one of the maintainers to respond to it within a few business days.
