import type { TSESLint } from '@typescript-eslint/utils';
import eslintPluginImportX from 'eslint-plugin-import-x';
import eslintPluginImportXPackage from 'eslint-plugin-import-x/package.json' with { type: 'json' };

/**
 * MEMO:
 * `eslint-plugin-import-x` does not provide a bare plugin config,
 * so we need to manually define the plugin here.
 */
const plugin: TSESLint.FlatConfig.Plugin = {
  meta: {
    name: eslintPluginImportXPackage.name,
    version: eslintPluginImportXPackage.version,
  },
  rules: eslintPluginImportX.rules,
};

export default plugin;
