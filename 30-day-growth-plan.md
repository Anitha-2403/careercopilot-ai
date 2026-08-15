# 30-Day Growth Plan — CareerCopilot AI

A day-by-day roadmap for evolving CareerCopilot AI beyond v1.0.0. One milestone per day, each building on the previous one.

---

**Day 1 — Repo & Environment Audit**
Goal: Confirm the exact current state of the codebase before making changes.
Tasks: Review client/ and server/ structure; confirm which env vars are required on Netlify and Render; confirm which of the 10 feature sections are fully wired to the backend vs. static.
Expected outcome: A written checklist of what's real vs. placeholder across Dashboard, Coding Practice, Aptitude Hub, Interview Prep, Resume Master, Company Prep, Study Planner, Achievements, Analytics, and Settings.

**Day 2 — Error Boundaries**
Goal: Prevent a single component crash from blanking the whole app.
Tasks: Add a React error boundary at the top level and around major routed sections.
Expected outcome: A broken section shows a fallback UI instead of a blank page.

**Day 3 — Loading & Empty States**
Goal: Every section has a real loading state.
Tasks: Add loading indicators to Dashboard, Coding Practice, and Aptitude Hub first (highest-traffic sections).
Expected outcome: No section shows a blank screen while data loads.

**Day 4 — Loading & Empty States (cont.)**
Goal: Extend Day 3 to the remaining sections.
Tasks: Add loading/empty states to Interview Prep, Resume Master, Company Prep, Study Planner, Achievements, Analytics.
Expected outcome: All 10 sections handle loading and empty data gracefully.

**Day 5 — Accessibility Pass 1**
Goal: Fix the Day 8 keyboard-navigation gap.
Tasks: Audit interactive elements (cards, buttons, nav) for keyboard focusability; add tabIndex where missing.
Expected outcome: Core navigation is fully keyboard-operable.

**Day 6 — Accessibility Pass 2**
Goal: Fix the Day 8 missing-focus-states gap.
Tasks: Add visible CSS focus styles across buttons, links, and cards.
Expected outcome: Every interactive element shows a clear focus indicator.

**Day 7 — Linting & Formatting**
Goal: Standardize code style before adding tests.
Tasks: Set up ESLint + Prettier; run once across the codebase and fix flagged issues.
Expected outcome: Consistent formatting; a `lint` script in package.json.

**Day 8 — First Backend Unit Tests**
Goal: Start test coverage on the Express API.
Tasks: Add a testing framework (e.g. Jest); write tests for the health check route and one core API route.
Expected outcome: `npm test` runs and passes on the backend.

**Day 9 — CI Setup**
Goal: Automate lint + test on every push.
Tasks: Add a GitHub Actions workflow running lint and test on push/PR.
Expected outcome: A green CI check appears on every commit.

**Day 10 — CORS & Env Review**
Goal: Re-verify the Day 9 (original sprint) CORS fix still holds and env vars are documented.
Tasks: Test cross-origin requests from the live Netlify frontend to the Render backend; confirm `.env.example` is current.
Expected outcome: Confirmed working production CORS config with up-to-date documentation.

**Day 11 — Database Decision**
Goal: Choose a persistence layer if one isn't already in place.
Tasks: Evaluate Postgres (e.g. via Supabase/Railway) vs. MongoDB Atlas for the app's data needs; provision the chosen database.
Expected outcome: A connected, empty database ready for schema design.

**Day 12 — Schema Design**
Goal: Design the core data model.
Tasks: Define schema for users, roadmap progress, and per-section data (e.g. Study Planner entries, Achievements).
Expected outcome: A documented schema and migration files.

**Day 13 — Authentication Setup**
Goal: Add basic user accounts.
Tasks: Implement email/password or magic-link auth on the backend; add login/signup UI.
Expected outcome: A user can sign up and log in.

