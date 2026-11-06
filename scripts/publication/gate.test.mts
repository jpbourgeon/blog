import assert from 'node:assert/strict';
import {execFileSync} from 'node:child_process';
import {mkdirSync, mkdtempSync, rmSync, writeFileSync} from 'node:fs';
import {tmpdir} from 'node:os';
import {dirname, join} from 'node:path';
import test, {type TestContext} from 'node:test';
import {stringify} from 'yaml';
import {articlePair, type Pair, locales, pagePaths, standards} from './content.mts';
import {plan} from './gate.mts';
import {Repository} from './git.mts';
import {identities, inventory, readReview, reviewPath, type Review} from './review.mts';

const canonical = articlePair('2026-11-06-article.md');
const preview = articlePair('2026-11-06-preview.mdx');
const main = '.42p/rationale-units/topic/capture.md';
const context = '.42p/rationale-units/context/capture.md';
const authority = 'Human editorial approval: not granted by this report';
const note = 'Fixture evidence, independently constructed by the test.';

function fixture(t: TestContext) {
  const dir = mkdtempSync(join(tmpdir(), 'blog-publication-'));
  t.after(() => rmSync(dir, {recursive: true, force: true}));
  execFileSync('git', ['init', '-q', '-b', 'main', dir]);
  const repo = new Repository(dir);
  repo.text('config', 'user.email', 'fixture@example.org');
  repo.text('config', 'user.name', 'Test fixture');
  const write = (path: string, content: string | Buffer) => {
    mkdirSync(dirname(join(dir, path)), {recursive: true});
    writeFileSync(join(dir, path), content);
  };
  const remove = (path: string) => rmSync(join(dir, path));
  const commit = () => {
    repo.text('add', '-A');
    repo.text('commit', '-qm', 'Test state');
    return repo.tree(repo.text('rev-parse', 'HEAD'));
  };
  for (const path of [...standards, ...pagePaths, main, context, '.github/workflows/pages.yml']) write(path, '# Fixture\n');
  const baseline = commit();
  function pair(paths: Pair<string>, options: {visibility?: string; provenance?: string; text?: string; slug?: string} = {}) {
    for (const locale of locales) {
      write(paths[locale], `---\ntitle: Example ${locale}\n${options.slug ? 'slug: ' + options.slug + '\n' : ''}` +
        `${options.visibility ?? ''}${options.provenance ?? ''}---\n# Example\n\n${options.text ?? 'First version'} ${locale}.\n`);
    }
  }
  function writeReview(review: Review) {
    const path = reviewPath(review.article);
    write(path, `---\n${stringify(review)}---\n${note}\n\n${authority}\n`);
    return path;
  }
  async function review(paths: Pair<string>, original?: Pair<string>, verdict: Review['result'] = 'PASS') {
    const candidate = commit();
    const {data, projected} = await identities(candidate, paths, original);
    const path = writeReview({...data, result: verdict});
    const checked = commit();
    return {path, data, projected, checked};
  }
  return {repo, baseline, write, remove, commit, pair, review, writeReview};
}

const withMain = `rationale: ${main}\n`;
const withContext = withMain + `rationaleContext: [${context}]\n`;

test('fresh exposure of a draft or preview and technical-only dispatch are distinguished', async t => {
  const f = fixture(t);
  assert.equal((await plan(f.baseline, 'bootstrap')).articles.length, 0);
  await assert.rejects(plan(f.baseline, 'publish'), /verified deployed commit/);
  f.pair(canonical, {visibility: 'draft: true\n'});
  const draft = f.commit();
  assert.equal((await plan(draft, 'publish', f.baseline)).articles.length, 0);
  f.pair(canonical, {visibility: 'unlisted: true\n', provenance: withMain});
  const first = f.commit();
  assert.match((await plan(first, 'publish', draft)).classification[0], /First preview exposure/);
  await assert.rejects(plan(first, 'bootstrap'), /exposed article/);
  f.pair(canonical, {visibility: 'unlisted: true\n', provenance: withMain, text: 'New preview text'});
  const update = f.commit();
  assert.match((await plan(update, 'publish', first)).classification[0], /Updated preview/);
  f.write('README.md', 'Technical-only change');
  assert.deepEqual((await plan(f.commit(), 'publish', update)).classification, ['Only non-rendering files changed']);
});

