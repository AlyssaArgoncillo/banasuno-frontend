import { defineConfig } from 'vite'
import react from '@vitejs/plugin-react'

// In dev, /api requests are proxied to the backend so the browser sees same origin (no CORS).
const proxyTarget = process.env.VITE_API_URL?.trim() || 'http://localhost:3000'

// https://vite.dev/config/
export default defineConfig({
  server: {
    host: true,
    port: 5173,
    proxy: {
      '/api': {
        target: proxyTarget,
        changeOrigin: true,
        secure: false,
      },
    },
  },
  plugins: [
    react({
      babel: {
        plugins: [['babel-plugin-react-compiler']],
      },
    }),
  ],
  optimizeDeps: {
    include: ['pigeon-maps', 'pigeon-overlay', 'pigeon-marker']
  }
  ,
  resolve: {
    alias: {
      'pigeon-overlay': 'pigeon-overlay/lib/react',
      'pigeon-marker': 'pigeon-marker/lib/react'
    }
  }
})
