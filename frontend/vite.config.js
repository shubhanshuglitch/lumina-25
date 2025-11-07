import { defineConfig } from 'vite'
import react from '@vitejs/plugin-react'

// https://vitejs.dev/config/
export default defineConfig({
  plugins: [react()],
  server: {
    port: 5173,
    proxy: {
      '/api': {
        target: 'http://localhost:5000',
        changeOrigin: true,
      },
    },
  },
  esbuild: {
    loader: "jsx",
    include: [
      // Tell esbuild to treat these file extensions as JSX
      "src/**/*.js",
      "src/**/*.jsx",
      "node_modules/**/*.js",
      "node_modules/**/*.jsx"
    ],
  },
  optimizeDeps: {
    esbuildOptions: {
      loader: {
        '.js': 'jsx',
      },
    },
  },
})
