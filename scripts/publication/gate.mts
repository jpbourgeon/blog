import {
  type Document, articlePair, documentPath, locales, normalize, pagePair,
  readDocument, readMarkdown, record, requireThat, sha256,
} from './content.mts';
import {type Snapshot, gitSha} from './git.mts';
import {canonicalSlug, inventory, readPair, readReview, reviewPath} from './review.mts';

function sourcePair(document: {kind: string; key: string}) {
  return document.kind === 'article' ? articlePair(document.key) : pagePair(document.key);
}

// Squash & merge deliberately collapses review and promotion into one main
// commit. The gate binds that commit to the exact independently reviewed
// published bytes; editorial approval occurs before merge, outside this gate.
async function verifyPromotion(commit: Snapshot, parent: Snapshot, published: Document, previous?: Document) {
  const location = reviewPath(published.kind + '/' + canonicalSlug(published));
  const report = await readReview(commit, location);
  requireThat(report.result === 'PASS', 'No PASS for publication: ' + location);
  requireThat(report.mode === (previous?.visibility === 'public' ? 'revision' : 'new'),
    'Editorial report mode differs from published transition: ' + location);

  const paths = sourcePair(published);
  for (const locale of locales) {
    const path = paths[locale];
    requireThat(report.targets[locale].path === path &&
      sha256(normalize(await readDocument(commit.read(path), path))) === report.targets[locale].content_sha256,
      'Published content differs from verified target: ' + path);
    if (report.mode === 'revision') {
      requireThat(report.baseline?.[locale].path === path &&
        parent.blob(path) === report.baseline[locale].git_blob_sha,
        'Revision baseline differs from last published content: ' + path);
    } else {
      requireThat(!report.baseline, 'Initial publication must not bind a published baseline');
    }
    const candidate = report.candidates[locale].path;
    // Check the actual candidate whenever its pre-promotion Git state survives
    // in the history. Squash commits legitimately omit this temporary file.
    if (parent.blob(candidate)) {
      const prepared = await readDocument(parent.read(candidate), candidate);
      requireThat(sha256(normalize(prepared)) === report.candidates[locale].content_sha256,
        'Candidate changed after independent verification: ' + candidate);
    }
    if (candidate !== path) {
      requireThat(commit.blob(candidate) === undefined,
        'Temporary candidate left in publication: ' + candidate);
    }
  }
  if (previous?.visibility === 'public') {
    requireThat(previous.route === published.route, 'Public revision changes its canonical route');
  }
  for (const ref of report.references) {
    requireThat(commit.blob(ref.path) === ref.git_blob_sha,
      'Editorial standard or main Capture differs from verified reference: ' + ref.path);
  }
  return {location, reportSha: commit.requireBlob(location), references: report.references};
}

async function verifyRemoval(commit: Snapshot, parent: Snapshot, paths: {fr: string; en: string}, key: string) {
  const path = reviewPath('page/' + key.replace(/\.mdx?$/, '') + '.removal');
  const {fields, body} = await readMarkdown(commit.read(path), path);
  requireThat(Object.keys(fields).sort().join(',') === 'action,baseline,reason,result' &&
    fields.action === 'remove' && fields.result === 'PASS' &&
    typeof fields.reason === 'string' && fields.reason.trim().length >= 10 &&
    body.includes('Human editorial approval: not granted by this report') &&
    record(fields.baseline) && Object.keys(fields.baseline).sort().join(',') === 'en,fr',
    'Invalid page withdrawal report: ' + path);
  const baseline = fields.baseline as {fr: string; en: string};
  for (const locale of locales) {
    requireThat(gitSha.test(baseline[locale]) &&
      parent.blob(paths[locale]) === baseline[locale] &&
      commit.blob(paths[locale]) === undefined,
      'Removed page does not match reviewed FR/EN baseline: ' + paths[locale]);
  }
  return 'Reviewed page withdrawal: ' + key;
}

export async function plan(target: Snapshot, deployed?: Snapshot) {
  const pairs = await inventory(target);
  if (!deployed) {
    requireThat(![...pairs.values()].some(pair =>
      pair.fr.kind === 'article' && pair.fr.visibility === 'public'),
      'Initial deployment requires a baseline before publishing public articles');
    return ['Initial exposure: explicit human authorization required'];
  }
  await inventory(deployed);
  let parent = deployed;
  const classification: string[] = [];
  const promoted: {location: string; reportSha: string; references: {path: string; git_blob_sha: string}[]}[] = [];

  for (const sha of target.repo.firstParentRange(deployed.commit, target.commit)) {
    const commit = target.repo.tree(sha);
    const changed = target.repo.changed(parent.commit, commit.commit);
    const affected = new Map<string, ReturnType<typeof documentPath>>();
    for (const path of changed) {
      const id = documentPath(path);
      if (id && (id.kind === 'article' || id.source === 'canonical')) {
        affected.set(id.kind + ':' + id.key, id);
      }
    }
    for (const id of affected.values()) {
      if (!id) continue;
      const paths = sourcePair(id);
      const before = parent.blob(paths.fr) || parent.blob(paths.en) ? await readPair(parent, paths) : undefined;
      const after = commit.blob(paths.fr) || commit.blob(paths.en) ? await readPair(commit, paths) : undefined;
      if (after?.fr.visibility === 'public') {
        const changedPublic = !before || before.fr.visibility !== 'public' ||
          locales.some(locale => parent.blob(paths[locale]) !== commit.blob(paths[locale]));
        if (changedPublic) {
          promoted.push(await verifyPromotion(commit, parent, after.fr, before?.fr));
          classification.push('Verified ' + after.fr.kind + '/' + canonicalSlug(after.fr));
        }
      } else if (before?.fr.visibility === 'public') {
        requireThat(id.kind === 'page' && !after,
          'Public article withdrawal or partial page removal requires a separate decision');
        classification.push(await verifyRemoval(commit, parent, paths, id.key));
      } else if (after?.fr.visibility === 'unlisted') {
        classification.push('Unlisted preview: ' + id.key);
      }
    }
    parent = commit;
  }

  for (const proof of promoted) {
    requireThat(target.blob(proof.location) === proof.reportSha,
      'Editorial PASS changed after publication: ' + proof.location);
    for (const ref of proof.references) {
      requireThat(target.blob(ref.path) === ref.git_blob_sha,
        'Normative reference changed after publication: ' + ref.path);
    }
  }
  return classification.length ? classification : ['Technical or draft-only changes'];
}
