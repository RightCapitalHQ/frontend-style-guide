import type { TSESLint } from '@typescript-eslint/utils';
import eslintPluginReactHooks from 'eslint-plugin-react-hooks';
import eslintPluginReactHooksPackage from 'eslint-plugin-react-hooks/package.json' with { type: 'json' };

const plugin: TSESLint.FlatConfig.Plugin = {
  meta: {
    name: eslintPluginReactHooksPackage.name,
    version: eslintPluginReactHooksPackage.version,
  },
  rules: eslintPluginReactHooks.rules,
};

export default plugin;
