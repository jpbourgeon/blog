import {readdirSync} from 'node:fs';
import {createServer} from 'node:http';
import {join, relative, sep} from 'node:path';
import sirv from 'sirv';

export const base = '/blog/';

type PreflightPlan = {
  routes: string[];
  unchangedEditorial: string[];
  scanArtifact: boolean;
};

export function routesForPreflight(build: string, plan: PreflightPlan): string[] {
  const routes = new Set(plan.routes);
  if (!plan.scanArtifact) return [...routes];

  // The artifact supplies native pages, listings and copied HTML. Only
  // unchanged editorial routes can be omitted from this inventory.
  const unchanged = new Set(plan.unchangedEditorial);
  for (const entry of readdirSync(build, {recursive: true, withFileTypes: true})) {
    if (!entry.isFile() || !/\.html?$/i.test(entry.name)) continue;
    const path = relative(build, join(entry.parentPath, entry.name)).split(sep).join('/');
    if (path === '404.html' || path === 'en/404.html') continue;
    const page = path.replace(/(^|\/)index\.html$/, '$1');
    // Keep URL path characters that sirv's decodeURI leaves escaped.
    const route = base + encodeURI(page).replace(/[?#]/g, encodeURIComponent);
    if (!unchanged.has(route)) routes.add(route);
  }
  return [...routes];
}

export function createArtifactServer(build: string) {
  const serve = sirv(build);
  return createServer((request, response) => {
    if (!request.url?.startsWith(base)) {
      response.writeHead(404).end();
      return;
    }
    request.url = request.url.slice(base.length - 1);
    serve(request, response);
  });
}
