# editorial-publish

Read `AGENTS.md` and the actual site and Git state. Identify the requested
operation and follow its prerequisites below. Never equate PASS with consent.

## Canonical publication or revision

For pages and articles, read the exact FR/EN candidates, the matching editorial
report and the author's **explicit** publication decision. Require a previously
committed, unchanged, matching PASS. From a clean commit:

```sh
npm run publication -- check <report>
npm run publication -- project <report>
```

After authorization, write the projected FR/EN canonical bytes and remove
temporary candidates **in one commit**. Never repair or compose editorial
prose during promotion. Any necessary correction returns to writing and
independent verification.

## Previews

For article previews, `draft` → `unlisted` requires separate explicit
permission; unlisted is public by URL, not secret. Pages have no native
unlisted state: review on an isolated branch without promoting to public routes.
Do not change public page files just to preview them.

## Public deployment

Publication is a distinct manual `workflow_dispatch` on `main`, targeting
the exact commit SHA. `inspect` validates without exposure, `publish`
runs the independent gate, builds and deploys through GitHub Pages. A PR
may contain several contents, and one dispatch may deploy changes from
several PRs. Each content keeps its own PASS; explicit human authorization
must cover the exact set of public changes since the last deployment.
Merging a PR does not itself grant editorial publication approval. No push
or PR may deploy. Confirm the CI and Pages outcome before reporting a live URL.

## Withdrawal and deletion

To withdraw any deployed exposed content (`public` or `unlisted`), obtain explicit author approval
for the visibility change and include it in the manual deployment decision.
Articles become `draft: true` in both locales; move page files to their FR/EN
off-site drafts with `draft: true`. Do not delete a publicly deployed item in
the same deployment. After the withdrawn state has been deployed, the document
pair and any unshared rationale-unit or resources may be deleted without a
separate editorial PASS or deletion report. Never delete shared references.
`unlisted` remains publicly accessible and is not a withdrawal.
