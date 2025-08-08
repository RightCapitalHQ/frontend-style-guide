import type { TSESLint } from '@typescript-eslint/utils';
import globals from 'globals';

import { pickPlugins } from '../../utils.js';
/**
 * Common rules for JavaScript files.
 */
const config: TSESLint.FlatConfig.ConfigArray = [
  {
    languageOptions: {
      globals: {
        ...globals.node,
      },
    },

    plugins: pickPlugins(['n', 'unicorn']),

    rules: {
      // require all requires be top-level
      // https://github.com/eslint-community/eslint-plugin-n/blob/master/docs/rules/global-require.md
      'n/global-require': 'error',

      // disallow use of the Buffer() constructor
      // https://eslint.org/docs/rules/no-buffer-constructor
      'no-buffer-constructor': 'error',

      // disallow use of new operator with the require function
      // https://github.com/eslint-community/eslint-plugin-n/blob/master/docs/rules/no-new-require.md
      'n/no-new-require': 'error',

      // disallow string concatenation with __dirname and __filename
      // https://github.com/eslint-community/eslint-plugin-n/blob/master/docs/rules/no-path-concat.md
      'n/no-path-concat': 'error',

      // disallow process.exit()
      // https://github.com/eslint-community/eslint-plugin-n/blob/master/docs/rules/no-process-exit.md
      'n/no-process-exit': 'error',

      // prefer assert.ok() over assert() for better readability and consistency
      // https://github.com/sindresorhus/eslint-plugin-unicorn/blob/main/docs/rules/consistent-assert.md
      'unicorn/consistent-assert': 'error',

      // prefer `import.meta.filename` over legacy pattern `url.fileURLToPath(import.meta.url)`,
      // and the same for `import.meta.dirname`
      // https://github.com/sindresorhus/eslint-plugin-unicorn/blob/main/docs/rules/prefer-import-meta-properties.md
      'unicorn/prefer-import-meta-properties': 'error',
    },
  },
];

export default config;
