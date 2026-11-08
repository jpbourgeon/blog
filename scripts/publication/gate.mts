import {
  type Document, articlePair, locales, normalize, pagePair,
  readDocument, requireThat, sha256,
} from './content.mts';
import {type Snapshot} from './git.mts';
import {canonicalSlug, inventory, readReview, reviewPath} from './review.mts';

function sourcePair(document: {kind: string; key: string}) {
  return document.kind === 'article' ? articlePair(document.key) : pagePair(document.key);
}

// Publication validity belongs to the target commit, never to intermediate
// editorial commits. A PASS is bound to the exact public FR/EN projection.
async function verifyPublished(target: Snapshot, published: Document) {
  const location = reviewPath(published.kind + '/' + canonicalSlug(published));
  const report = await readReview(target, location);
  requireThat(report.result === 'PASS', 'No PASS for publication: ' + location);
  const paths = sourcePair(published);
  for (const locale of locales) {
    const path = paths[locale];
    const actual = await readDocument(target.read(path), path);
    requireThat(actual.visibility === 'public' && report.targets[locale].path === path &&
      sha256(normalize(actual)) === report.targets[locale].content_sha256,
      'Published content differs from verified target: ' + path);
    const candidate = report.candidates[locale].path;
    if (candidate !== path) {
      requireThat(target.blob(candidate) === undefined,
        'Temporary candidate left in publication: ' + candidate);
    }
  }
  for (const ref of report.references) {
    requireThat(target.blob(ref.path) === ref.git_blob_sha,
      'Normative reference differs from verified evidence: ' + ref.path);
  }
  return location;
}

export async function plan(target: Snapshot, deployed?: Snapshot) {
  const current = await inventory(target);
  if (deployed) await inventory(deployed);

  const classification: string[] = [];
  const present = new Set<string>();
  for (const pair of current.values()) {
    const published = pair.fr;
    if (published.source !== 'canonical' || published.visibility !== 'public') continue;
    const paths = sourcePair(published);
    present.add(published.kind + ':' + published.key);
    const location = reviewPath(published.kind + '/' + canonicalSlug(published));

    if (!target.blob(location)) {
      // Only unchanged pages from an actual prior deployment may remain unsealed.
      // First publication follows the ordinary PASS protocol for every public page.
      requireThat(published.kind === 'page' && deployed &&
        locales.every(locale => target.blob(paths[locale]) === deployed.blob(paths[locale])),
        'Unsealed published content: ' + location);
    } else {
      await verifyPublished(target, published);
    }
    if (deployed && published.kind === 'article' &&
        locales.every(locale => deployed.blob(paths[locale]) !== undefined)) {
      for (const locale of locales) {
        const previous = await readDocument(deployed.read(paths[locale]), paths[locale]);
        const currentArticle = pair[locale];
        requireThat(previous.visibility !== 'public' || previous.route === currentArticle.route,
          'Public article route changed: ' + paths[locale]);
      }
    }
    if (!deployed || locales.some(locale => deployed.blob(paths[locale]) !== target.blob(paths[locale]))) {
      classification.push('Public ' + published.kind + '/' + canonicalSlug(published));
    }
  }

  // The differential is informative except for withdrawals, where the
  // identity of the last deployed bytes is required to prove authorization.
  if (deployed) {
    const baseline = await inventory(deployed);
    for (const pair of baseline.values()) {
      const previous = pair.fr;
      if (previous.source !== 'canonical' || previous.visibility !== 'public') continue;
      const key = previous.kind + ':' + previous.key;
      if (present.has(key)) continue;
      const paths = sourcePair(previous);
      // Withdraw first, deploy the non-public state, then delete later.
      // Pages use an off-site draft pair; articles use draft: true in place.
      const withdrawn = previous.kind === 'article'
        ? current.get('article/canonical/' + previous.key)
        : current.get('page/candidate/' + previous.key);
      requireThat(withdrawn?.fr.visibility === 'draft' &&
        withdrawn.en.visibility === 'draft' &&
        (previous.kind !== 'page' || locales.every(locale => target.blob(paths[locale]) === undefined)),
        'Public content must be withdrawn before deletion: ' + key);
      classification.push('Withdrawn ' + previous.kind + '/' + canonicalSlug(previous));
    }
    // Preview entries are reported only; a preview is publicly reachable by
    // its URL and must be separately authorized before deployment.
    for (const pair of current.values()) {
      if (pair.fr.kind !== 'article' || pair.fr.visibility !== 'unlisted') continue;
      const paths = sourcePair(pair.fr);
      if (locales.some(locale => target.blob(paths[locale]) !== deployed.blob(paths[locale]))) {
        classification.push('Unlisted preview: ' + pair.fr.key);
      }
    }
  }
  return classification.length ? classification : ['No public content changes'];
}
