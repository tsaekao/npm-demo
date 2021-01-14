# RTV.js Changelog

All notable changes to this project will be documented in this file.

The format is based on [Keep a Changelog](https://keepachangelog.com/en/1.0.0/),
and this project adheres to [Semantic Versioning](https://semver.org/spec/v2.0.0.html).

Date format is YYYY-MM-DD.

## 3.1.2

Release date: 2021-01-14

### Changed

-   Fixed: Setting the new `exactShapes` option in `rtv.check()` and `rtv.verify()` now properly fails the validation if any extra properties are found on the object being validated.
-   The `rootCause` of the resulting `RtvError`, when `exactShapes=true` (Type Validator Context Options) or `exact=true` (Shape Object Arguments) is the direct cause, is now an `Error` object which indicates the extra properties that were found on the value.

## 3.1.1

Release date: 2021-01-09

### Changed

-   The following peer dependencies have been removed from the package to avoid unnecessary "missing peer dependency" warnings when installing the package, since the default CJS and ESM builds are fully bundled and don't require them:
    -   `@babel/runtime: ^7.0.0`
    -   `lodash: ^4.0.0`

## 3.1.0

Release date: 2021-01-07

### Changed

-   Additional builds, and non-breaking changes to existing builds:
    -   The default CJS build (`main` field in `package.json`, unchanged, referencing `./dist/rtv.js`) is now __fully bundled__ again, like it was before.
    -   The default ESM build (`module` field in `package.json`, unchanged, referencing `./dist/rtv.esm.js`) is now __fully bundled__.
    -   The UMD builds (`./dist/rtv.umd.dev.js` and `./dist/rtv.umd.js`) are now __fully bundled__.
    -   For each build type (CJS, ESM, UMD), there is now a `.slim` alternative which is __non-bundled__ and relies on the following external dependencies:
        -   `lodash`
        -   `@babel/runtime` (CJS and ESM __only__)

## 3.0.0

Release date: 2020-12-26

### 🚨 BREAKING

-   New package builds:
    -   All builds (CJS, ESM, UMD) depend on new peer dependencies: `@babel/runtime` and `lodash`: These are no longer bundled, in order to reduce duplication when bundling RTV.js into an app, since they are very common dependencies.
    -   The CJS (as before) and ESM (new) builds depend on `process.env.NODE_ENV` being defined during bundling as either `"development"` or `"production"`. This is a fairly standard global definition, so it shouldn't really cause any trouble, and had previously been required for the CJS build anyway.
    -   The CJS builds are now combined into a single file (`./dist/rtv.js`) with `process.env.NODE_ENV === "development"` checks where appropriate for dev-only behavior (e.g. deprecation warnings). It is targeted for consumption by app bundlers such as Webpack or Rollup.
    -   The CJS build is no longer minified. Again, the app bundler should take care of this.
    -   The CJS build depends on `@babel/runtime` and `lodash`, which are now declared as peer dependencies of this package, rather than pre-bundling them and adding unnecessary bloat when the consuming project is already using Babel and/or Lodash.
    -   The new ESM build is available in `./dist/rtv.esm.js` and also requires defining the `process.env.NODE_ENV` global.
    -   NOTE: The UMD builds are still two files, Dev and Prod versions, and bundle _everything_. They are meant for self-contained, direct use in a browser. The package purposely does not reference the UMD build via the `browser` property because Webpack will prioritize that type of bundle by default, and this is not how this package should be consumed by another bundler who is also preparing a package to run in the browser. Doing so would lead to unnecessary duplication of code between Babel Runtime Helpers and Lodash functions, as well as prevent any level of tree shaking.
-   __REMOVED__ the following 🚫 deprecations:
    -   `RtvError.cause`, replaced with `RtvError.mismatch`.
    -   `RtvError.failure`, replaced with `RtvError.rootCause`.
    -   `rtv.t`, being replaced by `rtv.types`.
    -   `rtv.q`, being replaced by `rtv.qualifiers`.
    -   `rtv.e`, being replaced by `rtv.enabled` (and then also removed; see below).
-   __REMOVED__ the `rtv.enabled` convenience accessor. Use `rtv.config.enabled` instead, or define your own environment variable, e.g. `DEV_ENV && rtv.verify(...)`
-   __REMOVED__ the default export. All exports are now named. To get the same behavior as before, change `import rtv from 'rtvjs'; -> import * as rtv from 'rtvjs';`. Default exports are generally a bad idea, especially when converting from ESM to CJS. The elimination of the default export should make bundling RTV.js much easier, regardless of your target format (CJS, ESM, UMD, ...).
-   The fully-qualified `ARRAY` form's `ts` argument (which provides the typeset to use when verifying an array's elements) has been renamed to `$` to be consistent with the `$` property used in the fully-qualified form of the `OBJECT`, `ANY_OBJECT`, `PLAIN_OBJECT`, and `CLASS_OBJECt` types. In the end, whether with an `ARRAY` or one of the 4 object types, it's still a typeset, so there was no reason to confuse things by using different property names. `$` is unique and will be used for the same purpose should new features require nested typesets on other types.
-   The _Collection Arguments_ `keys` and `values` properties have been renamed to `$keys` and `$values`, respectively, because they represent typesets, and this brings the property names inline with the distinctive `$` used for typeset arguments on `ARRAY` and object types.

### Added

-   New `rtv.check() / rtv.verify()` option, `exactShapes: boolean` (default: `false`), and new _Shape Object Argument_, `exact: boolean` (default: `false`):
    -   With `exactShapes: true`, any shape encountered will require its related object value to have exactly the same own-properties that it has.
    -   This can be overridden on an individual shape basis by using the new `exact: boolean` flag in the _Shape Object Arguments_.
    -   The default behavior remains unchanged: Shape validation only concerns itself with own-properties on the shape and ignores any additional own-properties the object being verified may have.
    -   This applies to the following types: `OBJECT`, `ANY_OBJECT`, `PLAIN_OBJECT`, `CLASS_OBJECT`.
-   New _Collection Argument_ `deep`, which applies to `HASH_MAP` only: When `true`, if a value in the map does not match the `$values` typeset, it's expected to be a nested `HASH_MAP` whose keys and values match the parent map's structure (i.e. the same arguments used on the parent map are used to verify the value of its key).

### Changed

-   Setting `rtv.config.enabled` to a value that is not strictly a `boolean` will no longer cause an `RtvError` exception; instead, the value will simply be _cast_ as a `boolean`.
-   Fixed a bug where the `RtvError.typeset` and `RtvError.mismatch` typesets, resulting from a failed type validation with the `OBJECT`, `ANY_OBJECT`, or `PLAIN_OBJECT` types, would not contain type arguments when they were specified as part of the original typeset. Difficult to explain, but just know that things are working better, even in obscure cases.

## 2.4.0

Release date: 2020-07-09

-   Prevent some potential denial-of-service security vulnerabilities by ensuring that active code doesn't call `.hasOwnProperty()` directly on objects. Instead, uses `Object.prototype.hasOwnProperty.call(obj, 'property')`.
-   Add `parent` and `parentKey` properties to Type Validator Context to provide more flexibility to _reactive validations_ (see example in [README](./README.md#parent-and-parentkey)).

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
-   🚫 __DEPRECATED__ `RtvError.cause`, replaced with `RtvError.mismatch`.
-   🚫 __DEPRECATED__ `RtvError.failure`, replaced with `RtvError.rootCause`.

### Fixed
-   API documentation for the `rtv.t`, `rtv.q`, and `rtv.e` deprecated properties. `rtv.enabled` (the newer one) no longer appears twice, once deprecated, once not.
-   An error thrown by a nested custom validator was not being reported in the `RtvError#failure` property (the property was `undefined` in most cases, even if the validator threw an error).

## 2.1.0

Release date: 2019-10-05

### Changed
-   All types and qualifiers are now directly accessible on the `rtv` object (e.g. `rtv.STRING`).
-   It's now possible to have the same type appear multiple times in the same typeset (this makes typeset _composition_ much easier, avoiding the need for custom validators in lots of cases).
-   `RtvError`'s message and string serialization no longer includes the `typeset` to reduce log bloat/noise (they could be _very_ long), but the `typeset` is still available as a property of the object.
-   🚫 __DEPRECATED__ `rtv.t`, being replaced by `rtv.types`.
-   🚫 __DEPRECATED__ `rtv.q`, being replaced by `rtv.qualifiers`.
-   🚫 __DEPRECATED__ `rtv.e`, being replaced by `rtv.enabled`.

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
