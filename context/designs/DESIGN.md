---
version: "alpha"
name: "KINETIC — High Fidelity Processing Engine"
description: "Kinetic High Dashboard Section is designed for demonstrating application workflows and interface hierarchy. Key features include clear information density, modular panels, and interface rhythm. It is suitable for product showcases, admin panels, and analytics experiences."
colors:
  primary: "#451A03"
  secondary: "#FBBF24"
  tertiary: "#F59E0B"
  neutral: "#1C1917"
  background: "#1C1917"
  surface: "#44403C"
  text-primary: "#78716C"
  text-secondary: "#D6D3D1"
  border: "#292524"
  accent: "#451A03"
typography:
  headline-lg:
    fontFamily: "System Font"
    fontSize: "30px"
    fontWeight: 300
    lineHeight: "36px"
    letterSpacing: "-0.025em"
  body-md:
    fontFamily: "System Font"
    fontSize: "14px"
    fontWeight: 300
    lineHeight: "20px"
  label-md:
    fontFamily: "System Font"
    fontSize: "12px"
    fontWeight: 500
    lineHeight: "16px"
rounded:
  md: "8px"
  full: "9999px"
spacing:
  base: "4px"
  sm: "2px"
  md: "4px"
  lg: "6px"
  xl: "8px"
  gap: "10px"
  card-padding: "9px"
  section-padding: "24px"
components:
  button-primary:
    backgroundColor: "#F5F5F4"
    textColor: "#0C0A09"
    typography: "{typography.label-md}"
    rounded: "{rounded.md}"
    padding: "10px"
  button-link:
    textColor: "{colors.text-secondary}"
    rounded: "{rounded.full}"
    padding: "6px"
  card:
    rounded: "12px"
    padding: "12px"
---

## Overview

- **Composition cues:**
  - Layout: Grid
  - Content Width: Full Bleed
  - Framing: Glassy
  - Grid: Strong

## Colors

The color system uses dark mode with #451A03 as the main accent and #1C1917 as the neutral foundation.

