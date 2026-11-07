import {
  type Document, articlePair, documentPath, locales, normalize, pagePair,
  readDocument, requireThat, sha256,
} from './content.mts';
import {type Snapshot} from './git.mts';
import {canonicalSlug, identities, inventory, matchReview, readPair, readReview, refPaths, reviewPath} from './review.mts';

async function at(tree: Snapshot, path: string) {
  return tree.blob(path) ? readDocument(tree.read(path), path) : undefined;
}
function sourcePair(document: {kind: string; key: string}) {
  return document.kind === 'article' ? articlePair(document.key) : pagePair(document.key);
}
async function verifyPromotion(target: Snapshot, parent: Snapshot, published: Document) {
  const location = reviewPath(published.kind + '/' + canonicalSlug(published));
  const report = await readReview(target, location);
  requireThat(report.result === 'PASS', 'No PASS for publication: ' + location);
  requireThat(target.blob(location) === parent.blob(location),
    'PASS must be committed before promotion: ' + location);

  const {data, projected} = await identities(parent, refPaths(report.candidates),
    report.baseline && refPaths(report.baseline));
  matchReview(report, data);
  requireThat(report.targets.fr.path === (published.locale === 'fr' ? published.path :
    sourcePair(published).fr), 'Report belongs to another target');
  for (const ref of report.references) {
    requireThat(target.blob(ref.path) === ref.git_blob_sha,
      'Normative reference changed during promotion: ' + ref.path);
  }
  for (const locale of locales) {
    const result = projected[locale];
    const actual = await readDocument(target.read(result.path), result.path);
    requireThat(actual.visibility === 'public' && actual.route === result.document.route &&
      sha256(normalize(actual)) === report.targets[locale].content_sha256,
      'Published contents differ from the verified projection: ' + result.path);
    const candidate = report.candidates[locale].path;
    if (candidate !== result.path) {
      requireThat(target.blob(candidate) === undefined && target.read(result.path).equals(result.bytes),
        'Promotion must remove temporary candidates and write exact approved bytes: ' + candidate);
    } else {
      const before = await at(parent, candidate);
      requireThat(before?.visibility !== 'public', 'Initial publication must start from a draft or preview');
    }
  }
  return {report, location};
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
  const latest = new Map<string, {report: Awaited<ReturnType<typeof verifyPromotion>>; commit: Snapshot}>();
  let parent = deployed;
  const classification: string[] = [];
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
          const verified = await verifyPromotion(commit, parent, after.fr);
          latest.set(verified.report.content, {report: verified, commit});
          classification.push('Verified ' + verified.report.content);
        }
      } else if (before?.fr.visibility === 'public') {
        requireThat(id.kind === 'page' && !after,
          'Public article withdrawal or unpaired page removal requires a separate decision');
        classification.push('Removed permanent page: ' + id.key);
      } else if (after?.fr.visibility === 'unlisted') {
        classification.push('Unlisted preview: ' + id.key);
      }
    }
    parent = commit;
  }
  for (const {report: verification, commit} of latest.values()) {
    const {report, location} = verification;
    requireThat(target.blob(location) === commit.blob(location),
      'Editorial PASS changed after promotion: ' + location);
    for (const ref of report.references) {
      requireThat(target.blob(ref.path) === ref.git_blob_sha,
        'Normative reference changed after verification: ' + ref.path);
    }
    for (const locale of locales) {
      requireThat(target.blob(report.targets[locale].path) === commit.blob(report.targets[locale].path),
        'Canonical content changed after promotion: ' + report.targets[locale].path);
    }
  }
  return classification.length ? classification : ['Technical or draft-only changes'];
}
