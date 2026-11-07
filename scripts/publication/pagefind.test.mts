import assert from 'node:assert/strict';
import test from 'node:test';
import {mkdtempSync, mkdirSync, readFileSync, rmSync, writeFileSync, existsSync} from 'node:fs';
import {tmpdir} from 'node:os';
import {dirname, join} from 'node:path';
import {selectSearchPages} from '../pagefind-select.mts';

test('Pagefind receives only sitemap-listed public FR/EN HTML, never unlisted previews', t => {
  const root = mkdtempSync(join(tmpdir(), 'search-'));
  t.after(() => rmSync(root, {recursive: true, force: true}));
  const build = join(root, 'build');
  const isolated = join(root, 'isolated');
  function write(path: string, value: string) {
    mkdirSync(dirname(path), {recursive: true});
    writeFileSync(path, value);
  }
  const prefix = 'https://jpbourgeon.github.io/blog/';
  write(join(build, 'sitemap.xml'), '<urlset><url><loc>' + prefix + 'public/</loc></url></urlset>');
  write(join(build, 'en/sitemap.xml'), '<urlset><url><loc>' + prefix + 'en/public/</loc></url></urlset>');
  for (const key of ['public', 'preview', 'en/public', 'en/preview']) {
    write(join(build, key, 'index.html'), '<html><body><main>Secret: ' + key + '</main></body></html>');
  }
  assert.equal(selectSearchPages(build, isolated), 2);
  for (const key of ['public', 'en/public']) {
    assert.match(readFileSync(join(isolated, key, 'index.html'), 'utf8'), /data-pagefind-body/);
  }
  for (const key of ['preview', 'en/preview']) {
    assert.equal(existsSync(join(isolated, key, 'index.html')), false);
  }
});
