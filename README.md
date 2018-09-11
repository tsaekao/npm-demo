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
