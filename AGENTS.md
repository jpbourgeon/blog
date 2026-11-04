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

## Licensing

Respect the repository's [LICENSE](LICENSE) and [LICENSE-ADDITIONAL.md](LICENSE-ADDITIONAL.md). Preserve third-party licensing and attribution. Do not change licensing terms without explicit authorization.

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

Drafts and revision candidates may be worked on directly on `main` without a pull request. Never edit an already public article's canonical FR/EN files while its revision is unapproved. Instead create a distinct paired temporary article, with separate paths and preview slugs; keep the existing canonical files and URLs unchanged. Begin the temporary pair as `draft: true`. After explicit authorization, `editorial-publish` may expose it as `unlisted` for review. Subsequent edits to an authorized unlisted preview may deploy automatically; they are visible to anyone with its URL, and every substantive edit invalidates earlier verification. For other exposed content that cannot be isolated this way, use a branch or prevent automatic deployment until authorization.

Unlisted content is **publicly accessible**, not confidential; the public Git repository also exposes draft source files. When Pagefind is installed, exclude temporary/unlisted articles from its separate search index, independently of Docusaurus's own listing and sitemap behavior.

Keep canonical content in this repository. Adaptations for external platforms must preserve its meaning and identify the original publication when appropriate.

## 42P artifact locations

Store 42P artifacts under `.42p/` using these repository conventions:

- Captures: `.42p/rationale-units/<unit-slug>/capture.md`
- Allocations: `.42p/allocations/<scope-slug>/allocation.md`
- Derivation verifications: `.42p/derivation-verifications/<scope-slug>/verification.md`

Use stable slugs reflecting each artifact's identity. Captures, Allocations and Verifications do not necessarily share the same scope or identity. The repository conventions define artifact locations; the applicable skill defines its operation and artifact content.

Editorial verification reports remain under `.42p/editorial-reviews/`. Post-Apply verifications associated with OpenSpec Changes follow their own lifecycle and storage conventions. Do not create empty artifacts or directories merely to establish this structure.

## Editorial skills and rationale units

Repository-owned skills live under `.42p/.agents/skills/`. Read the relevant `SKILL.md` before performing its operation; a skill does not override the standards or grant editorial authority.

- [`42p-capture`](.42p/.agents/skills/42p-capture/SKILL.md): create or reconcile a compact, non-authoritative Capture of one coherent editorial exploration. Store it in `.42p/rationale-units/<unit-slug>/capture.md`; retain the unit slug as a stable identity, independent of article titles. Captures are not decisions, archives, or automatic publication approval.
- [`42p-allocate`](.42p/.agents/skills/42p-allocate/SKILL.md): reconcile Capture-derived responsibility allocations without adding design authority or verifying implementation.
- [`editorial-write`](.42p/.agents/skills/editorial-write/SKILL.md): draft and translate new articles, or prepare paired temporary revision candidates while leaving an exposed canonical article untouched. Preserve FR/EN alignment; do not publish.
- [`editorial-verify`](.42p/.agents/skills/editorial-verify/SKILL.md): independently assess Capture coverage, fidelity, both standards and bilingual parity; record evidence, categorical verdicts and reproducible candidate/target identities at `.42p/editorial-reviews/<canonical-article-slug>.md`. A passing report is not human approval.
- [`editorial-publish`](.42p/.agents/skills/editorial-publish/SKILL.md): manage authorized `draft`/`unlisted`/`public` visibility and atomically promote an approved temporary revision over the canonical FR/EN pair. Never compose new editorial prose during promotion. Public deployment requires both explicit author approval and an independent deterministic gate.

An article may draw from zero or more rationale units, and a unit may inform multiple articles. Where supported by the installed content plugin, link applicable `capture.md` files through a `rationale` frontmatter list of repository-relative paths. Do not create empty Captures or new infrastructure merely to satisfy a workflow.

Do not add editorial edition/version numbers, verification flags, approval fields or revision-parent markers to article frontmatter. Git holds versions. The verification report identifies each exact FR/EN candidate and the **projected canonical FR/EN result** using reproducible SHA-256 digests. Normalized content hashes exclude **only** top-level Docusaurus `draft` and `unlisted` fields; all other metadata and body text, including `slug`, remain material. A temporary revision has a distinct candidate digest and projected-target digest because its preview slug is replaced with the existing canonical slug. Also bind the report to applicable standards/Capture Git blob revisions and, for revisions, the current canonical baseline Git blobs. Verification and the independent publication gate must use the exact same deterministic canonical-projection and hashing implementation.

