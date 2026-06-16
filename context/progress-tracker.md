# Progress Tracker

Update this file after every completed feature. Any AI agent reading this should immediately know what is done, what is in progress, and what is next.

---

## Current Status

**Phase:** Phase 0 — Project Setup
**Last completed:** 00 Project Scaffolding (frontend scaffold + landing page converted)
**Next:** Phase 1 — Foundation (01 Auth)

---

## Progress

### Pre-build

- [x] Landing page reference — built as static `jobacker-landing.html`, design system documented in `ui-tokens.md`, `ui-rules.md`, `ui-registry.md`

### Phase 0 — Project Setup

- [x] 00 Project Scaffolding — Vite + React + TypeScript setup, Tailwind v4 with design tokens, path aliases, cn() utility, JetBrains Mono font, landing page converted to React components (AmbientCanvas, HeroSketch, Navbar, Features, StatsBar, TickerLine, Footer, LandingPage)

### Phase 1 — Foundation

- [ ] 01 Auth
- [ ] 02 Database Schema

### Phase 2 — Profile Page

- [ ] 03 Profile Page — Full UI
- [ ] 04 Profile Save Logic + Resume Upload

### Phase 3 — Applications

- [ ] 05 Applications Page — Full UI
- [ ] 06 Application CRUD Logic

### Phase 4 — Resume Scoring

- [ ] 07 Application Detail Page — Full UI
- [ ] 08 Resume Scoring Agent
- [ ] 09 Cover Letter + Tailored Resume Generation

### Phase 5 — Dashboard

- [ ] 10 Dashboard Page — Full UI
- [ ] 11 Stats Bar + Recent Activity — Real Data
- [ ] 12 Analytics Charts — Real Data

---

## Decisions Made During Build

- Project restructured into two independently deployable apps: `frontend/` (React + Vite SPA) and `backend/` (Express API server). The frontend never talks to InsForge or Anthropic directly — all calls go through `backend/` via `lib/api-client.ts`.
- Stack updated from the original draft: React + Vite (not Next.js), InsForge (not Supabase), HugeIcons (icon set), Framer Motion (added alongside GSAP for app-level UI), shadcn/ui for form primitives.
- Landing page (`jobacker-landing.html`) will be converted into `frontend/src/pages/LandingPage.tsx` during Project Scaffolding — GSAP animations preserved as-is.
- The AI scoring agent uses a single Claude call returning 8 structured sections in one JSON response: overall score, 4 category scores, skills match breakdown, pros/cons, missing keywords (top 15), improvements, and a sample tailored resume. This matches the original 8-point prompt structure provided in `project-overview.md`.
- The application data model is significantly richer than the original draft: `type` (on-site/remote/etc.), extended `status` enum (including phone-screen, rejected, ghosted), `spy_status` (unseen/opened), and `follow_up_count`. These are now fixed enums documented in `code-standards.md` — never introduce new values without updating that file first.
- Resume text is extracted once at upload time and cached in `profiles.resume_text` — scoring requests reuse this cached text rather than re-parsing the PDF on every request.
- Tailored resume PDF generation can reuse `sample_resume_text` from the most recent score if the job description hasn't changed, avoiding a redundant Claude call.
- Added two PostHog events beyond the original four: `tailored_resume_generated` and `application_updated` — both needed to track the richer application editing and PDF generation flows.
- Design system documented in three context files: `ui-tokens.md` (all CSS variables and component token values), `ui-rules.md` (layout and pattern rules), `ui-registry.md` (every built component with exact classes). These remain the source of truth for all app UI work and apply equally to `frontend/`.

---

## Notes

- Add notes here after each completed feature. Record any unexpected decisions, workarounds, or deviations from the build plan.
- If a feature required a package not in the approved list in `code-standards.md`, document it here with the reason.
- If an InsForge schema change was made during a feature (column added, type changed), document it here so subsequent features know the current shape.
- If HugeIcons icon names differ from what's referenced in component plans (icon names vary by package version), document the exact names used here for consistency across future features.
- hugeicons-react v0.4.0 exports icons individually via `import { IconName } from "hugeicons-react"` — ArrowRightIcon is actually ArrowRight01Icon, other icons match their documented names.
