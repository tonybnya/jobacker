# Code Standards

Implementation rules and conventions for the entire project. The AI agent must follow these in every session without exception. These rules prevent pattern drift across sessions.

---

## Engineering Mindset

The AI agent on this project operates as a senior engineer. This means:

- **Think before implementing** — understand what is being built and why before writing a single line
- **Read context files first** — never assume, always verify against `architecture.md` and `project-overview.md`
- **Scope is sacred** — only build what the current feature requires. Never go beyond scope even if it seems helpful
- **Every feature must be testable** — if it cannot be verified immediately after implementation, it is incomplete
- **Clean over clever** — simple readable code that a junior developer can understand is always preferred over clever abstractions
- **One thing at a time** — complete one feature fully before touching the next
- **Failures are expected** — wrap agent operations in try/catch, log failures, never let one failure crash everything

---

## TypeScript

- Strict mode enabled in `tsconfig.json` on both `frontend/` and `backend/` — no exceptions
- Never use `any` — use `unknown` and narrow the type
- Never use type assertions (`as SomeType`) unless absolutely necessary and commented why
- All function parameters and return types must be explicitly typed
- Use `type` for object shapes and unions — use `interface` only for extendable component props
- All async functions must have proper error handling — never let promises float unhandled
- Use `const` by default — only use `let` when reassignment is necessary
- Shared types (`Application`, `Profile`, `ResumeScore`, etc.) are defined once in `backend/src/types/index.ts` and mirrored in `frontend/src/types/index.ts` — keep both in sync whenever the schema changes

---

## Frontend (React + Vite) Conventions

- React Router for all routing — defined in `App.tsx`
- Functional components with hooks only — no class components
- Components are presentational — all data fetching and mutation logic lives in `src/hooks/`
- `"use client"` directives do not apply — this is a Vite SPA, not Next.js
- Components requiring browser-only libraries (recharts, Framer Motion drag, GSAP) are written normally — no special directive needed
- Every API call goes through `lib/api-client.ts` — never call `fetch` directly inside a component
- Protected pages are wrapped in `<ProtectedRoute>` in `App.tsx` — never check auth state inside individual page components

---

## Backend (Express) Conventions

- Express + TypeScript strict
- Route files in `routes/` define HTTP handlers only — no AI prompt logic, no PDF rendering logic
- Business/AI logic lives in `agent/` — imported by route handlers
- Every protected route uses the `requireAuth` middleware
- `server.ts` is the only file that calls `app.listen()`
- CORS configured to allow only the frontend origin from `FRONTEND_URL` env var

---

## File and Folder Naming

- Folders: kebab-case — `application-detail`, `resume-upload`
- Component files: PascalCase — `StatsBar.tsx`, `RecentActivity.tsx`
- Hook files: camelCase, prefixed with `use` — `useApplications.ts`, `useResumeScore.ts`
- Utility files: camelCase — `api-client.ts`, `posthog-client.ts`
- Type files: camelCase — `index.ts`
- Backend route files: camelCase, named after the resource — `applications.ts`, `agent.ts`
- One component per file — never export multiple components from one file
- Index files only in `frontend/src/components/ui/` — never barrel export from other folders

---

## Component Structure

Every frontend component follows this exact order:

```typescript
// 1. External imports
import { useState } from "react";
import { motion } from "framer-motion";

// 2. Internal imports
import { useApplications } from "@/hooks/useApplications";
import { ScoreCard } from "@/components/application-detail/ScoreCard";

// 3. Type definitions
type Props = {
  applicationId: string;
  score: number;
};

// 4. Component
export function ComponentName({ applicationId, score }: Props) {
  // state
  // derived values
  // handlers
  // return JSX
}
```

- Never use default exports for components — always named exports
- Props type defined directly above the component — not in a separate types file unless shared
- No inline styles — all styling via Tailwind classes and CSS variables from `ui-tokens.md`
- No hardcoded hex values in JSX — use the CSS variable utility classes defined in `ui-tokens.md`
- Icons always from HugeIcons — never inline SVG icon paths, never another icon library

---

## Backend Route Handlers

