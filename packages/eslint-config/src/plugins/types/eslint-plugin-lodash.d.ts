declare module 'eslint-plugin-lodash' {
  import type { TSESLint } from '@typescript-eslint/utils';

  const plugin: TSESLint.FlatConfig.Plugin;
  export default plugin;
}
