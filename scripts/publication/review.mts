import {isDeepStrictEqual} from 'node:util';
import {
  type Document, type Fields, type Pair,
  articlePair, documentPath, locales, normalize, pageDraftPair, pagePair,
  project, readDocument, readMarkdown, record, requireThat, sameProvenance,
  sha256, capturePattern, legacyCapturePattern, designRoot, standards,
} from './content.mts';
import {type Snapshot, gitSha} from './git.mts';

type ContentRef = {path: string; content_sha256: string};
type BlobRef = {path: string; git_blob_sha: string};
export type Identities = {
  content: string;
  mode: 'new' | 'revision';
  candidates: Pair<ContentRef>;
  targets: Pair<ContentRef>;
  references: BlobRef[];
  baseline?: Pair<BlobRef>;
};
export type Review = Identities & {result: 'PASS' | 'FAIL' | 'INCONCLUSIVE'};
const legacyReviews = '.42p/editorial-reviews';
const contentPattern = /^(article|page)\/(?:[A-Za-z0-9][A-Za-z0-9._-]*\/)*[A-Za-z0-9][A-Za-z0-9._-]*$/;

function reviewDirectory(content: string) {
  requireThat(contentPattern.test(content), 'Invalid review content identity: ' + content);
  const split = content.indexOf('/');
  return designRoot + '/' + content.slice(0, split) + '_' + encodeURIComponent(content.slice(split + 1));
}

export const reviewPath = (content: string) => reviewDirectory(content) + '/verification.md';
export const revisionReviewPath = (content: string) => reviewDirectory(content) + '/verification.revision.md';
const legacyReviewPath = (content: string, revision = false) =>
  legacyReviews + (revision ? '/revisions/' : '/') + content + '.md';
const authorityNotice = 'Human editorial approval: not granted by this report';

export function pairKey(pair: Pair<string>) {
  const fr = documentPath(pair.fr);
  const en = documentPath(pair.en);
  requireThat(fr?.locale === 'fr' && en?.locale === 'en' && fr.key === en.key &&
    fr.kind === en.kind && fr.source === en.source,
    'Expected paired FR/EN documents: ' + pair.fr + ', ' + pair.en);
  return fr.kind + '/' + fr.source + '/' + fr.key;
}

export async function readPair(tree: Snapshot, paths: Pair<string>): Promise<Pair<Document>> {
  pairKey(paths);
  const [fr, en] = await Promise.all([
    readDocument(tree.read(paths.fr), paths.fr), readDocument(tree.read(paths.en), paths.en),
  ]);
  requireThat(fr.visibility === en.visibility, 'FR/EN visibility differs: ' + fr.path);
  return {fr, en};
}

function exactKeys(value: unknown, keys: string[]): value is Fields {
  return record(value) && isDeepStrictEqual(Object.keys(value).sort(), keys.sort());
}
function checkRef<K extends 'content_sha256' | 'git_blob_sha'>(value: unknown, key: K):
  value is {path: string} & Record<K, string> {
  return exactKeys(value, ['path', key]) && typeof value.path === 'string' && typeof value[key] === 'string' &&
    (key === 'git_blob_sha' ? gitSha : /^[0-9a-f]{64}$/).test(value[key]);
}
function checkPair<K extends 'content_sha256' | 'git_blob_sha'>(value: unknown, key: K):
  value is Pair<{path: string} & Record<K, string>> {
  if (!exactKeys(value, [...locales]) || !checkRef(value.fr, key) || !checkRef(value.en, key)) return false;
  pairKey({fr: value.fr.path, en: value.en.path});
  return true;
}

