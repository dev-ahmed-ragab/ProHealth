# 🏥 ProHealth — Modern Healthcare & Clinic Management System

[![Frontend Status](https://img.shields.io/badge/Frontend-Vercel-black?logo=vercel)](https://pro-health-wine.vercel.app)
[![Backend Status](https://img.shields.io/badge/Backend-Express%20%2B%20Vercel-blue?logo=node.js)](https://pro-health-backend.vercel.app)
[![Database](https://img.shields.io/badge/Database-MongoDB%20Atlas-green?logo=mongodb)](https://www.mongodb.com/atlas)
[![License: ISC](https://img.shields.io/badge/License-ISC-yellow.svg)](LICENSE)

A complete, production-ready healthcare management platform designed for clinics, hospitals, and private practices. Patients can browse specialized doctors, book appointments into real-time available slots, and track visit histories. Doctors manage clinical schedules, confirm patient visits, and inspect upcoming appointments. Administrators have full system oversight with live statistics, user management, and appointment controls.

---

## 🌟 Live Deployments

- **Frontend Application:** [https://pro-health-wine.vercel.app](https://pro-health-wine.vercel.app)
- **Backend API Server:** [https://pro-health-backend.vercel.app](https://pro-health-backend.vercel.app)
- **API Health Check:** [https://pro-health-backend.vercel.app/api/health](https://pro-health-backend.vercel.app/api/health)

---

## 🛠️ Technology Stack

| Layer | Technologies |
| :--- | :--- |
| **Frontend** | React 18, React Router v6, Material UI (MUI v7/v8), Emotion, Axios, Chart.js |
| **Backend** | Node.js, Express.js (ES Modules), Mongoose, JWT (JSON Web Tokens), Bcrypt.js |
| **Database** | MongoDB Atlas (Cloud Database) |
| **Media & Storage** | Cloudinary (Doctor & Patient Avatars) |
| **Notifications** | Nodemailer (Gmail SMTP for transactional confirmations & contact) |
| **Deployment** | Vercel Serverless Functions (`@vercel/node`) + Vercel Static Hosting |

---

## 📁 Repository Structure

```text
ProHealth/
├── client/                     # Front-end React SPA
│   ├── public/                 # Static assets, images, favicon & manifest
│   ├── src/
│   │   ├── components/         # Reusable UI sections (Home, Layer, Services)
│   │   ├── context/            # Global AuthContext & state management
│   │   ├── pages/              # Route views (Home, Doctors, Dashboards, Appointments)
│   │   ├── api.js              # Centralized Axios instance with auth interceptors
│   │   └── App.js              # Application routes & layout
│   ├── vercel.json             # Vercel SPA client rewrite rules
│   └── package.json
│
├── server/                     # Back-end Express REST API
│   ├── config/                 # Cloudinary & database connections
│   ├── controllers/            # Auth, Appointment, User & Contact business logic
│   ├── middleware/             # Role authorization, file upload, request validators
│   ├── models/                 # Mongoose schemas (User, Appointment, Slot)
│   ├── routes/                 # Express API routes
│   ├── utils/                  # Nodemailer email transporter
│   ├── vercel.json             # Vercel Serverless routing configuration
│   └── package.json
└── README.md
```

---

## 🚀 Quick Start (Local Development)

### Prerequisites
- Node.js (v18 or higher recommended)
- MongoDB Atlas cluster URI or local MongoDB instance

### 1. Backend Setup

```bash
cd server
npm install
```

Create a `.env` file in `server/` (copy from `.env.example`):

```ini
PORT=5000
NODE_ENV=development
MONGODB_URI=mongodb+srv://admin:admin@cluster0.xjgqihz.mongodb.net/prohealth?retryWrites=true&w=majority
JWT_SECRET=VFkXDJK3hj7Rfwny451pNM2Yla8dcstobxZBHUrPevTQ0zSg
JWT_EXPIRE=7d
CLIENT_URL=http://localhost:3000
CLIENT_URLS=http://localhost:3000,http://127.0.0.1:3000,https://pro-health-wine.vercel.app

# Optional (for email notifications & image uploads)
EMAIL_HOST=smtp.gmail.com
EMAIL_PORT=587
EMAIL_USER=your-email@gmail.com
EMAIL_PASS=your-google-app-password
CONTACT_EMAIL=your-email@gmail.com
APP_NAME=ProHealth

CLOUDINARY_CLOUD_NAME=dn7s97ydy
CLOUDINARY_API_KEY=661839662643331
CLOUDINARY_API_SECRET=your-cloudinary-secret
```

Start the API server:
```bash
npm start
# Server starts on http://localhost:5000
```

### 2. Frontend Setup

```bash
cd client
npm install
```

Create a `.env` file in `client/` (copy from `.env.example`):

```ini
REACT_APP_API_URL=http://localhost:5000
```

Start the React development server:
```bash
npm start
# Opens http://localhost:3000 in your browser
```

---

## 🔐 Default Demo Accounts

For demonstration and testing purposes, use the seeded accounts:

| Role | Email | Password | Permissions |
| :--- | :--- | :--- | :--- |
| **Administrator** | `admin@prohealth.dev` | `Admin1234` | Full access to `/admin-dashboard`, user role assignment, statistics |
| **Doctor (Cardiology)** | `sarah.doctor@prohealth.dev` | `Doctor1234` | Access to `/doctor-dashboard`, schedule management, status updates |
| **Doctor (Pediatrics)** | `omar.doctor@prohealth.dev` | `Doctor1234` | Access to `/doctor-dashboard`, appointment slots |

---

## ☁️ Deployment Guide (Vercel)

The project is structured to deploy smoothly as two linked Vercel projects:

### 1. Deploying the Backend (`pro-health-backend`)
1. Create a new project in Vercel from your GitHub repository.
2. In **Project Settings** -> **General** -> Set **Root Directory** to `server`.
3. In **Settings** -> **Environment Variables**, configure the following variables:
   - `MONGODB_URI`: `mongodb+srv://admin:admin@cluster0.xjgqihz.mongodb.net/prohealth?retryWrites=true&w=majority`
   - `JWT_SECRET`: A strong secret string (e.g. `VFkXDJK3hj7Rfwny451pNM2Yla8dcstobxZBHUrPevTQ0zSg`)
   - `CLIENT_URLS`: `https://pro-health-wine.vercel.app,http://localhost:3000`
   - `CLOUDINARY_CLOUD_NAME`: `dn7s97ydy`
   - `CLOUDINARY_API_KEY`: `661839662643331`
   - `CLOUDINARY_API_SECRET`: *(your secret)*
4. **Important**: In MongoDB Atlas -> **Network Access**, ensure `0.0.0.0/0` (Allow Access from Anywhere) is active, otherwise Vercel serverless IPs will be blocked.

### 2. Deploying the Frontend (`pro-health`)
1. Create a second project in Vercel from the same repository.
2. In **Project Settings** -> **General** -> Set **Root Directory** to `client`.
3. In **Settings** -> **Environment Variables**, add:
   - `REACT_APP_API_URL`: `https://pro-health-backend.vercel.app`
4. The client includes `vercel.json` with SPA routing rewrites to ensure deep links (e.g. `/find-doctor`, `/login`) never result in 404 on refresh.

---

## 📡 Key API Endpoints

### Authentication & Users
- `POST /api/auth/register` — Register a new patient account
- `POST /api/auth/login` — Sign in and receive JWT token
- `GET /api/auth/me` — Get current logged-in user details
- `POST /api/auth/forgot-password` — Request password reset email
- `GET /api/users/public/doctors` — Public list of certified clinic doctors
- `GET /api/users/public/doctors/:id` — Public doctor profile and biography

### Appointments
- `GET /api/appointments` — List appointments (scoped by user/doctor/admin role)
- `POST /api/appointments` — Book a new appointment slot
- `GET /api/appointments/available/:doctorId/:date` — Get available 30-minute slots
- `PUT /api/appointments/:id/status` — Update appointment status (`pending`, `confirmed`, `completed`)
- `POST /api/appointments/:id/cancel` — Cancel an appointment with a reason

### Contact & Support
- `POST /api/contact` — Rate-limited contact inquiry form

---

## 🛡️ Security Best Practices
- Passwords salted and hashed with **Bcrypt** (cost factor 10).
- Strict **CORS whitelist** restricting requests to designated client origins.
- MongoDB injection prevention & **Express Validator** sanitization.
- Rate-limiting protection on sensitive endpoints (Contact Form, Auth).
- Sensitive environment variables (`.env`) excluded from version control via `.gitignore`.
