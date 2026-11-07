import {isDeepStrictEqual} from 'node:util';
import {
  type Article, type Fields, type Locale, type Pair, articlePair, articlePath, capturePattern,
  locales, normalize, project, readArticle, readMarkdown, record, requireThat, sameProvenance,
  sha256, standards,
} from './content.mts';
import {type Snapshot, gitSha} from './git.mts';

type ContentRef = {path: string; content_sha256: string};
type BlobRef = {path: string; git_blob_sha: string};
export type Identities = {
  article: string;
  mode: 'new' | 'revision';
  candidates: Pair<ContentRef>;
  targets: Pair<ContentRef>;
  references: BlobRef[];
  baseline?: Pair<BlobRef>;
};
export type Review = Identities & {result: 'PASS' | 'FAIL' | 'INCONCLUSIVE'};
export const reviewsDir = '.42p/editorial-reviews/';
export const reviewPath = (article: string) => `${reviewsDir}${article}.md`;

export async function mapPair<A, B>(pair: Pair<A>, fn: (item: A, locale: Locale) => Promise<B>): Promise<Pair<B>> {
  const [fr, en] = await Promise.all([fn(pair.fr, 'fr'), fn(pair.en, 'en')]);
  return {fr, en};
}

export function pairKey(pair: Pair<string>): string {
  const fr = articlePath(pair.fr);
  const en = articlePath(pair.en);
  requireThat(fr?.locale === 'fr' && en?.locale === 'en' && fr.key === en.key,
    `Expected one native FR/EN source pair: ${pair.fr}, ${pair.en}`);
  return fr.key;
}

export async function readPair(tree: Snapshot, paths: Pair<string>): Promise<Pair<Article>> {
  pairKey(paths);
  const pair = await mapPair(paths, async path => readArticle(tree.read(path), path));
  requireThat(pair.fr.visibility === pair.en.visibility, `FR/EN visibility differs for ${pair.fr.path}`);
  return pair;
}

function exactKeys(value: unknown, keys: string[]): value is Fields {
  return record(value) && isDeepStrictEqual(Object.keys(value).sort(), keys.sort());
}

function checkRefs<K extends 'content_sha256' | 'git_blob_sha'>(value: unknown, key: K):
  value is {path: string} & Record<K, string> {
  return exactKeys(value, ['path', key]) && typeof value.path === 'string' && typeof value[key] === 'string' &&
    (key === 'git_blob_sha' ? gitSha : /^[0-9a-f]{64}$/).test(value[key]);
}

function checkPair<K extends 'content_sha256' | 'git_blob_sha'>(value: unknown, key: K):
  value is Pair<{path: string} & Record<K, string>> {
  if (!exactKeys(value, [...locales]) || !checkRefs(value.fr, key) || !checkRefs(value.en, key)) return false;
  pairKey({fr: value.fr.path, en: value.en.path});
  return true;
}

export function validateReviewPath(path: string): void {
  requireThat(/^\.42p\/editorial-reviews\/(?:[A-Za-z0-9][A-Za-z0-9._-]*\/)*[A-Za-z0-9][A-Za-z0-9._-]*\.md$/.test(path),
    `Invalid report path: ${path}`);
}

export async function readReview(tree: Snapshot, path: string): Promise<Review> {
  validateReviewPath(path);
  const {fields, body} = await readMarkdown(tree.read(path), path);
  const revision = fields.mode === 'revision';
  requireThat(exactKeys(fields, ['article', 'mode', 'candidates', 'targets', 'references', 'result',
    ...(revision ? ['baseline'] : [])]) && (revision || fields.mode === 'new') &&
    typeof fields.article === 'string' && reviewPath(fields.article) === path &&
    typeof fields.result === 'string' && ['PASS', 'FAIL', 'INCONCLUSIVE'].includes(fields.result) &&
    checkPair(fields.candidates, 'content_sha256') && checkPair(fields.targets, 'content_sha256') &&
    (!revision || checkPair(fields.baseline, 'git_blob_sha')) &&
    Array.isArray(fields.references) && fields.references.every(item => checkRefs(item, 'git_blob_sha')) &&
    body.includes('Human editorial approval: not granted by this report'),
    `Invalid editorial report: ${path}`);
  const review = fields as Review;
  const referencePaths = review.references.map(ref => ref.path);
  requireThat(standards.every(path => referencePaths.includes(path)) &&
    (referencePaths.length === 2 || referencePaths.length === 3) &&
    new Set(referencePaths).size === referencePaths.length &&
    referencePaths.every(path => standards.includes(path) || capturePattern.test(path)),
    `Invalid reference cardinality in ${path}`);
  for (const locale of locales) {
    const candidate = review.candidates[locale].path;
    const target = review.targets[locale].path;
    requireThat(revision ? candidate !== target && review.baseline?.[locale].path === target : candidate === target,
      `Invalid ${locale} projection paths in ${path}`);
  }
  return review;
}

export async function checkProvenance(tree: Snapshot, pair: Pair<Article>) {
  const provenance = sameProvenance(pair);
  for (const path of [provenance.main, ...provenance.context ?? []]) {
    if (path) tree.requireBlob(path);
  }
  return provenance;
}

