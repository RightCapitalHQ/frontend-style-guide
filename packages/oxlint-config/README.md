# @rightcapital/oxlint-config

[![npm version](https://img.shields.io/npm/v/@rightcapital/oxlint-config)](https://www.npmjs.com/package/@rightcapital/oxlint-config)

RightCapital's shared [Oxlint](https://oxc.rs/docs/guide/usage/linter) configuration for TypeScript 7 projects.

Out of the box it only configures plugins, environments (globals) per runtime, type-aware linting and ignores. **No rule is enabled by default**, so a project that already has a hand-tuned rule set can adopt it unchanged and pass its own rules through `rules`, `profiles[].rules` and `overrides`.

Set `recommended: true` to opt in to the recommended policy: Oxlint's native `correctness` category plus behavior carried over from `@rightcapital/eslint-config` that Oxlint does not already cover. JavaScript files are linted too. It does not need the alpha JavaScript-plugin bridge.

## Prerequisites

- Node.js `^20.19.0 || >=22.18.0`, which Oxlint requires to load a TypeScript config file. On older Node.js versions use a `.mjs` config or a JSON config instead (Oxlint itself supports `^20.19.0 || >=22.12.0`).
- `typescript` `^7.0.2`
- `oxlint` `^1.80.0`
- `oxlint-tsgolint` `^7.0.2001`

Type-aware rules are always enabled, so a TypeScript 7 project with a `tsconfig.json` is required.

## Installation

Install the peer dependencies directly in your project. Oxlint looks for the `oxlint-tsgolint` executable next to itself, so a transitive dependency of this package is not enough.

```sh
pnpm add -D @rightcapital/oxlint-config oxlint oxlint-tsgolint typescript
```

## Usage

A project with a single runtime needs a short configuration. In your `oxlint.config.ts`:

```ts
import { createConfig } from '@rightcapital/oxlint-config';

export default createConfig({ runtime: 'node', recommended: true });
```

A project containing code for several runtimes uses profiles. Later profiles take precedence over earlier ones:

```ts
import { createConfig } from '@rightcapital/oxlint-config';

export default createConfig({
  recommended: true,
  profiles: [
    { files: ['src/**'], runtime: 'browser', react: true },
    // tests that need both Node and browser globals
    { files: ['tests/**'], runtime: ['node', 'browser'] },
    {
      files: ['scripts/**', '**/*.config.ts'],
      runtime: 'node',
      scripting: true,
    },
  ],
});
```

Then run `oxlint -c oxlint.config.ts`.

### Options

| Option           | Description                                                                                                                                                   |
| ---------------- | ------------------------------------------------------------------------------------------------------------------------------------------------------------- |
| `recommended`    | Enable the recommended rule policy, including each profile's Node, React and scripting presets. Defaults to `false`.                                          |
| `runtime`        | `'browser'`, `'node'` or `'lambda'`, or an array of them. Shorthand for a single profile on all files.                                                        |
| `react`          | Load the React plugin, and with `recommended` the React rules and the `jsx-a11y` plugin with its `correctness` rules.                                         |
| `scripting`      | Relax rules for scripts and config files, e.g. `no-console`.                                                                                                  |
| `profiles`       | Profiles with `files`, optional `excludeFiles`, `runtime`, `react`, `scripting` and `rules`.                                                                  |
| `ignorePatterns` | Glob patterns, relative to the config file, that are never linted. Only `node_modules` is ignored by default, so list build output such as `lib/**` yourself. |
| `rules`          | Project-wide rule overrides, applied after every profile.                                                                                                     |
| `overrides`      | Oxlint overrides for particular files, applied last.                                                                                                          |

`runtime`, `react` and `scripting` are shorthand for a single profile on all files, so they can't be combined with `profiles`: set them on each profile instead.

`lambda` is Node-hosted code and currently uses the same policy as `node`.

With `recommended`, `no-undef` is enabled in the files of each profile, where the globals of the runtime are known. Files that match no profile have no globals configured, so they are not checked by `no-undef`.

### ESM and CommonJS

Oxlint infers the parser mode from file extensions and syntax. `.cjs` and `.cts` files additionally get CommonJS globals (`require`, `module`, `exports`) in every profile, so no `module` option is needed.

## Using alongside ESLint

Projects can keep ESLint for rules or processors they still need. [`eslint-plugin-oxlint`](https://github.com/oxc-project/eslint-plugin-oxlint) can help disable the ESLint rules that Oxlint already covers.