```typescript
// backend/src/routes/agent.ts

import { Router, Request, Response } from "express";
import { requireAuth } from "@/middleware/requireAuth";
import { scoreResume } from "@/agent/scorer";

const router = Router();

router.post("/score", requireAuth, async (req: Request, res: Response) => {
  try {
    const { applicationId } = req.body;
    if (!applicationId) {
      return res.status(400).json({ success: false, error: "applicationId is required" });
    }
    const result = await scoreResume(applicationId, req.user.id);
    if (!result.success) {
      return res.status(500).json({ success: false, error: result.error });
    }
    return res.json({ success: true, data: result.data });
  } catch (error) {
    console.error("[agent/score]", error);
    return res.status(500).json({ success: false, error: "Internal server error" });
  }
});

export default router;
```

- Every route handler has a try/catch
- Every route handler validates the request body before processing
- Errors are logged with the route path as prefix: `[agent/score]`
- Always return `{ success: boolean, data?: T, error?: string }`
- Never return raw data without the success wrapper
- Auth-protected routes always read the user ID from `req.user.id` (set by `requireAuth`) — never from the request body

---

## Agent Code

```typescript
// backend/src/agent/scorer.ts

export async function scoreResume(
  applicationId: string,
  userId: string,
): Promise<{ success: boolean; data?: ScoreResult; error?: string }> {
  try {
    // implementation
    return { success: true, data: result };
  } catch (error) {
    await logAgentError(userId, error);
    return { success: false, error: String(error) };
  }
}
```

- Every agent function returns `{ success: boolean; data?: T; error?: string }`
- Every agent function has a try/catch — never let one failure crash the request
- Errors are always logged to `agent_logs` table before returning
- Agent functions never import from `routes/`
- Agent functions never reference Express `Request`/`Response` types

---

## InsForge Usage

InsForge is only ever called from `backend/src/lib/insforge.ts` and the route/agent files that import it.

```typescript
// backend/src/lib/insforge.ts
import { createClient } from "@insforge/sdk";

export const insforge = createClient({
  url: process.env.INSFORGE_URL!,
  apiKey: process.env.INSFORGE_API_KEY!,
});
```

- The frontend never imports `@insforge/sdk` — all access is via `backend/` API routes
- Always scope every query to the current `user_id` from `req.user.id` — never query without a user filter
- Always handle the `error` return from every InsForge call — never assume success

---

## Frontend API Client

```typescript
// frontend/src/lib/api-client.ts

const API_BASE = import.meta.env.VITE_API_BASE_URL;

export async function apiFetch<T>(
  path: string,
  options: RequestInit = {},
): Promise<{ success: boolean; data?: T; error?: string }> {
  const token = localStorage.getItem("insforge_token");
  try {
    const res = await fetch(`${API_BASE}${path}`, {
      ...options,
      headers: {
        "Content-Type": "application/json",
        ...(token ? { Authorization: `Bearer ${token}` } : {}),
        ...options.headers,
      },
    });
    return await res.json();
  } catch (error) {
    console.error("[api-client]", error);
    return { success: false, error: "Network error. Please try again." };
  }
}
```

- All hooks call `apiFetch` — never raw `fetch`
- Token storage and retrieval happens only in `useAuth.ts` and `api-client.ts`

---

## Error Handling

- Never use empty catch blocks — always log or handle
- Console errors always include context prefix: `[component/function name]` (frontend) or `[route/function name]` (backend)
- User-facing errors must be human readable — never expose raw error messages
- Agent errors go to `agent_logs` table — never surface raw agent errors to the UI
- Backend route errors return `status: 500` with a generic message — never expose internals
- Frontend shows toast or inline error messages from the `error` field of API responses — never raw stack traces

---

## PostHog Events

All PostHog events must use these exact event names. Never invent new event names without adding them here first.

| Event                        | When                                              | Key Properties                              |
| ----------------------------- | --------------------------------------------------- | ------------------------------------------- |
| `resume_scored`               | Resume scoring agent completes                       | userId, applicationId, score, hasJobDescription |
| `cover_letter_generated`      | Cover letter generation completes                    | userId, applicationId                        |
| `tailored_resume_generated`   | Tailored resume PDF generation completes             | userId, applicationId                        |
| `application_logged`          | User saves a new application                         | userId, status                               |
| `application_updated`         | User updates an existing application                 | userId, applicationId, field                 |
| `profile_completed`           | User saves profile + uploads base resume for the first time | userId                                |

