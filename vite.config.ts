import { fileURLToPath } from 'node:url'
import react from '@vitejs/plugin-react'
import { defineConfig } from 'vite'

// Two HTML entries: the single-page site and a standalone custom 404 page.
// Cloudflare serves `404.html` with a real 404 status for unknown paths, so we
// need no client-side router at all (see README - Décisions techniques).
export default defineConfig({
  plugins: [react()],
  build: {
    rollupOptions: {
      input: {
        main: fileURLToPath(new URL('./index.html', import.meta.url)),
        notFound: fileURLToPath(new URL('./404.html', import.meta.url)),
      },
    },
  },
})
