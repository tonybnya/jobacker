# Build Plan

## Core Principle

Full page UI built with mock data first — verified visually before any logic is written. Then functionality is built and wired to the UI step by step. Every feature must be visible and testable before moving to the next. No invisible backend phases.

Each feature below specifies which side it touches — `frontend`, `backend`, or `both` — and exactly what is in scope.

---

## Phase 0 — Project Setup

### 00 Project Scaffolding

**Scope:** both

Set up the two-app structure before any feature work begins.

**Frontend:**

- Vite + React + TypeScript strict project in `frontend/`
- Tailwind v4 via `@tailwindcss/vite`, tokens copied from `ui-tokens.md` into `src/index.css`
- React Router set up in `App.tsx` with all 7 routes (including `/404` catch-all)
- shadcn/ui initialized — `components/ui/` populated with base primitives only (button, input, dialog, dropdown-menu, select, textarea, tabs)
- HugeIcons, GSAP, Framer Motion installed
- `LandingPage.tsx` created from the existing `jobacker-landing.html` — converted to a React component, GSAP animations preserved
- `NotFoundPage.tsx` — simple centered glass card with "Page not found" message and a link back to `/`

**Backend:**

- Express + TypeScript strict project in `backend/`
- InsForge SDK installed and configured via `lib/insforge.ts`
- `requireAuth` middleware created
- `server.ts` sets up CORS (frontend origin only), JSON body parsing, and mounts route files (empty route files for now, returning `501 Not Implemented`)
- `.env.example` created with all required variables

---

## Phase 1 — Foundation

### 01 Auth

**Scope:** both

InsForge authentication — email/password and OAuth.

**Frontend:**

- `LoginPage.tsx` — email + password inputs, Google OAuth button, GitHub OAuth button, matches the dark glass design system from `ui-tokens.md`
- `useAuth.ts` hook — wraps InsForge auth client-side calls (sign in, sign up, sign out, get session, OAuth redirect)
- `ProtectedRoute.tsx` — redirects to `/login` if `useAuth().user` is null
- `Navbar.tsx` — renders authenticated (4-item) or unauthenticated (5-item) variant based on `useAuth().user`
- Session token stored and attached to every `lib/api-client.ts` request as `Authorization: Bearer <token>`

**Backend:**

- `routes/auth.ts` — `POST /api/auth/session` validates a token and returns the user object (used by frontend on app load to restore session)
- `requireAuth` middleware applied to all protected route files (`profile.ts`, `applications.ts`, `agent.ts`)
- On successful login → frontend redirects to `/dashboard`

---

### 02 Database Schema

**Scope:** backend

All InsForge tables and storage bucket created before any data is written.

- Create `profiles` table with all columns from `architecture.md`
- Create `applications` table with all columns from `architecture.md`, including `type`, `status`, `spy_status`, `follow_up_count`, `notes`, `latest_score_id`
- Create `resume_scores` table with all 8-section columns: `skills_match`, `pros`, `cons`, `missing_keywords`, `improvements`, `sample_resume_text`, `tailored_resume_pdf_url`, `cover_letter`
- Create `agent_logs` table
- Create `resumes` storage bucket with authenticated, path-scoped access
- Row-level scoping on all four tables — every query filtered by `user_id`
- Trigger on `profiles`: `on_profile_updated` auto-sets `updated_at`
- Trigger on `auth.users`: `on_auth_user_created` auto-inserts a minimal profile row on signup

---

## Phase 2 — Profile Page

### 03 Profile Page — Full UI

**Scope:** frontend

Build the complete profile page UI with mock data. No save logic yet.

- `ProfilePage.tsx` — page shell with header
- `CompletionBanner.tsx` — shown when no base resume is uploaded; amber-accented glass card prompting upload
- `ResumeUpload.tsx` — drag-and-drop PDF upload area, "Click to upload or drag and drop" text, PDF-only note, current resume filename + upload date shown if one exists, Replace Resume button
- `ProfileForm.tsx` — Full Name, Email (pre-filled, read-only), Phone, Location fields only — this app does not collect full resume-style profile data, the resume PDF itself is the source of truth for scoring
- Save Profile button (amber primary button)

---

### 04 Profile Save Logic + Resume Upload

**Scope:** both

Wire profile form and resume upload to InsForge.

**Backend:**

- `routes/profile.ts`:
  - `GET /api/profile` — returns current user's profile row
  - `PUT /api/profile` — updates `full_name`, `phone`, `location`
  - `POST /api/profile/resume` — accepts multipart PDF upload, uploads to InsForge Storage at `resumes/{user_id}/base.pdf` with overwrite, extracts text via `lib/pdf-parse.ts`, saves `resume_pdf_url` and `resume_text` to `profiles`
- `profile_completed` PostHog event fires (server-side) the first time both profile fields and `resume_pdf_url` are non-empty

**Frontend:**

