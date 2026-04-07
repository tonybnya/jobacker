# Jobacker Intelligence System (TUI-first)

---

# 1. 🎯 Objective

Build a **terminal-first job pipeline intelligence platform** that enables users to:

* Track job applications across structured stages
* Analyze job search performance using real metrics
* Automate follow-ups and reminders
* Maintain structured records of resumes, companies, and interactions

---

# 2. 🧠 Product Positioning

> A developer-first, terminal-native system for managing and optimizing job search pipelines with analytics and automation.

---

# 3. 🏗️ System Architecture

## 3.1 Architecture Style

* Clean Architecture (layered)
* API-first backend
* TUI-first frontend
* Modular, testable services

## 3.2 High-Level Flow

```
TUI Client (OpenTUI)
        ↓
API Layer (FastAPI)
        ↓
Service Layer (Business Logic)
        ↓
Repository Layer (Data Access)
        ↓
Database (PostgreSQL)
        ↓
Background Workers (Async Jobs)
```

## 3.3 Key Technical Choices

| Concern    | Choice           |
| ---------- | ---------------- |
| Backend    | FastAPI          |
| TUI        | OpenTUI          |
| Database   | PostgreSQL       |
| ORM        | SQLAlchemy       |
| Async Jobs | Celery / RQ      |
| Cache      | Redis (optional) |
| Auth       | JWT              |
| Testing    | pytest           |
| Packaging  | Docker           |

---

# 4. 🧩 Core Domains

## 4.1 Application Domain

* Application lifecycle
* Stage transitions
* Notes and metadata

## 4.2 Analytics Domain

* Conversion metrics
* Time-based insights
* Pipeline performance

## 4.3 Automation Domain

* Reminders
* Scheduled actions
* Notifications

## 4.4 User Domain

* Authentication
* Authorization
* Multi-user isolation

---

# 5. 📦 Feature Roadmap

---

## 🚀 Phase 0 — Project Foundation

### Goals

* Initialize project
* Setup tooling and standards

### Tasks

#### Project Setup

* [ ] Create monorepo:

  * `/backend`
  * `/tui-client`
* [ ] Initialize Git repository
* [ ] Setup pre-commit hooks

#### Backend Setup

* [ ] Initialize FastAPI app
* [ ] Setup environment config (.env)
* [ ] Setup dependency management

#### Tooling

* [ ] Linting: ruff / flake8
* [ ] Formatting: black
* [ ] Typing: mypy
* [ ] Testing: pytest

#### Infrastructure

* [ ] Docker + docker-compose
* [ ] PostgreSQL container
* [ ] Redis container (optional)

---

## 🧱 Phase 1 — Core Backend (MVP)

### Goals

Build core domain logic with clean architecture

---

### 5.1 Data Modeling

#### Entities

* [ ] Application
* [ ] Company
* [ ] StageHistory
* [ ] ResumeVersion
* [ ] Note

#### Constraints

* [ ] Valid stage transitions
* [ ] Referential integrity
* [ ] Unique constraints (e.g. company name)

---

### 5.2 API Endpoints

#### Applications

* [ ] POST /applications
* [ ] GET /applications
* [ ] GET /applications/{id}
* [ ] PUT /applications/{id}
* [ ] DELETE /applications/{id}
* [ ] POST /applications/{id}/move-stage

#### Companies

* [ ] CRUD endpoints

#### Resume Versions

* [ ] CRUD endpoints

---

### 5.3 Architecture Implementation

* [ ] routers/
* [ ] services/
* [ ] repositories/
* [ ] schemas/
* [ ] models/

#### Patterns

* [ ] Dependency injection
* [ ] DTO separation
* [ ] Service layer abstraction

---

### 5.4 Validation & Error Handling

* [ ] Pydantic validation
* [ ] Custom exceptions
* [ ] Global error handler
* [ ] Structured API responses

---

## 🖥️ Phase 2 — TUI Client (Core UX)

### Goals

Build an interactive and intuitive terminal UI

---

### 6.1 Core Screens

#### Pipeline View

* [ ] Kanban-style layout
* [ ] Stage navigation
* [ ] Move applications

#### Application Detail

* [ ] Full metadata display
* [ ] Notes
* [ ] Stage history timeline

#### Command Palette

* [ ] Global commands
* [ ] Keyboard navigation

---

### 6.2 UX Enhancements

* [ ] Loading states
* [ ] Error feedback
* [ ] Keyboard shortcuts
* [ ] Focus management

---

## 📊 Phase 3 — Analytics Engine

