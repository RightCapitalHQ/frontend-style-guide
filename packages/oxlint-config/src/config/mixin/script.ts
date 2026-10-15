import type { Mixin } from '../../types.js';

/**
 * Less strict config for scripts and config files.
 */
const config: Mixin = {
  rules: {
    'eslint/no-console': 'off',
    'unicorn/no-process-exit': 'off',
    // execa, zx, bun use tagged templates like `$`sleep 5`` to run commands
    'eslint/no-unused-expressions': ['error', { allowTaggedTemplates: true }],
  },
};

export default config;
