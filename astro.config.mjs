// @ts-check
import { defineConfig } from 'astro/config';

export default defineConfig({
  // TODO: set to your custom domain before the first production deploy (used for canonical URLs)
  site: 'https://example.com',
  build: { format: 'directory' },
  vite: {
    css: {
      preprocessorOptions: {
        scss: {
          loadPaths: ['node_modules'],
          quietDeps: true,
        },
      },
    },
  },
});
