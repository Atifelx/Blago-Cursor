import { defineConfig } from 'vite';
import react from '@vitejs/plugin-react';

export default defineConfig({
  plugins: [react()],

  server: {
    proxy: {
      '/api': {
        target: 'http://localhost:5000',
        changeOrigin: true,
        secure: false,
        // Keep `/api` prefix in requests to match backend routes
      }
    }
  },


  // build: {
  //   target: 'esnext',  // For modern JavaScript compilation
  // },


  // resolve: {
  //   alias: {
  //     '@editorjs': '/node_modules/@editorjs',  // Ensure correct path resolution
  //   },
  // },

  // optimizeDeps: {
  //   include: ['@editorjs/editorjs', '@editorjs/header'],
  // },





});