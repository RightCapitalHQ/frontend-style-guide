import { defineConfig } from 'vitest/config';

export default defineConfig({
  test: { include: ['tests/packed-consumer.test.mts'] },
});
