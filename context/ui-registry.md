# UI Registry

Living document. Updated after every component is built. Read this before building any new component — match existing patterns exactly before inventing new ones.

---

## How to Use

Before building any component:

1. Check if a similar component already exists here
2. If yes — match its exact classes and patterns
3. If no — build it following `ui-rules.md` and `ui-tokens.md`, then add it here

After building any component — update this file with the component name, file path, and exact classes used.

---

## Components

### AmbientCanvas

File: `src/components/AmbientCanvas.tsx`
Last updated: 2026-06-09

| Property      | Value                                                                                   |
| ------------- | --------------------------------------------------------------------------------------- |
| Position      | `absolute inset-0 w-full h-full`, `z-index: 0`, `pointer-events: none`                 |
| Render        | WebGL, `{ alpha: false, antialias: true }`, DPR clamped to `min(devicePixelRatio, 2)`  |
| Effect        | Amber orb glow from lower-left, noise-modulated breathing pulse, pointer-reactive drift |
| Base color    | `#1C1917` (bg token)                                                                    |
| Amber glow    | `#451A03` × 1.5 intensity, noise-mixed, pulse at `sin(u_time * 0.4)`                   |
| Gold shimmer  | `#FBBF24` × 0.3 opacity, attenuated at lower-left origin                               |
| Mouse drift   | `(u_mouse - 0.5) * 0.06`, applied to UV before sampling                                |
| Vignette      | `1.0 - length(uv - 0.5) * 1.2`, clamped                                               |
| Fallback      | If `getContext('webgl')` returns null, function returns early — dark bg shows through   |
| Cleanup       | `cancelAnimationFrame` + `removeEventListener` on unmount                               |

**Pattern notes:**
Always rendered as the first child of the hero `<section>` before any content divs. The noise overlay `div.noise-overlay` sits immediately after the canvas at `z-index: 0, opacity: 0.03`. Content sits in a `relative z-10` wrapper above both. Never add `pointer-events: auto` to the canvas — it must never intercept clicks.

---

### HeroSketch

File: `src/components/HeroSketch.tsx`
Last updated: 2026-06-09

| Property        | Value                                                                                      |
| --------------- | ------------------------------------------------------------------------------------------ |
| Container       | `w-full h-full` SVG, `viewBox="0 0 560 480"`, `fill="none"`                               |
| Drop shadow     | `filter: drop-shadow(0 0 20px rgba(245,158,11,0.08))`                                     |
| Grid lines      | `.sketch-path`, `stroke="#292524"`, `strokeWidth="0.5"`, `strokeDasharray="4 8"`           |
| Target 1 rings  | 3 concentric circles at `cx=168 cy=180`, radii 72/48/28, amber strokes                    |
| Target 1 crosshairs | Lines at ±56px from center, `stroke="#F59E0B"`, `strokeWidth="0.8"`, `opacity="0.7"` |
| Target 2 rings  | 3 concentric circles at `cx=392 cy=300`, radii 64/42/24, muted strokes                    |
| Connector       | Dashed path between the two targets, `stroke="#451A03"`, `strokeDasharray="6 4"`          |
| Annotation arrows | `<path>` lines to label `<rect>` boxes, `.sketch-path`, muted stroke                   |
| Label boxes     | `<rect>` + `<text>`, `fill="rgba(28,25,23,0.8–0.9)"`, `stroke="#292524"`, font-mono 9–10px|
| Corner brackets | `L`-shaped paths at 4 corners, `stroke="#44403C"`, `strokeWidth="1"`                     |
| Score bar       | `<rect>` track + fill, fill `#F59E0B`, `rx="3"`, accompanied by `<text>` percentage      |
| GSAP entry      | `gsap.set` → `strokeDashoffset: 800`, then `gsap.timeline({ delay: 0.8 })` draws paths at 1.8s |
| GSAP circles    | `scale: 0 → 1`, `back.out(1.7)`, stagger 0.1s; breathing loop `scale: 1.05`, `sine.inOut`, yoyo |
| GSAP crosshairs | `scale: 0 → 1`, `back.out(2)`, stagger 0.08s; drift loop `rotation: 5`, sine, yoyo       |
| GSAP labels     | `opacity: 0, x: -10 → 0`, stagger 0.08s                                                   |

