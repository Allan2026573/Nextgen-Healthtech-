/* ==========================================================================
   ADMIN.JS — analytics tiles, user table, course management grid, and the
   Add/Edit Course modal interface.
   ========================================================================== */

document.addEventListener('DOMContentLoaded', () => {

  /* ---- Analytics tiles ---------------------------------------------------- */
  document.getElementById('statActiveStudents').textContent = ADMIN_STATS.activeStudents;
  document.getElementById('statEnrollments').textContent = ADMIN_STATS.totalEnrollments;
  document.getElementById('statCertificates').textContent = ADMIN_STATS.certificatesIssued;
  document.getElementById('statCompletion').textContent = ADMIN_STATS.avgCompletion + '%';

  /* ---- Admin tabs (Users / Courses) ---------------------------------------- */
  document.querySelectorAll('.admin-tab').forEach((tab) => {
    tab.addEventListener('click', () => {
      document.querySelectorAll('.admin-tab').forEach((t) => t.classList.remove('is-active'));
      document.querySelectorAll('.admin-panel').forEach((p) => p.classList.remove('is-active'));
      tab.classList.add('is-active');
      document.querySelector(`.admin-panel[data-panel="${tab.dataset.panel}"]`).classList.add('is-active');
    });
  });

  /* ---- Users table ---------------------------------------------------------- */
  const tbody = document.getElementById('usersTableBody');
  tbody.innerHTML = ADMIN_USERS.map((u) => `
    <tr>
      <td>
        <div class="user-cell">
          <div class="user-cell__avatar">${initials(u.name)}</div>
          <div>
            <div class="user-cell__name">${u.name}</div>
            <div class="user-cell__email">${u.email}</div>
          </div>
        </div>
      </td>
      <td>${u.profession}</td>
      <td>${u.enrolled} course${u.enrolled !== 1 ? 's' : ''}</td>
      <td><span class="status-pill ${u.status}">${u.status === 'active' ? 'Active' : 'Pending'}</span></td>
      <td>
        <a href="#" class="table-action" onclick="event.preventDefault(); alert('View profile: ${u.name}')">View</a>
        <a href="#" class="table-action" onclick="event.preventDefault(); alert('Message sent to ${u.name}')">Message</a>
      </td>
    </tr>
  `).join('');

  /* ---- Course management grid ------------------------------------------------ */
  // Flatten COURSES + their single "beginner" level (from mock-data.js) into
  // simple cards. In a real backend this would list every level per course.
  function renderCourseGrid() {
    const grid = document.getElementById('adminCourseGrid');
    grid.innerHTML = COURSES.map((c) => `
      <div class="admin-course-card">
        <h4>${c.icon} ${c.title}</h4>
        <p>${c.levels.beginner.modules.length} modules · Beginner level live</p>
        <div class="admin-course-card__meta">
          <span>${c.levels.beginner.cpd} CPD points</span>
          <span>342 enrolled</span>
        </div>
        <div class="admin-course-card__actions">
          <button class="btn btn-ghost btn-sm" onclick="openCourseModal('${c.title.replace(/'/g, "\\'")}')">Edit</button>
          <button class="btn btn-ghost btn-sm" onclick="alert('Simulated: ${c.title} archived')">Archive</button>
        </div>
      </div>
    `).join('');
  }
  renderCourseGrid();

  /* ---- Add/Edit Course modal --------------------------------------------------- */
  const overlay = document.getElementById('courseModalOverlay');
  const modalTitle = document.getElementById('modalTitle');
  const form = document.getElementById('courseForm');

  window.openCourseModal = function (existingTitle) {
    modalTitle.textContent = existingTitle ? 'Edit Course' : 'Add New Course';
    document.getElementById('courseTitleInput').value = existingTitle || '';
    document.getElementById('courseCpdInput').value = existingTitle ? 6 : '';
    overlay.classList.add('is-open');
  };

  function closeModal() { overlay.classList.remove('is-open'); form.reset(); }

  document.getElementById('addCourseBtn').addEventListener('click', () => openCourseModal(null));
  document.getElementById('modalCloseBtn').addEventListener('click', closeModal);
  document.getElementById('modalCancelBtn').addEventListener('click', closeModal);
  overlay.addEventListener('click', (e) => { if (e.target === overlay) closeModal(); });

  form.addEventListener('submit', (e) => {
    e.preventDefault();
    const title = document.getElementById('courseTitleInput').value.trim();
    closeModal();
    showToast(`"${title}" saved successfully.`);
    // A real implementation would POST/PUT to the backend here, then
    // refresh COURSES from the API response before re-rendering the grid.
  });

  /* ---- Toast helper --------------------------------------------------------------*/
  function showToast(message) {
    const toast = document.getElementById('toast');
    document.getElementById('toastMessage').textContent = message;
    toast.classList.add('is-visible');
    setTimeout(() => toast.classList.remove('is-visible'), 3000);
  }

});
