# CareSync — Hospital Appointment Booking System

> A full-stack Hospital Appointment Booking web application built with **React 18 + Vite**, **Node.js + Express**, and **MongoDB Atlas** — featuring real-time charts, email notifications, appointment calendar, advanced doctor search, and PDF receipts.

---

## 📋 Table of Contents

1. [Project Overview](#project-overview)
2. [Tech Stack](#tech-stack)
3. [Feature Highlights](#feature-highlights)
4. [Project Structure](#project-structure)
5. [Features by Role](#features-by-role)
6. [Authentication Rules](#authentication-rules)
7. [Getting Started](#getting-started)
8. [Environment Variables](#environment-variables)
9. [Seeding the Database](#seeding-the-database)
10. [API Reference](#api-reference)
11. [Test Accounts](#test-accounts)
12. [Design System](#design-system)
13. [Appointment Status Lifecycle](#appointment-status-lifecycle)

---

## Project Overview

**CareSync** is a role-based hospital appointment booking platform with three portals:

| Role | Access |
|------|--------|
| **Patient** | Browse & filter doctors, book appointments, view calendar, download PDF receipts |
| **Doctor** | View schedule calendar, manage appointments, mark completed/no-show |
| **Admin** | Manage departments & doctors, view analytics charts, oversee all appointments |

---

## Tech Stack

### Frontend
| Technology | Purpose |
|-----------|---------|
| React 18 + Vite | UI framework and build tool |
| Tailwind CSS v4 (`@tailwindcss/vite`) | Utility-first styling with custom theme tokens |
| Recharts | Admin dashboard analytics charts |
| react-calendar | Interactive appointment calendar |
| jsPDF + jspdf-autotable | Client-side PDF receipt generation |
| Axios | HTTP API client with JWT interceptor |
| React Router v6 | Client-side routing |

### Backend
| Technology | Purpose |
|-----------|---------|
| Node.js + Express.js | REST API server |
| MongoDB + Mongoose | Document database and ODM |
| JWT (jsonwebtoken) | Stateless token-based authentication |
| bcryptjs | Secure password hashing (10 salt rounds) |
| Nodemailer | Email notifications via Gmail SMTP |
| Nodemon | Auto-reload development server |
| dotenv | Environment variable management |
| CORS | Frontend–backend communication |

---

## Feature Highlights

### 📊 Admin Analytics Charts (Recharts)
Three interactive charts on the Admin Dashboard, all using **real live data**:
- **Appointments by Status** — Donut PieChart with status breakdown
- **Weekly Appointment Trend** — AreaChart showing last 7 days
- **Top Doctors by Bookings** — BarChart with rounded bars

### 🔔 Email Notifications (Nodemailer) — v2.1
Automatic emails sent on every booking and cancellation:
- **Patient Confirmation** — Appointment details with doctor, date, slot, fee
- **Doctor Notification** — New patient booking alert
- **Cancellation Email** — Sent to patient on cancel with rebook encouragement
- **Startup Connection Verification** — Server automatically verifies connection to `smtp.gmail.com:587` on start and logs connection results.
- **TLS Certificate Chain Fix** — Fully handles self-signed or proxy-injected SSL certificates by bypassing unauthorized rejections (`rejectUnauthorized: false`).
- **Resilient & Non-blocking** — Email delivery errors are caught in controllers, ensuring mail server outages never interrupt booking transactions.

### 📅 Appointment Calendar (react-calendar)
- Shown on both **Patient Dashboard** and **Doctor Dashboard**
- Colored status dots (🔵 confirmed, 🟢 completed, 🔴 cancelled, 🟡 pending)
- Click any date to see that day's appointment list with status badges

### 🔍 Advanced Doctor Search & Filter (FindDoctors)
5-way live AND-logic filter:
1. **Name Search** — live text filter
2. **Specialty** — dropdown from seeded departments
3. **Available Day** — filter by consultation day
4. **Fee Range** — min/max number inputs
5. **Sort By** — Highest Rated | Fee Low→High | Fee High→Low | Most Experienced

### 📄 PDF Receipt (jsPDF)
Professional A4 PDF receipt with:
- Blue CareSync branded header
- Status badge (green for confirmed, blue for completed)
- AutoTable with all appointment details
- CareSync branded footer
- Available in **My Appointments** (confirmed/completed tiles) and **Booking Success** screen

---

## Project Structure

```
hospital-booking/
├── client/                              # React 18 + Vite frontend
│   ├── index.html                       # Google Fonts (Plus Jakarta Sans + Inter)
│   └── src/
│       ├── api/
│       │   └── axios.js                 # Axios instance with JWT Bearer interceptor
│       ├── components/
│       │   ├── AppointmentCalendar.jsx  # react-calendar with colored status dots ✨NEW
│       │   ├── AppointmentTile.jsx      # Appointment card + PDF receipt button ✨UPDATED
│       │   ├── DoctorCard.jsx           # Doctor card with star rating + day chips
│       │   ├── Navbar.jsx               # Sticky top navbar with glassmorphism
│       │   ├── ProtectedRoute.jsx       # JWT-based route guard
│       │   ├── Sidebar.jsx              # Role-based sidebar navigation
│       │   ├── StatCard.jsx             # Dashboard metric card
│       │   ├── StatusBadge.jsx          # Colored status pill
│       │   ├── StepIndicator.jsx        # Booking wizard step progress
│       │   └── Toast.jsx                # Toast notification popup
│       ├── context/
│       │   ├── AuthContext.jsx          # Global auth state + login/register/logout
│       │   └── ToastContext.jsx         # Toast provider
│       ├── hooks/
│       │   └── useToast.js              # Toast notification hook
│       ├── pages/
│       │   ├── Home.jsx                 # Public landing page
│       │   ├── Login.jsx                # Login form
│       │   ├── Register.jsx             # Register form (Patient / Doctor only)
│       │   ├── admin/
│       │   │   ├── AdminDashboard.jsx   # Stats + 3 Recharts charts ✨UPDATED
│       │   │   ├── AllAppointments.jsx  # Full appointment log with status filters
│       │   │   ├── Departments.jsx      # Create + Edit specialty departments
│       │   │   └── ManageDoctors.jsx    # Add + Edit + Deactivate doctors
│       │   ├── doctor/
│       │   │   ├── DoctorDashboard.jsx  # Today's schedule + Calendar ✨UPDATED
│       │   │   └── DoctorAppointments.jsx
│       │   └── patient/
│       │       ├── PatientDashboard.jsx # Stats + upcoming + Calendar ✨UPDATED
│       │       ├── BookAppointment.jsx  # 4-step wizard + PDF on success ✨UPDATED
│       │       ├── FindDoctors.jsx      # 5-way search & filter ✨UPDATED
│       │       └── MyAppointments.jsx   # Tabs + PDF receipt buttons ✨UPDATED
│       ├── utils/
│       │   └── generateReceipt.js       # jsPDF A4 receipt generator ✨NEW
│       ├── App.jsx                      # Router + role-based protected routes
│       └── index.css                    # Tailwind v4 @theme tokens + react-calendar CSS
│
├── server/                              # Node.js + Express backend
│   ├── config/
│   │   └── db.js                        # Mongoose MongoDB connection
│   ├── controllers/
│   │   ├── auth.controller.js           # Register, Login, GetMe (strict role rules)
│   │   ├── doctor.controller.js         # CRUD for doctor profiles
│   │   ├── department.controller.js     # CRUD for departments
│   │   └── appointment.controller.js    # Booking, cancel + email triggers ✨UPDATED
│   ├── middleware/
│   │   ├── auth.middleware.js           # verifyToken + requireRole
│   │   └── error.middleware.js          # Global error handler
│   ├── models/
│   │   ├── User.js                      # User schema (bcrypt pre-save hook)
│   │   ├── Doctor.js                    # Doctor profile schema
│   │   ├── Department.js                # Specialty department schema
│   │   └── Appointment.js               # Appointment schema
│   ├── routes/
│   │   ├── auth.routes.js
│   │   ├── doctor.routes.js
│   │   ├── department.routes.js
│   │   └── appointment.routes.js
│   ├── seed/
│   │   ├── seed.js                      # Seeds caresync@gmail.com admin (idempotent)
│   │   └── seed_custom.js               # Seeds 10 specialties, 10 doctors, 5 patients
│   ├── utils/
│   │   └── mailer.js                    # Nodemailer email utility (3 functions) ✨NEW
│   ├── server.js                        # Express entry point
│   └── .env                             # Environment configuration
│
├── test-users.md                        # All test credentials reference
└── README.md
```

---

## Features by Role

### 🧑‍⚕️ Patient
- Register as a Patient
- Browse doctors with **5-way search & filter** (name, specialty, day, fee range, sort)
- Book an appointment via a **4-step wizard** (Specialty → Doctor → Schedule → Confirm)
- View **interactive appointment calendar** with colored status dots
- View upcoming / completed / cancelled appointments in tab view
- **Cancel** pending appointments
- **Download PDF receipt** for confirmed or completed appointments
- Receive **email confirmation** on booking and cancellation

### 👨‍⚕️ Doctor
- Register as a Doctor (with specialty, experience, fee)
- View **appointment calendar** with date-click detail panel
- View today's consultations in dashboard
- Mark appointments as Completed or No-Show
- Receive **email notification** when a new patient books

### 🔧 Admin
- **Specialty Departments**: Create, edit (name, icon, description)
- **Manage Doctors**: Add, edit, deactivate/activate, delete doctors
- **All Appointments**: View, filter, and manage all hospital appointments
- **Dashboard Analytics**: 3 live Recharts charts (Pie, Area, Bar) with real data

---

## Authentication Rules

### Register (`POST /api/auth/register`)
- **Patient** and **Doctor** can register freely from the Register page
- The role selector shows **only Patient and Doctor** — no Admin option visible
- If `role: "admin"` is sent in the request body → **`403 Cannot register as admin`**
- Role is always server-side forced to `"patient"` or `"doctor"`

### Login (`POST /api/auth/login`)
- **Patient** → normal login → `/patient/dashboard`
- **Doctor** → normal login → `/doctor/dashboard`
- **Admin** → **only** `caresync@gmail.com` / `Admin@123` → `/admin/dashboard`
- Any user with `role: "admin"` whose email is not `caresync@gmail.com` → **`403 Unauthorized access`**

---

## Getting Started

### Prerequisites
- Node.js v18 or higher
- npm v9 or higher
- MongoDB Atlas account (free tier works)

### 1. Clone the Repository
```bash
git clone <repository-url>
cd hospital-booking
```

### 2. Install Dependencies
```bash
# Backend
cd server && npm install

# Frontend
cd ../client && npm install
```

### 3. Configure Environment Variables
Create `server/.env` (see section below).

### 4. Seed the Database
```bash
cd server

# Step 1 — Create the admin account (idempotent — safe to re-run)
node seed/seed.js

# Step 2 — Seed 10 specialties + 10 doctors + 5 patients
node seed/seed_custom.js
```

### 5. Start Backend
```bash
cd server
npm run dev
# → http://localhost:5000
```

### 6. Start Frontend
```bash
cd client
npm run dev
# → http://localhost:5173
```

### Port Conflict Fix (Windows)
```powershell
netstat -ano | findstr :5000
taskkill /PID <PID> /F
```

---

## Environment Variables

Create `server/.env` with these values:

```env
PORT=5000
MONGO_URI=mongodb+srv://<user>:<password>@cluster0.mongodb.net/hospital_booking
CLIENT_URL=http://localhost:5173
JWT_SECRET=mySuperSecretKey123
JWT_EXPIRE=7d
EMAIL_USER=your-gmail@gmail.com
EMAIL_PASS=your-gmail-app-password
```

| Variable | Description |
|----------|-------------|
| `PORT` | Express server port |
| `MONGO_URI` | MongoDB Atlas connection string |
| `CLIENT_URL` | Frontend origin for CORS whitelist |
| `JWT_SECRET` | Secret for signing/verifying JWTs |
| `JWT_EXPIRE` | Token expiry (e.g. `7d`) |
| `EMAIL_USER` | Gmail address for sending notifications |
| `EMAIL_PASS` | Gmail App Password (not account password) |

> **Gmail App Password**: Go to Google Account → Security → 2-Step Verification → App Passwords → Generate for "Mail".

---

## Seeding the Database

### `node seed/seed.js` — Admin Account
Creates the one and only admin user. **Idempotent** (safe to run multiple times).

| Field | Value |
|-------|-------|
| Name | CareSync Admin |
| Email | `caresync@gmail.com` |
| Password | `Admin@123` |
| Role | `admin` |

### `node seed/seed_custom.js` — Full Test Data
Seeds:
- 10 specialty departments with icons and descriptions
- 10 doctors (one per specialty, with experience, fee, time slots, available days)
- 5 patient accounts
- 5 additional admin accounts

---

## API Reference

**Base URL**: `http://localhost:5000/api`

### Auth
| Method | Endpoint | Auth | Description |
|--------|----------|------|-------------|
| POST | `/auth/register` | Public | Register patient or doctor |
| POST | `/auth/login` | Public | Login, returns JWT |
| GET | `/auth/me` | Bearer | Get current user |

### Doctors
| Method | Endpoint | Auth | Description |
|--------|----------|------|-------------|
| GET | `/doctors` | Public | List all doctors |
| GET | `/doctors/:id` | Public | Get single doctor |
| GET | `/doctors/:id/slots?date=YYYY-MM-DD` | Public | Get booked slots for a date |
| POST | `/doctors` | Admin | Create doctor |
| PUT | `/doctors/:id` | Admin | Update doctor |
| DELETE | `/doctors/:id` | Admin | Soft-delete (isActive=false) |

### Departments
| Method | Endpoint | Auth | Description |
|--------|----------|------|-------------|
| GET | `/departments` | Public | List all departments |
| POST | `/departments` | Admin | Create department |
| PUT | `/departments/:id` | Admin | Update department |

### Appointments
| Method | Endpoint | Auth | Description |
|--------|----------|------|-------------|
| POST | `/appointments` | Patient | Book appointment → triggers emails |
| GET | `/appointments/my` | Patient | Get own appointments |
| DELETE | `/appointments/:id` | Patient | Cancel → triggers email |
| GET | `/appointments/doctor` | Doctor | Get doctor's schedule |
| GET | `/appointments/all` | Admin | Get all appointments |
| PATCH | `/appointments/:id/status` | Doctor, Admin | Update status |

### Response Format
```json
{ "success": true,  "data": { ... } }
{ "success": false, "message": "Human-readable error" }
```

---

## Test Accounts

> Full credentials also in [`test-users.md`](./test-users.md)

### Super Admin (created by seed.js)
| Email | Password |
|-------|----------|
| `caresync@gmail.com` | `Admin@123` |

### Additional Admins (seed_custom.js)
| Email | Password |
|-------|----------|
| `admin.amit@hospital.com` | `admin123` |
| `admin.riya@hospital.com` | `admin234` |
| `admin.karan@hospital.com` | `admin345` |
| `admin.pooja@hospital.com` | `admin456` |
| `admin.sunil@hospital.com` | `admin567` |

### Patients
| Email | Password |
|-------|----------|
| `rahul.sharma@gmail.com` | `rahul123` |
| `priya.nair@gmail.com` | `priya123` |
| `arun.kumar@gmail.com` | `arun1234` |
| `sneha.reddy@gmail.com` | `sneha123` |
| `amit.patel@gmail.com` | `amit123` |

### Doctors
| Doctor | Email | Specialty | Fee | Password |
|--------|-------|-----------|-----|----------|
| Dr. Rajesh Gupta | `rajesh.gupta@hospital.com` | Cardiology | ₹800 | `rajesh123` |
| Dr. Sunita Rao | `sunita.rao@hospital.com` | Neurology | ₹900 | `sunita123` |
| Dr. Vikram Malhotra | `vikram.malhotra@hospital.com` | Orthopedics | ₹700 | `vikram123` |
| Dr. Neha Sen | `neha.sen@hospital.com` | Pediatrics | ₹600 | `neha123` |
| Dr. Anil Deshmukh | `anil.deshmukh@hospital.com` | Dermatology | ₹750 | `anil123` |
| Dr. Priya Nair | `priya.nair.doctor@hospital.com` | ENT | ₹650 | `priya123` |
| Dr. Amit Verma | `amit.verma@hospital.com` | Ophthalmology | ₹700 | `amit123` |
| Dr. Shalini Joshi | `shalini.joshi@hospital.com` | Gastroenterology | ₹850 | `shalini123` |
| Dr. Rohit Kapoor | `rohit.kapoor@hospital.com` | Psychiatry | ₹1000 | `rohit123` |
| Dr. Meera Saxena | `meera.saxena@hospital.com` | Gynecology | ₹800 | `meera123` |

---

## Design System

| Token | Value | Usage |
|-------|-------|-------|
| `--color-primary` | `#2563eb` | Buttons, links, highlights |
| `--color-primary-dark` | `#1d4ed8` | Hover states |
| `--color-primary-light` | `#eff6ff` | Badge backgrounds |
| `--color-success` | `#10b981` | Confirmed status, doctor role |
| `--color-warning` | `#f59e0b` | Pending status, ratings |
| `--color-danger` | `#f43f5e` | Errors, cancelled status |
| `--color-muted` | `#94a3b8` | Subtitles, placeholders |
| `--color-border-custom` | `#e2e8f0` | Card outlines, dividers |
| `--color-bg` | `#f8fafc` | Page background |
| `--font-display` | Plus Jakarta Sans | Headings, labels |
| `--font-sans` | Inter | Body text, inputs |

---

## Appointment Status Lifecycle

```
Patient Books
      │
      ▼
  [confirmed]  ──── Doctor/Admin Marks ────►  [completed]
      │
      │── Doctor/Admin Marks ─────────────►  [no-show]
      │
      │── Patient/Admin Cancels ───────────►  [cancelled]
```

---

## Email Notification Flow

```
Patient Books Appointment
  ├── Patient receives: "✅ Appointment Confirmed — CareSync"
  └── Doctor receives:  "📅 New Appointment Scheduled — CareSync"

Patient Cancels Appointment
  └── Patient receives: "❌ Appointment Cancelled — CareSync"

Note: Email failures are silent — they never break the booking/cancel API response.
```

---

## PDF Receipt Format

Generated via `jsPDF` on the client — no server call needed.

```
┌─────────────────────────────────────────────┐
│          CareSync  (blue header)            │
│      Hospital Appointment Receipt           │
│         Appointment ID: #XXXXXXXX           │
├─────────────────────────────────────────────┤
│              ✓ CONFIRMED                    │
├─────────────────────────────────────────────┤
│  Patient Name    │  John Doe                │
│  Doctor          │  Dr. Rajesh Gupta        │
│  Specialty       │  Cardiology              │
│  Date            │  2024-06-23              │
│  Time Slot       │  09:30                   │
│  Fee             │  Rs. 800                 │
│  Status          │  CONFIRMED               │
│  Booked On       │  23 June 2024            │
├─────────────────────────────────────────────┤
│     Thank you for choosing CareSync        │
│      support@caresync.com                  │
│   © 2024 CareSync — All rights reserved    │
└─────────────────────────────────────────────┘
```

---

## 📽️ Project Presentation (PPT) & Slideshow Structure

This guide outlines a slide-by-slide structure you can use to build a PowerPoint presentation or presentation deck for CareSync.

### 🛝 Slide 1: Title & Project Cover
* **Title**: CareSync — Hospital Appointment Booking System
* **Subtitle**: A Modern, Role-Based Web Application for Medical Management
* **Key Details**: Built with React 18, Node.js, Express, MongoDB Atlas, and Tailwind CSS v4.
* **Visual Ideas**: CareSync logo branding, clean hospital mockups or icons.

### 🛝 Slide 2: Problem Statement & Objectives
* **Challenges Solved**:
  - Inefficient, manual patient registration and booking schedules.
  - Lack of timely notifications leading to high appointment no-show rates.
  - Complex doctor discovery (difficulty filtering by specialty, day, or fee).
  - Lack of automated receipts and modern, responsive administrative analytics.
* **Objectives**:
  - Provide a frictionless, self-service dashboard portal for patients, doctors, and administrators.
  - Automate notifications and billing receipts via server-triggered emails and client-side PDFs.

### 🛝 Slide 3: System Architecture & Tech Stack
* **Architecture**: Three-Tier Client-Server Architecture (SPA Frontend ⇋ RESTful API Backend ⇋ Database).
* **Frontend Stack**: React 18, Vite (bundler), Tailwind CSS v4, Recharts (analytics), jsPDF, and react-calendar.
* **Backend Stack**: Node.js + Express, Mongoose (MongoDB ODM), JWT (authentication), bcryptjs (hashing), and Nodemailer (SMTP).
* **Authentication Flow**:
  - Secure stateless JWT sessions stored as HTTP authorization headers.
  - Encrypted password storage using 10 rounds of salt bcrypt hashing.

### 🛝 Slide 4: Authentication Security Rules (Key Highlight)
* **Registration Controls**:
  - Public registration open to **Patients** and **Doctors** only.
  - Admin registration is strictly blocked at the API level (returns `403 Forbidden`).
* **Login Safeguards**:
  - Patients & Doctors login normally to retrieve tokens.
  - **Super Admin** portal access is restricted exclusively to `caresync@gmail.com` with password `Admin@123`. Any other admin attempt returns a `403 Unauthorized Access` error.

### 🛝 Slide 5: Core Features — Patient Portal
* **Key Capabilities**:
  - **5-Way Search & Filter**: Instant name searches, specialty matching, availability days, fee sliders, and multiple sorting methods.
  - **4-Step Booking Wizard**: High-fidelity booking workflow (Specialty → Doctor → Time Slot → Confirmation).
  - **Interactive Calendar**: Calendar overview displaying colored status dots per appointment.
  - **jsPDF Billing Receipts**: Generate and download structured billing receipts directly on the client.

### 🛝 Slide 6: Core Features — Doctor & Admin Portals
* **Doctor Portal**:
  - Dedicated daily schedule breakdown of active patient consults.
  - Interactive appointment calendar displaying status.
  - Toggles to transition appointment status (Mark Complete, Cancel, No-Show).
* **Admin Portal**:
  - **Specialty Management**: CRUD controls over active medical departments.
  - **Practitioner Registry**: Onboard new doctors, edit fees/hours, and deactivate profiles.
  - **Recharts Analytics**: Dynamic dashboard showing Booking Breakdown (Pie Chart), Weekly Appointment Trend (Area Chart), and Top Performing Doctors (Bar Chart).

### 🛝 Slide 7: Resilient Email System (Nodemailer v2.1)
* **Core Channels**:
  - Patient Confirmation (booking details & consultation info).
  - Patient Cancellation (cancel notices & rebook tips).
  - Doctor Notification (new patient booking alerts).
* **Robust Configuration**:
  - Uses `Host: smtp.gmail.com` and `Port: 587`.
  - Configured with `tls: { rejectUnauthorized: false }` to prevent corporate firewalls or corporate TLS proxy intercepts from throwing self-signed certificate chain exceptions.
  - Verification run via `transporter.verify()` on startup with clear error logs.
  - Fully caught non-blocking try-catch blocks to prevent email delivery failure from crashing booking APIs.

### 🛝 Slide 8: Database Schema Design (MongoDB)
* **User Collection**: Credentials, salt hashes, and role enums.
* **Doctor Collection**: Specialty links, weekly available days array, time slots array, active status, ratings, and consult fees.
* **Department Collection**: Department name, emoji icon, and long description.
* **Appointment Collection**: Patient/Doctor/Department references, date, slot string, status enum, and custom doctor notes.

### 🛝 Slide 9: Project Accomplishments & Testing
* **System Testing**:
  - Verified database seeding integrity using customized test accounts.
  - Production build successfully optimized and generated via Vite.
  - SMTP connection successfully verified on startup.
  - Integration verified via automated browser subagents completing E2E booking.

---

*CareSync Hospital Appointment Booking System — v2.1 with 6 major upgrades & SMTP fixes*
