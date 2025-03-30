import react from '@vitejs/plugin-react';
import { defineConfig } from 'vite';

export default defineConfig({
  plugins: [react()],
  esbuild: {
    logOverride: { 'ignored-use-directive': 'silent' },
  },
});
