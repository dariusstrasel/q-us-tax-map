// frontend/vite.config.ts
import { defineConfig } from 'vite'
import react from '@vitejs/plugin-react'
import svgr from 'vite-plugin-svgr'

export default defineConfig({
  base: '/q-us-tax-map/',        // for GitHub Pages
  plugins: [react(), svgr()],    // keep svgr enabled
  resolve: {
    alias: {
      '@': '/src',               // optional, but consistent
    },
  },
  server: {
    proxy: {
      '/api': {
        target: 'http://localhost:3000', // dev-only proxy to Nest
        changeOrigin: true,
        secure: false,
      },
    },
  },
    build: {
    outDir: 'dist',   // <--- emit into repo-root/docs
    emptyOutDir: true,   // clear old contents
  },
})