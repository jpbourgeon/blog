---
name: editorial-verify
description: Verify a blog article's semantic fidelity to its applicable 42P Captures, the editorial standard, the authorial voice standard, and its FR/EN counterpart. Use for pre-publication review or after substantive edits; write a version-bound editorial review without approving or publishing the article.
---

# editorial-verify

Examine the candidate article independently of its authoring pass. Verification is evidence for an authorial decision, not that decision.

1. Read `AGENTS.md`, `standards/editorial.md`, `standards/voice.md`, the exact FR/EN candidate files, and every applicable `rationale` link in their frontmatter. Resolve `.42p/rationale/<unit-slug>/capture.md` against the actual repository, including any additional explicitly identified source units and author decisions needed for the declared review. A Capture is non-authoritative and must not corroborate itself.
2. Identify the examined snapshot: candidate paths, locale, relevant content hashes or Git blob SHAs, standard revisions, linked Capture revisions, and whether the material is committed or still working-tree content. Do not report a committed or exhaustive audit without evidence.
3. Examine the three alignments independently:
   - **Rationale fidelity:** preserve adopted orientation, rationale, alternatives, conditions, uncertainty, scope and authorial authority; detect invented commitments, omissions, strengthening, weakening and drift. Inspect available original sources when necessary to substantiate a material claim; distinguish source limitations from an established mismatch. Where no Capture is applicable, mark this axis not applicable, not failed or proven.
   - **Editorial standard:** accuracy and attribution, separation of fact and inference, meaningful structure, intelligibility, historical context, terminology, functioning links and code examples to the extent verifiable.
   - **Voice standard:** personal and measured expression, natural connected prose, proportionate abstraction, and no invented experience, conviction, or promotional posture.
4. Check substantive FR/EN parity, including claim strength, exceptions, technical examples, outbound references, and visibility metadata. If a requested preliminary review examines only one locale, state the limited scope; it cannot certify bilingual readiness.
5. Record for each applicable axis `PASS`, `FAIL`, or `INCONCLUSIVE`. A material contradiction is `FAIL`; insufficient evidence for an applicable material claim is `INCONCLUSIVE`. Overall `PASS` requires every applicable axis and bilingual parity to pass. Never infer approval from a passing review. Cite concise file passages and available evidence for material findings; avoid invented numerical quality scores.
6. Write a compact Markdown report at `.42p/editorial-reviews/<article-slug>.md`, with the candidate and evidence identities, scope, axis verdicts, concrete defects or unresolved questions, overall verdict, and a clear `Human editorial approval: not granted by this report` statement. A later substantive article edit, linked Capture/standard revision affecting the assessment, or translation change requires re-verification before public publication. Keep only the useful current review; let Git hold its history.
7. Do not change the article, sources, standards, or visibility while verifying. Report blockers and the exact scope of conclusions. Do not ask the author to perform routine checks.

The report establishes only the correspondence and quality supported by the examined evidence. It does not institute a decision, prove unexamined source truth, or authorize deployment.
