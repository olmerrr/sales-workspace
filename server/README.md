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
- Users module
- Leads module
- Session storage for refresh-token rotation
- Swagger docs at `/docs` (also available at `/`)

## Requirements

- Node.js 18+ (recommended)
- PostgreSQL 14+ (local or managed, e.g. Neon)

## Quick Start (Current Project Defaults)

This project currently uses DB and JWT values from code defaults:

- DB host: `localhost`
- DB port: `5432`
- DB user: `app_user`
- DB password: `app_pass_123`
- DB name: `app_db`

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

Required production changes before real deployment:

- move DB config from hardcoded values to environment variables
- move JWT secrets to environment variables
- set CORS origin to your deployed client URL
- replace `synchronize: true` with migrations for production safety

## Related Projects

- Frontend app: `../client`