export async function readReview(tree: Snapshot, path: string, historical = false): Promise<Review> {
  const {fields, body} = await readMarkdown(tree.read(path), path);
  const revision = fields.mode === 'revision';
  requireThat(exactKeys(fields, ['content', 'mode', 'candidates', 'targets', 'references', 'result',
    ...(revision ? ['baseline'] : [])]) &&
    (revision || fields.mode === 'new') && typeof fields.content === 'string' &&
    contentPattern.test(fields.content) &&
    (reviewPath(fields.content) === path || (revision && revisionReviewPath(fields.content) === path) ||
      (historical && (legacyReviewPath(fields.content) === path ||
        (revision && legacyReviewPath(fields.content, true) === path)))) &&
    ['PASS', 'FAIL', 'INCONCLUSIVE'].includes(fields.result as string) &&
    checkPair(fields.candidates, 'content_sha256') &&
    checkPair(fields.targets, 'content_sha256') &&
    (!revision || checkPair(fields.baseline, 'git_blob_sha')) &&
    Array.isArray(fields.references) &&
    fields.references.every(ref => checkRef(ref, 'git_blob_sha')) &&
    body.includes(authorityNotice), 'Invalid editorial report: ' + path);
  const report = fields as Review;
  const refPaths = report.references.map(ref => ref.path);
  requireThat(standards.every(path => refPaths.includes(path)) &&
    refPaths.length <= 3 && new Set(refPaths).size === refPaths.length &&
    refPaths.every(path => standards.includes(path) || capturePattern.test(path) || legacyCapturePattern.test(path)),
    'Invalid normative references: ' + path);
  const targetKind = documentPath(report.targets.fr.path)?.kind;
  requireThat(targetKind && report.content.startsWith(targetKind + '/'),
    'Report kind differs from target: ' + path);
  for (const locale of locales) {
    if (revision) {
      requireThat(report.candidates[locale].path !== report.targets[locale].path &&
        report.baseline?.[locale].path === report.targets[locale].path,
        'Invalid revision projection: ' + path);
    }
  }
  return report;
}
export function refPaths(pair: Pair<{path: string}>): Pair<string> {
  return {fr: pair.fr.path, en: pair.en.path};
}
export function canonicalSlug(doc: Document) {
  return doc.route.slice(doc.locale === 'en' ? '/blog/en/'.length : '/blog/'.length, -1);
}

export async function checkProvenance(tree: Snapshot, pair: Pair<Document>, historical = false) {
  const provenance = sameProvenance(pair, historical);
  for (const path of [provenance.main, ...(provenance.context ?? [])]) {
    if (path) tree.requireBlob(path);
  }
  return provenance;
}

export async function identities(tree: Snapshot, candidatePaths: Pair<string>, baselinePaths?: Pair<string>) {
  const candidates = await readPair(tree, candidatePaths);
  requireThat(candidates.fr.visibility !== 'public', 'Candidate is already public');
  const {main} = await checkProvenance(tree, candidates);
  const baseline = baselinePaths && await readPair(tree, baselinePaths);
  if (baseline) {
    requireThat(baseline.fr.visibility === 'public' && baseline.fr.kind === candidates.fr.kind,
      'Revision requires a published baseline of the same kind');
    await checkProvenance(tree, baseline);
  }
  const projected = {} as Pair<{path: string; bytes: Buffer; document: Document}>;
  for (const locale of locales) {
    const candidate = candidates[locale];
    const target = project(candidate, baseline?.[locale]);
    requireThat(baseline || target.path === candidate.path || !tree.blob(target.path),
      'Existing canonical content requires a revision baseline: ' + target.path);
    const document = await readDocument(target.bytes, target.path);
    requireThat(document.visibility === 'public' && document.kind === candidate.kind &&
      document.route === (baseline?.[locale] ?? candidate).route,
      'Projection changes the canonical route: ' + target.path);
    const expected = {...candidate.fields};
    delete expected.draft;
    delete expected.unlisted;
    if (baseline && candidate.kind === 'article') {
      if (Object.hasOwn(baseline[locale].fields, 'slug')) expected.slug = baseline[locale].fields.slug;
      else delete expected.slug;
    }
    requireThat(isDeepStrictEqual(document.fields, expected) && document.body === candidate.body,
      'Projection is not lossless: ' + target.path);
    projected[locale] = {...target, document};
  }
  const ref = (path: string): BlobRef => ({path, git_blob_sha: tree.requireBlob(path)});
  const norm = (doc: Document): ContentRef => ({path: doc.path, content_sha256: sha256(normalize(doc))});
  const data: Identities = {
    content: projected.fr.document.kind + '/' + canonicalSlug(projected.fr.document),
    mode: baseline ? 'revision' : 'new',
    candidates: {fr: norm(candidates.fr), en: norm(candidates.en)},
    targets: {fr: norm(projected.fr.document), en: norm(projected.en.document)},
    references: [...standards, ...(main ? [main] : [])].map(ref),
    ...(baselinePaths && {baseline: {fr: ref(baselinePaths.fr), en: ref(baselinePaths.en)}}),
  };
  return {data, projected};
}

