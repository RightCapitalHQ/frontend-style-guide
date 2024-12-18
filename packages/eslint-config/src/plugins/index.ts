import eslintPluginReact from '@eslint-react/eslint-plugin';
import eslintPluginRightcapital from '@rightcapital/eslint-plugin';
import eslintPluginStylistic from '@stylistic/eslint-plugin';
import type { TSESLint } from '@typescript-eslint/utils';
import eslintPluginA11y from 'eslint-plugin-jsx-a11y';
import eslintPluginLodash from 'eslint-plugin-lodash';
import eslintPluginSimpleImportSort from 'eslint-plugin-simple-import-sort';
import eslintPluginUnicorn from 'eslint-plugin-unicorn';

import eslintPluginImportX from './eslint-plugin-import-x.js';
import eslintPluginReactHooks from './eslint-plugin-react-hooks.js';

/**
 * all plugins used in `@rightcapital/eslint-config`
 *
 * useful for overriding rules
 */
export const allPlugins: TSESLint.FlatConfig.Plugins = {
  ...eslintPluginReact.configs.all.plugins,
  '@rightcapital': eslintPluginRightcapital,
  '@stylistic': eslintPluginStylistic as TSESLint.FlatConfig.Plugin,
  'react-hooks': eslintPluginReactHooks,
  'jsx-a11y': eslintPluginA11y,
  'import-x': eslintPluginImportX,
  'simple-import-sort': eslintPluginSimpleImportSort,
  lodash: eslintPluginLodash,
  unicorn: eslintPluginUnicorn,
};
