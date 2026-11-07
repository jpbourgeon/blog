import assert from 'node:assert/strict';
import {mkdirSync, mkdtempSync, rmSync, writeFileSync} from 'node:fs';
import {tmpdir} from 'node:os';
import {dirname, join} from 'node:path';
import test from 'node:test';
import {pagePaths, readArticle} from './content.mts';
import {verifyBuild} from './output.mts';

test('build inventory binds real route shapes and refuses extra files or index leaks', async t => {
  const root = mkdtempSync(join(tmpdir(), 'blog-output-'));
  t.after(() => rmSync(root, {recursive: true, force: true}));
  const build = join(root, 'build');
  const manifests = join(root, 'manifests');
  const write = (path: string, content: string) => {
    mkdirSync(dirname(path), {recursive: true});
    writeFileSync(path, content);
  };
  const fr = await readArticle(Buffer.from('---\nunlisted: true\n---\n# Aperçu\n'), 'blog/preview.md');
  const en = await readArticle(Buffer.from('---\nunlisted: true\n---\n# Preview\n'), 'i18n/en/docusaurus-plugin-content-blog/preview.md');
  for (const [locale, article] of [['fr', fr], ['en', en]] as const) {
    const subdir = locale === 'en' ? 'en/' : '';
    const base = '/blog/' + subdir;
    const pages = pagePaths.filter(path => path.startsWith(locale === 'en' ? 'i18n/' : 'src/')).map(path =>
      ({path, route: base + path.split('/').at(-1)!.slice(0, -3)}));
    const routes = Object.fromEntries([base, base + '404.html', ...pages.map(page => page.route + '/'), article.route]
      .map(route => [route, {noIndex: route === article.route}]));
    write(join(manifests, locale + '.json'), JSON.stringify({routes, pages,
      articles: [{path: article.path, route: article.route, unlisted: true}]}));
    write(join(build, subdir, 'index.html'), `<html lang="${locale}"></html>`);
    write(join(build, subdir, 'sitemap.xml'), '<urlset/>');
    write(join(build, subdir, '404.html'), '<html></html>');
    for (const name of ['about', 'projects', 'preview']) write(join(build, subdir, name, 'index.html'), '<html></html>');
    write(join(build, subdir, 'assets/js/runtime~main.abcdef.js'), '// bundled client runtime');
    write(join(build, subdir, '__server/server.bundle.js'), '// never served');
  }
  const plan = {articles: [fr, en], drafts: [], classification: []};
  const inventory = verifyBuild(plan, build, manifests);
  assert(inventory.files.some(file => file.path.endsWith('runtime~main.abcdef.js')));
  assert(!inventory.files.some(file => file.path.includes('__server')));
  write(join(build, 'pagefind/index.js'), '// unknown index');
  assert.throws(() => verifyBuild(plan, build, manifests), /Unclassified public output/);
  rmSync(join(build, 'pagefind'), {recursive: true});
  write(join(build, 'index.html'), '<html lang="fr"><a href="/blog/preview/">Preview</a></html>');
  assert.throws(() => verifyBuild(plan, build, manifests), /Non-listed route in index/);
});
