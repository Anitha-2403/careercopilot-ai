const express = require("express");
const cors = require("cors");
require("dotenv").config();

const app = express();
const PORT = process.env.PORT || 5000;

const ALLOWED_ORIGINS = [
  "https://careercopilot-ai.netlify.app",
  "http://localhost:3000",
  "http://127.0.0.1:3000"
];

app.use(
  cors({
    origin: function (origin, callback) {
      if (!origin || ALLOWED_ORIGINS.includes(origin)) {
        callback(null, true);
      } else {
        callback(new Error("Not allowed by CORS"));
      }
    },
    methods: ["GET", "POST", "PUT", "DELETE", "OPTIONS"],
    allowedHeaders: ["Content-Type", "Authorization"]
  })
);

app.use(express.json());

app.get("/api/health", (req, res) => {
  res.json({ status: "ok" });
});

const roadmapRouter = require("./routes/roadmap");
app.use("/api", roadmapRouter);

const interviewRouter = require("./routes/interview");
app.use("/api", interviewRouter);

app.use("/api", (req, res) => {
  res.status(404).json({
    error: "not_found",
    message: "This endpoint does not exist."
  });
});

app.listen(PORT, () => {
  console.log(`CareerCopilot AI server running on port ${PORT}`);
});