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
  const baseline = deployed ? await inventory(deployed) : undefined;

  const classification: string[] = [];
  const exposed = new Set<string>();
  for (const [identity, pair] of current) {
    const document = pair.fr;
    if (document.source !== 'canonical' || document.visibility === 'draft') continue;
    exposed.add(identity);
    const paths = sourcePair(document);

    if (document.visibility === 'public') {
      await verifyPublished(target, document);
    }

    if (document.kind === 'article') {
      const previous = baseline?.get(identity);
      if (previous && previous.fr.visibility !== 'draft') {
        for (const locale of locales) {
          requireThat(previous[locale].route === pair[locale].route,
            'Exposed article route changed: ' + paths[locale]);
        }
      }
    }

    if (!deployed || locales.some(locale => deployed.blob(paths[locale]) !== target.blob(paths[locale]))) {
      classification.push(document.visibility === 'unlisted'
        ? 'Unlisted preview: ' + document.key
        : 'Public ' + document.kind + '/' + canonicalSlug(document));
    }
  }

  if (baseline) {
    for (const [identity, pair] of baseline) {
      const previous = pair.fr;
      if (previous.source !== 'canonical' || previous.visibility === 'draft') continue;
      if (exposed.has(identity)) continue;
      const paths = sourcePair(previous);
      // Removal from a deployed site requires a non-exposed, still-present
      // draft in the target. Only a subsequent deployment can delete it.
      const withdrawn = previous.kind === 'article'
        ? current.get(identity)
        : current.get('page/candidate/' + previous.key);
      requireThat(withdrawn?.fr.visibility === 'draft' &&
        withdrawn.en.visibility === 'draft' &&
        (previous.kind !== 'page' || locales.every(locale => target.blob(paths[locale]) === undefined)),
        'Exposed content must be withdrawn before deletion: ' + identity);
      classification.push('Withdrawn ' + previous.kind + '/' + canonicalSlug(previous));
    }
  }
  return classification.length ? classification : ['No public content changes'];
}
