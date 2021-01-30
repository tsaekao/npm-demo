# RTV.js Releases

The release/publishing process is as follows:

1.  Checkout `master`, rebase, and make sure it's in a clean state __with no pending commits__ not yet pushed to origin.
2.  Move all entries under the __UNRELEASED__ section in the `/CHANGELOG.md` into a new version section matching the version number that will be released.
    -   Include the release date in the new section.
    -   Remove the __UNRELEASED__ section.
3.  Commit changes to `/CHANGELOG.md` using a commit message like `"Changes for version x.y.z"`.
4.  Run `npm run release:<major|minor|patch>`. This script will first version `/package.json` and the repo, and will then publish the new release to npm (as long as tests, the build, and docs succeed). It will also push the CHANGELOG commit, along with the `package.json` version update and release tag, up to `origin`.

    For example, to release a new minor version, run
    
    ```bash
    $ npm run release:minor
    ```

5.  Update the [documentation site](https://gitlab.com/stefcameron/rtvjs-web):
    1.  Copy the `README.md`, `CHANGELOG.md`, and `API.md` files over to the repo:
        -   `README.md` -> `/index.md`
        -   `CHANGELOG.md` -> `/pages/CHANGELOG.md`
        -   `API.md` -> `/pages/API.md`
    2.  Be sure to __restore the correct front matter__ that the existing files are currently using.
    3.  Add the library version to the top of the content in `API.md`.
    4.  Follow [publishing](https://gitlab.com/stefcameron/rtvjs-web#publishing) instructions in the `rtvjs-web` repository.
