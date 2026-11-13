import {createHash} from 'node:crypto';
import {isDeepStrictEqual} from 'node:util';
import {createProcessor} from '@mdx-js/mdx';
import {DEFAULT_PARSE_FRONT_MATTER} from '@docusaurus/utils';
import {isAlias, isMap, isPair, isScalar, parseDocument, stringify, visit} from 'yaml';

export const locales = ['fr', 'en'] as const;
export type Locale = (typeof locales)[number];
export type Pair<T> = Record<Locale, T>;
export type Fields = Record<string, unknown>;
export type Markdown = {fields: Fields; body: string};
export type Article = Markdown & {path: string; route: string; visibility: 'draft' | 'unlisted' | 'public'};

export function requireThat(condition: unknown, message: string): asserts condition {
  if (!condition) throw new Error(message);
}

export function record(value: unknown): value is Fields {
  return value !== null && typeof value === 'object' && Object.getPrototypeOf(value) === Object.prototype;
}

const utf8 = new TextDecoder('utf-8', {fatal: true, ignoreBOM: true});
export const sha256 = (bytes: string | Buffer) => createHash('sha256').update(bytes).digest('hex');

export async function readMarkdown(bytes: Buffer, filePath: string): Promise<Markdown> {
  const source = utf8.decode(bytes).replace(/\r\n?/g, '\n');
  requireThat(!source.startsWith('\uFEFF') && !source.includes('\0'), `Unsupported encoding in ${filePath}`);
  if (!source.startsWith('---') || source.startsWith('----')) return {fields: {}, body: source};

  // Gray matter stops at the first line starting with --- (even if it has a suffix).
  const opener = source.match(/^---(?:yaml)?\n/);
  requireThat(opener, `Expected YAML frontmatter in ${filePath}`);
  const afterOpener = source.slice(opener[0].length);
  const closer = /^---[^\n]*(?:\n|$)/m.exec(afterOpener);
  requireThat(closer && /^---\n?$/.test(closer[0]), `Invalid frontmatter delimiter in ${filePath}`);
  const document = parseDocument(afterOpener.slice(0, closer.index), {
    strict: true, uniqueKeys: true, intAsBigInt: true, customTags: ['timestamp'],
  });
  requireThat(!document.errors.length && !document.warnings.length,
    `Invalid YAML in ${filePath}: ${[...document.errors, ...document.warnings].join(', ')}`);
  requireThat(document.contents === null || isMap(document.contents), `Expected a mapping in ${filePath}`);
  visit(document, (_, node) => {
    requireThat(!isAlias(node) && !(typeof node === 'object' && node !== null && 'anchor' in node && node.anchor), `YAML aliases/anchors in ${filePath}`);
    if (isPair(node)) {
      requireThat(isScalar(node.key) && typeof node.key.value === 'string', `Non-string YAML key in ${filePath}`);
    }
    if (isScalar(node)) {
      requireThat(node.source !== '<<' || node.type !== 'PLAIN', `YAML merge key in ${filePath}`);
      if (typeof node.value === 'bigint') {
        requireThat(Number.isSafeInteger(Number(node.value)), `Unsafe YAML integer in ${filePath}`);
      }
    }
  });

  const body = afterOpener.slice(closer.index + closer[0].length);
  const parsed = await DEFAULT_PARSE_FRONT_MATTER({filePath, fileContent: source});
  requireThat(record(parsed.frontMatter) && parsed.content === body.trim(),
    `Docusaurus interprets the frontmatter differently in ${filePath}`);
  checkValues(parsed.frontMatter, filePath);
  return {fields: parsed.frontMatter, body};
}

function checkValues(value: unknown, path: string): void {
  if (record(value)) {
    for (const [key, item] of Object.entries(value)) {
      requireThat(key !== '__proto__' && key !== 'constructor' && key !== 'prototype', `Unsafe YAML key in ${path}`);
      checkValues(key, path);
      checkValues(item, path);
    }
  } else if (Array.isArray(value)) {
    for (const item of value) checkValues(item, path);
  } else {
    requireThat(value === null || typeof value === 'boolean' ||
      (typeof value === 'string' && value === value.toWellFormed()) ||
      (typeof value === 'number' && Number.isFinite(value)) ||
      (value instanceof Date && Number.isFinite(value.getTime())), `Unsupported YAML value in ${path}`);
  }
}

function serialize({fields, body}: Markdown): string {
  const yaml = stringify(fields, {
    customTags: ['timestamp'],
    defaultStringType: 'QUOTE_DOUBLE',
    defaultKeyType: 'QUOTE_DOUBLE',
    sortMapEntries: true,
    lineWidth: 0,
  });
  return `---\n${yaml}---\n${body}`;
}

