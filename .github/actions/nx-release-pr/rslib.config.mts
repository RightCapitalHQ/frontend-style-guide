import { defineConfig } from '@rslib/core';

export default defineConfig({
  lib: [
    {
      autoExternal: false,
      bundle: true,
      format: 'cjs',
      output: {
        distPath: { root: 'dist' },
        externals: [/^nx(\/|$)/],
      },
      source: {
        entry: { index: 'src/main.ts' },
      },
    },
  ],
  output: {
    target: 'node',
  },
});
