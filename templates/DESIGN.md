---
version: alpha
name: Phosphor
description: Operator-grade terminal aesthetic for prototype dashboards. Dark, flat, dense, monospace-leaning. A single emerald accent does all the heavy lifting. Built for real-time data and container portability (Tauri/Electron).
colors:
  bg: "#0A0B0D"
  bg-elevated: "#111316"
  border: "#1F2227"
  primary: "#E8E8E3"
  ink: "#E8E8E3"
  ink-muted: "#8A8F98"
  ink-dim: "#3A3D42"
  accent: "#00E5A8"
  on-accent: "#0A0B0D"
  warn: "#F0B429"
  error: "#FF5A5A"
  info: "#4DABF7"
typography:
  label-caps:
    fontFamily: Berkeley Mono
    fontSize: 0.6875rem
    fontWeight: 500
    letterSpacing: 0.05em
    fontFeature: '"tnum" 1'
  body:
    fontFamily: Berkeley Mono
    fontSize: 0.8125rem
    fontWeight: 400
    lineHeight: 1.45
    fontFeature: '"tnum" 1'
  body-prose:
    fontFamily: Inter
    fontSize: 0.875rem
    fontWeight: 400
    lineHeight: 1.55
  numeric-lg:
    fontFamily: Berkeley Mono
    fontSize: 1.5rem
    fontWeight: 500
    letterSpacing: -0.01em
    fontFeature: '"tnum" 1'
  h2:
    fontFamily: Berkeley Mono
    fontSize: 1.125rem
    fontWeight: 500
  h1:
    fontFamily: Berkeley Mono
    fontSize: 1.5rem
    fontWeight: 500
rounded:
  sm: 2px
  md: 4px
spacing:
  xs: 4px
  sm: 8px
  md: 12px
  lg: 16px
  xl: 24px
  2xl: 32px
components:
  top-bar:
    backgroundColor: "{colors.bg}"
    textColor: "{colors.ink}"
    height: 36px
    padding: 8px
  stat-card:
    backgroundColor: "{colors.bg-elevated}"
    textColor: "{colors.ink}"
    rounded: "{rounded.sm}"
    padding: 12px
  data-row:
    textColor: "{colors.ink}"
    typography: "{typography.body}"
    padding: 8px
  log-stream:
    backgroundColor: "{colors.bg}"
    padding: 0px
  log-line:
    textColor: "{colors.ink}"
    typography: "{typography.body}"
    padding: 4px
  button-primary:
    backgroundColor: "{colors.accent}"
    textColor: "{colors.on-accent}"
    typography: "{typography.label-caps}"
    rounded: "{rounded.sm}"
    padding: 8px
  button-secondary:
    backgroundColor: "{colors.bg}"
    textColor: "{colors.accent}"
    typography: "{typography.label-caps}"
    rounded: "{rounded.sm}"
    padding: 8px
  alert-warn:
    backgroundColor: "{colors.bg-elevated}"
    textColor: "{colors.warn}"
    rounded: "{rounded.sm}"
    padding: 12px
  alert-error:
    backgroundColor: "{colors.bg-elevated}"
    textColor: "{colors.error}"
    rounded: "{rounded.sm}"
    padding: 12px
  alert-info:
    backgroundColor: "{colors.bg-elevated}"
    textColor: "{colors.info}"
    rounded: "{rounded.sm}"
    padding: 12px
  chip:
    backgroundColor: "{colors.bg}"
    textColor: "{colors.ink-muted}"
    typography: "{typography.label-caps}"
    rounded: "{rounded.sm}"
    padding: 4px
  status-pill:
    backgroundColor: "{colors.bg-elevated}"
    textColor: "{colors.accent}"
    typography: "{typography.label-caps}"
    rounded: "{rounded.md}"
    padding: 4px
  event-marker:
    backgroundColor: "{colors.accent}"
    size: 8px
  entity-row:
    textColor: "{colors.ink}"
    typography: "{typography.body}"
    padding: 4px
  queue-bar:
    backgroundColor: "{colors.bg-elevated}"
    height: 8px
    rounded: "{rounded.sm}"
---

## Overview

Phosphor is a personal house-style for prototype dashboards. The vibe is **operator-grade terminal**: flat surfaces, hairline borders, monospace numerics, and a single emerald accent doing all the heavy lifting. It reads like instrumentation, not a product page.

Two mandates, equally weighted:

