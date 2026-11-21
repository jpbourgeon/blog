import assert from 'node:assert/strict';
import {execFileSync} from 'node:child_process';
import {mkdirSync, mkdtempSync, readFileSync, rmSync, writeFileSync} from 'node:fs';
import {tmpdir} from 'node:os';
import {dirname, join} from 'node:path';
import test, {type TestContext} from 'node:test';
import {fileURLToPath} from 'node:url';
import {stringify} from 'yaml';
import {pageDraftPair, pagePair, articlePair, type Pair, locales, standards, normalize, sha256} from './content.mts';
import {Repository} from './git.mts';
import {identities, matchReview, readReview, reviewPath, revisionReviewPath, type Review} from './review.mts';
import {plan as publicationPlan} from './gate.mts';

async function plan(...args: Parameters<typeof publicationPlan>) {
  return (await publicationPlan(...args)).editorial;
}

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
  const seed = commit();
  const hash = sha256(normalize({fields: {title: 'About'}, body: '# About\n'}));
  const candidate = pageDraftPair('about.md');
  const signed: Review = {
    content: 'page/about',
    mode: 'new',
    candidates: {
      fr: {path: candidate.fr, content_sha256: hash},
      en: {path: candidate.en, content_sha256: hash},
    },
    targets: {
      fr: {path: about.fr, content_sha256: hash},
      en: {path: about.en, content_sha256: hash},
    },
    references: standards.map(path => ({path, git_blob_sha: seed.requireBlob(path)})),
    result: 'PASS',
  };
  write(reviewPath(signed.content), '---\n' + stringify(signed) +
    '---\nVerified evidence\n\n' + approvalNotice + '\n');
  const initial = commit();
  function writePair(paths: Pair<string>, body: string, state = 'draft: true\n') {
    for (const locale of locales) write(paths[locale],
      '---\ntitle: Example\n' + state + '---\n# Example\n\n' + body + ' ' + locale + '\n');
  }
  function report(review: Review, path = reviewPath(review.content)) {
    write(path, '---\n' + stringify(review) + '---\nVerified evidence\n\n' + approvalNotice + '\n');
    return path;
  }
  return {repo, initial, write, remove, commit, writePair, report};
}

const publicationCli = fileURLToPath(new URL('./cli.mts', import.meta.url));
function publication(repo: Repository, ...args: string[]) {
  return execFileSync(process.execPath, [publicationCli, ...args], {cwd: repo.root, encoding: 'utf8',
    stdio: ['ignore', 'pipe', 'pipe']});
}

test('the approval record lists the exact deployed-to-target delta including technical changes', t => {
  const f = fixture(t);
  f.write('static/old image.webp', 'old');
  f.write('docusaurus.config.ts', 'old');
  const deployed = f.commit();
  f.write('static/temporary.webp', 'intermediate');
  f.commit();
  f.remove('static/temporary.webp');
  f.remove('static/old image.webp');
  f.write('static/new image.webp', 'new');
  f.write('docusaurus.config.ts', 'new');
  f.write('src/components/Layout.tsx', 'layout');
  const target = f.commit();

  const report = publication(f.repo, 'gate', deployed.commit);
  assert.ok(report.includes(`Publication review: ${deployed.commit} -> ${target.commit}`));
  assert.match(report, /M "docusaurus.config.ts"/);
  assert.match(report, /A "src\/components\/Layout.tsx"/);
  assert.match(report, /A "static\/new image.webp"/);
  assert.match(report, /D "static\/old image.webp"/);
  assert.doesNotMatch(report, /temporary\.webp|verification\.md/);
  assert.match(publication(f.repo, 'gate', 'none'), /A "docusaurus.config.ts"/);
  assert.match(publication(f.repo, 'gate', target.commit), /No tracked changes/);
});

test('unlisted article previews are reported even on the first deployment', async t => {
  const f = fixture(t);
  const article = articlePair('preview.md');
  f.writePair(article, 'Preview', 'unlisted: true\n');
  const preview = f.commit();
  assert.match((await plan(preview)).join('\n'), /Unlisted preview: preview.md/);
  assert.match((await plan(preview, f.initial)).join('\n'), /Unlisted preview/);
});

