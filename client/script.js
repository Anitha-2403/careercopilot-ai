// client/script.js
// Shared logic across all CareerCopilot AI pages.
// Each section below is guarded so this one file works safely on every page.

const BACKEND_URL = "https://careercopilot-ai-a4jd.onrender.com";

const ROLES = [
  "AI/ML Engineer Intern",
  "Data Analyst",
  "Frontend Developer",
  "Full Stack Developer",
  "Software Developer",
];

// ---------- localStorage helpers ----------

function getJSON(key, fallback) {
  try {
    const raw = localStorage.getItem(key);
    return raw ? JSON.parse(raw) : fallback;
  } catch (err) {
    console.error(`Failed to read localStorage key "${key}":`, err);
    return fallback;
  }
}

function setJSON(key, value) {
  try {
    localStorage.setItem(key, JSON.stringify(value));
  } catch (err) {
    console.error(`Failed to write localStorage key "${key}":`, err);
  }
}

// ==========================================================================
// PAGE: index.html — backend health check
// ==========================================================================

async function checkBackendHealth() {
  const statusEl = document.getElementById("backend-status");
  if (!statusEl) return;

  try {
    const response = await fetch(`${BACKEND_URL}/api/health`);
    const data = await response.json();
    statusEl.textContent = data.status === "ok" ? "✅ Backend connected" : "⚠️ Backend responded unexpectedly";
  } catch (err) {
    statusEl.textContent = "❌ Backend not reachable — is the server running?";
    console.error("Health check failed:", err);
  }
}

checkBackendHealth();

// ==========================================================================
// PAGE: role-select.html — role selection + save to localStorage
// ==========================================================================

function initRoleSelect() {
  const roleCards = document.querySelectorAll(".role-card");
  const continueBtn = document.getElementById("continue-btn");
  if (!roleCards.length || !continueBtn) return;

  let selectedRole = getJSON("cc_selected_role", null);

  function renderSelection() {
    roleCards.forEach((card) => {
      card.classList.toggle("role-card-selected", card.dataset.role === selectedRole);
    });
    continueBtn.classList.toggle("btn-disabled", !selectedRole);
  }

  roleCards.forEach((card) => {
    card.addEventListener("click", () => {
      selectedRole = card.dataset.role;
      renderSelection();
    });
  });

  continueBtn.addEventListener("click", (e) => {
    if (!selectedRole) {
      e.preventDefault();
      return;
    }
    setJSON("cc_selected_role", selectedRole);
    // Starting a new role means starting a fresh roadmap/interview cycle for it.
    const prefs = getJSON("cc_user_preferences", {});
    prefs.lastViewedRole = selectedRole;
    setJSON("cc_user_preferences", prefs);
  });

  renderSelection();
}

initRoleSelect();

// ==========================================================================
// PAGE: roadmap.html — fetch/cache AI roadmap, render, track checkboxes
// ==========================================================================

async function initRoadmap() {
  const roleNameEl = document.getElementById("roadmap-role-name");
  const loadingEl = document.getElementById("roadmap-loading");
  const errorEl = document.getElementById("roadmap-error");
  const contentEl = document.getElementById("roadmap-content");
  if (!roleNameEl) return;

  const role = getJSON("cc_selected_role", null);

  if (!role) {
    errorEl.textContent = "No role selected. Please go back and choose a role.";
    errorEl.style.display = "block";
    loadingEl.style.display = "none";
    return;
  }

  roleNameEl.textContent = role;

  let roadmap = getJSON(`cc_roadmap_data_${role}`, null);

  if (!roadmap) {
    try {
      const response = await fetch(`${BACKEND_URL}/api/roadmap`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ role }),
      });
      const data = await response.json();

      if (!response.ok) {
        throw new Error(data.message || "Failed to generate roadmap.");
      }

      roadmap = data;
      setJSON(`cc_roadmap_data_${role}`, roadmap);
    } catch (err) {
      console.error("Roadmap fetch failed:", err);
      loadingEl.style.display = "none";
      errorEl.textContent = "Could not generate your roadmap right now. Please refresh to try again.";
      errorEl.style.display = "block";
      return;
    }
  }

  renderRoadmap(role, roadmap);
  loadingEl.style.display = "none";
  contentEl.style.display = "block";
}

