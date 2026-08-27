import tailwindcss from '@tailwindcss/vite';
import react from '@vitejs/plugin-react';
import path from 'path';
import {defineConfig} from 'vite';

export default defineConfig(() => {
  return {
    plugins: [react(), tailwindcss()],
    resolve: {
      alias: {
        '@': path.resolve(__dirname, '.'),
      },
    },
    server: {
      // HMR is disabled in AI Studio via DISABLE_HMR env var.
      // Do not modifyâfile watching is disabled to prevent flickering during agent edits.
      hmr: process.env.DISABLE_HMR !== 'true',
      // Disable file watching when DISABLE_HMR is true to save CPU during agent edits.
      watch: process.env.DISABLE_HMR === 'true' ? null : {},
      // Local-dev-only proxy to the VEYONN backend, so the browser sees
      // same-origin requests (no CORS config needed) while developing this
      // site on its own port. Never used in production — `vite build`/
      // `vite preview` don't run this dev server at all; the deployed site
      // talks to VITE_API_BASE_URL directly, wherever the real backend's
      // CORS policy already allows it.
      proxy: {
        '/api': {
          target: process.env.VEYONN_DEV_PROXY_TARGET || 'http://localhost:3000',
          changeOrigin: true,
        },
      },
    },
  };
});
