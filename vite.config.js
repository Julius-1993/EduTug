import { defineConfig } from 'vite'
import react from '@vitejs/plugin-react'

export default defineConfig({
  plugins: [react()],
  base: './',          // relative paths — required for Electron & Capacitor
  build: {
    outDir: 'dist',
    assetsDir: 'assets',
    rollupOptions: {
      output: {
        manualChunks: {
          react: ['react', 'react-dom'],
          lucide: ['lucide-react'],
        }
      }
    }
  },
  server: {
    port: 5173,
    strictPort: true,
  }
})
