import {lstatSync, readFileSync, readdirSync, rmSync} from 'node:fs';
import {join, resolve} from 'node:path';
import {type Locale, locales, pagePaths, requireThat, sha256} from './content.mts';
import {type Plan} from './gate.mts';

const base = '/blog/';
const prefix = (locale: Locale) => locale === 'fr' ? base : base + 'en/';
const slash = (route: string) => route.replace(/\/$/, '') + '/';
const output = (route: string) => route.endsWith('/404.html') ?
  route.slice(base.length) : slash(route).slice(base.length) + 'index.html';
const expectedPage = (locale: Locale, path: string) => prefix(locale) + path.split('/').at(-1)!.replace(/\.md$/, '/');
type SiteRoute = {path: string; route: string};
type Manifest = {
  routes: Record<string, {noIndex: boolean}>;
  pages: SiteRoute[];
  articles: (SiteRoute & {unlisted: boolean})[];
};

function files(dir: string, parent = ''): string[] {
  const paths: string[] = [];
  for (const name of readdirSync(join(dir, parent)).sort()) {
    const path = parent + name;
    const stat = lstatSync(join(dir, path));
    requireThat(!name.startsWith('.') && /^[A-Za-z0-9._~-]+$/.test(name),
      `Unsupported path in public build: ${path}`);
    if (stat.isDirectory()) paths.push(...files(dir, path + '/'));
    else {
      requireThat(stat.isFile() && stat.nlink === 1 && stat.size > 0, `Unsafe output file: ${path}`);
      paths.push(path);
    }
  }
  return paths;
}

export function verifyBuild(plan: Plan, directory: string, manifests: string) {
  const dir = resolve(directory);
  const html = new Set<string>();
  const routes: string[] = [];
  const manifestsByLocale = new Map<Locale, Manifest>();
  for (const locale of locales) {
    const url = prefix(locale);
    const subdir = locale === 'fr' ? '' : 'en/';
    // Docusaurus 3.10 emits this SSR implementation file in addition to the
    // static site. It is unnecessary for Pages and excluded from the artifact.
    rmSync(join(dir, subdir, '__server'), {recursive: true, force: true});
    const manifest: Manifest = JSON.parse(readFileSync(join(manifests, locale + '.json'), 'utf8'));
    manifestsByLocale.set(locale, manifest);
    const expected = plan.articles.filter(article => article.route.startsWith(url) &&
      (locale === 'en' || !article.route.startsWith(prefix('en'))));
    const posts = new Set<string>();
    requireThat(manifest.articles.length === expected.length, `Unexpected ${locale} article inventory`);
    for (const article of expected) {
      const actual = manifest.articles.find(item => item.path === article.path);
      requireThat(actual && slash(actual.route) === article.route && actual.unlisted === (article.visibility === 'unlisted'),
        `Build article source, URL or visibility differs: ${article.path}`);
      posts.add(article.route);
    }
    const localizedPages = pagePaths.filter(path => path.startsWith(locale === 'fr' ? 'src/pages/' : 'i18n/en/'));
    const pages = new Set<string>();
    requireThat(manifest.pages.length === localizedPages.length, `Unexpected ${locale} permanent pages`);
    for (const path of localizedPages) {
      const route = expectedPage(locale, path);
      requireThat(manifest.pages.some(page => page.path === path && slash(page.route) === route),
        `Unexpected permanent page source or URL: ${path}`);
      pages.add(route);
    }

    const indexes: string[] = [];
    const required = new Set([url, url + '404.html', ...posts, ...pages]);
    for (const [raw, metadata] of Object.entries(manifest.routes)) {
      const route = raw.endsWith('/404.html') ? raw : slash(raw);
      requireThat(route.startsWith(url) && (locale === 'en' || !route.startsWith(prefix('en'))),
        `Route outside its locale: ${route}`);
      const relative = route.slice(url.length);
      const derived = /^(?:(?:tags|authors)(?:\/[A-Za-z0-9._~-]+)*|page\/\d+)\/$/.test(relative);
      requireThat(required.delete(route) || derived, `Unclassified output route: ${route}`);
      if ((route === url || derived) && !metadata.noIndex) indexes.push(output(route));
      const article = expected.find(post => post.route === route);
      if (article?.visibility === 'unlisted') requireThat(metadata.noIndex === true, `Preview is indexable: ${route}`);
      routes.push(route);
      const filename = output(route);
      requireThat(!html.has(filename), `Overlapping output route: ${route}`);
      html.add(filename);
    }
    requireThat(required.size === 0, `Missing ${locale} routes: ${[...required].join(', ')}`);
    requireThat(readFileSync(join(dir, subdir, 'index.html'), 'utf8').includes(`<html lang="${locale}"`),
      `Wrong document language for ${locale}`);

    const sitemap = readFileSync(join(dir, subdir, 'sitemap.xml'), 'utf8');
    const unlistedOrDraft = [...expected.filter(post => post.visibility === 'unlisted'), ...plan.drafts];
    for (const hidden of unlistedOrDraft) {
      requireThat(!sitemap.includes(`${hidden.route}</loc>`) && !sitemap.includes(`${hidden.route}"`),
        `Non-listed route in sitemap: ${hidden.route}`);
    }
    const listed = expected.filter(post => post.visibility === 'public');
    for (const name of ['rss.xml', 'atom.xml']) {
      const filename = join(dir, subdir, name);
      const exists = readdirSync(join(dir, subdir)).includes(name);
      requireThat(exists === (listed.length > 0), `Unexpected feed availability: ${subdir}${name}`);
      if (exists) indexes.push(subdir + name);
    }
    for (const index of indexes) {
      const content = readFileSync(join(dir, index), 'utf8');
      for (const hidden of unlistedOrDraft) {
        requireThat(!content.includes(`href="${hidden.route}"`) &&
          !content.includes(`https://jpbourgeon.github.io${hidden.route}"`) &&
          !content.includes(`https://jpbourgeon.github.io${hidden.route}</`), `Non-listed route in index ${index}: ${hidden.route}`);
      }
    }
  }
  const inventory = files(dir).map(path => {
    const subpath = path.replace(/^en\//, '');
    const expected = html.delete(path) ||
      /^(?:sitemap|rss|atom)\.xml$/.test(subpath) ||
      /^assets\/(?:js|css|images)\/[A-Za-z0-9._~-]+\.(?:js|css|txt|png|jpe?g|webp|gif|avif)$/.test(subpath);
    requireThat(expected, `Unclassified public output (including search indexes): ${path}`);
    return {path, sha256: sha256(readFileSync(join(dir, path)))};
  });
  requireThat(html.size === 0, `Missing output files: ${[...html].join(', ')}`);
  return {routes: routes.sort(), files: inventory};
}
