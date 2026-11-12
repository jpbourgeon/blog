# editorial-write

Read `AGENTS.md`, `standards/editorial.md`, `standards/voice.md`, and the
existing content/versions. Read the main Capture when one applies; context
Captures are references, not extensions of its scope. Preserve the author's
intent, evidence, uncertainty, temporal context and distinctive voice.
Never invent experiences or decide publication merit.

Draft corresponding FR/EN Markdown or MDX. The same material assertions,
sources, caveats and provenance must be present in both languages; natural
translation is preferable to literal translation. Use a single optional
`rationale` (main Capture) and optional `rationaleContext`, identically
in both locales. A Capture is not mandatory.

For **articles**, create paired `blog/` and `i18n/en/docusaurus-plugin-content-blog/`
files with `draft: true`. For revisions, do not touch published originals:
create a separate FR/EN temporary pair with distinct preview slugs.

For **pages**, prepare paired Markdown candidates in
`.42p/editorial-drafts/pages/fr/<path>.md` and
`.42p/editorial-drafts/pages/en/<path>.md`, with `draft: true`.
Do not place an unapproved page in `src/pages/`. Native pages have no
`unlisted` preview; use a review branch/site for visual approval.
Published pages live under `src/pages/` and
`i18n/en/docusaurus-plugin-content-pages/` after promotion.

Do not change visibility or public canonical files. Any new substantive
argument arising during drafting must be flagged separately in the drafting
handoff. Include it in the FR/EN candidates only after the author validates it.
When a main Capture exists, reconcile the validated argument in that Capture
before verification.

Check meaning, links, assets, FR/EN parity and route intent. Report the
candidate paths, proposed public targets, unresolved points and readiness for
independent `editorial-verify`. Writing grants no publication authority.