### Goals

Provide actionable insights

---

### 7.1 Metrics

* [ ] Conversion rate per stage
* [ ] Average time in stage
* [ ] Response rate
* [ ] Offer rate

---

### 7.2 Backend Implementation

* [ ] Analytics service
* [ ] Aggregation queries (SQL)
* [ ] Optimized indexing

---

### 7.3 TUI Integration

* [ ] ASCII charts
* [ ] Summary dashboard
* [ ] Filters (date range, company)

---

## ⏱️ Phase 4 — Automation & Scheduling

### Goals

Introduce asynchronous processing

---

### 8.1 Features

* [ ] Follow-up reminders
* [ ] Interview reminders
* [ ] Deadline tracking

---

### 8.2 Technical Tasks

* [ ] Background worker setup
* [ ] Event model:

  * id
  * type
  * scheduled_at
* [ ] Scheduler integration
* [ ] Retry mechanisms

---

## 🧪 Phase 5 — Testing & Reliability

### Goals

Ensure robustness and correctness

---

### 9.1 Testing Strategy

#### Unit Tests

* [ ] Services
* [ ] Validation logic

#### Integration Tests

* [ ] API endpoints
* [ ] DB interactions

#### Edge Cases

* [ ] Invalid transitions
* [ ] Missing fields
* [ ] Concurrency issues

---

### 9.2 Quality Metrics

* [ ] Coverage ≥ 85%
* [ ] CI pipeline setup

---

## 🔐 Phase 6 — Authentication & Multi-User

### Goals

Enable secure multi-user system

---

### Features

* [ ] User registration
* [ ] Login (JWT)
* [ ] Role-based access:

  * Admin
  * User

---

### Technical Tasks

* [ ] Auth service
* [ ] Password hashing
* [ ] Token validation
* [ ] Protected routes

---

## ⚙️ Phase 7 — Advanced Features

### Goals

Differentiate the project

---

### 10.1 AI Integration (Optional)

* [ ] Resume-job matching score
* [ ] Job description summarization

---

### 10.2 Import / Export

* [ ] Export CSV / JSON
* [ ] Import data

---

### 10.3 CLI Mode

* [ ] Scriptable commands
* [ ] Batch operations

---

## 💡 Phase 8 — Bonus (Standout)

### Ideas

* [ ] Shared pipelines
* [ ] Team collaboration
* [ ] Email parsing integration
* [ ] Browser extension (capture jobs)

---

# 6. 🗂️ Backend Structure

```
backend/
├── app/
│   ├── api/
│   ├── core/
│   ├── models/
│   ├── schemas/
│   ├── services/
│   ├── repositories/
│   ├── workers/
│   └── utils/
├── tests/
├── migrations/
└── main.py
```

---

# 7. 🧠 Engineering Principles

* Separation of concerns
* Domain-driven thinking
* Testability first
* Explicit over implicit
* Scalability readiness

---

# 8. 📊 Observability

* [ ] Structured logging
* [ ] Request logging middleware
* [ ] Error tracking
* [ ] Metrics (optional)

---

# 9. 🚀 Deployment

### Goals

Make project production-ready

### Tasks

* [ ] Dockerize backend
* [ ] Deploy API (VPS / cloud)
* [ ] Setup environment configs
* [ ] Database migrations
* [ ] CLI install via pip

---

# 10. 📈 Success Criteria

* Clean, modular architecture
* Strong test coverage
* Real analytics (not mocked)
* Smooth TUI UX
* Clear documentation

---

# 11. 📚 Documentation

* [ ] README.md (project overview)
* [ ] API documentation (OpenAPI)
* [ ] Architecture diagram
* [ ] Demo walkthrough

---

# 12. 🧭 Execution Strategy

### Recommended Order

1. Phase 0 → Setup
2. Phase 1 → Backend core
3. Phase 2 → TUI
4. Phase 3 → Analytics
5. Phase 4 → Automation
6. Phase 5 → Testing
7. Phase 6+ → Advanced

---

# 13. ⚠️ Risks & Mitigations

| Risk              | Mitigation               |
| ----------------- | ------------------------ |
| Over-engineering  | Stick to phases          |
| Weak analytics    | Prioritize data modeling |
| Poor UX           | Iterate on TUI early     |
| Low test coverage | Enforce testing in CI    |

---

# 14. 🏁 Final Deliverable

A **production-grade portfolio project** demonstrating:

* Backend engineering expertise
* System design thinking
* Data modeling depth
* Developer tooling innovation (TUI)

---
