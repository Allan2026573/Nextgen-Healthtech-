/* ==========================================================================
   COURSE.JS — curriculum sidebar rendering, module completion tracking,
   collapsible sidebar, resource/quiz tabs, and simple quiz interaction.
   ========================================================================== */

document.addEventListener('DOMContentLoaded', () => {

  const course = COURSES.find((c) => c.id === 'ai-healthcare');
  const modules = course.levels.beginner.modules;

  // Track which modules are complete in localStorage so progress survives
  // a page reload (still a frontend simulation — see mock-data.js note).
  const PROGRESS_KEY = 'nexgen_course_progress_ai-healthcare';
  let completed = JSON.parse(localStorage.getItem(PROGRESS_KEY) || '["ai-b-1"]');
  let activeModuleId = modules[0].id;

  function render() {
    const listEl = document.getElementById('moduleList');
    listEl.innerHTML = modules.map((m, i) => `
      <div class="module-item ${completed.includes(m.id) ? 'is-complete' : ''} ${m.id === activeModuleId ? 'is-active' : ''}" data-id="${m.id}">
        <span class="module-item__check">✓</span>
        <span>${i + 1}. ${m.title}</span>
        <span class="module-item__duration">${m.duration}</span>
      </div>
    `).join('');

    // Progress bar + label
    const pct = Math.round((completed.length / modules.length) * 100);
    document.getElementById('courseProgressFill').style.width = pct + '%';
    document.getElementById('courseProgressLabel').textContent = `${completed.length} of ${modules.length} modules complete`;

    // Wire click handlers each render (list is rebuilt each time)
    listEl.querySelectorAll('.module-item').forEach((item) => {
      item.addEventListener('click', () => setActiveModule(item.dataset.id));
    });
  }

  function setActiveModule(id) {
    activeModuleId = id;
    const mod = modules.find((m) => m.id === id);
    const idx = modules.findIndex((m) => m.id === id);

    document.getElementById('lessonTitle').textContent = mod.title;
    document.getElementById('currentModuleCaption').textContent = `Module ${idx + 1} · ${mod.title}`;
    document.querySelector('.lesson-header .meta span').textContent = `⏱ ${mod.duration}`;

    render();
  }

  // Clicking the video "play" button marks the active module complete —
  // a simple stand-in for "watched to completion" tracking.
  document.getElementById('videoPlayer').addEventListener('click', () => {
    if (!completed.includes(activeModuleId)) {
      completed.push(activeModuleId);
      localStorage.setItem(PROGRESS_KEY, JSON.stringify(completed));
      render();
    }
  });

  render();

  /* ---- Collapsible sidebar ------------------------------------------------ */
  document.getElementById('sidebarCollapseBtn').addEventListener('click', () => {
    document.getElementById('curriculumSidebar').classList.toggle('is-collapsed');
  });

  /* ---- Resources / Quiz tabs ----------------------------------------------- */
  document.querySelectorAll('.learn-tab').forEach((tab) => {
    tab.addEventListener('click', () => {
      document.querySelectorAll('.learn-tab').forEach((t) => t.classList.remove('is-active'));
      document.querySelectorAll('.learn-tab-panel').forEach((p) => p.classList.remove('is-active'));
      tab.classList.add('is-active');
      document.querySelector(`.learn-tab-panel[data-tab="${tab.dataset.tab}"]`).classList.add('is-active');
    });
  });

  /* ---- Quiz interaction ------------------------------------------------------ */
  document.querySelectorAll('.quiz-options').forEach((group) => {
    const correctIndex = Number(group.dataset.correct);
    const options = group.querySelectorAll('.quiz-option');
    const feedback = group.parentElement.querySelector('.quiz-feedback');

    options.forEach((opt, i) => {
      opt.addEventListener('click', () => {
        options.forEach((o) => o.classList.remove('is-correct', 'is-incorrect'));
        if (i === correctIndex) {
          opt.classList.add('is-correct');
          feedback.textContent = '✓ Correct! Well done.';
          feedback.className = 'quiz-feedback is-visible correct';
        } else {
          opt.classList.add('is-incorrect');
          options[correctIndex].classList.add('is-correct');
          feedback.textContent = '✗ Not quite — the correct answer is highlighted above.';
          feedback.className = 'quiz-feedback is-visible incorrect';
        }
      });
    });
  });

});