1. **Visual continuity.** Different prototypes should feel like they're from the same operator's workbench, without being identical. Tight rules on type, color, and borders; loose on layout.
2. **Engineering parsimony.** Pick the smallest, fastest tool that does the job well *per element*. Bundle weight is a design constraint, not an afterthought. Animations exist, but they earn their bytes — they communicate state, not personality.

This file is meant to live at the root of a project and be referenced verbatim by coding agents. Drop it in, point the agent at it, build.

## Colors

The palette is monochromatic by intent. Almost everything is `bg`, `bg-elevated`, `ink`, or `ink-muted`. The semantic colors (`accent`, `warn`, `error`, `info`) are reserved for state — never decoration.

- **bg (#0A0B0D)** — Near-black with slight warmth. Avoid pure `#000`; it crushes contrast and looks cheap on OLED.
- **bg-elevated (#111316)** — The *only* depth mechanism. Panels, cards, modals, popovers all use this — no shadows.
- **border (#1F2227)** — Hairlines, always 1px. The structural workhorse. Used in CSS, not in component tokens (the design.md spec has no `borderColor` component property).
- **primary (#E8E8E3)** — Alias of `ink`. Present because the linter expects a `primary` token; semantically identical to `ink`.
- **ink (#E8E8E3)** — Primary text. Warm off-white. Reserved for the things you actually want read.
- **ink-muted (#8A8F98)** — Labels, captions, metadata. The "ambient" layer. Tuned to clear WCAG AA against `bg` at small sizes.
- **ink-dim (#3A3D42)** — Disabled state, low-priority text, stale values. Visible but recedes. Used as a state token (in CSS), not a static component property.
- **accent (#00E5A8)** — Phosphor emerald. The single attention-grabber. One target per view.
- **on-accent (#0A0B0D)** — Text drawn on top of `accent` fills (e.g. primary button labels).
- **warn / error / info** — Used sparingly. Never two semantic colors on the same view at once.

**Rule of one accent.** If the accent is glowing in two places at once, you've failed. Pick the more important one and dim the other.

## Typography

Monospace first, prose-sans second.

- **`{typography.body}` Berkeley Mono 13px** — The default. Used for everything: labels, numbers, button text, data rows.
- **`{typography.label-caps}` Berkeley Mono 11px uppercase, +0.05em tracking** — Section labels, axis labels, button text on busy surfaces. Apply `text-transform: uppercase` in CSS; the design.md token doesn't carry the transform.
- **`{typography.numeric-lg}` Berkeley Mono 24px medium, -0.01em** — Hero numbers on stat cards.
- **`{typography.body-prose}` Inter 14px** — Only when there's more than ~2 lines of running prose (modal copy, error explanations, settings descriptions). Pure-mono prose at length is hostile.
- **`{typography.h1}` / `{typography.h2}`** — Page/section titles. Stay in mono. Bold is forbidden; the medium weight (500) is the maximum emphasis.

**Font stack (CSS, not in the design.md token):**

```css
--font-mono:  "Berkeley Mono", "JetBrains Mono", ui-monospace, SFMono-Regular, monospace;
--font-sans:  Inter, ui-sans-serif, system-ui, sans-serif;
```

System fallbacks first means a Tauri or Electron bundle without the font shipped still gets a credible mono. Cap web fonts at two faces (regular + medium). `font-display: swap` on both.

**Tabular figures are non-negotiable.** Every number, everywhere, uses `font-feature-settings: "tnum" 1`. Columns of numbers must align.

## Layout

Tight by default. The spacing scale is `4 / 8 / 12 / 16 / 24 / 32`. Most gaps are `sm` (8) or `md` (12). `xl` (24) is the *outer* page padding; anything more breathes too much for this aesthetic.

- **No CSS `position: fixed` for app chrome.** Use a flex column root: `<header>` / `<main>` / `<footer>`. This survives window resize gracefully in Tauri/Electron and allows resizable side panels.
- **Two grid sizes for dashboards.** A 12-column macro grid for layout, and an internal 4px micro grid for alignment. Everything snaps to 4.
- **Density over hierarchy.** When in doubt, lose the margin, not the data.

## Elevation & Depth

Phosphor is **flat**. Depth is a single binary: `bg` or `bg-elevated`. No shadows, no glows, no inset-vs-raised. The only legal depth signal is a 1px `{colors.border}` plus the `bg-elevated` swap.

This is a design rule, not a limitation. Shadows on dark UIs almost always look amateur; hairlines on dark UIs almost always look intentional.

## Shapes

Sharp corners are the default. Rounding is the exception, used for the small handful of components that benefit from it (buttons, chips, pills). Available radii are `sm: 2px` and `md: 4px` — that's all. There is no `lg`, no `full`, no pill shapes (except `status-pill`, which earns its name because it represents a *live thing*, the one place a pill semantic fits).

## Components

Every component below is defined by the tokens in the front matter. The prose here describes *behavior* and *placement*, which the YAML can't express.

- **`top-bar`** — 36px, doubles as the window drag region in container apps (`-webkit-app-region: drag` / `data-tauri-drag-region`). Reserve ~80px on the top-left (macOS traffic lights) and ~138px on the top-right (Windows controls). Interactive children opt out of dragging.
- **`stat-card`** — Hairline border, `{typography.label-caps}` muted label, `{typography.numeric-lg}` body, delta line with ▲ / ▼ glyph colored by direction (accent for good, error for bad).
- **`data-row`** — Mono, tabular figures, 8px vertical padding. No zebra striping; the hairline 1px bottom border is enough.
- **`log-stream`** — Virtualized list (use `@tanstack/virtual`). Auto-scroll-to-bottom by default, with a sticky "◆ FOLLOW" toggle in the bottom-right corner. The moment the user scrolls up, follow is suspended; resume on scroll-to-edge.
- **`log-line`** — Format: `timestamp · level · source · message`. Single-line truncate with hover-to-expand. Only the `level` word is colored (`warn` / `error` / `info`).
- **`button-primary`** — Accent fill, `on-accent` label, `sm` rounded, 8/12 padding. Use *once per region*.
- **`button-secondary`** — 1px accent border, accent label, transparent bg. Use everywhere else.
- **`alert-warn` / `alert-error` / `alert-info`** — 1px semantic border on `bg-elevated`, no fill, leading ◆ glyph in the semantic color.
- **`chip`** — 1px `border` outline, `label-caps`, no fill. For filter pills, tag lists.
- **`status-pill`** — A small pill containing `label-caps` text on `bg-elevated` with the accent (or semantic) as text color. Pulses opacity 1 → 0.6 → 1 on heartbeat. Decays to `ink-dim` text after the expected refresh interval passes.
- **`event-marker`** — 8px square (not a circle — circles read decorative) on a horizontal timeline. Colored by category. Hover surfaces a tooltip with the event payload.
- **`entity-row`** — Tree row showing `key: value` in mono. On change: old value strikes through for `duration-fast`, new value tick-highlights.
- **`queue-bar`** — 8px-tall stacked horizontal bar: accent (incoming), warn (processing), error (failed), border color (idle). Hover surfaces per-segment counts.

## Do's and Don'ts

**Do**

- Use mono for all numbers, all the time. Tabular figures non-negotiable.
- Use hairlines (1px `{colors.border}`) over fills.
- Reserve `accent` for one target per view.
- Show freshness on every live value — visibly stale when stale.
- Yield auto-scroll to the user the instant they scroll up.
- Virtualize anything that could exceed 200 rows.
- Coalesce real-time updates per `requestAnimationFrame`. Never re-render per WebSocket message.
- Measure bundle size at every commit. Target: <100KB gzipped for a typical dashboard view.

**Don't**

- Drop shadows. Glow effects. The cyberpunk pull is constant — resist it.
- Two semantic colors on the same view at once.
- `rounded-full`, pill shapes, capsules. The lone exception is `status-pill`.
- CSS-in-JS runtimes (Emotion, styled-components). Bundle bloat for no gain.
- Icon fonts. Use tree-shaken `lucide-react` per-import.
- Chart "kitchen sink" libraries (Chart.js, Recharts, Nivo). Use `uPlot` or hand-rolled SVG.
- Content-shaped loading skeletons. They lie. Use `—` or a 1px shimmer line.
- Decorative animation. Scale-on-hover, parallax, scroll-triggered choreography are banned.
- CDN-loaded assets. Container apps may run offline.

## Motion

Animations are functional only — they communicate *what changed*.

**Duration tokens (CSS variables, not design.md tokens):**

```css
--duration-fast: 120ms;   /* state flips, hover, tick-highlight in */
--duration-base: 180ms;   /* disclosure, list inserts, tick-highlight fade */
--duration-slow: 240ms;   /* route transitions, stale-decay */
--ease:          cubic-bezier(0.2, 0.8, 0.2, 1);  /* one curve everywhere */
```

**Patterns:**

- **`tick-highlight`** — Any value that just changed flashes `accent` background at ~25% opacity for `duration-fast`, then fades over `duration-base`. Opacity only — no scale, no shift.
- **`stream-insert`** — New rows appear at fixed scroll position; the list does not jump. Auto-scroll resumes only when the user reaches the edge.
- **`stale-decay`** — Any live value not refreshed within its expected interval fades opacity 1 → 0.5 over `duration-slow`. Each stream defines its own threshold.
- **`route-transition`** — Use the native `view-transition-name` API for SPA route changes. No JS animation library.

**Hard rules:**

- One easing curve. No bounces, no overshoot.
- CSS transitions and `view-transition-name` over JS. WAAPI only when CSS literally can't express it.
- Zero animation libraries. No Framer Motion. No GSAP.
- Honor `prefers-reduced-motion: reduce` — disable tick-highlight and route transitions; keep state-change opacity transitions because they convey *information*.

## Container Portability

Phosphor targets the web first but is designed to wrap cleanly in a desktop container.

- **Prefer Tauri over Electron when starting fresh.** Tauri ships ~10–30MB (system WebView + Rust); Electron ships ~100MB+ (bundled Chromium). Tauri also enforces a stricter security model, which suits "operator tool" framing. Electron is the right call if you need a mature plugin ecosystem now.
- **Top bar is the drag region.** The `top-bar` component naturally doubles as the window drag handle. Apply `-webkit-app-region: drag` (Electron) or `data-tauri-drag-region` (Tauri) to the bar, and `no-drag` to interactive children.
- **Reserve native chrome space:** ~80px top-left for macOS traffic lights, ~138px top-right for Windows controls. The top bar layout must assume both.
- **All assets local.** No CDN fonts, no CDN scripts. Container apps may run offline; CDN-dependent UIs break.
- **Respect platform preferences** even though we're dark-only: `prefers-color-scheme` informs the OS that this is a dark app (matters for native context menus, scrollbars). `prefers-reduced-motion` disables decorative animation.

New chrome token: `app-chrome-height: 36px`.

## Real-Time Data

Phosphor's whole point. Live data is the *default* shape, not a special case.

**Transport (preferred order):**

- Native `WebSocket` first. It's free.
- `partysocket` when you need reconnection / heartbeat logic and don't want to write it.
- Server-Sent Events for one-way streams.
- Skip `socket.io` unless you actually use rooms.

**Rendering:**

- **Virtualization:** `@tanstack/virtual` (headless, ~3KB). Required for any list that could exceed 200 items.
- **Live charts:** `uPlot` for time-series. Hand-rolled SVG for sparklines. Switch to Canvas (or `OffscreenCanvas`) when DOM nodes per chart > 1000.
- **Heavy parsing/filtering:** push to a Web Worker before it costs a frame. Use `comlink` if you want ergonomic RPC; raw `postMessage` otherwise.
- **Update coalescing:** throttle visual updates to `requestAnimationFrame`. Batch state changes per frame. Never re-render per-message.

**Freshness display:**

- Every polled or streamed value shows a last-update timestamp nearby (small, `{colors.ink-dim}`, `{typography.label-caps}`).
- Values past their freshness threshold visibly decay (`stale-decay` motion pattern).
- Heartbeat indicators (`status-pill`) pulse on every tick. If they stop pulsing, you should *see* that.

## Stack

Preferred building blocks, in order of preference per element. The principle is *smallest credible option*. Not mandatory, but the burden of proof is on the deviation.

| Concern | Preferred | Avoid |
|:--------|:----------|:------|
| Build tool | Vite | Webpack, Parcel, Turbopack (for prototypes) |
| Styling | Tailwind v4 `@theme` block, or plain CSS custom properties | CSS-in-JS runtimes (Emotion, styled-components) |
| State (small) | Signals (`@preact/signals-react`) or Zustand | Redux Toolkit, MobX |
| Icons | `lucide-react`, per-import | Icon fonts, FontAwesome |
| Charts (live) | `uPlot`, hand-rolled SVG | Chart.js, Recharts, Nivo |
| Virtualization | `@tanstack/virtual` | `react-window` (older API), `react-virtualized` |
| WebSocket | Native `WebSocket`, then `partysocket` | `socket.io` (unless rooms required) |
| Worker RPC | `comlink`, or raw `postMessage` | RxJS for message passing |
| Primitives | Native `<dialog>`, `<details>`, `<popover>` | Radix (only when ARIA truly demands it) |
| Container | Tauri | Electron (only when ecosystem demands) |

**Budget targets:**

- Typical dashboard view: <100KB gzipped JS, <20KB gzipped CSS.
- First contentful paint: <1s on a mid-tier laptop with a cold cache.
- Container app cold start: <500ms to first frame on Tauri.
