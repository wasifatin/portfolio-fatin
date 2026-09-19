// ===== FATIN SHARHAD PORTFOLIO — script.js =====

// Navbar scroll effect
const navbar = document.getElementById('navbar');
window.addEventListener('scroll', () => {
  if (window.scrollY > 50) navbar.classList.add('scrolled');
  else navbar.classList.remove('scrolled');
});

// Active nav link on scroll
const sections = document.querySelectorAll('section[id]');
const navLinks = document.querySelectorAll('.nav-link');
window.addEventListener('scroll', () => {
  let current = '';
  sections.forEach(s => {
    if (window.scrollY >= s.offsetTop - 120) current = s.getAttribute('id');
  });
  navLinks.forEach(l => {
    l.classList.remove('active');
    if (l.getAttribute('href') === '#' + current) l.classList.add('active');
  });
});

// Mobile nav toggle
const navToggle = document.getElementById('navToggle');
const navLinksList = document.getElementById('navLinks');
navToggle.addEventListener('click', () => {
  navLinksList.classList.toggle('open');
});
document.querySelectorAll('.nav-link').forEach(l => {
  l.addEventListener('click', () => navLinksList.classList.remove('open'));
});

// Typed text effect
const phrases = [
  'AI & ML Enthusiast',
  'Problem Solver',
  'Competitive Programmer',
  'Future ML Engineer',
  'DSA Learner'
];
let phraseIdx = 0, charIdx = 0, isDeleting = false;
const typedEl = document.getElementById('typedText');
function typeEffect() {
  const phrase = phrases[phraseIdx];
  if (isDeleting) {
    typedEl.textContent = phrase.substring(0, charIdx--);
    if (charIdx < 0) { isDeleting = false; phraseIdx = (phraseIdx + 1) % phrases.length; setTimeout(typeEffect, 500); return; }
    setTimeout(typeEffect, 50);
  } else {
    typedEl.textContent = phrase.substring(0, charIdx++);
    if (charIdx > phrase.length) { isDeleting = true; setTimeout(typeEffect, 1800); return; }
    setTimeout(typeEffect, 80);
  }
}
typeEffect();

// Scroll reveal
const revealEls = document.querySelectorAll('.glass-card, .section-title, .section-subtitle, .section-label, .hero-badge, .about-text p, .stat-card, .roadmap-item, .cp-philosophy');
const observer = new IntersectionObserver((entries) => {
  entries.forEach((e, i) => {
    if (e.isIntersecting) {
      setTimeout(() => e.target.classList.add('visible'), i * 60);
      observer.unobserve(e.target);
    }
  });
}, { threshold: 0.1, rootMargin: '0px 0px -60px 0px' });
revealEls.forEach(el => { el.classList.add('reveal'); observer.observe(el); });

// Particle canvas
const canvas = document.getElementById('particleCanvas');
const ctx = canvas.getContext('2d');
let particles = [];

function resizeCanvas() {
  canvas.width = window.innerWidth;
  canvas.height = document.getElementById('hero').offsetHeight;
}
resizeCanvas();
window.addEventListener('resize', resizeCanvas);

function createParticle() {
  return {
    x: Math.random() * canvas.width,
    y: Math.random() * canvas.height,
    size: Math.random() * 1.5 + 0.3,
    speedX: (Math.random() - 0.5) * 0.4,
    speedY: (Math.random() - 0.5) * 0.4,
    opacity: Math.random() * 0.4 + 0.1,
    color: Math.random() > 0.5 ? '26,140,255' : '139,92,246'
  };
}

for (let i = 0; i < 120; i++) particles.push(createParticle());

