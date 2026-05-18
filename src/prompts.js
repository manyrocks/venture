// Prompt helpers. The rl parameter is anything with a question(prompt) -> Promise<string>
// method. In production it's a node:readline/promises interface; in tests it's a fake.

export async function askText(rl, label) {
  while (true) {
    const raw = await rl.question(`? ${label} › `);
    const trimmed = raw.trim();
    if (trimmed.length > 0) return trimmed;
    // empty -> re-prompt
  }
}

export async function askChoice(rl, label, choices, defaultChoice) {
  const hint = choices.map(c => c === defaultChoice ? `(${c})` : c).join(' / ');
  while (true) {
    const raw = await rl.question(`? ${label} [${hint}] › `);
    const trimmed = raw.trim().toLowerCase();
    if (trimmed === '') return defaultChoice;
    const match = choices.find(c => c.toLowerCase() === trimmed);
    if (match) return match;
    // invalid -> re-prompt
  }
}

export async function askYesNo(rl, label, defaultBool) {
  const hint = defaultBool ? 'Y/n' : 'y/N';
  while (true) {
    const raw = await rl.question(`? ${label} [${hint}] › `);
    const t = raw.trim().toLowerCase();
    if (t === '') return defaultBool;
    if (t === 'y' || t === 'yes') return true;
    if (t === 'n' || t === 'no') return false;
    // invalid -> re-prompt
  }
}

// askMulti: present a default-on/default-off list. Empty input keeps defaults;
// the literal 'customize' enters per-item Y/n.
export async function askMulti(rl, label, items) {
  const onByDefault = items.filter(i => i.default).map(i => i.label).join(', ');
  const offByDefault = items.filter(i => !i.default).map(i => i.label).join(', ');
  const summary = `defaults on: ${onByDefault || '(none)'}; defaults off: ${offByDefault || '(none)'}`;
  const raw = await rl.question(
    `? ${label}: ${summary}\n  [enter to keep defaults, or 'customize' to choose each] › `
  );
  const trimmed = raw.trim().toLowerCase();
  const result = {};
  if (trimmed !== 'customize') {
    for (const i of items) result[i.key] = i.default;
    return result;
  }
  for (const i of items) {
    result[i.key] = await askYesNo(rl, `  include ${i.label}`, i.default);
  }
  return result;
}
