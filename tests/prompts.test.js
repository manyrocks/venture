import { test } from 'node:test';
import assert from 'node:assert/strict';
import { askText, askChoice, askYesNo, askMulti } from '../src/prompts.js';

// A minimal fake of the readline/promises interface.
// answers is an array consumed in order; closes are tracked.
function fakeRl(answers) {
  let i = 0;
  let closed = false;
  return {
    question: async () => {
      if (i >= answers.length) throw new Error('fakeRl exhausted');
      return answers[i++];
    },
    close: () => { closed = true; },
    get closed() { return closed; },
    get consumed() { return i; },
  };
}

test('askText returns the trimmed response', async () => {
  const rl = fakeRl(['  gem-tracker  ']);
  const result = await askText(rl, 'Project name');
  assert.equal(result, 'gem-tracker');
});

test('askText re-prompts on empty input', async () => {
  const rl = fakeRl(['', '   ', 'gem-tracker']);
  const result = await askText(rl, 'Project name');
  assert.equal(result, 'gem-tracker');
  assert.equal(rl.consumed, 3);
});

test('askChoice returns the chosen value when input matches a label', async () => {
  const rl = fakeRl(['private']);
  const result = await askChoice(rl, 'Visibility', ['private', 'public'], 'private');
  assert.equal(result, 'private');
});

test('askChoice returns the default on empty input', async () => {
  const rl = fakeRl(['']);
  const result = await askChoice(rl, 'Visibility', ['private', 'public'], 'private');
  assert.equal(result, 'private');
});

test('askChoice re-prompts on invalid input', async () => {
  const rl = fakeRl(['nope', 'public']);
  const result = await askChoice(rl, 'Visibility', ['private', 'public'], 'private');
  assert.equal(result, 'public');
  assert.equal(rl.consumed, 2);
});

test('askYesNo treats y/yes/Y as true', async () => {
  for (const ans of ['y', 'Y', 'yes', 'YES']) {
    const rl = fakeRl([ans]);
    assert.equal(await askYesNo(rl, 'ok?', true), true);
  }
});

test('askYesNo treats n/no/N as false', async () => {
  for (const ans of ['n', 'N', 'no', 'NO']) {
    const rl = fakeRl([ans]);
    assert.equal(await askYesNo(rl, 'ok?', true), false);
  }
});

test('askYesNo uses the default on empty input', async () => {
  assert.equal(await askYesNo(fakeRl(['']), 'ok?', true), true);
  assert.equal(await askYesNo(fakeRl(['']), 'ok?', false), false);
});

test('askMulti with empty input returns all defaults', async () => {
  const rl = fakeRl(['']);
  const result = await askMulti(rl, 'Include', [
    { key: 'a', label: 'A', default: true },
    { key: 'b', label: 'B', default: true },
    { key: 'c', label: 'C', default: false },
  ]);
  assert.deepEqual(result, { a: true, b: true, c: false });
});

test('askMulti with "customize" walks each item', async () => {
  const rl = fakeRl(['customize', 'y', 'n', 'y']);
  const result = await askMulti(rl, 'Include', [
    { key: 'a', label: 'A', default: true },
    { key: 'b', label: 'B', default: true },
    { key: 'c', label: 'C', default: false },
  ]);
  assert.deepEqual(result, { a: true, b: false, c: true });
});
