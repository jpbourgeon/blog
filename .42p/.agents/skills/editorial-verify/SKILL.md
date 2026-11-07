# editorial-verify

Read `AGENTS.md`, both standards, exact FR/EN candidates, established author
decisions, relevant independent sources, and the main Capture if applicable.
A Capture is not independent evidence. Evaluate pages and articles identically.

Verify factual support, fidelity to the author's intent, both standards,
bilingual semantic parity, links and technical publication readiness.
When a main Capture exists, map every material component **Capture → content**
(completeness) and **content → Capture** (no unsupported substantive additions),
in both languages. Context Captures supply references, not additional coverage.

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
`npm run publication -- check <report>`. A change to content identity,
normative references or revision baseline invalidates PASS. The verifier
does not modify candidates or grant approval. Present the result to the author.
