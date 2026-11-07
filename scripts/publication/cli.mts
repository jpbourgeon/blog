import {requireThat} from './content.mts';
import {Repository} from './git.mts';
import {identities, inventory, matchReview, readReview, refPaths, reviewPath} from './review.mts';
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
  await inventory(tree);
  console.log(JSON.stringify({report: reviewPath(data.content), frontmatter: data}, null, 2));
} else if (command === 'check' || command === 'project') {
  const [path] = args;
  requireThat(args.length === 1, command + ' <report>');
  const review = await readReview(tree, path);
  const {data, projected} = await identities(tree, refPaths(review.candidates),
    review.baseline && refPaths(review.baseline));
  matchReview(review, data);
  await inventory(tree);
  if (command === 'project') {
    requireThat(review.result === 'PASS', 'A matching PASS is required for publication');
    console.log(JSON.stringify({
      write: ['fr', 'en'].map(locale => {
        const output = projected[locale as 'fr' | 'en'];
        return {path: output.path, content: output.bytes.toString('utf8')};
      }),
      delete: ['fr', 'en'].map(locale => review.candidates[locale as 'fr' | 'en'].path)
        .filter(path => !Object.values(review.targets).some(ref => ref.path === path)),
    }, null, 2));
  } else console.log('Review ' + review.result + ' matches the current candidates');
} else if (command === 'gate') {
  requireThat(args.length === 1, 'gate <deployed-sha|none>');
  const deployed = args[0] === 'none' ? undefined : repo.tree(args[0]);
  console.log((await plan(tree, deployed)).join('\n'));
} else throw new Error('Expected prepare, check, project or gate');
