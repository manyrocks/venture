import { test } from 'node:test';
import assert from 'node:assert/strict';
import { TEMPLATES, selectTemplates, OPTIONAL_KEYS } from '../src/manifest.js';

test('manifest declares the expected files', () => {
  const sources = TEMPLATES.map(t => t.src);
  assert.ok(sources.includes('DESIGN.md'));
  assert.ok(sources.includes('CLAUDE.md'));
  assert.ok(sources.includes('README.md'));
  assert.ok(sources.includes('.gitignore'));
  assert.ok(sources.includes('docs/.gitkeep'));
  assert.ok(sources.includes('.claude/skills/setup-followup/SKILL.md'));
  assert.ok(sources.includes('.claude/skills/brainstorming/SKILL.md'));
  assert.ok(sources.includes('.claude/skills/prd-writer/SKILL.md'));
  assert.ok(sources.includes('.claude/skills/goals-setter/SKILL.md'));
});

test('required templates are always included', () => {
  const result = selectTemplates({ design: false, brainstorming: false, prdWriter: false, goalsSetter: false });
  const sources = result.map(t => t.src);
  assert.ok(sources.includes('CLAUDE.md'));
  assert.ok(sources.includes('README.md'));
  assert.ok(sources.includes('.gitignore'));
  assert.ok(sources.includes('docs/.gitkeep'));
  assert.ok(sources.includes('.claude/skills/setup-followup/SKILL.md'));
});

test('optional templates default to all-on', () => {
  const allOn = {};
  for (const key of OPTIONAL_KEYS) allOn[key] = true;
  const result = selectTemplates(allOn);
  const sources = result.map(t => t.src);
  assert.ok(sources.includes('DESIGN.md'));
  assert.ok(sources.includes('.claude/skills/brainstorming/SKILL.md'));
  assert.ok(sources.includes('.claude/skills/prd-writer/SKILL.md'));
  assert.ok(sources.includes('.claude/skills/goals-setter/SKILL.md'));
});

test('optional templates can be excluded individually', () => {
  const result = selectTemplates({ design: false, brainstorming: true, prdWriter: true, goalsSetter: true });
  const sources = result.map(t => t.src);
  assert.ok(!sources.includes('DESIGN.md'), 'DESIGN.md should be excluded');
  assert.ok(sources.includes('.claude/skills/brainstorming/SKILL.md'));
});

test('OPTIONAL_KEYS matches the optional entries in TEMPLATES', () => {
  const optionalSources = TEMPLATES.filter(t => t.optional).map(t => t.src);
  assert.equal(optionalSources.length, OPTIONAL_KEYS.length);
});
