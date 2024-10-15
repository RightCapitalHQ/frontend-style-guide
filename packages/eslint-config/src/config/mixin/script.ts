import type { TSESLint } from '@typescript-eslint/utils';

/**
 * Less strict config for scripts and config files.
 */
const config: TSESLint.FlatConfig.ConfigArray = [
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