test('a page revision with a shared Capture preserves the public PASS until promotion', async t => {
  const f = fixture(t);
  const draft = pageDraftPair('profile.md');
  const canonical = pagePair('profile.md');
  const capture = '.42p/design/page_profile/rationale.md';
  const frontmatter = 'draft: true\nrationale: ' + capture + '\n';
  f.write(capture, '# Profile\n');
  f.writePair(draft, 'Public version', frontmatter);
  const first = await identities(f.commit(), draft);
  const publicReport = f.report({...first.data, result: 'PASS'});
  for (const locale of locales) {
    f.write(canonical[locale], first.projected[locale].bytes);
    f.remove(draft[locale]);
  }
  const deployed = f.commit();
  f.writePair(draft, 'Revision', frontmatter);
  assert.deepEqual(await plan(f.commit(), deployed), ['No public content changes']);
  assert.throws(() => publication(f.repo, 'prepare', draft.fr, draft.en),
    /Existing canonical content requires a revision baseline/);
  const prepared = JSON.parse(publication(f.repo, 'prepare', draft.fr, draft.en, canonical.fr, canonical.en));
  assert.equal(prepared.report, revisionReviewPath('page/profile'));

  for (const result of ['FAIL', 'INCONCLUSIVE', 'PASS'] as const) {
    f.report({...prepared.frontmatter, result}, prepared.report);
    const reviewed = f.commit();
    for (const path of [canonical.fr, canonical.en, publicReport]) {
      assert.equal(reviewed.blob(path), deployed.blob(path));
    }
    assert.deepEqual(await plan(reviewed, deployed), ['No public content changes']);
    assert.match(publication(f.repo, 'check', prepared.report), new RegExp('Review ' + result));
    if (result !== 'PASS') {
      assert.throws(() => publication(f.repo, 'project', prepared.report), /matching PASS is required/);
    }
  }

  const sealed = f.repo.tree(f.repo.text('rev-parse', 'HEAD'));
  const promotion = JSON.parse(publication(f.repo, 'project', prepared.report));
  for (const {path, content} of promotion.write) f.write(path, content);
  for (const path of promotion.delete) f.remove(path);
  const promoted = f.commit();
  assert.equal(promoted.blob(publicReport), sealed.blob(prepared.report));
  for (const path of [draft.fr, draft.en, prepared.report]) assert.equal(promoted.blob(path), undefined);
  const review = await publicationPlan(promoted, deployed);
  assert.deepEqual(review.editorial, ['Public page/profile']);
  assert.deepEqual(review.preflight, ['/blog/profile/', '/blog/en/profile/']);
});

