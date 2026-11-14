# ProHealth — Client

React front end for the ProHealth clinic platform. Patients can find doctors,
book appointments, and manage their visits; doctors and admins get dedicated
dashboards.

## Tech stack

- React 18 + Create React App
- Material UI v7 and MUI X Data Grid
- React Router v6
- Axios (centralised in `src/api.js`)
- Chart.js for statistics

## Getting started

```bash
cd client
npm install
cp .env.example .env
npm start
```

The app opens at [http://localhost:3000](http://localhost:3000).

### Environment variables

| Variable | Description | Default |
| --- | --- | --- |
| `REACT_APP_API_URL` | Base URL of the API server | `https://pro-health-backend.vercel.app` |

Only variables prefixed with `REACT_APP_` are exposed to the browser.

## Scripts

- `npm start` — development server with hot reload
- `npm run build` — production build in `build/`
- `npm test` — interactive test runner

## Project structure

```
src/
  api.js                  Axios instance, error helpers, response normalisers
  App.js                  Routes and layout
  context/AuthContext.js  Session, login/register, profile and password actions
  components/             Shared layout, home, and service sections
  pages/                  Patient pages and doctor/admin dashboards
```

## Auth notes

- Login returns `{ token, user }`; the user object is stored as-is.
- Email verification is optional and does not block sign-in.
- A `401` from an authenticated request clears the stored session.
- Role-based redirects: patients to `/`, doctors to `/doctor-dashboard`,
  admins to `/admin-dashboard`.
