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
import {routesForPreflight} from './preflight-routes.mts';

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
  assert.match((await plan(published)).join('\n'), /Public page\/note/);
  assert.match(location, /design\/page_note\/verification\.md/);

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
    assert.equal(reviewed.blob(publicReport), deployed.blob(publicReport));
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
  assert.deepEqual(await plan(promoted, deployed), ['Public page/profile']);
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

test('a page with JSX requires a PASS for the exact reviewed source', async t => {
  const f = fixture(t);
  const candidates = pageDraftPair('profile.mdx');
  const body = '<div style={{ display: "flex" }}><img src="/blog/img/avatar.webp" alt="Portrait" /></div>';
  f.writePair(candidates, body);
  const {data, projected} = await identities(f.commit(), candidates);
  f.report({...data, result: 'PASS'});
  f.commit();

  for (const locale of locales) {
    f.write(projected[locale].path, projected[locale].bytes);
    f.remove(candidates[locale]);
  }
  const published = f.commit();
  assert.match((await plan(published, f.initial)).join('\n'), /Public page\/profile/);

  for (const locale of locales) {
    f.write(projected[locale].path, projected[locale].bytes.toString().replace('Portrait', 'Photo'));
    await assert.rejects(plan(f.commit(), published), /Published content differs from verified target/);
    f.write(projected[locale].path, projected[locale].bytes);
  }
});

