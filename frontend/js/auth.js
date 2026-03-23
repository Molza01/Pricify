// ===== Auth Configuration =====
const API_BASE = "https://pricify-h7hk.onrender.com/api/auth";

// Redirect if already logged in
if (localStorage.getItem("pricify_token")) {
  window.location.href = "/";
}

// ===== Generate floating particles =====
(function createParticles() {
  const container = document.getElementById("particles");
  for (let i = 0; i < 40; i++) {
    const p = document.createElement("div");
    p.className = "particle";
    p.style.left = Math.random() * 100 + "%";
    p.style.animationDuration = (8 + Math.random() * 12) + "s";
    p.style.animationDelay = (Math.random() * 15) + "s";
    p.style.width = p.style.height = (2 + Math.random() * 3) + "px";
    p.style.opacity = (0.15 + Math.random() * 0.35);
    container.appendChild(p);
  }
})();

// ===== Tab Switching =====
function switchTab(tab) {
  const loginTab = document.getElementById("loginTab");
  const signupTab = document.getElementById("signupTab");
  const loginForm = document.getElementById("loginForm");
  const signupForm = document.getElementById("signupForm");
  const indicator = document.getElementById("tabIndicator");

  // Clear errors
  document.getElementById("loginError").classList.add("hidden");
  document.getElementById("signupError").classList.add("hidden");

  if (tab === "login") {
    loginTab.classList.add("active");
    signupTab.classList.remove("active");
    loginForm.classList.remove("hidden");
    signupForm.classList.add("hidden");
    indicator.classList.remove("right");
  } else {
    signupTab.classList.add("active");
    loginTab.classList.remove("active");
    signupForm.classList.remove("hidden");
    loginForm.classList.add("hidden");
    indicator.classList.add("right");
  }
}

// ===== Toggle Password Visibility =====
function togglePassword(inputId, btn) {
  const input = document.getElementById(inputId);
  if (input.type === "password") {
    input.type = "text";
    btn.querySelector(".eye-icon").innerHTML = "&#128064;";
  } else {
    input.type = "password";
    btn.querySelector(".eye-icon").innerHTML = "&#128065;";
  }
}

// ===== Show Error =====
function showError(elementId, message) {
  const el = document.getElementById(elementId);
  el.textContent = message;
  el.classList.remove("hidden");
}

// ===== Set Loading State =====
function setLoading(btnId, loading) {
  const btn = document.getElementById(btnId);
  if (loading) {
    btn.classList.add("loading");
    btn.disabled = true;
  } else {
    btn.classList.remove("loading");
    btn.disabled = false;
  }
}

// ===== Handle Login =====
async function handleLogin(e) {
  e.preventDefault();
  document.getElementById("loginError").classList.add("hidden");

  const email = document.getElementById("loginEmail").value.trim();
  const password = document.getElementById("loginPassword").value;

  if (!email || !password) {
    showError("loginError", "Please fill in all fields.");
    return;
  }

  setLoading("loginBtn", true);

  try {
    const res = await fetch(`${API_BASE}/login`, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ email, password }),
    });

    const data = await res.json();

    if (!res.ok) {
      showError("loginError", data.error || "Login failed. Please try again.");
      setLoading("loginBtn", false);
      return;
    }

    // Save token and user data
    localStorage.setItem("pricify_token", data.token);
    localStorage.setItem("pricify_user", JSON.stringify(data.user));

    // Show success then redirect
    showSuccess("Welcome back, " + data.user.fullName + "!");
  } catch (err) {
    showError("loginError", "Network error. Please check your connection.");
    setLoading("loginBtn", false);
  }
}

// ===== Handle Signup =====
async function handleSignup(e) {
  e.preventDefault();
  document.getElementById("signupError").classList.add("hidden");

  const fullName = document.getElementById("signupName").value.trim();
  const email = document.getElementById("signupEmail").value.trim();
  const shopName = document.getElementById("signupShop").value.trim();
  const password = document.getElementById("signupPassword").value;
  const confirm = document.getElementById("signupConfirm").value;

  if (!fullName || !email || !password) {
    showError("signupError", "Please fill in all required fields.");
    return;
  }

  if (password.length < 6) {
    showError("signupError", "Password must be at least 6 characters.");
    return;
  }

  if (password !== confirm) {
    showError("signupError", "Passwords do not match.");
    return;
  }

  setLoading("signupBtn", true);

  try {
    const res = await fetch(`${API_BASE}/signup`, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ fullName, email, password, shopName }),
    });

    const data = await res.json();

    if (!res.ok) {
      showError("signupError", data.error || "Signup failed. Please try again.");
      setLoading("signupBtn", false);
      return;
    }

    // Save token and user data
    localStorage.setItem("pricify_token", data.token);
    localStorage.setItem("pricify_user", JSON.stringify(data.user));

    // Show success then redirect
    showSuccess("Account created! Welcome, " + data.user.fullName + "!");
  } catch (err) {
    showError("signupError", "Network error. Please check your connection.");
    setLoading("signupBtn", false);
  }
}

// ===== Success Animation & Redirect =====
function showSuccess(message) {
  const card = document.querySelector(".glass-card");
  const formsHTML = card.innerHTML;

  // Keep water effect, replace form content
  card.innerHTML = `
    <div class="auth-logo">
      <span class="logo-icon">&#9878;</span>
      <span class="logo-text">Pricify</span>
    </div>
    <div class="auth-success">
      <div class="success-checkmark">&#10003;</div>
      <p class="success-text">${message}</p>
      <p class="success-sub">Redirecting to dashboard...</p>
    </div>
    <div class="water-effect">
      <div class="water-wave wave-1"></div>
      <div class="water-wave wave-2"></div>
      <div class="water-wave wave-3"></div>
    </div>
  `;

  setTimeout(() => {
    window.location.href = "/";
  }, 1500);
}