- `useProfile.ts` hook (or extend `useAuth`) — fetches profile on mount, exposes `saveProfile` and `uploadResume` mutations
- `ProfilePage.tsx` wired to real data — form pre-fills, upload triggers `POST /api/profile/resume`, loading/error/success states shown
- `CompletionBanner.tsx` disappears once `resume_pdf_url` is set

---

## Phase 3 — Applications

### 05 Applications Page — Full UI

**Scope:** frontend

Build the complete Applications page UI with mock data. No logic yet.

- `ApplicationsPage.tsx` — page header "Applications" + "Log Application" button (primary amber CTA)
- Toggle between Table view and Pipeline view (two buttons, active state is the primary style)
- **Table view (`ApplicationsTable.tsx`):**
  - `ApplicationFilters.tsx` — text search "Filter by company or role...", Status dropdown (All / Applied / Interviewing / Offer / Rejected / Phone Screen / Ghosted), Type dropdown (All / On-site / Remote / Hybrid / Part-time / Internship / Contract), Sort dropdown (Newest / Oldest / Score)
  - Table columns: COMPANY, ROLE, LOCATION, TYPE (badge), STATUS (badge), SCORE (color-coded bar + number or "—"), SPY (eye icon — open/unseen), FOLLOW-UPS (count), DATE APPLIED, ACTIONS (View / Edit / Delete)
  - Pagination — "Showing 1 to 10 of 24 results", Previous / page numbers / Next
- **Pipeline view (`PipelineView.tsx`):**
  - Six Kanban columns: Applied, Phone Screen, Interviewing, Offer, Rejected, Ghosted
  - Each card: role name, company, type badge, score bar if scored, follow-up count, date applied
  - Framer Motion drag-to-reorder within and across columns — status updates fire on drop
- **Log/Edit Application modal (`ApplicationModal.tsx`):**
  - Company, Role, Location, Type dropdown, Job URL (optional), Status dropdown, Date Applied (defaults to today), Spy status toggle, Follow-up count stepper, Notes (optional)
  - Paste Job Description textarea (used later for scoring)
  - Save button — same modal used for create and edit, pre-filled when editing

---

### 06 Application CRUD Logic

**Scope:** both

Wire application logging, editing, deletion, and status updates.

**Backend:**

- `routes/applications.ts`:
  - `GET /api/applications` — accepts `search`, `status`, `type`, `sort`, `page` query params; returns `{ applications, totalCount, page, pageSize }` (20 per page)
  - `POST /api/applications` — creates application, fires `application_logged` PostHog event
  - `PUT /api/applications/:id` — updates any field (status, spy_status, follow_up_count, notes, etc.), fires `application_updated` PostHog event with the changed field name
  - `DELETE /api/applications/:id` — deletes application and its linked `resume_scores` rows

**Frontend:**

- `useApplications.ts` hook — fetches list with current filters/sort/page, exposes `createApplication`, `updateApplication`, `deleteApplication`
- `ApplicationsPage.tsx` wired to real data — filters/sort/page changes re-fetch
- Pipeline view drag end calls `updateApplication({ status })`
- Modal save calls `createApplication` or `updateApplication` depending on mode

---

## Phase 4 — Resume Scoring

### 07 Application Detail Page — Full UI

**Scope:** frontend

Build the complete Application Detail page UI with mock data. No scoring logic yet.

- `ApplicationDetailPage.tsx` — Back to Applications link, application header (company, role, location, type badge, status badge, date applied, external job URL link)
- **Score section** (`ScoreCard.tsx`, left column, wider):
  - If not yet scored: empty state with job description textarea + "Score My Resume" button
  - If scored: overall score ring (SVG, matches landing page design) + four category score bars (Keyword Match, ATS Compliance, Impact Phrases, Readability)
- `SkillsMatchBreakdown.tsx` — list of skills with per-skill match percentage bars
- `ProsConsList.tsx` — two-column Pros / Cons glass cards
- `MissingKeywords.tsx` — pill list of missing keywords, each with a short integration tip on hover/expand
- `Improvements.tsx` — list of improvement suggestions with ADD / REPHRASE / FORMAT tags
- `SampleResume.tsx` — AI-generated sample resume text in a glass card, "Generate Tailored PDF" button, Download link once generated
- `CoverLetter.tsx` — generated cover letter text in a glass card, Copy button, "Generate Cover Letter" button if not yet generated
- **Application info sidebar** (`ApplicationInfo.tsx`, right column, narrower):
  - Company, Role, Location, Type, Status (editable dropdown), Date Applied, Spy status, Follow-up count, Notes (editable), Job URL link
  - Update button to save sidebar changes

---

### 08 Resume Scoring Agent

**Scope:** backend (+ frontend wiring)

Wire the Score My Resume button to the AI scoring agent.

**Backend:**

