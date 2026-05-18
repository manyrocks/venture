// Template manifest: declares which files ship with venture, which are
// optional, and which option key controls each optional entry.

export const TEMPLATES = [
  // Always-on
  { src: 'CLAUDE.md',                                         optional: false },
  { src: 'README.md',                                          optional: false },
  { src: '_gitignore', dest: '.gitignore',                     optional: false },
  { src: 'docs/.gitkeep',                                      optional: false },
  { src: '.claude/skills/setup-followup/SKILL.md',             optional: false },

  // Optional (default on)
  { src: 'DESIGN.md',                                          optional: true, key: 'design' },
  { src: '.claude/skills/brainstorming/SKILL.md',              optional: true, key: 'brainstorming' },
  { src: '.claude/skills/prd-writer/SKILL.md',                 optional: true, key: 'prdWriter' },
  { src: '.claude/skills/goals-setter/SKILL.md',               optional: true, key: 'goalsSetter' },
];

export const OPTIONAL_KEYS = TEMPLATES.filter(t => t.optional).map(t => t.key);

export const OPTIONAL_LABELS = {
  design: 'DESIGN.md',
  brainstorming: 'brainstorming skill',
  prdWriter: 'prd-writer skill',
  goalsSetter: 'goals-setter skill',
};

export function selectTemplates(options) {
  return TEMPLATES.filter(t => !t.optional || options[t.key]);
}
