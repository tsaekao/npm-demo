[![pipeline status](https://gitlab.com/stefcameron/rtvjs/badges/master/pipeline.svg)](https://gitlab.com/stefcameron/rtvjs/commits/master)

# RTV.js

Runtime Verification Library for browsers and Node.js.

This library is isomorphic: It runs equally well in modern browsers and on the server with Node.js.

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

- [ ] Unit tests must be run both in the browser and in Node.js -- in the browser via Gitlab CI
- [ ] Add Gitlab CI config, or use TravisCI?
- [ ] Publish to npm
- [ ] Make sure 'Goals' section is complete and accurate, add some links
- [ ] Make sure `CONTRIBUTING.md` is filled-out

# Future

*   Support a formal plugin architecture allowing third-parties to register custom types?