export const canonicalSlug = (french: Article) => french.route.slice('/blog/'.length, -1);
export const refPaths = (pair: Pair<{path: string}>): Pair<string> => ({fr: pair.fr.path, en: pair.en.path});

export async function identities(tree: Snapshot, candidatePaths: Pair<string>, baselinePaths?: Pair<string>) {
  const candidates = await readPair(tree, candidatePaths);
  requireThat(candidates.fr.visibility !== 'public', `Candidate is already public: ${candidates.fr.path}`);
  const {main} = await checkProvenance(tree, candidates);
  const baseline = baselinePaths && await readPair(tree, baselinePaths);
  if (baseline) {
    requireThat(baseline.fr.visibility === 'public', 'A revision baseline must be a canonical public pair');
    await checkProvenance(tree, baseline);
  }
  const projected = await mapPair(candidates, async (candidate, locale) => {
    const output = project(candidate, baseline?.[locale]);
    const article = await readArticle(output.bytes, output.path);
    const expectedRoute = (baseline?.[locale] ?? candidate).route;
    requireThat(article.route === expectedRoute && article.visibility === 'public',
      `Projection changes the canonical route: ${output.path}`);
    const expectedFields = {...candidate.fields};
    delete expectedFields.draft;
    delete expectedFields.unlisted;
    if (baseline) {
      if (Object.hasOwn(baseline[locale].fields, 'slug')) expectedFields.slug = baseline[locale].fields.slug;
      else delete expectedFields.slug;
    }
    requireThat(isDeepStrictEqual(article.fields, expectedFields) && article.body === candidate.body,
      `Projection does not round-trip through Docusaurus: ${output.path}`);
    return {...output, article};
  });
  const norm = (article: Article) => ({path: article.path, content_sha256: sha256(normalize(article))});
  const blob = (path: string): BlobRef => ({path, git_blob_sha: tree.requireBlob(path)});
  const data: Identities = {
    article: canonicalSlug(projected.fr.article),
    mode: baseline ? 'revision' : 'new',
    candidates: {fr: norm(candidates.fr), en: norm(candidates.en)},
    targets: {fr: norm(projected.fr.article), en: norm(projected.en.article)},
    references: [...standards, ...(main ? [main] : [])].map(blob),
    ...(baselinePaths && {baseline: {fr: blob(baselinePaths.fr), en: blob(baselinePaths.en)}}),
  };
  return {data, projected};
}

export function matchReview(review: Review, data: Identities): void {
  const {result, ...recorded} = review;
  const byPath = (a: BlobRef, b: BlobRef) => a.path < b.path ? -1 : a.path > b.path ? 1 : 0;
  requireThat(isDeepStrictEqual({...recorded, references: [...recorded.references].sort(byPath)},
    {...data, references: [...data.references].sort(byPath)}),
    `Stale or inapplicable editorial report for ${data.article}`);
}

export async function inventory(tree: Snapshot, pending?: Identities) {
  const pairs = new Map<string, Pair<Article>>();
  const routes = new Set<string>();
  for (const path of tree.paths('blog', 'i18n/en/docusaurus-plugin-content-blog')) {
    const id = articlePath(path);
    if (!id || pairs.has(id.key)) continue;
    const pair = await readPair(tree, articlePair(id.key));
    for (const locale of locales) {
      const route = pair[locale].route.toLowerCase();
      requireThat(!routes.has(route), `Duplicate route: ${pair[locale].route}`);
      routes.add(route);
    }
    pairs.set(id.key, pair);
  }

  // A report binds temporary paths to actual canonical blobs. Its verdict is
  // irrelevant to identity, and it need not be current enough to authorize promotion.
  const revisions = new Map<string, string>();
  const reports: Identities[] = [];
  for (const path of tree.paths(reviewsDir.slice(0, -1))) {
    const report = await readReview(tree, path);
    if (report.article !== pending?.article) reports.push(report);
  }
  if (pending) reports.push(pending);
  for (const report of reports) {
    if (!report.baseline) continue;
    const candidate = pairKey(refPaths(report.candidates));
    const canonical = pairKey(refPaths(report.baseline));
    const preview = pairs.get(candidate);
    const target = pairs.get(canonical);
    if (preview?.fr.visibility === 'public') {
      throw new Error(`Revision candidate is independently public: ${preview.fr.path}`);
    }
    if (!preview || !target || target.fr.visibility !== 'public' || canonicalSlug(target.fr) !== report.article ||
      !locales.every(locale => tree.blob(target[locale].path) === report.baseline?.[locale].git_blob_sha)) continue;
    for (const locale of locales) project(preview[locale], target[locale]);
    requireThat(!revisions.has(candidate), `Ambiguous revision identity: ${preview.fr.path}`);
    requireThat(![...revisions.values()].includes(canonical), `Multiple temporary pairs for ${target.fr.path}`);
    revisions.set(candidate, canonical);
  }

  const owners = new Map<string, string>();
  for (const [key, pair] of pairs) {
    const {main} = await checkProvenance(tree, pair);
    if (!main) continue;
    const owner = revisions.get(key) ?? key;
    requireThat(!owners.has(main) || owners.get(main) === owner,
      `Main Capture belongs to more than one logical article, or revision identity is unbound: ${main}`);
    owners.set(main, owner);
  }
  return {pairs, revisions};
}
