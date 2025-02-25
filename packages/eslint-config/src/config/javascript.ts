import type { TSESLint } from '@typescript-eslint/utils';

import { isInEditorEnv } from '../helpers/is-in-editor-env.js';
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
  },
];

if (!isInEditorEnv()) {
  config.push({
    rules: {
      'no-unused-vars': 'off',
      'unused-imports/no-unused-imports': 'error',
    },
  });
}

export default config;