function editorialFields(fields: Fields): Fields {
  const {draft, unlisted, ...editorial} = fields;
  return editorial;
}

export function normalize(markdown: Markdown): Buffer {
  return Buffer.from(serialize({fields: editorialFields(markdown.fields), body: markdown.body}));
}

export function project(candidate: Article | Document, baseline?: Article | Document): {path: string; bytes: Buffer} {
  const fields = editorialFields(candidate.fields);
  const document = candidate as Document;
  if (document.kind === 'page') {
    requireThat(document.source === 'candidate' && (!baseline || (baseline as Document).kind === 'page'),
      'Pages must be prepared outside the published site');
    requireThat(!Object.hasOwn(fields, 'slug'), 'Native pages use their path as identity');
    const target = baseline?.path ?? pagePair(document.key)[document.locale];
    return {path: target, bytes: Buffer.from(serialize({fields, body: candidate.body}))};
  }
  if (baseline) {
    requireThat(candidate.path !== baseline.path && candidate.route !== baseline.route &&
      typeof candidate.fields.slug === 'string', 'Article revision needs a distinct preview slug');
    if (Object.hasOwn(baseline.fields, 'slug')) fields.slug = baseline.fields.slug;
    else delete fields.slug;
  }
  return {path: baseline?.path ?? candidate.path, bytes: Buffer.from(serialize({fields, body: candidate.body}))};
}

const blogRoots: Pair<string> = {fr: 'blog/', en: 'i18n/en/docusaurus-plugin-content-blog/'};
export const capturePattern = /^\.42p\/rationale-units\/[a-z0-9]+(?:-[a-z0-9]+)*\/capture\.md$/;
export const standards = ['standards/editorial.md', 'standards/voice.md'];

export function articlePath(path: string): {locale: Locale; key: string} | undefined {
  for (const locale of locales) {
    if (!path.startsWith(blogRoots[locale])) continue;
    const key = path.slice(blogRoots[locale].length);
    if (key.split('/').some(part => part.startsWith('_'))) return undefined;
    if (/^(?:[A-Za-z0-9][A-Za-z0-9._-]*\/)*[A-Za-z0-9][A-Za-z0-9._-]*\.mdx?$/.test(key)) {
      return {locale, key};
    }
  }
  return undefined;
}

export function articlePair(key: string): Pair<string> {
  return {fr: blogRoots.fr + key, en: blogRoots.en + key};
}

export type Kind = 'article' | 'page';
export type Document = Article & {kind: Kind; key: string; locale: Locale; source: 'canonical' | 'candidate'};
const pageRoots: Pair<string> = {fr: 'src/pages/', en: 'i18n/en/docusaurus-plugin-content-pages/'};
const pageDraftRoots: Pair<string> = {fr: 'src/drafts/pages/fr/', en: 'src/drafts/pages/en/'};

export function pagePair(key: string): Pair<string> {
  return {fr: pageRoots.fr + key, en: pageRoots.en + key};
}
export function pageDraftPair(key: string): Pair<string> {
  return {fr: pageDraftRoots.fr + key, en: pageDraftRoots.en + key};
}
export function documentPath(path: string):
  {kind: Kind; locale: Locale; key: string; source: 'canonical' | 'candidate'} | undefined {
  const article = articlePath(path);
  if (article) return {kind: 'article', ...article, source: 'canonical'};
  for (const locale of locales) {
    for (const [root, source] of [[pageRoots[locale], 'canonical'], [pageDraftRoots[locale], 'candidate']] as const) {
      if (!path.startsWith(root)) continue;
      const key = path.slice(root.length);
      if (/^(?:[A-Za-z0-9][A-Za-z0-9._-]*\/)*[A-Za-z0-9][A-Za-z0-9._-]*\.mdx?$/.test(key) &&
          !key.split('/').some(part => part.startsWith('_'))) {
        return {kind: 'page', locale, key, source};
      }
    }
  }
}

