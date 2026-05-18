import { test } from 'node:test';
import assert from 'node:assert/strict';
import { TEMPLATES, selectTemplates, OPTIONAL_KEYS } from '../src/manifest.js';

test('manifest declares the expected files', () => {
  const dests = TEMPLATES.map(t => t.dest ?? t.src);
  assert.ok(dests.includes('DESIGN.md'));
  assert.ok(dests.includes('CLAUDE.md'));
  assert.ok(dests.includes('README.md'));
  assert.ok(dests.includes('.gitignore'));
  assert.ok(dests.includes('docs/.gitkeep'));
  assert.ok(dests.includes('.claude/skills/setup-followup/SKILL.md'));
  assert.ok(dests.includes('.claude/skills/brainstorming/SKILL.md'));
  assert.ok(dests.includes('.claude/skills/prd-writer/SKILL.md'));
  assert.ok(dests.includes('.claude/skills/goals-setter/SKILL.md'));
});

test('gitignore template ships under a non-dotfile source name', () => {
  const gi = TEMPLATES.find(t => (t.dest ?? t.src) === '.gitignore');
  assert.ok(gi, 'manifest must declare a .gitignore destination');
  assert.equal(gi.src, '_gitignore', 'source name must avoid npm .gitignore-rewrite (use _gitignore)');
  assert.equal(gi.dest, '.gitignore');
});

test('required templates are always included', () => {
  const result = selectTemplates({ design: false, brainstorming: false, prdWriter: false, goalsSetter: false });
  const dests = result.map(t => t.dest ?? t.src);
  assert.ok(dests.includes('CLAUDE.md'));
  assert.ok(dests.includes('README.md'));
  assert.ok(dests.includes('.gitignore'));
  assert.ok(dests.includes('docs/.gitkeep'));
  assert.ok(dests.includes('.claude/skills/setup-followup/SKILL.md'));
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
