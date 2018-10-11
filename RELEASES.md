# RTV.js Releases

The release/publishing process is as follows:

1.  Checkout master, rebase, and make sure it's in a clean state _with no pending commits_ not yet pushed to origin.
2.  Move all entries under the `Unreleased` section in the `/CHANGELOG.md` into a new version section matching the version number that will be released. Leave the `Unreleased` section there, empty.
3.  Commit changes to `/CHANGELOG.md` using a commit message like `"Changes for version x.y.z"`.
4.  Run `npm run release:<major|minor|patch>`. This script will first version `/package.json` and the repo, and will then publish the new release to npm (as long as tests, the build, and docs succeed).

    For example, to release a new minor version, run `npm run release:minor`
