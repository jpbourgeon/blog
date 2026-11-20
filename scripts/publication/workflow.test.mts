import assert from 'node:assert/strict';
import {spawnSync} from 'node:child_process';
import {readFileSync} from 'node:fs';
import test from 'node:test';
import {parse} from 'yaml';

type Step = {
  uses?: string;
  name?: string;
  run?: string;
  if?: string;
  with?: Record<string, string>;
  'continue-on-error'?: boolean;
};
type Job = {if: string; needs?: string; steps: Step[]; 'continue-on-error'?: boolean};
const workflow = parse(readFileSync(new URL('../../.github/workflows/pages.yml', import.meta.url), 'utf8')) as {
  on: {workflow_dispatch: {inputs: {mode: {default: string}}}};
  jobs: Record<string, Job>;
};

test('only manual publish can upload and deploy the artifact that passed the preflight', () => {
  const {validate, gate, deploy} = workflow.jobs;
  assert.equal(workflow.on.workflow_dispatch.inputs.mode.default, 'inspect');
  assert.equal(gate.if, "github.event_name == 'workflow_dispatch'");
  assert.equal(deploy.if, "github.event_name == 'workflow_dispatch' && inputs.mode == 'publish'");
  assert.equal(deploy.needs, 'gate');
  const deploymentJobs = Object.entries(workflow.jobs).filter(([, job]) =>
    job.steps.some(step => step.uses?.startsWith('actions/deploy-pages@')));
  assert.deepEqual(deploymentJobs.map(([name]) => name), ['deploy']);
  const isUpload = (step: Step) => step.uses?.startsWith('actions/upload-pages-artifact@');
  assert.ok(!validate.steps.some(isUpload) && !deploy.steps.some(isUpload));

  const check = gate.steps.findIndex(step => step.run?.includes('npm run publication -- gate'));
  const build = gate.steps.findIndex(step => step.run === 'npm run build');
  const preflight = gate.steps.findIndex(step => step.run === 'npm run preflight');
  const upload = gate.steps.findIndex(isUpload);
  assert.ok(check >= 0 && check < build && build < preflight && preflight < upload);
  assert.equal(gate.steps[upload].if, "inputs.mode == 'publish'");
  assert.equal(gate.steps[upload].with?.path, 'build');
  assert.ok(!gate['continue-on-error'] && !gate.steps[preflight]['continue-on-error']);
  assert.equal(gate.steps[preflight].if, undefined);
});

test('manual deployment uses the selected SHA and stops if main has advanced', () => {
  const {gate, deploy} = workflow.jobs;
  const target = 'a'.repeat(40);
  const guard = gate.steps.find(step => step.name === 'Validate manual target')?.run;
  const checkout = gate.steps.find(step => step.uses?.startsWith('actions/checkout@'));
  assert.ok(guard && checkout);
  assert.equal(checkout.with?.ref, '$' + '{{ github.sha }}');
  const env = {...process.env, TARGET: target, GITHUB_REPOSITORY: 'jpbourgeon/blog',
    GITHUB_SHA: target, GITHUB_REF: 'refs/heads/main', GITHUB_RUN_ATTEMPT: '1'};
  assert.equal(spawnSync('bash', ['-ec', guard], {env}).status, 0);
  for (const override of [
    {GITHUB_SHA: 'b'.repeat(40)}, {GITHUB_REF: 'refs/heads/review'}, {GITHUB_RUN_ATTEMPT: '2'},
    {GITHUB_REPOSITORY: 'someone/blog'},
  ]) {
    assert.equal(spawnSync('bash', ['-ec', guard], {env: {...env, ...override}}).status, 1);
  }

  const recheck = deploy.steps.findIndex(step => step.name === 'Require selected main to remain current');
  const publish = deploy.steps.findIndex(step => step.uses?.startsWith('actions/deploy-pages@'));
  assert.ok(recheck >= 0 && recheck < publish);
  const run = deploy.steps[recheck].run;
  assert.ok(run);
  for (const current of [target, 'b'.repeat(40)]) {
    const command: string = "gh() { printf '%s' \"$CURRENT_MAIN\"; }\n" + run;
    assert.equal(spawnSync('bash', ['-ec', command], {
      env: {...env, EXPECTED: target, CURRENT_MAIN: current},
    }).status, current === target ? 0 : 1);
  }
});
