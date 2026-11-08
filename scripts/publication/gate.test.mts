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

test('a page and an article each require a matching PASS for the published state', async t => {
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
  assert.match((await plan(published, f.initial)).join('\n'), /Public page\/note/);
  assert.match(location, /editorial-reviews\/page\/note.md/);

  const article = articlePair('example.md');
  f.writePair(article, 'New article');
  const articleDraft = f.commit();
  const articleData = await identities(articleDraft, article);
  f.report({...articleData.data, result: 'PASS'});
  f.commit();
  for (const locale of locales) f.write(article[locale], articleData.projected[locale].bytes);
  const result = f.commit();
  assert.match((await plan(result, published)).join('\n'), /Public article\/example/);
});

test('a public page edit without a previously committed PASS is rejected', async t => {
  const f = fixture(t);
  f.write('src/pages/about.md', '---\ntitle: About\n---\n# Changed without approval\n');
  await assert.rejects(plan(f.commit(), f.initial), /Unsealed published content/);
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
  assert.match((await plan(f.commit(), f.initial)).join('\n'), /Public page\/squash/);
});

test('unlisted article previews are reported without being published', async t => {
  const f = fixture(t);
  const article = articlePair('preview.md');
  f.writePair(article, 'Preview', 'unlisted: true\n');
  const preview = f.commit();
  assert.match((await plan(preview, f.initial)).join('\n'), /Unlisted preview/);
});