**Day 14 — Persist Roadmap Progress**
Goal: Replace local-only state with database-backed progress.
Tasks: Wire roadmap/progress data to the new database via authenticated API routes.
Expected outcome: Progress survives logout/login.

**Day 15 — Persist Study Planner & Achievements**
Goal: Extend Day 14's persistence to more sections.
Tasks: Wire Study Planner entries and Achievements to the database.
Expected outcome: These sections retain data across sessions.

**Day 16 — Rate Limiting**
Goal: Protect the API from abuse.
Tasks: Add rate limiting middleware to the Express backend.
Expected outcome: Excessive requests from one client are throttled.

**Day 17 — Input Validation**
Goal: Harden API routes against bad input.
Tasks: Add validation (e.g. via a schema library) to all POST/PUT routes.
Expected outcome: Invalid requests return clear 400 errors instead of crashing.

**Day 18 — Analytics Data Wiring**
Goal: Make the Analytics section reflect real activity.
Tasks: Log key user actions (roadmap steps completed, practice sessions done) to the database; surface basic counts in Analytics.
Expected outcome: Analytics shows real, not placeholder, numbers.

**Day 19 — Interview Prep Enhancement**
Goal: Improve the Interview Prep experience.
Tasks: Add a structured practice-question flow if not already present, tied to the user's chosen role/track.
Expected outcome: Interview Prep offers a guided sequence, not just static content.

**Day 20 — Resume Master Enhancement**
Goal: Improve Resume Master's usefulness.
Tasks: Add structured resume review checkpoints (sections, formatting checks) if not already present.
Expected outcome: Resume Master gives actionable, structured feedback points.

**Day 21 — Company Prep Content**
Goal: Make Company Prep more concrete.
Tasks: Add structured content templates for at least 2–3 companies as a proof of concept.
Expected outcome: Company Prep shows real structured content instead of placeholders.

**Day 22 — Backend Monitoring**
Goal: Extend beyond the basic health check.
Tasks: Add structured logging on the Render backend for key routes and errors.
Expected outcome: Logs are available for debugging production issues.

**Day 23 — Uptime Monitoring**
Goal: Know when the app goes down.
Tasks: Add an external uptime monitor pinging the Render health check and Netlify frontend.
Expected outcome: Alerts fire if either service goes down.

**Day 24 — Performance Pass**
Goal: Reduce frontend load time.
Tasks: Check bundle size; lazy-load routes for sections not needed on first load.
Expected outcome: Measurable reduction in initial bundle size.

**Day 25 — Dependency & Security Audit**
Goal: Catch known vulnerabilities.
Tasks: Run `npm audit` on both client and server; update or patch flagged dependencies.
Expected outcome: No high/critical vulnerabilities outstanding.

**Day 26 — More Backend Tests**
Goal: Expand test coverage from Day 8.
Tasks: Add tests for auth routes and at least one persistence-backed route.
Expected outcome: Test suite covers the app's core authenticated flows.

**Day 27 — Frontend Integration Tests**
Goal: Add basic end-to-end coverage.
Tasks: Add an E2E test (e.g. Playwright/Cypress) covering login → roadmap → progress save.
Expected outcome: One passing E2E test in CI.

**Day 28 — Documentation Refresh**
Goal: Bring docs up to date with everything built in this 30-day plan.
Tasks: Update README with new setup steps (database, auth env vars); update `.env.example`.
Expected outcome: A new contributor could set up the full stack from the README alone.

**Day 29 — Full Regression Pass**
Goal: Confirm nothing broke across the 30-day plan.
Tasks: Manually walk through all 10 sections end-to-end on the live deployment.
Expected outcome: A signed-off checklist confirming each section works as expected.

**Day 30 — Tag v1.1.0**
Goal: Ship and document the 30-day plan's results.
Tasks: Write a changelog summarizing Days 1–29; tag and release v1.1.0.
Expected outcome: A tagged release with a changelog, ready to reference in your portfolio.
