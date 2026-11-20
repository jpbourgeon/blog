import {appendFileSync} from 'node:fs';
import {requireThat} from './content.mts';
import {Repository} from './git.mts';
import {identities, inventory, matchReview, readReview, refPaths, reviewPath, revisionReviewPath} from './review.mts';
import {plan} from './gate.mts';

const [command, ...args] = process.argv.slice(2);
const repo = new Repository();
const head = repo.text('rev-parse', 'HEAD');
const tree = repo.tree(head);
requireThat(repo.text('status', '--porcelain=v1', '--untracked-files=all') === '',
  'Use a clean checkout of the exact commit');

if (command === 'prepare') {
  const [fr, en, baseFr, baseEn] = args;
  requireThat(args.length === 2 || args.length === 4,
    'prepare <candidate-fr> <candidate-en> [<baseline-fr> <baseline-en>]');
  const {data} = await identities(tree, {fr, en}, baseFr ? {fr: baseFr, en: baseEn} : undefined);
  await inventory(tree, data);
  const path = data.mode === 'revision' ? revisionReviewPath(data.content) : reviewPath(data.content);
  console.log(JSON.stringify({report: path, frontmatter: data}, null, 2));
} else if (command === 'check' || command === 'project') {
  const [path] = args;
  requireThat(args.length === 1, command + ' <report>');
  const review = await readReview(tree, path);
  const {data, projected} = await identities(tree, refPaths(review.candidates),
    review.baseline && refPaths(review.baseline));
  matchReview(review, data);
  await inventory(tree, data);
  if (command === 'project') {
    requireThat(review.result === 'PASS', 'A matching PASS is required for publication');
    const publishedReport = reviewPath(review.content);
    const write = Object.values(projected).map(output =>
      ({path: output.path, content: output.bytes.toString('utf8')}));
    const remove = Object.values(review.candidates).map(ref => ref.path)
      .filter(candidate => !Object.values(review.targets).some(ref => ref.path === candidate));
    if (path !== publishedReport) {
      write.push({path: publishedReport, content: tree.read(path).toString('utf8')});
      remove.push(path);
    }
    console.log(JSON.stringify({
      write,
      delete: remove,
    }, null, 2));
  } else console.log('Review ' + review.result + ' matches the current candidates');
} else if (command === 'gate') {
  requireThat(args.length === 1, 'gate <deployed-sha|none>');
  const deployed = args[0] === 'none' ? undefined : repo.tree(args[0]);
  const {editorial, changes, routes} = await plan(tree, deployed);
  console.log(`Publication review: ${deployed?.commit ?? 'none'} -> ${head}`);
  console.log(editorial.join('\n'));
  console.log('Tracked changes (including site code, configuration and static assets):');
  for (const {status, path} of changes) console.log(status + ' ' + JSON.stringify(path));
  if (!changes.length) console.log('No tracked changes');
  if (process.env.GITHUB_OUTPUT) {
    appendFileSync(process.env.GITHUB_OUTPUT, 'routes=' + JSON.stringify(routes) + '\n');
  }
} else throw new Error('Expected prepare, check, project or gate');