export function matchReview(review: Review, data: Identities): void {
  const {result, ...recorded} = review;
  const sortRefs = (refs: BlobRef[]) => [...refs].sort((a, b) => a.path.localeCompare(b.path));
  requireThat(isDeepStrictEqual({...recorded, references: sortRefs(recorded.references)},
    {...data, references: sortRefs(data.references)}),
    'Stale or inapplicable editorial report: ' + data.content);
}

export async function inventory(tree: Snapshot, pending?: Identities, historical = false) {
  const pairs = new Map<string, Pair<Document>>();
  const roots = ['blog', 'i18n/en/docusaurus-plugin-content-blog', 'src/pages',
    'i18n/en/docusaurus-plugin-content-pages', 'src/drafts/pages'];
  for (const path of tree.paths(...roots)) {
    const id = documentPath(path);
    if (!id || id.locale !== 'fr') continue;
    const paths = id.kind === 'article' ? articlePair(id.key) :
      id.source === 'candidate' ? pageDraftPair(id.key) : pagePair(id.key);
    const key = pairKey(paths);
    requireThat(!pairs.has(key), 'Duplicate content pair: ' + key);
    const pair = await readPair(tree, paths);
    await checkProvenance(tree, pair, historical);
    pairs.set(key, pair);
  }
  // Also reject orphan English translations.
  for (const path of tree.paths(...roots)) {
    const id = documentPath(path);
    if (id?.locale === 'en') {
      const paths = id.kind === 'article' ? articlePair(id.key) :
        id.source === 'candidate' ? pageDraftPair(id.key) : pagePair(id.key);
      requireThat(pairs.has(pairKey(paths)), 'Orphan English document: ' + path);
    }
  }
  const routes = new Set<string>();
  for (const pair of pairs.values()) {
    if (pair.fr.visibility === 'draft') continue;
    for (const doc of [pair.fr, pair.en]) {
      requireThat(!routes.has(doc.route.toLowerCase()), 'Duplicate published route: ' + doc.route);
      routes.add(doc.route.toLowerCase());
    }
  }
  const revisions = new Map<string, string>();
  function bindRevision(review: Identities) {
    if (!review.baseline) return;
    const candidate = pairKey(refPaths(review.candidates));
    const target = pairKey(refPaths(review.baseline));
    const draft = pairs.get(candidate)?.fr;
    const published = pairs.get(target)?.fr;
    if (!draft || draft.visibility === 'public' || published?.visibility !== 'public' ||
        draft.kind !== published.kind || review.content !== published.kind + '/' + canonicalSlug(published)) return;
    requireThat(!revisions.has(candidate) || revisions.get(candidate) === target,
      'Conflicting revision baselines: ' + draft.path);
    revisions.set(candidate, target);
  }
  const reports = tree.paths(designRoot).filter(path => /\/verification(?:\.revision)?\.md$/.test(path));
  if (historical) reports.push(...tree.paths(legacyReviews));
  for (const path of reports) {
    const review = await readReview(tree, path, historical);
    if (path === revisionReviewPath(review.content) ||
        (historical && path === legacyReviewPath(review.content, true))) bindRevision(review);
  }
  if (pending) bindRevision(pending);
  const owners = new Map<string, string>();
  for (const [key, pair] of pairs) {
    const {main} = await checkProvenance(tree, pair, historical);
    if (!main) continue;
    const pageBaseline = pair.fr.source === 'candidate' ? pairKey(pagePair(pair.fr.key)) : undefined;
    const owner = revisions.get(key) ??
      (pageBaseline && pairs.has(pageBaseline) ? pageBaseline : key);
    requireThat(!owners.has(main) || owners.get(main) === owner,
      'Main Capture belongs to multiple contents or an unbound revision: ' + main);
    owners.set(main, owner);
  }
  return pairs;
}
