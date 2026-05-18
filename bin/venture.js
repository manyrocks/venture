#!/usr/bin/env node
import { createInterface } from 'node:readline/promises';
import { stdin as input, stdout as output } from 'node:process';
import { fileURLToPath } from 'node:url';
import { basename, dirname, join } from 'node:path';
import { runNew } from '../src/orchestrate.js';

const __dirname = dirname(fileURLToPath(import.meta.url));
const TEMPLATES_DIR = join(__dirname, '..', 'templates');
const OWNER = 'manyrocks';

const sub = process.argv[2];

if (sub !== 'new') {
  console.error('usage: venture new');
  process.exit(2);
}

const rl = createInterface({ input, output });
try {
  const result = await runNew({
    cwd: process.cwd(),
    rl,
    templatesDir: TEMPLATES_DIR,
    owner: OWNER,
  });
  console.log(`\n✓ Created ${result.projectDir}`);
  if (result.ghSkipped) {
    console.log('  gh not authenticated — skipped remote creation.');
    console.log(`  Run: gh auth login && gh repo create ${OWNER}/${basename(result.projectDir)} --${result.visibility} --source=${result.projectDir} --push`);
  } else {
    console.log(`  https://github.com/${OWNER}/${basename(result.projectDir)}`);
  }
  console.log(`\nNext: cd into the project and open it in Claude Code.`);
} catch (err) {
  console.error(`\n✗ ${err.message}`);
  process.exit(1);
} finally {
  rl.close();
}
