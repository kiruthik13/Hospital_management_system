const PptxGenJS = require("pptxgenjs");

(async () => {
  const pptx = new PptxGenJS();
  pptx.layout = 'LAYOUT_WIDE'; // 10 x 5.63 inches
  pptx.title = 'CareSync — Hospital Appointment Booking System';
  pptx.subject = 'Full Stack Web Application';
  pptx.author = 'CareSync Team';

  const C = {
    primaryBlue: '2563eb',
    primaryDark: '1d4ed8',
    primaryLight: 'eff6ff',
    successGreen: '10b981',
    warningAmber: 'f59e0b',
    dangerRose: 'f43f5e',
    textDark: '0f172a',
    textMuted: '64748b',
    white: 'ffffff',
    slideBg: 'f8fafc',
  };

  function addSlideAccent(slide) {
    slide.background = { color: C.slideBg };
    slide.addShape(pptx.shapes.RECTANGLE, { x: 0, y: 0, w: 0.08, h: 5.63, fill: { color: C.primaryBlue } });
  }

  function addSectionLabel(slide, label) {
    slide.addText(label, { margin: [0, 0, 0, 0],  x: 7.5, y: 0.2, w: 2.3, h: 0.3, fontSize: 9, color: '94a3b8', bold: true, align: 'right', fontFace: 'Calibri' });
  }

  function addSlideTitle(slide, title) {
    slide.addText(title, { margin: [0, 0, 0, 0],  x: 0.4, y: 0.25, w: 9.2, h: 0.55, fontSize: 24, bold: true, color: C.textDark, fontFace: 'Calibri' });
    slide.addShape(pptx.shapes.RECTANGLE, { x: 0.4, y: 0.82, w: 1.2, h: 0.04, fill: { color: C.primaryBlue } });
  }

  function applyStandardLayout(slide, section, title) {
    addSlideAccent(slide);
    addSectionLabel(slide, section);
    addSlideTitle(slide, title);
  }

  function addCard(slide, x, y, w, h, customOpts = {}) {
    const opts = {
      x, y, w, h,
      fill: { color: C.white },
      line: { color: 'e2e8f0', width: 1 },
      rectRadius: 0.08,
      shadow: { type: 'outer', blur: 3, offset: 1, color: '000000', opacity: 0.15 },
      ...customOpts
    };
    slide.addShape(pptx.shapes.ROUNDED_RECTANGLE, opts);
  }

  // ==========================================
  // SLIDE 1 — TITLE COVER
  // ==========================================
  let s1 = pptx.addSlide();
  s1.addShape(pptx.shapes.RECTANGLE, { x: 0, y: 0, w: 10, h: 5.63, fill: { color: '1d4ed8' } });
  s1.addShape(pptx.shapes.RECTANGLE, { x: 0, y: 3.5, w: 10, h: 2.13, fill: { color: '1e40af', transparency: 40 } });

  s1.addShape(pptx.shapes.OVAL, { x: 0.5, y: 0.5, w: 0.7, h: 0.7, fill: { color: 'ffffff', transparency: 80 } });
  s1.addText('🏥', { margin: 0.05,  x: 0.5, y: 0.5, w: 0.7, h: 0.7, fontSize: 24, align: 'center', valign: 'middle' });
  s1.addText('CareSync', { margin: 0.05,  x: 1.35, y: 0.6, w: 2, h: 0.5, fontSize: 18, bold: true, color: 'ffffff' });

  s1.addShape(pptx.shapes.ROUNDED_RECTANGLE, { x: 3.2, y: 1.4, w: 3.6, h: 0.35, fill: { color: 'ffffff', transparency: 20 }, rectRadius: 0.17 });
  s1.addText('HOSPITAL MANAGEMENT SYSTEM', { margin: 0.05,  x: 3.2, y: 1.42, w: 3.6, h: 0.35, fontSize: 9, bold: true, color: 'bfdbfe', align: 'center', valign: 'middle' });

  s1.addText('CareSync', { margin: 0.05,  x: 0.5, y: 1.85, w: 9, h: 1.0, fontSize: 52, bold: true, color: 'ffffff', align: 'center', fontFace: 'Calibri' });
  s1.addText('Hospital Appointment Booking System', { margin: 0.05,  x: 0.5, y: 2.85, w: 9, h: 0.45, fontSize: 18, color: 'bfdbfe', align: 'center' });
  s1.addText('React 18 + Vite  •  Node.js + Express  •  MongoDB Atlas  •  Tailwind CSS v4', { margin: 0.05,  x: 0.5, y: 3.35, w: 9, h: 0.35, fontSize: 11, color: '93c5fd', align: 'center' });

  s1.addShape(pptx.shapes.RECTANGLE, { x: 0, y: 5.1, w: 10, h: 0.53, fill: { color: '1e3a8a' } });
  s1.addText('Full-Stack Web Application  |  Role-Based Portal System  |  v2.1', { margin: 0.05,  x: 0.5, y: 5.18, w: 9, h: 0.3, fontSize: 10, color: '93c5fd', align: 'center' });

  let s1Pills = [
    { x: 1.8, text: '3 Role Portals' },
    { x: 4.0, text: 'JWT Auth' },
    { x: 6.2, text: 'Email + PDF' }
  ];
  s1Pills.forEach(p => {
    s1.addShape(pptx.shapes.ROUNDED_RECTANGLE, { x: p.x, y: 4.2, w: 2.0, h: 0.38, fill: { color: '1e40af' }, rectRadius: 0.19 });
    s1.addText(p.text, { margin: 0.05,  x: p.x, y: 4.2, w: 2.0, h: 0.38, fontSize: 10, color: 'bfdbfe', align: 'center', valign: 'middle' });
  });

  // ==========================================
  // SLIDE 2 — PROBLEM STATEMENT
  // ==========================================
  let s2 = pptx.addSlide();
  applyStandardLayout(s2, 'OVERVIEW', 'Problem Statement & Objectives');

  // Left column
  s2.addShape(pptx.shapes.RECTANGLE, { x: 0.4, y: 1.1, w: 4.4, h: 0.4, fill: { color: 'fef2f2' }, line: { color: 'fecaca', width: 1 } });
  s2.addText('❌  Challenges in Traditional Systems', { margin: 0.05,  x: 0.4, y: 1.1, w: 4.4, h: 0.4, fontSize: 11, bold: true, color: 'dc2626', align: 'center', valign: 'middle' });

  let problems = [
    { t: "Manual Scheduling Overhead", s: "Paper-based systems cause delays and double bookings" },
    { t: "High No-Show Rates", s: "No automated reminders lead to missed consultations" },
    { t: "Poor Doctor Discovery", s: "Patients cannot filter by specialty, day or fee range" },
    { t: "No Digital Receipts", s: "Lack of automated billing and appointment records" }
  ];
  problems.forEach((p, i) => {
    let y = 1.6 + i * 0.8;
    addCard(s2, 0.4, y, 4.4, 0.72);
    s2.addShape(pptx.shapes.OVAL, { x: 0.55, y: y + 0.3, w: 0.12, h: 0.12, fill: { color: 'f43f5e' } });
    s2.addText(p.t, { margin: 0.05,  x: 0.8, y: y + 0.1, w: 3.9, h: 0.25, fontSize: 11, bold: true, color: '0f172a' });
    s2.addText(p.s, { margin: 0.05,  x: 0.8, y: y + 0.35, w: 3.9, h: 0.25, fontSize: 9, color: '64748b' });
  });

  // Right column
  s2.addShape(pptx.shapes.RECTANGLE, { x: 5.1, y: 1.1, w: 4.5, h: 0.4, fill: { color: 'f0fdf4' }, line: { color: 'bbf7d0', width: 1 } });
  s2.addText('✅  CareSync Objectives', { margin: 0.05,  x: 5.1, y: 1.1, w: 4.5, h: 0.4, fontSize: 11, bold: true, color: '16a34a', align: 'center', valign: 'middle' });

  let objectives = [
    { t: "Self-Service Patient Portal", s: "Frictionless booking with 4-step guided wizard" },
    { t: "Automated Notifications", s: "Email alerts for every booking and cancellation" },
    { t: "Advanced Doctor Search", s: "5-way live filter — name, specialty, day, fee, rating" },
    { t: "Digital PDF Receipts", s: "Client-side jsPDF receipts — no server needed" }
  ];
  objectives.forEach((o, i) => {
    let y = 1.6 + i * 0.8;
    addCard(s2, 5.1, y, 4.5, 0.72);
    s2.addShape(pptx.shapes.OVAL, { x: 5.25, y: y + 0.3, w: 0.12, h: 0.12, fill: { color: '10b981' } });
    s2.addText(o.t, { margin: 0.05,  x: 5.5, y: y + 0.1, w: 3.9, h: 0.25, fontSize: 11, bold: true, color: '0f172a' });
    s2.addText(o.s, { margin: 0.05,  x: 5.5, y: y + 0.35, w: 3.9, h: 0.25, fontSize: 9, color: '64748b' });
  });

  // ==========================================
  // SLIDE 3 — TECH STACK
  // ==========================================
  let s3 = pptx.addSlide();
  applyStandardLayout(s3, 'ARCHITECTURE', 'Technology Stack');

  s3.addShape(pptx.shapes.ROUNDED_RECTANGLE, { x: 0.4, y: 1.0, w: 1.5, h: 0.3, fill: { color: 'eff6ff' }, line: { color: 'bfdbfe', width: 1 }, rectRadius: 0.15 });
  s3.addText('Frontend', { margin: 0.05,  x: 0.4, y: 1.0, w: 1.5, h: 0.3, fontSize: 10, bold: true, color: '2563eb', align: 'center', valign: 'middle' });

  s3.addShape(pptx.shapes.ROUNDED_RECTANGLE, { x: 5.2, y: 1.0, w: 1.5, h: 0.3, fill: { color: 'f0fdf4' }, line: { color: 'bbf7d0', width: 1 }, rectRadius: 0.15 });
  s3.addText('Backend', { margin: 0.05,  x: 5.2, y: 1.0, w: 1.5, h: 0.3, fontSize: 10, bold: true, color: '16a34a', align: 'center', valign: 'middle' });

  let frontendTechs = [
    { n: "React 18 + Vite", p: "UI framework and fast build tool" },
    { n: "Tailwind CSS v4", p: "Utility-first styling with custom design tokens" },
    { n: "Recharts", p: "Admin dashboard analytics and data visualization" },
    { n: "react-calendar", p: "Interactive appointment calendar with dot indicators" },
    { n: "jsPDF + autotable", p: "Client-side PDF receipt generation (A4)" },
    { n: "Axios + React Router v6", p: "API client with JWT interceptor and routing" }
  ];
  frontendTechs.forEach((t, i) => {
    let y = 1.38 + i * 0.58;
    addCard(s3, 0.4, y, 4.5, 0.52);
    s3.addShape(pptx.shapes.RECTANGLE, { x: 0.4, y: y, w: 0.06, h: 0.52, fill: { color: '2563eb' } });
    s3.addText(t.n, { margin: 0.05,  x: 0.55, y: y + 0.05, w: 4.3, h: 0.2, fontSize: 10, bold: true, color: '0f172a' });
    s3.addText(t.p, { margin: 0.05,  x: 0.55, y: y + 0.25, w: 4.3, h: 0.2, fontSize: 9, color: '64748b' });
  });

  let backendTechs = [
    { n: "Node.js + Express.js", p: "RESTful API server and routing" },
    { n: "MongoDB + Mongoose", p: "Document database with ODM schema validation" },
    { n: "JWT + bcryptjs", p: "Stateless auth tokens and password hashing (10 rounds)" },
    { n: "Nodemailer v2.1", p: "SMTP email with TLS fix and startup verification" },
    { n: "dotenv + CORS", p: "Environment config and cross-origin security" },
    { n: "Nodemon", p: "Auto-reload dev server for rapid iteration" }
  ];
  backendTechs.forEach((t, i) => {
    let y = 1.38 + i * 0.58;
    addCard(s3, 5.2, y, 4.4, 0.52);
    s3.addShape(pptx.shapes.RECTANGLE, { x: 5.2, y: y, w: 0.06, h: 0.52, fill: { color: '10b981' } });
    s3.addText(t.n, { margin: 0.05,  x: 5.35, y: y + 0.05, w: 4.2, h: 0.2, fontSize: 10, bold: true, color: '0f172a' });
    s3.addText(t.p, { margin: 0.05,  x: 5.35, y: y + 0.25, w: 4.2, h: 0.2, fontSize: 9, color: '64748b' });
  });

  // ==========================================
  // SLIDE 4 — SYSTEM ARCHITECTURE DIAGRAM
  // ==========================================
  let s4 = pptx.addSlide();
  applyStandardLayout(s4, 'ARCHITECTURE', 'Three-Tier Architecture');

  // Tier 1
  s4.addShape(pptx.shapes.RECTANGLE, { x: 0.4, y: 1.1, w: 2.4, h: 3.8, fill: { color: 'eff6ff' }, line: { color: '2563eb', width: 1.5 } });
  s4.addShape(pptx.shapes.RECTANGLE, { x: 0.4, y: 1.1, w: 2.4, h: 0.38, fill: { color: '2563eb' } });
  s4.addText('CLIENT TIER', { margin: 0.05,  x: 0.4, y: 1.1, w: 2.4, h: 0.38, fontSize: 10, bold: true, color: 'ffffff', align: 'center', valign: 'middle' });
  
  ['Patient Portal\nReact 18 + Vite', 'Doctor Portal\nReact Router v6', 'Admin Portal\nTailwind CSS v4'].forEach((t, i) => {
    let y = 1.56 + i * 0.8;
    s4.addShape(pptx.shapes.RECTANGLE, { x: 0.55, y: y, w: 2.1, h: 0.7, fill: { color: 'dbeafe' }, line: { color: '93c5fd', width: 1 } });
    s4.addText(t, { margin: 0.05,  x: 0.55, y: y, w: 2.1, h: 0.7, fontSize: 9, color: '0f172a', align: 'center', valign: 'middle' });
  });
  
  ['Recharts', 'jsPDF', 'react-calendar'].forEach((t, i) => {
    s4.addShape(pptx.shapes.ROUNDED_RECTANGLE, { x: 0.55 + i * 0.72, y: 4.2, w: 0.65, h: 0.25, fill: { color: 'bfdbfe' }, rectRadius: 0.1 });
    s4.addText(t, { margin: 0.05,  x: 0.55 + i * 0.72, y: 4.2, w: 0.65, h: 0.25, fontSize: 7, color: '0f172a', align: 'center', valign: 'middle' });
  });

  // Arrow 1
  s4.addShape(pptx.shapes.RIGHT_ARROW, { x: 2.8, y: 3.0, w: 0.7, h: 0.2, fill: { color: '2563eb' } });
  s4.addText('HTTPS / JWT', { margin: 0.05,  x: 2.75, y: 2.75, w: 0.8, h: 0.2, fontSize: 8, color: '64748b', align: 'center' });

  // Tier 2
  s4.addShape(pptx.shapes.RECTANGLE, { x: 3.5, y: 1.1, w: 2.8, h: 3.8, fill: { color: 'f0fdf4' }, line: { color: '10b981', width: 1.5 } });
  s4.addShape(pptx.shapes.RECTANGLE, { x: 3.5, y: 1.1, w: 2.8, h: 0.38, fill: { color: '10b981' } });
  s4.addText('API TIER', { margin: 0.05,  x: 3.5, y: 1.1, w: 2.8, h: 0.38, fontSize: 10, bold: true, color: 'ffffff', align: 'center', valign: 'middle' });

  ['Auth Controller\nJWT + bcrypt', 'Doctor Controller\nCRUD + slots', 'Appointment Controller\nBook + cancel + email', 'Department Controller\nSpecialty CRUD'].forEach((t, i) => {
    let y = 1.56 + i * 0.66;
    s4.addShape(pptx.shapes.RECTANGLE, { x: 3.65, y: y, w: 2.5, h: 0.58, fill: { color: 'ffffff' }, line: { color: '10b981', width: 1 } });
    s4.addText(t, { margin: 0.05,  x: 3.65, y: y, w: 2.5, h: 0.58, fontSize: 9, color: '0f172a', align: 'center', valign: 'middle' });
  });

  ['verifyToken', 'requireRole', 'errorHandler'].forEach((t, i) => {
    s4.addShape(pptx.shapes.ROUNDED_RECTANGLE, { x: 3.65 + i * 0.85, y: 4.4, w: 0.8, h: 0.25, fill: { color: 'bbf7d0' }, rectRadius: 0.1 });
    s4.addText(t, { margin: 0.05,  x: 3.65 + i * 0.85, y: 4.4, w: 0.8, h: 0.25, fontSize: 7, color: '0f172a', align: 'center', valign: 'middle' });
  });

  // Arrow 2
  s4.addShape(pptx.shapes.RIGHT_ARROW, { x: 6.3, y: 3.0, w: 0.3, h: 0.2, fill: { color: '10b981' } });
  s4.addText('Mongoose ODM', { margin: 0.05,  x: 6.2, y: 2.75, w: 0.5, h: 0.2, fontSize: 6, color: '64748b', align: 'center' });

  // Tier 3
  s4.addShape(pptx.shapes.RECTANGLE, { x: 6.6, y: 1.1, w: 3.0, h: 3.8, fill: { color: 'fef9ee' }, line: { color: 'f59e0b', width: 1.5 } });
  s4.addShape(pptx.shapes.RECTANGLE, { x: 6.6, y: 1.1, w: 3.0, h: 0.38, fill: { color: 'f59e0b' } });
  s4.addText('DATA TIER', { margin: 0.05,  x: 6.6, y: 1.1, w: 3.0, h: 0.38, fontSize: 10, bold: true, color: 'ffffff', align: 'center', valign: 'middle' });

  ['Users\nemail, role, bcrypt hash', 'Doctors\nspecialty, slots, fee, rating', 'Appointments\npatient, doctor, date, status', 'Departments\nname, icon, description'].forEach((t, i) => {
    let y = 1.56 + i * 0.7;
    s4.addShape(pptx.shapes.RECTANGLE, { x: 6.75, y: y, w: 2.65, h: 0.62, fill: { color: 'ffffff' }, line: { color: 'f59e0b', width: 1 } });
    s4.addText(t, { margin: 0.05,  x: 6.75, y: y, w: 2.65, h: 0.62, fontSize: 9, color: '0f172a', align: 'center', valign: 'middle' });
  });

  s4.addShape(pptx.shapes.ROUNDED_RECTANGLE, { x: 6.75, y: 4.45, w: 2.65, h: 0.28, fill: { color: 'fbbf24' }, rectRadius: 0.1 });
  s4.addText('MongoDB Atlas', { margin: 0.05,  x: 6.75, y: 4.45, w: 2.65, h: 0.28, fontSize: 9, bold: true, color: '78350f', align: 'center', valign: 'middle' });

  // ==========================================
  // SLIDE 5 — AUTHENTICATION SYSTEM
  // ==========================================
  let s5 = pptx.addSlide();
  applyStandardLayout(s5, 'SECURITY', 'Authentication & Authorization');

  let roles = [
    { x: 0.4, title: 'PATIENT', color: '2563eb', lines: ["Register freely", "Book appointments", "Download receipts"] },
    { x: 3.5, title: 'DOCTOR', color: '10b981', lines: ["Register freely", "View schedule", "Mark appointments"] },
    { x: 6.6, title: 'ADMIN', color: 'f43f5e', lines: ["caresync@gmail.com ONLY", "Cannot register publicly", "Full system access"] }
  ];
  roles.forEach(r => {
    addCard(s5, r.x, 1.05, 2.9, 1.35, { fill: { color: 'f8fafc' } });
    s5.addShape(pptx.shapes.RECTANGLE, { x: r.x, y: 1.05, w: 2.9, h: 0.35, fill: { color: r.color } });
    s5.addText(`👤 ${r.title}`, { margin: 0.05,  x: r.x, y: 1.05, w: 2.9, h: 0.35, fontSize: 10, bold: true, color: 'ffffff', align: 'center', valign: 'middle' });
    r.lines.forEach((line, i) => {
      s5.addShape(pptx.shapes.OVAL, { x: r.x + 0.2, y: 1.55 + i*0.25, w: 0.06, h: 0.06, fill: { color: r.color } });
      s5.addText(line, { margin: 0.05,  x: r.x + 0.35, y: 1.45 + i*0.25, w: 2.5, h: 0.25, fontSize: 9, color: '374151' });
    });
  });

  s5.addShape(pptx.shapes.LINE, { x: 0.4, y: 2.55, w: 9.2, h: 0, line: { color: 'e2e8f0', width: 1 } });
  s5.addText('Login Security Flow', { margin: 0.05,  x: 0.4, y: 2.7, w: 3, h: 0.3, fontSize: 12, bold: true, color: '0f172a' });

  // Flow Row 1
  s5.addShape(pptx.shapes.RECTANGLE, { x: 0.4, y: 3.1, w: 2.2, h: 0.45, fill: { color: 'eff6ff' }, line: { color: 'bfdbfe', width: 1 } });
  s5.addText('Email + Password', { margin: 0.05,  x: 0.4, y: 3.1, w: 2.2, h: 0.45, fontSize: 9, align: 'center', valign: 'middle' });
  s5.addText('→', { margin: 0.05,  x: 2.6, y: 3.1, w: 0.2, h: 0.45, fontSize: 12, align: 'center', valign: 'middle' });
  s5.addShape(pptx.shapes.RECTANGLE, { x: 2.8, y: 3.1, w: 2.5, h: 0.45, fill: { color: 'eff6ff' } });
  s5.addText('bcrypt.compare()', { margin: 0.05,  x: 2.8, y: 3.1, w: 2.5, h: 0.45, fontSize: 9, align: 'center', valign: 'middle' });
  s5.addText('→', { margin: 0.05,  x: 5.3, y: 3.1, w: 0.2, h: 0.45, fontSize: 12, align: 'center', valign: 'middle' });
  s5.addShape(pptx.shapes.RECTANGLE, { x: 5.5, y: 3.1, w: 2.5, h: 0.45, fill: { color: 'f0fdf4' }, line: { color: 'bbf7d0', width: 1 } });
  s5.addText('JWT Token (7d)', { margin: 0.05,  x: 5.5, y: 3.1, w: 2.5, h: 0.45, fontSize: 9, color: '16a34a', align: 'center', valign: 'middle' });
  s5.addText('→', { margin: 0.05,  x: 8.0, y: 3.1, w: 0.2, h: 0.45, fontSize: 12, align: 'center', valign: 'middle' });
  s5.addShape(pptx.shapes.RECTANGLE, { x: 8.2, y: 3.1, w: 1.5, h: 0.45, fill: { color: 'dbeafe' } });
  s5.addText('Dashboard', { margin: 0.05,  x: 8.2, y: 3.1, w: 1.5, h: 0.45, fontSize: 9, align: 'center', valign: 'middle' });

  // Flow Row 2
  s5.addShape(pptx.shapes.RECTANGLE, { x: 0.4, y: 3.65, w: 2.2, h: 0.45, fill: { color: 'eff6ff' } });
  s5.addText('caresync@gmail.com', { margin: 0.05,  x: 0.4, y: 3.65, w: 2.2, h: 0.45, fontSize: 9, align: 'center', valign: 'middle' });
  s5.addText('→', { margin: 0.05,  x: 2.6, y: 3.65, w: 0.2, h: 0.45, fontSize: 12, align: 'center', valign: 'middle' });
  s5.addShape(pptx.shapes.RECTANGLE, { x: 2.8, y: 3.65, w: 2.5, h: 0.45, fill: { color: 'eff6ff' } });
  s5.addText('Email === caresync?', { margin: 0.05,  x: 2.8, y: 3.65, w: 2.5, h: 0.45, fontSize: 9, align: 'center', valign: 'middle' });
  s5.addText('→ YES →', { margin: 0.05,  x: 5.3, y: 3.65, w: 0.4, h: 0.45, fontSize: 7, align: 'center', valign: 'middle' });
  s5.addShape(pptx.shapes.RECTANGLE, { x: 5.7, y: 3.65, w: 2.3, h: 0.45, fill: { color: 'f0fdf4' } });
  s5.addText('Admin JWT', { margin: 0.05,  x: 5.7, y: 3.65, w: 2.3, h: 0.45, fontSize: 9, color: '16a34a', align: 'center', valign: 'middle' });
  s5.addText('→', { margin: 0.05,  x: 8.0, y: 3.65, w: 0.2, h: 0.45, fontSize: 12, align: 'center', valign: 'middle' });
  s5.addText('/admin/dashboard', { margin: 0.05,  x: 8.2, y: 3.65, w: 1.5, h: 0.45, fontSize: 8, align: 'center', valign: 'middle' });

  // Flow Row 3
  s5.addShape(pptx.shapes.RECTANGLE, { x: 0.4, y: 4.2, w: 2.2, h: 0.45, fill: { color: 'eff6ff' } });
  s5.addText('other@email.com + admin role', { margin: 0.05,  x: 0.4, y: 4.2, w: 2.2, h: 0.45, fontSize: 8, align: 'center', valign: 'middle' });
  s5.addText('→', { margin: 0.05,  x: 2.6, y: 4.2, w: 0.2, h: 0.45, fontSize: 12, align: 'center', valign: 'middle' });
  s5.addShape(pptx.shapes.RECTANGLE, { x: 2.8, y: 4.2, w: 2.5, h: 0.45, fill: { color: 'fef2f2' }, line: { color: 'fecaca', width: 1 } });
  s5.addText('403 Unauthorized', { margin: 0.05,  x: 2.8, y: 4.2, w: 2.5, h: 0.45, fontSize: 9, color: 'dc2626', align: 'center', valign: 'middle' });

  // Register Guard
  s5.addShape(pptx.shapes.RECTANGLE, { x: 7.0, y: 3.6, w: 2.7, h: 1.05, fill: { color: 'fef2f2' }, line: { color: 'fecaca', width: 1 } });
  s5.addText('Register Guard', { margin: 0.05,  x: 7.0, y: 3.6, w: 2.7, h: 0.35, fontSize: 10, bold: true, color: 'dc2626', align: 'center', valign: 'middle' });
  s5.addText('role: admin → 403 Forbidden\nOnly patient/doctor allowed', { margin: 0.05,  x: 7.0, y: 3.95, w: 2.7, h: 0.6, fontSize: 9, color: '374151', align: 'center' });

  // ==========================================
  // SLIDE 6 — PATIENT PORTAL
  // ==========================================
  let s6 = pptx.addSlide();
  applyStandardLayout(s6, 'FEATURES', 'Patient Portal — Features');

  // Card 1
  addCard(s6, 0.4, 1.05, 4.5, 1.85);
  s6.addShape(pptx.shapes.RECTANGLE, { x: 0.4, y: 1.05, w: 4.5, h: 0.32, fill: { color: '2563eb' } });
  s6.addText('FindDoctors.jsx', { margin: 0.05,  x: 0.4, y: 1.05, w: 4.5, h: 0.32, fontSize: 9, bold: true, color: 'ffffff', align: 'center', valign: 'middle' });
  s6.addText('5-Way Doctor Search & Filter', { margin: 0.05,  x: 0.5, y: 1.4, w: 4.3, h: 0.3, fontSize: 11, bold: true, color: '0f172a' });
  ['Name Search', 'Specialty', 'Available Day', 'Fee Range ₹', 'Sort: Rating/Fee/Exp'].forEach((t, i) => {
    s6.addShape(pptx.shapes.ROUNDED_RECTANGLE, { x: 0.5 + (i % 3) * 1.4, y: 1.8 + Math.floor(i / 3) * 0.4, w: 1.3, h: 0.3, fill: { color: 'dbeafe' }, rectRadius: 0.1 });
    s6.addText(t, { margin: 0.05,  x: 0.5 + (i % 3) * 1.4, y: 1.8 + Math.floor(i / 3) * 0.4, w: 1.3, h: 0.3, fontSize: 8, color: '1d4ed8', align: 'center', valign: 'middle' });
  });
  s6.addText('AND-logic live filtering — no page reload', { margin: 0.05,  x: 0.5, y: 2.6, w: 4.3, h: 0.2, fontSize: 9, color: '64748b', italic: true });

  // Card 2
  addCard(s6, 5.1, 1.05, 4.5, 1.85);
  s6.addShape(pptx.shapes.RECTANGLE, { x: 5.1, y: 1.05, w: 4.5, h: 0.32, fill: { color: '10b981' } });
  s6.addText('BookAppointment.jsx', { margin: 0.05,  x: 5.1, y: 1.05, w: 4.5, h: 0.32, fontSize: 9, bold: true, color: 'ffffff', align: 'center', valign: 'middle' });
  s6.addText('4-Step Booking Wizard', { margin: 0.05,  x: 5.2, y: 1.4, w: 4.3, h: 0.3, fontSize: 11, bold: true, color: '0f172a' });
  ['1 Specialty', '2 Doctor', '3 Schedule', '4 Confirm'].forEach((t, i) => {
    s6.addShape(pptx.shapes.ROUNDED_RECTANGLE, { x: 5.2 + i * 1.05, y: 1.9, w: 0.9, h: 0.3, fill: { color: 'f0fdf4' }, line: { color: 'bbf7d0', width: 1 }, rectRadius: 0.1 });
    s6.addText(t, { margin: 0.05,  x: 5.2 + i * 1.05, y: 1.9, w: 0.9, h: 0.3, fontSize: 8, color: '16a34a', align: 'center', valign: 'middle' });
    if(i < 3) s6.addText('→', { margin: 0.05,  x: 6.1 + i * 1.05, y: 1.9, w: 0.15, h: 0.3, fontSize: 10, align: 'center', valign: 'middle' });
  });
  s6.addText('Slot conflict check before saving', { margin: 0.05,  x: 5.2, y: 2.6, w: 4.3, h: 0.2, fontSize: 9, color: '64748b' });

  // Card 3
  addCard(s6, 0.4, 3.0, 4.5, 1.85);
  s6.addShape(pptx.shapes.RECTANGLE, { x: 0.4, y: 3.0, w: 4.5, h: 0.32, fill: { color: 'f59e0b' } });
  s6.addText('AppointmentCalendar.jsx', { margin: 0.05,  x: 0.4, y: 3.0, w: 4.5, h: 0.32, fontSize: 9, bold: true, color: 'ffffff', align: 'center', valign: 'middle' });
  s6.addText('Interactive Appointment Calendar', { margin: 0.05,  x: 0.5, y: 3.4, w: 4.3, h: 0.3, fontSize: 11, bold: true, color: '0f172a' });
  let dots = [
    { c: '2563eb', l: 'Confirmed', x: 0.6, y: 3.8 },
    { c: '10b981', l: 'Completed', x: 2.2, y: 3.8 },
    { c: 'f43f5e', l: 'Cancelled', x: 0.6, y: 4.2 },
    { c: 'f59e0b', l: 'Pending',   x: 2.2, y: 4.2 }
  ];
  dots.forEach(d => {
    s6.addShape(pptx.shapes.OVAL, { x: d.x, y: d.y + 0.05, w: 0.12, h: 0.12, fill: { color: d.c } });
    s6.addText(d.l, { margin: 0.05,  x: d.x + 0.2, y: d.y, w: 1.2, h: 0.2, fontSize: 9, color: '374151' });
  });
  s6.addText('Click any date to see appointment details', { margin: 0.05,  x: 0.5, y: 4.55, w: 4.3, h: 0.2, fontSize: 9, color: '64748b' });

  // Card 4
  addCard(s6, 5.1, 3.0, 4.5, 1.85);
  s6.addShape(pptx.shapes.RECTANGLE, { x: 5.1, y: 3.0, w: 4.5, h: 0.32, fill: { color: '8b5cf6' } });
  s6.addText('generateReceipt.js (jsPDF)', { margin: 0.05,  x: 5.1, y: 3.0, w: 4.5, h: 0.32, fontSize: 9, bold: true, color: 'ffffff', align: 'center', valign: 'middle' });
  s6.addText('PDF Appointment Receipt', { margin: 0.05,  x: 5.2, y: 3.4, w: 4.3, h: 0.3, fontSize: 11, bold: true, color: '0f172a' });
  s6.addShape(pptx.shapes.RECTANGLE, { x: 5.25, y: 3.75, w: 4.2, h: 1.0, fill: { color: 'f8fafc' }, line: { color: 'e2e8f0', width: 1 } });
  s6.addShape(pptx.shapes.RECTANGLE, { x: 5.25, y: 3.75, w: 4.2, h: 0.22, fill: { color: '2563eb' } });
  s6.addText('CareSync  Hospital Appointment Receipt', { margin: 0.05,  x: 5.25, y: 3.75, w: 4.2, h: 0.22, fontSize: 7, color: 'ffffff', align: 'center', valign: 'middle' });
  s6.addText('Patient Name  |  Dr. Rajesh Gupta\nDate  |  2024-06-23  |  Slot: 09:30\nFee   |  Rs. 800     |  CONFIRMED', { margin: 0.05,  x: 5.35, y: 4.0, w: 4.0, h: 0.5, fontSize: 7, color: '374151' });
  s6.addText('Thank you for choosing CareSync', { margin: 0.05,  x: 5.35, y: 4.55, w: 4.0, h: 0.2, fontSize: 6, color: '94a3b8', align: 'center' });

  // ==========================================
  // SLIDE 7 — DOCTOR & ADMIN PORTALS
  // ==========================================
  let s7 = pptx.addSlide();
  applyStandardLayout(s7, 'FEATURES', 'Doctor & Admin Portals');

  // Left - Doctor
  s7.addShape(pptx.shapes.RECTANGLE, { x: 0.4, y: 1.0, w: 4.4, h: 0.38, fill: { color: 'f0fdf4' }, line: { color: 'bbf7d0', width: 1 } });
  s7.addText('Doctor Portal', { margin: 0.05,  x: 0.4, y: 1.0, w: 4.4, h: 0.38, fontSize: 12, bold: true, color: '16a34a', align: 'center', valign: 'middle' });

  let dFeatures = [
    { t: "Today's Schedule Dashboard", s: "Filterable daily consultation list with patient details and time slots" },
    { t: "Appointment Calendar View", s: "react-calendar with colored status dots — click date for detail panel" },
    { t: "Status Management", s: "Mark as Completed or No-Show — PATCH /api/appointments/:id/status" }
  ];
  dFeatures.forEach((f, i) => {
    let y = 1.48 + i * 1.0;
    addCard(s7, 0.4, y, 4.4, 0.9);
    s7.addShape(pptx.shapes.RECTANGLE, { x: 0.4, y: y, w: 0.25, h: 0.9, fill: { color: '10b981' } });
    s7.addText(f.t, { margin: 0.05,  x: 0.8, y: y + 0.1, w: 3.9, h: 0.3, fontSize: 11, bold: true, color: '0f172a' });
    s7.addText(f.s, { margin: 0.05,  x: 0.8, y: y + 0.4, w: 3.9, h: 0.4, fontSize: 9, color: '64748b' });
  });

  s7.addShape(pptx.shapes.RECTANGLE, { x: 0.4, y: 4.5, w: 4.4, h: 0.78, fill: { color: 'f0fdf4' }, line: { color: 'bbf7d0', width: 1 } });
  s7.addText('Email on New Booking', { margin: 0.05,  x: 0.5, y: 4.55, w: 4.2, h: 0.2, fontSize: 10, bold: true, color: '16a34a' });
  s7.addText('Doctor receives: 📅 New Appointment Scheduled — CareSync', { margin: 0.05,  x: 0.5, y: 4.75, w: 4.2, h: 0.2, fontSize: 9, color: '374151' });
  s7.addText('Sent via Nodemailer — non-blocking try/catch', { margin: 0.05,  x: 0.5, y: 4.95, w: 4.2, h: 0.2, fontSize: 8, color: '64748b' });

  s7.addShape(pptx.shapes.RECTANGLE, { x: 5.0, y: 1.0, w: 0.02, h: 4.5, fill: { color: 'e2e8f0' } });

  // Right - Admin
  s7.addShape(pptx.shapes.RECTANGLE, { x: 5.2, y: 1.0, w: 4.4, h: 0.38, fill: { color: 'fef2f2' }, line: { color: 'fecaca', width: 1 } });
  s7.addText('Admin Portal', { margin: 0.05,  x: 5.2, y: 1.0, w: 4.4, h: 0.38, fontSize: 12, bold: true, color: 'dc2626', align: 'center', valign: 'middle' });

  let aFeatures = [
    { t: "Specialty Department CRUD", s: "Create, edit departments with emoji icons and descriptions" },
    { t: "Doctor Registry Management", s: "Add, edit, deactivate/activate doctor profiles — fee, slots, specialty" },
    { t: "All Appointments View", s: "Hospital-wide appointment log with tab filter by status" }
  ];
  aFeatures.forEach((f, i) => {
    let y = 1.48 + i * 1.0;
    addCard(s7, 5.2, y, 4.4, 0.9);
    s7.addShape(pptx.shapes.RECTANGLE, { x: 5.2, y: y, w: 0.25, h: 0.9, fill: { color: 'f43f5e' } });
    s7.addText(f.t, { margin: 0.05,  x: 5.6, y: y + 0.1, w: 3.9, h: 0.3, fontSize: 11, bold: true, color: '0f172a' });
    s7.addText(f.s, { margin: 0.05,  x: 5.6, y: y + 0.4, w: 3.9, h: 0.4, fontSize: 9, color: '64748b' });
  });

  s7.addShape(pptx.shapes.RECTANGLE, { x: 5.2, y: 4.5, w: 4.4, h: 0.78, fill: { color: 'fef2f2' }, line: { color: 'fecaca', width: 1 } });
  s7.addText('3 Live Recharts Analytics', { margin: 0.05,  x: 5.3, y: 4.55, w: 4.2, h: 0.2, fontSize: 10, bold: true, color: 'dc2626' });
  ['Pie — Status', 'Area — Weekly', 'Bar — Doctors'].forEach((t, i) => {
    s7.addShape(pptx.shapes.ROUNDED_RECTANGLE, { x: 5.3 + i * 1.35, y: 4.85, w: 1.25, h: 0.3, fill: { color: 'fee2e2' }, rectRadius: 0.1 });
    s7.addText(t, { margin: 0.05,  x: 5.3 + i * 1.35, y: 4.85, w: 1.25, h: 0.3, fontSize: 8, color: 'b91c1c', align: 'center', valign: 'middle' });
  });

  // ==========================================
  // SLIDE 8 — EMAIL NOTIFICATION SYSTEM
  // ==========================================
  let s8 = pptx.addSlide();
  applyStandardLayout(s8, 'FEATURES', 'Email Notification System — Nodemailer v2.1');

  s8.addShape(pptx.shapes.RECTANGLE, { x: 0.4, y: 1.0, w: 9.2, h: 0.72, fill: { color: 'f8fafc' }, line: { color: 'e2e8f0', width: 1 } });
  let eConfigs = [
    { t: 'smtp.gmail.com : 587', c: 'dbeafe', tc: '1d4ed8' },
    { t: 'TLS rejectUnauthorized: false', c: 'fef9c3', tc: '854d0e' },
    { t: 'transporter.verify() on startup', c: 'dcfce7', tc: '166534' }
  ];
  eConfigs.forEach((c, i) => {
    s8.addShape(pptx.shapes.ROUNDED_RECTANGLE, { x: 0.6 + i * 3.0, y: 1.2, w: 2.8, h: 0.32, fill: { color: c.c }, rectRadius: 0.1 });
    s8.addText(c.t, { margin: 0.05,  x: 0.6 + i * 3.0, y: 1.2, w: 2.8, h: 0.32, fontSize: 9, bold: true, color: c.tc, align: 'center', valign: 'middle' });
  });

  let eCards = [
    { x: 0.4, hc: '10b981', t: '✅  Patient Confirmation', sub: '✅ Appointment Confirmed — CareSync', 
      fields: "Doctor:     Dr. Rajesh Gupta\nSpecialty:  Cardiology\nDate:       2024-06-23\nSlot:       09:30 AM\nFee:        Rs. 800", foot: "Thank you for choosing CareSync" },
    { x: 3.55, hc: '2563eb', t: '📅  Doctor Notification', sub: '📅 New Appointment Scheduled — CareSync', 
      fields: "Patient:  Rahul Sharma\nDate:     2024-06-23\nSlot:     09:30 AM\nAction:   Please be available", foot: "CareSync Hospital System" },
    { x: 6.7, hc: 'f43f5e', t: '❌  Cancellation Email', sub: '❌ Appointment Cancelled — CareSync', 
      fields: "Doctor:  Dr. Rajesh Gupta\nDate:    2024-06-23\nSlot:    09:30 AM\nNote:    Book a new slot anytime", foot: "We hope to see you soon" }
  ];
  eCards.forEach(c => {
    addCard(s8, c.x, 1.82, 2.9, 2.8);
    s8.addShape(pptx.shapes.RECTANGLE, { x: c.x, y: 1.82, w: 2.9, h: 0.38, fill: { color: c.hc } });
    s8.addText(c.t, { margin: 0.05,  x: c.x, y: 1.82, w: 2.9, h: 0.38, fontSize: 10, bold: true, color: 'ffffff', align: 'center', valign: 'middle' });
    
    s8.addShape(pptx.shapes.RECTANGLE, { x: c.x + 0.12, y: 2.3, w: 2.66, h: 2.2, fill: { color: 'ffffff' }, line: { color: 'e2e8f0', width: 1 } });
    s8.addText(c.sub, { margin: 0.05,  x: c.x + 0.2, y: 2.4, w: 2.5, h: 0.2, fontSize: 8, bold: true, color: '0f172a' });
    s8.addShape(pptx.shapes.LINE, { x: c.x + 0.2, y: 2.65, w: 2.5, h: 0, line: { color: 'e2e8f0', width: 1 } });
    s8.addText(c.fields, { margin: 0.05,  x: c.x + 0.2, y: 2.75, w: 2.5, h: 1.2, fontSize: 8, color: '374151' });
    s8.addText(c.foot, { margin: 0.05,  x: c.x + 0.2, y: 4.2, w: 2.5, h: 0.2, fontSize: 7, color: '94a3b8' });
  });

  s8.addShape(pptx.shapes.RECTANGLE, { x: 0.4, y: 4.7, w: 9.2, h: 0.72, fill: { color: 'fffbeb' }, line: { color: 'fcd34d', width: 1 } });
  s8.addText('⚡ Resilient Design: Email failures are wrapped in try/catch — mail server outages NEVER interrupt booking or cancellation API responses', { margin: 0.05,  x: 0.5, y: 4.7, w: 9.0, h: 0.72, fontSize: 10, color: '92400e', align: 'center', valign: 'middle' });

  // ==========================================
  // SLIDE 9 — DATABASE SCHEMA
  // ==========================================
  let s9 = pptx.addSlide();
  applyStandardLayout(s9, 'DATABASE', 'MongoDB Schema Design');

  let schemas = [
    { x: 0.4, y: 1.0, hc: '2563eb', t: 'Users Collection', f: "_id          ObjectId (PK)\nname         String, required\nemail        String, unique, required\npassword     String, bcrypt 10 rounds\nphone        String\nrole         Enum: patient | doctor | admin\ntimestamps   createdAt, updatedAt" },
    { x: 5.1, y: 1.0, hc: '10b981', t: 'Doctors Collection', f: "_id              ObjectId (PK)\nuserId           Ref: Users\nname             String\ndepartment       Ref: Departments\nexperience       Number (years)\nrating           Number (default 4.5)\nconsultationFee  Number (₹)\navailableDays    [String] array\ntimeSlots        [String] array\nisActive         Boolean (default true)" },
    { x: 0.4, y: 3.25, hc: 'f59e0b', t: 'Appointments Collection', f: "_id          ObjectId (PK)\npatient      Ref: Users\ndoctor       Ref: Doctors\ndepartment   Ref: Departments\ndate         String (YYYY-MM-DD)\nslot         String (HH:MM)\nstatus       Enum: confirmed | completed\n             cancelled | pending | no-show\nnotes        String (optional)\npatientName  String (denormalized)" },
    { x: 5.1, y: 3.25, hc: '8b5cf6', t: 'Departments Collection', f: "_id           ObjectId (PK)\nname          String, required\nicon          String (emoji)\ndescription   String\ntimestamps    createdAt, updatedAt" }
  ];
  schemas.forEach((c, i) => {
    addCard(s9, c.x, c.y, 4.5, 2.15);
    s9.addShape(pptx.shapes.RECTANGLE, { x: c.x, y: c.y, w: 4.5, h: 0.38, fill: { color: c.hc } });
    s9.addText(c.t, { margin: 0.05,  x: c.x, y: c.y, w: 4.5, h: 0.38, fontSize: 10, bold: true, color: 'ffffff', align: 'center', valign: 'middle' });
    s9.addText(c.f, { margin: 0.05,  x: c.x + 0.2, y: c.y + 0.45, w: 4.1, h: 1.6, fontSize: 9, color: '374151' });
  });

  s9.addShape(pptx.shapes.RECTANGLE, { x: 5.25, y: 4.65, w: 4.2, h: 0.58, fill: { color: 'f8fafc' }, line: { color: 'e2e8f0', width: 1 } });
  s9.addText('Appointment Status Flow', { margin: 0.05,  x: 5.35, y: 4.7, w: 4.0, h: 0.2, fontSize: 9, bold: true, color: '0f172a' });
  s9.addText('confirmed → completed / no-show / cancelled', { margin: 0.05,  x: 5.35, y: 4.9, w: 4.0, h: 0.2, fontSize: 8, color: '64748b' });

  // ==========================================
  // SLIDE 10 — API REFERENCE
  // ==========================================
  let s10 = pptx.addSlide();
  applyStandardLayout(s10, 'API', 'REST API Reference');

  let tables = [
    { x: 0.4, y: 1.0, hc: '2563eb', rows: [
      { m: 'POST', e: '/auth/register', a: 'Public' },
      { m: 'POST', e: '/auth/login', a: 'Public' },
      { m: 'GET', e: '/auth/me', a: 'Bearer JWT' }
    ]},
    { x: 5.1, y: 1.0, hc: '10b981', rows: [
      { m: 'POST', e: '/appointments', a: 'Patient → emails' },
      { m: 'GET', e: '/appointments/my', a: 'Patient' },
      { m: 'DELETE', e: '/appointments/:id', a: 'Patient → email' },
      { m: 'GET', e: '/appointments/doctor', a: 'Doctor' },
      { m: 'GET', e: '/appointments/all', a: 'Admin' },
      { m: 'PATCH', e: '/appointments/:id/status', a: 'Doctor, Admin' }
    ]},
    { x: 0.4, y: 3.15, hc: 'f59e0b', rows: [
      { m: 'GET', e: '/doctors', a: 'Public' },
      { m: 'GET', e: '/doctors/:id', a: 'Public' },
      { m: 'GET', e: '/doctors/:id/slots?date=', a: 'Public' },
      { m: 'POST', e: '/doctors', a: 'Admin' },
      { m: 'PUT', e: '/doctors/:id', a: 'Admin' },
      { m: 'DELETE', e: '/doctors/:id', a: 'Admin (soft)' }
    ]}
  ];

  tables.forEach(t => {
    s10.addShape(pptx.shapes.RECTANGLE, { x: t.x, y: t.y, w: 4.5, h: 0.3, fill: { color: t.hc } });
    s10.addText('Method', { margin: 0.05,  x: t.x + 0.1, y: t.y, w: 0.8, h: 0.3, fontSize: 9, bold: true, color: 'ffffff' });
    s10.addText('Endpoint', { margin: 0.05,  x: t.x + 1.0, y: t.y, w: 1.8, h: 0.3, fontSize: 9, bold: true, color: 'ffffff' });
    s10.addText('Access', { margin: 0.05,  x: t.x + 2.9, y: t.y, w: 1.5, h: 0.3, fontSize: 9, bold: true, color: 'ffffff' });
    
    t.rows.forEach((r, i) => {
      let ry = t.y + 0.3 + i * 0.25;
      s10.addShape(pptx.shapes.RECTANGLE, { x: t.x, y: ry, w: 4.5, h: 0.25, fill: { color: i % 2 === 0 ? 'f8fafc' : 'ffffff' }, line: { color: 'e2e8f0', width: 0.5 } });
      
      let badgeC = r.m === 'POST' ? 'dcfce7' : r.m === 'GET' ? 'dbeafe' : 'fee2e2';
      let badgeTc = r.m === 'POST' ? '16a34a' : r.m === 'GET' ? '1d4ed8' : 'dc2626';
      
      s10.addShape(pptx.shapes.ROUNDED_RECTANGLE, { x: t.x + 0.1, y: ry + 0.03, w: 0.6, h: 0.19, fill: { color: badgeC }, rectRadius: 0.1 });
      s10.addText(r.m, { margin: 0.05,  x: t.x + 0.1, y: ry + 0.03, w: 0.6, h: 0.19, fontSize: 7, bold: true, color: badgeTc, align: 'center', valign: 'middle' });
      
      s10.addText(r.e, { margin: 0.05,  x: t.x + 1.0, y: ry, w: 1.8, h: 0.25, fontSize: 8, color: '0f172a' });
      s10.addText(r.a, { margin: 0.05,  x: t.x + 2.9, y: ry, w: 1.5, h: 0.25, fontSize: 8, color: '64748b' });
    });
  });

  // Table 4 — Response Format
  s10.addShape(pptx.shapes.RECTANGLE, { x: 5.1, y: 3.15, w: 4.5, h: 0.3, fill: { color: '8b5cf6' } });
  s10.addText('Response Format Standard', { margin: 0.05,  x: 5.1, y: 3.15, w: 4.5, h: 0.3, fontSize: 9, bold: true, color: 'ffffff', align: 'center', valign: 'middle' });
  s10.addShape(pptx.shapes.RECTANGLE, { x: 5.1, y: 3.45, w: 4.5, h: 1.5, fill: { color: '1e1e2e' }, line: { color: '374151', width: 1 } });
  s10.addText('// Success\n{ "success": true,\n  "data": { ... } }\n\n// Error\n{ "success": false,\n  "message": "Error detail" }', { x: 5.2, y: 3.5, w: 4.3, h: 1.4, fontSize: 8, color: 'a5f3fc', fontFace: 'Courier New' });

  // ==========================================
  // SLIDE 11 — TEST ACCOUNTS & DEMO
  // ==========================================
  let s11 = pptx.addSlide();
  applyStandardLayout(s11, 'TESTING', 'Test Accounts & Credentials');

  // Admin Section
  s11.addShape(pptx.shapes.RECTANGLE, { x: 0.4, y: 1.0, w: 9.2, h: 0.95, fill: { color: 'fef2f2' }, line: { color: 'fecaca', width: 1 } });
  s11.addShape(pptx.shapes.ROUNDED_RECTANGLE, { x: 0.6, y: 1.25, w: 1.2, h: 0.4, fill: { color: 'f43f5e' }, rectRadius: 0.1 });
  s11.addText('ADMIN', { margin: 0.05,  x: 0.6, y: 1.25, w: 1.2, h: 0.4, fontSize: 10, bold: true, color: 'ffffff', align: 'center', valign: 'middle' });
  s11.addText('caresync@gmail.com', { margin: 0.05,  x: 2.0, y: 1.1, w: 4.0, h: 0.3, fontSize: 12, bold: true, color: '0f172a' });
  s11.addText('Password: Admin@123', { margin: 0.05,  x: 2.0, y: 1.4, w: 4.0, h: 0.25, fontSize: 10, color: '64748b' });
  s11.addText('Super Admin — created via node seed/seed.js — full system access', { margin: 0.05,  x: 2.0, y: 1.65, w: 5.0, h: 0.2, fontSize: 9, color: '94a3b8' });

  // Patients Section
  s11.addShape(pptx.shapes.RECTANGLE, { x: 0.4, y: 2.05, w: 4.4, h: 2.55, fill: { color: 'ffffff' }, line: { color: 'e2e8f0', width: 1 } });
  s11.addShape(pptx.shapes.RECTANGLE, { x: 0.4, y: 2.05, w: 4.4, h: 0.35, fill: { color: '2563eb' } });
  s11.addText('PATIENT ACCOUNTS', { margin: 0.05,  x: 0.4, y: 2.05, w: 4.4, h: 0.35, fontSize: 10, bold: true, color: 'ffffff', align: 'center', valign: 'middle' });
  
  let pAccounts = [
    ["rahul.sharma@gmail.com", "rahul123"],
    ["priya.nair@gmail.com", "priya123"],
    ["arun.kumar@gmail.com", "arun1234"],
    ["sneha.reddy@gmail.com", "sneha123"],
    ["amit.patel@gmail.com", "amit123"]
  ];
  pAccounts.forEach((p, i) => {
    let ry = 2.4 + i * 0.44;
    s11.addShape(pptx.shapes.RECTANGLE, { x: 0.4, y: ry, w: 4.4, h: 0.44, fill: { color: i % 2 === 0 ? 'f8fafc' : 'ffffff' } });
    s11.addText(p[0], { margin: 0.05,  x: 0.6, y: ry, w: 2.2, h: 0.44, fontSize: 9, color: '0f172a', valign: 'middle' });
    s11.addText(p[1], { margin: 0.05,  x: 2.8, y: ry, w: 1.4, h: 0.44, fontSize: 9, color: '64748b', valign: 'middle' });
  });

  // Doctors Section
  s11.addShape(pptx.shapes.RECTANGLE, { x: 5.1, y: 2.05, w: 4.5, h: 2.55, fill: { color: 'ffffff' }, line: { color: 'e2e8f0', width: 1 } });
  s11.addShape(pptx.shapes.RECTANGLE, { x: 5.1, y: 2.05, w: 4.5, h: 0.35, fill: { color: '10b981' } });
  s11.addText('DOCTOR ACCOUNTS', { margin: 0.05,  x: 5.1, y: 2.05, w: 4.5, h: 0.35, fontSize: 10, bold: true, color: 'ffffff', align: 'center', valign: 'middle' });

  let dAccounts = [
    ["rajesh.gupta@hospital.com", "Cardiology", "rajesh123"],
    ["sunita.rao@hospital.com", "Neurology", "sunita123"],
    ["vikram.malhotra@hospital.com", "Ortho", "vikram123"],
    ["neha.sen@hospital.com", "Pediatrics", "neha123"],
    ["anil.deshmukh@hospital.com", "Derma", "anil123"]
  ];
  dAccounts.forEach((d, i) => {
    let ry = 2.4 + i * 0.44;
    s11.addShape(pptx.shapes.RECTANGLE, { x: 5.1, y: ry, w: 4.5, h: 0.44, fill: { color: i % 2 === 0 ? 'f8fafc' : 'ffffff' } });
    s11.addText(d[0], { margin: 0.05,  x: 5.2, y: ry, w: 2.0, h: 0.44, fontSize: 9, color: '0f172a', valign: 'middle' });
    s11.addText(d[1], { margin: 0.05,  x: 7.3, y: ry, w: 1.0, h: 0.44, fontSize: 9, color: '10b981', valign: 'middle' });
    s11.addText(d[2], { margin: 0.05,  x: 8.4, y: ry, w: 1.0, h: 0.44, fontSize: 9, color: '64748b', valign: 'middle' });
  });

  // Bottom note
  s11.addShape(pptx.shapes.RECTANGLE, { x: 0.4, y: 4.72, w: 9.2, h: 0.6, fill: { color: 'f8fafc' }, line: { color: 'e2e8f0', width: 1 } });
  s11.addText('Run  node seed/seed.js  to create admin  •  Run  node seed/seed_custom.js  for all test data', { margin: 0.05,  x: 0.4, y: 4.72, w: 9.2, h: 0.6, fontSize: 10, color: '64748b', align: 'center', valign: 'middle' });

  // ==========================================
  // SLIDE 12 — CLOSING SLIDE
  // ==========================================
  let s12 = pptx.addSlide();
  s12.addShape(pptx.shapes.RECTANGLE, { x: 0, y: 0, w: 10, h: 5.63, fill: { color: '1d4ed8' } });

  s12.addShape(pptx.shapes.OVAL, { x: 8.5, y: -0.5, w: 2.5, h: 2.5, fill: { color: '1e40af', transparency: 50 } });
  s12.addShape(pptx.shapes.OVAL, { x: -0.5, y: 4.0, w: 2.0, h: 2.0, fill: { color: '1e40af', transparency: 50 } });
  s12.addShape(pptx.shapes.OVAL, { x: 7.5, y: 3.5, w: 1.5, h: 1.5, fill: { color: '2563eb', transparency: 60 } });

  s12.addText('CareSync', { margin: 0.05,  x: 0.5, y: 1.0, w: 9, h: 0.9, fontSize: 48, bold: true, color: 'ffffff', align: 'center' });
  s12.addText('Hospital Appointment Booking System — v2.1', { margin: 0.05,  x: 0.5, y: 1.95, w: 9, h: 0.4, fontSize: 16, color: '93c5fd', align: 'center' });

  s12.addShape(pptx.shapes.RECTANGLE, { x: 3.5, y: 2.5, w: 3, h: 0.04, fill: { color: '3b82f6' } });

  let cPills = [
    { t: 'React 18 + Vite', x: 1.3 },
    { t: 'Node.js + Express', x: 3.8 },
    { t: 'MongoDB Atlas', x: 6.3 },
    { t: 'JWT Auth + bcrypt', x: 1.3, r: 2 },
    { t: 'Nodemailer v2.1', x: 3.8, r: 2 },
    { t: 'jsPDF Receipts', x: 6.3, r: 2 }
  ];
  cPills.forEach(p => {
    let y = p.r === 2 ? 3.15 : 2.65;
    s12.addShape(pptx.shapes.ROUNDED_RECTANGLE, { x: p.x, y: y, w: 2.4, h: 0.38, fill: { color: '1e40af' }, rectRadius: 0.19 });
    s12.addText(p.t, { margin: 0.05,  x: p.x, y: y, w: 2.4, h: 0.38, fontSize: 9, bold: true, color: 'bfdbfe', align: 'center', valign: 'middle' });
  });

  s12.addText('Thank You', { margin: 0.05,  x: 0.5, y: 3.65, w: 9, h: 0.5, fontSize: 22, color: 'e0f2fe', align: 'center' });
  s12.addText('Built for seamless hospital appointment management', { margin: 0.05,  x: 0.5, y: 4.15, w: 9, h: 0.3, fontSize: 11, color: '93c5fd', align: 'center' });

  s12.addShape(pptx.shapes.RECTANGLE, { x: 0, y: 5.1, w: 10, h: 0.53, fill: { color: '1e3a8a' } });
  s12.addText('CareSync  •  caresync@gmail.com  •  Admin@123  •  React + Node.js + MongoDB', { margin: 0.05,  x: 0.5, y: 5.18, w: 9, h: 0.3, fontSize: 9, color: '93c5fd', align: 'center', valign: 'middle' });

  await pptx.writeFile({ fileName: 'CareSync_Presentation.pptx' });
  console.log('✅ CareSync_Presentation.pptx generated!');
})();
