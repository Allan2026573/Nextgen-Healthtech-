/* ==========================================================================
   NEXTGEN HEALTHTECH ACADEMY — AUTH-GUARD.JS
   --------------------------------------------------------------------------
   Included at the top of every page inside /app (the secure LMS area).
   Checks for a simulated session in localStorage; if none exists, the
   visitor is redirected straight to the public login page. This is the
   "secure, logged-in LMS area" boundary requested in the brief.

   In production, replace the localStorage check with a real server-side
   session/token check (e.g. verifying a JWT with your API) — this file is
   the single place that logic would need to change.
   ========================================================================== */

(function guardRoute() {
  const email = localStorage.getItem('nexgen_session');

  if (!email) {
    window.location.href = '../public/login.html';
    return;
  }

  // Expose the current user globally so dashboard.js / course.js / admin.js
  // don't each need to re-implement this lookup.
  const users = JSON.parse(localStorage.getItem('nexgen_users') || '[]');
  window.currentUser = users.find((u) => u.email === email) || {
    fullName: 'Demo User', email, profession: 'nurse',
  };
})();

document.addEventListener('DOMContentLoaded', () => {
  // Populate shared topbar (present on dashboard/course/admin)
  const nameEl = document.getElementById('topbarUserName');
  const roleEl = document.getElementById('topbarUserRole');
  const avatarEl = document.getElementById('topbarAvatar');

  if (window.currentUser) {
    const initials = window.currentUser.fullName
      .split(' ').map((p) => p[0]).slice(0, 2).join('').toUpperCase();
    if (nameEl) nameEl.textContent = window.currentUser.fullName;
    if (roleEl) roleEl.textContent = window.currentUser.profession || 'Learner';
    if (avatarEl) avatarEl.textContent = initials;
  }

  // Logout button (present in the sidebar on every secure page)
  document.getElementById('logoutBtn')?.addEventListener('click', () => {
    localStorage.removeItem('nexgen_session');
    window.location.href = '../public/login.html';
  });

  // Mobile sidebar toggle (present in the topbar on every secure page)
  document.getElementById('sidebarToggle')?.addEventListener('click', () => {
    document.querySelector('.app-shell')?.classList.toggle('sidebar-open');
  });
});
