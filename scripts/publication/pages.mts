import assert from 'node:assert/strict';
import {appendFileSync} from 'node:fs';
import {pathToFileURL} from 'node:url';

const repository = 'jpbourgeon/blog';
const workflow = '.github/workflows/pages.yml';
const environment = 'github-pages';
const siteUrl = 'https://jpbourgeon.github.io/blog/';
const shaPattern = /^[0-9a-f]{40}$/;

type Api = <T>(path: string, anonymous?: boolean) => Promise<T>;
type Pages = {build_type: string; status: string | null; html_url: string};
type Run = {id: number; head_sha: string; head_branch: string; event: string; conclusion: string; run_attempt: number};
type Job = {name: string; conclusion: string; steps: {name: string; conclusion: string}[]};
type Deployment = {id: number; sha: string; environment: string; ref: string};
type Status = {state: string; environment_url: string; log_url: string};

const api: Api = async (path, anonymous = false) => {
  const token = process.env.GITHUB_TOKEN;
  assert(anonymous || token, 'Missing read credential for GitHub API');
  const response = await fetch(`https://api.github.com/repos/${repository}/${path}`, {
    headers: {
      Accept: 'application/vnd.github+json',
      'Cache-Control': 'no-cache',
      'X-GitHub-Api-Version': '2022-11-28',
      ...(!anonymous && {Authorization: `Bearer ${token}`}),
    },
    redirect: 'error',
    signal: AbortSignal.timeout(20_000),
  });
  assert(response.ok, `GitHub API ${path} returned ${response.status}`);
  return response.json();
};

export async function assertSettings(read: Api): Promise<Pages> {
  const pages = await read<Pages>('pages');
  assert(pages.build_type === 'workflow' && pages.html_url === siteUrl, 'Pages must use GitHub Actions at the canonical URL');
  // These environment endpoints are public in this public repository.
  const settings = await read<{deployment_branch_policy: {custom_branch_policies: boolean; protected_branches: boolean}}>(
    `environments/${environment}`, true);
  assert(settings.deployment_branch_policy?.custom_branch_policies &&
    !settings.deployment_branch_policy.protected_branches, 'Missing custom Pages deployment branch policy');
  const policies = await read<{total_count: number; branch_policies: {name: string; type: string}[]}>(
    `environments/${environment}/deployment-branch-policies`, true);
  assert(policies.total_count === 1 && policies.branch_policies.length === 1 &&
    policies.branch_policies[0].name === 'main' && policies.branch_policies[0].type === 'branch',
    'The github-pages environment must accept only the main branch');
  const workflows = await read<{total_count: number; workflows: {path: string; state: string}[]}>('actions/workflows');
  assert(workflows.total_count === 1 && workflows.workflows.length === 1 &&
    workflows.workflows[0].path === workflow && workflows.workflows[0].state === 'active',
    'An alternate or unknown Actions workflow can deploy');
  return pages;
}

export async function deployedCommit(read: Api, pages: Pages, mode: string) {
  const deployments = await read<Deployment[]>(`deployments?environment=${environment}&per_page=1`);
  if (mode === 'bootstrap') {
    assert(pages.status === null && deployments.length === 0, 'Bootstrap requires confirmed absence of a Pages deployment');
    return undefined;
  }

  const [deployment] = deployments;
  assert(pages.status === 'built' && deployments.length === 1 && deployment.environment === environment &&
    shaPattern.test(deployment.sha) && ['main', 'refs/heads/main', deployment.sha].includes(deployment.ref),
    'No proven native deployment baseline');
  const [status] = await read<Status[]>(`deployments/${deployment.id}/statuses?per_page=1`);
  assert(status?.state === 'success' && status.environment_url === siteUrl,
    'Latest Pages environment deployment is not demonstrably live');
  const pagesStatus = await read<{status: string}>(`pages/deployments/${deployment.sha}`);
  assert(pagesStatus.status === 'succeed', 'Pages has no successful deployment at the environment commit');

  const loggedRun = status.log_url?.match(/^https:\/\/github\.com\/jpbourgeon\/blog\/actions\/runs\/(\d+)(?:\/|$)/)?.[1];
  const runs = await successfulRuns(read, deployment.sha);
  const matchingRuns = [];
  for (const run of runs) {
    if (loggedRun && String(run.id) !== loggedRun) continue;
    const jobs = await jobsFor(read, run);
    if (stepResult(jobs, 'Independent publication gate', 'Upload the gated Pages artifact') === 'success' &&
        stepResult(jobs, 'Deploy to GitHub Pages', 'Deploy the verified Pages artifact') === 'success') matchingRuns.push(run.id);
  }
  assert(matchingRuns.length === 1, 'Native deployment cannot be tied to one successful gated Pages run');
  return deployment.sha;
}

