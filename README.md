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

The production build covers both locales. Docusaurus generates RSS and Atom for each locale once it has a listed article. The GitHub Pages workflow and editorial deployment controls are pending.

Articles are maintained in Markdown/MDX, and changes are version-controlled with Git.

## Editorial contributions

Articles may be prepared and verified with agent assistance. Editorial decisions and publication remain under my authority.

Repository conventions are documented in [AGENTS.md](AGENTS.md), the [editorial standard](standards/editorial.md), and the [authorial voice standard](standards/voice.md).

## Licenses

Original editorial content is licensed under [CC BY-NC-ND 4.0](LICENSE). Additional licensing terms for site code, automation, skills, and third-party materials are documented in [LICENSE-ADDITIONAL.md](LICENSE-ADDITIONAL.md).
