import type { ConfigObject } from '@eslint/core';

const config: readonly ConfigObject[] = [
  {
    linterOptions: {
      reportUnusedDisableDirectives: true,
    },
    languageOptions: {
      ecmaVersion: 'latest',
      sourceType: 'module',
      parserOptions: { jsx: true },
    },
  },
];

export default config;
