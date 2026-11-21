import assert from 'node:assert/strict';
import {once} from 'node:events';
import {launch} from 'chrome-launcher';
import lighthouse from 'lighthouse';
import {base, createArtifactServer, routesForPreflight} from './preflight-routes.mts';
import {requireSuccessfulAudit} from './preflight-check.mts';

const plan = JSON.parse(process.env.PREFLIGHT_PLAN ?? 'null');
assert(plan && Array.isArray(plan.routes) && plan.routes.length > 0 &&
  Array.isArray(plan.unchangedEditorial) && typeof plan.scanArtifact === 'boolean',
'Missing preflight plan from the publication gate');
const routes = routesForPreflight('build', plan);
for (const route of routes) {
  assert(typeof route === 'string' && route.startsWith(base) &&
    new URL(route, 'http://127.0.0.1').pathname === route, 'Invalid preflight route: ' + route);
}

const server = createArtifactServer('build');
server.listen(0, '127.0.0.1');
await once(server, 'listening');
try {
  const address = server.address();
  assert(address && typeof address === 'object', 'Missing local build server');
  const origin = 'http://127.0.0.1:' + address.port;
  const chrome = await launch({chromeFlags: ['--headless']});
  try {
    for (const route of routes) {
      const url = origin + route;
      const result = await lighthouse(url, {
        port: chrome.port,
        logLevel: 'error',
        onlyCategories: ['performance', 'accessibility', 'best-practices', 'seo'],
      });
      const audit = result?.lhr;
      requireSuccessfulAudit(url, audit);
      const scores = Object.values(audit.categories).map(({id, score}) => id + '=' + score);
      console.log(route + ' ' + scores.join(' '));
    }
  } finally {
    await chrome.kill();
  }
} finally {
  server.close();
}
