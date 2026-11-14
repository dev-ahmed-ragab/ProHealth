# ProHealth — API

Express + MongoDB API for the ProHealth clinic platform. It handles accounts,
doctor discovery, appointment booking/availability, profile images, and contact
messages.

## Setup

```bash
cd server
npm install
cp .env.example .env
npm run dev
```

The API listens on `http://localhost:5000` by default.

`server/.env` must never be committed. All production values are configured in
the hosting dashboard (for example, Vercel project environment variables).

### Required environment variables

| Variable | Purpose |
| --- | --- |
| `MONGODB_URI` | MongoDB connection string (also accepts `MONGO_URI`) |
| `JWT_SECRET` | Secret used to sign auth tokens |
| `JWT_EXPIRE` | Token lifetime, e.g. `7d` |
| `CLIENT_URL` / `CLIENT_URLS` | Allowed front-end origin(s), comma separated |
| `EMAIL_HOST`, `EMAIL_PORT`, `EMAIL_USER`, `EMAIL_PASS` | SMTP credentials |
| `CONTACT_EMAIL` | Inbox for contact messages (falls back to `EMAIL_USER`) |
| `CLOUDINARY_CLOUD_NAME`, `CLOUDINARY_API_KEY`, `CLOUDINARY_API_SECRET` | Profile image uploads |

## Scripts

- `npm run dev` — nodemon with reload
- `npm start` — production start

## API overview

### Auth (`/api/auth`)

- `POST /register` — create an account (verification email sent when configured)
- `POST /login` — returns `{ token, user }`
- `GET /me` — current user
- `GET /verify-email/:token`, `POST /resend-verification`
- `POST /forgot-password`, `POST /reset-password/:token`

### Users (`/api/users`)

- `GET /` — admin user list (`limit`, `page`, `search`)
- `GET /protected/doctors` — admin/doctor doctor list
- `GET /doctors` — public doctor list
- `GET /doctors/:id` — public doctor profile
- `GET /:id`, `PUT /:id`, `DELETE /:id` — account management
- `PUT /:id/password` — change password
- Profile picture upload/edit endpoints

### Appointments (`/api/appointments`)

- `GET /` — list scoped to the caller (`status`, `from`, `to`, `page`, `limit`)
- `GET /available/:doctorId/:date` — open 30-minute slots
- `GET /doctor/:doctorId` — one doctor's appointments (admin or that doctor)
- `POST /` — book an appointment
- `GET /:id`, `PUT /:id` — view or reschedule
- `PATCH /:id/status` — update status
- `POST /:id/cancel` — cancel and free the slot
- `DELETE /:id` — delete (admin)

Completed or cancelled appointments cannot be modified.

### Contact (`/api/contact`)

- `POST /` — send a contact message (validated, rate limited, HTML escaped)

## Production notes

- Create the database indexes by starting the server once against the target
  database. Older deployments may still have a unique
  `{ doctor, date, startTime }` index; drop it if rebooking a cancelled slot
  fails:

  ```js
  db.appointments.dropIndex('doctor_1_date_1_startTime_1');
  ```

- Rotate any credentials that were previously committed to the repository.
