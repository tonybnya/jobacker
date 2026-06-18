---
description: Instructions for building apps with MCP
globs: *
alwaysApply: true
---

## Read Before Anything Else

Read in this exact order before any implementation:

1. context/project-overview.md
2. context/architecture.md
3. context/ui-tokens.md
4. context/ui-rules.md
5. context/ui-registry.md
6. context/code-standards.md
7. context/library-docs.md
8. context/build-plan.md
9. context/progress-tracker.md

---

## Project Structure — Two Apps

This project is split into two independently deployable apps:

```
frontend/   — React + Vite SPA (TypeScript strict)
backend/    — Express API server (TypeScript strict)
```

The frontend **never** imports `@insforge/sdk` or `@anthropic-ai/sdk` directly.
The one exception: `@insforge/sdk` is imported in `frontend/src/hooks/useAuth.ts` for email/password auth and OAuth redirect handling. All other business logic calls go through `backend/` API routes via `frontend/src/lib/api-client.ts`.

When a feature touches both sides, implement and verify the backend route first,
then wire the frontend. Never write frontend wiring code before the backend route exists.

---

## Rules That Never Change

- Never use hardcoded hex values or raw Tailwind color classes — use CSS variables from `context/ui-tokens.md`
- Never call InsForge or Anthropic from `frontend/` — backend routes only. Exception: `@insforge/sdk` auth methods (signIn, signUp, signInWithOAuth) are called from `frontend/src/hooks/useAuth.ts` because OAuth redirects need the SDK client-side. The SDK's anon key is safe to expose (it has no admin privileges).
- Never query InsForge without scoping to `user_id` (from `req.user.id` set by `requireAuth`)
- Never expose `ANTHROPIC_API_KEY`, `INSFORGE_API_KEY`, or `POSTHOG_KEY` (server) in `frontend/.env`
- Update `context/progress-tracker.md` and `context/ui-registry.md` after every completed feature
- Before any third-party library — load its installed skill first, then read `context/library-docs.md` for project-specific rules
- If the same problem persists after one corrective prompt — stop immediately and run `/recover`
- All icons come from `hugeicons-react` — never inline SVG paths, never another icon library
- All app-level UI transitions use Framer Motion — never GSAP inside `frontend/src/components/` or `frontend/src/pages/`
- GSAP is used only in `LandingPage.tsx` — it was there from the pre-built landing page and must not spread to other components

---

## Field Enums — Never Introduce Other Values

```
ApplicationStatus:  applied | interviewing | offer | rejected | phone-screen | ghosted
ApplicationType:    on-site | part-time | remote | hybrid | internship | contract
SpyStatus:          unseen | opened
ImprovementTag:     ADD | REPHRASE | FORMAT
```

If a new value is needed — update `code-standards.md` and `architecture.md` first, then implement.

---

## Available Skills

- `/architect` — before any complex feature. Think before building.
- `/imprint` — after any new UI component. Capture patterns.
- `/review` — before demo or when something feels off.
- `/recover` — when something breaks after one failed correction.
- `/remember save` — when a feature spans multiple sessions.
- `/remember restore` — when returning after a multi-session feature.

---

# InsForge SDK

## What is InsForge?

Backend-as-a-service (BaaS) platform providing:

- **Database**: PostgreSQL with PostgREST API
- **Authentication**: Email/password + OAuth (Google, GitHub)
- **Storage**: File upload/download
- **AI**: OpenRouter key provisioning and model catalog for direct OpenAI-compatible integrations
- **Functions**: Serverless function deployment
- **Realtime**: WebSocket pub/sub (database + client events)

## Installation

### 🚨 CRITICAL: Follow these steps in order

### Step 1: Download Template

Use the `download-template` MCP tool to create a new project with your backend URL and anon key pre-configured.

### Step 2: Install SDK

```bash
npm install @insforge/sdk@latest
```

### Step 3: Create SDK Client

In this project, the InsForge client lives **only** in `backend/src/lib/insforge.ts`:

```typescript
import { createClient } from '@insforge/sdk';

export const insforge = createClient({
  baseUrl: process.env.INSFORGE_URL!,
  anonKey: process.env.INSFORGE_API_KEY!,
});
```

Never instantiate a second client anywhere else. Never import `@insforge/sdk` in `frontend/`.

## Getting Detailed Documentation

### 🚨 CRITICAL: Always Fetch Documentation Before Writing Code

Before writing or editing any InsForge integration code, you **MUST** call the `fetch-docs` or `fetch-sdk-docs` MCP tool to get the latest SDK documentation.

### Use the InsForge `fetch-docs` MCP tool:

Available documentation types:

- `"instructions"` — Essential backend setup (START HERE)
- `"real-time"` — Real-time pub/sub via WebSockets
- `"db-sdk-typescript"` — Database operations with TypeScript SDK
- **Authentication** — This project uses React Router (Vite multi-page SPA):
  - `"auth-components-react-router"` ← **use this one for Jobacker**
  - `"auth-sdk-typescript"` — for custom auth flows if pre-built components are insufficient
