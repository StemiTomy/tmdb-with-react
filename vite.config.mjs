import { defineConfig } from 'vite'
import react from '@vitejs/plugin-react'
import { visualizer } from 'rollup-plugin-visualizer';

// https://vitejs.dev/config/
export default defineConfig({
  server: {
    host: '127.0.0.1', // ✅ importante
    port: 5173,
  },
  plugins: [react(), visualizer({ open: true })],
  build: {
    rollupOptions: {
      output: {
        manualChunks: {
          react: ['react', 'react-dom'],
          fontawesome: ['@fortawesome/fontawesome-svg-core']
        }
      }
    }
  }
})
