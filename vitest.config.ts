import { defineConfig } from 'vitest/config';
import { fileURLToPath } from 'url';
import { dirname, resolve } from 'path';

const __filename = fileURLToPath(import.meta.url);
const __dirname = dirname(__filename);

export default defineConfig({
  test: {
    globals: true,
    environment: 'happy-dom',
    include: [
      'packages/block-core/__tests__/**/*.test.ts',
      'packages/block-core/__tests__/**/*.spec.ts',
    ],
    pool: 'forks',
  },
  resolve: {
    alias: {
      '@': resolve(__dirname, './packages/block-core/src'),
      '@block-editor/core': resolve(__dirname, './packages/block-core/src'),
    },
  },
});
