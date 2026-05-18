import { test } from 'node:test';
import assert from 'node:assert/strict';
import { mkdtemp, mkdir, writeFile, readFile, rm } from 'node:fs/promises';
import { join } from 'node:path';
import { tmpdir } from 'node:os';
import { copyTemplates } from '../src/copy.js';

async function setupFixture() {
  const root = await mkdtemp(join(tmpdir(), 'venture-test-'));
  const srcDir = join(root, 'templates');
  const destDir = join(root, 'out');
  await mkdir(srcDir, { recursive: true });
  await mkdir(join(srcDir, 'docs'), { recursive: true });
  await mkdir(join(srcDir, '.claude', 'skills', 'setup-followup'), { recursive: true });
  await writeFile(join(srcDir, 'CLAUDE.md'), '# <<PROJECT_NAME>>\n\n<<DESCRIPTION>>');
  await writeFile(join(srcDir, 'README.md'), '# <<PROJECT_NAME>>');
  await writeFile(join(srcDir, '.gitignore'), 'node_modules/\n');
  await writeFile(join(srcDir, 'docs', '.gitkeep'), '');
  await writeFile(join(srcDir, '.claude', 'skills', 'setup-followup', 'SKILL.md'), 'skill body');
  return { root, srcDir, destDir };
}

test('copies declared files and substitutes placeholders', async (t) => {
  const { root, srcDir, destDir } = await setupFixture();
  t.after(() => rm(root, { recursive: true, force: true }));

  const templates = [
    { src: 'CLAUDE.md' },
    { src: 'README.md' },
    { src: '.gitignore' },
    { src: 'docs/.gitkeep' },
    { src: '.claude/skills/setup-followup/SKILL.md' },
  ];
  const values = { PROJECT_NAME: 'gem-tracker', DESCRIPTION: 'Real-time dashboard' };
  await copyTemplates({ srcDir, destDir, templates, values });

  const claude = await readFile(join(destDir, 'CLAUDE.md'), 'utf8');
  assert.equal(claude, '# gem-tracker\n\nReal-time dashboard');

  const readme = await readFile(join(destDir, 'README.md'), 'utf8');
  assert.equal(readme, '# gem-tracker');

  const gitignore = await readFile(join(destDir, '.gitignore'), 'utf8');
  assert.equal(gitignore, 'node_modules/\n');

  const skill = await readFile(join(destDir, '.claude/skills/setup-followup/SKILL.md'), 'utf8');
  assert.equal(skill, 'skill body');
});

test('creates intermediate directories as needed', async (t) => {
  const { root, srcDir, destDir } = await setupFixture();
  t.after(() => rm(root, { recursive: true, force: true }));

  await copyTemplates({
    srcDir,
    destDir,
    templates: [{ src: '.claude/skills/setup-followup/SKILL.md' }],
    values: {},
  });

  const skill = await readFile(join(destDir, '.claude/skills/setup-followup/SKILL.md'), 'utf8');
  assert.equal(skill, 'skill body');
});

test('refuses to overwrite a non-empty destination', async (t) => {
  const { root, srcDir, destDir } = await setupFixture();
  t.after(() => rm(root, { recursive: true, force: true }));

  await mkdir(destDir, { recursive: true });
  await writeFile(join(destDir, 'existing.txt'), 'do not clobber');

  await assert.rejects(
    () => copyTemplates({ srcDir, destDir, templates: [{ src: 'CLAUDE.md' }], values: {} }),
    /not empty/
  );

  const preserved = await readFile(join(destDir, 'existing.txt'), 'utf8');
  assert.equal(preserved, 'do not clobber');
});
