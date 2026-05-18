import { test } from 'node:test';
import assert from 'node:assert/strict';
import { substitute } from '../src/copy.js';

test('substitutes a single placeholder', () => {
  const input = 'Hello <<NAME>>!';
  const result = substitute(input, { NAME: 'venture' });
  assert.equal(result, 'Hello venture!');
});

test('substitutes multiple placeholders', () => {
  const input = '<<NAME>>: <<DESC>>';
  const result = substitute(input, { NAME: 'gem-tracker', DESC: 'inventory dashboard' });
  assert.equal(result, 'gem-tracker: inventory dashboard');
});

test('leaves unknown placeholders untouched', () => {
  const input = 'a=<<KNOWN>> b=<<UNKNOWN>>';
  const result = substitute(input, { KNOWN: 'X' });
  assert.equal(result, 'a=X b=<<UNKNOWN>>');
});

test('does not match malformed placeholders', () => {
  const input = '<NAME> << NAME >> <<name>>';
  const result = substitute(input, { NAME: 'X', name: 'lowercase' });
  assert.equal(result, '<NAME> << NAME >> <<name>>');
});

test('preserves the original on empty values map', () => {
  const input = 'a <<X>> b';
  assert.equal(substitute(input, {}), 'a <<X>> b');
});

test('substitutes the same placeholder multiple times', () => {
  const input = '<<X>> and <<X>> and <<X>>';
  const result = substitute(input, { X: 'Y' });
  assert.equal(result, 'Y and Y and Y');
});

test('handles regex-special characters in values safely', () => {
  const input = '<<URL>>';
  const result = substitute(input, { URL: 'https://example.com/$1?q=foo' });
  assert.equal(result, 'https://example.com/$1?q=foo');
});
