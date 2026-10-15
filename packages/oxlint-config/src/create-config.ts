import type { OxlintConfig, OxlintOverride } from 'oxlint';

import baseConfig, { runtimeRules, typescriptFiles } from './config/base.js';
import browserMixin from './config/mixin/browser.js';
import nodeMixin from './config/mixin/node.js';
import reactMixin, { a11yPlugins } from './config/mixin/react.js';
import scriptMixin from './config/mixin/script.js';
import {
  recommendedMixins,
  recommendedOverrides,
} from './config/recommended.js';
import type {
  CreateConfigOptions,
  Mixin,
  Override,
  Runtime,
  RuntimeEnv,
} from './types.js';
import {
  isNodeRuntime,
  mergeRecords,
  normalizeRuntimes,
  pluginsOfRules,
} from './utils.js';

interface ResolvedOverride {
  /**
   * The Oxlint override without the presets.
   */
  override: OxlintOverride;
  runtimes: Runtime[];
  react: boolean;
  scripting: boolean;
}

/**
 * In the order their plugins are enabled, and later mixins win for a rule.
 */
const mixinOrder: readonly Mixin[] = [
  baseConfig,
  browserMixin,
  nodeMixin,
  reactMixin,
  scriptMixin,
];

const getMixins = ({
  runtimes,
  react,
  scripting,
}: ResolvedOverride): Mixin[] => {
  const used = new Set<Mixin>([
    ...(runtimes.includes('browser') ? [browserMixin] : []),
    ...(runtimes.some(isNodeRuntime) ? [nodeMixin] : []),
    ...(react ? [reactMixin] : []),
    ...(scripting ? [scriptMixin] : []),
  ]);
  return mixinOrder.filter((mixin) => used.has(mixin));
};

/**
 * The types already forbid invalid overrides,
 * this also protects JavaScript and loosely typed callers.
 */
const resolveOverride = (input: Override): ResolvedOverride => {
  const { runtime, react, scripting, ...override } = input;
  if (!Array.isArray(override.files) || override.files.length === 0) {
    throw new TypeError(
      'createConfig: `files` of an override must be a non-empty array.',
    );
  }
  return {
    override,
    runtimes: runtime === undefined ? [] : normalizeRuntimes(runtime),
    react: Boolean(react),
    scripting: Boolean(scripting),
  };
};

/**
 * The presets of the project are an override of every file, applied first.
 */
const resolveOverrides = (options: CreateConfigOptions) => {
  const { runtime, react, scripting } = options;
  const project =
    runtime === undefined && react === undefined && scripting === undefined
      ? []
      : [resolveOverride({ files: ['**/*'], runtime, react, scripting })];
  return {
    project,
    custom: (options.overrides ?? []).map(resolveOverride),
  };
};

const expandOverride = (
  resolved: ResolvedOverride,
  recommended: boolean,
): OxlintOverride[] => {
  const { override, runtimes } = resolved;
  const mixins = getMixins(resolved);
  const env = {
    ...mergeRecords<RuntimeEnv>(mixins.map((mixin) => mixin.env)),
    ...override.env,
  };
  const rules = {
    ...(recommended && mergeRecords(mixins.map((mixin) => mixin.rules))),
    ...override.rules,
  };
  const expanded: OxlintOverride = {
    ...override,
    ...(Object.keys(env).length > 0 && { env }),
    ...(Object.keys(rules).length > 0 && { rules }),
  };
  if (!recommended || runtimes.length === 0) {
    return [expanded];
  }
  // before the override itself, so its own rules can still turn `no-undef` off
  return [
    {
      files: override.files,
      excludeFiles: [...(override.excludeFiles ?? []), ...typescriptFiles],
      rules: runtimeRules,
    },
    expanded,
  ];
};

/**
 * Plugins are enabled for the whole project rather than per override,
 * so rules from `rules` and `overrides` can use them in any file.
 * A plugin on its own enables no rule, so plugins are only loaded when needed:
 * by the presets, by the recommended policy, and by the rules the project lists.
 */
const collectPlugins = (
  overrides: readonly ResolvedOverride[],
  recommended: boolean,
  ruleNames: readonly string[],
) => {
  const used = new Set([
    ...(recommended ? [baseConfig, ...recommendedMixins] : []),
    ...overrides.flatMap((override) => getMixins(override)),
  ]);
  return [
    ...new Set([
      ...mixinOrder
        .filter((mixin) => used.has(mixin))
        .flatMap((mixin) => mixin.plugins ?? []),
      ...(recommended ? a11yPlugins : []),
      ...pluginsOfRules(ruleNames),
    ]),
  ];
};

/**
 * Create an Oxlint config for TypeScript projects.
 *
 * No rule is enabled unless `recommended` is set or the rule is listed in
 * `rules` or `overrides`.
 *
 * Type-aware linting is always enabled, so `oxlint-tsgolint` must be
 * installed in the consuming project.
 *
 * @example
 * // oxlint.config.ts
 * import { createConfig } from '@rightcapital/oxlint-config';
 *
 * export default createConfig({ runtime: 'node', recommended: true });
 */
export const createConfig = (options: CreateConfigOptions): OxlintConfig => {
  const recommended = options.recommended ?? false;
  const { project, custom } = resolveOverrides(options);
  const expand = (resolved: ResolvedOverride) =>
    expandOverride(resolved, recommended);
  return {
    plugins: collectPlugins([...project, ...custom], recommended, [
      ...Object.keys(options.rules ?? {}),
      ...custom.flatMap(({ override }) => Object.keys(override.rules ?? {})),
    ]),
    // Oxlint enables `correctness` unless it is turned off explicitly
    categories: { correctness: recommended ? 'error' : 'off' },
    rules: recommended ? { ...baseConfig.rules } : {},
    options: {
      typeAware: true,
      ...(options.reportUnusedDisableDirectives && {
        reportUnusedDisableDirectives: 'warn',
      }),
    },
    // Build output differs per project and names like `lib` are also used for
    // source directories, so only `node_modules` is ignored by default.
    ignorePatterns: ['**/node_modules/**', ...(options.ignorePatterns ?? [])],
    overrides: [
      ...(recommended ? recommendedOverrides : []),
      ...project.flatMap(expand),
      // The file extension tells CommonJS apart from ESM, so no `module` option is needed.
      { files: ['**/*.cjs', '**/*.cts'], env: { commonjs: true } },
      ...(options.rules ? [{ files: ['**/*'], rules: options.rules }] : []),
      ...custom.flatMap(expand),
    ],
  };
};
