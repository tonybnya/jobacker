# Architecture

## Stack

| Layer              | Tool                                  | Purpose                                              |
| ------------------ | -------------------------------------- | ---------------------------------------------------- |
| Frontend framework | React (Vite) + TypeScript strict        | SPA frontend                                         |
| Styling            | Tailwind CSS v4                         | Styling via `@tailwindcss/vite`                      |
| Icons              | HugeIcons                               | Icon set throughout the app                          |
| Animation          | GSAP                                    | Landing page + scroll-triggered animations           |
| Animation          | Framer Motion                           | App-level UI transitions, modals, pipeline drag      |
| UI primitives      | shadcn/ui                               | Form controls, dialogs, dropdowns                    |
| Backend            | InsForge                                | Auth, database, file storage                         |
| AI model           | Anthropic Claude (claude-sonnet-4-20250514) | Resume scoring, cover letter, tailored resume generation |
| Analytics          | PostHog                                 | Event tracking and dashboard charts                  |
| PDF generation     | @react-pdf/renderer                     | Tailored resume PDF rendering                        |
| PDF parsing        | pdf-parse                               | Extract text from uploaded base resume               |
| Language           | TypeScript strict                       | Throughout                                           |

---

## Project Split

The project is split into two independently deployable apps:

```
/
├── AGENTS.md
├── context/
│   ├── project-overview.md
│   ├── architecture.md
│   ├── ui-tokens.md
│   ├── ui-rules.md
│   ├── ui-registry.md
│   ├── code-standards.md
│   ├── library-docs.md
│   ├── build-plan.md
│   └── progress-tracker.md
├── frontend/
└── backend/
```

`frontend/` is a React + Vite SPA. `backend/` is a Node server exposing API routes that wrap InsForge and the Anthropic agent. The frontend never talks to InsForge or Anthropic directly — every request goes through `backend/`.

---

## Frontend Folder Structure

```
frontend/
├── src/
│   ├── main.tsx                           → App entry point
│   ├── App.tsx                            → Router setup
│   ├── index.css                          → Tailwind v4 @theme tokens + utility classes
│   ├── pages/
│   │   ├── LandingPage.tsx                → / (already built — static reference)
│   │   ├── LoginPage.tsx                  → /login
│   │   ├── DashboardPage.tsx              → /dashboard
│   │   ├── ApplicationDetailPage.tsx      → /applications/:id
│   │   ├── ProfilePage.tsx                → /profile
│   │   └── NotFoundPage.tsx               → /404 (catch-all route)
│   ├── components/
│   │   ├── ui/                            → shadcn/ui primitives only
│   │   ├── layout/
│   │   │   ├── Navbar.tsx                 → Authenticated + unauthenticated variants
│   │   │   └── Footer.tsx
│   │   ├── dashboard/
│   │   │   ├── StatsBar.tsx
│   │   │   ├── RecentActivity.tsx
│   │   │   └── AnalyticsCharts.tsx
│   │   │   ├── ApplicationsTable.tsx
│   │   │   ├── PipelineView.tsx
│   │   │   ├── ApplicationFilters.tsx
│   │   │   └── ApplicationModal.tsx       → Create/Edit modal
│   │   ├── profile/
│   │   │   ├── ProfileForm.tsx
│   │   │   ├── ResumeUpload.tsx
│   │   │   └── CompletionBanner.tsx
│   │   └── application-detail/
│   │       ├── ScoreCard.tsx
│   │       ├── SkillsMatchBreakdown.tsx
│   │       ├── ProsConsList.tsx
│   │       ├── MissingKeywords.tsx
│   │       ├── Improvements.tsx
│   │       ├── SampleResume.tsx
│   │       ├── CoverLetter.tsx
│   │       └── ApplicationInfo.tsx
│   ├── hooks/
│   │   ├── useAuth.ts                     → Auth state, current user
│   │   ├── useApplications.ts             → Applications data fetching
│   │   └── useResumeScore.ts              → Scoring agent trigger + result
│   ├── lib/
│   │   ├── api-client.ts                  → Typed fetch wrapper for backend/ API
│   │   ├── posthog-client.ts              → PostHog browser client
│   │   └── utils.ts                       → Shared utility functions + constants
│   ├── types/
│   │   └── index.ts                       → Shared TypeScript types (mirrors backend/src/types)
│   └── router/
│       └── ProtectedRoute.tsx             → Redirects unauthenticated users to /login
└── vite.config.ts                         → Vite + @tailwindcss/vite plugin
```

