import {createProcessor} from '@mdx-js/mdx';
import {
  type Article, type Pair, articlePath, capturePattern, locales, normalize, pagePaths, readArticle,
  readMarkdown, requireThat, sha256, standards,
} from './content.mts';
import {type Snapshot} from './git.mts';
import {
  canonicalSlug, identities, inventory, matchReview, pairKey, readReview, refPaths, reviewPath,
  validateReviewPath, reviewsDir,
} from './review.mts';

export type Mode = 'inspect' | 'bootstrap' | 'publish' | 'pages';
const isArticle = (path: string) => articlePath(path) !== undefined;

function nonRendering(path: string) {
  if (path.startsWith(reviewsDir)) {
    validateReviewPath(path);
    return true;
  }
  return ['AGENTS.md', 'README.md', 'LICENSE', 'LICENSE-ADDITIONAL.md', '.gitignore',
    '.github/workflows/pages.yml', ...standards].includes(path) ||
    /^\.42p\/\.agents\/skills\/(42p-capture|editorial-(verify|publish|write))\/SKILL\.md$/.test(path) ||
    /^scripts\/publication\/[a-z-]+\.mts$/.test(path) || capturePattern.test(path);
}

async function verifyPromotion(commit: Snapshot, parent: Snapshot, published: Article) {
  const path = reviewPath(canonicalSlug(published));
  const review = await readReview(commit, path);
  requireThat(review.result === 'PASS', `Editorial report is not PASS: ${path}`);
  requireThat(parent.blob(path) === commit.blob(path), `Report must predate promotion and remain unchanged: ${path}`);
  requireThat(review.targets.fr.path === published.path, `Report belongs to a different canonical pair: ${path}`);

  const baseline = review.baseline && refPaths(review.baseline);
  if (!baseline) {
    for (const reportPath of parent.paths(reviewsDir.slice(0, -1))) {
      const prior = await readReview(parent, reportPath);
      requireThat(!prior.baseline || prior.candidates.fr.path !== review.candidates.fr.path,
        `An established revision cannot become a new article: ${published.path}`);
    }
  }
  const {data, projected} = await identities(parent, refPaths(review.candidates), baseline);
  matchReview(review, data);
  for (const ref of data.references) {
    requireThat(commit.blob(ref.path) === ref.git_blob_sha, `Normative reference changed at promotion: ${ref.path}`);
  }
  for (const locale of locales) {
    const candidate = review.candidates[locale].path;
    const target = projected[locale];
    const bytes = commit.read(target.path);
    const actual = await readArticle(bytes, target.path);
    requireThat(actual.visibility === 'public' && actual.route === target.article.route,
      `Unexpected public visibility or URL: ${target.path}`);
    if (baseline) {
      requireThat(!commit.blob(candidate) && target.bytes.equals(bytes),
        `Revision must write the exact projection and delete its temporary candidate: ${candidate}`);
    } else {
      requireThat(sha256(normalize(actual)) === data.targets[locale].content_sha256,
        `Initial publication changed more than visibility: ${candidate}`);
    }
  }
  return review;
}

async function articleAt(tree: Snapshot, path: string) {
  if (tree.blob(path)) return readArticle(tree.read(path), path);
}

async function checkPromotions(deployed: Snapshot, target: Snapshot) {
  const repo = target.repo;
  const latest = new Map<string, {report: string; commit: Snapshot}>();
  let parent = deployed;
  for (const sha of repo.firstParentRange(deployed.commit, target.commit)) {
    const commit = repo.tree(sha);
    const changed = repo.changed(parent.commit, sha);
    requireThat(!changed.some(isArticle) || !changed.some(path => standards.includes(path)),
      `Keep changes to editorial standards separate from article changes: ${sha}`);
    const covered = new Set<string>();
    for (const file of changed.filter(isArticle)) {
      if (covered.has(file)) continue;
      const before = await articleAt(parent, file);
      const after = await articleAt(commit, file);
      if (before?.visibility !== 'public' && after?.visibility !== 'public') continue;
      requireThat(after?.visibility === 'public', `Unsupported withdrawal of a canonical article: ${file}`);
      const id = articlePath(file)!;
      const french = id.locale === 'fr' ? after : await articleAt(commit, 'blog/' + id.key);
      requireThat(french?.visibility === 'public', `Partial canonical publication: ${file}`);
      const review = await verifyPromotion(commit, parent, french);
      for (const locale of locales) {
        covered.add(review.targets[locale].path);
        covered.add(review.candidates[locale].path);
      }
      latest.set(pairKey(refPaths(review.targets)), {report: reviewPath(review.article), commit});
    }
    if (covered.size) {
      requireThat(changed.length === covered.size && changed.every(file => covered.has(file)),
        `Publication commit ${sha} must contain exactly the paired promotion changes`);
    }
    parent = commit;
  }

  for (const {report, commit} of latest.values()) {
    requireThat(target.blob(report) === commit.blob(report), `Report changed after promotion: ${report}`);
    const review = await readReview(commit, report);
    for (const ref of review.references) {
      requireThat(target.blob(ref.path) === ref.git_blob_sha, `Normative reference changed before deployment: ${ref.path}`);
    }
    for (const locale of locales) {
      const path = review.targets[locale].path;
      requireThat(target.blob(path) === commit.blob(path), `Canonical target changed after promotion: ${path}`);
    }
  }
}

