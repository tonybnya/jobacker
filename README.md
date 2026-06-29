# Jobacker

AI-powered job application tracker. Score your resume against any job description, get ATS compliance feedback, generate tailored cover letters, and track every application in one place.

## Features

- **AI Resume Scoring** — paste a job description, get a match score, skill gap analysis, missing keywords, and improvement suggestions powered by Google Gemini
- **Cover Letter Generation** — one-click tailored cover letters for each application
- **Resume Tailoring** — generate ATS-optimized resumes per role from your base resume
- **Application Pipeline** — Kanban view and table view with status tracking, filters, and sorting
- **Dashboard Analytics** — stats bar, application trends, score distribution, pipeline funnel

## Tech Stack

| Layer | Stack |
|-------|-------|
| Frontend | React 19, TypeScript 6, Vite, Tailwind CSS v4, Framer Motion |
| Backend | Express, TypeScript, Zod, Google Gemini API |
| Database | PostgreSQL (InsForge) |
| Auth | InsForge (email/password + OAuth), RLS |
| Storage | InsForge (PDF resume uploads) |
| Hosting | Frontend: InsForge/Vercel, Backend: Render |

## Links

- **Live app:** [https://zx9378vs.insforge.site](https://zx9378vs.insforge.site)
- **Backend API:** [https://jobacker-api.onrender.com](https://jobacker-api.onrender.com)

## Development

```bash
# Frontend
cd frontend
npm install
npm run dev

# Backend
cd backend
npm install
npm run dev
```

Frontend runs on `:5173`, backend on `:3001`. Copy `.env.example` files and fill in the values.
