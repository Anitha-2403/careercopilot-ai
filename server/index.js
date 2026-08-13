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

// Allow the production Netlify frontend and local development
const ALLOWED_ORIGINS = [
  "https://careercopilot-ai.netlify.app",
  "http://localhost:3000",
];

app.use(
  cors({
    origin: function (origin, callback) {
      // Allow requests without an Origin header
      if (!origin) {
        return callback(null, true);
      }

      if (ALLOWED_ORIGINS.includes(origin)) {
        return callback(null, true);
      }

      return callback(new Error("Not allowed by CORS"));
    },
    methods: ["GET", "POST", "PUT", "DELETE", "OPTIONS"],
    allowedHeaders: ["Content-Type", "Authorization"],
  })
);

app.use(express.json());

// Health check
app.get("/api/health", (req, res) => {
  res.json({ status: "ok" });
});

// Roadmap routes
const roadmapRouter = require("./routes/roadmap");
app.use("/api", roadmapRouter);

// Interview routes
const interviewRouter = require("./routes/interview");
app.use("/api", interviewRouter);

// API 404 handler
app.use("/api", (req, res) => {
  res.status(404).json({
    error: "not_found",
    message: "This endpoint does not exist.",
  });
});

app.listen(PORT, () => {
  console.log(`CareerCopilot AI server running on http://localhost:${PORT}`);
});