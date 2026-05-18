---
name: brainstorming
description: Strategic, planning-phase brainstorming for a feature or subsystem. Produces a design spec at docs/specs/YYYY-MM-DD-<topic>.md. Resists jumping to implementation; hands off to goals-setter when planning is complete.
---

# Brainstorming

Help the user turn an idea into a clear design spec through collaborative dialogue. Stay strategic. Do not write production code.

## Process

1. Read `DESIGN.md`, `docs/PRD.md`, and `docs/GOAL.md` if they exist. They define current constraints.
2. Ask clarifying questions one at a time. Use AskUserQuestion with multiple-choice when possible. Topics to cover: purpose, users, constraints, success criteria, scope.
3. Propose 2–3 approaches with trade-offs. Lead with your recommendation and explain why.
4. Once an approach is chosen, present the design in sections (architecture, components, data flow, error handling, testing). Confirm each section before moving to the next.
5. Write the spec to `docs/specs/YYYY-MM-DD-<topic>.md` where `YYYY-MM-DD` is today's date and `<topic>` is a short kebab-case slug.
6. Commit: `git add docs/specs && git commit -m "spec: <topic>"`.
7. End with: *"Spec saved to docs/specs/. To convert this into an executable plan, run the `goals-setter` skill. Or if you just want to keep planning, run `prd-writer` next."*

## Hard rules

- Do not write production code. Sample snippets in the spec are fine; full implementations are not.
- Do not scaffold project files. Only write under `docs/specs/`.
- Do not invoke `/goal` or other skills automatically. Name them in the handoff message and let the user choose.
- If the user resists clarifying questions, suggest they run `prd-writer` first to establish baseline product context.