type MarkdownNode = {
  type: string;
  value?: string;
  url?: string;
  identifier?: string;
  children?: MarkdownNode[];
};
const processor = createProcessor();

function checkStaticMarkdown(body: string, path: string): void {
  // Docusaurus accepts the legacy HTML truncation marker as well as the MDX comment.
  const tree = processor.parse(body.replace(/^<!-- truncate -->$/gm, '{/* truncate */}')) as MarkdownNode;
  const localImages = new Set<string>();
  function collectImages(node: MarkdownNode) {
    if (node.type === 'imageReference' && node.identifier) localImages.add(node.identifier);
    node.children?.forEach(collectImages);
  }
  collectImages(tree);
  function inspect(node: MarkdownNode) {
    if (node.type.startsWith('mdx') || node.type === 'html') {
      requireThat(node.type === 'mdxFlowExpression' && /^\/\*\s*truncate\s*\*\/$/.test(node.value?.trim() ?? ''),
        `Executable or unclassified Markdown in ${path}: ${node.type}`);
    }
    if (node.url) {
      requireThat(!/^[a-z][a-z0-9+.-]*:/i.test(node.url) || /^(https?:|mailto:)/i.test(node.url),
        `Unsupported Markdown URL in ${path}`);
      const image = node.type === 'image' || (node.type === 'definition' && localImages.has(node.identifier ?? ''));
      if (image && !/^https?:\/\//i.test(node.url)) {
        requireThat(/\.(png|jpe?g|webp|gif|avif)(?:[?#].*)?$/i.test(node.url),
          `Unclassified local image dependency in ${path}`);
      }
    }
    node.children?.forEach(inspect);
  }
  inspect(tree);
}

export async function plan(target: Snapshot, mode: Mode, deployed?: Snapshot) {
  const workflows = target.paths('.github/workflows');
  requireThat(workflows.length === 1 && workflows[0] === '.github/workflows/pages.yml',
    'Found an alternate workflow or missing the Pages workflow');
  target.requireBlob(workflows[0]);

  const {pairs} = await inventory(target);
  const exposed = [...pairs.values()].filter(pair => pair.fr.visibility !== 'draft');
  const classification: string[] = [];
  if (mode === 'bootstrap') {
    requireThat(!deployed && exposed.length === 0, 'Bootstrap requires no deployed baseline or exposed article');
    classification.push('First exposure of the permanent bilingual site');
  } else if (mode !== 'inspect') {
    requireThat(deployed && deployed.commit !== target.commit,
      'Normal publication needs a different, verified deployed commit');
    await inventory(deployed);
    const changed = target.repo.changed(deployed.commit, target.commit);
    for (const path of changed) {
      requireThat(nonRendering(path) || isArticle(path) || (mode === 'pages' && pagePaths.includes(path)),
        `Public effect is unclassified, or requires the separate pages dispatch: ${path}`);
    }
    await checkPromotions(deployed, target);
    for (const path of changed.filter(isArticle)) {
      const before = await articleAt(deployed, path);
      const after = await articleAt(target, path);
      if (mode === 'pages') {
        requireThat((!before || before.visibility === 'draft') && (!after || after.visibility === 'draft'),
          `Permanent page dispatch cannot also change an exposed article: ${path}`);
      }
      const change = after?.visibility === 'unlisted' ?
        (before?.visibility === 'unlisted' && before.route === after.route ? 'Updated preview' : 'First preview exposure') :
        after?.visibility === 'public' ? (before?.visibility === 'public' ? 'Canonical revision' : 'Canonical publication') :
        before?.visibility === 'unlisted' ? 'Preview removal' : 'Non-public source';
      classification.push(`${change}: ${path}`);
    }
    classification.push(...changed.filter(path => pagePaths.includes(path)).map(path => `Permanent page: ${path}`));
    if (!classification.length) classification.push('Only non-rendering files changed');
  }

  const articles: Article[] = [];
  const drafts: Article[] = [];
  for (const pair of pairs.values()) {
    if (pair.fr.visibility === 'draft') drafts.push(pair.fr, pair.en);
    else articles.push(pair.fr, pair.en);
  }
  // The independent build verifies routing and indexing. Static Markdown keeps
  // an approved article from importing unrelated sources or running site code.
  for (const article of articles) checkStaticMarkdown(article.body, article.path);
  for (const path of pagePaths) {
    const page = await readMarkdown(target.read(path), path);
    checkStaticMarkdown(page.body, path);
  }
  return {articles, drafts, classification};
}

export type Plan = Awaited<ReturnType<typeof plan>>;