These six events are the only events in this project. Do not add more without updating this list first.

`resume_scored` powers the Score Distribution dashboard chart.
`application_logged` powers the Applications Over Time dashboard chart.
Always fire these with correct properties.

---

## Environment Variables

All environment variables defined in `.env` files for development — `frontend/.env` and `backend/.env`. Never hardcode any key, URL, or secret anywhere in the codebase.

### Frontend (`frontend/.env`)

| Variable                  | Used In                  |
| --------------------------| -------------------------- |
| `VITE_API_BASE_URL`       | lib/api-client.ts          |
| `VITE_POSTHOG_KEY`        | lib/posthog-client.ts      |
| `VITE_POSTHOG_HOST`       | lib/posthog-client.ts      |

### Backend (`backend/.env`)

| Variable                  | Used In                  |
| --------------------------| -------------------------- |
| `INSFORGE_URL`            | lib/insforge.ts            |
| `INSFORGE_API_KEY`        | lib/insforge.ts            |
| `ANTHROPIC_API_KEY`       | agent/ functions           |
| `POSTHOG_KEY`             | lib/posthog-server.ts      |
| `POSTHOG_HOST`            | lib/posthog-server.ts      |
| `FRONTEND_URL`            | server.ts (CORS)           |

`VITE_` prefix means the variable is exposed to the browser bundle. Never put secret keys (`ANTHROPIC_API_KEY`, `INSFORGE_API_KEY`) in `frontend/.env`.

---

## Score Threshold

The resume score threshold for "good match" is defined once as a constant. Never hardcode this value anywhere else.

```typescript
// frontend/src/lib/utils.ts and backend/src/lib/utils.ts (kept in sync)
export const SCORE_THRESHOLD = 75;
```

Import and use `SCORE_THRESHOLD` everywhere this value is needed (score bar color logic, filter labels, etc.).

---

## Field Enums

These enums are shared between frontend and backend types. Never introduce a value outside these lists without updating this file and `architecture.md` first.

```typescript
export type ApplicationStatus =
  | "applied"
  | "interviewing"
  | "offer"
  | "rejected"
  | "phone-screen"
  | "ghosted";

export type ApplicationType =
  | "on-site"
  | "part-time"
  | "remote"
  | "hybrid"
  | "internship"
  | "contract";

export type SpyStatus = "unseen" | "opened";

export type ImprovementTag = "ADD" | "REPHRASE" | "FORMAT";
```

---

## Import Aliases

Always use the `@/` alias in both `frontend/` and `backend/` — never use relative imports that go up more than one level.

```typescript
// Correct
import { ScoreCard } from "@/components/application-detail/ScoreCard";
import { apiFetch } from "@/lib/api-client";
import { SCORE_THRESHOLD } from "@/lib/utils";

// Never
import { ScoreCard } from "../../../components/application-detail/ScoreCard";
```

---

## Comments

- No comments explaining what the code does — code must be self-explanatory
- Comments only for why — explaining a non-obvious decision
- Agent functions may have a brief comment explaining the Claude prompt strategy
- Never leave TODO comments in committed code

---

## Dependencies

Never install a new package without a clear reason. Before installing anything check:

1. Does shadcn/ui already have this component?
2. Does the existing stack already provide this functionality?
3. Is there a simpler native solution?

### Frontend approved dependencies

- `react`, `react-dom`, `react-router-dom`
- `typescript`
- `tailwindcss`, `@tailwindcss/vite`
- `hugeicons-react` — icons
- `gsap` — landing page animations
- `framer-motion` — app UI transitions and pipeline drag
- shadcn/ui components — UI primitives
- `posthog-js` — PostHog browser client
- `recharts` — dashboard analytics charts

### Backend approved dependencies

- `express`
- `typescript`
- `@insforge/sdk` — InsForge client
- `@anthropic-ai/sdk` — Claude API client
- `posthog-node` — PostHog server client
- `@react-pdf/renderer` — tailored resume PDF generation
- `pdf-parse` — extract text from uploaded PDF
- `zod` — schema validation
- `multer` — multipart form upload handling (resume PDF)
- `cors` — CORS middleware

Do not install any other packages without updating this list first.
