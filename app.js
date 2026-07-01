const sessionKey = "mabl-demo-user";

function formatPhone(value) {
  const digits = value.replace(/\D/g, "").slice(0, 10);
  if (digits.length <= 3) return digits;
  if (digits.length <= 6) return `(${digits.slice(0, 3)}) ${digits.slice(3)}`;
  return `(${digits.slice(0, 3)}) ${digits.slice(3, 6)}-${digits.slice(6)}`;
}

function formatState(value) {
  return value.trim().toUpperCase().slice(0, 2);
}

function maskSsn(value) {
  return `***-**-${value.slice(0, 4)}`;
}

function getUserData() {
  try {
    return JSON.parse(sessionStorage.getItem(sessionKey) || "null");
  } catch {
    return null;
  }
}

function saveUserData(data) {
  sessionStorage.setItem(sessionKey, JSON.stringify(data));
}

function launchConfetti() {
  const layer = document.createElement("div");
  layer.className = "confetti-layer";

  const colors = ["#0f766e", "#115e59", "#d97706", "#ef4444", "#f59e0b", "#2563eb"];
  const pieceCount = 64;

  for (let index = 0; index < pieceCount; index += 1) {
    const piece = document.createElement("span");
    const size = 8 + Math.random() * 8;
    const left = Math.random() * 100;
    const delay = Math.random() * 500;
    const duration = 2200 + Math.random() * 1400;

    piece.className = "confetti-piece";
    piece.style.left = `${left}vw`;
    piece.style.width = `${size}px`;
    piece.style.height = `${size * (0.45 + Math.random() * 0.7)}px`;
    piece.style.background = colors[index % colors.length];
    piece.style.animationDelay = `${delay}ms`;
    piece.style.animationDuration = `${duration}ms`;
    piece.style.setProperty("--spin", `${720 + Math.random() * 1080}deg`);
    piece.style.setProperty("--drift", `${-40 + Math.random() * 80}vw`);
    layer.appendChild(piece);
  }

  document.body.appendChild(layer);
  window.setTimeout(() => layer.remove(), 4200);
}

function setupFormPage() {
  const form = document.getElementById("intake-form");
  if (!form) return;

  const error = document.getElementById("form-error");

  form.addEventListener("submit", (event) => {
    event.preventDefault();

    const formData = new FormData(form);
    const firstName = String(formData.get("firstName") || "").trim();
    const lastName = String(formData.get("lastName") || "").trim();
    const email = String(formData.get("email") || "").trim();
    const phone = formatPhone(String(formData.get("phone") || ""));
    const ssnLast4 = String(formData.get("ssnLast4") || "").replace(/\D/g, "").slice(0, 4);
    const address = String(formData.get("address") || "").trim();
    const city = String(formData.get("city") || "").trim();
    const state = formatState(String(formData.get("state") || ""));

    const invalidFields = [firstName, lastName, email, phone, ssnLast4, address, city, state].some((value) => !value);
    if (invalidFields || ssnLast4.length !== 4) {
      error.textContent = "Please fill in every field, including a 4-digit SSN last-4.";
      return;
    }

    saveUserData({
      firstName,
      lastName,
      email,
      phone,
      ssnLast4: maskSsn(ssnLast4),
      address,
      city,
      state,
    });

    window.location.href = "dashboard.html";
  });
}

function setupDashboardPage() {
  const welcomeCopy = document.getElementById("welcome-copy");
  const details = document.getElementById("user-details");
  const fullName = document.getElementById("full-name");
  const email = document.getElementById("email");
  const phone = document.getElementById("phone");
  const address = document.getElementById("address");

  if (!welcomeCopy || !details || !fullName || !email || !phone || !address) return;

  const user = getUserData();

  if (!user) {
    welcomeCopy.textContent = "No active session was found. Return to the form to continue.";
    return;
  }

  welcomeCopy.textContent = `Welcome back, ${user.firstName}. Your session is active.`;
  fullName.textContent = `${user.firstName} ${user.lastName}`;
  email.textContent = user.email;
  phone.textContent = user.phone;
  address.textContent = `${user.address}, ${user.city}, ${user.state}`;
  details.hidden = false;
  launchConfetti();
}

setupFormPage();
setupDashboardPage();