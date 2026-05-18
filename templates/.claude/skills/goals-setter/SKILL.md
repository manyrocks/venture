---
name: goals-setter
description: Converts a PRD into docs/GOAL.md in /goal-compatible format with a single completion condition and a checklist plan. Refuses goals that don't fit a single /goal session (20 minutes to 2 hours of focused work). Strategic only; never executes.
---

# Goals setter

Produce a `/goal`-compatible plan file. Strategic decomposition only — never write code.

## Process

1. Read `docs/PRD.md` and `DESIGN.md` (and `docs/specs/*` if relevant) so the plan reflects current context.
2. Ask: "What's the single goal for the next execution loop?" Reject goals that:
   - Have no clear binary completion condition.
   - Would take more than ~2 hours of focused work. Suggest decomposing first.
   - Cross multiple subsystems. Suggest one subsystem per `/goal` run.
3. Decompose into 3–8 checklist steps. Each step must have a verifiable outcome (a test passes, a file exists, a command exits 0, a URL responds).
4. Define the completion condition. It must be checkable without human judgment — e.g. "all tests in `tests/dashboard` pass and `npm run lint` exits 0."

## Output

Write `docs/GOAL.md` with exactly this structure:

```markdown
# Goal

<single completion condition sentence>

## Plan
- [ ] [step-1] <action with verifiable outcome>
- [ ] [step-2] <next action>
- [ ] [step-3] <next action>

## Definition of done
<observable end state — what would let an evaluator like Haiku declare this complete>
```

Step IDs are `[step-1]`, `[step-2]` — stable handles. Reordering is safe; renumbering breaks the contract.

Commit: `git add docs/GOAL.md && git commit -m "GOAL: <one-line summary>"`.

End with: *"Plan saved. Run `/goal` (Claude Code or Codex CLI) or `/plan` (Copilot CLI) to start long-running execution against this file."*

## Hard rules

- Each step has a verifiable outcome. Vague steps ("improve performance") are rejected.
- Step IDs are stable handles. Don't renumber when the user reorders.
- Don't write code. The plan describes work; it doesn't do work.
- Don't invoke `/goal` yourself. Hand off explicitly.
- The completion condition is binary. "Looks good" is not acceptable — make it checkable.
