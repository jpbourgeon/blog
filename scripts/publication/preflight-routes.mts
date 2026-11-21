import {readdirSync} from 'node:fs';
import {join, relative, sep} from 'node:path';

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
    if (!entry.isFile() || !entry.name.endsWith('.html')) continue;
    const path = relative(build, join(entry.parentPath, entry.name)).split(sep).join('/');
    if (path === '404.html' || path === 'en/404.html') continue;
    const route = base + path.replace(/(^|\/)index\.html$/, '$1').split('/').map(encodeURIComponent).join('/');
    if (!unchanged.has(route)) routes.add(route);
  }
  return [...routes];
}
