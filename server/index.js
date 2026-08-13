// server/index.js
// Entry point for the CareerCopilot AI backend.
// Sets up Express, middleware, and route mounting.
//
// Day 9 fix: CORS restricted to the deployed Netlify frontend + localhost
// (was wide open to all origins). Debug testGemini route removed —
// it was unauthenticated and could burn production Gemini quota.

const express = require("express");
const cors = require("cors");
require("dotenv").config();

const app = express();
const PORT = process.env.PORT || 5000;

// Allowed origins: the deployed Netlify frontend, plus localhost for
// local development (see ARCHITECTURE.md §7).
const ALLOWED_ORIGINS = [
  "https://careercopilot-ai.netlify.app",
  "http://localhost:3000",
];

app.use(
  cors({
    origin: function (origin, callback) {
      // Allow requests with no origin (e.g. Postman, curl, server-to-server)
      if (!origin) return callback(null, true);
      if (ALLOWED_ORIGINS.includes(origin)) {
        return callback(null, true);
      }
      return callback(new Error("Not allowed by CORS"));
    },
  })
);
app.use(express.json());

// Health check route
app.get("/api/health", (req, res) => {
  res.json({ status: "ok" });
});

// Feature routes
const roadmapRouter = require("./routes/roadmap");
app.use("/api", roadmapRouter);

const interviewRouter = require("./routes/interview");
app.use("/api", interviewRouter);

// 404 handler for unmatched /api/* routes — returns clean JSON instead of
// falling through to Express's default HTML error page.
app.use("/api", (req, res) => {
  res.status(404).json({ error: "not_found", message: "This endpoint does not exist." });
});

app.listen(PORT, () => {
  console.log(`CareerCopilot AI server running on http://localhost:${PORT}`);
});