- `"storage-sdk"` — File storage operations
- `"functions-sdk"` — Serverless functions invocation
- `"deployment"` — Deploy frontend applications via MCP tool

### Use the InsForge `fetch-sdk-docs` MCP tool:

Available feature types: `db`, `storage`, `functions`, `auth`, `realtime`

Available languages: `typescript`, `swift`, `kotlin`, `rest-api`

## When to Use SDK vs MCP Tools

### Always SDK (in `backend/` only) for Application Logic:

- Authentication (register, login, logout, session verification)
- Database CRUD (select, insert, update, delete)
- Storage operations (upload base resume, tailored resume PDFs)

### Use MCP Tools for Infrastructure:

- Project scaffolding (`download-template`)
- Backend setup and metadata (`get-backend-metadata`)
- Database schema management (`run-raw-sql`, `get-table-schema`)
- Storage bucket creation (`create-bucket`, `list-buckets`, `delete-bucket`)
- Frontend deployment (`create-deployment`)

## Important Notes for This Project

- Auth: use `auth-components-react-router` — this is a Vite + React Router SPA, not Next.js, not a plain React+Vite app
- SDK returns `{data, error}` structure for all operations — always handle `error` before using `data`
- Database inserts require array format: `insert([{ ... }])`
- Storage: upload files to buckets, persist both the returned `url` and `key` — save `resume_pdf_url` to `profiles` and `tailored_resume_pdf_url` to `resume_scores` after every upload
- AI integration in this project uses **Anthropic Claude directly** (`@anthropic-ai/sdk`) — not OpenRouter, not the InsForge AI gateway. See `context/library-docs.md` for the exact model, prompt structure, and max_tokens per use case
- **Tailwind version**: this project uses **Tailwind CSS v4** via `@tailwindcss/vite` — not v3. Do not downgrade or lock to 3.4. All tokens are in `frontend/src/index.css` under `@theme`, not `tailwind.config.ts`

<!-- INSFORGE:START -->
## InsForge Backend

