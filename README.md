# Sales Workspace

Monorepo project with a React client and a NestJS server for a simple CRM workflow.

## Project Structure

```text
<project-root>/
  client/   # React + TypeScript frontend
  server/   # NestJS + TypeORM backend
```

## Tech Stack

- Frontend: React, TypeScript, Redux Toolkit, React Router, Tailwind CSS
- Backend: NestJS, TypeORM, PostgreSQL, JWT auth, Swagger
- Database: PostgreSQL (local or managed, e.g. Neon)

## Features

- Authentication: register, login, refresh token
- Dashboard with team and leads metrics
- Team management
- Leads pipeline
- Swagger API docs
- Light/Dark theme toggle

## Local Setup

### 1) Clone and install dependencies

```bash
git clone https://github.com/<your-username>/<your-repo-name>.git
cd <your-repo-name>
cd server && npm install
cd ../client && npm install
```

### 2) Start backend

From `server`:

```bash
npm run start:dev
```

Backend runs on `http://localhost:3000`.

### 3) Start frontend

Create `client/.env`:

```env
REACT_APP_API_URL=http://localhost:3000
```

From `client`:

```bash
npm start
```

Frontend runs on `http://localhost:3001` (or the next free port).

## API Docs

When backend is running:

- `http://localhost:3000/docs`

## Deployment (Recommended)

- Client: Vercel
- Server: Railway / Render / Fly
- Database: Neon

Use one GitHub repository and set root directories per platform:

- Vercel root directory: `client`
- Railway root directory: `server`

## Environment Variables

### Client

- `REACT_APP_API_URL` – backend base URL

### Server

For production, use env vars for:

- DB connection (`DB_HOST`, `DB_PORT`, `DB_USER`, `DB_PASSWORD`, `DB_NAME`)
- JWT secrets (`JWT_ACCESS_SECRET`, `JWT_REFRESH_SECRET`)
- CORS client URL (`CLIENT_URL`)

## Notes

- Current backend code still contains some hardcoded defaults for local development.
- Before production deployment, move all sensitive values to environment variables.
