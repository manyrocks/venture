// Placeholder substitution + recursive template copy.
// Placeholders use the form <<TOKEN_NAME>> (double-angle, screaming snake).

import { mkdir, readFile, writeFile, readdir, stat } from 'node:fs/promises';
import { dirname, join } from 'node:path';

// Match the strict form only: <<TOKEN>> with no internal whitespace,
// uppercase letters / digits / underscore.
const PLACEHOLDER_RE = /<<([A-Z][A-Z0-9_]*)>>/g;

export function substitute(text, values) {
  return text.replace(PLACEHOLDER_RE, (match, token) => {
    if (Object.prototype.hasOwnProperty.call(values, token)) {
      // String replace's $-special handling does not affect this branch
      // because we return the raw string from the callback.
      return String(values[token]);
    }
    return match;
  });
}

async function destIsEmpty(destDir) {
  try {
    const entries = await readdir(destDir);
    return entries.length === 0;
  } catch (err) {
    if (err.code === 'ENOENT') return true;
    throw err;
  }
}

export async function copyTemplates({ srcDir, destDir, templates, values }) {
  if (!(await destIsEmpty(destDir))) {
    throw new Error(`Destination ${destDir} is not empty`);
  }
  await mkdir(destDir, { recursive: true });

  for (const tpl of templates) {
    const srcPath = join(srcDir, tpl.src);
    const destPath = join(destDir, tpl.dest ?? tpl.src);
    await mkdir(dirname(destPath), { recursive: true });
    const raw = await readFile(srcPath, 'utf8');
    const out = substitute(raw, values);
    await writeFile(destPath, out, 'utf8');
  }
}
