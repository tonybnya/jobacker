# Project Overview

## About the Project

Jobacker is a full stack AI-powered job application assistant. The user creates an account, uploads a base resume, and the AI agent automatically scores the resume against any job description. The same base resume is reused across applications — the app analyzes job descriptions, compares them against the base resume, generates a match score, highlights skill gaps, and suggests how to improve the resume — returning a score, improvement tips, ATS compliance analysis, and a tailored cover letter. The user can also log every job applied to and track a pipeline in a visual funnel or in a table view.

---

## The Problem It Solves

Job hunting is one of the most repetitive and time-consuming tasks a developer faces. Reading dozens of job descriptions, tailoring the resume, adapting cover letters, remembering every role applied to across hundreds of applications — all of this friction happens before clicking "Apply."

Jobacker eases the preparation step. The AI agent scores a stored base resume intelligently against each job description, gives specific insights and improvements, flags ATS compliance issues, and generates a tailored cover letter. Jobacker also tracks every application so nothing is forgotten.

---

## Pages

```
/                  → Landing page
/login             → Auth page (email + OAuth)
/dashboard         → Full applications table + visual funnel, overview, stats, recent activity, analytics
/applications/[id] → Single application detail — resume score, improvements, cover letter
/profile           → Profile form, resume management
/404               → Not Found page
```

---

## Navigation

Top navbar. Clean and minimal.

**Authenticated users — 3 items:**

```
Brand (logo + Jobacker)    Dashboard    Profile
```

**Unauthenticated users — 5 items:**

```
Brand (logo + Jobacker)    Features    How It Works    Sign In    Get Started
```

Full width layout on all pages. No sidebar.

---

## Core User Flow

### Landing Page

- Already built — see `jobacker-landing.html` for reference design, to be converted to Jobacker frontend tech stack
- Logged-in users → redirect to `/applications`
- Logged-out users → shown landing page with Sign In / Get Started CTAs

### Onboarding

- User signs up via InsForge auth (email + Google/GitHub OAuth)
- On login → redirect to `/applications`
- Dashboard shows all logged job applications (empty state if none yet)

### User Dashboard

- User uploads a base PDF resume once (in `/profile`)
- User can replace the base resume at any time — old file is overwritten
- User can manually create, edit, and delete job applications
- User can generate a clean, professional PDF resume tailored by AI for a specific application
- User can generate a tailored cover letter for a specific application

### Resume Scoring Flow

- User pastes the job description text of an application
- The resume used is always the base resume already uploaded on the profile
- User clicks "Score Resume"
- AI returns:
  - Overall match percentage (0–100)
  - Skills Match Analysis — per-skill percentage match in a structured breakdown
  - Pros — key strengths of the resume relative to this job
  - Cons — gaps or weaknesses relative to this job
  - Missing Keywords — top 15 terms/phrases from the job description absent from the resume, with integration suggestions
  - Improvement Suggestions — actionable, grounded in the user's actual resume content (ADD / REPHRASE / FORMAT tags)
  - Category scores: Keyword Match, ATS Compliance, Impact Phrases, Readability
  - A sample ATS-friendly tailored resume (generated from real resume data)
  - A tailored cover letter for this role

### AI Scoring Prompt

The prompt sent to the AI for scoring is structured around these eight sections:

1. **Skills Match Analysis** — compare resume skills against job requirements, percentage match per skill, displayed in a structured breakdown
2. **Pros and Cons** — strengths where the resume aligns well, gaps where it's weak or missing
3. **Missing Keywords** — top 15 key terms/phrases from the job description missing from the resume, with integration suggestions
4. **Strengths and Weaknesses Summary** — overall summary of what's strong and what needs improvement
5. **Improvement Suggestions** — actionable, realistic recommendations grounded in the resume's existing content
6. **Overall Match Percentage** — single 0–100 score reflecting technical and soft skill alignment
7. **Sample Resume** — ATS-friendly resume generated from the user's real information
8. **Sample Cover Letter** — tailored cover letter for the specific job description

