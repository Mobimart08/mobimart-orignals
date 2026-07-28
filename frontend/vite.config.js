import { defineConfig } from 'vite'
import react from '@vitejs/plugin-react'
import tailwindcss from '@tailwindcss/vite'

// https://vite.dev/config/
export default defineConfig({
  plugins: [
    react(),
    tailwindcss(),
  ],
  server: {
    host: '0.0.0.0',
  },
  build: {
    target: 'es2020',
    reportCompressedSize: false, // Faster builds
    chunkSizeWarningLimit: 600,
    assetsInlineLimit: 4096, // Inline assets < 4KB
    rollupOptions: {
      output: {
        manualChunks(id) {
          // Vendor: React core
          if (id.includes('node_modules/react') || id.includes('node_modules/react-dom')) {
            return 'react-vendor';
          }
          // Vendor: React Router
          if (id.includes('node_modules/react-router') || id.includes('node_modules/react-router-dom')) {
            return 'router';
          }
          // Vendor: Lucide icons
          if (id.includes('node_modules/lucide-react')) {
            return 'icons';
          }
          // Vendor: Axios
          if (id.includes('node_modules/axios')) {
            return 'http';
          }
          // Image tools (cropping, dropzone - only needed in admin)
          if (id.includes('node_modules/react-easy-crop') || id.includes('node_modules/react-dropzone')) {
            return 'image-tools';
          }
          // Admin pages bundle (kept separate to avoid loading in user-facing routes)
          if (id.includes('/pages/admin/') || id.includes('/components/admin/')) {
            return 'admin';
          }
        },
      },
    },
  },
})
