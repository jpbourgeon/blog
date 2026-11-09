import {existsSync, mkdirSync, readFileSync, writeFileSync} from 'node:fs';
import {join, dirname} from 'node:path';

/** Index only HTML reached through a published sitemap URL. */
export function selectSearchPages(build: string, selected: string): number {
  let count = 0;
  for (const sitemap of ['sitemap.xml', 'en/sitemap.xml']) {
    const path = join(build, sitemap);
    if (!existsSync(path)) throw new Error('Missing sitemap: ' + path);
    const xml = readFileSync(path, 'utf8');
    const locations = [...xml.matchAll(/<loc>([^<]+)<\/loc>/g)].map(m => m[1].replaceAll('&amp;', '&'));
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
      const isolated = join(selected, route, 'index.html');
      mkdirSync(dirname(isolated), {recursive: true});
      writeFileSync(isolated, html.replace(/<main(?=\s|>)/, '<main data-pagefind-body'));
      count++;
    }
  }
  if (count === 0) throw new Error('No pages selected for search');
  return count;
}
