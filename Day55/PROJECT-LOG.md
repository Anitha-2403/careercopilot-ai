# CareerCopilot AI — Project Log

A running log of daily progress across the 10-day capstone sprint.

---

## Day 1 — Product Discovery & Sprint Planning
**Date:** August 5, 2026

- Interviewed to discover the strongest project idea within scope and skill level
- Selected **CareerCopilot AI**: AI-powered roadmap + mock interview + readiness dashboard for career prep
- Defined v1.0 scope, explicitly excluded features (auth, resume parsing, voice interviews, job boards)
- Generated: Product Requirements Document (PRD), Implementation Blueprint (Days 2–10), Project Pitch Deck

**Status:** ✅ Complete — scope approved, all Day 1 deliverables generated.

---

## Day 2 — System Design
**Date:** August 6, 2026

- Created GitHub repository (`careercopilot-ai`), cloned locally, opened in VS Code
- Created initial project skeleton: `client/`, `server/`, `screenshots/` folders
- Finalized tech stack: HTML/CSS/JS frontend, Node.js/Express backend, Google Gemini API, localStorage persistence, Netlify + Render hosting
- Designed full system architecture (component diagram, data flow, request lifecycle, AI interaction pattern)
- Designed localStorage data schema (5 keys, validated against every PRD functional requirement)
- Designed all 5 backend API endpoints with request/response/validation/error contracts
- Designed complete user flow and low-fidelity wireframes for all 5 screens
- Documented final project folder structure and rationale
- Added Day 2 Addendum to Implementation Blueprint locking all naming decisions (endpoints, localStorage keys, filenames)
- Generated: `ARCHITECTURE.md`, `SCHEMA.md`, `API.md`, `UI-WIREFRAMES.md`, `PROJECT-STRUCTURE.md`
- Committed and pushed all documentation to GitHub (12 files, 818 insertions)

**Day 3 Readiness Check:** ✅ On track — no scope creep, no open design decisions remain, Day 3 can begin building immediately.

**Status:** ✅ Complete — full technical blueprint locked, zero ambiguity heading into implementation.

---

## Day 3 — Project Setup & Foundation
**Date:** August 8, 2026

- Deferred Blueprint's original Day 2 coding tasks to today (Day 2 became full system design instead)
- Verified Node.js v24.12.0, npm 11.6.2 — no install needed
- Generated free Gemini API key via Google AI Studio
- Initialized `server/package.json`, installed `express`, `cors`, `dotenv`
- Built `server/index.js` (Express entry point), `server/routes/testGemini.js` (Gemini connection test)
- Built Hello World frontend: `client/index.html`, `style.css`, `script.js` with live backend health check
- **Notable debugging:** Gemini model name required 4 iterations to resolve (`gemini-1.5-flash` → `gemini-2.5-flash` → `gemini-3.6-flash` → `gemini-flash-latest`, confirmed via Google AI Studio's live quickstart generator) — full trail documented in `ENVIRONMENT.md`
- Verified full-stack request flow: browser → frontend → backend → Gemini → rendered response
- Generated: `SETUP.md`, `ENVIRONMENT.md`, `DAY3-SUMMARY.md`; updated `ARCHITECTURE.md`, `PROJECT-STRUCTURE.md`

**Status:** ✅ Complete — working full-stack foundation, Gemini connection confirmed reliable.

---

## Day 4 — Core Feature Implementation: AI Roadmap
**Date:** August 9, 2026

- **Milestone 1:** Built `POST /api/roadmap` — Gemini-powered structured roadmap generation with per-role in-memory caching, tested via PowerShell
- **Milestone 2:** Wired `role-select.html` and `roadmap.html` to real functionality — role selection, dynamic AI roadmap rendering, milestone checkbox tracking, all persisted to localStorage (`cc_selected_role`, `cc_roadmap_data_<role>`, `cc_roadmap_progress_<role>`)
- Verified via DevTools localStorage inspection — all keys present and correctly structured

**Status:** ✅ Complete — first of three core features fully functional end-to-end.

---

## Day 5 — Core Feature Implementation: Mock Interview Backend
**Date:** August 10, 2026

- **Milestone 1:** Built `POST /api/interview/question` — adaptive question generation by question number, no-repeat logic via `previousQA`
- **Milestone 2:** Built `POST /api/interview/evaluate` — answer scoring (0-10) with strengths/improvements/stronger example; validated scoring differentiates strong vs. weak answers correctly
- **Milestone 3:** Built `POST /api/interview/summary` — final session feedback + server-computed `averageScore` + recommended topics
- All three endpoints tested independently (success + validation-failure paths) before considering the day complete
- Zero impact on Day 4's roadmap feature — confirmed working
- Generated: `DAY5-SUMMARY.md`; updated Implementation Blueprint with Day 4 + Day 5 addenda

**Status:** ✅ Complete — mock interview backend fully functional and tested, ready for UI wiring Day 6.

---

## Day 6 — (Upcoming)
Wire `interview.html` to today's three endpoints: conversational question/answer/feedback loop, live readiness score, session saved to `cc_interview_history` on completion.
