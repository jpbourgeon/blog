---
name: editorial-publish
description: Apply the authorized draft, unlisted-preview, or public publication mode to paired FR/EN Docusaurus articles and perform the necessary Git/deployment operations. Use when asked to change article visibility, preview, publish, or withdraw; require appropriate author permission and verification.
---

# editorial-publish

Perform only mechanical publication operations for an identified article and target mode: `draft`, `unlisted`, or `public`. No invocation implicitly grants editorial authority.

1. Read `AGENTS.md`, the actual Docusaurus configuration, deployment workflow, current article files and their French/English counterparts. Resolve the actual default locale and file layout; do not guess project setup, URLs, branch triggers, deployment behavior, or existing publication state. Stop any unsupported deployment operation rather than inventing infrastructure.
2. Bind one article, its paired locales, the requested target mode, and the exact version being authorized. Check any applicable `.42p/editorial-reviews/<article-slug>.md` report and its examined identities; do not reuse a stale verification as proof for modified content.
3. Apply native Docusaurus frontmatter consistently to both locales:
   - `draft`: set `draft: true` and remove `unlisted`; excluded from production publication. Author approval for public exposure is not needed.
   - `unlisted`: remove `draft` (or set false) and set `unlisted: true`. This creates a publicly accessible, URL-discoverable preview, **not access control**. Require explicit authorization to expose this candidate for preview; it is not final public approval. Report any review defects or limits, without claiming a final verification pass is required merely to preview.
   - `public`: remove both `draft` and `unlisted` (or set false). Require an overall `PASS` editorial review covering the current FR/EN content and applicable sources, plus explicit human approval of that specific content and public publication. Neither silence, a previous article approval, nor an agent report supplies permission.
4. Do not make substantive edits, resolve editorial questions, or change wording during this operation. If authoring or verification becomes necessary, stop and delegate that distinct work. Preserve other frontmatter, rationale links, dates and identifiers except when the authorized operation explicitly requires a correction.
5. Commit the paired visibility changes together, then use only the repository's configured and authorized GitHub Pages workflow. Avoid separate per-locale deployments and unrelated work. A change on a branch does not prove the live site changed. If the path to deployment or required permission is unresolved, prepare the permissible repository changes and report the blocker without implying publication.
6. Check that the resulting files have the intended metadata, the localized site can be built when tooling is available, and deployment/URLs can be verified when infrastructure permits. Report separately: files committed, branch/PR status, CI status, deployed mode and accessible URLs **only if observed**. Never claim a site is live merely because a commit or workflow succeeded.

Use Git history for the audit trail. Do not introduce a new publication database, approval token, or custom preview system.
