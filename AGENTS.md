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

Follow the same cycle for new articles and revisions: explore, establish or reconcile the main Capture if applicable (using `42p-capture`), draft in FR/EN, verify, obtain the author's decision, then publish as authorized. Articles without a relevant Capture do not need one merely for an update. Do not silently rewrite an earlier published position as though it had always been held.

Drafts and revision candidates may be worked on directly on `main` without a pull request. Never edit an already public article's canonical FR/EN files while its revision is unapproved. Instead create a distinct paired temporary article, with separate paths and preview slugs; keep the existing canonical files and URLs unchanged. Begin the temporary pair as `draft: true`. After explicit authorization, `editorial-publish` may expose it as `unlisted` for review. Subsequent edits to an authorized unlisted preview may deploy automatically; they are visible to anyone with its URL, and every substantive edit invalidates earlier verification. For other exposed content that cannot be isolated this way, use a branch or prevent automatic deployment until authorization.

Unlisted content is **publicly accessible**, not confidential; the public Git repository also exposes draft source files. When Pagefind is installed, exclude temporary/unlisted articles from its separate search index, independently of Docusaurus's own listing and sitemap behavior.

Keep canonical content in this repository. Adaptations for external platforms must preserve its meaning and identify the original publication when appropriate.

## 42P artifact locations

Store Captures at `.42p/rationale-units/<unit-slug>/capture.md` and editorial verification reports under `.42p/editorial-reviews/`. Post-Apply verifications associated with OpenSpec Changes follow their own lifecycle and storage conventions. Do not create empty artifacts or directories merely to establish this structure.

## Editorial skills and rationale units

Repository-owned skills live under `.42p/.agents/skills/`. Read the relevant `SKILL.md` before performing its operation; a skill does not override the standards or grant editorial authority.

- [`42p-capture`](.42p/.agents/skills/42p-capture/SKILL.md): create or reconcile a compact, non-authoritative Capture of one coherent editorial exploration. Store it in `.42p/rationale-units/<unit-slug>/capture.md`; retain the unit slug as a stable identity, independent of article titles. Captures are not decisions, archives, or automatic publication approval.
- [`editorial-write`](.42p/.agents/skills/editorial-write/SKILL.md): draft and translate new articles, or prepare paired temporary revision candidates while leaving an exposed canonical article untouched. Preserve FR/EN alignment; do not publish.
- [`editorial-verify`](.42p/.agents/skills/editorial-verify/SKILL.md): independently check exhaustive semantic coverage in both directions between the main Capture, when applicable, and each article version. Check fidelity, both standards and bilingual parity. Record evidence, categorical verdicts and reproducible candidate/target identities at `.42p/editorial-reviews/<canonical-article-slug>.md`. A passing report is not human approval.
- [`editorial-publish`](.42p/.agents/skills/editorial-publish/SKILL.md): manage authorized `draft`/`unlisted`/`public` visibility and atomically promote an approved temporary revision over the canonical FR/EN pair. Never compose new editorial prose during promotion. Public deployment requires both explicit author approval and an independent deterministic gate.

### Article provenance and scope

A logical article includes its FR/EN versions and successive revisions. An article may have no Capture. An article derived from a Capture has exactly one main Capture, and each Capture can be the main Capture of at most one logical article. Its unit identity remains stable independently of article titles and slugs. A Capture may provide context for multiple other articles. Exploratory or abandoned Captures need not result in articles.

Use the following frontmatter for a main Capture and optional context:

```yaml
rationale: .42p/rationale-units/main-topic/capture.md
rationaleContext:
  - .42p/rationale-units/related-topic/capture.md
```

`rationale` is a scalar path. Omit `rationaleContext` when there is no useful context and omit both fields when there is no applicable Capture. Use repository-relative paths to existing `capture.md` files, with no duplicate entries, invalid paths or main Capture repeated in `rationaleContext`. FR/EN must express the same provenance. Use article frontmatter to check these associations without a separate registry.

The main Capture sets the substantive scope while editorial authority stays with the author. Contextual Captures help understand related explorations and locate sources. They add no coverage obligation, editorial authority, cross-Capture synthesis requirement or automatic dependency on their revisions. Reconcile any contextual idea that becomes substantive in the main Capture before drafting it.

### Verification and publication binding

Do not add editorial edition/version numbers, verification flags, approval fields or revision-parent markers to article frontmatter. Git holds versions and source identities. A publication-ready editorial review records, for each language, the exact candidate path and its normalized content SHA-256 and the canonical target path and its expected normalized SHA-256. Bind the two standards and, when present, the main Capture as normative references using their Git blob IDs. For a revision, also record the Git blob IDs of the canonical baselines. Contextual Capture blobs are not required for a `PASS`.

The two content digests have different purposes: the candidate digest binds the exact approved preview (including its temporary `slug`); the target digest binds the exact public result (including its canonical `slug`). `N(file)` excludes **only** top-level `draft` and `unlisted` so that visibility-only changes do not invalidate editorial verification. No other metadata or body content is ignored. Use one shared, tested normalizer `N` and minimal canonical transformation `P` across verification, publication and CI; do not invent a second versioning system.