The author may authorize an `unlisted` preview before final public-publication approval; a final `PASS` is not required merely for an authorized preview. Public publication, including promotion of an existing article's revision, requires a matching overall `PASS` for the exact bilingual candidates and their projected canonical results, plus explicit approval of those exact versions and their public exposure. Changes to editorial content, target identity, applicable references or a revision's canonical baseline invalidate the match; permitted visibility-only changes do not. A passing report never institutes publication authority. An explicit author decision in the conversation is sufficient to instruct the agent, but is not independently attestable by CI from a SHA and a PASS report alone.

## Changes and publication

Use `main` for draft and authorized preview work when safe; no pull request is required for ordinary editorial publication or revision promotion. Use a branch/PR when isolation is otherwise necessary. Repository governance changes may still use a pull request.

Agents may prepare content and technical changes autonomously. Public publication of new or substantively revised editorial content requires explicit author approval; unlisted preview exposure requires separate explicit authorization. Preparing drafts and verifying content do not grant either permission.

Technical deployments may be automated according to the repository's configured workflows. Before exposing new or substantively changed canonical content publicly, an independently executed deterministic check (e.g. CI) must fail closed on unmatched candidate/target digests, changed reference or baseline revisions, missing `PASS`, unpaired locales or incomplete promotion. The gate must validate the actual commit/artifact to deploy and must guard **all** deployment paths capable of exposing canonical changes; an agent's assertion that it ran a check is not a mechanical gate. Do not claim this control is active until the installed site's actual deployment workflow enforces it.

Keep normative changes to the editorial/voice standards separate from article changes assessed against those standards; do not let a candidate silently change its own criteria.

## Deterministic publication and revision contract

- **Identity and input:** Resolve the actual configured Docusaurus blog paths, locales, effective canonical URLs, and article baseline before starting. New articles use their target paths directly. For a published revision, the old canonical FR/EN files remain in place while new temporary FR/EN files use unique paths and preview slugs. Verify route uniqueness and preserve stable canonical URLs, date/identity metadata and existing links unless a specific editorial change was authorized.
- **Canonical projection:** Define a single idempotent projection `P(candidate, baseline)`. For an initial publication, it removes only `draft`/`unlisted`. For a revision, it places each candidate's edited content at its existing canonical path, removes `draft`/`unlisted`, and restores only the canonical `slug` from the existing article (or removes the preview-only `slug` if the canonical article had none). All other frontmatter and body content must already be correct in the candidate; the publisher must not silently repair it. Confirm that the projected effective URL is unchanged. Any other substantive modification, including dates, links or asset paths, requires a new verified candidate.
- **Hashing:** Use a shared deterministic frontmatter parser/serializer and SHA-256 algorithm. `N(file)` excludes only top-level `draft` and `unlisted` from hashing. The report records `candidates.fr/en.path` and `content_sha256 = SHA256(N(candidate))`, and `targets.fr/en.path` and `content_sha256 = SHA256(N(P(candidate, baseline)))`. No other field, including the candidate or canonical `slug`, is omitted. For revisions record `baseline.fr/en.path` and `git_blob_sha` for the current canonical files. Include `references[]` with Git blob SHAs of applicable standards and Captures; keep the canonical article slug and overall `result`. File paths and hashes for both locales are mandatory for a publication-ready `PASS`. The implementation must define and test stable serialization/byte encoding; do not handwave content hashes or use incompatible normalizers.
- **Revision promotion:** After explicit approval of the report-bound candidates, `editorial-publish` checks the live candidates, references and canonical baseline against the report, projects the exact canonical outputs, updates the canonical FR/EN files and deletes both temporary files **in one atomic Git commit**. It must not introduce new editorial changes. The canonical-output digests must match the stored target digests. Handle relative asset/link resolution, translated slugs and routing before approval; a nonmechanical fix goes back through writing and verification.
- **Independent gate:** Require the `PASS` report to be committed before the promotion commit. On promotion, CI must inspect the promotion commit and its parent: reconstruct the prior candidates and baseline from the parent tree (including candidates deleted by promotion), check their recorded hashes and Git blob SHAs, verify current reference revisions and canonical output hashes, confirm both locales and both temporary-file deletions, and reject any unexpected canonical changes. The gate must also handle initial `draft` → `public` transitions and direct edits to public articles; any unapproved canonical-content change must fail closed. A build, route/link validation, and search-index exclusion checks belong in the installed deployment workflow. A commit's atomicity does not alone prevent an auto-deployment before its checks pass; deployment must depend on the gate.
- **Authority boundary:** The editorial report is evidence, not authorization. Human approval can be supplied explicitly in ChatGPT without a PR; the CI gate checks content integrity, **not** the origin of human consent. If independent attestation of human approval becomes necessary, configure a separate human deployment approval rather than misrepresenting the report as approval.

The publication gate and the shared normalizer are **specified, not currently implemented**. The repository has no Docusaurus installation or Pages deployment workflow yet; these safeguards must be built and tested during setup, before claiming they are enforced.

Report material changes, verification results and unresolved decisions concisely.
