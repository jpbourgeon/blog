# editorial-write

Read `AGENTS.md`, `standards/editorial.md`, `standards/voice.md`, and the
existing content/versions. Read the main Capture when one applies; context
Captures are references, not extensions of its scope. Preserve the author's
intent, evidence, uncertainty, temporal context and distinctive voice.
Never invent experiences or decide publication merit.

## Drafting from established decisions

Before drafting, identify the intended reader, central idea, author's distinctive
perspective and concrete supporting material from the established decisions.
Look for the applicable plan in the content's design directory. Use
`plan.revision.md` for a revision when the author has adopted it. Use the
reference `plan.md` as context for a revision and follow any composition the
author has established for the revised text.

If the author has adopted a plan for the candidate, follow its composition:
the contribution and progression of the sections, the supporting arguments
and the material choices it records. Wording and other nonsubstantive
adjustments remain free. With no adopted plan, compose directly from the
established decisions and sources. Choose how the developments serve the
reader and connect to each other. Preserve validated wording when appropriate.

Draft from this progression, adapting it to the format. Ground the author's
personal perspective in documented reasons, questions, choices and tensions;
do not invent experiences, positions or evidence.

Produce diagrams and charts when requested by established editorial decisions or
the applicable Capture. A Capture records decisions but is not itself an authority,
and its absence does not prevent an established editorial request. Use the site's
existing figure capabilities documented in `docs/figures.md` when available;
verify that the referenced components exist in the current branch. Preserve the
intended meaning, relationships and supporting evidence. Do not introduce
substantive figures or interpretations independently; flag material gaps or
ambiguities for editorial resolution. Do not add new visualization dependencies
without a demonstrated need.

After drafting, revise substantively before handoff:

- Replace interchangeable or generic statements with precise, supported meaning.
- Check that the relationships guiding the composition are expressed in the text
  and develop its purpose, rather than merely joining lists of concepts or values.
- Prefer a relevant, verified concrete example to multiple abstract declarations.
- Remove repetitions and paragraphs without a distinct contribution.
- Check that the text expresses this author's perspective rather than merely
  describing a professional profile.

When the available material only supports listing the author's positions or
interests, and cannot support the intended personal perspective, identify the
missing substance and ask the author for the necessary clarification. Do not
manufacture motivation or fill the gap with generic statements. Likewise, do not
invent unsupported claims or examples; keep the text concise and report any
remaining material limitation in the handoff.

## Source-dependent publication claims

Before handoff, check claims about available site features, published projects,
legal notices and privacy practices against current implementation and available
evidence. Distinguish verified facts, unresolved assertions and future features;
do not present unimplemented features as already available. Report outstanding
publication requirements explicitly rather than silently treating them as met.

Draft corresponding FR/EN Markdown or MDX. The same material assertions,
sources, caveats and provenance must be present in both languages; natural
translation is preferable to literal translation. Use a single optional
`rationale` (main Capture) and optional `rationaleContext`, identically
in both locales. A Capture is not mandatory.

For **articles**, create paired `blog/` and `i18n/en/docusaurus-plugin-content-blog/`
files with `draft: true`. For revisions, do not touch published originals:
create a separate FR/EN temporary pair with distinct preview slugs.

For **pages**, prepare paired Markdown candidates in
`src/drafts/pages/fr/<path>.md` and
`src/drafts/pages/en/<path>.md`, with `draft: true`.
Do not place an unapproved page in `src/pages/`. Native pages have no
`unlisted` preview; use a review branch/site for visual approval.
Published pages live under `src/pages/` and
`i18n/en/docusaurus-plugin-content-pages/` after promotion.
Keep the same relative path for a page revision and provide both canonical
paths in the verification handoff for every revision.

Keep visibility and public canonical files intact. If drafting exposes a need
for a substantive departure from the adopted composition, a new argument or
another change of substance, raise it for the author's decision. Incorporate
the change into the FR/EN candidates only after explicit adoption. Reconcile
the affected plan and Capture where applicable before the independent review.

Check meaning, links, assets, FR/EN parity and route intent. Report the
candidate paths, proposed public targets, unresolved points and readiness for
independent `editorial-verify`. Writing grants no publication authority.
