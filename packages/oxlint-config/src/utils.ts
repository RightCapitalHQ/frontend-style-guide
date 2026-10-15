import type { Plugins, Runtime } from './types.js';

const RUNTIMES: readonly Runtime[] = ['browser', 'node', 'lambda'];

export const isNodeRuntime = (runtime: Runtime) =>
  runtime === 'node' || runtime === 'lambda';

/**
 * Turn the `runtime` option into a validated list.
 *
 * The types already forbid invalid values,
 * this also protects JavaScript and loosely typed callers.
 */
export const normalizeRuntimes = (runtime: unknown): Runtime[] => {
  const runtimes: unknown[] = Array.isArray(runtime) ? runtime : [runtime];
  if (runtimes.length === 0) {
    throw new TypeError('createConfig: `runtime` must not be empty.');
  }
  const unknown = runtimes.filter(
    (item) => !RUNTIMES.includes(item as Runtime),
  );
  if (unknown.length > 0) {
    throw new TypeError(
      `createConfig: unknown \`runtime\` ${unknown.map(String).join(', ')}, expected ${RUNTIMES.join(', ')}.`,
    );
  }
  return runtimes as Runtime[];
};

/**
 * Merge optional records in order, later ones win.
 */
export const mergeRecords = <T extends object>(
  records: ReadonlyArray<T | undefined>,
): T => Object.assign({}, ...records) as T;

/**
 * The plugins of Oxlint that rules can come from, `eslint` is always available.
 * In the order they are listed in the config.
 */
const PLUGINS: Plugins = [
  'typescript',
  'unicorn',
  'oxc',
  'import',
  'node',
  'react',
  'jsx-a11y',
  'jsdoc',
  'jest',
  'vitest',
  'nextjs',
  'react-perf',
  'promise',
  'vue',
];

/**
 * Prefixes of rule names that Oxlint treats as part of a plugin.
 */
const PLUGIN_ALIASES: Record<string, string> = {
  '@typescript-eslint': 'typescript',
  'react-hooks': 'react',
  'import-x': 'import',
  'jsx-a11y-x': 'jsx-a11y',
};

/**
 * The plugins that the given rules, e.g. `import/no-cycle`, need.
 * Oxlint silently ignores a rule of a plugin that is not loaded.
 */
export const pluginsOfRules = (ruleNames: readonly string[]): Plugins => {
  const prefixes = new Set(
    ruleNames
      .filter((name) => name.includes('/'))
      .map((name) => {
        const prefix = name.slice(0, name.indexOf('/'));
        return PLUGIN_ALIASES[prefix] ?? prefix;
      }),
  );
  return PLUGINS.filter((plugin) => prefixes.has(plugin));
};