All eight sections are returned as a single structured JSON object — see `library-docs.md` for the exact prompt template and response shape.

### Application Tracking

- User logs each job they apply to with the following fields:
  - Company
  - Role / position
  - Location (city/country)
  - Type — `on-site / part-time / remote / hybrid / internship / contract`
  - Job URL
  - Status — `applied / phone-screen / interviewing / offer / rejected / ghosted`
  - Date applied
  - Resume score (auto-linked once scored)
  - Spy status — `unseen / opened` (whether the application has been viewed/followed up)
  - Follow-up count — integer, number of follow-ups sent
  - Notes — free text (salary range, recruiter name, source, etc.)
- Applications visible as a table or as a visual pipeline (Kanban columns by status)
- User updates application status, spy status, and follow-up count as they progress

### User Dashboard

- Stats bar — 4 cards: Total Applications, Avg. Resume Score, Interviews Landed, Offers Received
- Recent activity — list of last 10 user actions from DB
- Analytics section:
  - Applications over time — line chart
  - Score distribution — bar chart
  - Pipeline funnel — bar chart

---

## Data Architecture

### Main Profile Data

- Lives in `profiles` table
- Only changes when the user explicitly edits the profile page or uploads/replaces the base resume
- The base resume is used for every scoring, cover letter, and tailored resume generation across all applications
- Never modified by any agent operation

### Application Data

- Lives in `applications` table
- Each application has: company, role, location, type, job_url, status, date_applied, resume_score (linked), spy_status, follow_up_count, notes
- Resume score data lives in `resume_scores` table, linked to an application
- One application can have multiple scores over time (re-scores after job description edits)

### Resume Score Data

- Lives in `resume_scores` table
- Linked to an `application_id`
- Contains: overall match percentage, per-category scores, skills match breakdown, pros, cons, missing keywords, improvement suggestions, sample tailored resume text, cover letter text
- Generated by the AI scoring agent — never edited by the user

---

## Features In Scope

- Landing page (already built), to be converted to Jobacker frontend tech stack
- Top navbar — authenticated and unauthenticated variants
- Auth (email + OAuth) via InsForge
- Base resume PDF upload and replacement
- AI-generated tailored resume PDF per application
- Resume scoring against a job description — overall score, category breakdown, skills match, pros/cons, missing keywords, improvement suggestions
- ATS compliance check as part of scoring
- Cover letter generation per application
- Application logging — company, role, location, type, job url, resume score, date applied, status, spy status, follow-up count, notes
- Application pipeline view — Kanban by status
- Application table view — sortable, filterable
- Dashboard with stats bar, recent activity, analytics charts
- 404 page

---

## Features Out of Scope

- Auto apply — agent never fills or submits application forms
- Job discovery — user provides job descriptions manually, no external job API
- LinkedIn scraping or LinkedIn integration
- Interview scheduling or calendar integration
- Email or push notifications
- Team or multi-user accounts
- Mobile app
- Payment or subscription system
- Browser extension
- Multiple saved base resumes — one active base resume per user at a time
- Live agent feed / real-time log

---

## Target User

A developer or technical job seeker who:

- Is actively applying to jobs
- Has an existing resume they want to optimize
- Wants to understand how well their resume matches specific job descriptions
- Wants ATS-safe formatting guidance
- Needs to track dozens of applications without losing track

---

## Success Criteria

- User can sign up, upload a base resume, and score it against a job description in under 5 minutes
- AI scores feel accurate — category breakdown and skills match explain the overall number
- Improvement suggestions are specific and actionable, grounded in the user's actual resume
- Missing keywords list is genuinely useful and tied to the job description provided
- Cover letter output matches the company tone and the user's background
- Sample tailored resume is ATS-friendly and based on real resume content — never invented
- Application tracker is fast to update and the pipeline view is immediately readable
- Dashboard analytics show meaningful patterns after several scored applications
- UI is visually consistent with the landing page design system across all pages
