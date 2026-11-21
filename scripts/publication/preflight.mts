import assert from 'node:assert/strict';
import {spawn} from 'node:child_process';
import {once} from 'node:events';
import {setTimeout as delay} from 'node:timers/promises';
import {fileURLToPath} from 'node:url';
import {launch} from 'chrome-launcher';
import lighthouse from 'lighthouse';
import {auditCategories, requireSuccessfulAudit} from './preflight-check.mts';

const host = '127.0.0.1';
const port = '8123';
const origin = `http://${host}:${port}`;
const routes: unknown = JSON.parse(process.env.PREFLIGHT_PLAN ?? 'null');
assert(Array.isArray(routes), 'Missing preflight routes from the publication gate');
for (const route of routes) {
  assert(typeof route === 'string' && route.startsWith('/blog/') &&
    new URL(route, origin).pathname === route, 'Invalid preflight route: ' + route);
}
if (routes.length === 0) {
  console.log('No affected routes for Lighthouse');
  process.exit(0);
}

const docusaurus = fileURLToPath(new URL('../../node_modules/@docusaurus/core/bin/docusaurus.mjs', import.meta.url));
const server = spawn(process.execPath, [docusaurus, 'serve', '--no-open', '--host', host, '--port', port],
  {stdio: ['ignore', 'pipe', 'inherit']});
const closed = new Promise(resolve => server.once('close', resolve));
let startup = '';
server.stdout.setEncoding('utf8').on('data', chunk => {
  process.stdout.write(chunk);
  if (!startup.includes(origin)) startup += chunk;
});

try {
  await once(server, 'spawn');
  const deadline = AbortSignal.timeout(10_000);
  let ready = false;
  while (!deadline.aborted && server.exitCode === null && server.signalCode === null) {
    // Docusaurus announces the address just before it starts listening.
    if (startup.includes(origin)) {
      const response = await fetch(origin + '/blog/', {signal: deadline}).catch(() => undefined);
      if (response) {
        await response.body?.cancel();
        ready = true;
        break;
      }
    }
    await delay(100);
  }
  assert(ready, 'Docusaurus serve did not start on ' + origin);

  const chrome = await launch({chromeFlags: ['--headless']});
  try {
    for (const route of routes) {
      const url = origin + route;
      const result = await lighthouse(url, {
        port: chrome.port,
        logLevel: 'error',
        onlyCategories: auditCategories,
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
  server.kill();
  await closed;
}
