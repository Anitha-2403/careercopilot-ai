// server/prompts/roadmapPrompt.js
// Prompt template + per-role context for AI roadmap generation.
// Model/auth pattern copied from server/routes/testGemini.js (Day 3).

const ROLE_CONTEXT = {
  "AI/ML Engineer Intern":
    "An entry-level AI/ML engineering role. Focus areas: Python, data structures, ML fundamentals (supervised/unsupervised learning), model evaluation metrics, and basic deployment concepts.",
  "Data Analyst":
    "An entry-level data analyst role. Focus areas: SQL, data visualization, statistical reasoning, spreadsheet/BI tools, and clear reporting/storytelling with data.",
  "Frontend Developer":
    "An entry-level frontend development role. Focus areas: HTML, CSS, JavaScript, responsive design, accessibility basics, and a modern framework (e.g., React).",
  "Full Stack Developer":
    "An entry-level full stack development role. Focus areas: frontend basics, backend/API development, databases, and end-to-end application architecture.",
  "Software Developer":
    "An entry-level general software developer role. Focus areas: core programming fundamentals, data structures and algorithms, version control, and software design principles.",
};

const VALID_ROLES = Object.keys(ROLE_CONTEXT);

function buildRoadmapPrompt(role) {
  const context = ROLE_CONTEXT[role];
  return `You are a career coach generating a learning roadmap for someone preparing for a "${role}" internship/entry-level role.

Role context: ${context}

Respond with valid JSON only, no markdown formatting, no code fences, no explanation before or after. Use exactly this shape:

{
  "coreSkills": ["skill1", "skill2", "skill3", "skill4", "skill5"],
  "learningSequence": [
    { "step": "short step title", "description": "one sentence description" }
  ],
  "resources": [
    { "title": "resource name", "type": "Documentation | Course | Practice | Community", "description": "one sentence description" }
  ]
}

Rules:
- coreSkills: exactly 5 items, short phrases (2-4 words each)
- learningSequence: exactly 5 items, ordered from foundational to advanced
- resources: exactly 4 items, real, well-known, free or freemium resources appropriate for this role
- Do not include any text outside the JSON object.`;
}

module.exports = { buildRoadmapPrompt, VALID_ROLES };