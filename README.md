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
    - [ ] __All validations should come from `./src/lib/validation.js`. That's the only place `lodash` should be referenced in the source.__ In tests, doesn't matter. This way, the underlying validation logic can change without the rest of the code (i.e. swap lodash for something else).
    - [ ] Add a ONE_OF type to check the value is in an enumeration (array of values) -- or make this part of STRING or NUMBER args?
    - [ ] Add a convenience method to check values rather than an object with a shape, as in `rtv.check(value, TYPE | array)`, internally can wrap in an object with a single property and then send through normal channels
    - [ ] Must have a good error stack output in both string (p1.p2[4].p3...) and object for programmatic interpretation
    - [ ] Need `from/toJSON()` methods to de/serialize, which can be customized to handle property validators.
    - [ ] Remember that `undefined` cannot be allowed in shape descriptions because that value isn't JSON-serializable -- update docs? -- it's the typeset as a whole (including nested objects) that must be serializable, although CLASS_OBJECT_args would not be with the 'ctr' property because that must be a ref to a function... perhaps emit a warning during serialization (with `toJSON()` override) if this is encountered...
    - [ ] Typesets:
        - [ ] When add support for 'validator functions', will have to allow `CLASS_OBJECT` type to be followed by `null` if it's the last type in the typeset so that `[CLASS_OBJECT, null, v => v.foo === 'bar']` is properly interpreted as a generic class object with a custom validator. Otherwise, `[CLASS_OBJECT, v => v.foo === 'bar']` would be forcibly interpreted as a class object which is an instance of a function that takes a parameter and returns a boolean... Hopefully this is the only place where `null` would be permitted in a typeset/shape description. Make sure this is documented somewhere.
        - [ ] Throw an error if a type in a typeset array is not an accepted typeset kind (object, string, array, function), except if the type is `CLASS_OBJECT` and it's followed by `null` (per the exception above).
        - [ ] Throw an error if a property in a shape descriptor is not an accepted typeset kind (object, string, array, function).
        - [ ] Property validator function's typeset parameter should always be a fully-expanded typeset...
        - [ ] When typeset is an array, any nested shape descriptor must always be preceded by a type, even if it's the default OBJECT type, __unless__ it's the first element, at which point the default `OBJECT` type is implied (this is so we can keep the short form of `[[shape]]` to describe a list of objects with a particular shape). Throw an error if the first element in a typeset array is not a string (i.e. a type or a qualifier). It could also be a function to allow a property validator, like `[[v => v === 'foo']]` (a list of elements equal to 'foo'...).
        - [ ] The algorithm should short-circuit type checks in a typeset as soon as the first type-to-value match is found within a typeset array (i.e. don't go into nested arrays/shapes if a simpler type match was found prior to it within the typeset -- just call the validator, if any, immediately and exit).
- [x] Add linting: ESLint
- [x] Add unit test system: Mocha + Chai
- [x] Add minified output: UglifyJS?
- [ ] Add Gitlab CI config, or use TravisCI?
- [ ] Publish to npm
    - [ ] Add `.npmignore`
- [ ] Make sure 'Goals' section is complete and accurate, add some links
- [ ] Collect `// TODO[future]` comments as new items in this list

# Future

*   Support a formal plugin architecture allowing third-parties to register custom types?
