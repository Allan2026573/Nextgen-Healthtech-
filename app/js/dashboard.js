/* ==========================================================================
   DASHBOARD.JS — renders enrolled course progress + certificates panel
   Reads from COURSES / CERTIFICATES in mock-data.js and window.currentUser
   set by auth-guard.js.
   ========================================================================== */

document.addEventListener('DOMContentLoaded', () => {

  // Personalise the welcome heading
  const firstName = (window.currentUser?.fullName || 'there').split(' ')[0];
  const heading = document.getElementById('welcomeHeading');
  if (heading) heading.textContent = `Welcome back, ${firstName}!`;

  /* ---- Enrolled courses + progress -------------------------------------- */
  const enrollments = window.currentUser?.enrollments || [
    { courseId: 'ai-healthcare', level: 'beginner', progress: 25 },
  ];

  const listEl = document.getElementById('enrolledCoursesList');
  if (listEl) {
    listEl.innerHTML = enrollments.map((enr) => {
      const course = COURSES.find((c) => c.id === enr.courseId) || COURSES[0];
      const pct = enr.progress ?? 0;
      return `
        <div class="enrolled-course">
          <div class="enrolled-course__icon">${course.icon}</div>
          <div class="enrolled-course__body">
            <div class="enrolled-course__top">
              <h4>${course.title}</h4>
              <span class="enrolled-course__pct">${pct}%</span>
            </div>
            <div class="progress-track"><div class="progress-fill" style="width:${pct}%;"></div></div>
          </div>
          <a href="course.html" class="btn btn-ghost btn-sm">Resume</a>
        </div>`;
    }).join('');
  }

  /* ---- Certificates panel ------------------------------------------------ */
  const certList = document.getElementById('certificatesList');
  if (certList) {
    if (CERTIFICATES.length === 0) {
      certList.innerHTML = `<div class="cert-empty">Complete a course to earn your first certificate.</div>`;
    } else {
      certList.innerHTML = CERTIFICATES.map((cert) => {
        if (cert.locked) {
          return `
            <div class="cert-card cert-card__locked">
              <div class="cert-card__seal">🔒</div>
              <div class="cert-card__body">
                <h4>${cert.courseTitle}</h4>
                <span>${cert.level} · In Progress</span>
              </div>
            </div>`;
        }
        return `
          <div class="cert-card">
            <div class="cert-card__seal">🎓</div>
            <div class="cert-card__body">
              <h4>${cert.courseTitle}</h4>
              <span>${cert.level} · Earned ${new Date(cert.dateEarned).toLocaleDateString('en-GB', { day: 'numeric', month: 'short', year: 'numeric' })} · ${cert.cpd} CPD</span>
            </div>
            <button class="btn btn-ghost btn-sm" onclick="alert('Simulated download: ${cert.courseTitle.replace(/'/g, "")}-Certificate.pdf')">Download</button>
          </div>`;
      }).join('');
    }
  }

});
