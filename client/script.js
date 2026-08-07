// client/script.js
// Day 3: confirms the frontend can reach the backend's health check route.
// Real fetch/localStorage logic for features will be added starting Day 4.

const BACKEND_URL = "http://localhost:5000";

async function checkBackendHealth() {
  const statusEl = document.getElementById("backend-status");
  try {
    const response = await fetch(`${BACKEND_URL}/api/health`);
    const data = await response.json();
    if (data.status === "ok") {
      statusEl.textContent = "✅ Backend connected";
    } else {
      statusEl.textContent = "⚠️ Backend responded unexpectedly";
    }
  } catch (err) {
    statusEl.textContent = "❌ Backend not reachable — is the server running?";
    console.error("Health check failed:", err);
  }
}

checkBackendHealth();