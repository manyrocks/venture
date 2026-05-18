import { test } from 'node:test';
import assert from 'node:assert/strict';
import { mkdtemp, mkdir, rm, stat, readFile, readdir } from 'node:fs/promises';
import { join } from 'node:path';
import { tmpdir } from 'node:os';
import { fileURLToPath } from 'node:url';
import { dirname } from 'node:path';
import { runNew } from '../src/orchestrate.js';

const __dirname = dirname(fileURLToPath(import.meta.url));
const TEMPLATES_DIR = join(__dirname, '..', 'templates');

function fakeRl(answers) {
  let i = 0;
  return { question: async () => answers[i++], close: () => {} };
}

function fakeRunner() {
  const calls = [];
  return {
    calls,
    run({ cmd, args, cwd }) {
      calls.push({ cmd, args, cwd });
      return { status: 0, stdout: '', stderr: '' };
    },
  };
}

test('e2e: venture new produces a complete project', async (t) => {
  const workdir = await mkdtemp(join(tmpdir(), 'venture-e2e-'));
  t.after(() => rm(workdir, { recursive: true, force: true }));

  const rl = fakeRl(['gem-tracker', 'private', 'Real-time inventory dashboard', '']);
  const runner = fakeRunner();
  const result = await runNew({
    cwd: workdir, rl, runner, templatesDir: TEMPLATES_DIR, owner: 'manyrocks',
  });

  const projectDir = result.projectDir;

  // Required files present
  const expected = [
    'CLAUDE.md', 'README.md', '.gitignore', 'DESIGN.md',
    'docs/.gitkeep',
    '.claude/skills/setup-followup/SKILL.md',
    '.claude/skills/brainstorming/SKILL.md',
    '.claude/skills/prd-writer/SKILL.md',
    '.claude/skills/goals-setter/SKILL.md',
  ];
  for (const rel of expected) {
    const s = await stat(join(projectDir, rel));
    assert.ok(s.isFile() || s.size === 0, `expected file: ${rel}`);
  }

  // Placeholders filled in CLAUDE.md
  const claude = await readFile(join(projectDir, 'CLAUDE.md'), 'utf8');
  assert.ok(claude.includes('# gem-tracker'), 'PROJECT_NAME filled');
  assert.ok(claude.includes('Real-time inventory dashboard'), 'DESCRIPTION filled');
  assert.ok(claude.includes('<<PROJECT_GOAL>>'), 'PROJECT_GOAL deferred to setup-followup');
  assert.ok(claude.includes('<!-- bootstrap-trigger -->'), 'bootstrap-trigger present');

  // git init + commit was attempted
  assert.ok(runner.calls.some(c => c.cmd === 'git' && c.args[0] === 'init'));
  assert.ok(runner.calls.some(c => c.cmd === 'git' && c.args[0] === 'commit'));

  // gh repo create attempted with correct owner/name
  const gh = runner.calls.find(c => c.cmd === 'gh' && c.args[1] === 'create');
  assert.ok(gh, 'gh repo create called');
  assert.ok(gh.args.includes('manyrocks/gem-tracker'));
});

test('e2e: opting out of optional templates omits them', async (t) => {
  const workdir = await mkdtemp(join(tmpdir(), 'venture-e2e-min-'));
  t.after(() => rm(workdir, { recursive: true, force: true }));

  // 'customize', then y/n per item: design=n, brainstorming=n, prd-writer=n, goals-setter=n
  const rl = fakeRl(['min', 'private', 'minimal', 'customize', 'n', 'n', 'n', 'n']);
  const runner = fakeRunner();
  const result = await runNew({
    cwd: workdir, rl, runner, templatesDir: TEMPLATES_DIR, owner: 'manyrocks',
  });

  await assert.rejects(stat(join(result.projectDir, 'DESIGN.md')), /ENOENT/);
  await assert.rejects(stat(join(result.projectDir, '.claude/skills/brainstorming/SKILL.md')), /ENOENT/);

  // setup-followup is required, must still be there
  const s = await stat(join(result.projectDir, '.claude/skills/setup-followup/SKILL.md'));
  assert.ok(s.isFile());
});