test('initial bilingual publication binds an earlier review and permits changed context contents', async t => {
  const f = fixture(t);
  f.pair(canonical, {visibility: 'draft: true\n', provenance: withContext});
  const {path, checked} = await f.review(canonical);
  const report = await readReview(checked, path);
  assert.deepEqual(report.references.map(ref => ref.path), [...standards, main]);
  f.write(context, '# Later context');
  f.pair(canonical, {visibility: 'unlisted: true\n', provenance: withContext});
  f.commit();
  f.pair(canonical, {provenance: withContext});
  const promoted = f.commit();
  f.write('README.md', 'Technical-only follow-up');
  const latest = f.commit();
  assert.equal((await plan(latest, 'publish', f.baseline)).articles.length, 2);
  assert.equal((await plan(latest, 'publish', promoted)).articles.length, 2);
  f.remove(context);
  await assert.rejects(plan(f.commit(), 'publish', promoted), /Missing .*context/);
});

test('revision identity uses the real baseline and promotes both exact projections atomically', async t => {
  const f = fixture(t);
  f.pair(canonical, {provenance: withMain, slug: '/published'});
  const deployed = f.commit();
  f.pair(preview, {visibility: 'unlisted: true\n', provenance: withMain, slug: '/preview', text: 'Second version'});
  const unbound = f.commit();
  await assert.rejects(inventory(unbound), /unbound/);
  const {data, projected} = await identities(unbound, preview, canonical);
  f.writeReview({...data, result: 'INCONCLUSIVE'});
  const prepared = f.commit();
  assert.equal((await plan(prepared, 'publish', deployed)).articles.length, 4);
  f.writeReview({...data, result: 'PASS'});
  f.commit();
  for (const locale of locales) {
    f.write(canonical[locale], projected[locale].bytes);
    f.remove(preview[locale]);
  }
  const target = f.commit();
  const final = await plan(target, 'publish', deployed);
  assert.deepEqual(final.articles.map(article => article.route).sort(), ['/blog/en/published/', '/blog/published/']);
});

for (const variant of [
  'missing', 'fail', 'inconclusive', 'simultaneous', 'report-edited', 'standard', 'main-capture',
  'context-field', 'slug', 'partial', 'wrong-references', 'additional-change',
] as const) {
  test(`initial publication rejects ${variant}`, async t => {
    const f = fixture(t);
    f.pair(canonical, {visibility: 'draft: true\n', provenance: withContext});
    const candidate = f.commit();
    const {data} = await identities(candidate, canonical);
    const altered = variant === 'wrong-references' ? {...data, references: data.references.slice(0, 2)} : data;
    const report: Review = {...altered, result: variant === 'fail' ? 'FAIL' : variant === 'inconclusive' ? 'INCONCLUSIVE' : 'PASS'};
    if (variant !== 'missing' && variant !== 'simultaneous') {
      f.writeReview(report);
      f.commit();
    }
    if (variant === 'standard' || variant === 'main-capture') {
      f.write(variant === 'standard' ? standards[0] : main, 'Changed evidence');
      f.commit();
    }
    f.pair(canonical, {
      provenance: variant === 'context-field' ? withMain : withContext,
      slug: variant === 'slug' ? '/changed' : undefined,
    });
    if (variant === 'simultaneous') f.writeReview(report);
    if (variant === 'partial') f.write(canonical.en, `---\ndraft: true\n${withContext}---\n# Draft\n`);
    if (variant === 'additional-change') f.write('README.md', 'Additional change in promotion');
    let target = f.commit();
    if (variant === 'report-edited') {
      f.writeReview({...report, result: 'FAIL'});
      target = f.commit();
    }
    await assert.rejects(plan(target, 'publish', f.baseline));
  });
}

