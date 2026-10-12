import type { OxlintConfig, OxlintOverride } from 'oxlint';

/**
 * Where the code of the matched files runs.
 *
 * - `browser`: browser globals
 * - `node`: Node.js globals
 * - `lambda`: Node.js code hosted by AWS Lambda, currently the same policy as `node`
 */
export type Runtime = 'browser' | 'node' | 'lambda';

export type Plugins = NonNullable<OxlintConfig['plugins']>;
export type Rules = NonNullable<OxlintConfig['rules']>;
export type RuntimeEnv = NonNullable<OxlintOverride['env']>;

/**
 * A reusable piece of config, like the mixins of `@rightcapital/eslint-config`.
 * `plugins` and `env` are always applied, `rules` only with `recommended`.
 */
export interface Mixin {
  plugins?: Plugins;
  env?: RuntimeEnv;
  rules?: Rules;
}

/**
 * Presets for the files they apply to: the whole project when passed to
 * `createConfig`, or the files of an override.
 */
export interface PresetOptions {
  /**
   * Where the code runs, so its globals are known.
   * Pass an array for code that needs several runtimes, e.g. tests using Node and browser globals.
   */
  runtime?: Runtime | readonly Runtime[];

  /**
   * Enable React (and JSX accessibility) rules.
   */
  react?: boolean;

  /**
   * Relax rules that get in the way of scripts and config files, e.g. `no-console`.
   */
  scripting?: boolean;
}

/**
 * An Oxlint override that can also carry presets.
 *
 * The presets are expanded into the override: its `env` and, with `recommended`,
 * its `rules` extend the ones of the presets and win.
 * Overrides are applied in order, so a file matched by several overrides gets
 * all of them: later overrides win for a rule they set, `env` is merged.
 */
export type Override = OxlintOverride & PresetOptions;

export interface CreateConfigOptions extends PresetOptions {
  /**
   * Enable the recommended rule policy: Oxlint's `correctness` category plus
   * rules carried over from `@rightcapital/eslint-config`, the default file
   * groups, and the presets of `runtime`, `react` and `scripting`.
   *
   * Off by default: without it only plugins, environments, type-aware linting
   * and ignores are configured, and every rule is opt-in.
   *
   * @default false
   */
  recommended?: boolean;

  /**
   * Report unused disable directives as warnings, like
   * `linterOptions.reportUnusedDisableDirectives` of `@rightcapital/eslint-config`.
   *
   * Off by default, also with `recommended`: Oxlint also reads `eslint-disable`
   * comments but doesn't run ESLint-only rules, so in a project that keeps ESLint
   * every directive for such a rule would be reported as unused.
   * Turn it on in projects that no longer use ESLint.
   *
   * @default false
   */
  reportUnusedDisableDirectives?: boolean;

  /**
   * Glob patterns, relative to the config file, that are never linted.
   * `node_modules` is always ignored.
   */
  ignorePatterns?: readonly string[];

  /**
   * Project-wide rules, applied after the presets of `runtime`, `react` and
   * `scripting` and before `overrides`.
   */
  rules?: OxlintConfig['rules'];

  /**
   * Overrides for particular files, applied last, in order.
   * Use the presets for code of another runtime, React code or scripts.
   */
  overrides?: readonly Override[];
}
