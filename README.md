# jpbourgeon — Blog

This repository contains the source files for my personal and technical blog. I publish articles in French and English about topics I explore, projects I contribute to, and the decisions behind them.

The blog is the canonical source of my publications. Any republication on dev.to or LinkedIn serves to help readers discover them.

## Publishing

The site is built with [Docusaurus](https://docusaurus.io/). Its planned [GitHub Pages](https://pages.github.com/) address is https://jpbourgeon.github.io/blog/.

French is the default language. English routes use the `/en/` prefix. Markdown/MDX articles live in `blog/` for French and `i18n/en/docusaurus-plugin-content-blog/` for English. Docusaurus generates RSS and Atom for each locale once it has a listed article.

## Local checks

Use Node.js 20 or newer and npm.

```sh
npm ci
npm run typecheck
npm run build
npm run serve
```

The build includes both languages. Open `http://localhost:3000/blog/` for French and `http://localhost:3000/blog/en/` for English. The publishing workflow and editorial integrity checks are specified in [AGENTS.md](AGENTS.md) and remain to be implemented.

## Editorial contributions

Articles may be prepared and verified with agent assistance. Editorial decisions and publication remain under my authority.

Repository conventions are documented in [AGENTS.md](AGENTS.md), the [editorial standard](standards/editorial.md), and the [authorial voice standard](standards/voice.md).

## Licenses

Original editorial content is licensed under [CC BY-NC-ND 4.0](LICENSE). Additional licensing terms for site code, automation, skills, and third-party materials are documented in [LICENSE-ADDITIONAL.md](LICENSE-ADDITIONAL.md).