async function successfulRuns(read: Api, sha: string) {
  assert(shaPattern.test(sha), 'Expected full commit SHA');
  const runs = await read<{total_count: number; workflow_runs: Run[]}>(
    `actions/workflows/pages.yml/runs?event=workflow_dispatch&head_sha=${sha}&per_page=100`);
  assert(runs.total_count === runs.workflow_runs.length, 'Ambiguous or incomplete workflow history');
  return runs.workflow_runs.filter(run => run.head_sha === sha && run.head_branch === 'main' &&
    run.event === 'workflow_dispatch' && run.conclusion === 'success' && run.run_attempt === 1);
}

async function jobsFor(read: Api, run: Run) {
  const response = await read<{total_count: number; jobs: Job[]}>(`actions/runs/${run.id}/attempts/1/jobs?per_page=100`);
  assert(response.total_count === response.jobs.length, 'Incomplete deployment job history');
  return response.jobs;
}

function stepResult(jobs: Job[], name: string, step: string) {
  return jobs.find(job => job.name === name && job.conclusion === 'success')?.steps
    .find(item => item.name === step)?.conclusion;
}

export async function requireInspection(read: Api, sha: string) {
  for (const run of await successfulRuns(read, sha)) {
    const jobs = await jobsFor(read, run);
    const gate = 'Independent publication gate';
    if (stepResult(jobs, gate, 'Verify the routes and package the checked bytes') === 'success' &&
        stepResult(jobs, gate, 'Upload the gated Pages artifact') === 'skipped') return;
  }
  throw new Error('Bootstrap requires a successful inspect dispatch on this exact commit');
}

export async function confirmMain(read: Api, sha: string) {
  assert(shaPattern.test(sha), 'Expected full commit SHA');
  const branch = await read<{commit: {sha: string}}>('branches/main');
  assert(branch.commit.sha === sha, 'main advanced or the requested commit is no longer its head. Dispatch again after review.');
}

export async function verifyArtifact(read: Api, run: string, name: string, id: string, digest: string) {
  assert(/^\d+$/.test(run) && /^\d+$/.test(id) && /^[0-9a-f]{64}$/.test(digest), 'Missing exact artifact identity');
  const response = await read<{total_count: number; artifacts: {name: string; id: number; digest: string; expired: boolean}[]}>(
    `actions/runs/${run}/artifacts?name=${encodeURIComponent(name)}`);
  const [artifact] = response.artifacts;
  assert(response.total_count === 1 && response.artifacts.length === 1 && artifact.name === name &&
    String(artifact.id) === id && artifact.digest === `sha256:${digest}` && artifact.expired === false,
    'The current run does not contain exactly the immutable artifact approved by the gate');
}

async function main() {
  const [command, mode] = process.argv.slice(2);
  const {GITHUB_REPOSITORY, GITHUB_EVENT_NAME, GITHUB_REF, GITHUB_SHA = '', TARGET_COMMIT, GITHUB_RUN_ATTEMPT,
    GITHUB_RUN_ID = '', ARTIFACT_NAME = '', ARTIFACT_ID = '', ARTIFACT_DIGEST = '', GITHUB_OUTPUT} = process.env;
  assert(GITHUB_REPOSITORY === repository && GITHUB_EVENT_NAME === 'workflow_dispatch' && GITHUB_REF === 'refs/heads/main' &&
    GITHUB_SHA === TARGET_COMMIT && GITHUB_RUN_ATTEMPT === '1', 'Require a fresh dispatch on main and the exact selected SHA');
  if (command === 'baseline') {
    await confirmMain(api, GITHUB_SHA);
    assert(['inspect', 'bootstrap', 'publish', 'pages'].includes(mode), 'Unknown dispatch mode');
    if (mode === 'inspect') return;
    const pages = await assertSettings(api);
    const baseline = await deployedCommit(api, pages, mode);
    if (mode === 'bootstrap') await requireInspection(api, GITHUB_SHA);
    assert(GITHUB_OUTPUT, 'Missing Actions output file');
    appendFileSync(GITHUB_OUTPUT, `baseline=${baseline ?? ''}\n`);
  } else if (command === 'main') {
    await confirmMain(api, GITHUB_SHA);
  } else if (command === 'artifact') {
    assert(ARTIFACT_NAME === `github-pages-${GITHUB_SHA}-${GITHUB_RUN_ID}-${GITHUB_RUN_ATTEMPT}`,
      'Artifact name does not identify this exact commit, run and attempt');
    await assertSettings(api);
    await verifyArtifact(api, GITHUB_RUN_ID, ARTIFACT_NAME, ARTIFACT_ID, ARTIFACT_DIGEST);
    await confirmMain(api, GITHUB_SHA);
  } else {
    throw new Error('Unknown Pages check');
  }
}

if (process.argv[1] && import.meta.url === pathToFileURL(process.argv[1]).href) await main();
