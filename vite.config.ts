import { defineConfig } from 'vite';
import react from '@vitejs/plugin-react';
import tailwindcss from '@tailwindcss/vite';

// https://vite.dev/config/
export default defineConfig({
  // `base` is required for correct asset paths on GitHub Pages.
  // Replace with your repository name if it differs.
  base: '/calendar-test-task/',
  plugins: [react(), tailwindcss()],
});
