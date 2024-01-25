/* eslint-disable import/no-extraneous-dependencies */
import { defineConfig } from 'vite';
import react from '@vitejs/plugin-react';

// https://vitejs.dev/config/
// https://vitejs.dev/guide/static-deploy.html#github-pages
export default defineConfig({
  plugins: [react()],
  base: '/riscos-file-viewer/',
});
