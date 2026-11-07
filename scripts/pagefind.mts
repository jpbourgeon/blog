import {execFileSync} from 'node:child_process';
import {existsSync, readFileSync, writeFileSync} from 'node:fs';
import {resolve, join} from 'node:path';

// Only sitemap-listed pages are indexable. Docusaurus excludes unlisted posts
// from the sitemap; drafts do not generate routes. Pagefind sees no other body.
const build = resolve('build');
let marked = 0;
for (const sitemap of ['sitemap.xml', 'en/sitemap.xml']) {
  const path = join(build, sitemap);
  if (!existsSync(path)) throw new Error('Missing sitemap: ' + path);
  const xml = readFileSync(path, 'utf8');
  const locations = [...xml.matchAll(/<loc>([^<]+)<\/loc>/g)].map(match => match[1].replaceAll('&amp;', '&'));
  for (const location of locations) {
    const url = new URL(location);
    if (url.origin !== 'https://jpbourgeon.github.io' || !url.pathname.startsWith('/blog/')) {
      throw new Error('Unexpected sitemap URL: ' + location);
    }
    const route = decodeURIComponent(url.pathname.slice('/blog/'.length));
    if (route.split('/').includes('..')) throw new Error('Invalid sitemap URL: ' + location);
    const htmlPath = join(build, route, 'index.html');
    if (!existsSync(htmlPath)) throw new Error('Missing sitemap output: ' + htmlPath);
    const html = readFileSync(htmlPath, 'utf8');
    if (/<meta[^>]+name=["']robots["'][^>]+noindex/.test(html)) {
      throw new Error('Unlisted route in sitemap: ' + location);
    }
    if (!/<main(?:\s|>)/.test(html)) throw new Error('No indexable main in ' + htmlPath);
    writeFileSync(htmlPath, html.replace(/<main(?=\s|>)/, '<main data-pagefind-body'));
    marked++;
  }
}
if (marked === 0) throw new Error('No pages selected for search');
execFileSync('npx', ['--yes', 'pagefind@1.5.2', '--site', build], {stdio: 'inherit'});
console.log('Pagefind indexed sitemap-listed pages: ' + marked);
