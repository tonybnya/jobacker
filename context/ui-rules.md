# UI Rules

Concise rules for building Jobacker UI. The `DESIGN.md`, `inspiration.png`, and the built landing page are the source of truth for visual decisions. These rules cover the most important patterns and constraints to keep the UI consistent without over-specifying every detail.

---

## Font

Import JetBrains Mono from Google Fonts in the root `index.html`. For the app shell, system-ui is the body font; JetBrains Mono is used for all terminal UI, monospace labels, eyebrows, nav items, and data readouts.

```html
<link rel="preconnect" href="https://fonts.googleapis.com">
<link href="https://fonts.googleapis.com/css2?family=JetBrains+Mono:wght@300;400;500;600&display=swap" rel="stylesheet">
```

The `--font-mono` variable is declared in `@theme` in `src/index.css`. Apply `font-mono` to any element that renders terminal-style data, eyebrows, nav items, stat labels, or badge tags. The body font (`--font-sans`, system-ui) is used for large display headlines and supporting copy only. Never mix the two within a single UI element.

---

## Layout

- Page max-width: 1280px (`max-w-7xl`), centered
- Main content area padding: `px-6` on all pages
- Gap between page sections: `py-24` (96px) per section
- Navbar height: 56px (`h-14`), full-width, uses glass treatment after scroll
- All pages use the top navbar only — no sidebar, no drawer, no persistent overlay

---

## Navbar

Four nav items on the landing page: Features, How it works, Pricing, Changelog. The authenticated app navbar may differ — match whatever is in `Nav.tsx`.

- Active item: `text-amber` (`#F59E0B`), `font-mono`, 12px, tracking-wide
- Inactive item: `text-text-muted` (`#78716C`), `font-mono`, 12px
- No underline — active state is color change only
- Navbar background: transparent by default; after scroll, applies `.glass` + `border-b border-border`
- Never use `position: fixed` inside the navbar content — the navbar itself is `fixed top-0` only

---

## Cards and Surfaces

Every content section lives in a glass card. There are two glass variants — use the standard glass for primary content blocks, and glass-light for inset or secondary panels within a card.

**Standard glass card:**

```
background:      rgba(28, 25, 23, 0.6)
border:          1px solid rgba(41, 37, 36, 0.6)
border-radius:   12px
padding:         20px (p-5) or 24px (p-6)
backdrop-filter: blur(12px)
```

**Light glass card (nested panels, inset regions):**

```
background:      rgba(68, 64, 60, 0.2)
border:          1px solid rgba(41, 37, 36, 0.4)
border-radius:   12px
padding:         12px (p-3) or 16px (p-4)
backdrop-filter: blur(8px)
```

**Gradient shell (premium emphasis):**

