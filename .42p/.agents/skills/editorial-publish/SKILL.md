# editorial-publish

Read `AGENTS.md`, the actual site and Git state, the exact FR/EN candidates,
the matching editorial report and the author's **explicit** publication decision.
The same procedure applies to pages and articles. Never equate PASS with consent.

For a canonical publication or revision, require a previously committed,
unchanged, matching PASS. From a clean commit:

```sh
npm run publication -- check <report>
npm run publication -- project <report>
```

After authorization, write the projected FR/EN canonical bytes and remove
temporary candidates **in one commit**. Never repair or compose editorial
prose during promotion. Any necessary correction returns to writing and
independent verification.

For article previews, `draft` → `unlisted` requires separate explicit
permission; unlisted is public by URL, not secret. Pages have no native
unlisted state: review on an isolated branch without promoting to public routes.
Do not change public page files just to preview them.

Publication is a distinct manual `workflow_dispatch` on `main`, targeting
the exact commit SHA. `inspect` validates without exposure, `publish`
runs the independent gate, builds and deploys through GitHub Pages. No push
or PR may publish. Confirm the CI and Pages outcome before reporting a live URL.

A permanent-page withdrawal requires an explicit author decision and a
versioned report at `.42p/editorial-reviews/page/<slug>.removal.md`:
`action: remove`, `result: PASS`, `reason` (substantive explanation), and
`baseline: {fr: <published Git blob SHA>, en: <published Git blob SHA>}`.
The report body must include `Human editorial approval: not granted by this report`.
Review and approve the report **before merging the PR**. Squash & merge puts
report and withdrawal in one authoritative commit; the gate binds both
removed FR/EN Git blobs to that report. PASS is not human publication consent.
