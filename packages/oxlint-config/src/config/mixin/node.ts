import type { Mixin } from '../../types.js';

const config: Mixin = {
  plugins: ['node'],
  env: { node: true },
  rules: {
    'node/no-new-require': 'error',
    'node/no-path-concat': 'error',
    'unicorn/no-process-exit': 'error',
    'unicorn/prefer-import-meta-properties': 'error',
  },
};

export default config;
