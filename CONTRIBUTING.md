# RTV.js Contributions

Thank you for considering a contribution to RTV.js!

## Development

Local development is straightforward. Use the following versions of Node.js and npm:

*   Node: Latest __Active__ LTS (CI will test with latest __Maintenance__ LTS, however)
*   npm: 7.x

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
*   `start`: Builds the library, starts Node.js in debug mode (with `--inspect`), and automatically loads the library into the global environment as `rtv` (along with `lodash` as `ld`, and `Object.prototype.toString` as `ostr`) by running the following script: `/tools/node.js`. Use DevTools or your favorite IDE to attach to the Node process to debug!
*   `html`: Builds the library and starts `live-server` at http://localhost:8080 with a root of `/tools` where you can load any of the HTML files in that directory to manually test the build in a browser: [UMD](http://localhost:8080/rtvjs-umd.html) or [ESM](http://localhost:8080/rtvjs-esm.html).

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

### Template

Please use this template when filing merge requests:

```markdown
### Description

Include a summary of the change and which issue is fixed.

If a feature is being implemented, explain your motivation for it. If a bug is being fixed, explain steps to reproduce it.

List any new dependencies that are required for this change and why they are needed (if it isn't obvious).

### Type of change

Place an X in all relevant options and delete those that aren't, along with this note.

- [] Bug fix (non-breaking change which fixes an issue)
- [] New feature (non-breaking change which adds functionality)
- [] Breaking change (fix or feature that would cause existing functionality to no longer work as expected)

### Checklist

Place an X in all relevant checks and delete those that aren't, along with this note.

- [] I have added this change under an appropriate heading in the `[Unreleased]` section of the `/CHANGELOG.md`
- [] My code builds (verified with `npm run build`)
- [] My code follows the style guidelines of this project (verified with `npm run lint`)
- [] I have performed a self-review of my own code
- [] I have commented my code, particularly in hard-to-understand areas
- [] I have made corresponding changes to the documentation, including the `/README.md`
- [] I have verified my changes to the API documentation in `/API.md` (cross-reference links in particular, verified _in part_ with `npm run docs`)
- [] My changes generate no new warnings or errors (verified with `npm test`)
- [] I have added tests that prove my fix is effective or that my feature works
- [] New and existing unit tests pass locally with my changes
- [] Test coverage has not decreased in my branch as a result of my additions
- [] Any prerequisite changes have already been merged and published in upstream modules
```
