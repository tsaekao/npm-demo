# RTV.js Changelog

All notable changes to this project will be documented in this file.

The format is based on [Keep a Changelog](https://keepachangelog.com/en/1.0.0/),
and this project adheres to [Semantic Versioning](https://semver.org/spec/v2.0.0.html).

Date format is YYYY-MM-DD.

## Unreleased

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
