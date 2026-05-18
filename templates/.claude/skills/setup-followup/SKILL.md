---
name: setup-followup
description: One-shot bootstrap skill that runs the first time Claude Code opens a freshly venture-scaffolded project. Fills the remaining <<...>> placeholders in CLAUDE.md by interviewing the user, then deletes itself and removes the bootstrap-trigger block from CLAUDE.md.
---

# Setup followup

This skill runs once per venture-scaffolded project, the very first time Claude Code opens it. Your job: finish filling out CLAUDE.md, then remove this skill so it never runs again.

## Process

1. Read `CLAUDE.md`. Find every `<<TOKEN>>` placeholder that remains. `PROJECT_NAME` and `DESCRIPTION` were already filled by the CLI; the rest are yours.

2. If zero placeholders remain, skip to step 5.

3. For each remaining placeholder, ask one focused question using the AskUserQuestion tool. Multiple-choice when reasonable; free-text otherwise.
   - `<<PROJECT_GOAL>>` — "What's the one-sentence goal for this project?"
   - `<<TECH_STACK>>` — "What's the planned tech stack? e.g. Vite + React + Tailwind + uPlot."
   - `<<USERS>>` — "Who is this for? Just you, a specific team, public users, or N/A?"
   - `<<SUCCESS_METRIC>>` — "What single signal would tell you this project is succeeding?"

4. After collecting answers, use the Edit tool to replace each `<<TOKEN>>` in `CLAUDE.md` with the user's response. Confirm the result reads well.

5. Offer the next planning step:
   > "Bootstrap context filled. Three planning skills are available:
   > - `prd-writer` to draft a full PRD
   > - `goals-setter` to define a /goal-compatible plan
   > - `brainstorming` to explore a specific feature
   >
   > Or say 'done' to wrap up bootstrap."

6. When the user signals done (explicit "done", "looks good", "ship it", or after they complete one of the planning skills and confirm):
   - Run via Bash: `rm -rf .claude/skills/setup-followup`
   - Use Edit to remove the entire `<!-- bootstrap-trigger -->` ... `<!-- /bootstrap-trigger -->` block from CLAUDE.md, including any single trailing blank line.
   - Run via Bash: `git add -A && git commit -m "Complete bootstrap"`

## Hard rules

- Do not write code or scaffold project files. Other skills handle that later.
- Do not modify DESIGN.md. It is house style, not per-project.
- Do not invoke other skills automatically. Offer them; let the user choose.
- Always commit the cleanup at the end — the trigger removal is a meaningful state change.
