# UI Tokens

Design tokens for Jobacker. All colors, typography, spacing, and component values are extracted from the delivered DESIGN.md and the built landing page. Use these exact values throughout the codebase — never hardcode colors or raw hex values in components.

---

## How to Use

This project uses **Tailwind CSS v4** with Vite (`@tailwindcss/vite`). All design tokens are defined using the `@theme` directive in `src/index.css`. No `tailwind.config.ts` needed.

Tailwind v4 automatically generates utility classes from `@theme` variables:

- `--color-amber` → `bg-amber`, `text-amber`, `border-amber`
- `--color-surface` → `bg-surface`, `text-surface`, `border-surface`

```tsx
// Correct — uses generated utility classes
className="bg-surface text-text border-border"

// Also correct — references CSS variable directly (for WebGL, SVG, chart props)
style={{ color: 'var(--color-amber)' }}
stroke="var(--color-amber)"

// Never — hardcoded hex values in JSX
className="bg-[#1C1917] text-[#D6D3D1]"

// Never — raw Tailwind color classes
className="bg-stone-900 text-amber-400"
```

---

## globals.css (src/index.css) — Complete Token Definition

```css
@import "tailwindcss";

@theme {
  /* Font */
  --font-mono: "JetBrains Mono", "Fira Code", monospace;
  --font-sans: system-ui, sans-serif;

  /* Page and surface backgrounds */
  --color-bg:            #1C1917;
  --color-surface:       rgba(28, 25, 23, 0.6);
  --color-surface-light: rgba(68, 64, 60, 0.2);
  --color-surface-solid: #44403C;

  /* Borders */
  --color-border:        #292524;
  --color-border-amber:  #F59E0B;

  /* Text */
  --color-text:          #D6D3D1;
  --color-text-muted:    #78716C;
  --color-text-dim:      #44403C;

  /* Primary accent — amber/gold */
  --color-primary:       #451A03;
  --color-amber:         #F59E0B;
  --color-gold:          #FBBF24;

  /* Functional */
  --color-foreground:    #0C0A09;

  /* Border radius */
  --radius-sm:   4px;
  --radius-md:   8px;
  --radius-lg:   12px;
  --radius-xl:   16px;
  --radius-full: 9999px;
}
```

---

## Color Usage Guide

### Page Layout

| Element              | Token / Value                         |
| -------------------- | ------------------------------------- |
| Page background      | `bg-bg` (`#1C1917`)                   |
| Glass surface        | `bg-surface` (rgba dark 0.6, blur 12px)|
| Light glass surface  | `bg-surface-light` (rgba dark 0.2)    |
| Solid elevated surface| `bg-surface-solid` (`#44403C`)       |
| Default border       | `border-border` (`#292524`)           |
| Amber accent border  | `border-border-amber` (`#F59E0B`)     |

### Typography

| Element                    | Token                       |
| -------------------------- | --------------------------- |
| Primary body text          | `text-text` (`#D6D3D1`)     |
| Secondary / muted          | `text-text-muted` (`#78716C`)|
| Very dim / decorative      | `text-text-dim` (`#44403C`) |
| Amber accent text          | `text-amber` (`#F59E0B`)    |
| Gold accent text           | `text-gold` (`#FBBF24`)     |
| Button foreground (on light)| `text-foreground` (`#0C0A09`)|

### Accent System

Used for: CTAs, active states, score indicators, terminal tags, sketch lines, progress bars.

| Element                    | Token                                        |
| -------------------------- | -------------------------------------------- |
| Primary CTA background     | `bg-[#F5F5F4]` (near-white on dark surface)  |
| Primary CTA text           | `text-foreground`                            |
| Amber glow / highlights    | `text-amber` / `bg-amber`                   |
| Gold secondary accent      | `text-gold` / `bg-gold`                     |
| Amber gradient text        | `text-gradient` utility class (see below)   |
| Deep brown emphasis        | `bg-primary` (`#451A03`)                    |

### Score / Status Colors (Terminal Tags)

