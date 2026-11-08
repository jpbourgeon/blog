import {isDeepStrictEqual} from 'node:util';
import {
  type Document, type Fields, type Kind, type Locale, type Pair,
  articlePair, documentPath, locales, normalize, pageDraftPair, pagePair,
  project, readDocument, readMarkdown, record, requireThat, sameProvenance,
  sha256, capturePattern, standards,
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
export const reviewsDir = '.42p/editorial-reviews/';
export const reviewPath = (content: string) => reviewsDir + content + '.md';
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

export async function readReview(tree: Snapshot, path: string): Promise<Review> {
  requireThat(/^\.42p\/editorial-reviews\/(article|page)\/(?:[A-Za-z0-9][A-Za-z0-9._-]*\/)*[A-Za-z0-9][A-Za-z0-9._-]*\.md$/.test(path),
    'Invalid review location: ' + path);
  const {fields, body} = await readMarkdown(tree.read(path), path);
  const revision = fields.mode === 'revision';
  requireThat(exactKeys(fields, ['content', 'mode', 'candidates', 'targets', 'references', 'result',
    ...(revision ? ['baseline'] : [])]) &&
    (revision || fields.mode === 'new') && typeof fields.content === 'string' &&
    reviewPath(fields.content) === path &&
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
    refPaths.every(path => standards.includes(path) || capturePattern.test(path)),
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

export async function checkProvenance(tree: Snapshot, pair: Pair<Document>) {
  const provenance = sameProvenance(pair);
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

export async function inventory(tree: Snapshot) {
  const pairs = new Map<string, Pair<Document>>();
  const roots = ['blog', 'i18n/en/docusaurus-plugin-content-blog', 'src/pages',
    'i18n/en/docusaurus-plugin-content-pages', '.42p/editorial-drafts/pages'];
  for (const path of tree.paths(...roots)) {
    const id = documentPath(path);
    if (!id || id.locale !== 'fr') continue;
    const paths = id.kind === 'article' ? articlePair(id.key) :
      id.source === 'candidate' ? pageDraftPair(id.key) : pagePair(id.key);
    const key = pairKey(paths);
    requireThat(!pairs.has(key), 'Duplicate content pair: ' + key);
    const pair = await readPair(tree, paths);
    await checkProvenance(tree, pair);
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
  for (const path of tree.paths(reviewsDir.slice(0, -1))) {
    const review = await readReview(tree, path);
    if (!review.baseline) continue;
    const candidate = pairKey(refPaths(review.candidates));
    const target = pairKey(refPaths(review.baseline));
    if (pairs.has(candidate) && pairs.has(target)) revisions.set(candidate, target);
  }
  const owners = new Map<string, string>();
  for (const [key, pair] of pairs) {
    const {main} = await checkProvenance(tree, pair);
    if (!main) continue;
    const owner = revisions.get(key) ?? key;
    requireThat(!owners.has(main) || owners.get(main) === owner,
      'Main Capture belongs to multiple contents or an unbound revision: ' + main);
    owners.set(main, owner);
  }
  return pairs;
}
