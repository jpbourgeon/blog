import {appendFileSync} from 'node:fs';
import assert from 'node:assert/strict';

const token = process.env.GITHUB_TOKEN;
const expected = process.env.GITHUB_SHA;
const repository = process.env.GITHUB_REPOSITORY;
assert(token && expected && repository === 'jpbourgeon/blog', 'Expected authenticated Pages job');

async function github(path: string): Promise<unknown> {
  const response = await fetch('https://api.github.com/repos/' + repository + '/' + path, {
    headers: {
      Authorization: 'Bearer ' + token,
      Accept: 'application/vnd.github+json',
      'X-GitHub-Api-Version': '2022-11-28',
      'Cache-Control': 'no-cache',
    },
  });
  assert(response.ok, 'GitHub API ' + path + ' failed: ' + response.status);
  return response.json();
}

const branch = await github('branches/main') as {commit: {sha: string}};
assert(branch.commit.sha === expected, 'Main advanced after the selected commit');
const deployments = await github('deployments?environment=github-pages&per_page=1') as
  {id: number; sha: string}[];
let baseline = 'none';
if (deployments.length) {
  const deployment = deployments[0];
  const statuses = await github('deployments/' + deployment.id + '/statuses?per_page=1') as
    {state: string}[];
  assert(statuses[0]?.state === 'success' && /^[0-9a-f]{40}$/.test(deployment.sha),
    'Latest Pages deployment has no proven successful baseline');
  baseline = deployment.sha;
}
assert(process.env.GITHUB_OUTPUT, 'Missing Actions output');
appendFileSync(process.env.GITHUB_OUTPUT, 'baseline=' + baseline + '\n');
console.log('Last successful Pages deployment: ' + baseline);
