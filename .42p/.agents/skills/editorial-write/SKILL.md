# editorial-write

Read `AGENTS.md`, `standards/editorial.md`, `standards/voice.md`, and the
existing content/versions. Read the main Capture when one applies; context
Captures are references, not extensions of its scope. Preserve the author's
intent, evidence, uncertainty, temporal context and distinctive voice.
Never invent experiences or decide publication merit.

## Editorial composition

Before drafting, identify the intended reader, central idea, author's distinctive
perspective and concrete supporting material. Determine what the reader should
understand and how the developments lead there. Treat source material as content
to compose, not a sequence to reproduce: covering the topics does not by itself
develop the intended meaning.

Respect the author's established structural decisions. When a plan is indicative,
choose the order and relationships that best serve the text's purpose. When the
structure is prescribed, build the progression within it; if that structure
prevents satisfactory composition, propose an adjustment to the author before
departing from it. Preserve validated wording when appropriate, without
mechanically following Capture headings, topic inventories or indicative lengths.

Draft from this progression, adapting it to the format rather than imposing a
universal argumentative plan or artificial transitions. Ground the author's
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

Do not change visibility or public canonical files. Any new substantive
argument arising during drafting must be flagged separately in the drafting
handoff. Include it in the FR/EN candidates only after the author validates it.
When a main Capture exists, reconcile the validated argument in that Capture
before verification.

Check meaning, links, assets, FR/EN parity and route intent. Report the
candidate paths, proposed public targets, unresolved points and readiness for
independent `editorial-verify`. Writing grants no publication authority.
