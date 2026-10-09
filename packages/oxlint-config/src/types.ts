import type { OxlintConfig, OxlintOverride } from 'oxlint';

/**
 * Where the code in a profile runs.
 *
 * - `browser`: browser globals
 * - `node`: Node.js globals
 * - `lambda`: Node.js code hosted by AWS Lambda, currently the same policy as `node`
 */
export type Runtime = 'browser' | 'node' | 'lambda';

export interface ProfileOptions {
  /**
   * Where the code matched by this profile runs.
   * Pass an array for code that needs several runtimes, e.g. tests using Node and browser globals.
   */
  runtime: Runtime | readonly Runtime[];

  /**
   * Enable React (and JSX accessibility) rules.
   */
  react?: boolean;

  /**
   * Relax rules that get in the way of scripts and config files, e.g. `no-console`.
   */
  scripting?: boolean;

  /**
   * Extra rules for the files matched by this profile.
   */
  rules?: NonNullable<OxlintOverride['rules']>;
}

export interface Profile extends ProfileOptions {
  /**
   * Glob patterns of the files this profile applies to.
   */
  files: readonly string[];

  /**
   * Glob patterns excluded from this profile.
   */
  excludeFiles?: readonly string[];
}

interface CommonOptions {
  /**
   * Enable the recommended rule policy: Oxlint's `correctness` category plus
   * rules carried over from `@rightcapital/eslint-config`, including the
   * Node, React and scripting presets of each profile.
   *
   * Off by default: without it only plugins, environments, type-aware linting
   * and ignores are configured, and every rule is opt-in.
   *
   * @default false
   */
  recommended?: boolean;

  /**
   * Glob patterns, relative to the config file, that are never linted.
   * `node_modules` is always ignored.
   */
  ignorePatterns?: readonly string[];

  /**
   * Project-wide rule overrides, applied after every profile.
   */
  rules?: OxlintConfig['rules'];

  /**
   * Project-specific overrides for particular files, applied last.
   */
  overrides?: readonly OxlintOverride[];
}

/**
 * A project with a single runtime: one profile that applies to every file.
 */
export interface SingleRuntimeOptions extends CommonOptions, ProfileOptions {
  profiles?: never;
}

/**
 * A project containing code for several runtimes.
 */
export interface MultiRuntimeOptions extends CommonOptions {
  /**
   * Later profiles take precedence over earlier ones.
   */
  profiles: readonly Profile[];
  runtime?: never;
  react?: never;
  scripting?: never;
}

export type CreateConfigOptions = SingleRuntimeOptions | MultiRuntimeOptions;
