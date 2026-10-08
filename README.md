<div align="center">
<img width="1200" height="475" alt="GHBanner" src="https://ai.google.dev/static/site-assets/images/share-ais-513315318.png" />
</div>

# Run and deploy your AI Studio app

This contains everything you need to run your app locally.

View your app in AI Studio: https://ai.studio/apps/38940794-6eb3-4bd4-9b2a-7ca2e2fa4b12

## Run Locally

**Prerequisites:**  Node.js


1. Install dependencies:
   `npm install`
2. Set the `GEMINI_API_KEY` in [.env.local](.env.local) to your Gemini API key
3. Run the app:
   `npm run dev`

## Deployment — SPA fallback requirement

This is a single-page app using real path-based routing (`/products/axor-apex-pro`, `/shop`, etc. — not hash fragments). Whatever serves the built `dist/` folder **must serve `index.html` for every path that isn't a real static file**, otherwise a direct link or a page refresh on any route other than `/` will 404.

- **Hostinger (shared/standard hosting, Apache)**: already configured via `public/.htaccess` (copied into `dist/` by the build) — requires `mod_rewrite` to be enabled, which it is by default on Hostinger's shared plans. Just upload the contents of `dist/` (including the hidden `.htaccess` file — make sure your FTP client/file manager shows hidden files) to `public_html`.
- **Hostinger VPS / any host where you run your own Node process**: use the Custom Node/Express snippet below instead.
- **Netlify**: already configured via `public/_redirects` (copied into `dist/` by the build).
- **Vercel**: already configured via `vercel.json` at the project root.
- **Custom Node/Express server**: add a catch-all that serves `index.html` for unmatched GET requests, e.g.:
  ```js
  app.use(express.static('dist'));
  app.get('*', (req, res) => res.sendFile(path.join(__dirname, 'dist', 'index.html')));
  ```
- **Nginx**: `try_files $uri $uri/ /index.html;` in the relevant `location /` block.

`npm run dev` / `npm run preview` (Vite's own dev and preview servers) already do this automatically — no extra config needed for local development.