function animateParticles() {
  ctx.clearRect(0, 0, canvas.width, canvas.height);
  particles.forEach(p => {
    p.x += p.speedX;
    p.y += p.speedY;
    if (p.x < 0 || p.x > canvas.width) p.speedX *= -1;
    if (p.y < 0 || p.y > canvas.height) p.speedY *= -1;
    ctx.beginPath();
    ctx.arc(p.x, p.y, p.size, 0, Math.PI * 2);
    ctx.fillStyle = `rgba(${p.color},${p.opacity})`;
    ctx.fill();
  });
  // Draw connections
  for (let i = 0; i < particles.length; i++) {
    for (let j = i + 1; j < particles.length; j++) {
      const dx = particles[i].x - particles[j].x;
      const dy = particles[i].y - particles[j].y;
      const dist = Math.sqrt(dx * dx + dy * dy);
      if (dist < 100) {
        ctx.beginPath();
        ctx.moveTo(particles[i].x, particles[i].y);
        ctx.lineTo(particles[j].x, particles[j].y);
        ctx.strokeStyle = `rgba(26,140,255,${0.06 * (1 - dist / 100)})`;
        ctx.lineWidth = 0.5;
        ctx.stroke();
      }
    }
  }
  requestAnimationFrame(animateParticles);
}
animateParticles();

// Resume download using jsPDF — multi-page support
// ★ PORTFOLIO URL — update this after deployment ★
const PORTFOLIO_URL = 'wasifatin.github.io';

