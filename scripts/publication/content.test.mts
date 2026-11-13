import assert from 'node:assert/strict';
import test from 'node:test';
import {normalize, project, provenance, readArticle, readMarkdown, sha256} from './content.mts';

const path = 'blog/2026-11-06-test.mdx';
const body = '\n# Café\n\nDeux espaces  \n\n<Example value={1} />\n';
const fields = `title: "Un café"
slug: /test
date: 2026-11-06
rationale: .42p/rationale-units/topic/capture.md
rationaleContext:
  - .42p/rationale-units/context/capture.md
unknown:
  draft: true
  nested: [1, false, "2026-11-06", {other: value}]
`;
const article = (frontmatter: string, pathOverride = path) =>
  readArticle(Buffer.from(`---\n${frontmatter}---\n${body}`), pathOverride);

test('N uses canonical UTF-8/LF and preserves unknown values, dates, provenance and Markdown/MDX', async () => {
  const first = await article(fields + 'draft: true\n');
  const second = await readArticle(Buffer.from(`---\r\nunlisted: true\r\n${(fields + '---\n' + body).replaceAll('\n', '\r\n')}`), path);
  const bytes = normalize(first);
  assert.deepEqual(bytes, normalize(second));
  assert.equal(sha256(bytes), sha256(normalize(await readArticle(bytes, path))));
  const {fields: roundTrip, body: restored} = await readMarkdown(bytes, path);
  const {draft, ...expected} = first.fields;
  assert.deepEqual(roundTrip, expected);
  assert.equal(restored, body);
  assert.ok(roundTrip.date instanceof Date);
  assert.ok(bytes.includes('Café') && !bytes.includes('\r'));
});

test('P restores only the revision path and original slug or its absence', async () => {
  const candidate = await article(fields.replace('/test', '/preview') + 'draft: true\n', 'blog/temporary.mdx');
  for (const explicit of [false, true]) {
    const baseline = await article(explicit ? 'slug: /canonical\n' : '');
    const output = project(candidate, baseline);
    assert.equal(output.path, path);
    assert.deepEqual(output, project(candidate, baseline));
    const published = await readArticle(output.bytes, path);
    assert.equal(published.route, baseline.route);
    assert.equal(published.fields.slug, baseline.fields.slug);
    assert.equal(published.body, body);
    assert.equal(published.visibility, 'public');
    const {slug: ignored, draft, ...editorial} = candidate.fields;
    const {slug, ...final} = published.fields;
    assert.deepEqual(final, editorial);
  }
  const newArticle = project(candidate);
  assert.equal(newArticle.path, candidate.path);
  assert.equal((await readArticle(newArticle.bytes, newArticle.path)).route, candidate.route);
  assert.deepEqual(newArticle.bytes, normalize(candidate));
});

test('ambiguous YAML, lossy values and malformed delimiters fail closed', async () => {
  for (const invalid of [
    '---\na: 1\na: 2\n---\n',
    '---\nnested: {a: 1, a: 2}\n---\n',
    '---\nx: &x {a: b}\ny: *x\n---\n',
    '---\n{x: {1: value}}\n---\n',
    '---\nx: 9007199254740993\n---\n',
    '---\nx: .inf\n---\n',
    '---\nx: "\\uD800"\n---\n',
    '---\n[one, two]\n---\n',
    '---\ntitle: two',
    '---\nx: 1\n---extra\n',
    '---js\nx: 1\n---\n',
  ]) {
    await assert.rejects(readMarkdown(Buffer.from(invalid), path), Error, invalid);
  }
  await assert.rejects(readMarkdown(Buffer.from([0xc3, 0x28]), path));
  await assert.rejects(article('draft: "true"\n'));
  await assert.rejects(article('draft: true\nunlisted: true\n'));
});

test('provenance requires a valid sole main Capture and distinct context paths', async () => {
  assert.deepEqual(provenance(await article('')), {main: undefined, context: undefined});
  assert.equal(provenance(await article(fields)).main, '.42p/rationale-units/topic/capture.md');
  assert.equal(provenance(await article(fields)).context?.[0], '.42p/rationale-units/context/capture.md');
  for (const value of [
    'rationale: [.42p/rationale-units/topic/capture.md]\n',
    'rationale: .42p/rationale-units/../capture.md\n',
    'rationaleContext: [.42p/rationale-units/topic/capture.md]\n',
    fields.replace('units/context', 'units/topic'),
    fields.replace('  - .42p/rationale-units/context/capture.md',
      '  - .42p/rationale-units/context/capture.md\n  - .42p/rationale-units/context/capture.md'),
  ]) {
    const markdown = await article(value);
    assert.throws(() => provenance(markdown));
  }
});

test('page draft projects to the native FR/EN page routes without exposure', async () => {
  const {readDocument, pageDraftPair, pagePair, documentPath} = await import('./content.mts');
  const draftPaths = pageDraftPair('topics/intro.md');
  assert.deepEqual(draftPaths, {
    fr: 'src/drafts/pages/fr/topics/intro.md',
    en: 'src/drafts/pages/en/topics/intro.md',
  });
  const targetPaths = pagePair('topics/intro.md');
  for (const locale of ['fr', 'en'] as const) {
    const draft = await readDocument(Buffer.from('---\ntitle: Intro\ndraft: true\n---\n# Introduction\n'), draftPaths[locale]);
    assert.equal(draft.visibility, 'draft');
    assert.equal(draft.kind, 'page');
    const target = project(draft);
    assert.equal(target.path, targetPaths[locale]);
    const published = await readDocument(target.bytes, target.path);
    assert.equal(published.visibility, 'public');
    assert.equal(published.route, '/blog/' + (locale === 'en' ? 'en/' : '') + 'topics/intro/');
    assert.equal(published.body, draft.body);
    assert.equal(documentPath(draft.path)?.source, 'candidate');
  }
  await assert.rejects(readDocument(Buffer.from('---\nunlisted: true\n---\n# Preview\n'), draftPaths.fr));
});