| Tag type    | Background     | Text          |
| ----------- | -------------- | ------------- |
| `[OK]`      | transparent    | `text-amber`  |
| `[LD]`      | transparent    | `text-text-muted` |
| `ADD` badge | `bg-primary`   | `text-gold`   |
| `REPHRASE`  | `bg-border`    | `text-text`   |
| `FORMAT`    | `bg-bg` + border| `text-text-muted`|

### Pipeline Stage Colors

| Stage       | Color value | Usage                        |
| ----------- | ----------- | ---------------------------- |
| Applied     | `#78716C`   | `text-text-muted`, bar fill  |
| Interviewing| `#F59E0B`   | `text-amber`, bar fill       |
| Offer       | `#FBBF24`   | `text-gold`, bar fill        |
| Archived    | `#44403C`   | `text-text-dim`, bar fill    |

---

## Typography

| Element                  | Size   | Weight | Line-height | Letter-spacing | Token          |
| ------------------------ | ------ | ------ | ----------- | -------------- | -------------- |
| Hero headline            | 60px   | 300    | tight       | -0.025em       | `text-text`    |
| Hero headline (accented) | 60px   | 300    | tight       | -0.025em       | `text-gradient`|
| Section heading          | 40px   | 300    | tight       | -0.02em        | `text-text`    |
| Muted section heading    | 40px   | 300    | tight       | -0.02em        | `text-text-muted`|
| Stat number (hero)       | 30px   | 300    | 36px        | -0.02em        | `text-gradient`|
| Card title               | 14px   | 500    | 20px        | —              | `text-text`    |
| Body copy                | 14px   | 300    | relaxed     | —              | `text-text-muted`|
| Section tag / eyebrow    | 10px   | —      | —           | widest         | `text-amber`, `font-mono` |
| Terminal / mono labels   | 9–11px | 400–500| —           | wider          | `font-mono`, `text-text-muted` |
| Pipeline item role       | 11px   | 500    | tight       | —              | `text-text`    |
| Badge / tag text         | 9px    | 500    | —           | wider          | `text-text-dim`|
| Stat sub-label           | 12px   | 400    | 16px        | —              | `text-text-muted`, `font-mono` |

Font families:
- **Display / body:** `font-sans` (System UI)
- **Terminal / code / labels / eyebrows:** `font-mono` (JetBrains Mono)

---

## Spacing

| Token  | Value | Usage                              |
| ------ | ----- | ---------------------------------- |
| `gap-2`| 8px   | Tight inline gaps (badge, dot)     |
| `gap-3`| 12px  | Terminal line gaps                 |
| `gap-4`| 16px  | Section internal gaps              |
| `gap-6`| 24px  | Between card sections              |
| `gap-12`| 48px | Hero two-column gap                |
| `p-4`  | 16px  | Tight card padding                 |
| `p-5`  | 20px  | Feature card padding               |
| `p-6`  | 24px  | Standard card padding              |
| `px-6` | 24px  | Page horizontal padding            |
| `py-16`| 64px  | Hero vertical padding              |
| `py-24`| 96px  | Section vertical padding           |
| `py-32`| 128px | CTA section padding                |

Base unit: **4px**. All spacing is a multiple of this unit.

---

## Component Tokens

### Glass Card (standard)

```
background:    rgba(28, 25, 23, 0.6)
border:        1px solid rgba(41, 37, 36, 0.6)
border-radius: 12px
padding:       12px
backdrop-filter: blur(12px)
shadow:        none
```

### Glass Card (light variant)

```
background:    rgba(28, 25, 23, 0.2)
border:        1px solid rgba(41, 37, 36, 0.4)
border-radius: 12px
padding:       16px
backdrop-filter: blur(8px)
```

### Gradient Shell (wraps glass cards for amber edge glow)

```
background:    linear-gradient(135deg, rgba(245,158,11,0.15) 0%, rgba(41,37,36,0.4) 50%, rgba(251,191,36,0.08) 100%)
border-radius: 14px
padding:       1px
```

