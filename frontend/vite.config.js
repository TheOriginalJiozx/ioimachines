import { defineConfig } from 'vite'
import react from '@vitejs/plugin-react'
import tailwindcss from '@tailwindcss/vite'

export default defineConfig({
  plugins: [
    react(),
    tailwindcss(),
  ],
  server: {
    proxy: {
      '/api': {
        target: process.env.VITE_API_BASE || process.env.VITE_API_BASE_ONLINE,
        changeOrigin: true,
        secure: true,
        rewrite: (path) => path.replaceAll(/^\/api/, ''),
      }
    }
  }
})
