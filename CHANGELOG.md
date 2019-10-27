# RTV.js Changelog

All notable changes to this project will be documented in this file.

The format is based on [Keep a Changelog](https://keepachangelog.com/en/1.0.0/),
and this project adheres to [Semantic Versioning](https://semver.org/spec/v2.0.0.html).

Date format is YYYY-MM-DD.

## Unreleased

### Changed
-   When printing a typeset that contains a validator function, the validator is printed as `"<validator>"` instead of `"<function>"` (hopefully that's more helpful when reading the typeset, typically in an `RtvError`'s string representation).

### Fixed
-   API documentation for the `rtv.t`, `rtv.q`, and `rtv.e` deprecated properties. `rtv.enabled` (the newer one) no longer appears twice, once deprecated, once not.

## 2.1.0 - 2019-10-05

### Changed
-   All types and qualifiers are now directly accessible on the `rtv` object (e.g. `rtv.STRING`).
-   It's now possible to have the same type appear multiple times in the same typeset (this makes typeset _composition_ much easier, avoiding the need for custom validators in lots of cases).
-   `RtvError`'s message and string serialization no longer includes the `typeset` to reduce log bloat/noise (they could be _very_ long), but the `typeset` is still available as a property of the object.
-   __DEPRECATED__ `rtv.t`, being replaced by `rtv.types`.
-   __DEPRECATED__ `rtv.q`, being replaced by `rtv.qualifiers`.
-   __DEPRECATED__ `rtv.e`, being replaced by `rtv.enabled`.

### Fixed
-   If an exception is thrown in `impl`, it's no longer wrapped in an "outer" exception, resulting in a cleaner error message (e.g. what was once, "Cannot check value: Cannot check value: Invalid typeset..." for an invalid typeset nested 2 levels deep is now just, "Invalid typeset...").

## 2.0.0 - 2019-09-10

### Breaking
-   The ESM build output is replaced with a CJS build output as this is the most compatible with popular Webpack and Rollup build systems.
-   The main package export is now the CJS build output.
-   The CJS build output is found in `./dist/cjs/...`
-   The UMD build output is now found in `./dist/umd/...`

### Changed
-   Dependency updates: All to latest.

## 1.2.0 - 2019-05-19

### Changed
-   Dependency updates only, including an update to `jsdoc-to-markdown` which resulted in some minor formatting changes to [API.md](API.md).

## 1.1.0 - 2019-02-02

### Changed
-   Dependency updates (minor and patch versions only)

## 1.0.0 - 2018-10-11

Initial release!

### Added
-   Everything
