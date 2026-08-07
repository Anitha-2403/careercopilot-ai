// server/index.js
// Entry point for the CareerCopilot AI backend.
// Sets up Express, middleware, and route mounting.

const express = require("express");
const cors = require("cors");
require("dotenv").config();

const app = express();
const PORT = process.env.PORT || 5000;

// Middleware
app.use(cors()); // allows the frontend (different origin) to call this API
app.use(express.json()); // parses incoming JSON request bodies

// Health check route — confirms the server is alive
app.get("/api/health", (req, res) => {
  res.json({ status: "ok" });
});

// Temporary test route to confirm Gemini API connection works
const testGeminiRouter = require("./routes/testGemini");
app.use("/api", testGeminiRouter);

app.listen(PORT, () => {
  console.log(`CareerCopilot AI server running on http://localhost:${PORT}`);
});