---

## Backend Folder Structure

```
backend/
├── src/
│   ├── server.ts                          → Express app entry point
│   ├── routes/
│   │   ├── auth.ts                        → POST /api/auth/* — proxies InsForge auth
│   │   ├── profile.ts                     → GET/PUT /api/profile, resume upload
│   │   ├── applications.ts                → CRUD /api/applications
│   │   └── agent.ts                       → POST /api/agent/score, /api/agent/cover-letter, /api/agent/tailor-resume
│   ├── agent/
│   │   ├── scorer.ts                      → Claude resume scoring + improvement logic
│   │   ├── cover-letter.ts                → Claude cover letter generation
│   │   ├── resume-tailor.ts               → Claude tailored resume content generation
│   │   ├── pdf-generator.ts               → @react-pdf/renderer tailored resume PDF
│   │   └── types.ts                       → Agent-specific TypeScript types
│   ├── lib/
│   │   ├── insforge.ts                    → InsForge server client
│   │   ├── posthog-server.ts              → PostHog server client
│   │   └── pdf-parse.ts                   → Wrapper around pdf-parse for resume text extraction
│   ├── middleware/
│   │   └── requireAuth.ts                 → Verifies InsForge session, attaches user to req
│   └── types/
│       └── index.ts                       → Global TypeScript types shared with frontend
└── package.json
```

---

## System Boundaries

| Folder              | Owns                                                                                    |
| ------------------- | ----------------------------------------------------------------------------------------- |
| `frontend/src/pages`     | Route-level views only. No direct InsForge or AI calls.                        |
| `frontend/src/components`| UI only. No data fetching logic. No direct API calls — use hooks.                     |
| `frontend/src/hooks`     | Data fetching and mutation logic via `lib/api-client.ts`. No UI.                       |
| `backend/src/routes`     | HTTP layer only. Validates requests, calls `agent/` or `lib/`, returns responses.      |
| `backend/src/agent`      | All AI logic. Resume scoring, cover letter, tailored resume. Nothing here touches HTTP. |
| `backend/src/lib`        | Third-party client initialisation and shared utilities only.                          |
| `backend/src/middleware` | Cross-cutting request handling — auth verification only.                              |

---

## Data Flow

### UI Reads

```
Component
        ↓
Hook in frontend/src/hooks
        ↓
lib/api-client.ts → fetch backend/api/...
        ↓
backend route → InsForge query (scoped to user_id)
        ↓
JSON response
```

### UI Mutations

```
User interaction in component
        ↓
Hook calls lib/api-client.ts → backend/api/...
        ↓
backend route validates body
        ↓
InsForge write (scoped to user_id)
        ↓
JSON response → hook updates local state
```

### Agent Operations (Resume Scoring)

```
User clicks Score Resume
        ↓
useResumeScore hook → POST /api/agent/score
        ↓
backend/src/routes/agent.ts
        ↓
Loads application.job_description from InsForge
        ↓
Loads profile.resume_pdf_url, downloads from InsForge Storage
        ↓
backend/src/lib/pdf-parse.ts extracts resume text
        ↓
backend/src/agent/scorer.ts — single AI call, 8-section structured response
        ↓
Saves full result to resume_scores table
        ↓
Returns result to frontend
```

### Cover Letter / Tailored Resume Operations

