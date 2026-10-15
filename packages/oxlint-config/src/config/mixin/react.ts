import type { Mixin, Plugins } from '../../types.js';

const config: Mixin = {
  plugins: ['react'],
  rules: {
    'react/rules-of-hooks': 'error',
    'react/exhaustive-deps': 'error',
  },
};

/**
 * Only loaded with `recommended`, where its `correctness` rules are enabled.
 */
export const a11yPlugins: Plugins = ['jsx-a11y'];

export default config;
