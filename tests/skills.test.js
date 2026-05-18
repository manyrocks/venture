import { test } from 'node:test';
import assert from 'node:assert/strict';
import { readFile } from 'node:fs/promises';
import { fileURLToPath } from 'node:url';
import { dirname, join } from 'node:path';

const __dirname = dirname(fileURLToPath(import.meta.url));
const SKILLS = join(__dirname, '..', 'templates', '.claude', 'skills');

async function readSkill(name) {
  return readFile(join(SKILLS, name, 'SKILL.md'), 'utf8');
}

function assertSkillShape(content, expectedName) {
  // YAML front matter present
  assert.ok(content.startsWith('---\n'), 'must start with YAML fence');
  const close = content.indexOf('\n---\n', 4);
  assert.notEqual(close, -1, 'must have closing YAML fence');
  const yaml = content.slice(4, close);
  assert.match(yaml, new RegExp(`^name:\\s+${expectedName}\\s*$`, 'm'), `must declare name: ${expectedName}`);
  assert.match(yaml, /^description:\s+.+/m, 'must declare description');
  // Body must be non-trivial
  const body = content.slice(close + 5).trim();
  assert.ok(body.length > 200, `body too short: ${body.length} chars`);
}

test('setup-followup skill is well-formed', async () => {
  const c = await readSkill('setup-followup');
  assertSkillShape(c, 'setup-followup');
  assert.match(c, /rm -rf \.claude\/skills\/setup-followup/, 'must reference its own deletion');
  assert.match(c, /bootstrap-trigger/, 'must reference the trigger block');
});

test('goals-setter skill is well-formed', async () => {
  const c = await readSkill('goals-setter');
  assertSkillShape(c, 'goals-setter');
  assert.match(c, /docs\/GOAL\.md/, 'must reference docs/GOAL.md output');
  assert.match(c, /\[step-1\]/, 'must show the step-id format');
  assert.match(c, /\/goal/, 'must mention /goal');
});

test('prd-writer skill is well-formed', async () => {
  const c = await readSkill('prd-writer');
  assertSkillShape(c, 'prd-writer');
  assert.match(c, /docs\/PRD\.md/, 'must reference docs/PRD.md output');
  assert.match(c, /anti-goals/i, 'must mention anti-goals');
  assert.match(c, /success metric/i, 'must mention success metric');
});

test('brainstorming skill is well-formed', async () => {
  const c = await readSkill('brainstorming');
  assertSkillShape(c, 'brainstorming');
  assert.match(c, /docs\/specs/, 'must reference docs/specs output');
  assert.match(c, /2.?3 approaches|2-3 approaches/i, 'must require multiple approaches');
});
