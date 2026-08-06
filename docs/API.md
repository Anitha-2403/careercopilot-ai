# CareerCopilot AI — API Design

**Status:** Approved Day 2 Design — Source of Truth
**Base URL (local):** `http://localhost:5000`
**Base URL (production):** set in Day 9 after Render deployment

No implementation in this document — design only, per Day 2 scope. All endpoints implemented Day 4–5 exactly as specified here.

---

## Authentication

**None.** Per PRD, v1.0 has no user accounts or login. All endpoints are public. CORS restricts which origins may call the API (see ARCHITECTURE.md §7), which is the only access control in v1.0.

---

## Endpoint Summary

| Method | Path | Purpose |
|---|---|---|
| GET | `/api/health` | Confirm server is running |
| POST | `/api/roadmap` | Generate a learning roadmap for a role |
| POST | `/api/interview/question` | Generate the next interview question |
| POST | `/api/interview/evaluate` | Evaluate a submitted answer |
| POST | `/api/interview/summary` | Generate final session summary |

---

## 1. `GET /api/health`

**Purpose:** Basic uptime check, used during setup and to detect a "cold start" on Render.

**Request:** No body, no parameters.

**Response — 200 OK:**
```json
{ "status": "ok" }
```

**Validation:** None needed.
**Authentication:** None.
**Error cases:** None expected — if the server is down, the request simply fails to connect (handled client-side as a network error).

---

## 2. `POST /api/roadmap`

**Purpose:** Generates a structured, role-specific learning roadmap via Gemini.

**Request body:**
```json
{ "role": "AI/ML Engineer Intern" }
```

**Response — 200 OK:**
```json
{
  "coreSkills": ["Python", "Data structures", "ML fundamentals", "Model evaluation", "Deployment basics"],
  "learningSequence": [
    { "step": "Python & data handling", "description": "Master pandas, numpy, and clean data workflows." },
    { "step": "Core ML concepts", "description": "Supervised/unsupervised learning, overfitting, evaluation metrics." }
  ],
  "resources": [
    { "title": "Scikit-learn documentation", "type": "Documentation", "description": "Official reference for classical ML algorithms." }
  ]
}
```

**Validation:**
- `role` is required, must be a `string`
- `role` must exactly match one of the 5 predefined values: `"AI/ML Engineer Intern"`, `"Data Analyst"`, `"Frontend Developer"`, `"Full Stack Developer"`, `"Software Developer"`
- Any other value → `400`

**Authentication:** None.

**Error cases:**
| Status | Body | Cause |
|---|---|---|
| 400 | `{ "error": "invalid_role", "message": "role must be one of the 5 predefined options" }` | Missing or unrecognized role |
| 502 | `{ "error": "ai_generation_failed", "message": "Could not generate roadmap. Please try again." }` | Gemini call failed or returned unparseable JSON |
| 429 | `{ "error": "rate_limited", "message": "Too many requests. Please wait a moment." }` | Gemini free-tier rate limit hit |

---

## 3. `POST /api/interview/question`

**Purpose:** Generates the next interview question, adapting to question number and avoiding repetition of prior questions.

**Request body:**
```json
{
  "role": "Data Analyst",
  "questionNumber": 3,
  "previousQA": [
    { "question": "Tell me about a project where you used SQL.", "answer": "..." },
    { "question": "How do you handle missing data?", "answer": "..." }
  ]
}
```

**Response — 200 OK:**
```json
{ "question": "Walk me through how you would approach a dataset with duplicate records." }
```

**Validation:**
- `role` required, must match one of the 5 predefined roles
- `questionNumber` required, integer between 1 and 5
- `previousQA` required, array (can be empty for `questionNumber: 1`), length must equal `questionNumber - 1`

**Authentication:** None.

