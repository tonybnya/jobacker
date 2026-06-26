# Library Docs

Project-specific usage patterns for every third-party library in this project. This file only covers how we use each library in Jobacker — rules, patterns, and constraints specific to this codebase.

Read the relevant section before implementing any feature that touches these libraries.

---

## Before Using Any Library

Before implementing any feature that uses a third-party library:

1. **Check if an MCP server is configured** for that library. Some tools have MCP servers that give the AI agent direct access to documentation and debugging tools. If an MCP server is available — use it before falling back to general knowledge.

2. **Read this file** for project-specific patterns that override general library knowledge.

3. **Treat general training knowledge as a last resort** — library APIs change frequently and training data may be outdated.

The order of authority is:

```
MCP server (real-time docs) → This file (project rules) → General training knowledge
```

---

## InsForge

InsForge is only ever used in `backend/`. The frontend never imports `@insforge/sdk`.

### Client Setup

```typescript
// backend/src/lib/insforge.ts
import { createClient } from "@insforge/sdk";

export const insforge = createClient({
  url: process.env.INSFORGE_URL!,
  apiKey: process.env.INSFORGE_API_KEY!,
});
```

### Auth — Verifying a Session Token

The frontend sends the InsForge session token as a `Bearer` header on every request. The backend verifies it on every protected route.

```typescript
// backend/src/lib/insforge.ts
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
  if (!token) return res.status(401).json({ success: false, error: "Not authenticated" });

  const user = await getUserFromToken(token);
  if (!user) return res.status(401).json({ success: false, error: "Not authenticated" });

  req.user = user;
  next();
}
```

### DB Queries

```typescript
// Read
const { data, error } = await insforge
  .from("applications")
  .select("*")
  .eq("user_id", userId)
  .order("date_applied", { ascending: false });

// Insert
const { data, error } = await insforge
  .from("applications")
  .insert({ user_id: userId, company, role, status })
  .select()
  .single();

// Update
const { error } = await insforge
  .from("applications")
  .update({ status: "interviewing" })
  .eq("id", applicationId)
  .eq("user_id", userId); // always scope to user
```

**Rules:**

- Always scope queries to `user_id` (from `req.user.id`) — never query without a user filter
- Always handle the `error` return — never assume success
- Use `.single()` when expecting exactly one row
- Use `.maybeSingle()` when the row may not exist

### Storage

```typescript
// Upload base resume
const { data, error } = await insforge.storage
  .from("resumes")
  .upload(`${userId}/base.pdf`, fileBuffer, {
    contentType: "application/pdf",
    upsert: true, // overwrites existing file
  });

// Upload tailored resume for a specific application
await insforge.storage
  .from("resumes")
  .upload(`${userId}/${applicationId}-tailored.pdf`, pdfBuffer, {
    contentType: "application/pdf",
    upsert: true,
  });

// Get public URL
const { data } = insforge.storage
  .from("resumes")
  .getPublicUrl(`${userId}/base.pdf`);

const url = data.publicUrl;
```

**Storage paths:**

- Base resume: `resumes/{user_id}/base.pdf`
- Tailored resume per application: `resumes/{user_id}/{application_id}-tailored.pdf`

**Rules:**

- Always use `upsert: true` for resume uploads — overwrites existing
- Always save the public URL back to the DB after upload
- Never write files to disk — always upload buffer directly to storage

---

## Gemini

### Client Setup

```typescript
// backend/src/agent/ — server-side only
import { GoogleGenAI } from "@google/genai";

const ai = new GoogleGenAI({
  apiKey: process.env.GEMINI_API_KEY!,
});
```

Never import the Gemini client in `frontend/` — the API key is secret.

---

### Model

- **Model**: `gemini-3.5-flash` — 1M token context, fast, free tier available
- Used for all three agent tasks: resume scoring, cover letter generation, resume tailoring

---

### Resume Scoring Call — 8-Section Prompt

A single Gemini call returns all 8 sections as one JSON object.

```typescript
// backend/src/agent/scorer.ts
const response = await ai.models.generateContent({
  model: "gemini-3.5-flash",
  contents: buildScoringPrompt(resumeText, jobDescription),
  config: { maxOutputTokens: 4096 },
});

const text = response.text;
const result: ScoreResult = JSON.parse(text);
```

