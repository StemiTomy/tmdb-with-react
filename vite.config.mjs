import { defineConfig } from 'vite'
import react from '@vitejs/plugin-react'
import { visualizer } from 'rollup-plugin-visualizer';

// https://vitejs.dev/config/
export default defineConfig({
  plugins: [react(), visualizer({ open: true })],
  build: {
    rollupOptions: {
      output: {
        manualChunks: {
          firebase: [
            'firebase/app',
            'firebase/auth',
            'firebase/database',
            'firebase/analytics'
          ],
          react: ['react', 'react-dom'],
          fontawesome: ['@fortawesome/fontawesome-svg-core']
        }
      }
    }
  }
})
