import assert from 'node:assert/strict';
import {once} from 'node:events';
import {createServer} from 'node:http';
import {launch} from 'chrome-launcher';
import lighthouse from 'lighthouse';
import sirv from 'sirv';
import {base, routesForPreflight} from './preflight-routes.mts';

const plan = JSON.parse(process.env.PREFLIGHT_PLAN ?? 'null');
assert(plan && Array.isArray(plan.routes) && plan.routes.length > 0 &&
  Array.isArray(plan.unchangedEditorial) && typeof plan.scanArtifact === 'boolean',
'Missing preflight plan from the publication gate');
const routes = routesForPreflight('build', plan);
for (const route of routes) {
  assert(typeof route === 'string' && route.startsWith(base) &&
    new URL(route, 'http://127.0.0.1').pathname === route, 'Invalid preflight route: ' + route);
}

const serve = sirv('build');
const server = createServer((request, response) => {
  if (!request.url?.startsWith(base)) {
    response.writeHead(404).end();
    return;
  }
  request.url = request.url.slice(base.length - 1);
  serve(request, response);
});

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
      assert(result && !result.lhr.runtimeError,
        'Lighthouse could not audit ' + route + ': ' + result?.lhr.runtimeError?.message);
      const {audits, categories, finalDisplayedUrl} = result.lhr;
      assert(audits['http-status-code']?.score === 1 && finalDisplayedUrl === url,
        'Expected a successful response from the local build at ' + route);
      const scores = Object.values(categories).map(({id, score}) => id + '=' + score);
      console.log(route + ' ' + scores.join(' '));
    }
  } finally {
    await chrome.kill();
  }
} finally {
  server.close();
}