**Error cases:**
| Status | Body | Cause |
|---|---|---|
| 400 | `{ "error": "invalid_input" }` | Missing/malformed fields, or `previousQA` length mismatch |
| 502 | `{ "error": "ai_generation_failed" }` | Gemini call failed |
| 429 | `{ "error": "rate_limited" }` | Free-tier limit hit |

---

## 4. `POST /api/interview/evaluate`

**Purpose:** Evaluates a single submitted answer and returns structured feedback plus a numeric score.

**Request body:**
```json
{
  "role": "Data Analyst",
  "question": "How do you handle missing data?",
  "answer": "I usually check the percentage missing, then decide between imputation or dropping rows depending on the context."
}
```

**Response — 200 OK:**
```json
{
  "strengths": ["Shows awareness of context-dependent decision making"],
  "improvements": ["Could mention specific imputation techniques (mean, median, KNN)"],
  "strongerExample": "I'd first quantify the missingness pattern (MCAR/MAR/MNAR), then choose between deletion, mean/median imputation, or model-based imputation depending on the proportion missing and its impact on downstream analysis.",
  "score": 7
}
```

**Validation:**
- `role`, `question`, `answer` all required strings
- `answer` must be non-empty after trimming whitespace
- `answer` capped at a reasonable max length (e.g., 2000 characters) to prevent abuse/cost issues — longer input is rejected, not truncated silently

**Authentication:** None.

**Error cases:**
| Status | Body | Cause |
|---|---|---|
| 400 | `{ "error": "empty_answer" }` | Answer is blank or whitespace-only |
| 400 | `{ "error": "answer_too_long", "maxLength": 2000 }` | Exceeds length cap |
| 502 | `{ "error": "ai_generation_failed" }` | Gemini call or JSON parsing failed |
| 429 | `{ "error": "rate_limited" }` | Free-tier limit hit |

---

## 5. `POST /api/interview/summary`

**Purpose:** Generates the final session summary after all 5 questions are answered.

**Request body:**
```json
{
  "role": "Data Analyst",
  "sessionQA": [
    { "question": "...", "answer": "...", "score": 8 },
    { "question": "...", "answer": "...", "score": 7 },
    { "question": "...", "answer": "...", "score": 9 },
    { "question": "...", "answer": "...", "score": 6 },
    { "question": "...", "answer": "...", "score": 8 }
  ]
}
```

**Response — 200 OK:**
```json
{
  "overallFeedback": "Strong overall performance with clear communication. Focus on quantifying trade-offs in your answers to sound more analytical.",
  "averageScore": 76,
  "recommendedTopics": ["SQL window functions", "Statistical significance testing"]
}
```

**Validation:**
- `role` required, must match one of 5 predefined roles
- `sessionQA` required, array of exactly 5 objects, each with `question` (string), `answer` (string), `score` (number 0–10)

**Authentication:** None.

**Error cases:**
| Status | Body | Cause |
|---|---|---|
| 400 | `{ "error": "invalid_session", "message": "sessionQA must contain exactly 5 entries" }` | Wrong array length or malformed entries |
| 502 | `{ "error": "ai_generation_failed" }` | Gemini call failed |
| 429 | `{ "error": "rate_limited" }` | Free-tier limit hit |

---

## Cross-Cutting Error Handling Convention

Every non-2xx response follows the same shape: `{ "error": "<machine_readable_code>", "message"?: "<human_readable_string>" }`. This lets the frontend handle errors generically (show `message` if present, else a fallback string) rather than writing bespoke error UI per endpoint.

## Cross-Cutting: Gemini JSON Parsing

All four AI-backed endpoints (`/roadmap`, `/interview/question`, `/interview/evaluate`, `/interview/summary`) follow the same internal pattern:
1. Send prompt to Gemini with explicit "respond with JSON only" instruction
2. Strip any ` ```json ` / ` ``` ` code fences from the raw response
3. Attempt `JSON.parse()`
4. If parsing fails, return `502 { "error": "ai_generation_failed" }` rather than crashing or returning malformed data to the client