Wrap any card that needs the amber edge-glow treatment in a `div.gradient-shell`. The shell is a 1px-padding wrapper with the amber linear-gradient border. The inner card then uses `rounded-[11px]` (one radius step smaller than the shell's 12px).

Never use colored backgrounds on cards themselves — all color lives inside cards via badges, bars, sketch lines, and text.

---

## Typography Hierarchy

Three levels used consistently throughout:

**Section headings — card titles, page section titles**

```
font-size:   40px (landing) / 16px (app)
font-weight: 300 (landing) / 600 (app)
color:       text-text (#D6D3D1) or text-text-muted (#78716C) for the muted half
letter-spacing: -0.02em
```

**Body / primary content text**

```
font-size:   14px
font-weight: 300
color:       text-text-muted (#78716C)
line-height: relaxed
```

**Labels / eyebrows / terminal readouts**

```
font-size:   9–12px
font-weight: 400–500
font-family: font-mono
color:       text-amber (#F59E0B) for section eyebrows
             text-text-muted (#78716C) for secondary mono labels
             text-text-dim (#44403C) for dim decorative text
letter-spacing: tracking-wider or tracking-widest
```

Stat/score numbers use `text-gradient` + 30px / weight 300 / letter-spacing -0.02em.

---

## Badges

All badges use `rounded-full` (pill) unless they are improvement tags inside a score card.

```
padding:    px-2 py-0.5
font-size:  9–10px
font-weight: 500
font-family: font-mono
```

Improvement tags inside the analysis card use `rounded-sm` (4px) and a colored background matched to their type: `ADD` uses `bg-primary text-gold`, `REPHRASE` uses `bg-border text-text`, `FORMAT` uses `bg-bg border-border text-text-muted`.

Status indicator pills (live, scored, active) are always `font-mono text-amber` with `animate-pulse-amber` on the dot.

---

## Buttons

**Primary (light on dark):**

```
background:    #F5F5F4
color:         #0C0A09
border-radius: 8px
padding:       10px 20px
font-size:     12px
font-family:   font-mono
font-weight:   500
hover-shadow:  0 0 24px rgba(245,158,11,0.2)
```

**Ghost / secondary:**

```
background:    .glass surface
color:         text-text
border-radius: 9999px
padding:       10px 16px
font-size:     12px
font-family:   font-mono
hover-border:  rgba(245,158,11,0.3) — color shift only, no shadow
```

Arrow suffixes (`→`) on primary buttons use a `group-hover:translate-x-1` micro-animation. Never use icon libraries for arrow suffixes — use the `→` character.

---

## Form Inputs

```
background:    .glass surface
border:        1px solid rgba(41, 37, 36, 0.6)
border-radius: 8px
padding:       8px 12px
font-size:     14px
font-family:   font-mono
color:         text-text
placeholder:   text-text-muted
focus:         border-border-amber (ring-0, border color shift only)
```

---

## Table (Jobs Pipeline)

- No alternating row colors — use the glass card surface, separated by border
- Row border: `border-b border-border` between rows
- Column headers: uppercase, 10px, `font-mono`, `font-weight: 500`, `text-text-muted`
- Row text: 11px, `text-text`
- Hover state: `border-border-amber/20` on the card border

Score bars inside pipeline cards:

```
height:          4px
border-radius:   9999px
background track: border (#292524)
fill:            pipeline stage color (see ui-tokens.md)
```

---

## Hero Sketch Annotation Layer

The hero right column is always an animated SVG sketch — not a screenshot or illustration. It must contain:

- **Two targeting reticles** — concentric circle rings with crosshair lines, animated in via GSAP `strokeDashoffset`
- **Score readout labels** — `<rect>` + `<text>` label boxes anchored to each reticle
- **Measurement brackets** — corner brackets (`L`-shaped paths) at the four SVG corners
- **Connector line** — dashed path linking the two main reticles
- **Annotation arrows** — `<path>` lines from targets to label boxes with `<circle>` endpoints
- **Score bar** — small progress bar with `<text>` percentage inside the SVG

All sketch paths animate via GSAP on mount: `strokeDasharray: 800`, `strokeDashoffset: 800 → 0`, stagger 0.15s, ease `power2.out`. Circles use `scale: 0 → 1`, `back.out(1.7)`. After entry, circles pulse via `gsap.to` with `scale: 1.05`, `yoyo: true, repeat: -1`.

Never replace this sketch with a static SVG, screenshot, or image — the animation is a core brand element.

---

## Sections

### Section Eyebrows

Every major section begins with a monospaced eyebrow tag above the heading:

```tsx
<span className="text-[10px] font-mono tracking-widest text-amber block mb-3">
  // SECTION_LABEL
</span>
```

Eyebrows always use `//` prefix and ALL_CAPS_UNDERSCORE format. Never use sentence case or icon-only section headers.

### Section Headings — Two-tone split

Section headings always split into two lines: an active line in `text-text` and a muted second line in `text-text-muted`. Both lines are the same font-size and weight. This creates a signature dimming effect.

```tsx
<h2 ...>
  Active part.<br />
  <span className="text-text-muted">Muted part.</span>
</h2>
```

### Empty States

Every section that can be empty must have an empty state:

- Short descriptive text in `text-text-muted`, `font-mono`, 12px, centered
- Optional SVG icon above text (24px, `text-text-dim`)
- CTA button if there is a logical next action
- Min-height: `min-h-[160px]` so the card does not collapse

---

## Motion (GSAP)

All entrance animations are GSAP-driven. CSS animation is used only for continuous loops (pulse, blink, float, ticker).

**Page load sequence (hero):**

1. Badge: `opacity 0 → 1, y -12 → 0`, delay 0.2s
2. Headline lines: `opacity 0 → 1, y 24 → 0`, stagger 0.12s
3. Supporting copy: `opacity 0 → 1, y 16 → 0`
4. CTA buttons: `opacity 0 → 1, y 12 → 0`
5. Terminal block: `opacity 0 → 1, y 20 → 0`
6. Sketch SVG paths: `strokeDashoffset 800 → 0`, delay 0.8s from page load

**Scroll-triggered sections:** All non-hero sections use `ScrollTrigger` with `start: 'top 80%'` and child stagger of 0.08–0.15s. Use `gsap.from()` not `gsap.to()` for scroll reveals.

**Durations:** Entry animations: 0.5–0.8s. Sketch draw: 1.8s. Loop pulses: 2–4s.

**Easings:** Entry: `power2.out` or `power3.out`. Sketch circles: `back.out(1.7)`. Breathing: `sine.inOut`. Ticker: `linear`.

Never use `gsap.to()` on mount for elements that should start hidden — always use `gsap.from()` or set initial state with `gsap.set()` first.

---

## WebGL Ambient Background

The hero section always has a full-bleed WebGL canvas as a background layer.

- Canvas: `position: absolute, inset: 0, width: 100%, height: 100%, z-index: 0, pointer-events: none`
- Effect: amber orb glow in the lower-left, noise-modulated breathing, pointer-reactive mouse drift
- DPR: clamped to `min(devicePixelRatio, 2)`
- Fallback: if `getContext('webgl')` returns null, the canvas is hidden and the dark background color shows through — this is acceptable
- The canvas never intercepts pointer events — always `pointer-events: none`

---

## Tailwind v4 Note

This project uses Tailwind v4 via `@tailwindcss/vite`. Tokens are defined with `@theme` in `src/index.css` — no `tailwind.config.ts` needed. Never define colors in a config file. Always use `@theme` for new tokens. Utility classes (`.glass`, `.glass-light`, `.gradient-shell`, `.text-gradient`, `.font-mono`) are defined as plain CSS classes in `src/index.css`, not as Tailwind `@layer` utilities.

---

## Do Nots

- Never use Tailwind's built-in color classes (`bg-stone-900`, `text-amber-400`) — use project tokens only
- Never define colors in `tailwind.config.ts` — use `@theme` in `src/index.css`
- Never add solid colored backgrounds to glass cards — all color comes from inside the card
- Never nest more than one `gradient-shell` wrapper
- Never use system fonts as the mono font — JetBrains Mono is always imported
- Never show raw error strings to users — always show human-readable text
- Never use `position: fixed` for content elements — reserve it for the navbar and any modal overlays
- Never replace the hero sketch animation with a static image or screenshot
- Never stack more than 2 levels of border radius nesting inside each other
- Never use `backdrop-filter: blur` without the matching `background` — they must always pair
- Never use the amber gradient text treatment for body copy — only for hero headlines and stat numbers
