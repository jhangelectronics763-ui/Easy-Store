# Easy Store — Render deployment

1. Push the contents of this folder to the GitHub repository root (the `package.json` must be at root).
2. Render settings:
   - Build Command: `npm install`
   - Start Command: `npm start`
   - Health Check Path: `/health`
   - Root Directory: blank
3. Add Environment Variable `ADMIN_PASSWORD` with a long, unique password before first start.
4. Deploy latest commit and verify `/health` returns `ok` and the homepage opens.

The project uses Node.js built-in modules and does not need `npm run build`.
Run `npm run check` and `npm run test:smoke` locally before deploying.

Note: the app's local JSON data and uploads require persistent storage in production. Do not accept real
orders until you have configured persistent storage, admin password, real contact/payment settings,
and tested checkout/order handling.
