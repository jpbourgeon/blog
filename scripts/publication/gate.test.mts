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

test('a verified page may be promoted with its report in one squash commit', async t => {
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
  assert.match((await plan(f.commit(), f.initial)).join('\n'), /Verified page\/new/);
});

test('squash merge retains a PASS and exact target without retaining the candidate', async t => {
  const f = fixture(t);
  const paths = pageDraftPair('squash.md');
  f.repo.text('checkout', '-qb', 'review');
  f.writePair(paths, 'Prepared outside main');
  const draft = f.commit();
  const {data, projected} = await identities(draft, paths);
  f.repo.text('checkout', 'main');
  f.report({...data, result: 'PASS'});
  for (const locale of locales) {
    f.write(projected[locale].path, projected[locale].bytes);
  }
  assert.match((await plan(f.commit(), f.initial)).join('\n'), /Verified page\/squash/);
});

test('unlisted previews are allowed; page removal requires prior immutable approval', async t => {
  const f = fixture(t);
  const article = articlePair('preview.md');
  f.writePair(article, 'Preview', 'unlisted: true\n');
  const preview = f.commit();
  assert.match((await plan(preview, f.initial)).join('\n'), /Unlisted preview/);
  const pages = pagePair('about.md');
  const baseline = {fr: preview.blob(pages.fr), en: preview.blob(pages.en)};
  const approval = '---\naction: remove\nresult: PASS\nreason: Explicit editorial withdrawal of this obsolete page\nbaseline:\n  fr: ' +
    baseline.fr + '\n  en: ' + baseline.en + '\n---\n' + approvalNotice + '\n';
  f.write('.42p/editorial-reviews/page/about.removal.md', approval);
  f.commit();
  for (const locale of locales) f.remove(pages[locale]);
  const removed = f.commit();
  assert.match((await plan(removed, preview)).join('\n'), /Reviewed page withdrawal/);
});

test('same-commit withdrawal report is valid after squash merge', async t => {
  const f = fixture(t);
  const pages = pagePair('about.md');
  const baseline = {fr: f.initial.blob(pages.fr), en: f.initial.blob(pages.en)};
  const approval = '---\naction: remove\nresult: PASS\nreason: Explicit editorial withdrawal of this obsolete page\nbaseline:\n  fr: ' +
    baseline.fr + '\n  en: ' + baseline.en + '\n---\n' + approvalNotice + '\n';
  for (const locale of locales) f.remove(pages[locale]);
  f.write('.42p/editorial-reviews/page/about.removal.md', approval);
  assert.match((await plan(f.commit(), f.initial)).join('\n'), /Reviewed page withdrawal/);
});

test('page removal without a report is rejected', async t => {
  const f = fixture(t);
  const pages = pagePair('about.md');
  for (const locale of locales) f.remove(pages[locale]);
  await assert.rejects(plan(f.commit(), f.initial), /Missing/);
});

test('a reviewed permanent-page revision preserves its public route', async t => {
  const f = fixture(t);
  const draftPaths = pageDraftPair('about.md');
  const currentPaths = pagePair('about.md');
  f.writePair(draftPaths, 'Revised page');
  const draft = f.commit();
  const {data, projected} = await identities(draft, draftPaths, currentPaths);
  assert.equal(data.mode, 'revision');
  f.report({...data, result: 'PASS'});
  f.commit();
  for (const locale of locales) {
    f.write(currentPaths[locale], projected[locale].bytes);
    f.remove(draftPaths[locale]);
  }
  assert.match((await plan(f.commit(), f.initial)).join('\n'), /Verified page\/about/);
});

test('reviewed candidates changed after PASS cannot be promoted', async t => {
  const f = fixture(t);
  const draftPaths = pageDraftPair('new.md');
  f.writePair(draftPaths, 'Original candidate');
  const draft = f.commit();
  const {data, projected} = await identities(draft, draftPaths);
  f.report({...data, result: 'PASS'});
  f.commit();
  f.writePair(draftPaths, 'Changed after verification');
  f.commit();
  for (const locale of locales) {
    f.write(projected[locale].path, projected[locale].bytes);
    f.remove(draftPaths[locale]);
  }
  await assert.rejects(plan(f.commit(), f.initial), /Candidate changed after independent verification/);
});

test('public promotion cannot publish only one language', async t => {
  const f = fixture(t);
  const paths = articlePair('partial.md');
  f.writePair(paths, 'Candidate');
  const draft = f.commit();
  const {data, projected} = await identities(draft, paths);
  f.report({...data, result: 'PASS'});
  f.commit();
  f.write(paths.fr, projected.fr.bytes);
  await assert.rejects(plan(f.commit(), f.initial), /FR\/EN visibility differs/);
});

test('executable MDX is rejected even when the FR/EN drafts agree', async t => {
  const f = fixture(t);
  const article = articlePair('unsafe.mdx');
  for (const executable of [
    "import Widget from '../src/components/Widget'\\n\\n<Widget />",
    '{1 + 2}',
    '<Widget />',
    "export const token = 1",
  ]) {
    f.writePair(article, executable.replaceAll('\\n', '\n'));
    await assert.rejects(plan(f.commit(), f.initial), /Executable MDX or JSX dependency/);
  }
});

test('withdrawal approval must bind both exact published Git blobs', async t => {
  const f = fixture(t);
  const paths = pagePair('about.md');
  const approval = '---\naction: remove\nresult: PASS\nreason: Explicit editorial withdrawal of the current page\nbaseline:\n  fr: ' +
    'a'.repeat(40) + '\n  en: ' + 'b'.repeat(40) +
    '\n---\n' + approvalNotice + '\n';
  f.write('.42p/editorial-reviews/page/about.removal.md', approval);
  f.commit();
  for (const locale of locales) f.remove(paths[locale]);
  await assert.rejects(plan(f.commit(), f.initial), /Removed page does not match reviewed FR\/EN baseline/);
});
