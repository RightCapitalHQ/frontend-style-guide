# RightCapital Frontend Style Guide

<!-- Badges area start -->

[![made by RightCapital](https://img.shields.io/badge/made_by-RightCapital-4966d0)](https://rightcapital.com)
![GitHub Workflow Status (with event)](https://img.shields.io/github/actions/workflow/status/RightCapitalHQ/frontend-style-guide/ci.yml)
[![Conventional Commits](https://img.shields.io/badge/Conventional%20Commits-1.0.0-%23FE5196?logo=conventionalcommits&logoColor=white)](https://conventionalcommits.org)
[![RightCapital frontend style guide](https://img.shields.io/badge/code_style-RightCapital-5c4c64?labelColor=f0ede8)](https://github.com/RightCapitalHQ/frontend-style-guide)

<!-- Badges area end -->

RightCapital's frontend style guide monorepo — shared configs for ESLint, Prettier, TypeScript, and related tooling.

## Packages

| Package                                                                       | Version                                                                                                                                             | Description                                       |
| ----------------------------------------------------------------------------- | --------------------------------------------------------------------------------------------------------------------------------------------------- | ------------------------------------------------- |
| [`@rightcapital/eslint-config`](packages/eslint-config)                       | [![npm](https://img.shields.io/npm/v/@rightcapital/eslint-config)](https://www.npmjs.com/package/@rightcapital/eslint-config)                       | ESLint flat config with JS, TS, and React support |
| [`@rightcapital/eslint-plugin`](packages/eslint-plugin)                       | [![npm](https://img.shields.io/npm/v/@rightcapital/eslint-plugin)](https://www.npmjs.com/package/@rightcapital/eslint-plugin)                       | Custom ESLint rules                               |
| [`@rightcapital/prettier-config`](packages/prettier-config)                   | [![npm](https://img.shields.io/npm/v/@rightcapital/prettier-config)](https://www.npmjs.com/package/@rightcapital/prettier-config)                   | Shared Prettier configuration                     |
| [`@rightcapital/tsconfig`](packages/tsconfig)                                 | [![npm](https://img.shields.io/npm/v/@rightcapital/tsconfig)](https://www.npmjs.com/package/@rightcapital/tsconfig)                                 | Shared TypeScript configuration                   |
| [`@rightcapital/lint-eslint-config-rules`](packages/lint-eslint-config-rules) | [![npm](https://img.shields.io/npm/v/@rightcapital/lint-eslint-config-rules)](https://www.npmjs.com/package/@rightcapital/lint-eslint-config-rules) | CLI to check for deprecated/unknown ESLint rules  |

## ESLint

### Prerequisites

- `eslint` (>=9)
- `typescript` (optional, for TypeScript support)

### Usage

Install `@rightcapital/eslint-config` to your project.

```sh
pnpm add -D @rightcapital/eslint-config
```

In your `eslint.config.mjs` ([or equivalent](https://eslint.org/docs/latest/use/configure/configuration-files#configuration-file-formats)):

```js
import eslintConfigRightcapital from '@rightcapital/eslint-config';

const { defineConfig } = eslintConfigRightcapital.utils;

export default defineConfig(
  ...eslintConfigRightcapital.configs.recommended,

  // add more configs for specific files or packages if needed
  {
    files: ['scripts/**/*.{js,cjs,mjs}'],
    extends: [
      ...eslintConfigRightcapital.configs.node,
      ...eslintConfigRightcapital.configs.script,
    ],
  },
);
```

See [`packages/eslint-config`](packages/eslint-config) for the full list of exported configs and utils.

## Prettier

### Prerequisites

- `prettier`

### Usage

Install config package to your project:

```sh
pnpm add -D @rightcapital/prettier-config
```

In your project's `prettier.config.cjs`:

```js
module.exports = require('@rightcapital/prettier-config');
```

See [`packages/prettier-config`](packages/prettier-config) for details.

## License

[MIT License](LICENSE) © 2023-Present