for (const variant of ['baseline-edited', 'one-candidate-left', 'wrong-bytes', 'candidate-edited'] as const) {
  test(`revision rejects ${variant}`, async t => {
    const f = fixture(t);
    f.pair(canonical);
    const deployed = f.commit();
    f.pair(preview, {visibility: 'draft: true\n', slug: '/preview', text: 'Revision'});
    const {projected} = await f.review(preview, canonical);
    if (variant === 'baseline-edited' || variant === 'candidate-edited') {
      if (variant === 'baseline-edited') f.pair(canonical, {text: 'Direct public edit'});
      else f.pair(preview, {visibility: 'draft: true\n', slug: '/preview', text: 'Unreviewed edit'});
      f.commit();
    }
    for (const locale of locales) {
      f.write(canonical[locale], variant === 'wrong-bytes' ? projected[locale].bytes.toString().replace('Revision', 'Different') :
        projected[locale].bytes);
      if (variant !== 'one-candidate-left' || locale === 'fr') f.remove(preview[locale]);
    }
    await assert.rejects(plan(f.commit(), 'publish', deployed));
  });
}

test('rejects a cumulative direct edit even behind a successful technical commit', async t => {
  const f = fixture(t);
  f.pair(canonical, {provenance: withMain});
  const deployed = f.commit();
  f.pair(canonical, {provenance: withMain, text: 'Direct edit'});
  f.commit();
  f.write('README.md', 'Unrelated change');
  await assert.rejects(plan(f.commit(), 'publish', deployed), /Missing .*editorial-reviews/);
});

test('no Capture is valid, while missing paths, duplicate ownership and FR/EN divergence fail', async t => {
  const f = fixture(t);
  f.pair(canonical, {visibility: 'draft: true\n'});
  const noCapture = await f.review(canonical);
  assert.deepEqual(noCapture.data.references.map(ref => ref.path), standards);
  f.pair(canonical, {visibility: 'draft: true\n', provenance: withMain});
  f.pair(preview, {visibility: 'draft: true\n', provenance: withMain});
  await assert.rejects(inventory(f.commit()), /more than one logical article/);
  for (const locale of locales) f.remove(preview[locale]);
  f.write(canonical.en, '---\ndraft: true\n---\n# Draft\n');
  await assert.rejects(inventory(f.commit()), /FR\/EN provenance/);
  f.pair(canonical, {visibility: 'draft: true\n', provenance: withContext});
  f.remove(context);
  await assert.rejects(inventory(f.commit()), /Missing .*context/);
});

test('permanent pages require a dedicated manual operation and unclassified inputs fail closed', async t => {
  const f = fixture(t);
  f.write(pagePaths[0], '# New permanent page text');
  const page = f.commit();
  await assert.rejects(plan(page, 'publish', f.baseline), /separate pages dispatch/);
  assert.match((await plan(page, 'pages', f.baseline)).classification[0], /Permanent page/);
  f.pair(canonical, {visibility: 'unlisted: true\n'});
  await assert.rejects(plan(f.commit(), 'pages', f.baseline), /exposed article/);
  f.write('docusaurus.config.ts', 'Potentially changed page output');
  await assert.rejects(plan(f.commit(), 'publish', page), /unclassified/);
  f.write('.github/workflows/other.yml', 'Alternate deploy');
  await assert.rejects(plan(f.commit(), 'publish', page), /alternate workflow/);
});

test('public output may not load executable MDX or unrelated Markdown as an asset', async t => {
  const f = fixture(t);
  for (const text of ["import Draft from './draft.mdx'\n\n<Draft />", '![Source](./draft.md)', '{process.env.SECRET}']) {
    f.pair(canonical, {visibility: 'unlisted: true\n', text});
    await assert.rejects(plan(f.commit(), 'publish', f.baseline), /Markdown|dependency/);
  }
});
