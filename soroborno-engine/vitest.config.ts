import { defineConfig } from 'vitest/config';
import path from 'node:path';
import { fileURLToPath } from 'node:url';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

export default defineConfig({
  test: {
    environment: 'node',
    include: ['tests/**/*.test.ts']
  },
  resolve: {
    alias: {
      '@soroborno/core': path.resolve(__dirname, 'packages/core/dist/index.js'),
      '@soroborno/fonts': path.resolve(__dirname, 'packages/fonts/dist/index.js'),
      '@soroborno/css': path.resolve(__dirname, 'packages/css/dist/index.js')
    }
  },
  css: {
    postcss: false
  }
});
