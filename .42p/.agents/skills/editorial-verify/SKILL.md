# editorial-verify

Run the verification in a fresh context separate from the one that drafted or
revised the candidates. If only the drafting context is available, provide a
preliminary self-review and defer the formal report and verdict to the independent
verification.

Read `AGENTS.md`, both standards, exact FR/EN candidates, established author
decisions, relevant independent sources, and the main Capture if applicable.
A Capture is not independent evidence. Evaluate pages and articles identically.

Verify factual support, fidelity to the author's intent, both standards,
bilingual semantic parity, links and technical publication readiness.
When a main Capture exists, map every material component **Capture → content**
(completeness) and **content → Capture** (no unsupported substantive additions),
in both languages. Context Captures supply references, not additional coverage.

## Authorial voice review

Assess `standards/voice.md` as a distinct editorial axis, in both languages.
Do not infer conformity from correct facts, a first-person voice, a sober tone,
or the absence of promotional language alone.

Read the text as a whole and inspect representative passages for:

- **Naturalness:** Does it sound like a person explaining their work and ideas,
  rather than an institution presenting a doctrine?
- **Useful density:** Does each paragraph add information, reasoning or a
  position, rather than repeat generic or decorative abstractions?
- **Clarity:** Could convoluted phrasing be made simpler without losing meaning?
- **Progression:** Do paragraphs develop connected ideas, not just enumerate
  concepts or restate the same thought?
- **Authenticity:** Are personal experiences, positions and motivations
  supported by author decisions or source material, rather than inferred
  or invented by the writer?
- **Adaptation:** Is the depth, length and level of abstraction justified by
  the page, technical article or essay and its intended readers?

For the voice verdict, cite concrete passages and explain their effect on the
reader. A pervasive generic, pompous or institutional register is a `FAIL`,
even when all factual claims and formal requirements are satisfied. If the
evidence of the author's own voice is insufficient, mark `INCONCLUSIVE`
rather than asserting authenticity. Isolated stylistic improvements that do
not compromise the standard may be recommendations without blocking `PASS`.

These are editorial judgments, not mechanical checks, vocabulary bans,
word-count thresholds or automated scores. The verifier assesses conformity
to the stated voice standard; the author alone judges whether the result
genuinely sounds like them and whether it merits publication.

## Editorial improvement opportunities

Independently of the compliance verdict, identify material opportunities to
improve the editorial quality of each FR/EN candidate.

Focus on concrete passages where the writing could better express the author's
intent, develop a distinctive perspective, improve the progression of ideas,
or replace generic statements with useful substance.

For each opportunity, cite the passage, explain its limitation and suggest
the direction of improvement without rewriting the candidate.

Distinguish these recommendations from compliance failures. They are
non-blocking and do not affect `PASS` / `FAIL` / `INCONCLUSIVE`.

Report only meaningful opportunities. Do not invent weaknesses to populate
this section. If none are identified, state so explicitly.

Record axis-level `PASS`, `FAIL` or `INCONCLUSIVE`. An overall `PASS`
requires all applicable axes to pass; missing material evidence cannot PASS.
A content without a main Capture has `N/A` for Capture coverage.

For exact source identities, from a clean commit run:

```sh
npm run publication -- prepare <candidate-fr> <candidate-en> [<canonical-fr> <canonical-en>]
```

The resulting report frontmatter has `content` (`article/<slug>` or
`page/<slug>`), `mode` (`new`/`revision`), FR/EN `candidates` and
`targets` (path and normalized content SHA-256), `references` (Git blob
IDs for both standards and optional main Capture), optional `baseline`
(published FR/EN blob IDs), and overall `result`.
Write the report to `.42p/editorial-reviews/<type>/<slug>.md`.

Its body provides sources, mapped evidence, categorical verdicts, limitations,
and this exact notice:

`Human editorial approval: not granted by this report`

Commit the report **before** public promotion. Then run
`npm run publication -- check <report>`. Before promotion, a change to
content identity, current normative references or revision baseline requires
a new verification. Once the exact FR/EN content is published, references
remain historical evidence: later standard or Capture edits do not expire
the existing PASS. The verifier does not modify candidates or grant approval.
Present the result to the author.
