# CareerCopilot AI — Project Structure

**Status:** Approved Day 2 Design — Source of Truth

## Current Structure (as of Day 2)

```
careercopilot-ai/
├── client/
│   ├── assets/
│   ├── index.html
│   ├── style.css
│   └── script.js
├── server/
│   ├── routes/
│   ├── prompts/
│   ├── index.js
│   ├── package.json
│   └── .env.example
├── screenshots/
├── .gitignore
├── README.md
└── docs/                      ← added Day 2
    ├── ARCHITECTURE.md
    ├── SCHEMA.md
    ├── API.md
    ├── UI-WIREFRAMES.md
    └── PROJECT-STRUCTURE.md
```

## Target Structure by Day 10 (Where Future Code Will Live)

```
careercopilot-ai/
├── client/
│   ├── index.html                 # Landing page
│   ├── role-select.html           # Screen: role selection
│   ├── roadmap.html               # Screen: AI roadmap
│   ├── interview.html             # Screen: mock interview
│   ├── dashboard.html             # Screen: progress dashboard
│   ├── style.css                  # Design system + all component styles
│   ├── script.js                  # Shared logic: fetch calls, localStorage helpers, rendering
│   └── assets/
│       ├── logo.svg               # Brand mark (added Day 8)
│       └── favicon.ico            # Added Day 8
│
├── server/
│   ├── index.js                   # Express app entry point, middleware, route mounting
│   ├── routes/
│   │   ├── roadmap.js             # POST /api/roadmap
│   │   └── interview.js           # POST /api/interview/question, /evaluate, /summary
│   ├── prompts/
│   │   ├── roadmapPrompt.js       # Prompt template + ROLE_CONTEXT lookup
│   │   └── interviewPrompts.js    # Prompt templates for question/evaluate/summary
│   ├── package.json
│   ├── .env                       # Local only — GEMINI_API_KEY, PORT (git-ignored)
│   └── .env.example               # Committed template showing required variables
│
├── screenshots/                   # Populated Day 8–10 for README
│   ├── landing.png
│   ├── roadmap.png
│   ├── interview.png
│   └── dashboard.png
│
├── docs/                          # Design documents (this deliverable set)
│   ├── ARCHITECTURE.md
│   ├── SCHEMA.md
│   ├── API.md
│   ├── UI-WIREFRAMES.md
│   └── PROJECT-STRUCTURE.md
│
├── .gitignore                     # node_modules/, .env
├── README.md                      # Expanded Day 10 with setup instructions, screenshots, live link
└── LICENSE                        # Added Day 10 (MIT)
```

## Folder Responsibilities

| Folder / File | Responsibility |
|---|---|
| `client/` | Everything the browser loads directly — HTML screens, one shared stylesheet, one shared script file. No build step; files are served as-is by Netlify. |
| `client/assets/` | Static binary/vector assets (logo, favicon) — kept separate from code files for clarity. |
| `server/index.js` | The single Express entry point: sets up middleware (`cors`, `express.json()`), mounts routers, starts the listener. Kept thin — no business logic lives here. |
| `server/routes/` | One file per feature area (`roadmap.js`, `interview.js`), each exporting an Express Router. Keeps `index.js` clean and makes it obvious where to add a new endpoint. |
| `server/prompts/` | Prompt templates isolated from route logic — makes prompt iteration (Day 4–5 refinement) fast without touching request-handling code, and keeps route files readable. |
| `screenshots/` | Populated only at the end (Day 8–10) once the UI is polish-complete — avoids stale images in early commits. |
| `docs/` | All Day 2 design deliverables live here, version-controlled alongside the code they describe — this is the "single source of truth" the Blueprint requires, and it stays in the repo so any future AI conversation or collaborator can read it directly from GitHub. |

## Why This Structure

- **Separation by deployment target, not by feature:** `client/` and `server/` map exactly to the two things that get deployed separately (Netlify vs. Render) — this makes Day 9 deployment configuration (root directory, build commands) unambiguous.
- **No premature abstraction:** No `models/`, `controllers/`, `services/` layering — the app is small enough (5 endpoints, 5 screens) that this would add navigation overhead without benefit. Routes call prompt templates and return JSON directly.
- **Flat and shallow:** Maximum folder depth is 2 levels (`server/routes/`) — easy to navigate, easy to explain in an interview walkthrough.
- **Docs live in the repo:** Keeping `docs/` in version control (rather than only in chat/exported files) means the design documents are visible on GitHub itself — a strong portfolio signal that shows a real SDLC process, not just code.

## No Deviation from Blueprint

This structure is a direct extension of the Day 2 skeleton created in Part 4 of today's setup (see repo commit history) and the folder plan implied in the Blueprint's Day 3–7 sections. No new top-level folders were introduced beyond `docs/`, which supports today's deliverables without altering the build plan for Days 3–10.
