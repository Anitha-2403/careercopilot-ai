// server/routes/roadmap.js
// POST /api/roadmap — generates a structured learning roadmap via Gemini.
// Contract defined in docs/API.md. Model/auth pattern from testGemini.js.

const express = require("express");
const router = express.Router();
const { buildRoadmapPrompt, VALID_ROLES } = require("../prompts/roadmapPrompt");

const GEMINI_MODEL = "gemini-flash-latest";

// Simple in-memory cache — resets on server restart, reduces redundant
// Gemini calls during testing/demo (see ARCHITECTURE.md §5).
const roadmapCache = {};

function stripCodeFences(text) {
  return text.replace(/```json\s*/gi, "").replace(/```/g, "").trim();
}

router.post("/roadmap", async (req, res) => {
  const { role } = req.body;

  // Validation
  if (!role || typeof role !== "string") {
    return res.status(400).json({ error: "invalid_role", message: "role must be one of the 5 predefined options" });
  }
  if (!VALID_ROLES.includes(role)) {
    return res.status(400).json({ error: "invalid_role", message: "role must be one of the 5 predefined options" });
  }

  // Serve from cache if available
  if (roadmapCache[role]) {
    return res.json(roadmapCache[role]);
  }

  try {
    const apiKey = process.env.GEMINI_API_KEY;
    if (!apiKey) {
      return res.status(500).json({ error: "missing_api_key", message: "GEMINI_API_KEY not set in .env" });
    }

    const url = `https://generativelanguage.googleapis.com/v1beta/models/${GEMINI_MODEL}:generateContent`;
    const prompt = buildRoadmapPrompt(role);

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
      console.error("Gemini API error (roadmap):", JSON.stringify(data, null, 2));
      return res.status(502).json({ error: "ai_generation_failed", message: "Could not generate roadmap. Please try again." });
    }

    const rawText = data.candidates?.[0]?.content?.parts?.[0]?.text;
    if (!rawText) {
      return res.status(502).json({ error: "ai_generation_failed", message: "Gemini returned no content." });
    }

    let roadmap;
    try {
      roadmap = JSON.parse(stripCodeFences(rawText));
    } catch (parseErr) {
      console.error("Roadmap JSON parse failed. Raw text:", rawText);
      return res.status(502).json({ error: "ai_generation_failed", message: "Could not parse AI response. Please try again." });
    }

    roadmap.generatedAt = new Date().toISOString();
    roadmapCache[role] = roadmap;

    res.json(roadmap);
  } catch (err) {
    console.error("Roadmap route error:", err);
    res.status(500).json({ error: "server_error", message: err.message });
  }
});

module.exports = router;