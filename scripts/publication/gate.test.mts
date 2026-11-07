import assert from 'node:assert/strict';
import {execFileSync} from 'node:child_process';
import {mkdirSync, mkdtempSync, rmSync, writeFileSync} from 'node:fs';
import {tmpdir} from 'node:os';
import {dirname, join} from 'node:path';
import test, {type TestContext} from 'node:test';
import {stringify} from 'yaml';
import {pageDraftPair, pagePair, articlePair, type Pair, locales, standards} from './content.mts';
import {Repository} from './git.mts';
import {identities, reviewPath, type Review} from './review.mts';
import {plan} from './gate.mts';

const approvalNotice = 'Human editorial approval: not granted by this report';
function fixture(t: TestContext) {
  const root = mkdtempSync(join(tmpdir(), 'editorial-'));
  t.after(() => rmSync(root, {recursive: true, force: true}));
  execFileSync('git', ['init', '-q', '-b', 'main', root]);
  const repo = new Repository(root);
  repo.text('config', 'user.email', 'test@example.org');
  repo.text('config', 'user.name', 'Test');
  function write(path: string, content: string | Buffer) {
    mkdirSync(dirname(join(root, path)), {recursive: true});
    writeFileSync(join(root, path), content);
  }
  function remove(path: string) {rmSync(join(root, path));}
  function commit() {
    repo.text('add', '-A');
    repo.text('commit', '-qm', 'State');
    return repo.tree(repo.text('rev-parse', 'HEAD'));
  }
  for (const path of standards) write(path, '# Verified standard\n');
  const about = pagePair('about.md');
  for (const locale of locales) write(about[locale], '---\ntitle: About\n---\n# About\n');
  const initial = commit();
  function writePair(paths: Pair<string>, body: string, state = 'draft: true\n') {
    for (const locale of locales) write(paths[locale],
      '---\ntitle: Example\n' + state + '---\n# Example\n\n' + body + ' ' + locale + '\n');
  }
  function report(review: Review) {
    const path = reviewPath(review.content);
    write(path, '---\n' + stringify(review) + '---\nVerified evidence\n\n' + approvalNotice + '\n');
    return path;
  }
  return {repo, initial, write, remove, commit, writePair, report};
}

test('a page and an article share the same prior-PASS publication guarantee', async t => {
  const f = fixture(t);
  const page = pageDraftPair('note.md');
  f.writePair(page, 'New page');
  const draft = f.commit();
  const data = await identities(draft, page);
  const location = f.report({...data.data, result: 'PASS'});
  f.commit();
  for (const locale of locales) {
    f.write(data.projected[locale].path, data.projected[locale].bytes);
    f.remove(page[locale]);
  }
  const published = f.commit();
  assert.match((await plan(published, f.initial)).join('\n'), /Verified page\/note/);
  assert.match(location, /editorial-reviews\/page\/note.md/);

  const article = articlePair('example.md');
  f.writePair(article, 'New article');
  const articleDraft = f.commit();
  const articleData = await identities(articleDraft, article);
  f.report({...articleData.data, result: 'PASS'});
  f.commit();
  for (const locale of locales) f.write(article[locale], articleData.projected[locale].bytes);
  const result = f.commit();
  assert.match((await plan(result, published)).join('\n'), /Verified article\/example/);
});

test('a public page edit without a previously committed PASS is rejected', async t => {
  const f = fixture(t);
  f.write('src/pages/about.md', '---\ntitle: About\n---\n# Changed without approval\n');
  await assert.rejects(plan(f.commit(), f.initial), /Missing .*editorial-reviews/);
});

test('a page review cannot be injected in the same promotion commit', async t => {
  const f = fixture(t);
  const paths = pageDraftPair('new.md');
  f.writePair(paths, 'New');
  const draft = f.commit();
  const {data, projected} = await identities(draft, paths);
  f.report({...data, result: 'PASS'});
  for (const locale of locales) {
    f.write(projected[locale].path, projected[locale].bytes);
    f.remove(paths[locale]);
  }
  await assert.rejects(plan(f.commit(), f.initial), /PASS must be committed before/);
});

test('unlisted article previews stay out of canonical publication; paired page removal is allowed', async t => {
  const f = fixture(t);
  const article = articlePair('preview.md');
  f.writePair(article, 'Preview', 'unlisted: true\n');
  const preview = f.commit();
  assert.match((await plan(preview, f.initial)).join('\n'), /Unlisted preview/);
  const pages = pagePair('about.md');
  for (const locale of locales) f.remove(pages[locale]);
  const removed = f.commit();
  assert.match((await plan(removed, preview)).join('\n'), /Removed permanent page/);
});
