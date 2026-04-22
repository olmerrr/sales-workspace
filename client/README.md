# Sales Workspace Client

React frontend for the Sales Workspace CRM app.

## Tech Stack

- React + TypeScript
- Redux Toolkit + React Redux
- React Router
- Tailwind CSS
- Create React App

## Features

- Public pages: login and project info
- JWT-based auth flow (login, register, refresh)
- Dashboard with team and lead metrics
- Team management page
- Leads pipeline page
- Light/Dark theme toggle

## Requirements

- Node.js 18+ (recommended)
- Running backend API (`server` project)

## Environment Variables

Create a `.env` file in `client`:

```env
REACT_APP_API_URL=http://localhost:3000
```

`REACT_APP_API_URL` must point to your backend base URL.

## Local Development

From the `client` directory:

```bash
npm install
npm start
```

App runs on `http://localhost:3001` (or next free port if occupied).

## Production Build

```bash
npm run build
```

Build output: `client/build`.

## Deployment (Recommended)

- Deploy `client` to Vercel or Netlify
- Set `REACT_APP_API_URL` to your deployed API URL
- Ensure backend CORS includes your client domain

## Related Projects

- Backend API: `../server`
