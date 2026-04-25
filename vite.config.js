import { defineConfig } from 'vite';
import react from '@vitejs/plugin-react';

// Tuned for a 4-vCPU host: a single static bundle, content-hashed,
// no SSR runtime. Build runs once in CI / on the dev box.
export default defineConfig({
  plugins: [react()],
  server: {
    host: '0.0.0.0',
    port: 9002,
    strictPort: true,
  },
  preview: {
    host: '0.0.0.0',
    port: 9002,
    strictPort: true,
  },
  build: {
    target: 'es2019',
    cssCodeSplit: true,
    sourcemap: false,
    rollupOptions: {
      output: {
        manualChunks: {
          react: ['react', 'react-dom', 'react-router-dom'],
        },
      },
    },
  },
});
