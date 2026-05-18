// Thin wrappers around git and gh. Runner is injected so tests can fake spawnSync.

import { spawnSync } from 'node:child_process';

// Default runner: passthrough to spawnSync with utf8 encoding.
export const realRunner = {
  run({ cmd, args, cwd }) {
    const r = spawnSync(cmd, args, { cwd, encoding: 'utf8', shell: false });
    return {
      status: r.status === null ? 1 : r.status,
      stdout: r.stdout || '',
      stderr: r.stderr || '',
    };
  },
};

function must({ runner, cmd, args, cwd, label }) {
  const r = runner.run({ cmd, args, cwd });
  if (r.status !== 0) {
    throw new Error(`${label} failed: ${r.stderr.trim() || `exit ${r.status}`}`);
  }
  return r;
}

export function initRepoAndCommit({ runner = realRunner, cwd, message }) {
  must({ runner, cmd: 'git', args: ['init', '-b', 'main'], cwd, label: 'git init' });
  must({ runner, cmd: 'git', args: ['add', '-A'], cwd, label: 'git add' });
  must({ runner, cmd: 'git', args: ['commit', '-m', message], cwd, label: 'git commit' });
}

export function isGhAuthed({ runner = realRunner } = {}) {
  const r = runner.run({ cmd: 'gh', args: ['auth', 'status'], cwd: undefined });
  return r.status === 0;
}

export function createGhRepo({
  runner = realRunner, owner, name, visibility, description, cwd,
}) {
  const visFlag = visibility === 'public' ? '--public' : '--private';
  const args = [
    'repo', 'create', `${owner}/${name}`,
    visFlag, '--source=.', '--push', '--description', description,
  ];
  must({ runner, cmd: 'gh', args, cwd, label: 'gh repo create' });
}