- **Primary (#451A03):** Main accent and emphasis color.
- **Secondary (#FBBF24):** Supporting accent for secondary emphasis.
- **Tertiary (#F59E0B):** Reserved accent for supporting contrast moments.
- **Neutral (#1C1917):** Neutral foundation for backgrounds, surfaces, and supporting chrome.

- **Usage:** Background: #1C1917; Surface: #44403C; Text Primary: #78716C; Text Secondary: #D6D3D1; Border: #292524; Accent: #451A03

- **Gradients:** bg-gradient-to-r from-amber-400 to-amber-100 via-stone-200, bg-gradient-to-b from-transparent to-transparent via-amber-500/5

## Typography

Typography relies on System Font across display, body, and utility text.

- **Headlines (`headline-lg`):** System Font, 30px, weight 300, line-height 36px, letter-spacing -0.025em.
- **Body (`body-md`):** System Font, 14px, weight 300, line-height 20px.
- **Labels (`label-md`):** System Font, 12px, weight 500, line-height 16px.

## Layout

Layout follows a grid composition with reusable spacing tokens. Preserve the grid, full bleed structural frame before changing ornament or component styling. Use 4px as the base rhythm and let larger gaps step up from that cadence instead of introducing unrelated spacing values.

Treat the page as a grid / full bleed composition, and keep that framing stable when adding or remixing sections.

- **Layout type:** Grid
- **Content width:** Full Bleed
- **Base unit:** 4px
- **Scale:** 2px, 4px, 6px, 8px, 10px, 12px, 16px, 20px
- **Section padding:** 24px, 32px
- **Card padding:** 9px, 12px, 16px, 32px
- **Gaps:** 10px, 12px, 32px

## Elevation & Depth

Depth is communicated through glass, border contrast, and reusable shadow or blur treatments. Keep those recipes consistent across hero panels, cards, and controls so the page reads as one material system.

Surfaces should read as glass first, with borders, shadows, and blur only reinforcing that material choice.

- **Surface style:** Glass
- **Borders:** 1px #292524; 1px #F59E0B; 1px #1C1917
- **Shadows:** rgba(0, 0, 0, 0) 0px 0px 0px 0px, rgba(0, 0, 0, 0) 0px 0px 0px 0px, rgba(255, 255, 255, 0.06) 0px 0px 20px 0px
- **Blur:** 12px, 24px

### Techniques
- **Gradient border shell:** Use a thin gradient border shell around the main card. Wrap the surface in an outer shell with 12px padding and a 12px radius. Drive the shell with none so the edge reads like premium depth instead of a flat stroke. Keep the actual stroke understated so the gradient shell remains the hero edge treatment. Inset the real content surface inside the wrapper with a slightly smaller radius so the gradient only appears as a hairline frame.

## Shapes

Shapes rely on a tight radius system anchored by 8px and scaled across cards, buttons, and supporting surfaces. Icon geometry should stay compatible with that soft-to-controlled silhouette.

Use the radius family intentionally: larger surfaces can open up, but controls and badges should stay within the same rounded DNA instead of inventing sharper or pill-only exceptions.

- **Corner radii:** 8px, 12px, 16px, 9999px
- **Icon treatment:** Linear
- **Icon sets:** Solar

## Components

Anchor interactions to the detected button styles. Reuse the existing card surface recipe for content blocks.

### Buttons
- **Primary:** background #F5F5F4, text #0C0A09, radius 8px, padding 10px, border 0px solid rgb(229, 231, 235).
- **Links:** text #D6D3D1, radius 9999px, padding 6px, border 0px solid rgb(229, 231, 235).

### Cards and Surfaces
- **Card surface:** background rgba(28, 25, 23, 0.6), border 1px solid rgba(41, 37, 36, 0.6), radius 12px, padding 12px, shadow none.
- **Card surface:** background rgba(28, 25, 23, 0.2), border 1px solid rgba(41, 37, 36, 0.4), radius 12px, padding 16px, shadow none.

### Iconography
- **Treatment:** Linear.
- **Sets:** Solar.

## Do's and Don'ts

Use these constraints to keep future generations aligned with the current system instead of drifting into adjacent styles.

### Do
- Do use the primary palette as the main accent for emphasis and action states.
- Do keep spacing aligned to the detected 4px rhythm.
- Do reuse the Glass surface treatment consistently across cards and controls.
- Do keep corner radii within the detected 8px, 12px, 16px, 9999px family.

### Don't
- Don't introduce extra accent colors outside the core palette roles unless the page needs a new semantic state.
- Don't mix unrelated shadow or blur recipes that break the current depth system.
- Don't exceed the detected expressive motion intensity without a deliberate reason.

## Motion

Motion feels expressive but remains focused on interface, text, and layout transitions. Timing clusters around 300ms and 1000ms. Easing favors ease and 0. Hover behavior focuses on color and stroke changes.

**Motion Level:** expressive

**Durations:** 300ms, 1000ms, 500ms, 2000ms

**Easings:** ease, 0, 0.2, 1), cubic-bezier(0.4, cubic-bezier(0

**Hover Patterns:** color, stroke, text, tracking

## WebGL

Reconstruct the graphics as a full-bleed background field using antialias, dpr clamp, custom shaders. The effect should read as retro-futurist, technical, and meditative: dot-matrix particle field with green on black and sparse spacing. Build it from dot particles + soft depth fade so the effect reads clearly. Animate it as slow breathing pulse. Interaction can react to the pointer, but only as a subtle drift. Preserve dom fallback.

**Id:** webgl

**Label:** WebGL

**Stack:** WebGL

**Insights:**
  - **Scene:**
    - **Value:** Full-bleed background field
  - **Effect:**
    - **Value:** Dot-matrix particle field
  - **Primitives:**
    - **Value:** Dot particles + soft depth fade
  - **Motion:**
    - **Value:** Slow breathing pulse
  - **Interaction:**
    - **Value:** Pointer-reactive drift
  - **Render:**
    - **Value:** antialias, DPR clamp, custom shaders

**Techniques:** Dot matrix, Breathing pulse, Pointer parallax, Shader gradients, Noise fields

**Code Evidence:**
  - **HTML reference:**
    - **Language:** html
    - **Snippet:**
      ```html
      <!-- Background Canvas for Custom Amber/Gold WebGL Fluid -->
      <canvas id="ambient-canvas" class="absolute inset-0 w-full h-full z-0 pointer-events-auto"></canvas>

      <!-- High-Fidelity Noise Overlay -->
      ```
  - **JS reference:**
    - **Language:** js
    - **Snippet:**
      ```
      (() => {
        // --- WEBGL BRONZE & GOLD SHADER BACKGROUND ---
        const canvas = document.getElementById('ambient-canvas');
        const gl = canvas.getContext('webgl', { alpha: false, antialias: true });
        if (!gl) return;

        let W, H, dpr;
        function resize() {
      …
      ```
  - **Interaction hook:**
    - **Language:** js
    - **Snippet:**
      ```
      window.addEventListener('resize', resize);

      let mx = 0.5, my = 0.5;
      window.addEventListener('mousemove', e => {
        mx = e.clientX / W;
        my = e.clientY / H;
      });
      ```
