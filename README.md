# ProHealth

A full-stack clinic platform: patients find doctors and book appointments,
doctors manage their schedule, and admins monitor the clinic.

- `client/` — React + Material UI front end
- `server/` — Express + MongoDB API

## Quick start

### 1. API

```bash
cd server
npm install
cp .env.example .env   # fill in MongoDB, JWT, email, Cloudinary values
npm run dev
```

### 2. Client

```bash
cd client
npm install
cp .env.example .env   # point REACT_APP_API_URL at the API
npm start
```

Open [http://localhost:3000](http://localhost:3000).

## Core flows

- **Patients** — browse doctors, pick an open 30-minute slot, book, and manage
  appointments from `/my-appointments`.
- **Doctors** — `/doctor-dashboard` shows today's/upcoming visits, lets them
  confirm or complete appointments, and displays remaining open slots.
- **Admins** — `/admin-dashboard` covers all appointments, per-doctor schedules,
  users, doctors, availability lookup, and statistics.

## Security

- `.env` files are ignored by git; use the provided `.env.example` templates.
- Never commit real database, JWT, email, or Cloudinary credentials.
- Credentials that were ever committed should be rotated.
- The API validates input, scopes appointment access by role, and rate limits
  contact messages.

## More documentation

- [`client/README.md`](client/README.md)
- [`server/README.md`](server/README.md)
