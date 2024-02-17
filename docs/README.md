[![build status](https://github.com/stefcameron/rtvjs-web/badges/master/pipeline.svg)](https://github.com/stefcameron/rtvjs-web/commits/master)
![Jekyll Version](https://img.shields.io/gem/v/jekyll.svg)

# rtvjs-web

Documentation site for [RTV.js](https://github.com/stefcameron/rtvjs).

## Jekyll

Built with https://jekyllrb.com/

## Local Development

```bash
$ bundle exec jekyll serve [-w] [-l]
```

- `-w`: Watch for changes
- `-l`: Live reload

Or simply run `./scripts/start` to run the above with the `-w -l` options.

> See [serve command options](https://jekyllrb.com/docs/configuration/options/#serve-command-options) for more command line switches.

Open your browser to http://localhost:4000

## Syntax Highlighting

This is done [using Rouge](https://bnhr.xyz/2017/03/25/add-syntax-highlighting-to-your-jekyll-site-with-rouge.html), Jekyll's default syntax highlighting engine.

From the link above,

> As of rouge 1.11.1, the available themes are: `base16, base16.dark, base16.monokai, base16.monokai.light, base16.solarized, base16.solarized.dark, colorful, github, gruvbox, gruvbox.light, molokai, monokai, monokai.sublime, thankful_eyes`

To change the theme, generate a new CSS file for that theme using the `rougify` script (installed when you ran `bundle` in the repo's root directory earlier to install dependencies):

```bash
$ rougify style {theme} > assets/css/syntax.css
```

## Publishing

- Be sure to bump the `cache_bust` setting in `./_config.yml` if any CSS or JS has changed.
- Make sure the "Version x.y.z" statement at the top of `./pages/API.md` is accurate.

Build for prod: `bundle exec jekyll build` Note you can add `-d public` to specify an output directory (`public` in this example) other than the default `_site`.

All commits to `master` will be automatically published via CI.
