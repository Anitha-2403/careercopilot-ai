// server/prompts/interviewPrompts.js
// Prompt templates for the mock interview feature.
// Model/auth pattern copied from roadmapPrompt.js / roadmap.js (Day 4).

const { VALID_ROLES } = require("./roadmapPrompt");

function questionStyleForNumber(questionNumber) {
  switch (questionNumber) {
    case 1:
      return "an introductory/background question (e.g., about their experience or motivation for this role)";
    case 2:
      return "a foundational knowledge question specific to this role";
    case 3:
    case 4:
      return "a practical, scenario-based technical question specific to this role";
    case 5:
      return "a behavioral question (e.g., teamwork, handling a challenge, communication)";
    default:
      return "a general interview question specific to this role";
  }
}

function buildQuestionPrompt(role, questionNumber, previousQA) {
  const style = questionStyleForNumber(questionNumber);

  const historyText =
    previousQA.length === 0
      ? "This is the first question, so there is no prior history."
      : "Questions already asked in this session (do not repeat these or ask something very similar):\n" +
        previousQA.map((qa, i) => `${i + 1}. ${qa.question}`).join("\n");

  return `You are an interviewer conducting a mock interview for a "${role}" internship/entry-level candidate.

This is question ${questionNumber} of 5. Generate ${style}.

${historyText}

Respond with valid JSON only, no markdown formatting, no code fences, no explanation before or after. Use exactly this shape:

{ "question": "the interview question text" }

Rules:
- The question must be realistic, specific to the "${role}" role, and appropriate for an entry-level/intern candidate.
- Do not include any text outside the JSON object.
- Do not number or label the question, just the raw question text.`;
}

function buildEvaluationPrompt(role, question, answer) {
  return `You are an expert interview coach evaluating a candidate's answer during a mock interview for a "${role}" internship/entry-level role.

Question asked: "${question}"

Candidate's answer: "${answer}"

Evaluate this answer honestly and constructively. Respond with valid JSON only, no markdown formatting, no code fences, no explanation before or after. Use exactly this shape:

{
  "strengths": ["specific strength 1", "specific strength 2"],
  "improvements": ["specific improvement 1", "specific improvement 2"],
  "strongerExample": "a rewritten, stronger version of the answer, 2-4 sentences",
  "score": 7
}

Scoring guide (be a fair but honest judge, use the full 0-10 range):
- 0-2: Empty, off-topic, or nonsensical answer
- 3-4: Vague, generic, or missing key substance
- 5-6: Adequate but lacks specificity or depth
- 7-8: Solid, specific, well-structured answer
- 9-10: Excellent, specific, demonstrates strong understanding and clear communication

Rules:
- strengths: 1-3 items, specific to what the candidate actually said (not generic praise)
- improvements: 1-3 items, specific and actionable
- strongerExample: must directly answer the same question, not a generic template
- score: integer from 0 to 10
- Do not include any text outside the JSON object.`;
}

function buildSummaryPrompt(role, sessionQA) {
  const transcript = sessionQA
    .map((qa, i) => `Q${i + 1}: ${qa.question}\nA${i + 1}: ${qa.answer}\nScore: ${qa.score}/10`)
    .join("\n\n");

  return `You are an expert interview coach reviewing a completed 5-question mock interview for a "${role}" internship/entry-level candidate.

Full session transcript:

${transcript}

Write a final wrap-up. Respond with valid JSON only, no markdown formatting, no code fences, no explanation before or after. Use exactly this shape:

{
  "overallFeedback": "2-3 sentence honest summary of overall performance, communication style, and readiness",
  "recommendedTopics": ["topic 1", "topic 2", "topic 3"]
}

Rules:
- overallFeedback: honest and constructive, referencing patterns across multiple answers, not just one
- recommendedTopics: exactly 2-4 specific topics the candidate should study further, based on their weakest answers
- Do not include any text outside the JSON object.`;
}

module.exports = { buildQuestionPrompt, buildEvaluationPrompt, buildSummaryPrompt, VALID_ROLES };