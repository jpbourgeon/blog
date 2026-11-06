# jpbourgeon — Blog

This repository contains the source files for my personal and technical blog. I publish articles in French and English about topics I explore, projects I contribute to, and the decisions behind them.

The blog is the canonical source of my publications. Any republication on dev.to or LinkedIn serves to help readers discover them.

## Publishing

The site is built with [Docusaurus](https://docusaurus.io/) and configured for [GitHub Pages](https://pages.github.com/) at https://jpbourgeon.github.io/blog/. French is the default language, with English under `/en/` within the site.

Use Node.js 22.18 or later to install and check the site locally.

```sh
npm ci
npm run typecheck
npm run test:publication
npm run build
npm run serve
```

Pull requests and pushes to `main` run those checks through the build. Both locales are built. These runs upload no Pages artifact and cannot deploy.

### Manual publication

In **Actions → Validate and prepare GitHub Pages → Run workflow**, select `main`, enter its full current SHA and choose the operation. If `main` advances or a run fails, review the current SHA and start a fresh dispatch.

| Mode | Scope |
| --- | --- |
| `inspect` | List the bilingual routes and files, with their SHA-256 hashes, in the workflow log. This mode uploads no artifact. |
| `bootstrap` | First exposure of the permanent site after explicit author approval of the inspected commit. Any canonical article or unlisted preview blocks this operation. |
| `publish` | Deploy authorized previews, verified canonical promotions and changes proven not to affect rendering. Use it after approval of the exact versions and exposures included in the dispatch. |
| `pages` | Deploy an explicit author-approved change to the existing About and Projects pages. The dispatch cannot also change an exposed article. Review the FR/EN pages and the inventory before approving. |

Before first exposure, verify **Settings → Pages → Source → GitHub Actions** and keep the `github-pages` environment restricted to the `main` branch. The gate checks these settings before upload. Run `inspect` for the exact commit, review the French and English permanent pages, routes, resources and scripts, and obtain the author's specific approval for the first exposure. Then run `bootstrap` on that same commit. Bootstrap checks for a successful earlier inspection at the same SHA and a Pages site with no prior successful build or deployment record. Inspecting the site, passing the gate and dispatching the workflow are distinct from the author's approval.

Normal runs use the latest successful `github-pages` environment deployment, the native Pages status for its commit and the matching successful Actions deployment job. The gate refuses missing, expired, inconsistent or ambiguous evidence, including a newer deployment request whose actual outcome is uncertain. Inspect the native Pages and Actions histories before a subsequent dispatch. A build result, a parent commit or an assumed empty baseline cannot establish what is live. All deployment modes stay manual.

The current gate accepts static Markdown content in Markdown and MDX files, paired by Docusaurus's locale-relative path. Executable MDX, new permanent routes, new static assets and changes to renderers, translation configuration or dependencies require a separately reviewed way to prove their public effect before deployment. Canonical withdrawal is also blocked until its transition is specified. The gate checks Docusaurus routes, sitemaps, listings and feeds. Pagefind is absent and unknown generated search files are refused. Draft Markdown remains visible in this public repository. Unlisted previews are accessible by URL.

### Editorial checks

Use a clean checkout at the exact candidate or review commit.

```sh
npm run --silent publication -- prepare <candidate-fr> <candidate-en>
npm run --silent publication -- prepare <candidate-fr> <candidate-en> <canonical-fr> <canonical-en>
npm run --silent publication -- check <report-path>
npm run --silent publication -- project <report-path>
```

`prepare` returns the report path and technical frontmatter without a verdict. It binds paths, normalized candidate and target bytes, standards, the main Capture when applicable, and revision baseline blobs. The `article` field is the canonical French route relative to the site root, without leading or trailing slashes. A dated route uses the same nested path under `.42p/editorial-reviews/`. If a temporary revision shares its main Capture with the canonical article, the report's baseline links the two representations. The verifier may record its actual `INCONCLUSIVE` or `FAIL` verdict before preview, if applicable. A preview does not require a final `PASS`.

`check` verifies a committed report against the current candidate and baseline. After explicit author approval, `project` emits the exact file contents to write and the temporary paths to delete from a matching committed `PASS`. Commit the reported changes together. Commit the review before that promotion commit. GitHub Actions independently verifies the transition from its immediate parent and checks all canonical transitions since the last deployment.

The normalizer parses YAML as Docusaurus does and requires unambiguous mappings of supported values. It serializes maps in sorted key order as UTF-8 with LF line endings. It preserves sequence order, typed dates, unknown metadata and the Markdown body, apart from line-ending normalization. Only top-level visibility fields are omitted. Revision projection also restores the canonical path and original slug or its absence.

## Editorial contributions

Articles may be prepared and verified with agent assistance. Editorial decisions and publication remain under my authority.

Repository conventions are documented in [AGENTS.md](AGENTS.md), the [editorial standard](standards/editorial.md), and the [authorial voice standard](standards/voice.md).

## Licenses

Original editorial content is licensed under [CC BY-NC-ND 4.0](LICENSE). Additional licensing terms for site code, automation, skills, and third-party materials are documented in [LICENSE-ADDITIONAL.md](LICENSE-ADDITIONAL.md).
