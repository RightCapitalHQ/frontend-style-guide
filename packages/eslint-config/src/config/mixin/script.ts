import type { ConfigObject } from '@eslint/core';

/**
 * Less strict config for scripts and config files.
 */
const config: readonly ConfigObject[] = [
  {
    rules: {
      'no-console': 'off',

      /**
       * execa, zx, bun uses tagged templates like `` $`sleep 5` `` to execute commands
       */
      'no-unused-expressions': ['error', { allowTaggedTemplates: true }],

      'import-x/no-extraneous-dependencies': [
        'error',
        { devDependencies: true },
      ],
    },
  },
];

export default config;