**Pattern notes:**
All animated elements use CSS class selectors (`.sketch-path`, `.sketch-circle`, `.sketch-label`, `.sketch-crosshair`) that GSAP targets via `svg.querySelectorAll`. Never animate by React state — all animation is pure GSAP after mount. The glow background behind the SVG is a sibling `div` with `radial-gradient(ellipse at 40% 50%, rgba(69,26,3,0.4) 0%, transparent 70%)` — not part of the SVG itself.

---

### Nav (Landing Page)

File: `src/components/Navbar.tsx`
Last updated: 2026-06-16

| Property       | Class / Value                                                                          |
| -------------- | -------------------------------------------------------------------------------------- |
| Position       | `fixed top-0 left-0 right-0 z-50`                                                     |
| Background     | Transparent by default; `.glass border-b border-[#292524]` after scroll (state-driven) |
| Height         | `h-14` (56px)                                                                          |
| Inner layout   | `max-w-7xl mx-auto px-6 flex items-center justify-between`                             |
| Logo mark      | `w-6 h-6 rounded bg-[#F59E0B]` square, SVG layers icon in `#1C1917`                  |
| Logo text      | `font-mono text-sm font-semibold tracking-tight text-text` (`#D6D3D1`)                |
| Alpha badge    | `text-[9px] font-mono px-1.5 py-0.5 rounded border border-[#F59E0B]/30 text-amber`   |
| Nav links      | `text-xs text-text-muted font-mono hover:text-text transition-colors tracking-wide`   |
| Sign in button | `text-xs font-mono text-text px-4 py-2 rounded-full hover:text-white`                 |
| CTA button     | `text-xs font-mono bg-[#F5F5F4] text-foreground px-4 py-2 rounded-lg font-medium hover:bg-white` |
| Scroll trigger | `window.addEventListener('scroll', ...)` → `setScrolled(window.scrollY > 40)`        |

**Pattern notes:**
Scroll detection uses a boolean state, not a class toggle on the element. The `transition-all duration-500` on the `<nav>` ensures smooth glass fade-in. The logo mark is always a 24×24px amber square with a stacked-layers SVG — never a wordmark or image. The alpha badge is always present during pre-launch; remove it when the app reaches stable release.

---

### Hero

File: `src/pages/LandingPage.tsx` (inline in page component)
Last updated: 2026-06-16

| Property        | Class / Value                                                                               |
| --------------- | ------------------------------------------------------------------------------------------- |
| Section         | `relative min-h-screen flex flex-col overflow-hidden`                                       |
| Background      | `<AmbientCanvas />` + `div.noise-overlay` as absolute layers; content in `relative z-10`   |
| Grid            | `grid grid-cols-1 lg:grid-cols-2 gap-12 items-center py-16`                                |
| Badge           | `.glass px-3 py-1.5 rounded-full` with amber pulse dot + mono eyebrow text                 |
| Headline        | Three stacked `<h1>` lines, `text-5xl md:text-6xl font-light`, letter-spacing `-0.025em`   |
| Headline line 2 | `.text-gradient` class for amber gradient treatment                                         |
| Body copy       | `text-sm text-text-muted leading-relaxed max-w-md font-light`                              |
| CTA row         | `flex items-center gap-4` — primary button + ghost play button                             |
| Play button     | Triangle SVG arrow (HTML borders trick), `rounded-full border border-text-muted`           |
| Terminal        | `.glass rounded-xl p-4 mt-2 max-w-md` — see Terminal Block below                          |
| Right column    | `relative w-full max-w-lg aspect-[7/6]` with amber radial-gradient glow + `<HeroSketch />` |
| GSAP sequence   | badge → headline children → copy → CTA → terminal, delays chain via `tl.from(..., '-=0.Xs')`|