export async function readArticle(bytes: Buffer, path: string): Promise<Article> {
  const identity = articlePath(path);
  requireThat(identity, `Unsupported article path: ${path}`);
  const markdown = await readMarkdown(bytes, path);
  const {draft, unlisted, slug} = markdown.fields;
  requireThat((draft === undefined || typeof draft === 'boolean') &&
    (unlisted === undefined || typeof unlisted === 'boolean') && !(draft && unlisted),
    `Invalid visibility fields in ${path}`);
  // Docusaurus 3.10.2 defaults to a dated path when the filename encodes a date.
  // The production build independently checks the computed route against plugin metadata.
  const dated = identity.key.match(/^(?<folder>.*)(?<date>\d{4}[-/]\d{1,2}[-/]\d{1,2})[-/]?(?<text>.*?)(?:\/index)?\.mdx?$/)?.groups;
  const implicit = dated ? dated.date.replace(/-/g, '/') + '/' + dated.folder + dated.text :
    identity.key.replace(/(?:\/index)?\.mdx?$/, '');
  const routeSlug = typeof slug === 'string' ? slug.replace(/^\//, '') : implicit;
  requireThat((slug === undefined || typeof slug === 'string') &&
    /^(?:[A-Za-z0-9][A-Za-z0-9._-]*\/)*[A-Za-z0-9][A-Za-z0-9._-]*\/?$/.test(routeSlug),
    `Unsupported or ambiguous article slug in ${path}`);
  requireThat(!/^(en|about|assets|page|tags|authors|404(?:\.html)?|__server)(\/|$)/i.test(routeSlug),
    `Article route overlaps a reserved site route: ${path}`);
  return {
    ...markdown, path,
    route: `/blog/${identity.locale === 'en' ? 'en/' : ''}${routeSlug.replace(/\/$/, '')}/`,
    visibility: draft ? 'draft' : unlisted ? 'unlisted' : 'public',
  };
}


/** A publication is content, never an executable MDX dependency graph. */
function requireStaticMarkdown(body: string, path: string) {
  let root: ReturnType<ReturnType<typeof createProcessor>['parse']>;
  try {
    root = createProcessor().parse(body);
  } catch {
    throw new Error('Executable MDX or JSX dependency or invalid MDX syntax: ' + path);
  }
  const forbidden = new Set([
    'mdxjsEsm', 'mdxFlowExpression', 'mdxTextExpression',
    'mdxJsxFlowElement', 'mdxJsxTextElement',
  ]);
  const visit = (node: {type: string; children?: unknown[]}) => {
    requireThat(!forbidden.has(node.type),
      'Executable MDX or JSX dependency not permitted in editorial content: ' + path);
    for (const child of node.children ?? []) visit(child as {type: string; children?: unknown[]});
  };
  visit(root);
}

export async function readDocument(bytes: Buffer, path: string): Promise<Document> {
  const id = documentPath(path);
  requireThat(id, 'Unsupported editorial content: ' + path);
  if (id.kind === 'article') {
    const article = await readArticle(bytes, path);
    requireStaticMarkdown(article.body, path);
    return {...article, ...id};
  }
  const markdown = await readMarkdown(bytes, path);
  requireStaticMarkdown(markdown.body, path);
  requireThat(!Object.hasOwn(markdown.fields, 'slug') &&
    markdown.fields.unlisted === undefined, 'Native pages do not use slug/unlisted: ' + path);
  if (id.source === 'candidate') {
    requireThat(markdown.fields.draft === true, 'Page candidates must be drafts: ' + path);
  } else {
    requireThat(markdown.fields.draft === undefined, 'Published pages cannot have draft: ' + path);
  }
  const pathSlug = id.key.replace(/(?:\/index)?\.mdx?$/, '');
  requireThat(pathSlug !== '' && !/^(?:en|tags|authors|page|search|404)(\/|$)/.test(pathSlug),
    'Reserved page route: ' + path);
  return {
    ...markdown,
    ...id,
    path,
    route: '/blog/' + (id.locale === 'en' ? 'en/' : '') + pathSlug + '/',
    visibility: id.source === 'candidate' ? 'draft' : 'public',
  };
}

export function provenance(article: Article): {main?: string; context?: string[]} {
  const {rationale, rationaleContext} = article.fields;
  requireThat(rationale === undefined || (typeof rationale === 'string' && capturePattern.test(rationale)),
    `Invalid rationale in ${article.path}`);
  requireThat(rationaleContext === undefined || (rationale !== undefined && Array.isArray(rationaleContext) &&
    rationaleContext.length > 0 && rationaleContext.every(path => typeof path === 'string' &&
      capturePattern.test(path) && path !== rationale) && new Set(rationaleContext).size === rationaleContext.length),
    `Invalid rationaleContext in ${article.path}`);
  return {main: rationale as string | undefined, context: rationaleContext as string[] | undefined};
}

export function sameProvenance(pair: Pair<Article>) {
  const french = provenance(pair.fr);
  requireThat(isDeepStrictEqual(french, provenance(pair.en)), `FR/EN provenance differs for ${pair.fr.path}`);
  return french;
}
