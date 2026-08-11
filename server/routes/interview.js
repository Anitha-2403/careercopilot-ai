// server/routes/interview.js
// Mock interview endpoints — all three Day 5 endpoints now complete:
// POST /api/interview/question, /evaluate, /summary

const express = require("express");
const router = express.Router();
const {
  buildQuestionPrompt,
  buildEvaluationPrompt,
  buildSummaryPrompt,
  VALID_ROLES,
} = require("../prompts/interviewPrompts");
const GEMINI_MODEL = "gemini-3.5-flash-lite";
const MAX_ANSWER_LENGTH = 2000;

function stripCodeFences(text) {
  return text.replace(/```json\s*/gi, "").replace(/```/g, "").trim();
}

async function callGemini(prompt) {
  const apiKey = process.env.GEMINI_API_KEY;
  if (!apiKey) {
    throw { status: 500, body: { error: "missing_api_key", message: "GEMINI_API_KEY not set in .env" } };
  }

  const url = `https://generativelanguage.googleapis.com/v1beta/models/${GEMINI_MODEL}:generateContent`;

  const response = await fetch(url, {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
      "X-goog-api-key": apiKey,
    },
    body: JSON.stringify({
      contents: [{ parts: [{ text: prompt }] }],
    }),
  });

  const data = await response.json();

  if (!response.ok) {
    console.error("Gemini API error:", JSON.stringify(data, null, 2));
    throw { status: 502, body: { error: "ai_generation_failed", message: "AI request failed. Please try again." } };
  }

  const rawText = data.candidates?.[0]?.content?.parts?.[0]?.text;
  if (!rawText) {
    throw { status: 502, body: { error: "ai_generation_failed", message: "Gemini returned no content." } };
  }

  return rawText;
}

// ---------- POST /api/interview/question ----------

router.post("/interview/question", async (req, res) => {
  const { role, questionNumber, previousQA } = req.body;

  if (!role || !VALID_ROLES.includes(role)) {
    return res.status(400).json({ error: "invalid_input", message: "role must be one of the 5 predefined options" });
  }
  if (!Number.isInteger(questionNumber) || questionNumber < 1 || questionNumber > 5) {
    return res.status(400).json({ error: "invalid_input", message: "questionNumber must be an integer between 1 and 5" });
  }
  if (!Array.isArray(previousQA)) {
    return res.status(400).json({ error: "invalid_input", message: "previousQA must be an array" });
  }
  if (previousQA.length !== questionNumber - 1) {
    return res.status(400).json({ error: "invalid_input", message: "previousQA length must equal questionNumber - 1" });
  }

  try {
    const prompt = buildQuestionPrompt(role, questionNumber, previousQA);
    const rawText = await callGemini(prompt);

    let parsed;
    try {
      parsed = JSON.parse(stripCodeFences(rawText));
    } catch (parseErr) {
      console.error("Question JSON parse failed. Raw text:", rawText);
      return res.status(502).json({ error: "ai_generation_failed", message: "Could not parse AI response. Please try again." });
    }

    if (!parsed.question || typeof parsed.question !== "string") {
      return res.status(502).json({ error: "ai_generation_failed", message: "AI response missing question text." });
    }

    res.json({ question: parsed.question });
  } catch (err) {
    if (err.status && err.body) return res.status(err.status).json(err.body);
    console.error("Interview question route error:", err);
    res.status(500).json({ error: "server_error", message: err.message });
  }
});

// ---------- POST /api/interview/evaluate ----------