**Pattern notes:**
The hero is the only section with `min-h-screen`. The two-column layout collapses to a single column on mobile (`lg:grid-cols-2`). The sketch column is hidden on small viewports (it requires sufficient width to read). The terminal block starts with 0 visible lines — a `setInterval` at 700ms reveals each line sequentially up to `termLines.length`, then clears. The cursor `▶ _` (with `.animate-blink`) only shows while lines are still being revealed.

---

### Terminal Block

File: `src/pages/LandingPage.tsx` (inline in hero section)
Last updated: 2026-06-16

| Property        | Class / Value                                                                     |
| --------------- | --------------------------------------------------------------------------------- |
| Container       | `.glass rounded-xl p-4`                                                           |
| Title bar       | `flex items-center gap-2 mb-3` — 3 dot circles + process name + live pill        |
| Dots            | `w-2.5 h-2.5 rounded-full bg-[#44403C]` × 3                                     |
| Process label   | `text-[9px] font-mono text-text-dim tracking-wider`                              |
| Live pill       | `text-[9px] font-mono text-amber animate-pulse-amber` — `● LIVE`                 |
| Log lines       | `flex items-start gap-2 text-[11px] font-mono`                                   |
| `[OK]` tag      | `text-amber shrink-0`                                                             |
| `[LD]` tag      | `text-text-muted shrink-0`                                                        |
| Line text       | `text-text` (`#D6D3D1`)                                                           |
| Cursor row      | `text-[11px] font-mono text-text-dim` — `▶` + `.animate-blink` span with `_`    |
| Reveal timing   | `setInterval` at 700ms per line, cleared when all lines shown                    |

**Pattern notes:**
`termLines` is a static array defined inside the component — never fetched. The cursor row only renders when `visibleLines < termLines.length`. Line type (`ok` vs `ld`) drives only the tag color, not the message text color (always `text-text`). The terminal block sits below the CTA row with `mt-2` — it is not inside the CTA row.

---

### TickerLine

File: `src/components/TickerLine.tsx`
Last updated: 2026-06-16

| Property     | Class / Value                                                                           |
| ------------ | --------------------------------------------------------------------------------------- |
| Container    | `overflow-hidden border-y border-[#292524] py-2`                                        |
| Inner track  | `flex gap-12 whitespace-nowrap`, `animation: ticker 28s linear infinite`               |
| Items        | Array doubled (`[...items, ...items]`) so the loop is seamless                         |
| Item text    | `text-xs font-mono tracking-widest text-text-dim flex items-center gap-3`              |
| Separator    | `w-1 h-1 rounded-full bg-amber inline-block opacity-60`                                |
| Animation    | `@keyframes ticker` injected via `<style>` tag: `translateX(0) → translateX(-50%)`     |

**Pattern notes:**
The ticker sits between the hero and the stats bar — it is a section divider, not a component inside another section. The `<style>` tag is co-located inside the component return — this is acceptable since the keyframe name is unique. Items are always uppercase, space-separated words. Never use a JS-based scroll loop — CSS animation only.

---

### StatsBar

File: `src/components/StatsBar.tsx`
Last updated: 2026-06-16

| Property      | Class / Value                                                                       |
| ------------- | ----------------------------------------------------------------------------------- |
| Section       | `border-b border-[#292524]`                                                         |
| Grid          | `max-w-7xl mx-auto px-6 grid grid-cols-2 md:grid-cols-4 divide-x divide-[#292524]` |
| Cell          | `py-8 px-6 first:pl-0`                                                             |
| Stat value    | `text-3xl font-light .text-gradient mb-1`, letter-spacing `-0.02em`               |
| Stat label    | `text-xs text-text-muted font-mono`                                                 |
| GSAP          | `gsap.from(children, { opacity:0, y:20, stagger:0.1, scrollTrigger start:'top 85%' })` |

**Pattern notes:**
Four stats: always `grid-cols-2` on mobile, `grid-cols-4` on desktop. `divide-x` handles the vertical rule between cells — never use explicit border on individual cells. The `first:pl-0` removes left padding from the first cell so it aligns flush with the page edge. Stat values always use `.text-gradient`.

---

### Features Grid

File: `src/components/Features.tsx`
Last updated: 2026-06-16

