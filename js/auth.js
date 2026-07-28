/* ==========================================================================
   NEXTGEN HEALTHTECH ACADEMY — AUTH.JS
   --------------------------------------------------------------------------
   This file powers login.html, signup.html, and forgot-password.html.
   It detects which form is present on the current page and wires up only
   that one, so a single script file can serve all three auth pages.

   IMPORTANT — THIS IS A FRONTEND SIMULATION:
   There is no real backend here. "Accounts" are stored in the browser's
   localStorage purely so the demo flow (Sign Up → Login → Dashboard) works
   end-to-end without a server. Replace the functions in the "SIMULATED
   BACKEND" section below with real fetch() calls to your API when you
   connect this to an actual backend.
   ========================================================================== */

/* ============================ SIMULATED BACKEND ========================= */

const DB_KEY = 'nexgen_users';          // localStorage key: array of user records
const SESSION_KEY = 'nexgen_session';   // localStorage key: currently logged-in user's email

function getUsers() {
  return JSON.parse(localStorage.getItem(DB_KEY) || '[]');
}

function saveUsers(users) {
  localStorage.setItem(DB_KEY, JSON.stringify(users));
}

function findUserByEmail(email) {
  return getUsers().find((u) => u.email.toLowerCase() === email.toLowerCase());
}

function createUser({ fullName, email, profession, password }) {
  const users = getUsers();
  const newUser = {
    fullName,
    email,
    profession,
    password, // NOTE: plaintext for demo only — never store real passwords client-side
    createdAt: new Date().toISOString(),
    enrollments: [
      { courseId: 'ai-healthcare', level: 'beginner', progress: 0 },
    ],
  };
  users.push(newUser);
  saveUsers(users);
  return newUser;
}

function startSession(email) {
  localStorage.setItem(SESSION_KEY, email);
}

/* ============================ VALIDATION HELPERS ========================= */

const EMAIL_RE = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;

function showFieldError(fieldId, show) {
  document.getElementById(fieldId)?.classList.toggle('has-error', show);
}

function showAlert(containerId, message, type = 'error') {
  const container = document.getElementById(containerId);
  if (!container) return;
  container.innerHTML = `<div class="alert alert-${type}">${message}</div>`;
}

function clearAlert(containerId) {
  const container = document.getElementById(containerId);
  if (container) container.innerHTML = '';
}

/* ============================ SIGN UP PAGE ================================ */

const signupForm = document.getElementById('signupForm');
if (signupForm) {

  const pwInput = document.getElementById('password');
  const pwMeter = document.getElementById('pwMeter');

  // Live password-strength meter
  pwInput?.addEventListener('input', () => {
    const val = pwInput.value;
    let strength = 0;
    if (val.length >= 8) strength++;
    if (/[A-Z]/.test(val) && /[a-z]/.test(val)) strength++;
    if (/\d/.test(val)) strength++;
    if (/[^A-Za-z0-9]/.test(val)) strength++;
    pwMeter?.setAttribute('data-strength', String(strength));
  });

  signupForm.addEventListener('submit', (e) => {
    e.preventDefault();
    clearAlert('signupAlert');

    const fullName = document.getElementById('fullName').value.trim();
    const email = document.getElementById('email').value.trim();
    const profession = document.getElementById('profession').value;
    const password = document.getElementById('password').value;
    const confirmPassword = document.getElementById('confirmPassword').value;

    let valid = true;

    showFieldError('fieldName', fullName.length < 2);
    if (fullName.length < 2) valid = false;

    const emailValid = EMAIL_RE.test(email);
    showFieldError('fieldEmail', !emailValid);
    if (!emailValid) valid = false;

    showFieldError('fieldProfession', !profession);
    if (!profession) valid = false;

    const pwValid = password.length >= 8;
    showFieldError('fieldPassword', !pwValid);
    if (!pwValid) valid = false;

    const matchValid = password === confirmPassword && confirmPassword.length > 0;
    showFieldError('fieldConfirm', !matchValid);
    if (!matchValid) valid = false;

    if (!valid) return;

    if (findUserByEmail(email)) {
      showAlert('signupAlert', 'An account with this email already exists. Try logging in instead.');
      return;
    }

    // Create the account, start a session, then route into the LMS —
    // this is the "signup form → dashboard" journey requested in the brief.
    createUser({ fullName, email, profession, password });
    startSession(email);

    showAlert('signupAlert', 'Account created! Redirecting to your dashboard…', 'success');
    document.getElementById('signupSubmit').textContent = 'Redirecting…';
    document.getElementById('signupSubmit').disabled = true;

    setTimeout(() => {
      window.location.href = '../app/dashboard.html';
    }, 900);
  });
}

/* ============================ LOGIN PAGE =================================== */

const loginForm = document.getElementById('loginForm');
if (loginForm) {

  loginForm.addEventListener('submit', (e) => {
    e.preventDefault();
    clearAlert('loginAlert');

    const email = document.getElementById('email').value.trim();
    const password = document.getElementById('password').value;

    let valid = true;
    const emailValid = EMAIL_RE.test(email);
    showFieldError('fieldEmail', !emailValid);
    if (!emailValid) valid = false;

    showFieldError('fieldPassword', password.length === 0);
    if (password.length === 0) valid = false;

    if (!valid) return;

    const user = findUserByEmail(email);

    if (!user || user.password !== password) {
      showAlert('loginAlert', 'Incorrect email or password. Please try again.');
      return;
    }

    startSession(email);
    showAlert('loginAlert', 'Login successful! Redirecting…', 'success');
    document.getElementById('loginSubmit').textContent = 'Redirecting…';
    document.getElementById('loginSubmit').disabled = true;

    setTimeout(() => {
      window.location.href = '../app/dashboard.html';
    }, 700);
  });

  // Convenience for reviewers: if no accounts exist yet, seed one demo
  // account so the login page is testable without visiting signup first.
  if (getUsers().length === 0) {
    createUser({
      fullName: 'Tendai Moyo',
      email: 'demo@nextgenhta.co.zw',
      profession: 'nurse',
      password: 'password123',
    });
  }
}

/* ============================ FORGOT PASSWORD PAGE ========================= */

const forgotForm = document.getElementById('forgotForm');
if (forgotForm) {

  forgotForm.addEventListener('submit', (e) => {
    e.preventDefault();
    clearAlert('forgotAlert');

    const email = document.getElementById('email').value.trim();
    const emailValid = EMAIL_RE.test(email);
    showFieldError('fieldEmail', !emailValid);
    if (!emailValid) return;

    // Simulated request — in production this calls your backend's
    // password-reset endpoint. We deliberately show the same success
    // message whether or not the account exists, to avoid leaking which
    // emails are registered.
    document.getElementById('successEmail').textContent = email;
    document.getElementById('requestState').style.display = 'none';
    document.getElementById('successState').style.display = 'block';
  });
}
