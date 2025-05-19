import type { TSESLint } from '@typescript-eslint/utils';

import { isInEditorEnv } from '../helpers/is-in-editor-env.js';
import { pickPlugins } from '../utils.js';
import baseConfig from './base/index.js';

/**
 * Common rules for JavaScript files.
 */
const config: TSESLint.FlatConfig.ConfigArray = [
  ...baseConfig,
  {
    settings: {
      'import-x/resolver': {
        node: {
          extensions: ['.mjs', '.js', '.json'],
        },
        typescript: {},
      },
      'import-x/extensions': ['.js', '.mjs', '.jsx'],
      'import-x/ignore': [
        'node_modules',
        '\\.(coffee|scss|css|less|hbs|svg|json)$',
      ],
    },
    plugins: pickPlugins(['unused-imports']),
    rules: {
      // https://typescript-eslint.io/rules/no-unused-vars/
      // https://github.com/sweepline/eslint-plugin-unused-imports#usage
      'no-unused-vars': 'off',
      'unused-imports/no-unused-vars': ['error', { argsIgnorePattern: '^_' }],
    },
  },
];

if (!isInEditorEnv()) {
  config.push({
    rules: { 'unused-imports/no-unused-imports': 'error' },
  });
}

export default config;