The author may authorize an `unlisted` preview before final public-publication approval; a final `PASS` is not required merely for an authorized preview. Public publication, including promotion of an existing article's revision, requires a matching overall `PASS` for the exact bilingual candidates and their projected canonical results, plus explicit approval of those exact versions and their public exposure. Changes to article content (including substantive edits), target identity, normative reference blobs (including the main Capture) or a revision's canonical baseline invalidate the match. Changing the `rationaleContext` list changes the candidate digest and invalidates the match, while editing the contents of a contextual Capture does not automatically invalidate it. Permitted visibility-only changes remain exempt. A passing report never institutes publication authority. An explicit author decision in the conversation is sufficient to instruct the agent, but is not independently attestable by CI from a SHA and a PASS report alone.

## Changes and publication

Use `main` for draft and authorized preview work when safe; no pull request is required for ordinary editorial publication or revision promotion. Use a branch/PR when isolation is otherwise necessary. Repository governance changes may still use a pull request.

Agents may prepare content and technical changes autonomously. Public publication of new or substantively revised editorial content requires explicit author approval; unlisted preview exposure requires separate explicit authorization. Preparing drafts and verifying content do not grant either permission.

Technical deployments may be automated according to the repository's configured workflows. Before exposing new or substantively changed canonical content, a **separately executed, fail-closed CI gate** must validate the exact commit/artifact to deploy against a previously committed, unchanged `PASS` review. Check both locales, expected canonical digests, applicable reference versions, revision baselines, permitted transitions and absence of unexpected public changes. The deploy job must depend on the gate, and **every** path capable of exposing canonical changes must be protected. Agent-side checks or a successful build do not substitute for the gate. Do not claim this protection is active until implemented and exercised in the real deployment workflow.

Public deployment of new or substantively revised canonical content must be initiated by an explicit `workflow_dispatch` after author approval (the agent may trigger it); automatic push workflows may verify and build but must never expose such canonical changes, and the dispatched deployment must still pass the independent gate on the exact approved commit/artifact.
Keep normative changes to the editorial/voice standards separate from article changes assessed against those standards; do not let a candidate silently change its own criteria.

## Minimal deterministic publication contract

- **Resolve identity:** Read actual Docusaurus paths, locale configuration, routes and canonical baselines. New articles retain their canonical paths while `draft` or `unlisted`. Revisions of published articles use separate temporary FR/EN files and preview slugs, leaving public canonical files and URLs unchanged until authorized promotion. Check URL uniqueness, relative assets and links before approval.
- **Single transformation:** `P(candidate, baseline)` removes only `draft`/`unlisted`. For a revision it also moves the candidate to the existing canonical path and restores **only** the original canonical `slug` (or removes a preview-only slug when the baseline has none). It must not rewrite article text, dates, links or other metadata. Verify the effective canonical URL is unchanged. `N` and `P` must use one shared, tested implementation with an explicitly defined, deterministic frontmatter serialization and UTF-8 byte encoding (including stable line endings). The same input must produce byte-identical output across runs and callers. Only the specified visibility fields and, on revision promotion, the canonical path/`slug` may change; all other frontmatter values and Markdown body content must remain unchanged. Test these invariants against the site's actual frontmatter format.
- **Verification binding:** `editorial-verify` records `SHA256(N(candidate))` and `SHA256(N(P(candidate, baseline)))` per locale. Current Git blob IDs bind normative references and canonical baselines. `editorial-publish` checks the live candidate identity, projected target identity, normative references and baseline against that review before any public transition. A visibility-only change is permitted. A change to candidate `slug`, body or any other normalized field invalidates the candidate identity.
- **Atomic promotion:** For a revision, publication writes precisely the verified projected FR/EN outputs at the original canonical paths and deletes both temporary files **in one Git commit**. Any unexpected editorial correction returns to writing and verification. For an initial publication, change only the authorized visibility fields in both locales.
- **Independent deployment gate:** Require the `PASS` review to have existed unchanged in the commit **before** publication. CI checks normalized final canonical outputs against the report, current normative reference Git blobs, prior canonical baseline Git blobs, paired transitions, candidate-file deletion on revisions, allowed changed paths, route/build correctness, and preview exclusion from search indexes. For a revision, independently read **only the two candidate blobs from the immediately preceding commit**, verify their candidate digests and confirm that their projected outputs equal the published FR/EN targets. For an initial publication, check that the preceding files were verified drafts/previews and that only visibility changed. No full parent-tree checkout or reconstruction is needed. Reject direct public edits and all other uncovered deployment paths. Ensure the deploy job cannot run before or around the gate. This deterministic control verifies artifact identity and integrity. Semantic judgment remains the responsibility of `editorial-verify`.
- **Authority boundary:** A review and a CI `PASS` are evidence of quality/integrity, not human permission. Explicit approval in ChatGPT governs the agent but is not independently attested by CI. A human deployment-approval control is a separate decision if such attestation becomes necessary.

The shared normalizer, projection and independent Pages gate are implemented in `scripts/publication/`. See [Publishing](README.md#publishing) for the commands, manual operations and current limits. Only a successful deployment observed in GitHub Pages and Actions establishes that the protection has been exercised in production. Confirm Pages settings and use the inspected, explicitly authorized bootstrap if no verified deployment exists.

Report material changes, verification results and unresolved decisions concisely.
