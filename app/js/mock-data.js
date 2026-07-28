/* ==========================================================================
   NEXTGEN HEALTHTECH ACADEMY — MOCK-DATA.JS
   --------------------------------------------------------------------------
   Centralised fake dataset standing in for a real backend/API. Every LMS
   page (dashboard, course, admin) reads from this single source so the
   whole prototype stays consistent. When a real backend exists, replace
   the exported objects below with fetch() calls to your API and the rest
   of the app's rendering code should need little to no change.
   ========================================================================== */

const COURSES = [
  {
    id: 'ai-healthcare',
    title: 'Artificial Intelligence in Healthcare',
    icon: '🧠',
    levels: {
      beginner: {
        cpd: 6,
        modules: [
          { id: 'ai-b-1', title: 'What Is AI? Demystifying the Basics', duration: '18 min' },
          { id: 'ai-b-2', title: 'AI Already in Your Workplace', duration: '22 min' },
          { id: 'ai-b-3', title: '5 Free AI Tools You Can Use Today', duration: '26 min' },
          { id: 'ai-b-4', title: 'Ethics, Privacy & Safety', duration: '20 min' },
        ],
      },
    },
  },
  {
    id: 'digital-skills',
    title: 'Digital Skills for Healthcare Workers',
    icon: '💻',
    levels: {
      beginner: {
        cpd: 4,
        modules: [
          { id: 'ds-b-1', title: 'Computer & Internet Essentials', duration: '15 min' },
          { id: 'ds-b-2', title: 'Introduction to Electronic Health Records', duration: '24 min' },
          { id: 'ds-b-3', title: 'Cybersecurity Essentials', duration: '18 min' },
        ],
      },
    },
  },
  {
    id: 'data-analysis',
    title: 'Data Analysis in Healthcare',
    icon: '📊',
    levels: {
      beginner: {
        cpd: 4,
        modules: [
          { id: 'da-b-1', title: 'Data Literacy Fundamentals', duration: '20 min' },
          { id: 'da-b-2', title: 'Excel & Sheets for Health Data', duration: '28 min' },
          { id: 'da-b-3', title: 'Building Your First Dashboard', duration: '24 min' },
        ],
      },
    },
  },
];

// Certificates the demo user has already earned + one still in progress
const CERTIFICATES = [
  { courseTitle: 'Digital Skills for Healthcare Workers', level: 'Beginner', dateEarned: '2026-05-12', cpd: 4, locked: false },
  { courseTitle: 'Artificial Intelligence in Healthcare', level: 'Beginner', dateEarned: null, cpd: 6, locked: true },
];

// Admin-side analytics snapshot
const ADMIN_STATS = {
  activeStudents: 342,
  totalEnrollments: 517,
  certificatesIssued: 128,
  avgCompletion: 68,
};

// Admin-side user directory
const ADMIN_USERS = [
  { name: 'Tendai Moyo', email: 'tendai.moyo@example.com', profession: 'Nurse', status: 'active', enrolled: 2 },
  { name: 'Rudo Chikwanda', email: 'rudo.c@example.com', profession: 'Clinician', status: 'active', enrolled: 1 },
  { name: 'Farai Sithole', email: 'farai.s@example.com', profession: 'Hospital Administrator', status: 'pending', enrolled: 1 },
  { name: 'Chipo Marimo', email: 'chipo.m@example.com', profession: 'Community Health Worker', status: 'active', enrolled: 3 },
  { name: 'Simbarashe Gumbo', email: 'simba.g@example.com', profession: 'Pharmacist', status: 'active', enrolled: 1 },
];

function initials(name) {
  return name.split(' ').map((p) => p[0]).slice(0, 2).join('').toUpperCase();
}
