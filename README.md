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
- User roles: `admin` and `user`
- Dashboard with team and leads metrics
- Team management
- Leads pipeline
- Lead ownership (each lead is linked to a user)
- RabbitMQ lead events (`lead.created`)
- Notifications center (server + client)
- Swagger API docs
- Light/Dark theme toggle

## Data Model

- `User 1:N Session` - one user can have multiple refresh sessions
- `User 1:N Lead` - one user can own multiple leads
- `Lead N:1 User` - each lead has one owner (`ownerId`)
- `User 1:N Notification` - one user can receive multiple notifications

## Local Setup

### 1) Clone and install dependencies

```bash
git clone https://github.com/olmerrr/sales-workspace.git
cd sales-workspace
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

Recommended variables:

- `DATABASE_URL` (preferred, e.g. Neon connection string)
- `DB_SSL` (`true` for Neon)
- `PORT`
- `CLIENT_URL`
- `JWT_ACCESS_SECRET`
- `JWT_REFRESH_SECRET`
- `RABBITMQ_URL`
- `RABBITMQ_QUEUE` (optional, default: `sales_workspace.leads`)

Alternative DB variables (if `DATABASE_URL` is not used):

- `DB_HOST`, `DB_PORT`, `DB_USER`, `DB_PASSWORD`, `DB_NAME`

## Notes

- One repository is used for both apps:
  - Vercel root directory: `client`
  - Railway root directory: `server`
- Keep production secrets in platform environment variables, not in git.
- If `RABBITMQ_URL` is not set, the API still works, but queue-based notifications are disabled.
