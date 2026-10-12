# @rightcapital/oxlint-config

[![npm version](https://img.shields.io/npm/v/@rightcapital/oxlint-config)](https://www.npmjs.com/package/@rightcapital/oxlint-config)

RightCapital's shared [Oxlint](https://oxc.rs/docs/guide/usage/linter) configuration for TypeScript 7 projects.

Out of the box it only configures environments (globals) per runtime, type-aware linting and ignores, and loads the plugins that the presets and your own rules need. **No rule is enabled by default**, so a project that already has a hand-tuned rule set can adopt it unchanged and pass its own rules through `rules` and `overrides`.

Set `recommended: true` to opt in to the recommended policy: Oxlint's native `correctness` category plus the subset of `@rightcapital/eslint-config` rules that Oxlint can replace and does not already cover. It is not a full replacement, see [Using alongside ESLint](#using-alongside-eslint). JavaScript files are linted too. It does not need the alpha JavaScript-plugin bridge.

## Prerequisites

- Node.js `^20.19.0 || >=22.18.0`, which Oxlint requires to load a TypeScript config file. On older Node.js versions use a `.mjs` config or a JSON config instead (Oxlint itself supports `^20.19.0 || >=22.12.0`).
- `oxlint` `^1.80.0`
- `oxlint-tsgolint` `^7.0.2001`

Type-aware rules are always enabled, so the project needs a `tsconfig.json`. They are run by `oxlint-tsgolint`, which comes with its own TypeScript implementation, so the `typescript` package does not need to be installed.

## Installation

Install the peer dependencies directly in your project. Oxlint looks for the `oxlint-tsgolint` executable next to itself, so a transitive dependency of this package is not enough.

```sh
pnpm add -D @rightcapital/oxlint-config oxlint oxlint-tsgolint
```

## Usage

A project with a single runtime needs a short configuration. In your `oxlint.config.ts`:

```ts
import { createConfig } from '@rightcapital/oxlint-config';

export default createConfig({ runtime: 'node', recommended: true });
```

A project containing code for several runtimes, React code or scripts uses `overrides`. They are Oxlint overrides that can also carry the `runtime`, `react` and `scripting` presets, and the top-level `runtime`, `react` and `scripting` are the same presets for all files. Overrides are applied in order, so a file matched by several of them gets all of them: a later override wins for a rule it sets, and `env` is merged. For example the Node rules of an earlier override stay unless a later one sets the rule itself.

```ts
import { createConfig } from '@rightcapital/oxlint-config';

export default createConfig({
  recommended: true,
  overrides: [
    { files: ['src/**'], runtime: 'browser', react: true },
    // tests that need both Node and browser globals
    { files: ['tests/**'], runtime: ['node', 'browser'] },
    {
      files: ['scripts/**', '**/*.config.ts'],
      runtime: 'node',
      scripting: true,
    },
    // a plain Oxlint override works too
    { files: ['src/legacy/**'], rules: { 'eslint/no-var': 'off' } },
  ],
});
```

Then run `oxlint -c oxlint.config.ts`.

### Options

| Option                          | Description                                                                                                                                                   |
| ------------------------------- | ------------------------------------------------------------------------------------------------------------------------------------------------------------- |
| `recommended`                   | Enable the recommended rule policy, including the default file groups and the Node, React and scripting presets. Defaults to `false`.                         |
| `runtime`                       | `'browser'`, `'node'` or `'lambda'`, or an array of them. A preset for all files, or for the files of an override.                                            |
| `react`                         | A preset that loads the React plugin and, with `recommended`, applies the React rules. For all files, or for the files of an override.                        |
| `scripting`                     | A preset that relaxes rules for scripts and config files, e.g. `no-console`. For all files, or for the files of an override.                                  |
| `reportUnusedDisableDirectives` | Report unused disable directives as warnings. Defaults to `false`, also with `recommended`, see below.                                                        |
| `ignorePatterns`                | Glob patterns, relative to the config file, that are never linted. Only `node_modules` is ignored by default, so list build output such as `lib/**` yourself. |
| `rules`                         | Project-wide rules, applied after the top-level presets and before `overrides`.                                                                               |
| `overrides`                     | Oxlint overrides, optionally with the `runtime`, `react` and `scripting` presets, applied last in order.                                                      |

Oxlint reads `eslint-disable` comments too, but doesn't run ESLint-only rules. In a project that keeps ESLint, `reportUnusedDisableDirectives` would report the directives of those rules as unused. It is therefore off by default, turn it on once the project no longer uses ESLint. In a test on a project that uses both, enabling it added several hundred false warnings.

Plugins are loaded only when needed, because Oxlint does work for a loaded plugin even if no rule of it is enabled. A plugin is loaded by the presets (`runtime: 'node'` loads `node`, `react` loads `react`), by `recommended`, and by the plugin prefix of a rule you list in `rules` or `overrides`: `import/no-cycle` loads `import`. The aliases `@typescript-eslint/`, `react-hooks/`, `import-x/` and `jsx-a11y-x/` are recognized too. Oxlint silently ignores a rule of a plugin that is not loaded, which is why this is derived from the rules instead of being left to you.

Runtime globals come from `runtime`. Globals that a bundler injects, such as `process.env`, are not known, so declare them with `overrides` (`globals`) when `recommended` enables `no-undef`.

`lambda` is Node-hosted code and currently uses the same policy as `node`.

With `recommended`, `no-undef` is enabled in the files where `runtime` is set, because only there the globals are known. Files that match no `runtime` have no globals configured, so they are not checked by `no-undef`. TypeScript files are not checked either, because TypeScript already reports undefined names and typescript-eslint recommends turning the rule off for them.

### Default file groups

Like `@rightcapital/eslint-config`, `recommended` also applies presets to some files without an override. They come before the presets and overrides of the project, so those can still override them.

| Files                                                                                                 | Preset                                                          |
| ----------------------------------------------------------------------------------------------------- | --------------------------------------------------------------- |
| `**/*.tsx`                                                                                            | React rules, and the `react` and `jsx-a11y` plugins are loaded. |
| Code files in the root directory (`*.{js,cjs,mjs,ts,cts,mts}`)                                        | Node globals and Node rules.                                    |
| Code files in the root directory, `**/eslint.config.*` and `**/oxlint.config.*` (scripts and configs) | Scripting rules, e.g. `no-console` is off.                      |

The relaxation of `eslint-config` for test files is not carried over, because Oxlint has no `import/no-extraneous-dependencies` rule.

### ESM and CommonJS

Oxlint infers the parser mode from file extensions and syntax. `.cjs` and `.cts` files additionally get CommonJS globals (`require`, `module`, `exports`) in every override, so no `module` option is needed.

## Using alongside ESLint

This package only carries over the `@rightcapital/eslint-config` rules that Oxlint can replace. Projects keep ESLint for the rules or processors Oxlint can't replace. [`eslint-plugin-oxlint`](https://github.com/oxc-project/eslint-plugin-oxlint) can help disable the ESLint rules that Oxlint already covers.
