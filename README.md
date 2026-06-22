# CareSync - Hospital Appointment Booking System

CareSync is a full-stack Hospital Appointment Booking web application built with Node.js, Express, MongoDB, React, Vite, and Tailwind CSS v4.

---

## 🚀 Startup Instructions

Follow these steps to launch the application:

### 1. Install Dependencies
Run in separate terminals, or sequentially:
```bash
# Install server dependencies
cd server
npm install

# Install client dependencies
cd ../client
npm install
```

### 2. Configure Environment Variables
Verify or edit `server/.env` parameters:
* `PORT=5000`
* `MONGO_URI=mongodb://127.0.0.1:27017/hospital_booking`
* `JWT_SECRET=hospital_super_secret_key_2024`
* `CLIENT_URL=http://localhost:5173`

### 3. Seed the Database
Run the seed script from the server folder to register initial departments, doctors, and credentials:
```bash
cd server
node seed/seed.js
```

### 4. Run Server
Launch the backend API server in hot-reload mode:
```bash
cd server
npm run dev
```
Backend runs at: [http://localhost:5000](http://localhost:5000)

### 5. Run Client
Launch the frontend Vite development server:
```bash
cd client
npm run dev
```
Frontend runs at: [http://localhost:5173](http://localhost:5173)

---

## 🔑 Seeding User Credentials

Seeding registers the following test accounts:

* **Administrator Profile**
  * **Email**: `admin@hospital.com`
  * **Password**: `admin123`

* **Patient Profile**
  * **Email**: `patient@mail.com`
  * **Password**: `patient123`

* **Doctor Profiles**
  * **Email**: `priya@hospital.com` (Cardiology)
  * **Email**: `arjun@hospital.com` (Cardiology)
  * **Email**: `kavitha@hospital.com` (Neurology)
  * **Email**: `ramesh@hospital.com` (Neurology)
  * **Email**: `sunita@hospital.com` (Orthopedics)
  * **Email**: `vikram@hospital.com` (Pediatrics)
  * **Email**: `meena@hospital.com` (Dermatology)
  * **Email**: `arun@hospital.com` (ENT)
  * **Password**: `doc123` (Shared across all doctor logins)

---

## 🎨 Theme Colors & Design System

The system uses a clean light medical UI styling:
* **Primary (Deep Blue)**: `#0A6EBD`
* **Accent (Teal)**: `#00C9A7`
* **Success (Green)**: `#10B981`
* **Warning (Orange)**: `#F59E0B`
* **Danger (Red)**: `#EF4444`
* **Background (Soft Blue)**: `#F0F6FF`
* **Typography**: `'Plus Jakarta Sans'` (headings) + `'Inter'` (body)
