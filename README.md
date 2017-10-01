# RTV.js

__Runtime Type Verification Isomorphic JavaScript Library__

This library runs equally well in modern browsers and on the server with Node.js.

# Documentation

[Documentation](dist/rtv.js.md)

# Changes

[Changelog](CHANGELOG.md)

# Contributing

[Contributing](CONTRIBUTING.md)

# License

[MIT](LICENSE.md)

# TODO

- [ ] Implement the library...
    - [ ] Add a convenience method to check values rather than an object with a shape, as in `rtv.check(value, TYPE | array)`, internally can wrap in an object with a single property and then send through normal channels
    - [ ] Must have a good error stack output in both string (p1.p2.p3...) and object for programmatic interpretation
- [ ] Add linting: ESLint
- [ ] Add unit test system: Karma + Jasmine
- [ ] Add minified output: UglifyJS?
- [ ] Add Gitlab CI config, or use TravisCI?
- [ ] Publish to npm
    - [ ] Add `.npmignore`
