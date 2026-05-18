import { test } from 'node:test';
import assert from 'node:assert/strict';
import { initRepoAndCommit, createGhRepo, isGhAuthed } from '../src/git.js';

// A fake spawn runner that records calls and returns canned results.
function fakeRunner(scripts) {
  const calls = [];
  return {
    calls,
    run({ cmd, args, cwd }) {
      calls.push({ cmd, args, cwd });
      const key = `${cmd} ${args.join(' ')}`;
      const result = scripts[key];
      if (!result) return { status: 0, stdout: '', stderr: '' };
      return result;
    },
  };
}

test('initRepoAndCommit runs git init, add, commit in the project dir', () => {
  const r = fakeRunner({});
  initRepoAndCommit({ runner: r, cwd: '/tmp/p', message: 'first' });
  assert.deepEqual(r.calls[0], { cmd: 'git', args: ['init', '-b', 'main'], cwd: '/tmp/p' });
  assert.deepEqual(r.calls[1], { cmd: 'git', args: ['add', '-A'], cwd: '/tmp/p' });
  assert.deepEqual(r.calls[2], { cmd: 'git', args: ['commit', '-m', 'first'], cwd: '/tmp/p' });
});

test('initRepoAndCommit throws when a step fails', () => {
  const r = fakeRunner({
    'git init -b main': { status: 1, stdout: '', stderr: 'boom' },
  });
  assert.throws(
    () => initRepoAndCommit({ runner: r, cwd: '/tmp/p', message: 'first' }),
    /git init.*boom/
  );
});

test('isGhAuthed returns true on status 0', () => {
  const r = fakeRunner({});
  assert.equal(isGhAuthed({ runner: r }), true);
  assert.deepEqual(r.calls[0], { cmd: 'gh', args: ['auth', 'status'], cwd: undefined });
});

test('isGhAuthed returns false on non-zero status', () => {
  const r = fakeRunner({ 'gh auth status': { status: 1, stdout: '', stderr: '' } });
  assert.equal(isGhAuthed({ runner: r }), false);
});

test('createGhRepo calls gh with the correct args for private', () => {
  const r = fakeRunner({});
  createGhRepo({
    runner: r, owner: 'manyrocks', name: 'gem-tracker', visibility: 'private',
    description: 'inventory dashboard', cwd: '/tmp/p',
  });
  assert.deepEqual(r.calls[0], {
    cmd: 'gh',
    args: [
      'repo', 'create', 'manyrocks/gem-tracker',
      '--private', '--source=.', '--push', '--description', 'inventory dashboard',
    ],
    cwd: '/tmp/p',
  });
});

test('createGhRepo uses --public when visibility=public', () => {
  const r = fakeRunner({});
  createGhRepo({
    runner: r, owner: 'manyrocks', name: 'g', visibility: 'public',
    description: 'x', cwd: '/tmp/p',
  });
  assert.ok(r.calls[0].args.includes('--public'));
  assert.ok(!r.calls[0].args.includes('--private'));
});

test('createGhRepo throws on failure with stderr in message', () => {
  const r = fakeRunner({
    'gh repo create manyrocks/g --private --source=. --push --description x':
      { status: 1, stdout: '', stderr: 'name already taken' },
  });
  assert.throws(
    () => createGhRepo({
      runner: r, owner: 'manyrocks', name: 'g', visibility: 'private',
      description: 'x', cwd: '/tmp/p',
    }),
    /gh repo create.*name already taken/
  );
});
