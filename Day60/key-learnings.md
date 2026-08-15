# Key Learnings — AB Talks 60-Day Claude AI Challenge & CareerCopilot AI Capstone

## On working with AI
- Clear, specific prompts get clear, specific results — vague requests produce vague or generic output
- Iterating step by step, rather than asking for everything at once, catches problems earlier
- AI is most useful as a pair programmer that still requires you to inspect, verify, and decide — not as an autopilot

## On building a real project
- Scoping the feature set early (Dashboard, Coding Practice, Aptitude Hub, and the rest) and holding that scope for the full sprint prevented drift and kept the project finishable
- A documented project structure (`PROJECT-STRUCTURE.md`) made it possible to audit the whole repo quickly on Day 10
- Splitting frontend and backend across two hosting providers (Netlify + Render) surfaced a real cross-origin issue that local development never would have shown

## On debugging
- The Day 9 CORS bug was the clearest lesson of the sprint: production environments expose failure modes that don't exist locally, and the only way to catch them is to actually test against the deployed environment
- Debugging is faster when the architecture is separated cleanly — the client/server split made it possible to isolate the CORS issue to the boundary between them

## On finishing, not just building
- A working app and a *presentable* repo are different milestones — README, LICENSE, and metadata are easy to deprioritize but are the first thing anyone sees
- Writing down known gaps (no automated tests, accessibility issues) instead of hiding them turned limitations into an honest, actionable roadmap (the 30-day growth plan) instead of a discovered surprise later
- Shipping v1.0.0 didn't mean the project was "finished" — it meant the current state was documented, tagged, and ready to build on

## What I'm taking forward
The habit of closing the gap between "it works" and "it's ready for someone else to see" — that's the difference this capstone actually taught, more than any single technology.
