# Future Scope — CareerCopilot AI

## Introduction
CareerCopilot AI is a placement/career-preparation web application built as the capstone of the AB Talks 60-Day Claude AI Challenge. The current version (v1.0.0) is a working MVP with a React frontend on Netlify, an Express backend on Render, and a feature set covering Dashboard, Coding Practice, Aptitude Hub, Interview Prep, Resume Master, Company Prep, Study Planner, Achievements, Analytics, Settings, and career/placement roadmap functionality. This document outlines a realistic path for evolving that MVP into a more complete platform, without claiming any of the future items already exist.

## Next 3 Months
- Add automated tests (unit tests for backend routes, basic integration tests for key user flows)
- Set up CI (GitHub Actions) to run tests and linting on every push
- Add loading/empty/error states across all major sections (Dashboard, Coding Practice, Aptitude Hub, etc.)
- Fix accessibility gaps (keyboard navigation, visible focus states) across interactive components
- Extend repo documentation (README, LICENSE, and metadata already added) with setup and contribution docs

## Next 6 Months
- Introduce user accounts and authentication so progress in Coding Practice, Aptitude Hub, Study Planner, and Achievements persists across sessions
- Add a database layer to store user progress, resume data, and study plans (if not already part of the current stack)
- Expand Analytics from its current form into one backed by real stored user activity
- Add role-based or track-based personalization to the roadmap functionality

## Next 12 Months
- Build out Company Prep with structured, company-specific content
- Add a more interactive Interview Prep mode (e.g., guided practice Q&A flow)
- Expand Resume Master into a guided resume builder/reviewer
- Add analytics dashboards showing progress trends over time

## Technical Improvements
- Add automated testing and CI/CD (not currently in place)
- Add a proper database layer if not already present, replacing any static/in-memory data
- Add stronger input validation and error handling across API routes, building on the existing error handling for unknown API routes
- Add monitoring/logging on the Render backend beyond the existing API health check

## Product Improvements
- Add onboarding for first-time users across the Dashboard and roadmap features
- Improve navigation and information architecture across the app's many sections
- Tie Achievements to actual tracked user activity

## AI Improvements
- Clearly document which parts of the app currently use AI-generated content versus static content
- Explore AI-assisted feedback for Interview Prep and Resume Master as a defined future feature, not an existing one

## Security & Reliability
- Review and harden the production CORS configuration as usage grows
- Add rate limiting on backend API routes
- Audit environment variable handling on both the Netlify and Render deployments
- Add automated dependency vulnerability scanning

## Deployment & Scalability
- Formalize a staging environment separate from the production Netlify (frontend) and Render (backend) deployments
- Add uptime monitoring beyond the existing API health check
- Plan for scaling the Render backend as traffic grows

## Long-Term Vision
CareerCopilot AI's long-term vision is to grow from a capstone MVP into a genuinely useful placement-prep companion — tying together coding practice, aptitude, interview readiness, resume quality, company-specific prep, and study planning into a single, personalized, data-backed experience, built incrementally on the foundation shipped in this 10-day sprint.