**Rules:**

- Always include "Return ONLY valid JSON" with no markdown fencing — never use regex to strip code blocks, instruct Gemini not to produce them
- Always wrap `JSON.parse` in try/catch — if parsing fails, log to `agent_logs` and return `{ success: false, error: "Failed to parse AI response" }`
- `sample_resume_text` must never invent employers, credentials, or experience — the prompt explicitly forbids this
- `missing_keywords` is always capped at 15 items

---

### Cover Letter Call

```typescript
// backend/src/agent/cover-letter.ts
const response = await ai.models.generateContent({
  model: "gemini-3.5-flash",
  contents: buildCoverLetterPrompt(resumeText, jobDescription, company, role),
  config: { maxOutputTokens: 800 },
});

const coverLetter = response.text.trim();
```

Cover letter is plain text — no JSON wrapper. 3–4 paragraphs.

---

### Tailored Resume PDF Content Call

```typescript
// backend/src/agent/resume-tailor.ts
const response = await ai.models.generateContent({
  model: "gemini-3.5-flash",
  contents: buildTailorPrompt(resumeText, jobDescription),
  config: { maxOutputTokens: 1500 },
});
```

This may reuse `sample_resume_text` from the most recent `resume_scores` row if it already exists and the job description hasn't changed — avoid a redundant Gemini call.

---

### Model and Token Settings

| Use case                  | Model               | max_tokens | Notes                              |
| -------------------------- | ------------------- | ---------- | ------------------------------------ |
| Resume scoring (8 sections)| `gemini-3.5-flash` | 4096       | Large structured JSON output         |
| Cover letter               | `gemini-3.5-flash` | 800        | Plain text output                    |
| Tailored resume content    | `gemini-3.5-flash` | 1500       | Plain text, formatted for PDF render |

**Rules:**

- Model is always `'gemini-3.5-flash'` — never use other model names
- Always validate parsed JSON before using — wrap `JSON.parse` in try/catch
- Always check `response.text` is non-empty before using
- Score threshold is always `SCORE_THRESHOLD` from `lib/utils.ts` — never hardcode 75
- Scoring must always return all 8 sections — if a section is genuinely empty (e.g. no missing keywords found), return an empty array `[]`, never omit the key

---

## PostHog

### Client Setup (Frontend Browser)

```typescript
// frontend/src/lib/posthog-client.ts
import posthog from "posthog-js";

export function initPostHog() {
  posthog.init(import.meta.env.VITE_POSTHOG_KEY, {
    api_host: import.meta.env.VITE_POSTHOG_HOST ?? "https://us.i.posthog.com",
    capture_pageview: false, // manual pageview tracking via React Router
  });
}

// Capture event client-side
posthog.capture("application_logged", {
  userId,
  status: "applied",
});
```

Call `initPostHog()` once in `main.tsx` before rendering the app.

### Server Setup (Backend)

```typescript
// backend/src/lib/posthog-server.ts
import { PostHog } from "posthog-node";

export const createPostHogServer = () =>
  new PostHog(process.env.POSTHOG_KEY!, {
    host: process.env.POSTHOG_HOST ?? "https://us.i.posthog.com",
    flushAt: 1,       // send immediately
    flushInterval: 0, // no batching — request lifecycle is short-lived
  });

// Always use and shut down within the same request handler
const ph = createPostHogServer();
ph.capture({
  distinctId: userId,
  event: "resume_scored",
  properties: { userId, applicationId, score, hasJobDescription: true },
});
await ph.shutdown(); // required — events are lost without it
```

**Rules:**

- Always call `await ph.shutdown()` before the route handler returns — events are lost without it
- `flushAt: 1` and `flushInterval: 0` always set on the server client
- Event names must match exactly the list in `code-standards.md`
- Always include `userId` as a property on every server-side event
- Call `posthog.identify(userId)` after login on the client side (inside `useAuth`)
- Call `posthog.reset()` on logout on the client side (inside `useAuth`)
- `POSTHOG_HOST` / `VITE_POSTHOG_HOST` default to `https://us.i.posthog.com` when omitted

---

## HugeIcons

### Usage

```typescript
import { Briefcase01Icon, ChartLineUp01Icon, MailAdd01Icon } from "hugeicons-react";

<Briefcase01Icon size={20} color="var(--color-text-muted)" />
```