function renderRoadmap(role, roadmap) {
  const skillsEl = document.getElementById("core-skills");
  skillsEl.innerHTML = "";
  roadmap.coreSkills.forEach((skill) => {
    const span = document.createElement("span");
    span.className = "badge badge-success";
    span.textContent = skill;
    skillsEl.appendChild(span);
  });

  const progress = getJSON(`cc_roadmap_progress_${role}`, {
    completedSteps: [],
    totalSteps: roadmap.learningSequence.length,
  });

  const sequenceEl = document.getElementById("learning-sequence");
  sequenceEl.innerHTML = "";
  roadmap.learningSequence.forEach((item, index) => {
    const card = document.createElement("div");
    card.className = "card";
    card.style.cssText = "display: flex; align-items: center; gap: 12px;";

    const checkbox = document.createElement("input");
    checkbox.type = "checkbox";
    checkbox.style.cssText = "width: 18px; height: 18px; flex-shrink: 0;";
    checkbox.checked = progress.completedSteps.includes(index);
    checkbox.addEventListener("change", () => {
      const current = getJSON(`cc_roadmap_progress_${role}`, { completedSteps: [], totalSteps: roadmap.learningSequence.length });
      if (checkbox.checked) {
        if (!current.completedSteps.includes(index)) current.completedSteps.push(index);
      } else {
        current.completedSteps = current.completedSteps.filter((i) => i !== index);
      }
      current.totalSteps = roadmap.learningSequence.length;
      setJSON(`cc_roadmap_progress_${role}`, current);
    });

    const textDiv = document.createElement("div");
    textDiv.innerHTML = `<strong style="color: var(--color-text);">${index + 1}. ${item.step}</strong>
      <p style="color: var(--color-muted); font-size: 14px; margin-top: 4px;">${item.description}</p>`;

    card.appendChild(checkbox);
    card.appendChild(textDiv);
    sequenceEl.appendChild(card);
  });

  setJSON(`cc_roadmap_progress_${role}`, progress);

  const resourcesEl = document.getElementById("resources");
  resourcesEl.innerHTML = "";
  roadmap.resources.forEach((res) => {
    const card = document.createElement("div");
    card.className = "card";
    card.innerHTML = `<strong style="color: var(--color-navy);">${res.title}</strong>
      <p style="color: var(--color-muted); font-size: 14px; margin-top: 6px;">${res.description}</p>`;
    resourcesEl.appendChild(card);
  });
}

initRoadmap();

// ==========================================================================
// PAGE: interview.html — conversational mock interview state machine
// ==========================================================================

