// server/index.js
// Entry point for the CareerCopilot AI backend.
// Sets up Express, middleware, and route mounting.

const express = require("express");
const cors = require("cors");
require("dotenv").config();

const app = express();
const PORT = process.env.PORT || 5000;

// Middleware
app.use(cors());
app.use(express.json());

// Health check route
app.get("/api/health", (req, res) => {
  res.json({ status: "ok" });
});

// Feature routes
const roadmapRouter = require("./routes/roadmap");
app.use("/api", roadmapRouter);

// Temporary Gemini test route (from Day 3 — kept for now, removed Day 6)
const testGeminiRouter = require("./routes/testGemini");
app.use("/api", testGeminiRouter);

app.listen(PORT, () => {
  console.log(`CareerCopilot AI server running on http://localhost:${PORT}`);
});