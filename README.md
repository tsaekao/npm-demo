# RTV.js

__Runtime Type Verification Isomorphic JavaScript Library__

This library runs equally well in modern browsers and on the server with Node.js.

# Goals

Shapes must be:

*   serializable to JSON so they remain portable;
*   composable (shapes can reference other shapes);
*   easy to express (rich types and qualifiers);
*   easy to customize (with validators).

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
    - [ ] Need `from/toJSON()` methods to de/serialize
    - [ ] Remember that `undefined` cannot be allowed in shape descriptions because that value isn't JSON-serializable.
    - [ ] When add support for 'validators', will have to allow `CLASS_OBJECT` type to be followed by `null` if it's the last type in the typeset so that `[CLASS_OBJECT, null, v => v.foo === 'bar']` is properly interpreted as a generic class object with a custom validator. Otherwise, `[CLASS_OBJECT, v => v.foo === 'bar']` would be forcibly interpreted as a class object which is an instance of a function that takes a paremeter and returns a boolean... Hopefully this is the only place where `null` would be permitted in a typeset/shape description.
- [ ] Add linting: ESLint
- [ ] Add unit test system: Karma + Jasmine
- [ ] Add minified output: UglifyJS?
- [ ] Add Gitlab CI config, or use TravisCI?
- [ ] Publish to npm
    - [ ] Add `.npmignore`
- [ ] Make sure 'Goals' section is complete and accurate, add some links
