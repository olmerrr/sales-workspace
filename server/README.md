# Sales Workspace Server

NestJS backend API for the Sales Workspace CRM app.

## Tech Stack

- NestJS + TypeScript
- TypeORM
- PostgreSQL
- JWT authentication (access + refresh)
- Swagger (OpenAPI)
- class-validator / class-transformer

## Features

- Auth: register, login, refresh
- User roles: `admin` and `user`
- Users module
- Leads module
- Lead ownership linked to authenticated user
- Session storage for refresh-token rotation
- Swagger docs at `/docs` (also available at `/`)

## Data Model and Relations

- `User 1:N Session`
  - a user can have multiple auth sessions
- `User 1:N Lead`
  - a user can own multiple leads
- `Lead N:1 User`
  - every lead stores `ownerId` and relation `owner`

Role model:

- `User.role` supports `admin` and `user`
- New registered users get role `user` by default

## Requirements

- Node.js 18+ (recommended)
- PostgreSQL 14+ (local or managed, e.g. Neon)

## Environment Variables

Preferred DB connection:

- `DATABASE_URL`
- `DB_SSL` (`true` for Neon)

Other runtime variables:

- `PORT`
- `CLIENT_URL`
- `JWT_ACCESS_SECRET`
- `JWT_REFRESH_SECRET`

Optional DB variables (if `DATABASE_URL` is not used):

- `DB_HOST`
- `DB_PORT`
- `DB_USER`
- `DB_PASSWORD`
- `DB_NAME`

## Local Quick Start

You can initialize local PostgreSQL with:

```sql
-- file: db-init.sql
CREATE ROLE app_user WITH LOGIN PASSWORD 'app_pass_123';
CREATE DATABASE app_db OWNER app_user;
```

Then run from `server`:

```bash
npm install
npm run start:dev
```

API default URL: `http://localhost:3000`

## Available Scripts

From the `server` directory:

```bash
npm run start
npm run start:dev
npm run start:prod
npm run build
npm run test
npm run test:e2e
```

## API Docs

- Swagger UI: `http://localhost:3000/docs`
- Swagger UI (root): `http://localhost:3000/`

## Main Endpoints

- `GET /info`
- `GET /health`
- `POST /auth/register`
- `POST /auth/login`
- `POST /auth/refresh`
- `GET /users` (protected)
- `POST /users`
- `GET /leads` (protected)
- `POST /leads` (protected)

## Deployment Notes

Recommended setup:

- `server` on Railway / Render / Fly
- PostgreSQL on Neon

Production checklist:

- set `CLIENT_URL` to your Vercel domain
- set strong `JWT_ACCESS_SECRET` and `JWT_REFRESH_SECRET`
- use `DATABASE_URL` from Neon
- set `DB_SSL=true` for managed Postgres
- replace `synchronize: true` with migrations for long-term safety

## Related Projects

- Frontend app: `../client`
