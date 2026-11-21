import {readFile, readdirSync} from 'node:fs';
import {createServer} from 'node:http';
import {join, relative, sep} from 'node:path';
import sirv from 'sirv';

export const base = '/blog/';

type PreflightPlan = {
  routes: string[];
  unchangedEditorial: string[];
  scanArtifact: boolean;
};

function *artifactPages(build: string): Generator<[string, string]> {
  for (const entry of readdirSync(build, {recursive: true, withFileTypes: true})) {
    if (!entry.isFile() || !/\.html?$/i.test(entry.name)) continue;
    const file = join(entry.parentPath, entry.name);
    const path = relative(build, file).split(sep).join('/');
    if (path === '404.html' || path === 'en/404.html') continue;
    const page = path.replace(/(^|\/)index\.html$/, '$1');
    yield [base + encodeURI(page).replace(/[?#]/g, encodeURIComponent), file];
  }
}

export function routesForPreflight(build: string, plan: PreflightPlan): string[] {
  const routes = new Set(plan.routes);
  if (!plan.scanArtifact) return [...routes];

  // Only unchanged editorial routes can be omitted from the artifact inventory.
  const unchanged = new Set(plan.unchangedEditorial);
  for (const [route] of artifactPages(build)) {
    if (!unchanged.has(route)) routes.add(route);
  }
  return [...routes];
}

export function createArtifactServer(build: string) {
  const serve = sirv(build);
  // sirv leaves escaped query/fragment separators untouched when looking up files.
  const escapedPages = new Map([...artifactPages(build)].filter(([route]) => /%(?:23|3F)/.test(route)));
  return createServer((request, response) => {
    if (!request.url?.startsWith(base)) {
      response.writeHead(404).end();
      return;
    }
    const escapedFile = escapedPages.get(request.url.split('?', 1)[0]);
    if (escapedFile) {
      readFile(escapedFile, (error, html) => {
        response.writeHead(error ? 500 : 200, {'Content-Type': 'text/html; charset=utf-8'}).end(html);
      });
      return;
    }
    request.url = request.url.slice(base.length - 1);
    serve(request, response);
  });
}
