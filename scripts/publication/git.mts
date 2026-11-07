import {execFileSync} from 'node:child_process';
import {requireThat} from './content.mts';

export const gitSha = /^[0-9a-f]{40}$/;
const outputLimit = 32 * 1024 * 1024;

export class Repository {
  readonly root: string;
  constructor(cwd = process.cwd()) {
    this.root = execFileSync('git', ['rev-parse', '--show-toplevel'], {cwd, encoding: 'utf8'}).trim();
  }

  bytes(...args: string[]): Buffer {
    return execFileSync('git', ['--literal-pathspecs', ...args], {cwd: this.root, maxBuffer: outputLimit});
  }

  text(...args: string[]): string {
    return this.bytes(...args).toString('utf8').trimEnd();
  }

  paths(...args: string[]): string[] {
    return this.bytes(...args).toString('utf8').split('\0').filter(Boolean);
  }

  tree(commit: string) {
    requireThat(gitSha.test(commit) && this.text('rev-parse', '--verify', `${commit}^{commit}`) === commit,
      `Expected an exact Git commit: ${commit}`);
    return new Snapshot(this, commit);
  }

  changed(from: string, to: string): string[] {
    return this.paths('diff', '--name-only', '-z', '--no-renames', from, to, '--');
  }

  parent(commit: string): string {
    return this.text('rev-parse', '--verify', `${commit}^1`);
  }

  firstParentRange(from: string, to: string): string[] {
    const history = this.text('rev-list', '--first-parent', '--reverse', `${from}..${to}`).split('\n').filter(Boolean);
    requireThat(from === to || (history.length && this.parent(history[0]) === from),
      'Last deployed commit is not on the selected first-parent history');
    return history;
  }
}

export class Snapshot {
  private readonly entries = new Map<string, string | undefined>();
  private readonly blobs = new Map<string, Buffer>();
  readonly repo: Repository;
  readonly commit: string;

  constructor(repo: Repository, commit: string) {
    this.repo = repo;
    this.commit = commit;
  }

  paths(...roots: string[]): string[] {
    return this.repo.paths('ls-tree', '-r', '--name-only', '-z', this.commit, '--', ...roots);
  }

  blob(path: string): string | undefined {
    if (!this.entries.has(path)) {
      const entries = this.repo.paths('ls-tree', '-z', this.commit, '--', path);
      const entry = entries.find(item => item.slice(item.indexOf('\t') + 1) === path);
      const match = entry?.match(/^100(?:644|755) blob ([0-9a-f]{40})\t/);
      requireThat(!entry || match, `Expected a regular Git blob at ${this.commit}:${path}`);
      this.entries.set(path, match?.[1]);
    }
    return this.entries.get(path);
  }

  requireBlob(path: string): string {
    const blob = this.blob(path);
    requireThat(blob, `Missing ${path} in ${this.commit}`);
    return blob;
  }

  read(path: string): Buffer {
    const blob = this.requireBlob(path);
    if (!this.blobs.has(blob)) this.blobs.set(blob, this.repo.bytes('cat-file', 'blob', blob));
    return this.blobs.get(blob)!;
  }
}
