const express = require("express");
const cors = require("cors");
require("dotenv").config();

const app = express();
const PORT = process.env.PORT || 5000;

const allowedOrigins = [
  "https://careercopilot-ai.netlify.app",
  "http://127.0.0.1:5500",
  "http://localhost:5500",
];

app.use(
  cors({
    origin: function (origin, callback) {
      // Allow requests without an Origin header
      if (!origin) {
        return callback(null, true);
      }

      if (allowedOrigins.includes(origin)) {
        return callback(null, true);
      }

      return callback(new Error("Not allowed by CORS"));
    },
    methods: ["GET", "POST", "PUT", "DELETE", "OPTIONS"],
    allowedHeaders: ["Content-Type", "Authorization"],
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
    message: "This endpoint does not exist.",
  });
});

app.listen(PORT, () => {
  console.log(`CareerCopilot AI server running on port ${PORT}`);
});