router.post("/interview/evaluate", async (req, res) => {
  const { role, question, answer } = req.body;

  if (!role || !VALID_ROLES.includes(role)) {
    return res.status(400).json({ error: "invalid_input", message: "role must be one of the 5 predefined options" });
  }
  if (!question || typeof question !== "string") {
    return res.status(400).json({ error: "invalid_input", message: "question is required" });
  }
  if (typeof answer !== "string" || answer.trim().length === 0) {
    return res.status(400).json({ error: "empty_answer", message: "answer cannot be empty" });
  }
  if (answer.length > MAX_ANSWER_LENGTH) {
    return res.status(400).json({ error: "answer_too_long", maxLength: MAX_ANSWER_LENGTH });
  }

  try {
    const prompt = buildEvaluationPrompt(role, question, answer.trim());
    const rawText = await callGemini(prompt);

    let parsed;
    try {
      parsed = JSON.parse(stripCodeFences(rawText));
    } catch (parseErr) {
      console.error("Evaluation JSON parse failed. Raw text:", rawText);
      return res.status(502).json({ error: "ai_generation_failed", message: "Could not parse AI response. Please try again." });
    }

    const valid =
      Array.isArray(parsed.strengths) &&
      Array.isArray(parsed.improvements) &&
      typeof parsed.strongerExample === "string" &&
      Number.isFinite(parsed.score);

    if (!valid) {
      console.error("Evaluation response missing expected fields:", parsed);
      return res.status(502).json({ error: "ai_generation_failed", message: "AI response was incomplete. Please try again." });
    }

    const score = Math.max(0, Math.min(10, Math.round(parsed.score)));

    res.json({
      strengths: parsed.strengths,
      improvements: parsed.improvements,
      strongerExample: parsed.strongerExample,
      score,
    });
  } catch (err) {
    if (err.status && err.body) return res.status(err.status).json(err.body);
    console.error("Interview evaluate route error:", err);
    res.status(500).json({ error: "server_error", message: err.message });
  }
});

// ---------- POST /api/interview/summary ----------

router.post("/interview/summary", async (req, res) => {
  const { role, sessionQA } = req.body;

  if (!role || !VALID_ROLES.includes(role)) {
    return res.status(400).json({ error: "invalid_input", message: "role must be one of the 5 predefined options" });
  }
  if (!Array.isArray(sessionQA) || sessionQA.length !== 5) {
    return res.status(400).json({ error: "invalid_session", message: "sessionQA must contain exactly 5 entries" });
  }
  const entriesValid = sessionQA.every(
    (qa) =>
      qa &&
      typeof qa.question === "string" &&
      typeof qa.answer === "string" &&
      Number.isFinite(qa.score) &&
      qa.score >= 0 &&
      qa.score <= 10
  );
  if (!entriesValid) {
    return res.status(400).json({ error: "invalid_session", message: "each sessionQA entry needs question (string), answer (string), and score (0-10)" });
  }

  try {
    const prompt = buildSummaryPrompt(role, sessionQA);
    const rawText = await callGemini(prompt);

    let parsed;
    try {
      parsed = JSON.parse(stripCodeFences(rawText));
    } catch (parseErr) {
      console.error("Summary JSON parse failed. Raw text:", rawText);
      return res.status(502).json({ error: "ai_generation_failed", message: "Could not parse AI response. Please try again." });
    }

    const valid =
      typeof parsed.overallFeedback === "string" &&
      Array.isArray(parsed.recommendedTopics) &&
      parsed.recommendedTopics.length > 0;

    if (!valid) {
      console.error("Summary response missing expected fields:", parsed);
      return res.status(502).json({ error: "ai_generation_failed", message: "AI response was incomplete. Please try again." });
    }

    // averageScore is computed server-side from the actual scores, not left to the AI,
    // so it's always mathematically consistent with what the client already has.
    const totalScore = sessionQA.reduce((sum, qa) => sum + qa.score, 0);
    const averageScore = Math.round((totalScore / sessionQA.length) * 10); // 0-10 avg -> 0-100 scale

    res.json({
      overallFeedback: parsed.overallFeedback,
      averageScore,
      recommendedTopics: parsed.recommendedTopics,
    });
  } catch (err) {
    if (err.status && err.body) return res.status(err.status).json(err.body);
    console.error("Interview summary route error:", err);
    res.status(500).json({ error: "server_error", message: err.message });
  }
});

module.exports = router;