# Scientific Collaboration Network Analyzer

Research collaboration management platform for universities and research organizations —
manages publications, researchers, institutions, projects, conferences, and collaborations,
with visualization of collaboration networks, publication statistics, and institutional reports.

## Structure
- `backend/`  — FastAPI + PostgreSQL + Redis (API, business logic, DB layer)
- `frontend/` — React (dashboards, forms, network visualization)
- `docs/`     — architecture, API reference, DB schema, timeline
- `docker-compose.yml` — local orchestration of backend + frontend + db + redis

## Modules
1. User Management
2. Researcher Management
3. Publication Management
4. Collaboration Management
5. Conference Management
6. Citation & Reference Module
7. Dashboards (Researcher / Institution / Admin)
8. Reports & Export
9. Audit Module

## Getting Started
See `backend/.env.example` and `frontend/.env.example` for required environment variables.