```
User clicks Generate Cover Letter or Generate Tailored Resume
        ↓
POST /api/agent/cover-letter or /api/agent/tailor-resume
        ↓
backend/src/agent/cover-letter.ts or resume-tailor.ts
        ↓
Claude generates content using resume text + job description
        ↓
(tailored resume only) backend/src/agent/pdf-generator.ts renders PDF buffer
        ↓
(tailored resume only) buffer uploaded to InsForge Storage
        ↓
Result saved to resume_scores table, returned to frontend
```

---

## Database Schema (InsForge)

### `profiles`

| Column          | Type        | Notes                                              |
| ---------------- | ----------- | --------------------------------------------------- |
| id               | uuid        | References auth.users                              |
| full_name        | text        |                                                     |
| email            | text        | Pre-filled from auth                               |
| phone            | text        |                                                     |
| location         | text        | City, country                                      |
| resume_pdf_url   | text        | Public URL of base resume in InsForge Storage      |
| resume_text      | text        | Cached extracted text from base resume (for scoring) |
| created_at       | timestamptz |                                                     |
| updated_at       | timestamptz | Auto-updated by trigger                            |

### `applications`

| Column            | Type        | Notes                                                              |
| ------------------ | ----------- | -------------------------------------------------------------------- |
| id                 | uuid        |                                                                       |
| user_id            | uuid        | References profiles                                                  |
| company            | text        |                                                                       |
| role               | text        | Position / job title                                                 |
| location           | text        | City/country                                                         |
| type               | text        | `on-site \| part-time \| remote \| hybrid \| internship \| contract`  |
| job_url            | text        | Link to original job posting                                          |
| status             | text        | `applied \| interviewing \| offer \| rejected \| phone-screen \| ghosted` |
| date_applied       | date        |                                                                       |
| spy_status         | text        | `unseen \| opened`                                                    |
| follow_up_count    | integer     | Default 0                                                            |
| notes              | text        | Salary range, recruiter name, source, etc.                          |
| job_description    | text        | Pasted job description text used for scoring                         |
| latest_score_id    | uuid        | References resume_scores — nullable, set after first scoring         |
| created_at         | timestamptz |                                                                       |
| updated_at         | timestamptz |                                                                       |

### `resume_scores`

| Column                | Type        | Notes                                                  |
| ---------------------- | ----------- | -------------------------------------------------------- |
| id                     | uuid        |                                                          |
| application_id         | uuid        | References applications                                  |
| user_id                | uuid        | References profiles                                      |
| overall_score          | integer     | 0–100 — overall match percentage                          |
| keyword_score          | integer     | 0–100 — keyword match category                            |
| ats_score              | integer     | 0–100 — ATS compliance category                            |
| impact_score           | integer     | 0–100 — impact phrase quality                              |
| readability_score      | integer     | 0–100 — clarity and structure                              |
| skills_match           | jsonb       | Array of `{ skill, matchPercent }` objects                 |
| pros                   | jsonb       | Array of strings — resume strengths for this job           |
| cons                   | jsonb       | Array of strings — resume gaps for this job                |
| missing_keywords       | jsonb       | Array of `{ keyword, suggestion }` objects — top 15        |
| improvements           | jsonb       | Array of `{ tag, text }` — tag is `ADD \| REPHRASE \| FORMAT` |
| sample_resume_text     | text        | AI-generated ATS-friendly tailored resume content          |
| tailored_resume_pdf_url| text        | Nullable — set after PDF generation                        |
| cover_letter           | text        | Generated cover letter text                                |
| resume_text_used       | text        | The base resume text that was scored                       |
| created_at             | timestamptz |                                                          |

### `agent_logs`

| Column     | Type        | Notes                            |
| ---------- | ----------- | --------------------------------- |
| id         | uuid        |                                   |
| user_id    | uuid        | References profiles               |
| message    | text        | Human readable log entry          |
| level      | text        | `info \| success \| warning \| error` |
| created_at | timestamptz |                                   |