Inner card: `border-radius: 11px` (1px inset from shell's 12px).

### Buttons

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

**Ghost / link:**

```
background:    glass surface
color:         #D6D3D1
border-radius: 9999px
padding:       10px 16px
font-size:     12px
font-family:   font-mono
hover-border:  rgba(245,158,11,0.3)
```

### Amber Score Bar

```
background track: #292524
fill:             var(--color-amber) or var(--color-gold) by stage
height:           4px
border-radius:    9999px
```

### Score Ring (SVG)

```
track stroke:   #292524, strokeWidth 6
fill stroke:    var(--color-amber) → var(--color-gold) gradient
radius:         34 (on 80×80 viewBox)
transform:      -rotate-90
strokeLinecap:  round
```

### Terminal Block

```
background:     glass surface
border-radius:  12px
padding:        16px
font-family:    font-mono
font-size:      11px
[OK] color:     var(--color-amber)
[LD] color:     var(--color-text-muted)
dot live:       var(--color-amber), animate-pulse-amber
```

### Activity / Ticker

```
border:         1px solid var(--color-border) top and bottom
padding:        8px 0
font-family:    font-mono
font-size:      12px
color:          var(--color-text-dim)
separator dot:  1px × 1px, bg-amber, opacity 0.6
```

### Sketch / SVG Annotation Layer

```
stroke — primary target:   var(--color-amber), strokeWidth 0.8–2
stroke — secondary target: var(--color-text-muted), strokeWidth 0.6–1.5
stroke — grid:             var(--color-border), strokeWidth 0.5, dasharray 4 8
stroke — connector:        var(--color-primary), strokeWidth 1, dasharray 6 4
stroke — brackets:         var(--color-surface-solid), strokeWidth 1
label fill:                rgba(28,25,23,0.8–0.9)
label text:                font-mono, 9–10px, var(--color-text-muted)
animation:                 GSAP strokeDashoffset 0→1000, 1.8s, stagger 0.15s
```

### WebGL Ambient Canvas

```
blend:          retro-futurist amber orb on dark field
base color:     #1C1917
amber glow:     #451A03 × 1.5 intensity, noise-modulated
gold shimmer:   #FBBF24 × 0.3, pointer-reactive
antialias:      true
DPR clamp:      min(devicePixelRatio, 2)
pointer drift:  (u_mouse - 0.5) * 0.06
```

---

## Utility Classes (defined in index.css)

| Class              | Definition                                                                 |
| ------------------ | -------------------------------------------------------------------------- |
| `.glass`           | `background: rgba(28,25,23,0.6); border: 1px solid rgba(41,37,36,0.6); backdrop-filter: blur(12px)` |
| `.glass-light`     | `background: rgba(68,64,60,0.2); border: 1px solid rgba(41,37,36,0.4); backdrop-filter: blur(8px)` |
| `.gradient-shell`  | Amber edge-glow wrapper — 1px padding, 14px radius, linear-gradient shell  |
| `.text-gradient`   | `background: linear-gradient(to right, #FBBF24, #F59E0B, #D97706); -webkit-background-clip: text; -webkit-text-fill-color: transparent` |
| `.font-mono`       | `font-family: var(--font-mono)`                                            |
| `.noise-overlay`   | Fixed, z-0, opacity 0.03, SVG fractal noise texture                        |
| `.animate-blink`   | `animation: blink 1.2s step-end infinite` (cursor)                        |
| `.animate-float`   | `animation: float 4s ease-in-out infinite`                                 |
| `.animate-pulse-amber` | `animation: pulse-amber 2s ease-in-out infinite` (0.6→1 opacity)      |

---

## Invariants

- Never use hardcoded hex values in JSX — use CSS variables or the utility classes above
- Font mono is JetBrains Mono — import via Google Fonts `<link>`, never use `font-mono` Tailwind built-in
- Never use raw Tailwind color classes like `bg-stone-900` or `text-amber-400` — use project tokens only
- `--color-amber` (`#F59E0B`) and `--color-gold` (`#FBBF24`) are the only warm accent tones — never use Tailwind amber scale
- Score bars always derive fill color from pipeline stage token — never hardcoded per-item
- Glass surfaces always pair with `backdrop-filter: blur` — never use the background color alone without it
- WebGL canvas is `pointer-events: none`, `z-index: 0` — never intercept user interactions
- Gradient shell is always a wrapper `div` — never apply it directly to the content card
