import {execFileSync} from 'node:child_process';
import {readFileSync} from 'node:fs';
import {resolve} from 'node:path';
import {locales, requireThat, sha256} from './content.mts';
import {Repository} from './git.mts';
import {identities, inventory, matchReview, readReview, refPaths, reviewPath} from './review.mts';
import {type Mode, plan} from './gate.mts';
import {verifyBuild} from './output.mts';

const [command, ...args] = process.argv.slice(2);
const repo = new Repository();
const head = repo.text('rev-parse', 'HEAD');
const tree = repo.tree(head);
requireThat(repo.text('status', '--porcelain=v1', '--untracked-files=all') === '',
  'Use a clean checkout of the exact commit to verify');

if (command === 'prepare') {
  const [fr, en, baseFr, baseEn] = args;
  requireThat(args.length === 2 || args.length === 4, 'prepare <candidate-fr> <candidate-en> [<baseline-fr> <baseline-en>]');
  const {data} = await identities(tree, {fr, en}, baseFr ? {fr: baseFr, en: baseEn} : undefined);
  await inventory(tree, data);
  console.log(JSON.stringify({report: reviewPath(data.article), frontmatter: data}, null, 2));
} else if (command === 'check' || command === 'project') {
  const [path] = args;
  requireThat(args.length === 1, `${command} <report-path>`);
  const review = await readReview(tree, path);
  const {data, projected} = await identities(tree, refPaths(review.candidates), review.baseline && refPaths(review.baseline));
  matchReview(review, data);
  await inventory(tree);
  if (command === 'project') {
    requireThat(review.result === 'PASS', 'A committed PASS is required to prepare public files');
    console.log(JSON.stringify({
      write: locales.map(locale => ({path: projected[locale].path, content: projected[locale].bytes.toString('utf8')})),
      delete: review.mode === 'revision' ? locales.map(locale => review.candidates[locale].path) : [],
    }, null, 2));
  } else {
    console.log(`Technically applicable ${review.result} at ${head}: ${path}`);
  }
} else if (command === 'plan' || command === 'artifact') {
  const [mode, commit, baseline, build, manifests, tar] = args;
  requireThat(['inspect', 'bootstrap', 'publish', 'pages'].includes(mode) && commit === head,
    'Gate selection must identify the checked-out commit');
  const publication = await plan(tree, mode as Mode, baseline ? repo.tree(baseline) : undefined);
  if (command === 'plan') {
    console.log(publication.classification.join('\n'));
  } else {
    requireThat(build && manifests && (mode === 'inspect' || tar), 'Missing build or artifact paths');
    const inventory = verifyBuild(publication, build, manifests);
    console.log(JSON.stringify({commit, baseline, mode, ...inventory}, null, 2));
    if (mode !== 'inspect') {
      const archive = resolve(tar);
      const files = inventory.files.map(file => file.path);
      execFileSync('tar', [
        '-C', resolve(build), '--owner=0', '--group=0', '--numeric-owner', '--mtime=@0', '--mode=0644',
        '--no-recursion', '-cf', archive, '--null', '-T', '-',
      ], {input: files.join('\0') + '\0'});
      const packaged = execFileSync('tar', ['-tf', archive], {encoding: 'utf8'}).trimEnd().split('\n');
      requireThat(packaged.length === files.length && packaged.every((path, index) => path === files[index]),
        'The Pages archive differs from the verified file inventory');
      for (const file of inventory.files) {
        const bytes = execFileSync('tar', ['-xOf', archive, '--', file.path], {maxBuffer: 32 * 1024 * 1024});
        requireThat(sha256(bytes) === file.sha256, `Packaged bytes differ: ${file.path}`);
      }
      console.log(`Verified Pages archive SHA-256: ${sha256(readFileSync(archive))}`);
    }
  }
} else {
  throw new Error('Expected prepare, check, project, plan or artifact');
}
