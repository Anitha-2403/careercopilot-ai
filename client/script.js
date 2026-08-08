// client/script.js
// Shared logic across all CareerCopilot AI pages.
// Each section below is guarded so this one file works safely on every page.

const BACKEND_URL = "http://localhost:5000";

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
// PAGE: index.html — backend health check (Day 3, unchanged)
// ==========================================================================

async function checkBackendHealth() {
  const statusEl = document.getElementById("backend-status");
  if (!statusEl) return; // not on this page

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
  if (!roleCards.length || !continueBtn) return; // not on this page

  let selectedRole = getJSON("cc_selected_role", null);

  function renderSelection() {
    roleCards.forEach((card) => {
      if (card.dataset.role === selectedRole) {
        card.classList.add("role-card-selected");
      } else {
        card.classList.remove("role-card-selected");
      }
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
    const prefs = getJSON("cc_user_preferences", {});
    prefs.lastViewedRole = selectedRole;
    setJSON("cc_user_preferences", prefs);
    // navigation happens via the href on continueBtn
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
  if (!roleNameEl) return; // not on this page

  const role = getJSON("cc_selected_role", null);

  if (!role) {
    errorEl.textContent = "No role selected. Please go back and choose a role.";
    errorEl.style.display = "block";
    loadingEl.style.display = "none";
    return;
  }

  roleNameEl.textContent = role;

  // Check cache first
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
  // Core Skills
  const skillsEl = document.getElementById("core-skills");
  skillsEl.innerHTML = "";
  roadmap.coreSkills.forEach((skill) => {
    const span = document.createElement("span");
    span.className = "badge badge-success";
    span.textContent = skill;
    skillsEl.appendChild(span);
  });

  // Learning Sequence (with progress tracking)
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

  // Ensure a progress record exists even if user checks nothing
  setJSON(`cc_roadmap_progress_${role}`, progress);

  // Resources
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