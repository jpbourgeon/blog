# jpbourgeon — Blog

This repository contains the source files for my personal and technical blog. I publish articles in French and English about topics I explore, projects I contribute to, and the decisions behind them.

The blog is the canonical source of my publications. Any republication on dev.to or LinkedIn serves to help readers discover them.

## Publishing

The site is built with [Docusaurus](https://docusaurus.io/) and configured for [GitHub Pages](https://pages.github.com/) at https://jpbourgeon.github.io/blog/. French is the default language, with English under `/en/` within the site.

Use Node.js 22 or later to install and check the site locally.

```sh
npm ci
npm run typecheck
npm run build
npm run serve
```

GitHub Actions runs the install, typecheck, production build and output checks on pull requests targeting `main` and on pushes to `main`. The build covers both locales. Docusaurus generates RSS and Atom for each locale once it has a listed article.

Once the workflow is on `main`, open **Actions → Validate and prepare GitHub Pages → Run workflow**, select `main` and enter its full commit SHA. The run checks out that commit and verifies the build. The temporary gate then fails deliberately before uploading any artifact. The native Pages steps are wired to use an artifact tied to the commit and run attempt once deployment is enabled. Dispatching the workflow grants no publication approval.

Before PR3, public deployment is disabled for technical changes, canonical publication and unlisted previews. No verified deployed baseline is available for checking cumulative changes, and a first deployment requires explicit review of everything it would expose. PR3 will supply the shared editorial transformations and independent integrity checks required for publication.

Before enabling public deployment, verify that **Settings → Pages → Source** is set to **GitHub Actions** and that the `github-pages` environment allows deployments only from `main`. The Pages source setting could not be verified during setup.

Articles are maintained in Markdown/MDX, and changes are version-controlled with Git.

## Editorial contributions

Articles may be prepared and verified with agent assistance. Editorial decisions and publication remain under my authority.

Repository conventions are documented in [AGENTS.md](AGENTS.md), the [editorial standard](standards/editorial.md), and the [authorial voice standard](standards/voice.md).

## Licenses

Original editorial content is licensed under [CC BY-NC-ND 4.0](LICENSE). Additional licensing terms for site code, automation, skills, and third-party materials are documented in [LICENSE-ADDITIONAL.md](LICENSE-ADDITIONAL.md).
