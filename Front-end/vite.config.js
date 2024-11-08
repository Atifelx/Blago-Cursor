import { defineConfig } from 'vite';
import react from '@vitejs/plugin-react';

export default defineConfig({
  plugins: [react()],


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