| Property      | Class / Value                                                                                |
| ------------- | -------------------------------------------------------------------------------------------- |
| Section       | `py-24 border-b border-[#292524]`                                                            |
| Grid          | `grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4`                                      |
| Card outer    | `feat-card group gradient-shell cursor-default`                                              |
| Card inner    | `.glass rounded-[11px] p-5 h-full flex flex-col gap-4 hover:bg-[rgba(28,25,23,0.8)] transition-all duration-300` |
| Icon shell    | `w-8 h-8 rounded-lg glass flex items-center justify-center` — contains `◎` in `text-amber`  |
| Tag           | `text-[9px] font-mono text-text-dim tracking-wider mt-1` — ALL_CAPS_UNDERSCORE format       |
| Title         | `text-sm font-medium text-text mb-2`                                                         |
| Body          | `text-xs text-text-muted leading-relaxed font-light`                                         |
| Header row    | `flex items-start justify-between` — icon shell left, tag right                             |
| GSAP          | `.feat-card` stagger 0.1s, `y: 32 → 0`, `scrollTrigger start: 'top 80%'`                   |

**Pattern notes:**
Each card uses the `gradient-shell` outer wrapper for the amber edge-glow treatment. The `rounded-[11px]` on the inner card is exactly 1px smaller than the shell's `14px` radius so the gradient hairline is visible. Hover only changes the background opacity — no scale, no shadow, no border changes. The icon is always the `◎` character in `text-amber` — never a library icon in this grid.

---

### HowItWorks

File: `src/pages/LandingPage.tsx` (inline in page component)
Last updated: 2026-06-16

| Property         | Class / Value                                                                            |
| ---------------- | ---------------------------------------------------------------------------------------- |
| Section          | `py-24 border-b border-[#292524]`                                                        |
| Layout           | `grid grid-cols-1 lg:grid-cols-2 gap-16 items-center`                                   |
| Step item        | `step-item flex gap-5 group`                                                             |
| Step number shell| `w-8 h-8 rounded-lg glass flex items-center justify-center shrink-0 group-hover:border-[#F59E0B]/40 transition-colors` |
| Step number text | `text-[10px] font-mono text-amber`                                                       |
| Connector line   | `w-px flex-1 bg-[#292524] my-1 min-h-[32px]` — only between steps, not after last       |
| Step title       | `text-sm font-medium text-text mb-1`                                                     |
| Step body        | `text-xs text-text-muted leading-relaxed font-light`                                     |
| GSAP             | `.step-item` stagger 0.15s, `x: -24 → 0`, `scrollTrigger start: 'top 80%'`             |

**Pattern notes:**
The connector line is a sibling element to the step number shell inside the `flex flex-col items-center` column, not a pseudo-element. The `min-h-[32px]` prevents the connector collapsing when step body text is short. Hover on a step only shifts the number shell border to amber — never the entire row. The step body (`pb-6`) provides the visual spacing; the connector grows to fill the remaining height with `flex-1`.

---

### Score Card Mockup

File: `src/pages/LandingPage.tsx` (inline inside HowItWorks section)
Last updated: 2026-06-16

| Property        | Class / Value                                                                           |
| --------------- | --------------------------------------------------------------------------------------- |
| Outer wrapper   | `div.gradient-shell`                                                                    |
| Card            | `.glass rounded-[11px] p-6`                                                             |
| Header          | `flex items-center justify-between mb-5`                                                |
| Sub-label       | `text-[9px] font-mono text-text-muted tracking-wider block mb-0.5`                     |
| Job title       | `text-sm font-medium text-text`                                                         |
| Status pill     | `text-[9px] font-mono text-amber animate-pulse-amber` — `● SCORED`                     |
| Score ring      | 80×80px SVG, `-rotate-90`, track `stroke="#292524"` strokeWidth 6, fill amber→gold     |
| Ring value      | `absolute inset-0 flex flex-col items-center justify-center` — `text-xl font-light text-gold` + `text-[8px] font-mono text-text-muted` |
| Score bars      | 4 rows: label row `flex justify-between text-[9px] font-mono text-text-muted mb-0.5`, bar `h-1 rounded-full bg-[#292524]` with fill `bg-gradient-to-r from-amber to-gold` |
| Improvements    | `div.glass-light rounded-lg p-3 space-y-2` with `text-[9px] font-mono text-text-muted tracking-wider` heading |
| Improvement tag | `shrink-0 px-1 py-0.5 rounded text-[8px] font-medium` — colors vary by type (see ui-tokens.md) |
| Improvement text| `text-[10px] font-mono text-text-muted leading-relaxed`                                 |

