---
name: editorial-write
description: Draft, revise, or translate canonical FR/EN blog articles from author-approved material, optional 42P editorial Captures, and the repository editorial and voice standards. Use when preparing or substantially editing an article; do not publish it.
---

# editorial-write

Produce a reader-facing article, not a transcription of the exploration. Work within the repository's actual content and localization structure; never invent an installation or configuration.

1. Read repository-root `AGENTS.md`, `standards/editorial.md`, and `standards/voice.md`. Inspect the article(s), relevant Git history, the user's current request, and any explicitly linked or identified `.42p/rationale/<unit-slug>/capture.md` files. If a Capture needs creation or reconciliation, use `42p-capture` separately; do not silently rewrite it as a side effect of writing.
2. Establish the article's purpose, audience, angle, intended contribution, and material author-adopted positions. A Capture is a compact non-authoritative working projection, not approval or independent evidence. Preserve the distinction between established author decisions, evidence, hypotheses, open questions, alternatives, and model proposals. Do not turn a plausible suggestion or silence into an authorial position.
3. Draft or revise for the reader using the two standards. Preserve material conditions, limits, trade-offs, chronology, and source attribution; distinguish verified facts from opinions or deductions. Do not invent personal experiences, convictions, claims, quotations, metrics, tests, or sources. Research or verify time-sensitive and technical assertions when possible; mark material uncertainties when not.
4. Prepare corresponding French and English Markdown/MDX versions together, unless the user explicitly scopes a preparatory edit otherwise. Preserve the same substantive claims, degree of certainty, exclusions, links and code semantics across languages; do not assume literal sentence-for-sentence translation. Locate files and locales from the actual Docusaurus configuration, if installed. Do not guess locale directories or URLs.
5. Maintain or add an optional `rationale` frontmatter list of repository-relative `.42p/rationale/<unit-slug>/capture.md` paths when the article uses Captures and the site accepts that field. The relation is many-to-many; a simple article needs no Capture. Preserve stable unit slugs. If the current site rejects custom metadata, surface the incompatibility rather than adding a plugin or silently losing traceability.
6. Use the site's native Markdown conventions and verified frontmatter fields. For a new article, keep `draft: true` in both locales as a safe initial state. On revisions, never make an article more visible. Do not change visibility for publication; that belongs to `editorial-publish`.
7. Recheck technical accuracy, semantic fidelity, FR/EN parity, and links within the available evidence. Escalate only material editorial choices or contradictions requiring the author's authority; do not resolve them by stylistic preference. Report changed files, material open issues, and the need for independent `editorial-verify`.

Writing never constitutes editorial approval, verification, or permission to publish.
