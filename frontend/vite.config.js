import { defineConfig } from 'vite'
import react from '@vitejs/plugin-react'

export default defineConfig({
  plugins: [react()],
  server: {
    proxy: {
      '/api': {
        target: 'https://tastytrails.onrender.com', // The actual API server
        changeOrigin: true,
        rewrite: (path) => path.replace(/^\/api/, '') // Remove the /api prefix
      }
    }
  }
})