test('the manual gate supplies FR/EN routes for all new pages and representative affected pages', async t => {
  const f = fixture(t);
  f.write('src/pages/retired.tsx', 'export default function Page() {}');
  f.writePair(articlePair('preview.md'), 'Deployed preview', 'unlisted: true\n');
  f.writePair(articlePair('spare.md'), 'Another deployed preview', 'unlisted: true\n');
  const deployed = f.commit();
  const pages = [pageDraftPair('one.md'), pageDraftPair('two.md')];
  for (const paths of pages) f.writePair(paths, 'Independent');
  f.writePair(pageDraftPair('private.md'), 'Private candidate');
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
  const editorialOnly = await publicationPlan(published, deployed);
  assert.ok(editorialOnly.preflight.scanArtifact);
  assert.ok(!editorialOnly.preflight.routes.includes('/blog/preview/'));

  f.write('src/pages/tools/index.tsx', 'export default function Page() {}');
  f.write('src/pages/_partial.tsx', 'export default function Page() {}');
  f.write('src/css/custom.css', 'main { margin: auto; }');
  f.remove('src/pages/retired.tsx');
  f.write('static/legal-fr/index.html', '<main>Légal</main>');
  f.write('static/legal-en.html', '<main>Legal</main>');
  f.commit();

  const output = join(f.repo.root, '.git', 'gate-output');
  const report = execFileSync(process.execPath, [publicationCli, 'gate', deployed.commit], {
    cwd: f.repo.root,
    encoding: 'utf8',
    env: {...process.env, GITHUB_OUTPUT: output},
  });
  assert.match(report, /Public page\/one/);
  assert.match(report, /Public page\/two/);
  const plan = JSON.parse(readFileSync(output, 'utf8').trim().replace(/^preflight=/, ''));
  const artifact = [
    'index.html', 'about/index.html', 'one/index.html', 'two/index.html',
    'tools/index.html', 'tags/collection/index.html', 'legal-fr/index.html',
    'legal-en.html', 'preview/index.html', 'spare/index.html', '404.html',
  ];
  for (const locale of ['', 'en/']) {
    for (const file of artifact) f.write('.git/build/' + locale + file, '<main>Built</main>');
  }
  f.write('.git/build/mentions légales/index.html', '<main>Built</main>');
  const routes = routesForPreflight(join(f.repo.root, '.git', 'build'), plan);
  assert.deepEqual(new Set(routes), new Set([
    '/blog/', '/blog/about/', '/blog/one/', '/blog/two/', '/blog/tools/', '/blog/preview/',
    '/blog/tags/collection/', '/blog/legal-fr/', '/blog/legal-en.html', '/blog/mentions%20l%C3%A9gales/',
    '/blog/en/', '/blog/en/about/', '/blog/en/one/', '/blog/en/two/', '/blog/en/tools/',
    '/blog/en/preview/', '/blog/en/tags/collection/', '/blog/en/legal-fr/', '/blog/en/legal-en.html',
  ]));
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

test('a prior PASS remains valid after standards evolve without a content revision', async t => {
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
  const published = f.commit();
  f.write(standards[0], '# Updated editorial standard\n');
  const evolved = f.commit();
  assert.match((await plan(evolved, published)).join('\n'), /No public content changes/);
});

test('a new PASS binds the actual standards at the time of verification', async t => {
  const f = fixture(t);
  const paths = pageDraftPair('new-standard.md');
  f.writePair(paths, 'Before the standard changed');
  const draft = f.commit();
  const before = await identities(draft, paths);
  f.write(standards[0], '# Updated editorial standard\n');
  const changed = f.commit();
  const after = await identities(changed, paths);
  assert.notDeepEqual(before.data.references, after.data.references);
  // A candidate sealed against previous references cannot be promoted
  // without a new verification; this does not affect already published work.
  assert.throws(
    () => matchReview({...before.data, result: 'PASS'}, after.data),
    /Stale or inapplicable editorial report/,
  );
  assert.doesNotThrow(() => matchReview({...after.data, result: 'PASS'}, after.data));
});

test('a public page cannot be replaced by a new route without withdrawal', async t => {
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
  await assert.rejects(plan(f.commit(), f.initial), /Exposed content must be withdrawn before deletion/);
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
  await assert.rejects(plan(f.commit(), deployed), /Exposed article route changed/);
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

test('a deployed article must be withdrawn as draft before deletion', async t => {
  const f = fixture(t);
  const paths = articlePair('withdraw.md');
  f.writePair(paths, 'Published', 'draft: true\n');
  const candidate = f.commit();
  const first = await identities(candidate, paths);
  f.report({...first.data, result: 'PASS'});
  for (const locale of locales) f.write(paths[locale], first.projected[locale].bytes);
  const publicState = f.commit();

  for (const locale of locales) f.remove(paths[locale]);
  await assert.rejects(plan(f.commit(), publicState), /Exposed content must be withdrawn before deletion/);

  f.writePair(paths, 'Published', 'draft: true\n');
  const withdrawn = f.commit();
  assert.match((await plan(withdrawn, publicState)).join('\n'), /Withdrawn article\/withdraw/);

  for (const locale of locales) f.remove(paths[locale]);
  assert.deepEqual(await plan(f.commit(), withdrawn), ['No public content changes']);
});

test('a deployed page must move to an off-site draft before deletion', async t => {
  const f = fixture(t);
  const pages = pagePair('about.md');
  const draft = pageDraftPair('about.md');

  for (const locale of locales) {
    f.write(draft[locale], '---\ntitle: About\ndraft: true\n---\n# About\n');
    f.remove(pages[locale]);
  }
  const withdrawn = f.commit();
  assert.match((await plan(withdrawn, f.initial)).join('\n'), /Withdrawn page\/about/);

  for (const locale of locales) f.remove(draft[locale]);
  assert.deepEqual(await plan(f.commit(), withdrawn), ['No public content changes']);
});

test('unlisted is still public and cannot serve as withdrawal', async t => {
  const f = fixture(t);
  const paths = articlePair('preview.md');
  f.writePair(paths, 'Published');
  const candidate = f.commit();
  const {data, projected} = await identities(candidate, paths);
  f.report({...data, result: 'PASS'});
  for (const locale of locales) f.write(paths[locale], projected[locale].bytes);
  const publicState = f.commit();

  f.writePair(paths, 'Published', 'unlisted: true\n');
  const stillExposed = f.commit();
  assert.match((await plan(stillExposed, publicState)).join('\n'), /Unlisted preview/);
  for (const locale of locales) f.remove(paths[locale]);
  await assert.rejects(plan(f.commit(), stillExposed), /Exposed content must be withdrawn before deletion/);
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

test('a deployed unlisted article cannot be deleted without a deployed draft withdrawal', async t => {
  const f = fixture(t);
  const paths = articlePair('unlisted.md');
  f.writePair(paths, 'Accessible by URL', 'unlisted: true\n');
  const exposed = f.commit();
  for (const locale of locales) f.remove(paths[locale]);
  await assert.rejects(plan(f.commit(), exposed), /Exposed content must be withdrawn before deletion/);

  f.writePair(paths, 'Now private', 'draft: true\n');
  const withdrawn = f.commit();
  assert.match((await plan(withdrawn, exposed)).join('\n'), /Withdrawn article\/unlisted/);
  for (const locale of locales) f.remove(paths[locale]);
  assert.deepEqual(await plan(f.commit(), withdrawn), ['No public content changes']);
});

test('a deployed unlisted article cannot silently change route', async t => {
  const f = fixture(t);
  const paths = articlePair('preview-route.md');
  f.writePair(paths, 'Accessible by URL', 'unlisted: true\nslug: original-route\n');
  const exposed = f.commit();
  f.writePair(paths, 'Same article', 'unlisted: true\nslug: changed-route\n');
  await assert.rejects(plan(f.commit(), exposed), /Exposed article route changed/);
});

test('an unsealed public page is refused both initially and after deployment', async t => {
  const f = fixture(t);
  f.remove('.42p/design/page_about/verification.md');
  const target = f.commit();
  for (const baseline of [undefined, f.initial]) {
    await assert.rejects(plan(target, baseline), /Missing .*design\/page_about\/verification\.md/);
  }
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