test('an article revision can prepare before its report without sharing a Capture with unrelated drafts', async t => {
  const f = fixture(t);
  const canonical = articlePair('article.md');
  const draft = articlePair('article-v2.md');
  const capture = '.42p/design/article_example/rationale.md';
  const frontmatter = 'draft: true\nrationale: ' + capture + '\n';
  f.write(capture, '# Article\n');
  f.writePair(canonical, 'Original', frontmatter);
  const first = await identities(f.commit(), canonical);
  f.report({...first.data, result: 'PASS'});
  for (const locale of locales) f.write(canonical[locale], first.projected[locale].bytes);
  const deployed = f.commit();
  f.writePair(draft, 'Revision', frontmatter + 'slug: article-v2\n');
  f.commit();
  const prepare = () => JSON.parse(publication(f.repo, 'prepare', draft.fr, draft.en, canonical.fr, canonical.en));
  const prepared = prepare();
  assert.equal(prepared.report, revisionReviewPath('article/article'));
  f.report({...prepared.frontmatter, result: 'FAIL'}, prepared.report);
  assert.deepEqual(await plan(f.commit(), deployed), ['No public content changes']);
  f.writePair(articlePair('unrelated.md'), 'Unrelated', frontmatter);
  const unrelated = f.commit();
  assert.throws(prepare, /Main Capture belongs to multiple contents/);
  await assert.rejects(plan(unrelated, deployed), /Main Capture belongs to multiple contents/);
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

test('the exact FR/EN Markdown/MDX projection requires an applicable PASS', async t => {
  const f = fixture(t);
  const candidates = pageDraftPair('profile.mdx');
  const body = '<div style={{ display: "flex" }}><img src="/blog/img/avatar.webp" alt="Portrait" /></div>';
  f.repo.text('checkout', '-qb', 'review');
  f.writePair(candidates, body);
  const {data, projected} = await identities(f.commit(), candidates);
  f.repo.text('checkout', '-q', 'main');

  for (const {path, bytes} of Object.values(projected)) f.write(path, bytes);
  const unsealed = f.commit();
  for (const baseline of [undefined, f.initial]) {
    await assert.rejects(plan(unsealed, baseline), /Missing .*design\/page_profile\/verification\.md/);
  }
  for (const result of ['FAIL', 'INCONCLUSIVE'] as const) {
    f.report({...data, result});
    await assert.rejects(plan(f.commit(), f.initial), /No PASS for publication/, result);
  }

  f.report({...data, result: 'PASS'});
  const published = f.commit();
  assert.match((await plan(published, f.initial)).join('\n'), /Public page\/profile/);
  for (const {path, bytes} of Object.values(projected)) {
    f.write(path, bytes.toString().replace('Portrait', 'Photo'));
    await assert.rejects(plan(f.commit(), published), /Published content differs from verified target/);
    f.write(path, bytes);
  }
});

test('the gate emits new FR/EN routes and samples the site only for technical changes', async t => {
  const f = fixture(t);
  const article = articlePair('reference.md');
  f.writePair(article, 'Published article');
  const {data, projected} = await identities(f.commit(), article);
  f.report({...data, result: 'PASS'});
  for (const {path, bytes} of Object.values(projected)) f.write(path, bytes);
  f.writePair(articlePair('preview.md'), 'Unchanged preview', 'unlisted: true\n');
  const deployed = f.commit();
  assert.deepEqual((await publicationPlan(deployed, deployed)).preflight, []);

  const pages = [pageDraftPair('one.md'), pageDraftPair('two.md')];
  for (const paths of pages) f.writePair(paths, 'New public page');
  f.writePair(pageDraftPair('private.md'), 'Private candidate');
  const drafts = f.commit();
  assert.deepEqual((await publicationPlan(drafts, deployed)).preflight, []);

  for (const paths of pages) {
    const {data, projected} = await identities(drafts, paths);
    f.report({...data, result: 'PASS'});
    for (const {path, bytes} of Object.values(projected)) f.write(path, bytes);
    for (const path of Object.values(paths)) f.remove(path);
  }
  const newRoutes = ['/blog/one/', '/blog/en/one/', '/blog/two/', '/blog/en/two/'];
  assert.deepEqual(new Set((await publicationPlan(f.commit(), deployed)).preflight), new Set(newRoutes));

  f.write('src/css/custom.css', 'main { margin: auto; }');
  f.write('src/pages/tools/index.tsx', 'export default function Page() {}');
  f.write('src/pages/_partial.tsx', 'export default function Partial() {}');
  f.commit();
  const output = join(f.repo.root, '.git', 'gate-output');
  execFileSync(process.execPath, [publicationCli, 'gate', deployed.commit], {
    cwd: f.repo.root,
    env: {...process.env, GITHUB_OUTPUT: output},
  });
  const record = readFileSync(output, 'utf8').trim();
  assert.match(record, /^preflight=/);
  assert.deepEqual(new Set(JSON.parse(record.slice('preflight='.length))), new Set([
    ...newRoutes, '/blog/tools/', '/blog/en/tools/',
    '/blog/', '/blog/en/', '/blog/about/', '/blog/en/about/', '/blog/reference/', '/blog/en/reference/',
  ]));
});

test('a changed standard invalidates a candidate seal while preserving the public PASS', async t => {
  const f = fixture(t);
  const paths = pageDraftPair('reference.md');
  f.writePair(paths, 'Verified with the original standard');
  const before = await identities(f.commit(), paths);
  f.write(standards[0], '# Updated editorial standard\n');
  const changed = f.commit();
  const after = await identities(changed, paths);
  assert.throws(() => matchReview({...before.data, result: 'PASS'}, after.data),
    /Stale or inapplicable editorial report/);
  assert.deepEqual(await plan(changed, f.initial), ['No public content changes']);
});

test('article revisions preserve exposed FR/EN routes for public articles and previews', async t => {
  const f = fixture(t);
  const article = articlePair('stable.md');
  const preview = articlePair('preview.md');
  f.writePair(article, 'First version', 'draft: true\nslug: permanent-route\n');
  const first = await identities(f.commit(), article);
  f.report({...first.data, result: 'PASS'});
  for (const {path, bytes} of Object.values(first.projected)) f.write(path, bytes);
  f.writePair(preview, 'Preview', 'unlisted: true\nslug: preview-route\n');
  const deployed = f.commit();

  for (const slug of ['permanent-route', 'changed-route']) {
    f.writePair(article, 'Updated version', 'draft: true\nslug: ' + slug + '\n');
    const replacement = await identities(f.commit(), article);
    f.report({...replacement.data, result: 'PASS'});
    for (const {path, bytes} of Object.values(replacement.projected)) f.write(path, bytes);
    const target = f.commit();
    if (slug === 'permanent-route') {
      assert.deepEqual(await plan(target, deployed), ['Public article/permanent-route']);
      assert.deepEqual((await publicationPlan(target, deployed)).preflight,
        ['/blog/permanent-route/', '/blog/en/permanent-route/']);
    } else {
      await assert.rejects(plan(target, deployed), /Exposed article route changed/);
    }
  }
  f.repo.text('reset', '--hard', deployed.commit);
  f.writePair(preview, 'Preview', 'unlisted: true\nslug: moved-preview\n');
  await assert.rejects(plan(f.commit(), deployed), /Exposed article route changed/);
});

test('deployed pages, articles and unlisted previews must be withdrawn before deletion', async t => {
  const f = fixture(t);
  const page = pagePair('about.md');
  const draft = pageDraftPair('about.md');
  const article = articlePair('published.md');
  const preview = articlePair('preview.md');
  f.writePair(article, 'Published');
  const {data, projected} = await identities(f.commit(), article);
  f.report({...data, result: 'PASS'});
  for (const {path, bytes} of Object.values(projected)) f.write(path, bytes);
  f.writePair(preview, 'Still accessible', 'unlisted: true\n');
  const exposed = f.commit();

  for (const paths of [page, article, preview]) {
    for (const path of Object.values(paths)) f.remove(path);
    await assert.rejects(plan(f.commit(), exposed), /Exposed content must be withdrawn before deletion/);
    for (const path of Object.values(paths)) f.write(path, exposed.read(path));
  }

  for (const locale of locales) {
    f.remove(page[locale]);
    f.write(draft[locale], '---\ntitle: About\ndraft: true\n---\n# About\n');
  }
  f.writePair(article, 'Published');
  f.writePair(preview, 'Still accessible');
  const withdrawn = f.commit();
  assert.deepEqual(new Set(await plan(withdrawn, exposed)), new Set([
    'Withdrawn page/about', 'Withdrawn article/published', 'Withdrawn article/preview',
  ]));
  assert.deepEqual((await publicationPlan(withdrawn, exposed)).preflight, ['/blog/', '/blog/en/']);

  for (const paths of [draft, article, preview]) {
    for (const path of Object.values(paths)) f.remove(path);
  }
  assert.deepEqual(await plan(f.commit(), withdrawn), ['No public content changes']);
});

test('a never-deployed draft and its rationale may be deleted directly', async t => {
  const f = fixture(t);
  const paths = articlePair('temporary.md');
  const capture = '.42p/design/temporary/rationale.md';
  f.write(capture, '# Temporary idea\n');
  for (const locale of locales) {
    f.write(paths[locale], '---\ntitle: Temporary\ndraft: true\nrationale: ' + capture + '\n---\n# Working copy\n');
  }
  f.commit();
  for (const locale of locales) f.remove(paths[locale]);
  f.remove(capture);
  assert.deepEqual(await plan(f.commit(), f.initial), ['No public content changes']);
});

test('a shared rationale cannot be deleted while another document still references it', async t => {
  const f = fixture(t);
  const capture = '.42p/design/shared/rationale.md';
  const paths = articlePair('retained.md');
  f.write(capture, '# Shared knowledge\n');
  for (const locale of locales) {
    f.write(paths[locale], '---\ntitle: Retained\ndraft: true\nrationale: ' + capture + '\n---\n# Keep me\n');
  }
  f.commit();
  f.remove(capture);
  await assert.rejects(plan(f.commit(), f.initial), /Missing/);
});

test('a migrated historical PASS still binds the exact FR/EN content and Capture locators', async t => {
  const f = fixture(t);
  const content = 'page/about';
  const paths = pagePair('about.md');
  const captures = {
    main: {old: '.42p/rationale-units/page_about/capture.md', current: '.42p/design/page_about/rationale.md'},
    context: {old: '.42p/rationale-units/context/capture.md', current: '.42p/design/context/rationale.md'},
  };
  const fields = (layout: 'old' | 'current') => ({
    title: 'About',
    rationale: captures.main[layout],
    rationaleContext: [captures.context[layout]],
  });
  const body = '# About\n';
  const historicalPath = '.42p/editorial-reviews/page/about.md';
  const currentPath = reviewPath(content);
  const report = await readReview(f.initial, currentPath);
  function writePair(layout: 'old' | 'current') {
    for (const locale of locales) f.write(paths[locale], '---\n' + stringify(fields(layout)) + '---\n' + body);
  }
  for (const capture of Object.values(captures)) f.write(capture.old, '# Capture\n');
  writePair('old');
  const prepared = f.commit();
  const hash = sha256(normalize({fields: fields('old'), body}));
  for (const locale of locales) {
    report.candidates[locale].content_sha256 = hash;
    report.targets[locale].content_sha256 = hash;
  }
  report.references.push({path: captures.main.old, git_blob_sha: prepared.requireBlob(captures.main.old)});
  f.remove(currentPath);
  f.report(report, historicalPath);
  const deployed = f.commit();

  for (const capture of Object.values(captures)) {
    f.write(capture.current, deployed.read(capture.old));
    f.remove(capture.old);
  }
  writePair('current');
  f.write(currentPath, deployed.read(historicalPath));
  f.remove(historicalPath);
  const migrated = f.commit();
  assert.equal(migrated.requireBlob(currentPath), deployed.requireBlob(historicalPath));
  assert.match((await plan(migrated, deployed)).join('\n'), /Public page\/about/);

  f.write(paths.en, '---\n' + stringify(fields('current')) + '---\n' + body + 'Changed\n');
  await assert.rejects(plan(f.commit(), deployed), /Published content differs from verified target/);

  f.write('.42p/design/other/rationale.md', '# Other\n');
  for (const locale of locales) f.write(paths[locale], '---\n' +
    stringify({...fields('current'), rationaleContext: ['.42p/design/other/rationale.md']}) + '---\n' + body);
  await assert.rejects(plan(f.commit(), deployed), /Published content differs from verified target/);
});

test('a nested article route keeps its identity and uses one design directory', async t => {
  const f = fixture(t);
  const article = articlePair('example.md');
  const capture = '.42p/design/article_series%2Fexample/rationale.md';
  f.write(capture, '# Capture\n');
  f.writePair(article, 'Nested article', 'draft: true\nslug: series/example\nrationale: ' + capture + '\n');
  const {data, projected} = await identities(f.commit(), article);
  assert.equal(data.content, 'article/series/example');
  const location = f.report({...data, result: 'PASS'});
  assert.equal(location, '.42p/design/article_series%2Fexample/verification.md');
  assert.equal(revisionReviewPath(data.content), '.42p/design/article_series%2Fexample/verification.revision.md');
  for (const locale of locales) f.write(article[locale], projected[locale].bytes);
  assert.match((await plan(f.commit(), f.initial)).join('\n'), /Public article\/series\/example/);
});
