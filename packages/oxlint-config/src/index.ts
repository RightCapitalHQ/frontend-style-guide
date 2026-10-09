import type { OxlintConfig, OxlintOverride } from 'oxlint';

import {
  a11yPlugins,
  basePlugins,
  baseRules,
  nodePlugins,
  nodeRules,
  profileRules,
  reactPlugins,
  reactRules,
  type RuntimeEnv,
  scriptingRules,
} from './rules.js';
import type {
  CreateConfigOptions,
  Profile,
  ProfileOptions,
  Runtime,
} from './types.js';

export type {
  CreateConfigOptions,
  MultiRuntimeOptions,
  Profile,
  ProfileOptions,
  Runtime,
  SingleRuntimeOptions,
} from './types.js';

const toRuntimes = (runtime: ProfileOptions['runtime']): Runtime[] => {
  const runtimes = typeof runtime === 'string' ? [runtime] : [...runtime];
  if (runtimes.length === 0) {
    throw new TypeError('createConfig: `runtime` must not be empty.');
  }
  return runtimes;
};

const isNodeRuntime = (runtime: Runtime) =>
  runtime === 'node' || runtime === 'lambda';

const createProfileOverride = (
  profile: Profile,
  recommended: boolean,
): OxlintOverride => {
  const runtimes = toRuntimes(profile.runtime);
  const env: RuntimeEnv = {};
  if (runtimes.includes('browser')) {
    env.browser = true;
  }
  if (runtimes.some(isNodeRuntime)) {
    env.node = true;
  }

  return {
    files: [...profile.files],
    ...(profile.excludeFiles && { excludeFiles: [...profile.excludeFiles] }),
    env,
    rules: {
      ...(recommended && profileRules),
      ...(recommended && runtimes.some(isNodeRuntime) && nodeRules),
      ...(recommended && profile.react && reactRules),
      ...(recommended && profile.scripting && scriptingRules),
      ...profile.rules,
    },
  };
};

/**
 * Plugins are enabled for the whole project rather than per override,
 * so rules from `rules` and `overrides` can use them in any file.
 * A plugin on its own enables no rule.
 */
const collectPlugins = (profiles: readonly Profile[], recommended: boolean) => {
  const runtimes = profiles.flatMap((profile) => toRuntimes(profile.runtime));
  const react = profiles.some((profile) => profile.react);
  return [
    ...basePlugins,
    ...(runtimes.some(isNodeRuntime) ? nodePlugins : []),
    ...(react ? reactPlugins : []),
    ...(react && recommended ? a11yPlugins : []),
  ];
};

/**
 * The types already forbid these combinations,
 * this also protects JavaScript and loosely typed callers.
 */
const resolveProfiles = (options: CreateConfigOptions): Profile[] => {
  const { runtime, react, scripting, profiles } = options;
  if (profiles) {
    if (
      runtime !== undefined ||
      react !== undefined ||
      scripting !== undefined
    ) {
      throw new TypeError(
        'createConfig: `profiles` is mutually exclusive with `runtime`, `react` and `scripting`, set them on each profile instead.',
      );
    }
    if (profiles.length === 0) {
      throw new TypeError('createConfig: `profiles` must not be empty.');
    }
    return [...profiles];
  }
  if (runtime === undefined) {
    throw new TypeError(
      'createConfig: either `runtime` or `profiles` is required.',
    );
  }
  return [{ files: ['**/*'], runtime, react, scripting }];
};

/**
 * Create an Oxlint config for TypeScript projects.
 *
 * No rule is enabled unless `recommended` is set or the rule is listed in
 * `rules`, `profiles[].rules` or `overrides`.
 *
 * Type-aware linting is always enabled, so `oxlint-tsgolint` and TypeScript
 * must be installed in the consuming project.
 *
 * @example
 * // oxlint.config.ts
 * import { createConfig } from '@rightcapital/oxlint-config';
 *
 * export default createConfig({ runtime: 'node', recommended: true });
 */
export const createConfig = (options: CreateConfigOptions): OxlintConfig => {
  const recommended = options.recommended ?? false;
  const profiles = resolveProfiles(options);
  return {
    plugins: collectPlugins(profiles, recommended),
    // Oxlint enables `correctness` unless it is turned off explicitly
    categories: { correctness: recommended ? 'error' : 'off' },
    rules: recommended ? { ...baseRules } : {},
    options: { typeAware: true },
    // Build output differs per project and names like `lib` are also used for
    // source directories, so only `node_modules` is ignored by default.
    ignorePatterns: ['**/node_modules/**', ...(options.ignorePatterns ?? [])],
    overrides: [
      ...profiles.map((profile) => createProfileOverride(profile, recommended)),
      // The file extension tells CommonJS apart from ESM, so no `module` option is needed.
      { files: ['**/*.cjs', '**/*.cts'], env: { commonjs: true } },
      ...(options.rules ? [{ files: ['**/*'], rules: options.rules }] : []),
      ...(options.overrides ?? []),
    ],
  };
};
