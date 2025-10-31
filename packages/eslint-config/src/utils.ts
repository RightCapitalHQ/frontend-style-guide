import { defineConfig as coreDefineConfig } from 'eslint/config';
import globals from 'globals';

import { isInGitHooksOrLintStaged } from './helpers/is-in-editor-env.js';
import { plugins } from './plugins/index.js';

/**
 * Generate a plugins object from a list of ESLint plugin names
 * (Only plugins that are known to `@rightcapital/eslint-config`).
 *
 * @see {@link plugins} for the list of plugins.
 */
export function pickPlugins(pluginNames?: Array<keyof typeof plugins>) {
  if (!pluginNames) {
    return plugins;
  }

  return Object.fromEntries(
    pluginNames.map((pluginName) => [pluginName, plugins[pluginName]]),
  );
}

const defineConfig: typeof coreDefineConfig = (...configs) =>
  coreDefineConfig(...configs).map((config) => {
    const knownPluginNames = Object.keys(plugins).filter((pluginName) =>
      Object.keys(config.rules ?? {}).some((rule) =>
        rule.startsWith(`${pluginName}/`),
      ),
    ) as Array<keyof typeof plugins>;

    const resolvedPlugins = {
      ...pickPlugins(knownPluginNames),
      ...config.plugins,
    };

    return {
      ...(Object.keys(resolvedPlugins).length > 0
        ? { plugins: resolvedPlugins }
        : null),
      ...config,
    };
  });

const utils = {
  /**
   * Utility function for easily composing configs.
   *
   * This is a wrapper around ESLint `defineConfig` function.
   *
   * With automatic plugin inference(if the plugin is known to `@rightcapital/eslint-config`).
   *
   * @see https://eslint.org/docs/latest/use/configure/combine-configs
   */
  defineConfig,
  globals,
  plugins,
  pickPlugins,
  isInGitHooksOrLintStaged,
} as const;

export default utils;