function initInterview() {
  const loadingEl = document.getElementById("interview-loading");
  const errorEl = document.getElementById("interview-error");
  const activeEl = document.getElementById("interview-active");
  const summaryEl = document.getElementById("interview-summary");
  if (!loadingEl || !activeEl) return; // not on this page

  const readinessBadge = document.getElementById("readiness-badge");
  const questionCounter = document.getElementById("question-counter");
  const progressDots = document.getElementById("progress-dots");
  const questionText = document.getElementById("question-text");
  const answerInput = document.getElementById("answer-input");
  const submitBtn = document.getElementById("submit-answer-btn");
  const feedbackSection = document.getElementById("feedback-section");
  const feedbackStrengths = document.getElementById("feedback-strengths");
  const feedbackImprovements = document.getElementById("feedback-improvements");
  const feedbackExample = document.getElementById("feedback-example");
  const nextBtnContainer = document.getElementById("next-btn-container");
  const nextBtn = document.getElementById("next-question-btn");

  const role = getJSON("cc_selected_role", null);
  if (!role) {
    loadingEl.style.display = "none";
    errorEl.textContent = "No role selected. Please go back and choose a role.";
    errorEl.style.display = "block";
    return;
  }

  const TOTAL_QUESTIONS = 5;
  let questionNumber = 1;
  let currentQuestion = "";
  const previousQA = [];   // for /interview/question repetition-avoidance
  const sessionQA = [];    // for /interview/summary, includes scores

  function updateProgressUI() {
    questionCounter.textContent = `Question ${questionNumber} of ${TOTAL_QUESTIONS}`;
    progressDots.textContent = "●".repeat(questionNumber - 1) + "○".repeat(TOTAL_QUESTIONS - questionNumber + 1);
  }

  function updateReadinessBadge() {
    if (sessionQA.length === 0) {
      readinessBadge.style.display = "none";
      return;
    }
    const avg = sessionQA.reduce((sum, qa) => sum + qa.score, 0) / sessionQA.length;
    const pct = Math.round(avg * 10);
    readinessBadge.textContent = `Readiness: ${pct}%`;
    readinessBadge.style.display = "inline-flex";
    readinessBadge.className = pct >= 70 ? "badge badge-success" : pct >= 40 ? "badge badge-warning" : "badge badge-danger";
  }

  async function loadQuestion() {
    loadingEl.style.display = "block";
    errorEl.style.display = "none";
    activeEl.style.display = "none";
    feedbackSection.style.display = "none";
    nextBtnContainer.style.display = "none";
    answerInput.value = "";
    answerInput.disabled = false;
    submitBtn.disabled = false;
    submitBtn.style.display = "inline-block";

    try {
      const response = await fetch(`${BACKEND_URL}/api/interview/question`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ role, questionNumber, previousQA }),
      });
      const data = await response.json();
      if (!response.ok) throw new Error(data.message || "Failed to load question.");

      currentQuestion = data.question;
      questionText.textContent = currentQuestion;
      updateProgressUI();

      loadingEl.style.display = "none";
      activeEl.style.display = "block";
    } catch (err) {
      console.error("Question fetch failed:", err);
      loadingEl.style.display = "none";
      errorEl.textContent = "Could not load the next question. Please refresh to try again.";
      errorEl.style.display = "block";
    }
  }

  async function submitAnswer() {
    const answer = answerInput.value.trim();
    if (!answer) {
      alert("Please write an answer before submitting.");
      return;
    }

    submitBtn.disabled = true;
    submitBtn.textContent = "Evaluating...";

    try {
      const response = await fetch(`${BACKEND_URL}/api/interview/evaluate`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ role, question: currentQuestion, answer }),
      });
      const data = await response.json();
      if (!response.ok) throw new Error(data.message || "Evaluation failed.");

      // Record for both the next-question repetition check and the final summary
      previousQA.push({ question: currentQuestion, answer });
      sessionQA.push({ question: currentQuestion, answer, score: data.score });

      renderFeedback(data);
      updateReadinessBadge();

      answerInput.disabled = true;
      submitBtn.style.display = "none";
      nextBtnContainer.style.display = "block";
      nextBtn.textContent = questionNumber === TOTAL_QUESTIONS ? "Finish Interview →" : "Next Question →";
    } catch (err) {
      console.error("Evaluate failed:", err);
      alert("Could not evaluate your answer. Please try submitting again.");
      submitBtn.disabled = false;
      submitBtn.textContent = "Submit Answer";
    }
  }

  function renderFeedback(data) {
    feedbackStrengths.innerHTML = data.strengths.map((s) => `<li>${s}</li>`).join("");
    feedbackImprovements.innerHTML = data.improvements.map((s) => `<li>${s}</li>`).join("");
    feedbackExample.textContent = data.strongerExample;
    feedbackSection.style.display = "block";
    submitBtn.textContent = "Submit Answer"; // reset for next round
  }

  async function finishInterview() {
    activeEl.style.display = "none";
    loadingEl.textContent = "Generating your final summary...";
    loadingEl.style.display = "block";

    try {
      const response = await fetch(`${BACKEND_URL}/api/interview/summary`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ role, sessionQA }),
      });
      const data = await response.json();
      if (!response.ok) throw new Error(data.message || "Summary generation failed.");

      // Save completed session to history (schema: docs/SCHEMA.md)
      const history = getJSON("cc_interview_history", []);
      history.push({
        id: `sess_${Date.now()}`,
        role,
        date: new Date().toISOString(),
        score: data.averageScore,
        questionScores: sessionQA.map((qa) => qa.score),
        recommendedTopics: data.recommendedTopics,
      });
      setJSON("cc_interview_history", history);

      renderSummary(data);
      loadingEl.style.display = "none";
      summaryEl.style.display = "block";
    } catch (err) {
      console.error("Summary fetch failed:", err);
      loadingEl.style.display = "none";
      errorEl.textContent = "Could not generate your summary. Your answers were recorded — please refresh to try finishing again.";
      errorEl.style.display = "block";
    }
  }

  function renderSummary(data) {
    document.getElementById("final-score").textContent = `${data.averageScore}%`;
    document.getElementById("overall-feedback").textContent = data.overallFeedback;
    const topicsEl = document.getElementById("recommended-topics");
    topicsEl.innerHTML = "";
    data.recommendedTopics.forEach((topic) => {
      const span = document.createElement("span");
      span.className = "badge badge-warning";
      span.textContent = topic;
      topicsEl.appendChild(span);
    });
  }

  submitBtn.addEventListener("click", submitAnswer);
  nextBtn.addEventListener("click", () => {
    if (questionNumber === TOTAL_QUESTIONS) {
      finishInterview();
    } else {
      questionNumber += 1;
      loadQuestion();
    }
  });

  loadQuestion();
}

initInterview();