import { defineConfig } from 'vitest/config'
import react from '@vitejs/plugin-react'

// PROVIDED - you do not need to change this file.
//
// Two jobs:
//   1. The proxy. Your front end calls /api/sightings; Vite forwards that to the
//      API on port 3000 with the /api prefix stripped. That is why your fetch
//      calls use a relative URL and never mention localhost:3000 - which also
//      means no CORS to fight, in dev and in preview alike.
//   2. Vitest, in a simulated browser (jsdom) so tests can render components.
const proxy = {
  '/api': {
    target: 'http://localhost:3000',
    changeOrigin: true,
    rewrite: (path) => path.replace(/^\/api/, ''),
  },
}

export default defineConfig({
  plugins: [react()],
  server: { proxy },
  preview: { proxy },
  test: {
    environment: 'jsdom',
    globals: true,
    setupFiles: './test/setup.js',
  },
})