**Rules:**

- All icons in the app come from `hugeicons-react` — never inline SVG paths for icons, never another icon library
- Pass `color` as a CSS variable reference (`var(--color-amber)`, etc.) — never hardcoded hex
- Standard sizes: `16` for inline/badge icons, `20` for buttons and nav items, `24` for empty-state and feature icons
- Icon names follow HugeIcons' naming convention (e.g. `Briefcase01Icon`, `FileEdit01Icon`, `Target02Icon`) — verify exact export names against the installed package if uncertain, names vary by version

---

## Framer Motion

### Usage Patterns

**Page transitions:**

```tsx
import { motion } from "framer-motion";

<motion.div
  initial={{ opacity: 0, y: 12 }}
  animate={{ opacity: 1, y: 0 }}
  transition={{ duration: 0.3, ease: "easeOut" }}
>
  {/* page content */}
</motion.div>
```

**Modal (ApplicationModal):**

```tsx
<AnimatePresence>
  {isOpen && (
    <motion.div
      className="fixed inset-0 bg-black/60 z-50 flex items-center justify-center"
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      exit={{ opacity: 0 }}
    >
      <motion.div
        initial={{ opacity: 0, scale: 0.96, y: 8 }}
        animate={{ opacity: 1, scale: 1, y: 0 }}
        exit={{ opacity: 0, scale: 0.96, y: 8 }}
        transition={{ duration: 0.2, ease: "easeOut" }}
        className="glass rounded-xl p-6"
      >
        {/* modal content */}
      </motion.div>
    </motion.div>
  )}
</AnimatePresence>
```

**Pipeline drag (PipelineView):**

```tsx
<Reorder.Group axis="y" values={items} onReorder={setItems}>
  {items.map((item) => (
    <Reorder.Item key={item.id} value={item}>
      {/* card content */}
    </Reorder.Item>
  ))}
</Reorder.Group>
```

Cross-column drag (status change) is detected on drag end by checking the drop target's column — call `updateApplication({ status: newStatus })` only when the column changes, not on every reorder within the same column.

**Rules:**

- Framer Motion is for app-level UI only — the landing page continues to use GSAP, do not mix the two on the same element
- `AnimatePresence` always wraps conditionally-rendered modals and dropdowns
- Standard durations: `0.2s` for modals/dropdowns, `0.3s` for page transitions, `easeOut` for entrances
- Use `Reorder.Group` / `Reorder.Item` for the pipeline drag-and-drop — not a third-party DnD library

---

## @react-pdf/renderer

### Tailored Resume PDF Generation

```typescript
// backend/src/agent/pdf-generator.ts
import { renderToBuffer } from "@react-pdf/renderer";
import { Document, Page, Text, View, StyleSheet } from "@react-pdf/renderer";

const styles = StyleSheet.create({
  page: { padding: 40, fontFamily: "Helvetica" },
  section: { marginBottom: 12 },
  heading: { fontSize: 14, fontWeight: "bold" },
  body: { fontSize: 10, lineHeight: 1.5 },
});

const TailoredResumePDF = ({ content }: { content: string }) => (
  <Document>
    <Page size="A4" style={styles.page}>
      <View style={styles.section}>
        <Text style={styles.body}>{content}</Text>
      </View>
    </Page>
  </Document>
);

const buffer = await renderToBuffer(<TailoredResumePDF content={sampleResumeText} />);
```

**Supported CSS properties (only these — others are silently ignored):**
`padding`, `margin`, `fontSize`, `color`, `fontFamily`, `flexDirection`, `alignItems`, `justifyContent`, `borderRadius`, `width`, `height`, `fontWeight`, `textAlign`, `lineHeight`

**Rules:**

- Backend-only — never import in `frontend/`
- Always use `renderToBuffer` — not `renderToStream`
- PDF generation only happens inside `agent/pdf-generator.ts`, called from `routes/agent.ts`
- Generated buffer uploaded directly to InsForge Storage — never written to disk
- Always save the public URL to `resume_scores.tailored_resume_pdf_url` after upload

---

## pdf-parse

### Extract Text from Uploaded Base Resume

