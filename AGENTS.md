# Repository instructions

## Purpose

This repository hosts jpbourgeon's personal and technical blog, built with Docusaurus and published on GitHub Pages.

The blog is the canonical source for articles published in French and English. External platforms, including dev.to and LinkedIn, are secondary distribution channels.

## Authority and navigation

The repository is the source of truth for its implementation, content and conventions.

Before acting, inspect the relevant files, configuration and Git history. Do not assume implementation details or publication status.

Read and follow the applicable standards:

- [Editorial standard](standards/editorial.md) — content quality, accuracy and semantic fidelity.
- [Authorial voice](standards/voice.md) — writing style, tone and authorial authenticity.

The standards apply to all relevant content, including drafts, translations and adaptations for external platforms.

## Engineering

- Prefer native Docusaurus and GitHub capabilities.
- Apply KISS and YAGNI. Avoid unnecessary dependencies, configuration and infrastructure.
- Follow existing repository conventions.
- Keep changes focused, reproducible and verifiable.
- Run applicable checks before proposing integration.
- Update documentation when changes materially affect its accuracy.

## Editorial workflow

Agents may research, draft, revise, translate and prepare articles.

Preserve the author's meaning, reasoning and voice. Never introduce unsupported claims or fabricate personal experiences. The author alone judges editorial value and whether an article deserves publication; agents verify evidence and conformity, not worth, novelty, impact, or audience demand.

Distinguish drafts, approved content and published content. Approval of one version does not imply approval of subsequent substantive revisions or translations.

Updates follow the same cycle as initial writing: reconcile any applicable rationale Capture against new material (using `42p-capture`), then write, verify, decide, and publish as applicable. Articles without a relevant Capture do not need one merely for an update. Do not silently rewrite an earlier published position as though it had always been held.

Draft-only content may be worked on directly on `main`. Changes to already exposed (`unlisted` or public) content must be isolated from automatic deployment until verified and explicitly authorized; use a branch/PR when `main` deploys automatically.

Keep canonical content in this repository. Adaptations for external platforms must preserve its meaning and identify the original publication when appropriate.

## Editorial skills and rationale units

Repository-owned skills live under `.42p/.agents/skills/`. Read the relevant `SKILL.md` before performing its operation; a skill does not override the standards or grant editorial authority.

- [`42p-capture`](.42p/.agents/skills/42p-capture/SKILL.md): create or reconcile a compact, non-authoritative Capture of one coherent editorial exploration. Store it in `.42p/rationale/<unit-slug>/capture.md`; retain the unit slug as a stable identity, independent of article titles. Captures are not decisions, archives, or automatic publication approval.
- [`editorial-write`](.42p/.agents/skills/editorial-write/SKILL.md): draft, revise, or translate an article using the applicable Captures, editorial standard and voice standard. Keep French and English substantive content aligned; do not publish.
- [`editorial-verify`](.42p/.agents/skills/editorial-verify/SKILL.md): independently examine the article against its applicable Capture(s), both standards and its other language version. Record a non-authoritative review at `.42p/editorial-reviews/<article-slug>.md`, bound to both content digests and applicable reference revisions; a passing report is not human approval.
- [`editorial-publish`](.42p/.agents/skills/editorial-publish/SKILL.md): apply authorized `draft`, `unlisted`, or `public` visibility. For `public`, require both an explicit author decision and a matching `PASS` report checked by a deterministic publication gate; do not rewrite editorial content.

An article may draw from zero or more rationale units, and a unit may inform multiple articles. Where supported by the installed content plugin, link applicable `capture.md` files through a `rationale` frontmatter list of repository-relative paths. Do not create empty Captures or new infrastructure merely to satisfy a workflow.

Do not add an editorial edition/version number or verification/approval flag to article frontmatter. Git holds versions. The verification report identifies the exact FR/EN candidate content using reproducible SHA-256 digests that exclude **only** the top-level Docusaurus `draft` and `unlisted` visibility fields; all other metadata and content are part of the identity. Include the applicable standards and Capture revisions as evidence. The same normalization must be used by verification and the publication gate.

The author may authorize an `unlisted` preview before final public-publication approval; it is publicly accessible to anyone with the URL, not private. A final `PASS` is not required merely for an authorized preview. Moving content to `public` requires a matching overall `PASS` for the exact French and English content and explicit approval of those candidates and the public exposure. Changes to editorial content or applicable evidence invalidate previous matches; permitted visibility-only changes do not. A passing report never institutes publication authority.

## Changes and publication

Prefer changes through branches and pull requests.

Agents may prepare content and technical changes autonomously. Public publication of new or substantively revised editorial content requires explicit author approval; unlisted preview exposure requires separate explicit authorization. Preparing drafts and verifying content do not grant either permission.

Technical deployments may be automated according to the repository's configured workflows. Before public deployment, an independently executed deterministic check (e.g. CI) must fail closed if the current paired content or applicable references differ from the passing report. An agent's assertion that it ran a check is not a mechanical gate. Do not claim this control is active until the site's actual deployment workflow enforces it.

Keep normative changes to the editorial/voice standards separate from article changes assessed against those standards; do not let a candidate silently change its own criteria.

Report material changes, verification results and unresolved decisions concisely.
