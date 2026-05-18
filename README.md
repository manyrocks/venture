# venture

A small Node CLI that scaffolds new prototype projects with house-style LLM-y files: `DESIGN.md`, `CLAUDE.md`, and planning skills (`brainstorming`, `prd-writer`, `goals-setter`).

## Install

```bash
npm i -g github:manyrocks/venture
```

## Use

```bash
venture new
```

Walks through four prompts (project name, visibility, description, optional pieces), creates a new directory, copies the templates, runs `git init` and `gh repo create`, then exits. Open the new directory in Claude Code; the `setup-followup` skill takes over and finishes personalization.

## What it ships into each project

- `DESIGN.md` — Phosphor house style for dark, dense, brutalist dashboards
- `CLAUDE.md` — pointer-style context for Claude Code, ~25 lines
- `docs/` — empty, ready for specs/PRD/GOAL
- `.claude/skills/setup-followup` — one-shot bootstrap skill
- `.claude/skills/brainstorming` — strategic exploration → `docs/specs/`
- `.claude/skills/prd-writer` — strategic PRD writing → `docs/PRD.md`
- `.claude/skills/goals-setter` — `/goal`-compatible plan writing → `docs/GOAL.md`

## Develop

```bash
git clone git@github.com:manyrocks/venture
cd venture
npm test
```

No dependencies to install.
