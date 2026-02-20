import { defineConfig } from 'vite'
import react from '@vitejs/plugin-react'

// https://vite.dev/config/
export default defineConfig({
  server: {
    host: true,
    port: 5173,
    proxy: {
      // Avoid CORS in local dev: browser talks only to localhost, Vite forwards to backend.
      '/api': {
        target: 'https://banasuno-backend.vercel.app',
        changeOrigin: true,
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
