import { configDefaults, defineConfig } from 'vitest/config';

export default defineConfig({
  test: {
    exclude: [
      ...configDefaults.exclude,
      // fixtures are linted by tests, not run as tests
      'fixtures/**',
      // needs the network, run by `pnpm run test:packed`
      'tests/packed-consumer.test.mts',
    ],
  },
});
