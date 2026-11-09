import {execFileSync} from 'node:child_process';
import {mkdtempSync, renameSync, rmSync} from 'node:fs';
import {tmpdir} from 'node:os';
import {join, resolve} from 'node:path';
import {selectSearchPages} from './pagefind-select.mts';

const build = resolve('build');
const isolated = mkdtempSync(join(tmpdir(), 'blog-pagefind-'));
try {
  const indexed = selectSearchPages(build, isolated);
  execFileSync('pagefind', ['--site', isolated], {stdio: 'inherit'});
  const output = join(build, 'pagefind');
  rmSync(output, {recursive: true, force: true});
  renameSync(join(isolated, 'pagefind'), output);
  console.log('Pagefind indexed sitemap-listed pages: ' + indexed);
} finally {
  rmSync(isolated, {recursive: true, force: true});
}
