import { defineConfig } from 'vite'
import react from '@vitejs/plugin-react'

// https://vite.dev/config/
export default defineConfig({
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