**Pattern notes:**
Score ring circumference math: `2 * Math.PI * 34 * (score / 100)` for the filled arc, remainder for the gap. `strokeLinecap="round"` rounds the arc endpoints. The ring always animates on scroll reveal via GSAP — use `gsap.from` on the parent card. The `glass-light` improvements panel is always the last element in the card. Never render an empty improvements list — always show at least 2 entries.

---

### Pipeline

File: `src/pages/LandingPage.tsx` (inline in page component)
Last updated: 2026-06-16

| Property       | Class / Value                                                                           |
| -------------- | --------------------------------------------------------------------------------------- |
| Section        | `py-24 border-b border-[#292524]`                                                       |
| Grid           | `grid grid-cols-2 md:grid-cols-4 gap-3`                                                |
| Column         | `col-card flex flex-col gap-2`                                                          |
| Column header  | `flex items-center justify-between mb-1` — label in stage color, count in `text-text-dim` |
| Column label   | `text-[10px] font-mono tracking-wider` — color from stage color map                    |
| Item card      | `.glass rounded-xl p-3 hover:border-[#F59E0B]/20 transition-colors cursor-default`     |
| Item role      | `text-[11px] font-medium text-text leading-tight`                                      |
| Item company   | `text-[10px] text-text-muted font-mono`                                                 |
| Score bar row  | `flex items-center justify-between` — bar left, timestamp right                        |
| Score bar track| `h-1 w-12 rounded-full bg-[#292524]`                                                   |
| Score bar fill | `h-full rounded-full` with inline `background: stageColor`                             |
| Score value    | `text-[9px] font-mono` in stage color                                                   |
| Timestamp      | `text-[9px] font-mono text-text-dim`                                                    |
| GSAP           | `.col-card` stagger 0.08s, `y: 28 → 0`, `scrollTrigger start: 'top 80%'`              |

**Pipeline stage color map:**

| Stage        | Color     | Token reference         |
| ------------ | --------- | ----------------------- |
| Applied      | `#78716C` | `text-text-muted`       |
| Interviewing | `#F59E0B` | `text-amber`            |
| Offer        | `#FBBF24` | `text-gold`             |
| Archived     | `#44403C` | `text-text-dim`         |

**Pattern notes:**
Score bar fill color is set via inline `style={{ background: col.color }}` not a Tailwind class, because the color is dynamic from the stage data. Hover on item cards only shifts the border color — no background change, no scale. The column count (e.g. `12`) is the total applications in that stage, always in `text-text-dim` to the right of the label.

---

### CTA Section

File: `src/pages/LandingPage.tsx` (inline in page component)
Last updated: 2026-06-16

| Property      | Class / Value                                                                           |
| ------------- | --------------------------------------------------------------------------------------- |
| Section       | `py-32`                                                                                 |
| Layout        | `max-w-7xl mx-auto px-6 text-center`                                                    |
| Eyebrow       | `text-[10px] font-mono tracking-widest text-text-muted block mb-4` — `// START_NOW`    |
| Headline      | `text-5xl md:text-6xl font-light text-text mb-4`, letter-spacing `-0.025em`            |
| Body          | `text-sm text-text-muted mb-10 max-w-sm mx-auto font-light leading-relaxed`            |
| CTA row       | `flex items-center justify-center gap-4 flex-wrap`                                      |
| Primary button| `text-sm font-mono font-medium bg-[#F5F5F4] text-foreground px-8 py-3.5 rounded-lg hover:bg-white hover:shadow-[0_0_40px_rgba(245,158,11,0.25)]` |
| No-card note  | `text-[10px] font-mono text-text-dim` — "No credit card required"                      |
| GSAP          | `gsap.from(section, { opacity:0, y:32, scrollTrigger start:'top 85%' })`               |