This project uses [InsForge](https://insforge.dev): an all-in-one, open-source Postgres-based backend (BaaS) providing database, authentication, file storage, edge functions, and realtime.

- **Project:** **Jobacker** (API base `https://zx9378vs.eu-central.insforge.app`)
- **Skills:** these InsForge skills are installed for supported coding agents. Reach for them before implementing any InsForge feature instead of guessing the API:
  - `insforge`: app code with the `@insforge/sdk` client (database CRUD, auth, storage, edge functions, realtime).
  - `insforge-cli`: backend and infrastructure via the `insforge` CLI (projects, SQL, migrations, RLS policies, storage buckets, functions, secrets, schedules, deploys).
  - `insforge-debug`: diagnosing failures (SDK/HTTP errors, RLS denials, auth and OAuth issues) and running security or performance audits.
  - `insforge-integrations`: wiring external auth providers for JWT-based RLS.
  - `find-skills`: discovering additional skills on demand.
- **Credentials:** `backend/.env` reads `INSFORGE_URL` and `INSFORGE_API_KEY`; the CLI reads `.insforge/project.json`. Never hardcode or commit keys.

Key patterns:

- Database inserts take an array: `insert([{ ... }])`.
- Reference users with `auth.users(id)`; use `auth.uid()` in RLS policies.
- For storage uploads, persist both the returned `url` and `key` — then save the public URL to the relevant DB column.
- Always scope every query to the current user: `.eq("user_id", req.user.id)`.
<!-- INSFORGE:END -->

# InsForge SDK Documentation - Overview

## What is InsForge?

Backend-as-a-service (BaaS) platform providing:

- **Database**: PostgreSQL with PostgREST API
- **Authentication**: Email/password + OAuth (Google, GitHub)
- **Storage**: File upload/download
- **AI**: OpenRouter key provisioning and model catalog for direct OpenAI-compatible integrations
- **Functions**: Serverless function deployment
- **Realtime**: WebSocket pub/sub (database + client events)

## Installation

The following is a step-by-step guide to installing and using the InsForge TypeScript SDK for Web applications. If you are building other types of applications, please refer to:
- [Swift SDK documentation](/sdks/swift/overview) for iOS, macOS, tvOS, and watchOS applications.
- [Kotlin SDK documentation](/sdks/kotlin/overview) for Android applications.
- [REST API documentation](/sdks/rest/overview) for direct HTTP API access.

### 🚨 CRITICAL: Follow these steps in order

### Step 1: Download Template

Use the `download-template` MCP tool to create a new project with your backend URL and anon key pre-configured.

### Step 2: Install SDK

```bash
npm install @insforge/sdk@latest
```

### Step 3: Create SDK Client

You must create a client instance using `createClient()` with your base URL and anon key:

```javascript
import { createClient } from '@insforge/sdk';

const client = createClient({
  baseUrl: 'https://your-app.region.insforge.app',  // Your InsForge backend URL
  anonKey: 'your-anon-key-here'       // Get this from backend metadata
});

```

**API BASE URL**: Your API base URL is `https://your-app.region.insforge.app`.

## Getting Detailed Documentation

### 🚨 CRITICAL: Always Fetch Documentation Before Writing Code

InsForge provides official SDKs and REST APIs, use them to interact with InsForge services from your application code.

- [TypeScript SDK](/sdks/typescript/overview) - JavaScript/TypeScript
- [Swift SDK](/sdks/swift/overview) - iOS, macOS, tvOS, and watchOS
- [Kotlin SDK](/sdks/kotlin/overview) - Android and Kotlin Multiplatform
- [REST API](/sdks/rest/overview) - Direct HTTP API access

Before writing or editing any InsForge integration code, you **MUST** call the `fetch-docs` or `fetch-sdk-docs` MCP tool to get the latest SDK documentation. This ensures you have accurate, up-to-date implementation patterns.

### Use the InsForge `fetch-docs` MCP tool to get specific SDK documentation:

Available documentation types:

- `"instructions"` - Essential backend setup (START HERE)
- `"real-time"` - Real-time pub/sub (database + client events) via WebSockets
- `"db-sdk-typescript"` - Database operations with TypeScript SDK
- **Authentication** - Choose based on implementation:
  - `"auth-sdk-typescript"` - TypeScript SDK methods for custom auth flows
  - `"auth-components-react"` - Pre-built auth UI for React+Vite (single-page app)
  - `"auth-components-react-router"` - Pre-built auth UI for React(Vite+React Router) (multi-page app)
  - `"auth-components-nextjs"` - Pre-built auth UI for Next.js (SSR app)
- `"storage-sdk"` - File storage operations
- `"functions-sdk"` - Serverless functions invocation
- `"ai-integration-sdk"` - AI integration with the provisioned OpenRouter key and OpenAI SDK
- `"deployment"` - Deploy frontend applications via MCP tool
- `"payments"` - Stripe Checkout, Billing Portal, webhook projections, and fulfillment patterns

These docs are mostly for the TypeScript SDK. For other languages, you can also use the `fetch-sdk-docs` MCP tool to get specific documentation.

### Use the InsForge `fetch-sdk-docs` MCP tool to get specific SDK documentation

You can fetch SDK documentation using the `fetch-sdk-docs` MCP tool with a specific feature type and language.

Available feature types:
- `db` - Database operations
- `storage` - File storage operations
- `functions` - Serverless functions invocation
- `auth` - User authentication
- `ai` - AI integration with the provisioned OpenRouter key and OpenAI SDK
- `realtime` - Real-time pub/sub (database + client events) via WebSockets
- `payments` - Stripe Checkout and Billing Portal with webhook-based fulfillment

Available languages:
- `typescript` - JavaScript/TypeScript SDK
- `swift` - Swift SDK (for iOS, macOS, tvOS, and watchOS)
- `kotlin` - Kotlin SDK (for Android and JVM applications)
- `rest-api` - REST API

Payments currently has TypeScript SDK docs only. Use the Payments API reference for non-TypeScript clients.

## When to Use SDK vs MCP Tools

### Always SDK for Application Logic:

- Authentication (register, login, logout, profiles)
- Database CRUD (select, insert, update, delete)
- Storage operations (upload, download files)
- AI integration via the provisioned OpenRouter key with the OpenAI SDK or OpenRouter HTTP API
- Serverless function invocation
- Payments checkout and customer portal session creation

### Use MCP Tools for Infrastructure:

- Project scaffolding (`download-template`) - Download starter templates with InsForge integration
- Backend setup and metadata (`get-backend-metadata`)
- Database schema management (`run-raw-sql`, `get-table-schema`)
- Storage bucket creation (`create-bucket`, `list-buckets`, `delete-bucket`)
- Serverless function deployment (`create-function`, `update-function`, `delete-function`)
- Frontend deployment (`create-deployment`) - Deploy frontend apps to InsForge hosting

## Important Notes

- For auth: use `auth-sdk` for custom UI, or framework-specific components for pre-built UI
- SDK returns `{data, error}` structure for all operations
- Database inserts require array format: `[{...}]`
- Serverless functions have one endpoint and do not support nested route paths
- Storage: Upload files to buckets, store URLs in database
- AI integrations should call OpenRouter directly with `baseURL: "https://openrouter.ai/api/v1"` and a server-side `OPENROUTER_API_KEY`
- **EXTRA IMPORTANT**: Use Tailwind CSS 3.4 (do not upgrade to v4). Lock these dependencies in `package.json`
- ⚠️ **This project uses Tailwind v4** via `@tailwindcss/vite`. The v3 instruction above is from the InsForge docs — do not apply it here.