```typescript
// backend/src/lib/pdf-parse.ts
// Critical: import from the lib path, not the package index
import pdf from "pdf-parse/lib/pdf-parse.js";

export async function extractResumeText(buffer: Buffer): Promise<{ success: boolean; text?: string; error?: string }> {
  try {
    const pdfData = await pdf(buffer);
    const text = pdfData.text;

    if (!text || text.trim().length < 100) {
      return { success: false, error: "Could not extract text from this PDF. Please try a different file." };
    }

    return { success: true, text };
  } catch (error) {
    console.error("[lib/pdf-parse]", error);
    return { success: false, error: "Failed to read PDF file." };
  }
}
```

**Critical import note:**

Always import from `pdf-parse/lib/pdf-parse.js` — never from `pdf-parse` directly. The package index has a debug block that reads a test PDF file on every `require()` call when `module.parent` is null, causing an `ENOENT` crash in some bundling setups.

**Rules:**

- Backend-only — never import in `frontend/`
- Always import from `pdf-parse/lib/pdf-parse.js` — not the package index
- Resume text is extracted once at upload time (`POST /api/profile/resume`) and cached in `profiles.resume_text` — never re-parsed on every scoring request
- Always guard against empty or very short text — minimum 100 characters before accepting
- If text is too short — return error: "Could not extract text from this PDF. Please try a different file."

---

## recharts

### Chart Setup (Dashboard)

All charts are standard React components — no special directive needed in a Vite SPA.

```typescript
import {
  AreaChart,
  Area,
  BarChart,
  Bar,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  ResponsiveContainer,
} from "recharts";
```

### Chart Token Colors

All colors inside recharts props use CSS variable references — never hardcoded hex:

```typescript
// Correct
<Area stroke="var(--color-amber)" fill="url(#appGradient)" />
<Bar fill="var(--color-text-muted)" radius={[4, 4, 0, 0]} />

// Never
<Area stroke="#F59E0B" />
```

### Standard Chart Configuration

```typescript
// Grid lines — dashed, muted border color
<CartesianGrid vertical={false} stroke="var(--color-border)" strokeDasharray="4 4" />

// Axis labels — dim, no tick lines
<XAxis
  dataKey="date"
  tick={{ fill: "var(--color-text-dim)", fontSize: 11 }}
  axisLine={false}
  tickLine={false}
  fontFamily="var(--font-mono)"
/>
<YAxis
  tick={{ fill: "var(--color-text-dim)", fontSize: 11 }}
  axisLine={false}
  tickLine={false}
  width={28}
/>

// Tooltip — glass-style
<Tooltip
  contentStyle={{
    background: "rgba(28, 25, 23, 0.9)",
    border: "1px solid rgba(41, 37, 36, 0.6)",
    borderRadius: "8px",
    fontSize: 11,
    fontFamily: "var(--font-mono)",
    color: "var(--color-text)",
  }}
/>

// Container
<ResponsiveContainer width="100%" height="100%">
```

### Chart Color Map

| Chart                     | Color token                                                |
| -------------------------- | ------------------------------------------------------------ |
| Applications over time     | `var(--color-amber)` stroke, gradient fill at opacity 0.15    |
| Score distribution bars    | `var(--color-gold)`, radius `[4,4,0,0]`, maxBarSize 48        |
| Pipeline funnel bars       | `var(--color-text-muted)`, radius `[4,4,0,0]`, maxBarSize 48  |

Gradient definition for area chart:

```tsx
<defs>
  <linearGradient id="appGradient" x1="0" y1="0" x2="0" y2="1">
    <stop offset="5%" stopColor="var(--color-amber)" stopOpacity={0.15} />
    <stop offset="95%" stopColor="var(--color-amber)" stopOpacity={0} />
  </linearGradient>
</defs>
```

**Pipeline funnel statuses (x-axis order):** `Applied`, `Phone Screen`, `Interviewing`, `Offer`, `Rejected`, `Ghosted` — always in this order, matching the Kanban column order in `PipelineView.tsx`.

**Rules:**

- All colors use `var(--color-*)` — never hardcoded hex inside recharts props
- Chart container height: `h-[200px]` — `ResponsiveContainer` fills it
- Left margin always `margin={{ left: -20 }}` to trim YAxis whitespace
- Always show an empty state when `data.length === 0` — never render an empty chart
