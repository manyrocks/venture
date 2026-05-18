import { test } from 'node:test';
import assert from 'node:assert/strict';
import { readFile, stat } from 'node:fs/promises';
import { fileURLToPath } from 'node:url';
import { dirname, join } from 'node:path';
import { substitute } from '../src/copy.js';

const __dirname = dirname(fileURLToPath(import.meta.url));
const TEMPLATES = join(__dirname, '..', 'templates');

test('CLAUDE.md has the expected placeholders', async () => {
  const c = await readFile(join(TEMPLATES, 'CLAUDE.md'), 'utf8');
  for (const tok of ['<<PROJECT_NAME>>', '<<DESCRIPTION>>', '<<PROJECT_GOAL>>', '<<TECH_STACK>>']) {
    assert.ok(c.includes(tok), `CLAUDE.md missing ${tok}`);
  }
});

test('CLAUDE.md includes the bootstrap-trigger block', async () => {
  const c = await readFile(join(TEMPLATES, 'CLAUDE.md'), 'utf8');
  assert.ok(c.includes('<!-- bootstrap-trigger -->'));
  assert.ok(c.includes('<!-- /bootstrap-trigger -->'));
});

test('CLAUDE.md substitution fills declared CLI tokens', async () => {
  const c = await readFile(join(TEMPLATES, 'CLAUDE.md'), 'utf8');
  const out = substitute(c, { PROJECT_NAME: 'gem', DESCRIPTION: 'desc' });
  assert.ok(out.includes('# gem'));
  assert.ok(out.includes('desc'));
  // Followup placeholders must still be present
  assert.ok(out.includes('<<PROJECT_GOAL>>'));
});

test('README.md uses PROJECT_NAME and DESCRIPTION', async () => {
  const r = await readFile(join(TEMPLATES, 'README.md'), 'utf8');
  assert.ok(r.includes('<<PROJECT_NAME>>'));
  assert.ok(r.includes('<<DESCRIPTION>>'));
});

test('docs/.gitkeep exists and is empty', async () => {
  const s = await stat(join(TEMPLATES, 'docs', '.gitkeep'));
  assert.equal(s.size, 0);
});

test('_gitignore template declares node_modules', async () => {
  // Shipped as _gitignore to avoid npm rewriting .gitignore on install.
  // Mapped back to .gitignore in the consumer project by the manifest.
  const g = await readFile(join(TEMPLATES, '_gitignore'), 'utf8');
  assert.ok(g.includes('node_modules/'));
});
