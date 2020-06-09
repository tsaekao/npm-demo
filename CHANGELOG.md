# RTV.js Changelog

All notable changes to this project will be documented in this file.

The format is based on [Keep a Changelog](https://keepachangelog.com/en/1.0.0/),
and this project adheres to [Semantic Versioning](https://semver.org/spec/v2.0.0.html).

Date format is YYYY-MM-DD.

## 2.3.1

Release date: 2020-06-09

### Changed
-   Reverted package.json `engines` back to oldest supported Node LTS (`>=10.21.0`) and the version of NPM it ships with (`>=6.14.4`).

## 2.3.0

Release date: 2020-05-25

### Changed
-   Dependency updates: All to latest.

## 2.2.0

Release date: 2020-02-17

### Added
-   Added `sideEffects:false` bundler hint/flag to `package.json`: This will help bundlers like Webpack, which support the hint/flag, to know that this package does not have any side effects, and can confidently be removed during tree shaking if there are no code paths that refer to the library (e.g. if you only use RTV in your development build). See [Webpack docs](https://webpack.js.org/configuration/optimization/#optimizationsideeffects) for more information.
-   When a custom validator function is called, it now receives a fourth parameter, `context`, which is a _type validator context_. This context provides additional information about the verification, such as the __original value__ being verified (which differs from the first parameter, `value`, as that is the value currently being verified, closest to the custom validator itself, e.g. the value of element in an array, as opposed to the array itself).
-   A reference to the `RtvError` constructor function (and `RtvSuccess` also, to balance things out) is now provided as `rtv.RtvError` so that an `Error` object can be tested using the `instanceof` operator.
-   Added a __new qualifier__: `TRUTHY`. Think of this qualifier as, "if _truthy_, the value is __required__ to be of the specified type." Therefore, _falsy_ values like `null`, `NaN`, or `false` are permitted even if they aren't of the expected type(s), which makes it possible to verify only when a value is truthy, something that was not previously possible even with the `OPTIONAL` qualifier.

### Changed
-   When printing a typeset that contains a custom validator function, the validator is printed as `"<validator>"` instead of `"<function>"` (hopefully that's more helpful when reading the typeset, typically in an `RtvError`'s string representation).
-   When a verification is failed by a custom validator that does not throw an error (instead, it just returns a _falsy_ value), the generated error has been changed from `"Verification failed due to custom validator"` to `"Verification failed by the custom validator"`, which hopefully better indicates that the verification failed because the custom validator chose to fail it, not because of the _presence_ of a custom validator (as if it shouldn't have been there).
-   __DEPRECATED__ `RtvError.cause`, replaced with `RtvError.mismatch`.
-   __DEPRECATED__ `RtvError.failure`, replaced with `RtvError.rootCause`.

### Fixed
-   API documentation for the `rtv.t`, `rtv.q`, and `rtv.e` deprecated properties. `rtv.enabled` (the newer one) no longer appears twice, once deprecated, once not.
-   An error thrown by a nested custom validator was not being reported in the `RtvError#failure` property (the property was `undefined` in most cases, even if the validator threw an error).

## 2.1.0

Release date: 2019-10-05

### Changed
-   All types and qualifiers are now directly accessible on the `rtv` object (e.g. `rtv.STRING`).
-   It's now possible to have the same type appear multiple times in the same typeset (this makes typeset _composition_ much easier, avoiding the need for custom validators in lots of cases).
-   `RtvError`'s message and string serialization no longer includes the `typeset` to reduce log bloat/noise (they could be _very_ long), but the `typeset` is still available as a property of the object.
-   __DEPRECATED__ `rtv.t`, being replaced by `rtv.types`.
-   __DEPRECATED__ `rtv.q`, being replaced by `rtv.qualifiers`.
-   __DEPRECATED__ `rtv.e`, being replaced by `rtv.enabled`.

### Fixed
-   If an exception is thrown in `impl`, it's no longer wrapped in an "outer" exception, resulting in a cleaner error message (e.g. what was once, "Cannot check value: Cannot check value: Invalid typeset..." for an invalid typeset nested 2 levels deep is now just, "Invalid typeset...").

## 2.0.0

Release date: 2019-09-10

### Breaking
-   The ESM build output is replaced with a CJS build output as this is the most compatible with popular Webpack and Rollup build systems.
-   The main package export is now the CJS build output.
-   The CJS build output is found in `./dist/cjs/...`
-   The UMD build output is now found in `./dist/umd/...`

### Changed
-   Dependency updates: All to latest.

## 1.2.0

Release date: 2019-05-19

### Changed
-   Dependency updates only, including an update to `jsdoc-to-markdown` which resulted in some minor formatting changes to [API.md](API.md).

## 1.1.0

Release date: 2019-02-02

### Changed
-   Dependency updates (minor and patch versions only)

## 1.0.0

Release date: 2018-10-11

__Initial release!__