function downloadResume() {
  const { jsPDF } = window.jspdf;
  const doc = new jsPDF({ orientation: 'portrait', unit: 'mm', format: 'a4' });
  const W = 210, H = 297, M = 18;
  const PAGE_TOP = 20;       // top margin on continuation pages
  const PAGE_BOTTOM = 280;   // start new page if y exceeds this
  let y = 0;
  let pageNum = 1;

  // Light-theme colors
  const PRIMARY   = [37, 99, 235];     // Vivid blue accent
  const NAVY      = [15, 23, 42];      // Dark navy for headings
  const BODY      = [51, 65, 85];      // Slate for body text
  const SUBTLE    = [100, 116, 139];   // Light slate for meta/labels
  const WHITE     = [255, 255, 255];
  const BG        = [248, 250, 252];   // Very light gray page bg
  const HEADER_BG = [241, 245, 249];   // Soft blue-gray header band
  const LINK      = [37, 99, 235];     // Blue for links
  const DIVIDER   = [226, 232, 240];   // Subtle divider line

  // Draw the light background on every page
  function drawPageBg() {
    doc.setFillColor(...BG);
    doc.rect(0, 0, W, H, 'F');
    // Thin accent line at top
    doc.setFillColor(...PRIMARY);
    doc.rect(0, 0, W, 2, 'F');
  }

  // Check if we need a new page; if so, add one and return the reset y
  function ensureSpace(needed) {
    if (y + needed > PAGE_BOTTOM) {
      addFooter();
      doc.addPage();
      pageNum++;
      drawPageBg();
      y = PAGE_TOP;
    }
  }

  // Footer on each page — includes portfolio link
  function addFooter() {
    doc.setDrawColor(...DIVIDER);
    doc.setLineWidth(0.3);
    doc.line(M, 289, W - M, 289);
    doc.setFont('helvetica', 'normal');
    doc.setFontSize(7);
    doc.setTextColor(...SUBTLE);
    doc.text('Fatin Sharhad  |  ' + PORTFOLIO_URL + '  |  github.com/wasifatin  |  linkedin.com/in/fatinsharhad', W / 2, 293, { align: 'center' });
  }

  // ===== PAGE 1 HEADER =====
  drawPageBg();

  // Header band — light
  doc.setFillColor(...HEADER_BG);
  doc.rect(0, 0, W, 62, 'F');
  doc.setFillColor(...PRIMARY);
  doc.rect(0, 0, W, 2.5, 'F');

  // Name
  y = 20;
  doc.setFont('helvetica', 'bold');
  doc.setFontSize(28);
  doc.setTextColor(...NAVY);
  doc.text('FATIN SHARHAD', M, y);

  // Tagline
  y += 10;
  doc.setFont('helvetica', 'normal');
  doc.setFontSize(11);
  doc.setTextColor(...PRIMARY);
  doc.text('CSE Undergraduate  |  AI & Machine Learning Enthusiast', M, y);

  // Contact row — includes portfolio link
  y += 8;
  doc.setFontSize(8);
  doc.setTextColor(...SUBTLE);
  doc.text(PORTFOLIO_URL + '   |   github.com/wasifatin   |   linkedin.com/in/fatinsharhad   |   CF: wasi.fatin', M, y);

  // Quote
  y += 7;
  doc.setFontSize(8);
  doc.setTextColor(...SUBTLE);
  doc.setFont('helvetica', 'italic');
  doc.text('"Quitters never win, and winners never quit."', M, y);

  // Separator after header
  y += 5;
  doc.setDrawColor(...DIVIDER);
  doc.setLineWidth(0.3);
  doc.line(M, y, W - M, y);

  y += 8;
  doc.setFont('helvetica', 'normal');

  // ===== HELPERS =====
  function sectionHeader(title) {
    ensureSpace(16);
    doc.setFillColor(...PRIMARY);
    doc.rect(M, y, 3, 5, 'F');
    doc.setFont('helvetica', 'bold');
    doc.setFontSize(11);
    doc.setTextColor(...PRIMARY);
    doc.text(title.toUpperCase(), M + 6, y + 4.2);
    doc.setDrawColor(...DIVIDER);
    doc.setLineWidth(0.2);
    doc.line(M + 6, y + 6, W - M, y + 6);
    y += 13;
  }

  function bodyText(text, maxW, color) {
    doc.setFont('helvetica', 'normal');
    doc.setFontSize(9);
    doc.setTextColor(...(color || BODY));
    const lines = doc.splitTextToSize(text, maxW || (W - M * 2));
    lines.forEach(line => {
      ensureSpace(5);
      doc.text(line, M, y);
      y += 4.2;
    });
  }

  function labelValue(label, val) {
    ensureSpace(7);
    doc.setFont('helvetica', 'bold');
    doc.setFontSize(9);
    doc.setTextColor(...NAVY);
    doc.text(label + ':', M, y);
    doc.setFont('helvetica', 'normal');
    doc.setTextColor(...BODY);
    const lines = doc.splitTextToSize(val, W - M * 2 - 30);
    doc.text(lines, M + 30, y);
    y += Math.max(lines.length * 4.2, 5.5);
  }

  // ===== ABOUT =====
  sectionHeader('About Me');
  bodyText("Computer Science and Engineering undergraduate at Daffodil International University, passionate about programming, problem-solving, and exploring Artificial Intelligence & Machine Learning. Currently in 2nd Year, 2nd Semester. Building a solid foundation in DSA, mathematics, and core CS concepts with the long-term goal of becoming a skilled Machine Learning Engineer.");
  y += 4;

  // ===== EDUCATION =====
  sectionHeader('Education');
  ensureSpace(18);
  doc.setFont('helvetica', 'bold');
  doc.setFontSize(10);
  doc.setTextColor(...NAVY);
  doc.text('Daffodil International University', M, y);
  y += 5;
  doc.setFont('helvetica', 'normal');
  doc.setFontSize(9);
  doc.setTextColor(...PRIMARY);
  doc.text('B.Sc. in Computer Science & Engineering', M, y);
  y += 5;
  doc.setTextColor(...BODY);
  doc.text('Department of CSE  |  2nd Year, 2nd Semester  |  Expected Graduation: April 2029', M, y);
  y += 8;

  // ===== SKILLS =====
  sectionHeader('Skills');
  labelValue('Programming', 'C, C++, Python, Java');
  labelValue('CS & DSA', 'Data Structures, Algorithms, OOP, Problem Solving, Competitive Programming');
  labelValue('Tools', 'VS Code, Code::Blocks, Git, GitHub, Apache NetBeans');
  labelValue('Fundamentals', 'Programming Fundamentals, Computer Fundamentals');
  y += 4;

  // ===== FEATURED PROJECT =====
  sectionHeader('Featured Project');
  ensureSpace(12);
  doc.setFont('helvetica', 'bold');
  doc.setFontSize(10);
  doc.setTextColor(...NAVY);
  doc.text('Land Management System', M, y);
  y += 5;
  doc.setFont('helvetica', 'normal');
  doc.setFontSize(8.5);
  doc.setTextColor(...PRIMARY);
  doc.text('C  |  Data Structures  |  Linked List  |  Stack  |  Queue', M, y);
  y += 6;
  bodyText('A C-based land management system developed to organize land records, calculate land taxes, and keep track of land-related transactions. Features a menu-driven interface with linked list, stack, and queue implementations.');
  y += 2;

  ensureSpace(8);
  doc.setFont('helvetica', 'normal');
  doc.setFontSize(8);
  doc.setTextColor(...NAVY);
  doc.text('Key Features:', M, y);
  y += 5;
  const features = [
    'Manage and organize land records',
    'Add, update, and view records',
    'Calculate land taxes automatically',
    'Track payments and transactions',
    'Maintain transaction history records',
    'Intuitive menu-driven interface'
  ];
  features.forEach(f => {
    ensureSpace(5);
    doc.setFont('helvetica', 'normal');
    doc.setFontSize(8.5);
    doc.setTextColor(...BODY);
    doc.text('•  ' + f, M + 3, y);
    y += 4.5;
  });
  y += 2;
  ensureSpace(5);
  doc.setTextColor(...LINK);
  doc.setFontSize(8.5);
  doc.text('GitHub: github.com/wasifatin/land-tax-management', M, y);
  y += 7;

  // ===== ACHIEVEMENTS =====
  sectionHeader('Achievements');
  const achiev = [
    ["Dean's List Award (2x Consecutive)", "Fall 2025 & Spring 2026 — Daffodil International University, Dept. of CSE. Recognized for outstanding academic performance in two consecutive semesters."],
    ["Take-Off Programming Contest", "Fall 2025 — DIU Programming Contest. Preliminary Round: 25th Position. Final Round: 100th Position. Demonstrated algorithmic problem-solving under time pressure."],
    ["DIU Mathematics Olympiad", "Summer 2025 — Participated in the Preliminary Round organized by DIUMS under the Faculty of Science & Information Technology, Daffodil International University."],
    ["Best Class Representative", "CCS Cultural Fest 2022 — Chittagong Collegiate School. Recognized as the Best Class Representative for outstanding active participation and contribution."]
  ];
  achiev.forEach(([title, detail]) => {
    ensureSpace(14);
    doc.setFont('helvetica', 'bold');
    doc.setFontSize(9.5);
    doc.setTextColor(...NAVY);
    doc.text('▸  ' + title, M, y);
    y += 5;
    bodyText(detail);
    y += 3;
  });

  // ===== EXPERIENCE =====
  sectionHeader('Leadership & Experience');
  const exp = [
    ['Class Representative — CSE 69_L', 'Daffodil International University', [
      'Share academic announcements and important updates with classmates',
      'Coordinate class-related information between students and faculty',
      'Communicate student concerns and feedback to appropriate authorities',
      'Assist with organizing academic and class activities',
      'Maintain smooth communication within the class'
    ]],
    ['Campus Ambassador — CCS Cultural Club', 'Chittagong Collegiate School', [
      'Promoted club events and activities across campus',
      'Encouraged student participation and engagement',
      'Communicated club initiatives to students',
      'Supported event-related activities',
      'Helped increase awareness of the club and its programs'
    ]]
  ];
  exp.forEach(([title, org, duties]) => {
    ensureSpace(16);
    doc.setFont('helvetica', 'bold');
    doc.setFontSize(10);
    doc.setTextColor(...NAVY);
    doc.text(title, M, y);
    y += 5;
    doc.setFont('helvetica', 'italic');
    doc.setFontSize(9);
    doc.setTextColor(...PRIMARY);
    doc.text(org, M, y);
    y += 6;
    duties.forEach(d => {
      ensureSpace(5);
      doc.setFont('helvetica', 'normal');
      doc.setFontSize(8.5);
      doc.setTextColor(...BODY);
      doc.text('•  ' + d, M + 3, y);
      y += 4.5;
    });
    y += 5;
  });

  // ===== COMPETITIVE PROGRAMMING =====
  sectionHeader('Competitive Programming');
  ensureSpace(10);
  doc.setFont('helvetica', 'bold');
  doc.setFontSize(9);
  doc.setTextColor(...NAVY);
  doc.text('Codeforces:', M, y);
  doc.setFont('helvetica', 'normal');
  doc.setTextColor(...PRIMARY);
  doc.text('wasi.fatin', M + 24, y);
  doc.setFont('helvetica', 'bold');
  doc.setTextColor(...NAVY);
  doc.text('Beecrowd:', M + 55, y);
  doc.setFont('helvetica', 'normal');
  doc.setTextColor(...PRIMARY);
  doc.text('wasifatin', M + 74, y);
  y += 6;
  bodyText('I enjoy competitive programming as a way to improve my problem-solving skills, algorithmic thinking, and ability to approach programming challenges efficiently. Every problem solved is a step toward becoming a better engineer.');
  y += 5;

  // ===== CERTIFICATIONS / LEARNING ROADMAP =====
  sectionHeader('Learning Roadmap');
  bodyText('Currently focusing on strengthening fundamentals through programming, projects, and continuous learning. Planned areas of focus:');
  y += 2;
  const roadmap = [
    'Deep-dive into Data Structures & Algorithms',
    'Python for Machine Learning & AI',
    'Mathematics for ML (Linear Algebra, Calculus, Probability)',
    'Hands-on ML projects & research'
  ];
  roadmap.forEach(item => {
    ensureSpace(5);
    doc.setFont('helvetica', 'normal');
    doc.setFontSize(8.5);
    doc.setTextColor(...BODY);
    doc.text('•  ' + item, M + 3, y);
    y += 4.5;
  });
  y += 5;

  // ===== CAREER GOAL =====
  sectionHeader('Career Goal');
  bodyText('Build a strong career in Artificial Intelligence and Machine Learning. Aspiring to become a skilled Machine Learning Engineer who works on intelligent, practical, and impactful solutions that solve real-world problems. Focused on gaining practical experience through hands-on projects, research, competitive programming, and real-world applications.');
  y += 5;

  // ===== CONNECT — includes portfolio link =====
  sectionHeader('Connect With Me');
  ensureSpace(18);
  doc.setFont('helvetica', 'normal');
  doc.setFontSize(9);

  // Portfolio (first and prominent)
  doc.setTextColor(...NAVY);
  doc.setFont('helvetica', 'bold');
  doc.text('Portfolio:', M, y);
  doc.setFont('helvetica', 'normal');
  doc.setTextColor(...LINK);
  doc.text(PORTFOLIO_URL, M + 20, y);
  y += 5;

  doc.setTextColor(...SUBTLE);
  doc.text('GitHub:', M, y);
  doc.setTextColor(...LINK);
  doc.text('github.com/wasifatin', M + 18, y);
  y += 5;
  doc.setTextColor(...SUBTLE);
  doc.text('LinkedIn:', M, y);
  doc.setTextColor(...LINK);
  doc.text('linkedin.com/in/fatinsharhad', M + 18, y);
  y += 5;
  doc.setTextColor(...SUBTLE);
  doc.text('Codeforces:', M, y);
  doc.setTextColor(...LINK);
  doc.text('codeforces.com/profile/wasi.fatin', M + 24, y);
  y += 5;
  doc.setTextColor(...SUBTLE);
  doc.text('Beecrowd:', M, y);
  doc.setTextColor(...LINK);
  doc.text('beecrowd.com.br/judge/en/profile/wasifatin', M + 22, y);

  // Final footer on last page
  addFooter();

  doc.save('Fatin_Sharhad_Resume.pdf');
}
window.downloadResume = downloadResume;