test('an approved page withdrawal matches the deployed FR/EN blobs', async t => {
  const f = fixture(t);
  const pages = pagePair('about.md');
  const baseline = {fr: f.initial.blob(pages.fr), en: f.initial.blob(pages.en)};
  const approval = '---\naction: remove\nresult: PASS\nreason: Explicit editorial withdrawal of this obsolete page\nbaseline:\n  fr: ' +
    baseline.fr + '\n  en: ' + baseline.en + '\n---\n' + approvalNotice + '\n';
  f.write('.42p/editorial-reviews/page/about.removal.md', approval);
  for (const locale of locales) f.remove(pages[locale]);
  const removed = f.commit();
  assert.match((await plan(removed, f.initial)).join('\n'), /Reviewed page withdrawal/);
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
  assert.match((await plan(f.commit(), f.initial)).join('\n'), /Public page\/about/);
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


test('several revisions of the same page use only the final PASS even if V2 was never deployed', async t => {
  const f = fixture(t);
  const temporary = pageDraftPair('about.md');
  const canonical = pagePair('about.md');
  let previous = f.initial;
  for (const revision of ['V2', 'V3']) {
    f.writePair(temporary, revision);
    const candidate = f.commit();
    const {data, projected} = await identities(candidate, temporary, canonical);
    f.report({...data, result: 'PASS'});
    for (const locale of locales) {
      f.write(canonical[locale], projected[locale].bytes);
      f.remove(temporary[locale]);
    }
    previous = f.commit();
  }
  assert.match((await plan(previous, f.initial)).join('\n'), /Public page\/about/);
});

test('multiple public documents can share a single publication commit', async t => {
  const f = fixture(t);
  const pages = [pageDraftPair('one.md'), pageDraftPair('two.md')];
  for (const paths of pages) f.writePair(paths, 'Independent');
  const draft = f.commit();
  for (const paths of pages) {
    const {data, projected} = await identities(draft, paths);
    f.report({...data, result: 'PASS'});
    for (const locale of locales) {
      f.write(projected[locale].path, projected[locale].bytes);
      f.remove(paths[locale]);
    }
  }
  const published = f.commit();
  const messages = (await plan(published, f.initial)).join('\n');
  assert.match(messages, /Public page\/one/);
  assert.match(messages, /Public page\/two/);
});

test('invalid intermediate revision does not block a final valid seal', async t => {
  const f = fixture(t);
  const temporary = pageDraftPair('about.md');
  const canonical = pagePair('about.md');
  f.write('src/pages/about.md', '---\ntitle: About\n---\n# Unverified interim\n');
  f.write('i18n/en/docusaurus-plugin-content-pages/about.md', '---\ntitle: About\n---\n# Unverified interim\n');
  f.commit();
  f.writePair(temporary, 'Final verified');
  const candidate = f.commit();
  const {data, projected} = await identities(candidate, temporary, canonical);
  f.report({...data, result: 'PASS'});
  for (const locale of locales) {
    f.write(canonical[locale], projected[locale].bytes);
    f.remove(temporary[locale]);
  }
  assert.match((await plan(f.commit(), f.initial)).join('\n'), /Public page\/about/);
});


test('final public FR/EN bytes must match the exact PASS fingerprint', async t => {
  const f = fixture(t);
  const paths = pageDraftPair('sealed.md');
  f.writePair(paths, 'Original');
  const draft = f.commit();
  const {data, projected} = await identities(draft, paths);
  f.report({...data, result: 'PASS'});
  for (const locale of locales) {
    f.write(projected[locale].path, projected[locale].bytes);
    f.remove(paths[locale]);
  }
  f.write(projected.fr.path, projected.fr.bytes.toString('utf8').replace('Original', 'Tampered'));
  await assert.rejects(plan(f.commit(), f.initial), /Published content differs from verified target/);
});

test('FAIL and INCONCLUSIVE seals never authorize public content', async t => {
  for (const result of ['FAIL', 'INCONCLUSIVE'] as const) {
    const f = fixture(t);
    const paths = pageDraftPair('rejected.md');
    f.writePair(paths, 'Not approved');
    const draft = f.commit();
    const {data, projected} = await identities(draft, paths);
    f.report({...data, result});
    for (const locale of locales) {
      f.write(projected[locale].path, projected[locale].bytes);
      f.remove(paths[locale]);
    }
    await assert.rejects(plan(f.commit(), f.initial), /No PASS for publication/, result);
  }
});

test('normative references must remain identical to the verified blobs', async t => {
  const f = fixture(t);
  const paths = pageDraftPair('reference.md');
  f.writePair(paths, 'Verified with the original standard');
  const draft = f.commit();
  const {data, projected} = await identities(draft, paths);
  f.report({...data, result: 'PASS'});
  for (const locale of locales) {
    f.write(projected[locale].path, projected[locale].bytes);
    f.remove(paths[locale]);
  }
  f.write(standards[0], '# Changed after verification\n');
  await assert.rejects(plan(f.commit(), f.initial), /Normative reference differs from verified evidence/);
});

test('a public page cannot change its canonical route by moving files without withdrawal approval', async t => {
  const f = fixture(t);
  const old = pagePair('about.md');
  const newer = pageDraftPair('different.md');
  f.writePair(newer, 'Different route');
  const draft = f.commit();
  const {data, projected} = await identities(draft, newer);
  f.report({...data, result: 'PASS'});
  for (const locale of locales) {
    f.write(projected[locale].path, projected[locale].bytes);
    f.remove(old[locale]);
    f.remove(newer[locale]);
  }
  await assert.rejects(plan(f.commit(), f.initial), /Missing .*removal\.md/);
});


test('a published article keeps its FR/EN route across revisions', async t => {
  const f = fixture(t);
  const paths = articlePair('stable.md');
  f.writePair(paths, 'First version');
  const draft = f.commit();
  const first = await identities(draft, paths);
  f.report({...first.data, result: 'PASS'});
  for (const locale of locales) f.write(paths[locale], first.projected[locale].bytes);
  const deployed = f.commit();

  // A valid final seal alone must not authorize a change to an existing URL.
  f.writePair(paths, 'Revised version', 'draft: true\nslug: changed-route\n');
  const revised = f.commit();
  const replacement = await identities(revised, paths);
  f.report({...replacement.data, result: 'PASS'});
  for (const locale of locales) f.write(paths[locale], replacement.projected[locale].bytes);
  await assert.rejects(plan(f.commit(), deployed), /Public article route changed/);
});

test('an article revision preserving its FR/EN route remains publishable', async t => {
  const f = fixture(t);
  const paths = articlePair('stable.md');
  f.writePair(paths, 'First version', 'draft: true\nslug: permanent-route\n');
  const draft = f.commit();
  const first = await identities(draft, paths);
  f.report({...first.data, result: 'PASS'});
  for (const locale of locales) f.write(paths[locale], first.projected[locale].bytes);
  const deployed = f.commit();

  f.writePair(paths, 'Updated version', 'draft: true\nslug: permanent-route\n');
  const revised = f.commit();
  const replacement = await identities(revised, paths);
  f.report({...replacement.data, result: 'PASS'});
  for (const locale of locales) f.write(paths[locale], replacement.projected[locale].bytes);
  assert.match((await plan(f.commit(), deployed)).join('\n'), /Public article\/permanent-route/);
});


test('first deployment refuses an unsealed public placeholder', async t => {
  const f = fixture(t);
  await assert.rejects(plan(f.initial), /Unsealed published content: .*page\/about\.md/);
});

test('first deployment accepts a public page verified through the normal workflow', async t => {
  const f = fixture(t);
  const candidate = pageDraftPair('about.md');
  const canonical = pagePair('about.md');
  f.writePair(candidate, 'Reviewed introduction');
  const draft = f.commit();
  const {data, projected} = await identities(draft, candidate, canonical);
  f.report({...data, result: 'PASS'});
  for (const locale of locales) {
    f.write(canonical[locale], projected[locale].bytes);
    f.remove(candidate[locale]);
  }
  assert.match((await plan(f.commit())).join('\n'), /Public page\/about/);
});

test('an unchanged legacy page may remain unsealed after a deployment', async t => {
  const f = fixture(t);
  assert.deepEqual(await plan(f.initial, f.initial), ['No public content changes']);
});
