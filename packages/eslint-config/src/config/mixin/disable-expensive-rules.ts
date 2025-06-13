import type { TSESLint } from '@typescript-eslint/utils';
import * as typescriptEslint from 'typescript-eslint';

const config: TSESLint.FlatConfig.ConfigArray = [
  typescriptEslint.configs.disableTypeChecked,
  {
    rules: {
      'import-x/no-cycle': 'off',
    },
  },
];

export default config;
