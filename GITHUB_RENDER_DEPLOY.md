# Easy Store — GitHub + Render deployment

This package is the original Easy Store static HTML/JavaScript storefront and Node.js server, not the separate React demo. Keep all files in this folder at the repository root (so `package.json`, `server.js`, `index.html`, and `data/seed.json` are at the root).

## Render settings
- Service type: Web Service
- Runtime: Node
- Root Directory: leave blank
- Build Command: `npm install`
- Start Command: `npm start`
- Health Check Path: `/health`
- Node version: 18 or newer

The project does not use a `dist/` folder; it serves `index.html` directly. Do not use `node server.js` with a different Vite `dist/index.html` server.

## Environment variables
Set `ADMIN_PASSWORD` to a strong unique password before the first start. Do not use `admin123` in production. `PORT` is provided by Render automatically.

## GitHub replacement
Back up the current repository first. Replace the old React/Vite demo files with the contents of this package at the repository root. Do not upload the ZIP as a single file expecting Render to extract it. Commit the extracted files, then deploy the latest commit.

## Data persistence warning
The default app stores site settings, orders, and admin authentication in local JSON files. Render's local filesystem may be ephemeral on restarts/redeploys unless a persistent disk is configured. Configure persistent storage or a database before accepting real customer orders.
