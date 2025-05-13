import eslintPluginReact from '@eslint-react/eslint-plugin';
import eslintPluginRightcapital from '@rightcapital/eslint-plugin';
import eslintPluginStylistic from '@stylistic/eslint-plugin';
import type { TSESLint } from '@typescript-eslint/utils';
import eslintPluginImportX from 'eslint-plugin-import-x';
import eslintPluginA11y from 'eslint-plugin-jsx-a11y';
import eslintPluginLodash from 'eslint-plugin-lodash';
import n from 'eslint-plugin-n';
import eslintPluginReactHooks from 'eslint-plugin-react-hooks';
import eslintPluginSimpleImportSort from 'eslint-plugin-simple-import-sort';
import eslintPluginUnicorn from 'eslint-plugin-unicorn';
import unusedImportsEslintPlugin from 'eslint-plugin-unused-imports';
import * as typescriptEslint from 'typescript-eslint';

const definePlugins = <TPluginName extends string>(
  plugins: Record<TPluginName, Pick<TSESLint.FlatConfig.Plugin, 'rules'>>,
): Record<TPluginName, TSESLint.FlatConfig.Plugin> => {
  return plugins;
};

/**
 * All plugins used in `@rightcapital/eslint-config`.
 */
export const plugins = definePlugins({
  '@typescript-eslint': typescriptEslint.plugin,
  '@rightcapital': eslintPluginRightcapital,
  'import-x': eslintPluginImportX,
  'simple-import-sort': eslintPluginSimpleImportSort,
  n,
  ...eslintPluginReact.configs.all.plugins,
  '@stylistic': eslintPluginStylistic as TSESLint.FlatConfig.Plugin,
  'react-hooks': eslintPluginReactHooks,
  'jsx-a11y': eslintPluginA11y,
  lodash: eslintPluginLodash,
  unicorn: eslintPluginUnicorn,
  'unused-imports': unusedImportsEslintPlugin,
});
