import assert from 'node:assert/strict';
import test from 'node:test';
import {assertSettings, confirmMain, deployedCommit, requireInspection, verifyArtifact} from './pages.mts';

const sha = 'a'.repeat(40);
const url = 'https://jpbourgeon.github.io/blog/';
const site = {build_type: 'workflow', status: 'built', html_url: url};
const settings = {
  pages: site,
  'environments/github-pages': {deployment_branch_policy: {custom_branch_policies: true, protected_branches: false}},
  'environments/github-pages/deployment-branch-policies': {total_count: 1, branch_policies: [{name: 'main', type: 'branch'}]},
  'actions/workflows': {total_count: 1, workflows: [{path: '.github/workflows/pages.yml', state: 'active'}]},
};
const jobs = [
  {name: 'Independent publication gate', conclusion: 'success',
    steps: [{name: 'Upload the gated Pages artifact', conclusion: 'success'}]},
  {name: 'Deploy to GitHub Pages', conclusion: 'success',
    steps: [{name: 'Deploy the verified Pages artifact', conclusion: 'success'}]},
];
const deploymentQuery = 'deployments?environment=github-pages&per_page=1';
const statusQuery = 'deployments/12/statuses?per_page=1';
const pagesQuery = `pages/deployments/${sha}`;
const runQuery = `actions/workflows/pages.yml/runs?event=workflow_dispatch&head_sha=${sha}&per_page=100`;
const jobsQuery = 'actions/runs/42/attempts/1/jobs?per_page=100';
const run = {id: 42, head_sha: sha, head_branch: 'main', event: 'workflow_dispatch', conclusion: 'success', run_attempt: 1};
const deployment = {
  [deploymentQuery]: [{id: 12, environment: 'github-pages', sha, ref: 'main'}],
  [statusQuery]: [{state: 'success', environment_url: url, log_url: 'https://github.com/jpbourgeon/blog/actions/runs/42/job/1'}],
  [pagesQuery]: {status: 'succeed'},
  [runQuery]: {total_count: 1, workflow_runs: [run]},
  [jobsQuery]: {total_count: 2, jobs},
};
const mock = (data: Record<string, unknown>) => async <T,>(path: string): Promise<T> => {
  assert(Object.hasOwn(data, path), `Unavailable API proof: ${path}`);
  return data[path] as T;
};

test('native Pages settings, environment rules and the exact current main are mandatory', async () => {
  assert.deepEqual(await assertSettings(mock(settings)), site);
  await assert.rejects(assertSettings(mock({...settings, pages: {...site, build_type: 'legacy'}})), /GitHub Actions/);
  await assert.rejects(assertSettings(mock({...settings, 'environments/github-pages/deployment-branch-policies':
    {total_count: 1, branch_policies: [{name: 'main', type: 'tag'}]}})), /only the main branch/);
  await assert.rejects(assertSettings(mock({...settings, 'actions/workflows': {total_count: 2, workflows: []}})), /alternate/);
  await assert.rejects(confirmMain(mock({'branches/main': {commit: {sha: 'b'.repeat(40)}}}), sha), /main advanced/);
});

test('the workflow inventory accepts only Pages and the exact GitHub-managed security paths', async () => {
  const pages = settings['actions/workflows'].workflows[0];
  const dependabot = {path: 'dynamic/dependabot/dependabot-updates', state: 'active'};
  const codeql = {path: 'dynamic/github-code-scanning/codeql', state: 'active'};
  const inventory = (...workflows: typeof pages[]) =>
    mock({...settings, 'actions/workflows': {total_count: workflows.length, workflows}});
  assert.deepEqual(await assertSettings(inventory(codeql, pages, dependabot)), site);
  for (const workflows of [
    [dependabot, codeql],
    [{...pages, state: 'disabled_manually'}, codeql],
    [pages, codeql, codeql],
    [pages, {path: 'dynamic/github-code-scanning/other', state: 'active'}],
    [pages, {path: '.github/workflows/codeql.yml', state: 'active'}],
  ]) {
    await assert.rejects(assertSettings(inventory(...workflows)), /alternate/);
  }
});

test('bootstrap requires positive evidence of an empty native deployment history', async () => {
  const empty = {...site, status: null};
  assert.equal(await deployedCommit(mock({[deploymentQuery]: []}), empty, 'bootstrap'), undefined);
  await assert.rejects(deployedCommit(mock({}), empty, 'bootstrap'), /Unavailable API proof/);
  await assert.rejects(deployedCommit(mock(deployment), empty, 'bootstrap'), /confirmed absence/);
  await assert.rejects(deployedCommit(mock({[deploymentQuery]: []}), site, 'bootstrap'), /confirmed absence/);
});

test('bootstrap needs a successful earlier inventory for the exact SHA', async () => {
  const inspection = [{name: 'Independent publication gate', conclusion: 'success', steps: [
    {name: 'Verify the routes and package the checked bytes', conclusion: 'success'},
    {name: 'Upload the gated Pages artifact', conclusion: 'skipped'},
  ]}];
  await requireInspection(mock({...deployment, [jobsQuery]: {total_count: 1, jobs: inspection}}), sha);
  await assert.rejects(requireInspection(mock(deployment), sha), /successful inspect dispatch/);
  await assert.rejects(requireInspection(mock({[runQuery]: {total_count: 0, workflow_runs: []}}), sha),
    /successful inspect dispatch/);
});

test('a successful build, pending or failed request, or unverifiable Pages deployment cannot establish a baseline', async () => {
  assert.equal(await deployedCommit(mock(deployment), site, 'publish'), sha);
  for (const override of [
    {[deploymentQuery]: []},
    {[statusQuery]: [{state: 'in_progress', environment_url: url}]},
    {[pagesQuery]: {status: 'deployment_failed'}},
    {[runQuery]: {total_count: 1, workflow_runs: [{...run, run_attempt: 2}]}},
    {[jobsQuery]: {total_count: 1, jobs: [jobs[0]]}},
    {[jobsQuery]: {total_count: 2, jobs: [jobs[0], {...jobs[1], conclusion: 'failure'}]}},
  ]) {
    await assert.rejects(deployedCommit(mock({...deployment, ...override}), site, 'publish'));
  }
});

test('an artifact from another execution or with altered identity cannot be substituted', async () => {
  const name = `github-pages-${sha}-42-1`;
  const digest = 'b'.repeat(64);
  const path = `actions/runs/42/artifacts?name=${name}`;
  const artifact = {name, id: 5, digest: `sha256:${digest}`, expired: false};
  const response = (...artifacts: unknown[]) => mock({[path]: {total_count: artifacts.length, artifacts}});
  await verifyArtifact(response(artifact), '42', name, '5', digest);
  for (const replacement of [
    response(), response(artifact, artifact), response({...artifact, id: 6}),
    response({...artifact, digest: 'sha256:changed'}), response({...artifact, expired: true}),
  ]) {
    await assert.rejects(verifyArtifact(replacement, '42', name, '5', digest), /immutable artifact/);
  }
  await assert.rejects(verifyArtifact(response(artifact), '43', name, '5', digest), /Unavailable API proof/);
});