- `routes/agent.ts` — `POST /api/agent/score` receives `applicationId`
- Loads application from InsForge — extracts `job_description`, `user_id`
- Loads `profiles.resume_text` (cached at upload time — no re-parsing needed)
- If `resume_text` is empty — return error: "Please upload your base resume in your profile before scoring."
- `agent/scorer.ts` — single Claude call using the 8-section prompt from `library-docs.md`:
  - Returns `overall_score`, `keyword_score`, `ats_score`, `impact_score`, `readability_score`, `skills_match[]`, `pros[]`, `cons[]`, `missing_keywords[]`, `improvements[]`, `sample_resume_text`
- Saves complete result as a new row in `resume_scores`, sets `applications.latest_score_id`
- Fires `resume_scored` PostHog event — `{ userId, applicationId, score: overall_score, hasJobDescription: true }`

**Frontend:**

- `useResumeScore.ts` hook — calls `POST /api/agent/score`, manages loading/error state
- `ScoreCard.tsx` and all detail-page components render real data once scored
- Re-scoring (after job description edit) creates a new `resume_scores` row — `ApplicationDetailPage` always shows the latest

---

### 09 Cover Letter + Tailored Resume Generation

**Scope:** backend (+ frontend wiring)

Wire the two generation buttons on the application detail page.

**Backend:**

- `POST /api/agent/cover-letter` — receives `applicationId`, loads `resume_text` + `job_description` + `company` + `role`, calls `agent/cover-letter.ts`, saves `cover_letter` to the latest `resume_scores` row, fires `cover_letter_generated` event
- `POST /api/agent/tailor-resume` — receives `applicationId`, loads `resume_text` + `job_description`, calls `agent/resume-tailor.ts` for content, then `agent/pdf-generator.ts` renders the PDF via `renderToBuffer`, uploads to `resumes/{user_id}/{application_id}-tailored.pdf`, saves `sample_resume_text` and `tailored_resume_pdf_url` to the latest `resume_scores` row, fires `tailored_resume_generated` event

**Frontend:**

- `CoverLetter.tsx` — "Generate Cover Letter" button calls the endpoint, shows loading state, renders result, Copy button
- `SampleResume.tsx` — "Generate Tailored PDF" button calls the endpoint, shows loading state, renders sample text + Download link to `tailored_resume_pdf_url`

---

## Phase 5 — Dashboard

### 10 Dashboard Page — Full UI

**Scope:** frontend

Build the complete dashboard UI with mock data.

- `DashboardPage.tsx` — page shell
- `CompletionBanner.tsx` reused at top (if no base resume uploaded)
- `StatsBar.tsx` — four stat cards: Total Applications, Avg. Resume Score, Interviews Landed, Offers Received — mock numbers
- `RecentActivity.tsx` — list of 8 activity entries with colored dots and timestamps — mock data
- `AnalyticsCharts.tsx` — three charts with mock data:
  - Applications Over Time — area/line chart (last 30 days)
  - Score Distribution — bar chart (score ranges: 0–59, 60–74, 75–89, 90–100)
  - Pipeline Funnel — bar chart (Applied, Phone Screen, Interviewing, Offer, Rejected, Ghosted counts)

---

### 11 Stats Bar + Recent Activity — Real Data

**Scope:** both

Wire stats and activity feed to real InsForge data.

**Backend:**

- `GET /api/dashboard/stats` — returns:
  - `totalApplications` — count of `applications` for current user
  - `avgResumeScore` — average `overall_score` across `resume_scores` for current user, rounded
  - `interviewsLanded` — count where `status IN ('interviewing', 'offer')`
  - `offersReceived` — count where `status = 'offer'`
- `GET /api/dashboard/activity` — merges most recent 10 `resume_scores` (joined with `applications` for company/role) and most recent 10 `applications` by `created_at`, sorts descending, returns top 10 formatted activity items

**Frontend:**

- `useDashboard.ts` hook — fetches both endpoints on mount
- `StatsBar.tsx` and `RecentActivity.tsx` wired to real data, empty state shown when no activity exists

---

### 12 Analytics Charts — Real Data

**Scope:** both

Wire the three dashboard charts to real data.

**Backend:**

- `GET /api/dashboard/analytics`:
  - `applicationsOverTime` — `applications` grouped by `date_applied`, last 30 days
  - `scoreDistribution` — `resume_scores.overall_score` grouped into ranges: 0–59, 60–74, 75–89, 90–100
  - `pipelineFunnel` — `applications` grouped by `status`, all six statuses

**Frontend:**

- `AnalyticsCharts.tsx` wired to `useDashboard.ts` analytics data
- All three charts rendered with recharts using token colors from `ui-tokens.md`
- Empty state shown for each chart when no data exists yet

---

## Feature Count

| Phase                       | Features |
| ---------------------------- | -------- |
| Phase 0 — Project Setup      | 1        |
| Phase 1 — Foundation          | 3        |
| Phase 2 — Profile             | 2        |
| Phase 3 — Applications        | 2        |
| Phase 4 — Resume Scoring       | 3        |
| Phase 5 — Dashboard            | 3        |
| **Total**                     | **14**   |