---

## InsForge Storage

| Bucket  | Path                          | Contents                          |
| ------- | ------------------------------ | ----------------------------------- |
| resumes | resumes/{user_id}/base.pdf     | Current active base resume PDF     |
| resumes | resumes/{user_id}/{application_id}-tailored.pdf | AI-generated tailored resume PDF per application |

Access: authenticated users only, own files only via InsForge Storage RLS-equivalent path scoping.

---

## Authentication

- Provider: InsForge Auth
- Methods: Email + Password, Google OAuth, GitHub OAuth
- Protected routes (frontend): `/dashboard`, `/profile`, `/applications`, `/applications/:id`
- Public routes (frontend): `/`, `/login`
- `frontend/src/router/ProtectedRoute.tsx` checks auth state via `useAuth()` and redirects to `/login` if absent
- `backend/src/middleware/requireAuth.ts` verifies the InsForge session token on every protected API route
- On successful login → redirect to `/dashboard`

---

## InsForge Client Pattern

InsForge is only ever called from `backend/`. The frontend never imports an InsForge client.

```typescript
// backend/src/lib/insforge.ts
import { createClient } from "@insforge/sdk";

export const insforge = createClient({
  url: process.env.INSFORGE_URL!,
  apiKey: process.env.INSFORGE_API_KEY!,
});

// Verify a user session token from the frontend
export async function getUserFromToken(token: string) {
  const { data, error } = await insforge.auth.getUser(token);
  if (error || !data.user) return null;
  return data.user;
}
```

```typescript
// backend/src/middleware/requireAuth.ts
import { Request, Response, NextFunction } from "express";
import { getUserFromToken } from "@/lib/insforge";

export async function requireAuth(req: Request, res: Response, next: NextFunction) {
  const token = req.headers.authorization?.replace("Bearer ", "");
  if (!token) {
    return res.status(401).json({ success: false, error: "Not authenticated" });
  }
  const user = await getUserFromToken(token);
  if (!user) {
    return res.status(401).json({ success: false, error: "Not authenticated" });
  }
  req.user = user;
  next();
}
```

The frontend stores the InsForge session token (from `useAuth`) and sends it as a `Bearer` token on every request via `lib/api-client.ts`.

---

## AI Scoring Pattern

```typescript
// backend/src/agent/scorer.ts
const response = await anthropic.messages.create({
  model: "claude-sonnet-4-20250514",
  max_tokens: 4096,
  messages: [
    {
      role: "user",
      content: buildScoringPrompt(resumeText, jobDescription),
    },
  ],
});
// Parse the 8-section JSON from response.content[0].text — see library-docs.md
```

---

## Invariants

Rules the AI agent must never violate:

- The frontend never imports an InsForge or Anthropic client directly — everything goes through `backend/` API routes via `lib/api-client.ts`.
- `backend/src/routes` contain no AI prompt logic. `backend/src/agent` contains no HTTP logic.
- `backend/src/agent` never imports from `backend/src/routes`.
- No hardcoded hex values or raw Tailwind color classes in frontend components — use CSS variables from `ui-tokens.md`.
- Every Claude API call is wrapped in try/catch. Failures are logged to `agent_logs`, never thrown to crash the request.
- Resume scoring always returns all 8 sections — even if a section is thin, return an empty array or explain in `cons`. Never omit a section.
- Every InsForge query is scoped to the current `user_id` — never query without a user filter.
- `applications.status` is always one of `applied | interviewing | offer | rejected | phone-screen | ghosted` — never any other value.
- `applications.type` is always one of `on-site | part-time | remote | hybrid | internship | contract` — never any other value.
- `applications.spy_status` is always `unseen` or `opened` — never any other value.
- `resume_scores.improvements[].tag` is always one of `ADD | REPHRASE | FORMAT` — never any other value.
- The base resume (`profiles.resume_pdf_url` / `resume_text`) is the only resume used for scoring — never a per-application upload.
