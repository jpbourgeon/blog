import {createMatcher, encodePath, fileToPath, GlobExcludeDefault} from '@docusaurus/utils';
import {
  type Document, articlePair, documentPath, locales, normalize, pagePair, readDocument,
  requireThat, sha256, provenance, legacyCapturePath, legacyCapturePattern,
} from './content.mts';
import {type Snapshot} from './git.mts';
import {canonicalSlug, inventory, readReview, reviewPath, type Review} from './review.mts';

function sourcePair(document: {kind: string; key: string}) {
  return document.kind === 'article' ? articlePair(document.key) : pagePair(document.key);
}

// A migrated historical PASS was sealed over the old Capture locators.
function publishedHash(document: Document, report: Review) {
  const {main, context} = provenance(document);
  const historical = report.references.find(ref => legacyCapturePattern.test(ref.path));
  if (main && historical?.path === legacyCapturePath(main)) {
    const fields = {...document.fields, rationale: historical.path,
      ...(context && {rationaleContext: context.map(legacyCapturePath)})};
    return sha256(normalize({...document, fields}));
  }
  return sha256(normalize(document));
}

// Publication validity belongs to the target commit, never to intermediate
// editorial commits. A PASS is bound to the exact public FR/EN projection.
async function verifyPublished(target: Snapshot, published: Document, pair: {fr: Document; en: Document}) {
  const location = reviewPath(published.kind + '/' + canonicalSlug(published));
  const report = await readReview(target, location);
  requireThat(report.result === 'PASS', 'No PASS for publication: ' + location);
  const paths = sourcePair(published);
  for (const locale of locales) {
    const path = paths[locale];
    const actual = pair[locale];
    requireThat(actual.visibility === 'public' && report.targets[locale].path === path &&
      publishedHash(actual, report) === report.targets[locale].content_sha256,
      'Published content differs from verified target: ' + path);
    const candidate = report.candidates[locale].path;
    if (candidate !== path && target.blob(candidate)) {
      const workingCopy = await readDocument(target.read(candidate), candidate);
      requireThat(workingCopy.visibility === 'draft',
        'Temporary candidate left exposed in publication: ' + candidate);
    }
  }
  return location;
}

const englishRoot = '/blog/en/';
const localeRoots = ['/blog/', englishRoot];
const nativePage = /^(?:src\/pages|(?<localized>i18n\/en\/docusaurus-plugin-content-pages))\/(?<relative>.+\.[jt]sx?)$/;
const excludedPage = createMatcher(GlobExcludeDefault);
const siteInput = /^(?:src\/|static\/|i18n\/|blog\/|scripts\/pagefind|docusaurus\.config\.|package(?:-lock)?\.json$|tsconfig\.json$)/;

export async function plan(target: Snapshot, deployed?: Snapshot) {
  const current = await inventory(target);
  const baseline = deployed ? await inventory(deployed, undefined, true) : undefined;

  const changes = target.repo.changes(target, deployed);
  const classification: string[] = [];
  const routes = new Set<string>();
  const addPair = (pair: {fr: Document; en: Document}) => {
    for (const locale of locales) routes.add(pair[locale].route);
  };
  const exposed = new Set<string>();
  for (const [identity, pair] of current) {
    const document = pair.fr;
    if (document.source !== 'canonical' || document.visibility === 'draft') continue;
    exposed.add(identity);
    const paths = sourcePair(document);

    if (document.visibility === 'public') {
      await verifyPublished(target, document, pair);
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
      addPair(pair);
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
      for (const route of localeRoots) routes.add(route);
      classification.push('Withdrawn ' + previous.kind + '/' + canonicalSlug(previous));
    }
  }
  for (const {path, status} of changes) {
    const page = nativePage.exec(path)?.groups;
    if (!page || excludedPage(page.relative)) continue;
    const {localized, relative} = page;
    // Docusaurus only serves overrides for pages discovered in src/pages.
    if (localized && !target.blob('src/pages/' + relative)) continue;
    if (!localized && status !== 'A' && status !== 'M') continue;
    const suffix = encodePath(fileToPath(relative)).replace(/^\/|\/$/g, '');
    for (const root of localized ? [englishRoot] : localeRoots) routes.add(suffix ? root + suffix + '/' : root);
  }
  const technical = changes.some(({path}) =>
    siteInput.test(path) && !documentPath(path) && !path.startsWith('src/drafts/'));
  if (technical) {
    for (const route of localeRoots) routes.add(route);
    const pairs = [...current.values()].filter(({fr}) =>
      fr.source === 'canonical' && fr.visibility !== 'draft');
    const page = pairs.find(({fr}) => fr.kind === 'page');
    const article = pairs.find(({fr}) => fr.kind === 'article' && fr.visibility === 'public');
    if (page) addPair(page);
    if (article) addPair(article);
  }

  return {
    editorial: classification.length ? classification : ['No public content changes'],
    changes,
    preflight: [...routes],
  };
}
