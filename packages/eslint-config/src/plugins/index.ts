import type { Plugin } from '@eslint/core';
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

import type { ESLintReactPluginNames } from './types/eslint-react-plugin-names.generated.js';

const definePlugins = <TPluginName extends string>(
  plugins: Record<TPluginName, Pick<TSESLint.FlatConfig.Plugin, 'rules'>>,
) => {
  /**
   * We may enhance this when ESLint core types become better
   */
  return plugins as unknown as Record<TPluginName, Plugin>;
};

const eslintReactPlugins = (
  eslintPluginReact.configs.all as unknown as {
    plugins: { [K in ESLintReactPluginNames]: TSESLint.FlatConfig.Plugin };
  }
).plugins;

export const eslintReactPluginNames = Object.keys(
  eslintReactPlugins,
) as ESLintReactPluginNames[];

/**
 * All plugins used in `@rightcapital/eslint-config`.
 */
export const plugins = definePlugins({
  '@typescript-eslint': typescriptEslint.plugin as TSESLint.FlatConfig.Plugin,
  '@rightcapital': eslintPluginRightcapital,
  'import-x': eslintPluginImportX,
  'simple-import-sort': eslintPluginSimpleImportSort,
  n,
  ...eslintReactPlugins,
  '@stylistic': eslintPluginStylistic,
  'react-hooks': eslintPluginReactHooks,
  'jsx-a11y': eslintPluginA11y,
  lodash: eslintPluginLodash,
  unicorn: eslintPluginUnicorn,
  'unused-imports': unusedImportsEslintPlugin,
});
