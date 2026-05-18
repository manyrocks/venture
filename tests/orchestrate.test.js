import { test } from 'node:test';
import assert from 'node:assert/strict';
import { mkdtemp, mkdir, writeFile, readFile, rm } from 'node:fs/promises';
import { join } from 'node:path';
import { tmpdir } from 'node:os';
import { runNew } from '../src/orchestrate.js';

function fakeRl(answers) {
  let i = 0;
  return {
    question: async () => answers[i++],
    close: () => {},
  };
}

function fakeRunner() {
  const calls = [];
  return {
    calls,
    run({ cmd, args, cwd }) {
      calls.push({ cmd, args, cwd });
      if (cmd === 'gh' && args[0] === 'auth') return { status: 0, stdout: '', stderr: '' };
      return { status: 0, stdout: '', stderr: '' };
    },
  };
}

async function setupTemplates() {
  const root = await mkdtemp(join(tmpdir(), 'venture-orch-'));
  const srcDir = join(root, 'templates');
  await mkdir(join(srcDir, 'docs'), { recursive: true });
  await mkdir(join(srcDir, '.claude', 'skills', 'setup-followup'), { recursive: true });
  await mkdir(join(srcDir, '.claude', 'skills', 'brainstorming'), { recursive: true });
  await mkdir(join(srcDir, '.claude', 'skills', 'prd-writer'), { recursive: true });
  await mkdir(join(srcDir, '.claude', 'skills', 'goals-setter'), { recursive: true });
  await writeFile(join(srcDir, 'CLAUDE.md'), '# <<PROJECT_NAME>>\n<<DESCRIPTION>>');
  await writeFile(join(srcDir, 'README.md'), '# <<PROJECT_NAME>>');
  await writeFile(join(srcDir, 'DESIGN.md'), 'design content');
  await writeFile(join(srcDir, '_gitignore'), 'node_modules/');
  await writeFile(join(srcDir, 'docs', '.gitkeep'), '');
  await writeFile(join(srcDir, '.claude', 'skills', 'setup-followup', 'SKILL.md'), 'setup');
  await writeFile(join(srcDir, '.claude', 'skills', 'brainstorming', 'SKILL.md'), 'brain');
  await writeFile(join(srcDir, '.claude', 'skills', 'prd-writer', 'SKILL.md'), 'prd');
  await writeFile(join(srcDir, '.claude', 'skills', 'goals-setter', 'SKILL.md'), 'goals');
  return { root, srcDir };
}

test('runNew copies files, substitutes placeholders, inits git, creates gh repo', async (t) => {
  const { root, srcDir } = await setupTemplates();
  const destParent = join(root, 'workdir');
  await mkdir(destParent);
  t.after(() => rm(root, { recursive: true, force: true }));

  // Prompt order: name, visibility, description, multi-select (keep defaults).
  const rl = fakeRl(['gem-tracker', '', 'Real-time inventory dashboard', '']);
  const runner = fakeRunner();

  const result = await runNew({
    cwd: destParent,
    rl,
    runner,
    templatesDir: srcDir,
    owner: 'manyrocks',
  });

  assert.equal(result.projectDir, join(destParent, 'gem-tracker'));
  assert.equal(result.visibility, 'private');

  const claude = await readFile(join(result.projectDir, 'CLAUDE.md'), 'utf8');
  assert.equal(claude, '# gem-tracker\nReal-time inventory dashboard');

  // git init called
  const gitInit = runner.calls.find(c => c.cmd === 'git' && c.args[0] === 'init');
  assert.ok(gitInit, 'git init should be invoked');
  assert.equal(gitInit.cwd, result.projectDir);

  // gh repo create called
  const ghCreate = runner.calls.find(c => c.cmd === 'gh' && c.args[1] === 'create');
  assert.ok(ghCreate, 'gh repo create should be invoked');
  assert.ok(ghCreate.args.includes('manyrocks/gem-tracker'));
  assert.ok(ghCreate.args.includes('--private'));
});

test('runNew refuses an existing non-empty target', async (t) => {
  const { root, srcDir } = await setupTemplates();
  const destParent = join(root, 'workdir2');
  await mkdir(join(destParent, 'gem-tracker'), { recursive: true });
  await writeFile(join(destParent, 'gem-tracker', 'existing.txt'), 'x');
  t.after(() => rm(root, { recursive: true, force: true }));

  const rl = fakeRl(['gem-tracker', '', 'desc', '']);
  const runner = fakeRunner();

  await assert.rejects(
    () => runNew({ cwd: destParent, rl, runner, templatesDir: srcDir, owner: 'manyrocks' }),
    /not empty/
  );
});

test('runNew skips gh repo create when gh is not authed', async (t) => {
  const { root, srcDir } = await setupTemplates();
  const destParent = join(root, 'workdir3');
  await mkdir(destParent);
  t.after(() => rm(root, { recursive: true, force: true }));

  const rl = fakeRl(['p', '', 'd', '']);
  const runner = {
    calls: [],
    run({ cmd, args, cwd }) {
      this.calls.push({ cmd, args, cwd });
      if (cmd === 'gh' && args[0] === 'auth') return { status: 1, stdout: '', stderr: 'not logged in' };
      return { status: 0, stdout: '', stderr: '' };
    },
  };

  const result = await runNew({ cwd: destParent, rl, runner, templatesDir: srcDir, owner: 'manyrocks' });
  assert.equal(result.ghSkipped, true);
  const ghCreate = runner.calls.find(c => c.cmd === 'gh' && c.args[1] === 'create');
  assert.equal(ghCreate, undefined, 'gh repo create must not run when not authed');
});
