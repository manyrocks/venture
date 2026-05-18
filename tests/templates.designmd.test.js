import { test } from 'node:test';
import assert from 'node:assert/strict';
import { readFile } from 'node:fs/promises';
import { fileURLToPath } from 'node:url';
import { dirname, join } from 'node:path';

const __dirname = dirname(fileURLToPath(import.meta.url));
const DESIGN_PATH = join(__dirname, '..', 'templates', 'DESIGN.md');

test('DESIGN.md exists and starts with YAML front matter', async () => {
  const content = await readFile(DESIGN_PATH, 'utf8');
  assert.ok(content.startsWith('---\n'), 'must start with --- fence');
  assert.match(content, /^name: Phosphor/m, 'must name Phosphor');
});

test('DESIGN.md has no <<PLACEHOLDER>> tokens', async () => {
  const content = await readFile(DESIGN_PATH, 'utf8');
  assert.doesNotMatch(content, /<<[A-Z_]+>>/, 'DESIGN.md must not contain placeholders');
});

test('DESIGN.md is at least 200 lines', async () => {
  const content = await readFile(DESIGN_PATH, 'utf8');
  const lines = content.split('\n').length;
  assert.ok(lines > 200, `expected > 200 lines, got ${lines}`);
});