**Pattern notes:**
The CTA section has no card wrapper — it sits directly on the page background. No border-bottom — it is the last content section before the footer. The amber hover shadow on the primary button (`0_0_40px_rgba(245,158,11,0.25)`) is the strongest glow effect on the page — intentionally more prominent than the hero CTA button's 24px variant. The "No credit card required" note always appears as a sibling to the button, never below it.

---

### Footer

File: `src/components/Footer.tsx`
Last updated: 2026-06-16

| Property      | Class / Value                                                                           |
| ------------- | --------------------------------------------------------------------------------------- |
| Container     | `border-t border-[#292524] py-8`                                                        |
| Inner         | `max-w-7xl mx-auto px-6 flex flex-col md:flex-row items-center justify-between gap-4`  |
| Logo mark     | `w-5 h-5 rounded bg-amber` square with stacked-layers SVG icon                         |
| Brand label   | `text-xs font-mono text-text-muted`                                                     |
| Links row     | `flex items-center gap-6`                                                               |
| Link          | `text-[11px] font-mono text-text-dim hover:text-text-muted transition-colors`          |
| Copyright     | `text-[10px] font-mono text-text-dim`                                                   |

**Pattern notes:**
Four footer links: Privacy, Terms, Changelog, GitHub. The logo mark in the footer is 20×20px (vs 24px in the navbar) — always use the smaller size here. On mobile, the three rows (logo, links, copyright) stack vertically via `flex-col`. Never add a newsletter form or social icons to the footer in the current scope.

---

## Patterns Reference

### Eyebrow + Two-tone Heading

Used in: Features, HowItWorks, Pipeline, CTA, and any future section.

```tsx
<span className="text-[10px] font-mono tracking-widest text-amber block mb-3">
  // SECTION_LABEL
</span>
<h2 className="text-4xl font-light text-text" style={{ letterSpacing: '-0.02em' }}>
  Active line.<br />
  <span className="text-text-muted">Muted line.</span>
</h2>
```

Always: `//` prefix, ALL_CAPS_UNDERSCORE label, 10px mono. Heading always splits into two lines — active and muted. Never use a single-color section heading.

---

### Gradient Shell + Glass Card

Used in: Features cards, Score Card Mockup, any card that needs amber edge emphasis.

```tsx
<div className="gradient-shell">
  <div className="glass rounded-[11px] p-5 ...">
    {/* content */}
  </div>
</div>
```

The outer `gradient-shell` has `border-radius: 14px` and `padding: 1px`. The inner card must use `rounded-[11px]` so the 1px gradient hairline is visible on all edges. Never apply `gradient-shell` to a card that already uses `glass-light` — the light variant is for inset panels only.

---

### GSAP Scroll Reveal

Used in: every section except the hero (which triggers on mount).

```tsx
const ref = useRef<HTMLDivElement>(null)
useEffect(() => {
  gsap.from(ref.current?.querySelectorAll('.target-class') ?? [], {
    opacity: 0,
    y: 28,          // or x: -24 for horizontal reveal
    duration: 0.6,
    stagger: 0.1,
    ease: 'power2.out',
    scrollTrigger: { trigger: ref.current, start: 'top 80%' }
  })
}, [])
```

Always use `gsap.from()` (not `gsap.to()`) for scroll reveals so elements start invisible without requiring CSS. Always attach `ScrollTrigger` to the section's ref element. Stagger values: 0.08s for grid items, 0.1s for stat cards, 0.15s for step items. Trigger start is always `'top 80%'` unless the section is very tall (use `'top 75%'` then).

---

### Status Pill

Used in: terminal block, score card mockup, and any live-status indicator.

```tsx
<span className="text-[9px] font-mono text-amber animate-pulse-amber">● STATUS</span>
```

Always: 9px, font-mono, `text-amber`, `animate-pulse-amber`. Status text is always uppercase. The `●` bullet is always the content character, never an SVG or icon. Never use `text-gold` for status pills — amber only.
