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

[API](API.md)

# Changes

[Changelog](CHANGELOG.md)

# Contributing

[Contributing](CONTRIBUTING.md)

# License

[MIT](LICENSE)

# TODO

- [ ] Implement the library...
    - [ ] Add a ONE_OF type to check the value is in an enumeration (array of values) -- or make this part of STRING or NUMBER args?
    - [ ] Need `from/toJSON()` methods to de/serialize, which can be customized to handle custom validators.
    - [ ] Remember that `undefined` cannot be allowed in shape descriptors because that value isn't JSON-serializable -- update docs? -- it's the typeset as a whole (including nested objects) that must be serializable, although CLASS_OBJECT_args would not be with the 'ctr' property because that must be a ref to a function... perhaps emit a warning during serialization (with `toJSON()` override) if this is encountered...
    - [ ] Debug the generated docs (including private docs), checking for broken links...
- [ ] Unit tests must be run both in the browser and in Node.js
- [ ] Add Gitlab CI config, or use TravisCI?
- [ ] Publish to npm
    - [ ] Add `.npmignore`
- [ ] Make sure 'Goals' section is complete and accurate, add some links
- [ ] Make sure `CONTRIBUTING.md` is filled-out
- [ ] Collect `// TODO[future]` comments as new items in this list?

# Future

*   Support a formal plugin architecture allowing third-parties to register custom types?
