---
name: prd-writer
description: Produces docs/PRD.md through structured strategic Q&A. Pushes back on vague goals, insists on explicit anti-goals, and requires a single quantifiable success metric. Refuses to discuss implementation.
---

# PRD writer

Produce a rock-solid product requirements document. Stay strategic. Stay in *what* and *why*, never *how*.

## Process

Walk the user through each section in order. Use the AskUserQuestion tool for structured choices; free-text for narrative answers. Push back on vague responses — the PRD is the foundation of every later artifact, so quality compounds.

### 1. Problem (one paragraph)

Ask: "What user pain does this solve? Describe a moment when someone feels it."

Reject phrasings that describe a fix rather than a pain ("improve X", "make Y better", "modernize Z"). Press for the specific moment: "When does this hurt? What does the user notice?"

### 2. Users (at least one named persona)

Ask: "Who feels this pain? Give one named persona with role, context, and what they are trying to do when this matters."

### 3. Goals (3–5 outcomes, each with a verifiable signal)

For each goal: "What outcome? What signal would prove it?" Reject signals that require human judgment. A signal is a number, a passing test, a command exit code, or a URL response.

### 4. Anti-goals (at least three)

Insist on at least three. "What is this product explicitly NOT trying to do?" Lack of anti-goals = unbounded scope. Examples of valid anti-goals: "not multi-tenant", "no real-time collaboration", "no mobile app in v1".

### 5. Success metric (single north-star)

"If you could only watch one number, which?" One. Not a dashboard, not a list.

### 6. Scope

Two bullet lists: "in v1" and "explicitly punted to later".

### 7. Risks

"What could derail this?" Known unknowns and dependencies on external decisions.

## Output

Write `docs/PRD.md` with the seven sections above, in this order, with the user's answers filled in.

Commit: `git add docs/PRD.md && git commit -m "PRD: <project name>"`.

End with: *"PRD saved. To turn this into an executable plan, run the `goals-setter` skill."*

## Hard rules

- Don't propose implementation. No frameworks, libraries, or code structure in the PRD.
- Don't accept fuzzy goals. "Improve UX" → reject. "<60s onboarding for new users" → accept.
- Don't write code samples in the PRD body.
- Refuse to start `/goal` or execution discussions. Hand off to `goals-setter` explicitly.
