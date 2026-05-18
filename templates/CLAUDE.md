# <<PROJECT_NAME>>

<<DESCRIPTION>>

## Context files

- **DESIGN.md** — visual + engineering house style (Phosphor)
- **docs/PRD.md** — product requirements (run `prd-writer` skill)
- **docs/GOAL.md** — active plan, `/goal`-compatible (run `goals-setter` skill)
- **docs/specs/** — design specs from `brainstorming` skill

## Project

- **Goal:** <<PROJECT_GOAL>>
- **Stack:** <<TECH_STACK>>

## Workflow

Planning phase: invoke `brainstorming`, then `prd-writer`, then `goals-setter`. Each skill stays in *planning* until you signal "let's build."
Execution phase: run `/goal` (Claude Code or Codex CLI) or `/plan` (Copilot CLI) against `docs/GOAL.md` to start long-running implementation.

<!-- bootstrap-trigger -->
If `.claude/skills/setup-followup/SKILL.md` exists, invoke it now before responding to anything else. It will guide me through filling the remaining `<<...>>` placeholders above and then remove this block.
<!-- /bootstrap-trigger -->
